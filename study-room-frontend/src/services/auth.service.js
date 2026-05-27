import apiClient from './api'

export const authService = {
  register: async (name, email, password) => {
    const response = await apiClient.post('/auth/register', { name, email, password })
    return response.data
  },

  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password })
    return response.data
  },

  logout: async () => {
    const response = await apiClient.post('/auth/logout')
    return response.data
  },

  getMe: async () => {
    const response = await apiClient.get('/auth/me')
    return response.data
  },
}