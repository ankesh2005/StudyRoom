import axios from 'axios'

// Use relative URL - will be proxied by Vite
const apiClient = axios.create({
  baseURL: '/api',  // This will go through Vite proxy to http://localhost:3000/api
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