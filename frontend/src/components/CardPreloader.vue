<template>
  <div class="hidden">
    <img v-for="img in allCardImages" :key="img" :src="img" />
  </div>
</template>

<script setup>
const suits = ['c', 'o', 'e', 'p'] 
const ranks = ['1', '2', '3', '4', '5', '6', '7', '11', '12', '13']

const allCardImages = []


suits.forEach(suit => {
  ranks.forEach(rank => {
    allCardImages.push(`/cards/${suit}${rank}.png`)
  })
})

// Adiciona o verso da carta e o padrão
allCardImages.push('/cards/semFace.png')
allCardImages.push('/cards/back.png')
allCardImages.push('/pattern.png') 
</script>

<style scoped>
.hidden {
  display: none;
}
</style>