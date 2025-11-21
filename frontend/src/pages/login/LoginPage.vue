<template>
  <div class="flex h-[80vh] items-center justify-center">
    <Card class="w-full max-w-md">
      <CardHeader class="space-y-1">
        <CardTitle class="text-2xl font-bold text-center">Bem-vindo de volta</CardTitle>
        <CardDescription class="text-center">
          Introduz as tuas credenciais para entrar na plataforma.
        </CardDescription>
      </CardHeader>
      
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <Label for="email">Email</Label>
          <Input id="email" type="email" placeholder="exemplo@email.com" />
        </div>
        <div class="space-y-2">
          <Label for="password">Password</Label>
          <Input id="password" type="password" />
        </div>
      </CardContent>

      <CardFooter>
        <Button class="w-full">Entrar</Button>
      </CardFooter>
    </Card>
  </div>
</template>

<script setup>
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
</script>