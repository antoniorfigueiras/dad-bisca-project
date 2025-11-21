<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm">
      <div>
        <h1 class="text-2xl font-bold">Mesa de Jogo</h1>
        <p class="text-sm text-muted-foreground">Modo Single Player vs Bot</p>
      </div>
      
      <div v-if="gameStore.trumpSuit" class="flex flex-col items-center gap-2 rounded-md bg-slate-50 px-6 py-2 border">
        <p class="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Trunfo</p>
        <div class="relative h-24 w-16 shadow-md rounded-sm overflow-hidden">
          <img 
            :src="getCardImagePath(gameStore.trumpCard)" 
            :alt="gameStore.trumpSuit"
            class="h-full w-full object-contain"
          />
        </div>
      </div>
    </div>

    <div class="grid gap-6 md:grid-cols-2">
      
      <Card class="md:col-span-2 bg-slate-50/50 border-dashed">
        <CardHeader>
          <CardTitle class="flex items-center justify-between">
            <span>A Minha Mão</span>
            <span class="text-sm font-normal bg-white px-3 py-1 rounded-full border shadow-sm">
              Pontos: {{ gameStore.playerScore }}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="flex flex-wrap gap-4 justify-center">
            <div 
              v-for="card in gameStore.playerHand" 
              :key="card.id" 
              class="relative group cursor-pointer transition-transform hover:-translate-y-4"
            >
              <img 
                :src="getCardImagePath(card)" 
                :alt="`${card.rank} de ${card.suit}`"
                class="h-40 w-auto object-contain drop-shadow-md group-hover:drop-shadow-xl"
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
    'Q': '12', // Dama
    'J': '11', // Valete
    'K': '13'  // Rei
  }

  const prefix = suitMap[card.suit]
  const number = rankMap[card.rank]

  // Retorna o caminho: ex: /cards/c1.png
  return `/cards/${prefix}${number}.png`
}

onMounted(() => {
  if (gameStore.playerHand.length === 0) {
    gameStore.setupGame()
  }
})
</script>