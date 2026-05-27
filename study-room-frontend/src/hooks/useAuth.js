import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export const useAuth = () => {
  const { user, token, isAuthenticated, isLoading, login, register, logout } = useAuthStore()
  const navigate = useNavigate()

  const requireAuth = () => {
    useEffect(() => {
      if (!isLoading && !isAuthenticated && !token) {
        navigate('/login')
      }
    }, [isLoading, isAuthenticated, token, navigate])
  }

  const redirectIfAuthenticated = () => {
    useEffect(() => {
      if (!isLoading && isAuthenticated && token) {
        navigate('/dashboard')
      }
    }, [isLoading, isAuthenticated, token, navigate])
  }

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    requireAuth,
    redirectIfAuthenticated,
  }
}