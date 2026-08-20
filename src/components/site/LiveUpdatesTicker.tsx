'use client'

import { useEffect, useState } from 'react'
import { useHashRouter } from '@/lib/router'
import { Radio, ArrowRight, Bell } from 'lucide-react'
import { cn } from '@/lib/utils'

type Update = {
  id: string
  message: string
  link?: string | null
  icon?: string | null
}

export function LiveUpdatesTicker() {
  const { navigate } = useHashRouter()
  const [updates, setUpdates] = useState<Update[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetch('/api/live-updates', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setUpdates(d.updates || [])
      })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  // Cycle through messages every 5 seconds
  useEffect(() => {
    if (updates.length <= 1) return
    const interval = setInterval(() => {
      setCurrentIdx((cur) => (cur + 1) % updates.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [updates.length])

  if (loading || updates.length === 0) return null

  const current = updates[currentIdx]

  const handleClick = () => {
    if (current?.link) navigate(current.link)
  }

  return (
    <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-b border-primary/20">
      <div className="container-wide flex items-center gap-3 py-2.5">
        <div className="flex items-center gap-2 shrink-0">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex size-2 rounded-full bg-red-500"></span>
          </span>
          <span className="hidden sm:flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-primary">
            <Radio className="size-3.5" />
            Live Updates
          </span>
        </div>
        <button
          onClick={handleClick}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 text-sm text-foreground text-center min-h-[20px]',
            current?.link && 'hover:text-primary cursor-pointer'
          )}
          aria-label={current?.message}
        >
          <Bell className="size-3.5 text-primary shrink-0 hidden sm:inline" />
          <span className="line-clamp-1">{current?.message}</span>
          {current?.link && <ArrowRight className="size-3.5 shrink-0" />}
        </button>
        {updates.length > 1 && (
          <div className="hidden sm:flex items-center gap-1 shrink-0">
            {updates.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIdx(idx)}
                aria-label={`Go to update ${idx + 1}`}
                className={cn(
                  'h-1.5 rounded-full transition-all',
                  idx === currentIdx ? 'w-5 bg-primary' : 'w-1.5 bg-primary/30 hover:bg-primary/50'
                )}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
