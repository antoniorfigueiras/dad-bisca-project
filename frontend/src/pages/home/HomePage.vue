<template>
  <div class="flex min-h-[80vh] items-center justify-center bg-slate-50 p-4">
    <Card class="w-full max-w-md shadow-lg">
      <CardHeader class="space-y-1">
        <CardTitle class="text-2xl font-bold text-center">Jogo da Bisca</CardTitle>
        <CardDescription class="text-center">
          Testa a tua perícia contra o nosso bot.
        </CardDescription>
      </CardHeader>

      <CardContent class="grid gap-4 pt-4">
        <div class="grid gap-2">
          <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Escolhe o Tipo de Jogo
          </label>
          
          <div class="grid gap-2">
            <Button
              v-for="variant in gameStore.variants"
              :key="variant.value"
              @click="gameStore.selectedVariant = variant.value"
              variant="outline"
              class="h-auto justify-start px-4 py-3"
              :class="{ 'border-slate-900 bg-slate-50 ring-1 ring-slate-900': gameStore.selectedVariant === variant.value }"
            >
              <span class="mr-4 text-2xl">
                {{ variant.value === '3' ? '🃏' : '🎴' }}
              </span>
              <div class="flex flex-col items-start text-left">
                <span class="font-semibold">{{ variant.label }}</span>
                <span class="text-xs text-muted-foreground font-normal">
                  {{ variant.description }}
                </span>
              </div>
              <div v-if="gameStore.selectedVariant === variant.value" class="ml-auto text-slate-900 font-bold">
                ✓
              </div>
            </Button>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button class="w-full text-lg h-12 mt-2" @click="startGame">
          Iniciar Jogo Single-Player
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'

// Importar os componentes do Shadcn (verifica se os caminhos existem)
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
  // 1. Força o início de um novo jogo com a variante selecionada (3 ou 9)
  gameStore.setupGame() 
  
  // 2. Navega para a mesa de jogo
  router.push('/game/singleplayer')
}
</script>