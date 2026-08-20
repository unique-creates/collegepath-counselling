'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

type AuthDialogState = {
  open: boolean
  defaultTab: 'login' | 'register'
  redirectTo?: string
  openAuth: (opts?: { tab?: 'login' | 'register'; redirectTo?: string }) => void
  closeAuth: () => void
}

const AuthDialogContext = createContext<AuthDialogState>({
  open: false,
  defaultTab: 'login',
  openAuth: () => {},
  closeAuth: () => {},
})

export function useAuthDialog() {
  return useContext(AuthDialogContext)
}

export function AuthDialogProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [defaultTab, setDefaultTab] = useState<'login' | 'register'>('login')
  const [redirectTo, setRedirectTo] = useState<string | undefined>(undefined)

  const openAuth = useCallback((opts?: { tab?: 'login' | 'register'; redirectTo?: string }) => {
    setDefaultTab(opts?.tab || 'login')
    setRedirectTo(opts?.redirectTo)
    setOpen(true)
  }, [])

  const closeAuth = useCallback(() => {
    setOpen(false)
  }, [])

  return (
    <AuthDialogContext.Provider value={{ open, defaultTab, redirectTo, openAuth, closeAuth }}>
      {children}
    </AuthDialogContext.Provider>
  )
}
