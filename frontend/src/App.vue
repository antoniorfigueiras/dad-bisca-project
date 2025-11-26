<template>
  <div class="min-h-screen bg-background font-sans antialiased">
    <header class="border-b bg-white">
      <div class="container mx-auto flex h-16 items-center justify-between px-4">

        <div class="flex items-center gap-2">
          <span class="text-2xl">🃏</span>
          <RouterLink to="/" class="text-lg font-bold tracking-tight hover:text-primary">
            Bisca DAD
          </RouterLink>
        </div>

        <nav class="flex items-center gap-6 text-sm font-medium">

          <RouterLink
            to="/"
            class="transition-colors hover:text-foreground/80 text-foreground/60"
            active-class="text-foreground font-bold"
          >
            Home
          </RouterLink>

          <RouterLink
            to="/about-test"
            class="transition-colors hover:text-foreground/80 text-foreground/60"
            active-class="text-foreground font-bold"
          >
            Debug
          </RouterLink>

          <div v-if="!authStore.isLoggedIn">
            <RouterLink
              to="/login"
              class="transition-colors hover:text-foreground/80 text-foreground/60"
              active-class="text-foreground font-bold"
            >
              Login
            </RouterLink>
          </div>

          <div v-else class="flex items-center gap-4 border-l pl-6 ml-2">
            <div class="flex flex-col items-end">
                <span class="text-xs text-muted-foreground">Olá,</span>
                <span class="font-bold text-foreground leading-none">{{ authStore.userName }}</span>
            </div>

            <button
                @click="handleLogout"
                class="text-red-500 hover:text-red-700 font-bold text-xs uppercase tracking-wider border border-red-200 px-3 py-1 rounded hover:bg-red-50 transition-all"
            >
                Sair
            </button>
          </div>

        </nav>
      </div>
    </header>

    <main class="container mx-auto py-6 px-4">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

// Inicializar verificação de token
authStore.checkAuth()

// Função de Logout
const handleLogout = () => {
    authStore.logout()
    router.push('/login')
}
</script>
