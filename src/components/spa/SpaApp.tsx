'use client'

import { useEffect } from 'react'
import { useRoute, useHashRouter, HashRouterProvider } from '@/lib/router'
import { SessionProvider } from '@/lib/session'
import { AuthDialogProvider, useAuthDialog } from '@/lib/auth-dialog'
import { SettingsProvider } from '@/lib/settings'
import { useMounted } from '@/lib/use-mounted'
import { Header } from '@/components/site/Header'
import { Footer } from '@/components/site/Footer'
import { ToastHost } from '@/components/site/ToastHost'
import { AuthDialog } from '@/components/site/AuthDialog'
import { LiveUpdatesTicker } from '@/components/site/LiveUpdatesTicker'
import { AnnouncementBanner } from '@/components/site/AnnouncementBanner'
import { SitePopup } from '@/components/site/SitePopup'
import { HomePage } from '@/components/site/HomePage'
import { CounsellingListPage } from '@/components/site/CounsellingListPage'
import { CounsellingDetailPage } from '@/components/site/CounsellingDetailPage'
import { CollegesPage } from '@/components/site/CollegesPage'
import { CollegeDetailPage } from '@/components/site/CollegeDetailPage'
import { ComparePage } from '@/components/site/ComparePage'
import { BlogListPage } from '@/components/site/BlogListPage'
import { BlogDetailPage } from '@/components/site/BlogDetailPage'
import { AboutPage } from '@/components/site/AboutPage'
import { ContactPage } from '@/components/site/ContactPage'
import { FAQPage } from '@/components/site/FAQPage'
import { PrivacyPage, TermsPage, RefundPage, DisclaimerPage } from '@/components/site/LegalPages'
import { NotFoundPage } from '@/components/site/NotFoundPage'
import { StudentDashboard } from '@/components/student/StudentDashboard'
import { AdminDashboard } from '@/components/admin/AdminDashboard'

function Router() {
  const { segments } = useRoute()

  // Home
  if (segments.length === 0) return <HomePage />

  const [first, second, third] = segments

  // Counselling routes
  if (first === 'counselling') {
    if (!second) return <CounsellingListPage />
    return <CounsellingDetailPage slug={second} />
  }

  // Colleges routes
  if (first === 'colleges') {
    if (!second) return <CollegesPage />
    return <CollegeDetailPage slug={second} />
  }

  // Compare
  if (first === 'compare') return <ComparePage />

  // Blog routes
  if (first === 'blog') {
    if (!second) return <BlogListPage />
    if (second === 'category' && third) return <BlogListPage categorySlug={third} />
    return <BlogDetailPage slug={second} />
  }

  // Static pages
  if (first === 'about') return <AboutPage />
  if (first === 'contact') return <ContactPage />
  if (first === 'faq') return <FAQPage />
  if (first === 'privacy') return <PrivacyPage />
  if (first === 'terms') return <TermsPage />
  if (first === 'refund') return <RefundPage />
  if (first === 'disclaimer') return <DisclaimerPage />

  // Dashboard
  if (first === 'dashboard') return <StudentDashboard />

  // Admin
  if (first === 'admin') return <AdminDashboard />

  // Login / register aliases - render home; the global AuthDialog will open via LoginRedirect
  if (first === 'login') return <LoginRedirect tab="login" />
  if (first === 'register') return <LoginRedirect tab="register" />

  return <NotFoundPage />
}

function LoginRedirect({ tab }: { tab: 'login' | 'register' }) {
  const { openAuth } = useAuthDialog()
  const { navigate } = useHashRouter()
  useEffect(() => {
    openAuth({ tab, redirectTo: '/dashboard' })
    navigate('/')
  }, [openAuth, navigate, tab])
  return <HomePage />
}

function GlobalAuthDialog() {
  const { open, defaultTab, redirectTo, closeAuth } = useAuthDialog()
  const mounted = useMounted()
  // Don't render the Dialog during SSR to avoid hydration mismatch
  // with Radix UI's auto-generated aria-controls IDs
  if (!mounted) return null
  return (
    <AuthDialog
      open={open}
      onOpenChange={(o) => { if (!o) closeAuth() }}
      defaultTab={defaultTab}
      redirectTo={redirectTo}
    />
  )
}

export function SpaApp() {
  return (
    <HashRouterProvider>
      <SettingsProvider>
        <SessionProvider>
          <AuthDialogProvider>
            <div className="min-h-screen flex flex-col">
              {/* Top announcement banner (admin-controlled) */}
              <AnnouncementBanner />
              <Header />
              {/* Live updates ticker (admin messages cycling) */}
              <LiveUpdatesTicker />
              <main className="flex-1">
                <Router />
              </main>
              <Footer />
              {/* Single global AuthDialog - prevents stacking */}
              <GlobalAuthDialog />
              {/* Admin-controlled center popup */}
              <SitePopup />
              <ToastHost />
            </div>
          </AuthDialogProvider>
        </SessionProvider>
      </SettingsProvider>
    </HashRouterProvider>
  )
}
