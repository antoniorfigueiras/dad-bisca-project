<template>
  <header>
    <nav>
      <RouterLink to="/">Home</RouterLink> | 
      <RouterLink to="/login">Login</RouterLink> |
      <RouterLink to="/about-test">Página de Teste</RouterLink>
    </nav>
  </header>

  <RouterView />
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<style scoped>
/* Estilos básicos para o menu */
header {
  line-height: 1.5;
  border-bottom: 1px solid #ccc;
  padding: 10px;
}
nav {
  width: 100%;
  font-size: 16px;
  text-align: center;
}
</style>