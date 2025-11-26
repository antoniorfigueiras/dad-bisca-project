import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

// --- CONSTANTES E REGRAS ---

const SUITS = ['Copas', 'Ouros', 'Paus', 'Espadas']
const RANKS = ['A', '7', 'K', 'J', 'Q', '6', '5', '4', '3', '2']

// Pontos (Total = 120) 
const CARD_POINTS = {
  'A': 11, '7': 10, 'K': 4, 'J': 3, 'Q': 2,
  '6': 0, '5': 0, '4': 0, '3': 0, '2': 0,
}

// Força para ganhar a vaza (A > 7 > K > J > Q > Resto)
const CARD_HIERARCHY = {
  'A': 10, '7': 9, 'K': 8, 'J': 7, 'Q': 6,
  '6': 5, '5': 4, '4': 3, '3': 2, '2': 1,
}

// --- FUNÇÕES AUXILIARES (LÓGICA PURA) ---

const shuffleDeck = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array
}

const calculateScore = (pile) => pile.reduce((total, card) => total + card.points, 0)

// Determina o vencedor de uma vaza de 2 cartas [cite: 462-464]
const determineTrickWinner = (c1, c2, trumpSuit) => {
  const isTrump1 = c1.suit === trumpSuit
  const isTrump2 = c2.suit === trumpSuit

  // 1. Um deles é trunfo?
  if (isTrump1 && !isTrump2) return c1.playedBy
  if (!isTrump1 && isTrump2) return c2.playedBy

  // 2. São do mesmo naipe?
  if (c1.suit === c2.suit) {
    const rank1 = CARD_HIERARCHY[c1.rank]
    const rank2 = CARD_HIERARCHY[c2.rank]
    return rank1 > rank2 ? c1.playedBy : c2.playedBy
  }

  // 3. Naipes diferentes e nenhum é trunfo -> ganha quem jogou primeiro (c1)
  return c1.playedBy
}

// --- STORE PINIA ---

