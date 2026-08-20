'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useHashRouter } from '@/lib/router'
import { useMounted } from '@/lib/use-mounted'
import { ArrowRight, X } from 'lucide-react'

type Popup = {
  id: string
  title: string
  message: string
  imageUrl?: string | null
  ctaText?: string | null
  ctaLink?: string | null
  frequency: string
}

const STORAGE_KEY_PREFIX = 'popup_dismissed_'

export function SitePopup() {
  const { navigate } = useHashRouter()
  const mounted = useMounted()
  const [popup, setPopup] = useState<Popup | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!mounted) return
    let cancelled = false
    fetch('/api/popups', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        if (cancelled || !d.popup) {
          setPopup(null)
          return
        }
        const p: Popup = d.popup
        // Check frequency rules
        const storageKey = STORAGE_KEY_PREFIX + p.id
        const todayKey = STORAGE_KEY_PREFIX + p.id + '_' + new Date().toDateString()

        if (p.frequency === 'ONCE_PER_SESSION') {
          if (sessionStorage.getItem(storageKey) === '1') {
            setPopup(null)
            return
          }
        } else if (p.frequency === 'DAILY') {
          if (localStorage.getItem(todayKey) === '1') {
            setPopup(null)
            return
          }
        } else if (p.frequency === 'EVERY_VISIT') {
          // Show every visit - no storage check
        } else if (p.frequency === 'ALWAYS') {
          // Show always
        }

        setPopup(p)
        setOpen(true)
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [mounted])

  const handleOpenChange = (o: boolean) => {
    if (!o && popup) {
      const storageKey = STORAGE_KEY_PREFIX + popup.id
      const todayKey = STORAGE_KEY_PREFIX + popup.id + '_' + new Date().toDateString()
      if (popup.frequency === 'ONCE_PER_SESSION') {
        sessionStorage.setItem(storageKey, '1')
      } else if (popup.frequency === 'DAILY') {
        localStorage.setItem(todayKey, '1')
      } else if (popup.frequency === 'EVERY_VISIT' || popup.frequency === 'ALWAYS') {
        // Don't persist - show again on next render/visit
      }
    }
    setOpen(o)
  }

  const handleCtaClick = () => {
    if (popup?.ctaLink) {
      handleOpenChange(false)
      navigate(popup.ctaLink)
    }
  }

  if (!mounted || !popup) return null

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        {popup.imageUrl && (
          <div className="aspect-[16/9] bg-muted overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={popup.imageUrl} alt={popup.title} className="size-full object-cover" />
          </div>
        )}
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-2xl font-bold">{popup.title}</DialogTitle>
          <DialogDescription className="text-base text-muted-foreground mt-2 leading-relaxed">
            {popup.message}
          </DialogDescription>
        </DialogHeader>
        <div className="p-6 pt-2 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Maybe later
          </Button>
          {popup.ctaText && (
            <Button
              onClick={handleCtaClick}
              className="gradient-brand text-brand-foreground"
            >
              {popup.ctaText}
              <ArrowRight className="ml-2 size-4" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
