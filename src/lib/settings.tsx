'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export type SiteSettings = {
  siteName: string | null
  tagline: string | null
  description: string | null
  contactEmail: string | null
  contactPhone: string | null
  whatsappNumber: string | null
  whatsappMessage: string | null
  upiId: string | null
  address: string | null
  facebookUrl: string | null
  twitterUrl: string | null
  instagramUrl: string | null
  youtubeUrl: string | null
  linkedinUrl: string | null
}

type SettingsContextType = {
  settings: SiteSettings | null
  loading: boolean
  refresh: () => Promise<void>
}

const SettingsContext = createContext<SettingsContextType>({
  settings: null,
  loading: true,
  refresh: async () => {},
})

// Default fallback values used before settings load from API
export const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'CollegePath',
  tagline: 'Your trusted guide to college admissions',
  description:
    'Expert college counselling and admission guidance for engineering, medical and management aspirants across India.',
  contactEmail: 'support@collegepath.in',
  contactPhone: '+91 99999 00000',
  whatsappNumber: '+91 99999 00000',
  whatsappMessage: 'Hi CollegePath, I need help with college counselling.',
  upiId: 'collegepath@upi',
  address: 'New Delhi, India - 110001',
  facebookUrl: 'https://facebook.com/collegepath',
  twitterUrl: 'https://twitter.com/collegepath',
  instagramUrl: 'https://instagram.com/collegepath',
  youtubeUrl: 'https://youtube.com/@collegepath',
  linkedinUrl: 'https://linkedin.com/company/collegepath',
}

export function useSettings() {
  return useContext(SettingsContext)
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = async () => {
    try {
      const res = await fetch('/api/settings', { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        setSettings(data.settings || DEFAULT_SETTINGS)
      } else {
        setSettings(DEFAULT_SETTINGS)
      }
    } catch {
      setSettings(DEFAULT_SETTINGS)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  return (
    <SettingsContext.Provider value={{ settings, loading, refresh }}>
      {children}
    </SettingsContext.Provider>
  )
}
