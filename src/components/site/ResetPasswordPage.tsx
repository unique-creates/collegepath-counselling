'use client'

import { useEffect, useState } from 'react'
import { useHashRouter } from '@/lib/router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Lock, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

export function ResetPasswordPage() {
  const { navigate } = useHashRouter()
  const { query } = (() => {
    const hash = typeof window !== 'undefined' ? window.location.hash : ''
    const queryStr = hash.split('?')[1] || ''
    return { query: new URLSearchParams(queryStr) }
  })()

  const token = query.get('token') || ''
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: newPassword }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to reset password')
        return
      }
      setSuccess(true)
      setTimeout(() => navigate('/'), 3000)
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="container-narrow py-16">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="size-12 text-destructive mx-auto mb-4" />
            <h1 className="text-xl font-bold mb-2">Invalid Reset Link</h1>
            <p className="text-sm text-muted-foreground mb-6">
              The password reset link is missing or invalid. Please request a new reset link.
            </p>
            <Button onClick={() => navigate('/')} className="gradient-brand text-brand-foreground">
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (success) {
    return (
      <div className="container-narrow py-16">
        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle2 className="size-12 text-green-600 mx-auto mb-4" />
            <h1 className="text-xl font-bold mb-2">Password Reset Successfully!</h1>
            <p className="text-sm text-muted-foreground mb-6">
              Your password has been changed. Redirecting to home page...
            </p>
            <Button onClick={() => navigate('/')} className="gradient-brand text-brand-foreground">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container-narrow py-16">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Set New Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="Min 8 characters"
                  className="pl-9"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="Re-enter password"
                  className="pl-9"
                />
              </div>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full gradient-brand text-brand-foreground">
              {loading && <Loader2 className="size-4 mr-2 animate-spin" />}
              Reset Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
