<template>
  <div class="grid gap-6 md:grid-cols-2">
    
    <Card>
      <CardHeader>
        <CardTitle>Status da API (Laravel)</CardTitle>
      </CardHeader>
      <CardContent>
        <div v-if="metadata" class="space-y-2">
          <div class="flex justify-between border-b pb-2">
            <span class="font-medium">Nome:</span>
            <span>{{ metadata.name }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium">Versão:</span>
            <span class="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-bold">{{ metadata.version }}</span>
          </div>
        </div>
        <div v-else class="text-muted-foreground italic">
          A carregar dados...
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Status WebSocket (Node.js)</CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="flex items-center gap-2">
          <div 
            class="h-3 w-3 rounded-full"
            :class="socket.connected ? 'bg-green-500' : 'bg-red-500'"
          ></div>
          <span class="font-medium">{{ socketStatus }}</span>
        </div>

        <div class="flex gap-2">
          <Input v-model="message" placeholder="Mensagem de teste..." />
          <Button @click="sendMessage">Enviar Echo</Button>
        </div>
        
        <div v-if="receivedMessage" class="mt-4 rounded bg-slate-100 p-3 text-sm">
          <strong>Servidor respondeu:</strong> {{ receivedMessage }}
        </div>
      </CardContent>
    </Card>

  </div>
</template>

<script setup>
import { ref, onMounted, inject, computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

const metadata = ref(null)
const message = ref('')
const receivedMessage = ref('')
const socket = inject('socket')

const socketStatus = computed(() => socket.connected ? 'Conectado' : 'Desconectado')

const sendMessage = () => {
  if (message.value) socket.emit('echo', message.value)
}

socket.on('echo', (msg) => receivedMessage.value = msg)

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
</script>