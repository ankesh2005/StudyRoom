import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card'

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export default function Login() {
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuthStore()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  })

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  const onSubmit = async (data) => {
    try {
      const response = await login(data.email, data.password)
      console.log('Login response:', response)
      toast.success('Login successful!')
      // The useEffect above will handle redirect when isAuthenticated becomes true
    } catch (error) {
      console.error('Login error:', error)
      toast.error(error.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center">Login to continue studying</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input 
              type="email" 
              placeholder="Email" 
              {...register('email')} 
              error={errors.email?.message} 
            />
            <Input 
              type="password" 
              placeholder="Password" 
              {...register('password')} 
              error={errors.password?.message} 
            />
            <Button type="submit" className="w-full" loading={isSubmitting}>
              Sign In
            </Button>
            <p className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 hover:underline">
                Create account
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}