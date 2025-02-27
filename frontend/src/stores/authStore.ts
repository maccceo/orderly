// src/stores/auth.js
import router from '@/router'
import api from '@/services/api'
import type { User, UserRole } from '@/types/User'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(
    localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '') : null,
  )
  const userRole = ref<UserRole>((localStorage.getItem('user_role') as UserRole) || 'user')
  const isAuthenticated = ref<boolean>(!!localStorage.getItem('token'))
  const isAdmin = computed(() => userRole.value === 'admin')

  async function login(credentials: { email: string; password: string }) {
    try {
      const response = await api.post('/login', credentials).then((response) => {
        if (response.data.access_token) {
          localStorage.setItem('token', response.data.access_token)
          localStorage.setItem('user', JSON.stringify(response.data.user))
          localStorage.setItem('user_role', response.data.user.role)
        }
        return response.data
      })
      console.log('login response', response)
      user.value = response.user
      isAuthenticated.value = true
      userRole.value = response.user.role
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
      localStorage.removeItem('user')
      localStorage.removeItem('user_role')
    })
    user.value = null
    isAuthenticated.value = false
    router.push({ name: 'login' })
  }

  return {
    // State
    user,
    userRole,
    isAuthenticated,
    isAdmin,
    // Actions
    login,
    logout,
  }
})
