<template>
  <div>
    <h1>Teste de Conexão API</h1>
    <div v-if="metadata">
      <p><strong>Nome da API:</strong> {{ metadata.name }}</p>
      <p><strong>Versão:</strong> {{ metadata.version }}</p>
    </div>
    <div v-else>
      <p>A carregar dados da API...</p>
    </div>
  </div>

  <hr>

  <div>
    <h2>Teste de WebSockets</h2>
    <p><strong>Estado:</strong> {{ socketStatus }}</p>

    <input v-model="message" placeholder="Escreve uma mensagem" />
    <button @click="sendMessage">Enviar Echo</button>

    <p><strong>Mensagem recebida do servidor:</strong> {{ receivedMessage }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted, inject, computed } from 'vue'

// --- Lógica da API (que já tínhamos) ---
const metadata = ref(null)
onMounted(async () => {
  try {
    const response = await fetch('http://localhost:8000/api/metadata', {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    })
    metadata.value = await response.json()
  } catch (error) {
    console.error('Erro API:', error)
  }
})

// --- Lógica dos WebSockets (Nova) ---
const message = ref('')
const receivedMessage = ref('')

// Injeta o socket que fornecemos no main.js 
const socket = inject('socket')

const socketStatus = computed(() => {
  return socket.connected ? 'Conectado' : 'Desconectado' // [cite: 656, 657]
})

// Envia uma mensagem para o evento "echo" [cite: 651, 652]
const sendMessage = () => {
  socket.emit('echo', message.value)
}

// Ouve por mensagens de "echo" vindas do servidor [cite: 659]
socket.on('echo', (msg) => {
  receivedMessage.value = msg
})
</script>

<style>
  hr { margin: 20px 0; }
</style>