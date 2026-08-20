'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { CheckCircle2, XCircle, Info, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastItem = {
  id: number
  title: string
  description?: string
  type?: 'success' | 'error' | 'info' | 'warning'
}

let counter = 0

export function ToastHost() {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const push = useCallback((t: Omit<ToastItem, 'id'>) => {
    const id = ++counter
    setToasts((cur) => [...cur, { ...t, id }])
    setTimeout(() => {
      setToasts((cur) => cur.filter((x) => x.id !== id))
    }, 4000)
  }, [])

  const pushRef = useRef(push)
  pushRef.current = push

  useEffect(() => {
    if (typeof window !== 'undefined') {
      ;(window as any).__toast = (t: Omit<ToastItem, 'id'>) => pushRef.current(t)
    }
    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).__toast
      }
    }
  }, [])

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            'pointer-events-auto flex items-start gap-3 rounded-lg border bg-card p-3 shadow-lg animate-in slide-in-from-bottom-2',
            t.type === 'success' && 'border-green-200 bg-green-50 dark:bg-green-950/30 dark:border-green-900',
            t.type === 'error' && 'border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-900',
            t.type === 'info' && 'border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-900'
          )}
        >
          <div className="shrink-0 mt-0.5">
            {t.type === 'success' && <CheckCircle2 className="size-5 text-green-600" />}
            {t.type === 'error' && <XCircle className="size-5 text-red-600" />}
            {(t.type === 'info' || !t.type) && <Info className="size-5 text-blue-600" />}
            {t.type === 'warning' && <AlertTriangle className="size-5 text-amber-600" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm">{t.title}</div>
            {t.description && <div className="text-xs text-muted-foreground mt-0.5">{t.description}</div>}
          </div>
        </div>
      ))}
    </div>
  )
}
