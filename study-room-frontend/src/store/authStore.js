import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import apiClient from '../services/api'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true })
        try {
          const response = await apiClient.post('/auth/login', { email, password })
          const { user, token } = response.data.data
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          })
          localStorage.setItem('auth-token', token)
          return response.data
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      register: async (name, email, password) => {
        set({ isLoading: true })
        try {
          const response = await apiClient.post('/auth/register', { name, email, password })
          const { user, token } = response.data.data
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          })
          localStorage.setItem('auth-token', token)
          return response.data
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: async () => {
        try {
          await apiClient.post('/auth/logout')
        } catch (error) {
          console.error('Logout error:', error)
        } finally {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          })
          localStorage.removeItem('auth-token')
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)