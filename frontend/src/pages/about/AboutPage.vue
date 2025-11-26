<template>
  <div class="space-y-8">

    <Card class="border-t-4 border-t-blue-600 shadow-sm">
      <CardHeader>
        <CardTitle class="text-xl">Laravel Tester (R1)</CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">

        <div v-if="!authStore.isLoggedIn" class="grid gap-4">
            <div class="space-y-2">
                <label class="text-sm font-medium">Email:</label>
                <Input v-model="credentials.email" type="email" placeholder="pa@mail.pt" />
            </div>
            <div class="space-y-2">
                <label class="text-sm font-medium">Password:</label>
                <Input v-model="credentials.password" type="password" placeholder="123" />
            </div>
            <Button @click="handleLogin" :disabled="isLoading">
                {{ isLoading ? 'A autenticar...' : 'Login' }}
            </Button>
        </div>

        <div v-else class="flex items-center gap-4 bg-green-50 p-4 rounded border border-green-200">
            <span class="text-green-700 font-bold">✅ Autenticado como: {{ authStore.userName }}</span>
            <Button variant="outline" size="sm" @click="testProtectedEndpoint">
                Testar Endpoint Protegido (/users/me)
            </Button>
            <Button variant="destructive" size="sm" @click="authStore.logout()">
                Logout
            </Button>
        </div>

        <div class="space-y-2">
            <label class="text-sm font-medium text-muted-foreground">Response:</label>
            <div class="w-full min-h-[80px] p-3 rounded bg-slate-100 border text-sm font-mono text-slate-700 whitespace-pre-wrap">
                {{ apiResponse || 'Waiting for action...' }}
            </div>
        </div>

      </CardContent>
    </Card>

    <Card class="border-t-4 border-t-orange-500 shadow-sm">
      <CardHeader>
        <CardTitle class="text-xl">Web Socket Tester (R2)</CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">

        <div class="flex items-center gap-2 mb-4">
          <div class="h-3 w-3 rounded-full animate-pulse"
               :class="socket.connected ? 'bg-green-500' : 'bg-red-500'"></div>
          <span class="font-medium text-sm">{{ socketStatus }}</span>
        </div>

        <div class="space-y-2">
            <label class="text-sm font-medium">Message:</label>
            <div class="flex gap-2">
                <Input v-model="message" placeholder="Escreve algo para o servidor..." @keyup.enter="sendMessage" />
                <Button @click="sendMessage" class="bg-blue-600 hover:bg-blue-700">Send Echo</Button>
            </div>
        </div>

        <div class="space-y-2">
            <label class="text-sm font-medium text-muted-foreground">Response:</label>
            <div class="w-full min-h-[60px] p-3 rounded bg-slate-100 border text-sm font-mono text-slate-700">
                {{ receivedMessage || 'Waiting for echo...' }}
            </div>
        </div>

      </CardContent>
    </Card>

  </div>
</template>

<script setup>
import { ref, inject, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios' // Importar axios diretamente para teste manual

// Componentes UI
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

// --- LÓGICA API (LARAVEL) ---
const authStore = useAuthStore()
const credentials = ref({ email: '', password: '' })
const isLoading = ref(false)
const apiResponse = ref('')

const handleLogin = async () => {
    isLoading.value = true
    apiResponse.value = 'Sending login request...'
    try {
        await authStore.login(credentials.value)
        apiResponse.value = `Login Success!\nToken: ${authStore.token.substring(0, 20)}...`
    } catch (error) {
        apiResponse.value = `Login Failed: ${error.response?.data?.message || error.message}`
    } finally {
        isLoading.value = false
    }
}

const testProtectedEndpoint = async () => {
    apiResponse.value = 'Calling GET /api/users/me...'
    try {
        const response = await axios.get('http://localhost:8000/api/users/me')
        apiResponse.value = JSON.stringify(response.data, null, 2)
    } catch (error) {
        apiResponse.value = `Error: ${error.message}`
    }
}

// --- LÓGICA SOCKETS (NODE) ---
const socket = inject('socket')
const message = ref('')
const receivedMessage = ref('')
const isConnected = ref(socket.connected) // Criar uma ref local para o estado

// Atualizar a ref quando o socket muda de estado
socket.on('connect', () => {
    isConnected.value = true
})

socket.on('disconnect', () => {
    isConnected.value = false
})

// Computed agora depende da ref reativa 'isConnected'
const socketStatus = computed(() => isConnected.value ? 'Connected to Socket Server' : 'Disconnected')

const sendMessage = () => {
  if (message.value) {
      socket.emit('echo', message.value)
  }
}

socket.on('echo', (msg) => {
    receivedMessage.value = msg
})

</script>
