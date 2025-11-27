<template>
  <div class="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800">
    <header
      class="bg-white border-b border-slate-200 px-6 py-3 shadow-sm flex items-center justify-between z-20 relative"
    >
      <!-- --- CABEÇALHO DO JOGO --- -->
      <div class="flex items-center gap-4">
        <div class="bg-slate-900 text-white p-2 rounded-lg shadow-md">
          <span class="text-xl">♠</span>
        </div>
        <div>
          <h1 class="text-lg font-bold leading-none">Mesa da Bisca</h1>
          <span class="text-xs text-slate-500 font-medium"
            >Single Player • {{ gameStore.selectedVariant }} Cartas</span
          >
        </div>
      </div>

      <div class="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
        <div
          class="flex items-center gap-3 px-4 py-1.5 rounded-full border shadow-sm transition-all duration-300"
          :class="getTurnColorClass()"
        >
          <span class="relative flex h-3 w-3">
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              :class="gameStore.currentTurn === 'player' ? 'bg-green-400' : 'bg-orange-400'"
            ></span>
            <span
              class="relative inline-flex rounded-full h-3 w-3"
              :class="gameStore.currentTurn === 'player' ? 'bg-green-500' : 'bg-orange-500'"
            ></span>
          </span>
          <span class="text-sm font-bold tracking-wide">{{ getTurnText() }}</span>
        </div>
      </div>

      <div class="flex items-center gap-6 bg-slate-50 px-4 py-1 rounded-lg border">
        <div class="text-center opacity-70">
          <span class="block text-[10px] uppercase font-bold text-slate-400">Bot</span>
          <span class="text-xl font-mono font-black text-slate-600">{{ gameStore.botScore }}</span>
        </div>
        <span class="text-slate-300 font-bold text-xs">VS</span>
        <div class="text-center">
          <span class="block text-[10px] uppercase font-bold text-green-600/70">Tu</span>
          <span class="text-xl font-mono font-black text-green-600">{{
            gameStore.playerScore
          }}</span>
        </div>
      </div>
    </header>

    <!-- --- MENSAGENS DE JOGO --- -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform -translate-y-10 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-10 opacity-0"
    >
      <div
        v-if="gameStore.gameMessage"
        class="fixed top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
      >
        <div
          class="bg-slate-900/90 backdrop-blur text-white px-8 py-3 rounded-2xl shadow-2xl font-bold text-sm border border-white/10 flex items-center gap-2"
        >
          <span>📢</span> {{ gameStore.gameMessage }}
        </div>
      </div>
    </Transition>

    <!-- --- ÁREA PRINCIPAL DO JOGO --- -->
    <main class="flex-1 relative overflow-hidden flex flex-col items-center justify-center p-4">
      <div
        class="w-full max-w-7xl aspect-[16/9] bg-green-900 rounded-[3rem] border-8 border-[#3f2e22] shadow-2xl relative overflow-hidden isolate flex"
      >
        <div
          class="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1a5d3a_0%,_#0f3923_100%)] z-[-1]"
        ></div>
        <div
          class="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/felt.png')] z-[-1] pointer-events-none"
        ></div>

        <div class="w-full h-full grid grid-cols-12">
          <div class="col-span-9 flex flex-col justify-between h-full py-8 px-8 relative">
            <!-- --- MÃO DO BOT (CARTAS VIRADAS PARA BAIXO) --- -->
            <div class="flex justify-center">
              <div class="flex -space-x-8">
                <div
                  v-for="(card, index) in gameStore.botHand"
                  :key="card.id"
                  class="w-16 h-24 md:w-20 md:h-28 rounded-lg shadow-lg border-2 border-white bg-blue-900 relative transition-transform duration-500"
                  :style="{ transform: `translateY(${index % 2 === 0 ? '0px' : '4px'})` }"
                >
                  <div
                    class="w-full h-full opacity-40 bg-[url('/pattern.png')] bg-repeat bg-[length:12px_12px] rounded-md"
                  ></div>
                </div>
                <div
                  v-if="gameStore.botHand.length === 0"
                  class="w-20 h-28 border-2 border-white/10 rounded-lg flex items-center justify-center"
                >
                  <span class="text-white/20 text-xs">0 cartas</span>
                </div>
              </div>
            </div>

            <div
              class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10"
            >
              <span class="text-9xl text-white">♠</span>
            </div>

            <!-- --- MÃO DO JOGADOR (CARTAS VISÍVEIS) --- -->
            <div class="flex justify-center w-full px-4 mb-2">
              <div
                class="flex -space-x-10 md:-space-x-12 hover:space-x-[-2rem] transition-all duration-500 ease-out py-4"
              >
                <div
                  v-for="(card, index) in gameStore.playerHand"
                  :key="card.id"
                  @click="gameStore.playCard(card)"
                  class="relative transition-all duration-300 ease-out transform origin-bottom hover:-translate-y-10 hover:scale-110 hover:z-20 hover:rotate-0"
                  :style="{
                    zIndex: index,
                    transform: `rotate(${(index - (gameStore.playerHand.length - 1) / 2) * 3}deg)`,
                  }"
                  :class="
                    gameStore.currentTurn === 'player'
                      ? 'cursor-pointer'
                      : 'cursor-not-allowed opacity-80 brightness-75'
                  "
                >
                  <img
                    :src="getCardImagePath(card)"
                    :alt="`${card.rank} de ${card.suit}`"
                    class="h-32 md:h-48 w-auto object-contain rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3)] bg-white border border-slate-200"
                  />
                </div>
              </div>
            </div>
          </div>

          <div
            class="col-span-3 border-l border-white/10 bg-black/10 backdrop-blur-sm flex flex-col items-center py-8 gap-12"
          >
            <!-- --- MONTE E TRUNFO --- -->
            <div class="relative w-24 h-32 flex items-center justify-center">
              <div
                v-if="gameStore.trumpCard && gameStore.deck.length > 0"
                class="absolute inset-0 flex items-center justify-center z-0 transform -translate-x-12 rotate-90 transition-transform duration-500"
              >
                <img
                  :src="getCardImagePath(gameStore.trumpCard)"
                  class="w-20 h-auto rounded-lg shadow-md brightness-90 border-2 border-white"
                />
              </div>

              <div
                v-if="gameStore.deck.length > 0"
                class="relative z-10 w-full h-full bg-blue-900 border-2 border-white rounded-lg shadow-xl flex items-center justify-center"
              >
                <div
                  class="w-full h-full opacity-40 bg-[url('/pattern.png')] bg-repeat bg-[length:12px_12px] rounded-md"
                ></div>
                <div class="absolute inset-0 flex items-center justify-center">
                  <span
                    class="bg-slate-900 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-lg border border-white/20"
                  >
                    {{ gameStore.deck.length }}
                  </span>
                </div>
              </div>
              <div
                v-else
                class="w-full h-full border-2 border-dashed border-white/20 rounded-lg flex items-center justify-center z-10 bg-green-900/50"
              >
                <span class="text-[10px] text-white/30 font-bold uppercase">Fim</span>
              </div>
            </div>

            <!-- --- CARTAS NA MESA --- -->
            <div class="flex-1 w-full flex flex-col items-center justify-center gap-4 relative">
              <div
                v-if="gameStore.table.length === 0"
                class="absolute text-white/20 text-sm font-bold uppercase tracking-widest border-2 border-dashed border-white/20 p-4 rounded-lg"
              >
                Mesa Vazia
              </div>

              <div class="h-40 w-32 flex items-center justify-center">
                <Transition name="pop">
                  <div v-if="getPlayedCard('bot')" class="relative">
                    <span
                      class="absolute -left-12 top-1/2 -translate-y-1/2 text-[10px] font-bold bg-orange-500 text-white px-2 py-1 rounded-r shadow-sm"
                    >
                      BOT
                    </span>
                    <img
                      :src="getCardImagePath(getPlayedCard('bot'))"
                      class="h-36 w-auto object-contain rounded-lg shadow-2xl border border-black/10"
                    />
                  </div>
                </Transition>
              </div>

              <div v-if="gameStore.table.length > 0" class="w-full h-px bg-white/10"></div>

              <div class="h-40 w-32 flex items-center justify-center">
                <Transition name="pop">
                  <div v-if="getPlayedCard('player')" class="relative">
                    <span
                      class="absolute -left-10 top-1/2 -translate-y-1/2 text-[10px] font-bold bg-green-600 text-white px-2 py-1 rounded-r shadow-sm"
                    >
                      TU
                    </span>
                    <img
                      :src="getCardImagePath(getPlayedCard('player'))"
                      class="h-36 w-auto object-contain rounded-lg shadow-2xl border border-black/10"
                    />
                  </div>
                </Transition>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- --- ECRA DE FIM DE JOGO --- -->
    <Transition name="fade">
      <div
        v-if="gameStore.currentTurn === 'finished'"
        class="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <div
          class="w-full max-w-md bg-white rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden transform transition-all scale-100"
        >
          <div
            class="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-green-400 to-blue-500"
          ></div>

          <h2 class="text-4xl font-black mb-2 text-slate-800 tracking-tight mt-4">Fim de Jogo</h2>
          <p
            class="text-xl mb-8 font-medium"
            :class="gameStore.playerScore > gameStore.botScore ? 'text-green-600' : 'text-red-500'"
          >
            {{
              gameStore.playerScore > gameStore.botScore
                ? 'Vitória! Parabéns! 🏆'
                : 'Derrota... Tenta de novo! 🥀'
            }}
          </p>

          <div
            class="grid grid-cols-2 gap-4 mb-8 bg-slate-50 p-6 rounded-2xl border border-slate-100"
          >
            <div class="flex flex-col">
              <span class="text-[10px] uppercase text-slate-400 font-bold mb-1 tracking-widest"
                >A tua pontuação</span
              >
              <span class="text-4xl font-black text-slate-700">{{ gameStore.playerScore }}</span>
            </div>
            <div class="flex flex-col border-l border-slate-200">
              <span class="text-[10px] uppercase text-slate-400 font-bold mb-1 tracking-widest"
                >Bot</span
              >
              <span class="text-4xl font-black text-slate-700">{{ gameStore.botScore }}</span>
            </div>
          </div>

          <div class="flex flex-col gap-3">
            <button
              @click="gameStore.setupGame()"
              class="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2"
            >
              <span>🔄</span> Jogar Novamente
            </button>
            <button
              @click="router.push('/')"
              class="w-full py-3.5 bg-white border-2 border-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-50 hover:text-slate-900 transition-colors"
            >
              Sair para o Menu
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'

