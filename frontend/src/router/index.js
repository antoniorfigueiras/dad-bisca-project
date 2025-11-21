import { createRouter, createWebHistory } from 'vue-router'
// Importa os componentes das páginas
import HomePage from '@/pages/home/HomePage.vue'
import LoginPage from '@/pages/login/LoginPage.vue'
import AboutPage from '@/pages/about/AboutPage.vue' // A nossa página de teste
import SingleplayerGamePage from '@/pages/game/SinglePlayerGamePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
    },
    {
      path: '/about-test', // Rota para a nossa página de teste
      name: 'about-test',
      component: AboutPage,
    },

    {
      path: '/game/singleplayer',
      name: 'singleplayer',
      component: SingleplayerGamePage,
    },
  ],
})

export default router
