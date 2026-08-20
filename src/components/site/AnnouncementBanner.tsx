'use client'

import { useEffect, useState } from 'react'
import { useHashRouter } from '@/lib/router'
import { X, ArrowRight, Info, CheckCircle2, AlertTriangle, AlertCircle, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

type Banner = {
  id: string
  message: string
  link?: string | null
  ctaText?: string | null
  variant: string
  dismissible: boolean
}

const variantStyles: Record<string, string> = {
  info: 'bg-blue-600 text-white',
  success: 'bg-emerald-600 text-white',
  warning: 'bg-amber-500 text-white',
  error: 'bg-red-600 text-white',
  brand: 'gradient-brand text-brand-foreground',
}

const variantIcons: Record<string, any> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: AlertCircle,
  brand: Sparkles,
}

export function AnnouncementBanner() {
  const { navigate } = useHashRouter()
  const [banners, setBanners] = useState<Banner[]>([])
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetch('/api/banners', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setBanners(d.banners || [])
      })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  if (loading) return null

  const visible = banners.filter((b) => !dismissed.has(b.id))
  if (visible.length === 0) return null

  const banner = visible[0]

  const Icon = variantIcons[banner.variant] || Info
  const style = variantStyles[banner.variant] || variantStyles.info

  const handleClick = () => {
    if (banner.link) navigate(banner.link)
  }

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation()
    setDismissed((cur) => new Set(cur).add(banner.id))
  }

  return (
    <div className={cn('w-full', style)}>
      <div className="container-wide flex items-center gap-3 py-2 px-4">
        <Icon className="size-4 shrink-0" />
        <div className="flex-1 flex items-center justify-center gap-3 text-sm font-medium text-center">
          <span>{banner.message}</span>
          {banner.ctaText && (
            <button
              onClick={handleClick}
              className="inline-flex items-center gap-1 underline underline-offset-2 hover:opacity-80 font-semibold"
            >
              {banner.ctaText}
              <ArrowRight className="size-3.5" />
            </button>
          )}
        </div>
        {banner.dismissible && (
          <button
            onClick={handleDismiss}
            aria-label="Dismiss banner"
            className="shrink-0 hover:opacity-80 transition"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
    </div>
  )
}
