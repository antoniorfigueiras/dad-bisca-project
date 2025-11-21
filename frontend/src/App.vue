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
            to="/login" 
            class="transition-colors hover:text-foreground/80 text-foreground/60"
            active-class="text-foreground font-bold"
          >
            Login
          </RouterLink>

          <RouterLink 
            to="/about-test" 
            class="transition-colors hover:text-foreground/80 text-foreground/60"
            active-class="text-foreground font-bold"
          >
            Debug
          </RouterLink>
        </nav>
      </div>
    </header>

    <main class="container mx-auto py-6 px-4">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>