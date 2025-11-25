<template>
  <div class="flex h-[80vh] items-center justify-center bg-slate-100">
    <Card class="w-full max-w-md shadow-lg border-t-4 border-t-green-600">
      <CardHeader class="space-y-1">
        <div class="flex justify-center mb-4">
            <div class="bg-slate-900 text-white p-3 rounded-xl shadow-md">
                <span class="text-3xl">♠</span>
            </div>
        </div>
        <CardTitle class="text-2xl font-bold text-center text-slate-800">Bem-vindo de volta</CardTitle>
        <CardDescription class="text-center">
          Introduz as tuas credenciais para entrar na mesa.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form @submit.prevent="handleLogin" class="space-y-4">
            <div class="space-y-2">
              <Label for="email">Email</Label>
              <Input
                id="email"
                type="email"
                v-model="credentials.email"
                placeholder="exemplo@email.com"
                required
                class="bg-slate-50"
              />
            </div>
            <div class="space-y-2">
              <Label for="password">Password</Label>
              <Input
                id="password"
                type="password"
                v-model="credentials.password"
                required
                class="bg-slate-50"
              />
            </div>

            <div v-if="errorMessage" class="p-3 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 animate-pulse">
                ⚠️ {{ errorMessage }}
            </div>

            <Button type="submit" class="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-5" :disabled="isLoading">
                <span v-if="isLoading" class="flex items-center gap-2">
                    <span class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                    A verificar...
                </span>
                <span v-else>Entrar</span>
            </Button>
        </form>
      </CardContent>

      <CardFooter class="justify-center border-t p-6 bg-slate-50 rounded-b-lg">
        <p class="text-xs text-slate-500">
            Não tens conta? Pede a um administrador.
        </p>
      </CardFooter>
    </Card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Importar componentes Shadcn
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

// Lógica de Login
const router = useRouter()
const authStore = useAuthStore()

const credentials = ref({
    email: '',
    password: ''
})

const isLoading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
    isLoading.value = true
    errorMessage.value = ''

    try {
        // Chama a ação de login da store que criámos antes
        await authStore.login(credentials.value)

        // Se sucesso, redireciona para a Home ou para o Jogo
        router.push('/')
    } catch (error) {
        // Tratamento de erros da API (401, 403, etc)
        if (error.response && error.response.status === 401) {
            errorMessage.value = 'Email ou password incorretos.'
        } else if (error.response && error.response.status === 403) {
            errorMessage.value = 'A tua conta encontra-se bloqueada.'
        } else {
            errorMessage.value = 'Erro de ligação ao servidor. Tenta novamente.'
        }
    } finally {
        isLoading.value = false
    }
}
</script>
