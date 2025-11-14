import { createApp } from 'vue'
import AboutPage from '@/pages/about/AboutPage.vue'

// Importa o cliente io
import { io } from 'socket.io-client' //

const app = createApp(AboutPage)

// Conecta ao nosso servidor WebSocket (que está na porta 3000)
const socket = io('http://localhost:3000') //

// Fornece o socket a todos os componentes
app.provide('socket', socket) //

app.mount('#app')