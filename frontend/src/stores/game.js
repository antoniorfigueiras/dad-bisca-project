import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Valores das cartas na Bisca
const CARD_VALUES = {
  'A': 11, // Ás
  '7': 10, // Sete/Manilha
  'K': 4,  // Rei
  'J': 3,  // Valete
  'Q': 2,  // Dama
  '6': 0,  // Sem valor
  '5': 0,
  '4': 0,
  '3': 0,
  '2': 0,
}

const SUITS = ['Copas', 'Ouros', 'Paus', 'Espadas']
const RANKS = ['A', '7', 'K', 'J', 'Q', '6', '5', '4', '3', '2']

// Função auxiliar para baralhar
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export const useGameStore = defineStore('game', () => {
  // Variantes do jogo (Bisca de 3 ou 9)
  const variants = ref([
    { value: '3', label: 'Bisca de 3', description: '3 cartas na mão' },
    { value: '9', label: 'Bisca de 9', description: '9 cartas na mão' }
  ])
  const selectedVariant = ref('9') // Começa com Bisca de 9 por defeito

  // --- Estado do Jogo ---
  const deck = ref([])         // O monte de cartas
  const playerHand = ref([])   // A mão do jogador
  const botHand = ref([])      // A mão do adversário (Bot)
  const trumpSuit = ref(null)  // O naipe do trunfo
  const trumpCard = ref(null)  // A carta de trunfo visível no fundo

  // Calcula a pontuação atual na mão do jogador (apenas para debug)
  const playerScore = computed(() => {
    return playerHand.value.reduce((total, card) => total + CARD_VALUES[card.rank], 0)
  })

  // --- AÇÃO: Iniciar o Jogo ---
  const setupGame = () => {
    // 1. Criar o baralho de 40 cartas
    let initialDeck = []
    let id = 0
    for (const suit of SUITS) {
      for (const rank of RANKS) {
        // Cria cada carta com ID único, naipe, valor e pontos
        initialDeck.push({ id: id++, suit, rank, points: CARD_VALUES[rank] })
      }
    }

    // 2. Baralhar
    shuffle(initialDeck)
    deck.value = initialDeck

    // 3. Definir o Trunfo (tira a última carta)
    const trunfo = deck.value.pop()
    trumpSuit.value = trunfo.suit
    trumpCard.value = trunfo 
    
    // Coloca o trunfo no início do array (fundo do baralho visual)
    deck.value.unshift(trunfo)
    
    // 4. Distribuir as cartas (3 ou 9 conforme a variante)
    const numCardsToDeal = parseInt(selectedVariant.value)
    
    // Splice remove as cartas do baralho e move para as mãos
    playerHand.value = deck.value.splice(deck.value.length - numCardsToDeal, numCardsToDeal)
    botHand.value = deck.value.splice(deck.value.length - numCardsToDeal, numCardsToDeal)
    
    console.log(`Jogo iniciado: Bisca de ${numCardsToDeal}`)
    console.log('Trunfo:', trumpSuit.value)
    console.log('Mão do Jogador:', playerHand.value)
  }

  return {
    variants,
    selectedVariant,
    deck,
    playerHand,
    botHand,
    trumpSuit,
    trumpCard,
    playerScore,
    setupGame
  }
})