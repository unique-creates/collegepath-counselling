'use client'

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'
import type { SafeUser, Role } from '@/lib/types'

type SessionState = {
  user: SafeUser | null
  loading: boolean
  refresh: () => Promise<void>
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  logout: () => Promise<void>
}

const SessionContext = createContext<SessionState>({
  user: null,
  loading: true,
  refresh: async () => {},
  login: async () => ({ ok: false }),
  logout: async () => {},
})

export function useSession() {
  return useContext(SessionContext)
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SafeUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', { cache: 'no-store' })
      if (!res.ok) {
        setUser(null)
        return
      }
      const data = await res.json()
      setUser(data.user || null)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch('/api/auth/callback/credentials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        email,
        password,
        csrfToken: await getCsrfToken(),
        json: 'true',
      }),
    })
    if (!res.ok) {
      const txt = await res.text()
      return { ok: false, error: 'Invalid credentials' }
    }
    await refresh()
    return { ok: true }
  }, [refresh])

  const logout = useCallback(async () => {
    await fetch('/api/auth/signout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        csrfToken: await getCsrfToken(),
        json: 'true',
      }),
    })
    setUser(null)
  }, [refresh])

  useEffect(() => {
    refresh()
  }, [refresh])

  return (
    <SessionContext.Provider value={{ user, loading, refresh, login, logout }}>
      {children}
    </SessionContext.Provider>
  )
}

async function getCsrfToken(): Promise<string> {
  try {
    const res = await fetch('/api/auth/csrf', { cache: 'no-store' })
    const data = await res.json()
    return data.csrfToken || ''
  } catch {
    return ''
  }
}
