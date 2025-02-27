// src/stores/auth.js
import router from '@/router'
import api from '@/services/api'
import type { User } from '@/types/User'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = ref<boolean>(!!localStorage.getItem('token'))

  async function login(credentials: { email: string; password: string }) {
    try {
      const response = await api.post('/login', credentials).then((response) => {
        if (response.data.access_token) {
          localStorage.setItem('token', response.data.access_token)
        }
        return response.data
      })
      console.log('login response', response)
      user.value = response.user
      isAuthenticated.value = true
      return response
    } catch (error) {
      console.error('Unable to login', error)
      user.value = null
      isAuthenticated.value = false
      throw error
    }
  }

  async function logout() {
    await api.post('/logout').then(() => {
      localStorage.removeItem('token')
    })
    user.value = null
    isAuthenticated.value = false
    router.push({ name: 'login' })
  }

  return {
    // State
    user,
    isAuthenticated,
    // Actions
    login,
    logout,
  }
})
