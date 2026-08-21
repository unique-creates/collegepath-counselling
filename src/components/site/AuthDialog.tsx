'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Mail, Lock, User as UserIcon, Phone, CheckCircle2 } from 'lucide-react'
import { useSession } from '@/lib/session'
import { useHashRouter } from '@/lib/router'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultTab?: 'login' | 'register'
  redirectTo?: string
}

export function AuthDialog({ open, onOpenChange, defaultTab = 'login', redirectTo }: Props) {
  const [tab, setTab] = useState<'login' | 'register' | 'forgot'>(defaultTab as any)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resetLink, setResetLink] = useState<string | null>(null)
  const { login } = useSession()
  const { navigate } = useHashRouter()

  useEffect(() => {
    if (open) {
      setTab(defaultTab as any)
      setError(null)
      setSuccess(false)
      setResetLink(null)
    }
  }, [open, defaultTab])

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const email = String(formData.get('email') || '')
    const password = String(formData.get('password') || '')
    const res = await login(email, password)
    setLoading(false)
    if (res.ok) {
      onOpenChange(false)
      navigate(redirectTo || '/dashboard')
    } else {
      setError(res.error || 'Login failed')
    }
  }

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const body = {
      name: String(formData.get('name') || ''),
      email: String(formData.get('email') || ''),
      password: String(formData.get('password') || ''),
      phone: String(formData.get('phone') || ''),
    }
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Registration failed')
        setLoading(false)
        return
      }
      // Auto-login
      const lg = await login(body.email, body.password)
      setLoading(false)
      if (lg.ok) {
        setSuccess(true)
        setTimeout(() => {
          onOpenChange(false)
          navigate(redirectTo || '/dashboard')
        }, 1200)
      } else {
        setError('Account created. Please login now.')
        setTab('login')
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to CollegePath</DialogTitle>
          <DialogDescription>
            Sign in to access your counselling dashboard, save colleges and track applications.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <CheckCircle2 className="size-12 text-green-600" />
            <p className="font-medium">Account created successfully!</p>
            <p className="text-sm text-muted-foreground">Redirecting to your dashboard...</p>
          </div>
        ) : (
          <Tabs value={tab} onValueChange={(v) => { setTab(v as any); setError(null) }}>
            {tab !== 'forgot' ? (
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login" onClick={() => { setTab('login'); setError(null) }}>Sign In</TabsTrigger>
                <TabsTrigger value="register" onClick={() => { setTab('register'); setError(null) }}>Sign Up</TabsTrigger>
              </TabsList>
            ) : (
              <div className="flex items-center justify-between pb-2">
                <h3 className="text-sm font-semibold">Reset Password</h3>
                <button
                  type="button"
                  onClick={() => { setTab('login'); setError(null); setResetLink(null) }}
                  className="text-xs text-primary hover:underline"
                >
                  ← Back to Login
                </button>
              </div>
            )}

            <TabsContent value="login" className="space-y-4 pt-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input id="login-email" name="email" type="email" placeholder="you@example.com" className="pl-9" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input id="login-password" name="password" type="password" placeholder="••••••••" className="pl-9" required />
                  </div>
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <div className="flex items-center justify-between">
                  <Button type="submit" disabled={loading} className="gradient-brand text-brand-foreground">
                    {loading && <Loader2 className="size-4 mr-2 animate-spin" />}
                    Sign In
                  </Button>
                  <button
                    type="button"
                    onClick={() => { setTab('forgot'); setError(null) }}
                    className="text-xs text-primary hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="register" className="space-y-4 pt-4">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-name">Full Name</Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input id="reg-name" name="name" placeholder="Your name" className="pl-9" required minLength={2} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input id="reg-email" name="email" type="email" placeholder="you@example.com" className="pl-9" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-phone">Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input id="reg-phone" name="phone" placeholder="+91 99999 99999" className="pl-9" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input id="reg-password" name="password" type="password" placeholder="Min 8 characters" className="pl-9" required minLength={8} />
                  </div>
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" disabled={loading} className="w-full gradient-brand text-brand-foreground">
                  {loading && <Loader2 className="size-4 mr-2 animate-spin" />}
                  Create Account
                </Button>
              </form>
            </TabsContent>

            {tab === 'forgot' && (
              <div className="space-y-4 pt-4">
                {resetLink ? (
                  <div className="space-y-4">
                    <div className="flex flex-col items-center gap-3 py-4 text-center">
                      <Mail className="size-12 text-primary" />
                      <p className="font-medium text-sm">Reset link generated!</p>
                      <p className="text-xs text-muted-foreground">
                        Click the link below to reset your password. The link expires in 30 minutes.
                      </p>
                    </div>
                    <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-3 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          onOpenChange(false)
                          navigate(resetLink.replace('#', ''))
                        }}
                        className="text-sm text-primary font-medium hover:underline"
                      >
                        Reset My Password →
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={async (e) => {
                    e.preventDefault()
                    setError(null)
                    setLoading(true)
                    const formData = new FormData(e.currentTarget)
                    const email = String(formData.get('email') || '')
                    try {
                      const res = await fetch('/api/auth/forgot-password', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email }),
                      })
                      const data = await res.json()
                      if (data.resetLink) {
                        setResetLink(data.resetLink)
                      } else {
                        setError('Could not generate reset link. Please try again.')
                      }
                    } catch {
                      setError('Something went wrong. Please try again.')
                    } finally {
                      setLoading(false)
                    }
                  }} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="forgot-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input id="forgot-email" name="email" type="email" placeholder="you@example.com" className="pl-9" required />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Enter your registered email and we'll generate a password reset link for you.
                    </p>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                    <Button type="submit" disabled={loading} className="w-full gradient-brand text-brand-foreground">
                      {loading && <Loader2 className="size-4 mr-2 animate-spin" />}
                      Send Reset Link
                    </Button>
                  </form>
                )}
              </div>
            )}
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  )
}