const gameStore = useGameStore()
const router = useRouter()

// --- UI HELPERS: Classes Dinâmicas e Texto ---

// Define a cor do indicador de turno baseado no estado atual
const getTurnColorClass = () => {
  switch (gameStore.currentTurn) {
    case 'player':
      return 'bg-green-50 text-green-700 border-green-200 ring-2 ring-green-100'
    case 'bot':
      return 'bg-orange-50 text-orange-700 border-orange-200'
    case 'resolving':
      return 'bg-blue-50 text-blue-700 border-blue-200'
    default:
      return 'bg-slate-100 text-slate-700'
  }
}

// Texto descritivo para o indicador de turno
const getTurnText = () => {
  switch (gameStore.currentTurn) {
    case 'player':
      return 'A Tua Vez'
    case 'bot':
      return 'O Bot está a pensar...'
    case 'resolving':
      return 'A resolver...'
    case 'finished':
      return 'Terminado'
    default:
      return 'Aguarda...'
  }
}

// Helper para encontrar a carta jogada na mesa por um jogador específico ('bot' ou 'player')
const getPlayedCard = (who) => {
  return gameStore.table.find((c) => c.playedBy === who)
}

// --- ASSETS: Gestão de Imagens ---
// Mapeia o objeto Card para o caminho do ficheiro correto na pasta /public/cards/
const getCardImagePath = (card) => {
  if (!card) return '/cards/back.png'
  const suitMap = { Copas: 'c', Ouros: 'o', Espadas: 'e', Paus: 'p' }
  const rankMap = {
    A: '1',
    2: '2',
    3: '3',
    4: '4',
    5: '5',
    6: '6',
    7: '7',
    Q: '12',
    J: '11',
    K: '13',
  }

  const prefix = suitMap[card.suit]
  const number = rankMap[card.rank]

  return `/cards/${prefix}${number}.png`
}

// --- LIFECYCLE HOOKS ---
onMounted(() => {
  // Garante que o jogo arranca se o utilizador fizer refresh na página
  if (gameStore.playerHand.length === 0) {
    gameStore.setupGame()
  }
})
</script>

<style scoped>
/* --- ANIMAÇÕES CSS --- */

/* Pop-in: Efeito de entrada elástica para as cartas na mesa */
.pop-enter-active {
  animation: pop-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.pop-leave-active {
  transition: all 0.3s ease;
}
.pop-leave-to {
  opacity: 0;
  transform: scale(0.5);
}

@keyframes pop-in {
  0% {
    opacity: 0;
    transform: scale(0.5) translateY(20px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Fade: Transição suave para modais e mensagens */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
