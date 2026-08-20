'use client'

import { useEffect, useRef } from 'react'

type ToastInput = { title: string; description?: string; type?: 'success' | 'error' | 'info' }

// Simple global toast function. Other components call useToast() to get a function they can call to show a toast.
// Toasts are rendered by <ToastHost /> mounted once at the app root.
export function useToast() {
  const fn = useRef<(t: ToastInput) => void>(() => {})
  useEffect(() => {
    fn.current = (t: ToastInput) => {
      if (typeof window !== 'undefined' && (window as any).__toast) {
        ;(window as any).__toast(t)
      }
    }
  }, [])
  return { toast: (t: ToastInput) => fn.current(t) }
}
