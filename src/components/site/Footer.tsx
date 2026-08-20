'use client'

import { useState, useEffect } from 'react'
import { useHashRouter } from '@/lib/router'
import { useSettings, DEFAULT_SETTINGS } from '@/lib/settings'
import { GraduationCap, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, Linkedin } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Footer() {
  const { navigate } = useHashRouter()
  const { settings } = useSettings()
  const s = settings || DEFAULT_SETTINGS
  const siteName = s.siteName || 'CollegePath'
  // Compute year on client only to avoid SSR/CSR hydration mismatch on year boundaries
  const [year, setYear] = useState<number>(2026)
  useEffect(() => { setYear(new Date().getFullYear()) }, [])

  const columns = [
    {
      title: 'Programs',
      links: [
        { label: 'JEE Main Counselling', path: '/counselling/jee-main-counselling' },
        { label: 'JEE Advanced Counselling', path: '/counselling/jee-advanced-counselling' },
        { label: 'UPTAC Counselling', path: '/counselling/uptac-counselling' },
        { label: 'CSAB Special Round', path: '/counselling/csab-special-round' },
        { label: 'Free College Shortlist', path: '/counselling/free-college-shortlist' },
      ],
    },
    {
      title: 'Explore',
      links: [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'All Colleges', path: '/colleges' },
        { label: 'Compare Colleges', path: '/compare' },
        { label: 'Blog & Guides', path: '/blog' },
        { label: 'FAQs', path: '/faq' },
        { label: 'About Us', path: '/about' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Contact', path: '/contact' },
        { label: 'Student Dashboard', path: '/dashboard' },
        { label: 'Privacy Policy', path: '/privacy' },
        { label: 'Terms of Service', path: '/terms' },
        { label: 'Refund Policy', path: '/refund' },
        { label: 'Disclaimer', path: '/disclaimer' },
      ],
    },
  ]

  const socialLinks = [
    { url: s.facebookUrl, icon: Facebook, label: 'Facebook' },
    { url: s.twitterUrl, icon: Twitter, label: 'Twitter' },
    { url: s.instagramUrl, icon: Instagram, label: 'Instagram' },
    { url: s.youtubeUrl, icon: Youtube, label: 'YouTube' },
    { url: s.linkedinUrl, icon: Linkedin, label: 'LinkedIn' },
  ].filter((l) => l.url)

  return (
    <footer className="mt-auto bg-muted/30 border-t">
      <div className="container-wide py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 font-bold text-lg"
            >
              <div className="size-9 rounded-xl gradient-brand flex items-center justify-center text-brand-foreground">
                <GraduationCap className="size-5" />
              </div>
              {siteName}
            </button>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              {s.description}
            </p>
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-3">
                {socialLinks.map((l) => (
                  <Button key={l.label} variant="outline" size="icon" aria-label={l.label} asChild>
                    <a href={l.url as string} target="_blank" rel="noopener noreferrer">
                      <l.icon className="size-4" />
                    </a>
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title} className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">{col.title}</h3>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.path}>
                    <button
                      onClick={() => navigate(link.path)}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact bar */}
        <div className="mt-10 pt-8 border-t grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-muted-foreground">
          {s.contactEmail && (
            <div className="flex items-center gap-2">
              <Mail className="size-4 shrink-0" />
              <a href={`mailto:${s.contactEmail}`} className="hover:text-foreground truncate">{s.contactEmail}</a>
            </div>
          )}
          {s.contactPhone && (
            <div className="flex items-center gap-2">
              <Phone className="size-4 shrink-0" />
              <a href={`tel:${s.contactPhone}`} className="hover:text-foreground">{s.contactPhone}</a>
            </div>
          )}
          {s.address && (
            <div className="flex items-center gap-2">
              <MapPin className="size-4 shrink-0" />
              <span>{s.address}</span>
            </div>
          )}
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t text-center text-xs text-muted-foreground">
          © {year} {siteName}. All rights reserved. Built with care for students across India.
        </div>
      </div>
    </footer>
  )
}
