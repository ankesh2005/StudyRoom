import React, { useState } from 'react'
import apiClient from '../services/api'
import { Button } from './ui/Button'
import { Card, CardContent } from './ui/Card'

export default function ConnectionTest() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    try {
      // Test health endpoint
      const healthRes = await fetch('http://localhost:3000/health')
      const healthData = await healthRes.json()
      
      // Test register endpoint
      const testEmail = `test${Date.now()}@example.com`
      const registerRes = await apiClient.post('/auth/register', {
        name: 'Test User',
        email: testEmail,
        password: '123456'
      })
      
      setResult({
        success: true,
        health: healthData,
        register: registerRes.data
      })
    } catch (error) {
      setResult({
        success: false,
        error: error.message,
        details: error.response?.data
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80">
      <CardContent className="pt-6">
        <h3 className="font-semibold mb-2">Connection Test</h3>
        <Button onClick={testConnection} loading={loading} size="sm">
          Test Backend Connection
        </Button>
        {result && (
          <div className="mt-3 text-sm">
            {result.success ? (
              <div className="text-green-600">
                ✅ Connected successfully!
                <div className="text-xs text-gray-500 mt-1">
                  Health: {JSON.stringify(result.health)}
                </div>
              </div>
            ) : (
              <div className="text-red-600">
                ❌ Connection failed: {result.error}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}