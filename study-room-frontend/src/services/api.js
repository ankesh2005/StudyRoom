import axios from 'axios'

// Use environment variable for API URL
const API_URL = import.meta.env.VITE_API_URL || '/api'

console.log('API URL:', API_URL)  // Add this to debug

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

export default apiClient