import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

const CARD_VALUES = {
  'A': 11, '7': 10, 'K': 4, 'J': 3, 'Q': 2,
  '6': 0, '5': 0, '4': 0, '3': 0, '2': 0,
}
const SUITS = ['Copas', 'Ouros', 'Paus', 'Espadas']
const RANKS = ['A', '7', 'K', 'J', 'Q', '6', '5', '4', '3', '2']

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export const useGameStore = defineStore('game', () => {
  // Variantes
  const variants = ref([
    { value: '3', label: 'Bisca de 3', description: '3 cartas na mão' },
    { value: '9', label: 'Bisca de 9', description: '9 cartas na mão' }
  ])
  
  // Persistência da variante
  const savedVariant = localStorage.getItem('bisca_variant')
  const selectedVariant = ref(savedVariant || '9')

  watch(selectedVariant, (newVal) => {
    localStorage.setItem('bisca_variant', newVal)
  })

  // --- Estado do Jogo ---
  const deck = ref([])
  const playerHand = ref([])
  const botHand = ref([])
  const table = ref([])
  const trumpSuit = ref(null)
  const trumpCard = ref(null)
  
  // Turno: 'player' ou 'bot'
  const currentTurn = ref('player')

  const playerScore = computed(() => {
    return playerHand.value.reduce((total, card) => total + CARD_VALUES[card.rank], 0)
  })

  // --- Setup ---
  const setupGame = () => {
    let initialDeck = []
    let id = 0
    for (const suit of SUITS) {
      for (const rank of RANKS) {
        initialDeck.push({ id: id++, suit, rank, points: CARD_VALUES[rank] })
      }
    }
    shuffle(initialDeck)
    deck.value = initialDeck

    const trunfo = deck.value.pop()
    trumpSuit.value = trunfo.suit
    trumpCard.value = trunfo 
    deck.value.unshift(trunfo)
    
    const numCardsToDeal = parseInt(selectedVariant.value)
    
    playerHand.value = deck.value.splice(deck.value.length - numCardsToDeal, numCardsToDeal)
    botHand.value = deck.value.splice(deck.value.length - numCardsToDeal, numCardsToDeal)
    
    table.value = []
    currentTurn.value = 'player'
    console.log(`Jogo iniciado. Trunfo: ${trumpSuit.value}`)
  }

  // --- TURNO DO JOGADOR ---
  const playCard = (card) => {
    // Validação de Turno
    if (currentTurn.value !== 'player') return 

    const index = playerHand.value.findIndex(c => c.id === card.id)
    
    if (index !== -1) {
      // REMOVER DA MÃO DO JOGADOR
      playerHand.value.splice(index, 1)
      
      // Adicionar à Mesa
      table.value.push({ ...card, playedBy: 'player' })
      
      // Passar a vez
      currentTurn.value = 'bot'
      
      // O Bot joga após 1 segundo
      setTimeout(botPlay, 1000)
    }
  }

  // --- TURNO DO BOT ---
  const botPlay = () => {
    if (botHand.value.length === 0) return

    // Joga a primeira carta
    const cardToPlay = botHand.value[0]
    
    // Remove da mão do bot
    botHand.value.splice(0, 1)

    // Adiciona à mesa
    table.value.push({ ...cardToPlay, playedBy: 'bot' })

    // Devolve a vez ao jogador
    currentTurn.value = 'player'
  }

  return {
    variants,
    selectedVariant,
    deck,
    playerHand,
    botHand,
    table,
    trumpSuit,
    trumpCard,
    playerScore,
    currentTurn,
    setupGame,
    playCard
  }
})