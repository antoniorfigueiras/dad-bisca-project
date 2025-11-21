<template>
  <div class="flex min-h-[80vh] items-center justify-center bg-slate-50 p-4">
    
    <div class="grid gap-8 md:grid-cols-2 w-full max-w-5xl">

      <Card class="w-full shadow-lg hover:shadow-xl transition-shadow border-primary/20">
        <CardHeader class="space-y-1">
          <div class="flex justify-center mb-2 text-4xl">🤖</div>
          <CardTitle class="text-2xl font-bold text-center">Single Player</CardTitle>
          <CardDescription class="text-center">
            Treina as tuas habilidades contra o Bot.
          </CardDescription>
        </CardHeader>

        <CardContent class="grid gap-4 pt-4">
          <div class="grid gap-2">
            <label class="text-sm font-medium text-muted-foreground text-center">
              Escolhe o Tipo de Jogo
            </label>
            
            <div class="grid gap-3">
              <Button
                v-for="variant in gameStore.variants"
                :key="variant.value"
                @click="gameStore.selectedVariant = variant.value"
                variant="outline"
                class="h-auto justify-start px-4 py-4 transition-all"
                :class="{ 
                  'border-primary bg-primary/5 ring-1 ring-primary shadow-sm': gameStore.selectedVariant === variant.value,
                  'hover:bg-slate-50': gameStore.selectedVariant !== variant.value
                }"
              >
                <span class="mr-4 text-2xl">
                  {{ variant.value === '3' ? '🃏' : '🎴' }}
                </span>
                <div class="flex flex-col items-start text-left">
                  <span class="font-bold text-base">{{ variant.label }}</span>
                  <span class="text-xs text-muted-foreground font-normal">
                    {{ variant.description }}
                  </span>
                </div>
                <div v-if="gameStore.selectedVariant === variant.value" class="ml-auto text-primary font-bold text-xl">
                  ✓
                </div>
              </Button>
            </div>
          </div>
        </CardContent>

        <CardFooter class="pt-2">
          <Button class="w-full text-lg h-12 font-bold shadow-md" @click="startGame">
            Iniciar Jogo
          </Button>
        </CardFooter>
      </Card>

      <Card class="w-full shadow-sm border-2 bg-slate-50/50 opacity-90">
        <CardHeader class="space-y-1">
          <div class="flex justify-center mb-2 text-4xl grayscale opacity-70">🌍</div>
          <CardTitle class="text-2xl font-bold text-center text-slate-600">Multiplayer</CardTitle>
          <CardDescription class="text-center">
            Desafia amigos ou jogadores online.
          </CardDescription>
        </CardHeader>
        
        <CardContent class="flex flex-col items-center justify-center h-64 gap-6">
           <div class="relative flex items-center justify-center h-24 w-24 rounded-full bg-slate-100 border-4 border-white shadow-inner">
             <span class="text-4xl">⌛</span>
           </div>
           
           <div class="text-center space-y-1">
             <p class="font-medium text-slate-800">Em Desenvolvimento</p>
             <p class="text-sm text-muted-foreground max-w-[200px]">
               Em breve.
             </p>
           </div>
        </CardContent>

        <CardFooter>
          <Button disabled class="w-full text-lg h-12 bg-slate-200 text-slate-400 cursor-not-allowed hover:bg-slate-200">
            Brevemente...
          </Button>
        </CardFooter>
      </Card>

    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'

// Importar componentes do Shadcn
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const router = useRouter()
const gameStore = useGameStore()

const startGame = () => {
  gameStore.setupGame()
  router.push('/game/singleplayer')
}
</script>