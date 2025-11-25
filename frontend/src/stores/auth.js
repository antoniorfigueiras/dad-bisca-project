import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {
    // --- ESTADO ---
    const user = ref(null)
    // Tenta recuperar o token do localStorage ao iniciar
    const token = ref(localStorage.getItem('token'))

    // --- GETTERS ---
    const isLoggedIn = computed(() => !!token.value)
    const userName = computed(() => user.value ? user.value.name : '')

    // --- AÇÕES ---

    // 1. Fazer Login
    async function login(credentials) {
        try {
            // Faz o pedido à nossa API
            const response = await axios.post('http://localhost:8000/api/login', credentials)

            // Se correu bem, guarda os dados
            token.value = response.data.access_token
            user.value = response.data.user

            // Persistir no browser (para não perder login no F5)
            localStorage.setItem('token', token.value)

            // Configurar o Axios para usar este token daqui para a frente
            axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`

            return true
        } catch (error) {
            console.error('Erro no Login:', error)
            throw error // Lança o erro para a página de login tratar (ex: mostrar mensagem)
        }
    }

    // 2. Fazer Logout
    async function logout() {
        try {
            // Tenta avisar a API para apagar o token
            if (token.value) {
                await axios.post('http://localhost:8000/api/logout')
            }
        } catch (error) {
            console.error('Erro ao fazer logout na API', error)
        } finally {
            // Limpeza local (acontece sempre, mesmo se a API der erro)
            token.value = null
            user.value = null
            localStorage.removeItem('token')
            delete axios.defaults.headers.common['Authorization']
        }
    }

    // 3. Restaurar Sessão (Útil para quando dás refresh à página)
    async function checkAuth() {
        if (token.value) {
            // Configura o header
            axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`

            // Opcional: Pede os dados frescos do utilizador à API
            try {
                const response = await axios.get('http://localhost:8000/api/users/me')
                user.value = response.data
            } catch (error) {
                // Se o token for inválido (expirou), faz logout forçado
                logout()
            }
        }
    }

    return {
        user,
        token,
        isLoggedIn,
        userName,
        login,
        logout,
        checkAuth
    }
})
