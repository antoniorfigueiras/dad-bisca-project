<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm">
      <div>
        <h1 class="text-2xl font-bold">Mesa da Bisca</h1>
        <p class="text-sm text-muted-foreground">Modo Single Player vs Bot</p>
        <div class="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold"
          :class="gameStore.currentTurn === 'player' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'">
          <span class="h-2 w-2 rounded-full" :class="gameStore.currentTurn === 'player' ? 'bg-green-500' : 'bg-orange-500'"></span>
          {{ gameStore.currentTurn === 'player' ? 'A Tua Vez' : 'Vez do Bot...' }}
        </div>
      </div>
      
      <div v-if="gameStore.trumpSuit" class="flex flex-col items-center gap-2 rounded-md bg-slate-50 px-6 py-2 border">
        <p class="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Trunfo</p>
        <div class="relative h-24 w-16 shadow-md rounded-sm overflow-hidden bg-white">
          <img 
            :src="getCardImagePath(gameStore.trumpCard)" 
            :alt="gameStore.trumpSuit" 
            class="h-full w-full object-contain"
          />
        </div>
      </div>
    </div>

    <div class="grid gap-6 md:grid-cols-2">
      
      <Card class="md:col-span-2 bg-green-50 border-green-200 min-h-[240px] flex items-center justify-center relative shadow-inner">
         <div v-if="gameStore.table.length === 0" class="text-muted-foreground opacity-40 font-semibold select-none">
          A mesa está vazia
        </div>

        <div class="flex gap-12">
          <div 
            v-for="card in gameStore.table" 
            :key="card.id" 
            class="relative flex flex-col items-center animate-in fade-in zoom-in duration-300"
          >
            <span class="mb-2 text-xs font-bold uppercase bg-white/90 px-3 py-1 rounded-full text-slate-700 shadow-sm">
              {{ card.playedBy === 'player' ? 'Tu' : 'Bot' }}
            </span>
            <img 
              :src="getCardImagePath(card)" 
              class="h-48 w-auto object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </Card>

      <Card class="md:col-span-2 bg-slate-50/50 border-dashed">
        <CardHeader>
          <CardTitle class="flex items-center justify-between">
            <span>A Minha Mão</span>
            <span class="text-sm font-normal bg-white px-3 py-1 rounded-full border shadow-sm">
              Pontos na mão: {{ gameStore.playerScore }}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="flex flex-wrap gap-4 justify-center min-h-[160px]">
            
            <div 
              v-for="card in gameStore.playerHand" 
              :key="card.id" 
              @click="gameStore.playCard(card)"
              :class="[
                'relative group transition-all duration-200 select-none',
                gameStore.currentTurn === 'player' 
                  ? 'cursor-pointer hover:-translate-y-6' 
                  : 'cursor-not-allowed opacity-60 grayscale-[0.8]'
              ]"
            >
              <img 
                :src="getCardImagePath(card)" 
                :alt="`${card.rank} de ${card.suit}`"
                class="h-40 w-auto object-contain drop-shadow-md transition-all"
                :class="{ 'group-hover:drop-shadow-xl': gameStore.currentTurn === 'player' }"
              />
            </div>

          </div>
        </CardContent>
      </Card>

    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useGameStore } from '@/stores/game'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

const gameStore = useGameStore()

const getCardImagePath = (card) => {
  if (!card) return '/cards/semFace.png'

  const suitMap = {
    'Copas': 'c',
    'Ouros': 'o',
    'Espadas': 'e',
    'Paus': 'p'
  }

  const rankMap = {
    'A': '1',
    '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7',
    'Q': '12', 
    'J': '11', 
    'K': '13'  
  }

  const prefix = suitMap[card.suit]
  const number = rankMap[card.rank]

  return `/cards/${prefix}${number}.png`
}

onMounted(() => {
  // Se a mão estiver vazia, inicia um jogo novo
  if (gameStore.playerHand.length === 0) {
    gameStore.setupGame()
  }
})
</script>