export const useGameStore = defineStore('game', () => {

  // --- STATE: CONFIGURAÇÃO ---
  const variants = [
    { value: '3', label: 'Bisca de 3', description: '3 cartas na mão' },
    { value: '9', label: 'Bisca de 9', description: '9 cartas na mão' }
  ]
  const selectedVariant = ref(localStorage.getItem('bisca_variant') || '9')

  // --- STATE: JOGO ---
  const deck = ref([])
  const playerHand = ref([])
  const botHand = ref([])
  const table = ref([])

  const trumpSuit = ref(null)
  const trumpCard = ref(null)

  const playerPile = ref([])
  const botPile = ref([])

  const currentTurn = ref('player')
  const gameMessage = ref('')
  const lastTrickWinner = ref(null)

  // Resultado estruturado do jogo (null enquanto joga)
  const gameResult = ref(null)

  // --- COMPUTEDS ---
  const playerScore = computed(() => calculateScore(playerPile.value))
  const botScore = computed(() => calculateScore(botPile.value))
  const isFinalPhase = computed(() => deck.value.length === 0)

  // --- WATCHERS ---
  watch(selectedVariant, (newVal) => {
    localStorage.setItem('bisca_variant', newVal)
  })

  // --- REGRAS E VALIDAÇÃO ---

  const canPlayCard = (card, hand, isBot = false) => {
    // Se ainda há baralho ou se é o primeiro a jogar na vaza (mesa vazia)
    if (!isFinalPhase.value) return true
    if (table.value.length === 0) return true

    const leadCard = table.value[0]
    const hasSuit = hand.some(c => c.suit === leadCard.suit)

    // Regra de Assistir: Se tem o naipe da carta de saída, OBRIGATÓRIO jogar esse naipe
    if (hasSuit && card.suit !== leadCard.suit) {
      if (!isBot) gameMessage.value = `Tens de assistir a ${leadCard.suit}!`
      return false
    }
    return true
  }

  // --- LÓGICA DO BOT  ---

  const getBotCard = () => {
    const validCards = botHand.value.filter(c => canPlayCard(c, botHand.value, true))

    // CENÁRIO 1: Bot joga primeiro (Abertura)
    if (table.value.length === 0) {
      // Joga a carta mais fraca que não seja trunfo
      return validCards.sort((a, b) => {
        const aTrump = a.suit === trumpSuit.value
        const bTrump = b.suit === trumpSuit.value
        if (aTrump && !bTrump) return 1  // Trunfo vai para o fim da lista
        if (!aTrump && bTrump) return -1
        // Ordena por hierarquia (mais fraca primeiro: 2, 3, 4...)
        return CARD_HIERARCHY[a.rank] - CARD_HIERARCHY[b.rank]
      })[0]
    }

    // CENÁRIO 2: Bot joga em segundo (Resposta)
    const enemyCard = table.value[0]

    // Tenta encontrar cartas que ganham a vaza
    const winningCards = validCards.filter(c => {
      if (c.suit === trumpSuit.value && enemyCard.suit !== trumpSuit.value) return true
      if (c.suit === enemyCard.suit && CARD_HIERARCHY[c.rank] > CARD_HIERARCHY[enemyCard.rank]) return true
      return false
    })

    // Se pode ganhar, joga a carta mais baixa que garante a vitória
    if (winningCards.length > 0) {
      return winningCards.sort((a, b) => CARD_HIERARCHY[a.rank] - CARD_HIERARCHY[b.rank])[0]
    }

    // Se vai perder, descarta a carta de menor valor ("lowest-value")
    return validCards.sort((a, b) => {
        // 1. Critério principal: Pontos (não dar pontos ao adversário)
        if (a.points !== b.points) return a.points - b.points
        // 2. Critério desempate: Hierarquia (jogar um 2 em vez de um 6)
        return CARD_HIERARCHY[a.rank] - CARD_HIERARCHY[b.rank]
    })[0]
  }

  // --- CÁLCULO DE FIM DE JOGO (MARCAS) ---

  const processEndGame = () => {
      currentTurn.value = 'finished'

      const pScore = playerScore.value
      const bScore = botScore.value

      let winner = null
      let marks = 0
      let type = 'Empate'

      if (pScore !== bScore) {
          winner = pScore > bScore ? 'player' : 'bot'
          const winningScore = pScore > bScore ? pScore : bScore

          // Regras de Pontuação de Partida
          if (winningScore === 120) {
              marks = 4
              type = 'BANDEIRA (120!)'
          } else if (winningScore > 90) {
              marks = 2
              type = 'CAPOTE'
          } else {
              marks = 1
              type = 'Vitória Simples'
          }
      }

      gameResult.value = { winner, marks, type, pScore, bScore }

      // Mensagem para a UI
      if (!winner) {
          gameMessage.value = `Empate! (${pScore} - ${bScore})`
      } else {
          const winText = winner === 'player' ? 'Ganhaste' : 'Perdeste'
          gameMessage.value = `${winText}! ${type} - ${marks} ${marks === 1 ? 'marca' : 'marcas'}.`
      }
  }

  // --- AÇÕES DO JOGO ---

  const setupGame = () => {
    let initialDeck = []
    let id = 0
    for (const suit of SUITS) {
      for (const rank of RANKS) {
        initialDeck.push({ id: id++, suit, rank, points: CARD_POINTS[rank] })
      }
    }

    deck.value = shuffleDeck(initialDeck)

    // Reset total
    playerPile.value = []
    botPile.value = []
    table.value = []
    gameMessage.value = ''
    lastTrickWinner.value = null
    gameResult.value = null // Limpar resultado anterior

    // Definir quem começa (Random Dealer rule)
    const isPlayerDealer = Math.random() < 0.5
    currentTurn.value = isPlayerDealer ? 'bot' : 'player'

    // Trunfo
    const trunfo = deck.value.pop()
    trumpSuit.value = trunfo.suit
    trumpCard.value = trunfo
    deck.value.unshift(trunfo)

    // Distribuir
    const numCards = parseInt(selectedVariant.value)
    playerHand.value = deck.value.splice(deck.value.length - numCards, numCards)
    botHand.value = deck.value.splice(deck.value.length - numCards, numCards)

    // Se o bot começa, agendar jogada inicial
    if (currentTurn.value === 'bot') {
        setTimeout(() => botPlay(), 1000)
    }
  }

  const drawCards = (winner) => {
    if (deck.value.length === 0) return

    const card1 = deck.value.pop()
    if (winner === 'player') playerHand.value.push(card1)
    else botHand.value.push(card1)

    if (deck.value.length > 0) {
      const card2 = deck.value.pop()
      if (winner === 'player') botHand.value.push(card2)
      else playerHand.value.push(card2)
    }
  }

  const finalizeTrick = (winner) => {
    // Atribuir cartas
    if (winner === 'player') playerPile.value.push(...table.value)
    else botPile.value.push(...table.value)

    table.value = []
    lastTrickWinner.value = null
    gameMessage.value = ''

    // Verificar Fim de Jogo (Mãos vazias E baralho vazio)
    if (playerHand.value.length === 0 && deck.value.length === 0) {
      processEndGame()
      return
    }

    drawCards(winner)
    currentTurn.value = winner

    if (winner === 'bot') {
      setTimeout(() => botPlay(), 1500)
    }
  }

  const resolveTrick = () => {
    if (table.value.length < 2) return

    const c1 = table.value[0]
    const c2 = table.value[1]

    const winner = determineTrickWinner(c1, c2, trumpSuit.value)

    lastTrickWinner.value = winner
    gameMessage.value = winner === 'player' ? 'Ganhaste a vaza!' : 'O Bot ganhou a vaza.'
    currentTurn.value = 'resolving'

    setTimeout(() => {
      finalizeTrick(winner)
    }, 2000)
  }

  const playCard = (card) => {
    if (currentTurn.value !== 'player') return
    if (!canPlayCard(card, playerHand.value)) return

    gameMessage.value = ''

    const index = playerHand.value.findIndex(c => c.id === card.id)
    if (index !== -1) {
      playerHand.value.splice(index, 1)
      table.value.push({ ...card, playedBy: 'player' })

      if (table.value.length === 2) {
        currentTurn.value = 'resolving'
        setTimeout(() => resolveTrick(), 1000)
      } else {
        currentTurn.value = 'bot'
        setTimeout(() => botPlay(), 1000)
      }
    }
  }

  const botPlay = () => {
    if (currentTurn.value !== 'bot' && currentTurn.value !== 'resolving') return
    if (botHand.value.length === 0) return

    const cardToPlay = getBotCard()

    const index = botHand.value.findIndex(c => c.id === cardToPlay.id)
    botHand.value.splice(index, 1)
    table.value.push({ ...cardToPlay, playedBy: 'bot' })

    if (table.value.length === 2) {
      currentTurn.value = 'resolving'
      setTimeout(() => resolveTrick(), 1000)
    } else {
      currentTurn.value = 'player'
    }
  }

  return {
    // State
    variants, selectedVariant,
    deck, playerHand, botHand, table,
    trumpSuit, trumpCard,
    playerPile, botPile,
    currentTurn, gameMessage, lastTrickWinner,
    gameResult, // Novo state exportado

    // Getters
    playerScore, botScore, isFinalPhase,

    // Actions
    setupGame,
    playCard
  }
})
