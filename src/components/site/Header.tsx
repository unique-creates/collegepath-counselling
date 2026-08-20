'use client'

import { useState, useEffect } from 'react'
import { useHashRouter } from '@/lib/router'
import { useSession } from '@/lib/session'
import { useAuthDialog } from '@/lib/auth-dialog'
import { useSettings } from '@/lib/settings'
import { useMounted } from '@/lib/use-mounted'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  GraduationCap,
  Menu,
  Search,
  LogOut,
  LayoutDashboard,
  Settings,
  Bell,
  ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { GlobalSearch } from '@/components/site/GlobalSearch'

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Counselling', path: '/counselling' },
  { label: 'Colleges', path: '/colleges' },
  { label: 'Compare', path: '/compare' },
  { label: 'Blog', path: '/blog' },
  { label: 'FAQ', path: '/faq' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
]

export function Header() {
  const { path, navigate } = useHashRouter()
  const { user, logout } = useSession()
  const { openAuth } = useAuthDialog()
  const { settings } = useSettings()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const mounted = useMounted()

  const siteName = settings?.siteName || 'CollegePath'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (p: string) => {
    if (p === '/') return path === '/'
    return path === p || path.startsWith(p + '/')
  }

  const handleNav = (p: string) => {
    navigate(p)
    setMobileOpen(false)
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75 transition-shadow',
        scrolled && 'shadow-sm'
      )}
    >
      <div className="container-wide flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <button
          onClick={() => handleNav('/')}
          className="flex items-center gap-2 font-bold text-lg shrink-0 hover:opacity-90 transition"
          aria-label={`${siteName} home`}
        >
          <div className="size-9 rounded-xl gradient-brand flex items-center justify-center text-brand-foreground shadow-sm">
            <GraduationCap className="size-5" />
          </div>
          <span className="hidden sm:inline">{siteName}</span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Main">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNav(item.path)}
              className={cn(
                'px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-foreground',
                isActive(item.path) ? 'text-foreground bg-muted' : 'text-muted-foreground'
              )}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
            className="hidden sm:inline-flex"
          >
            <Search className="size-4" />
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 px-2 sm:px-3">
                  <div className="size-7 rounded-full gradient-brand flex items-center justify-center text-brand-foreground text-xs font-semibold">
                    {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="hidden sm:inline text-sm font-medium">{user.name?.split(' ')[0] || 'Account'}</span>
                  <ChevronDown className="size-3.5 hidden sm:inline" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleNav('/dashboard')}>
                  <LayoutDashboard className="size-4 mr-2" />
                  Dashboard
                </DropdownMenuItem>
                {user.role === 'ADMIN' && (
                  <DropdownMenuItem onClick={() => handleNav('/admin')}>
                    <Settings className="size-4 mr-2" />
                    Admin Panel
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => handleNav('/dashboard/notifications')}>
                  <Bell className="size-4 mr-2" />
                  Notifications
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()} className="text-destructive">
                  <LogOut className="size-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" onClick={() => openAuth({ tab: 'login' })} className="hidden sm:inline-flex">
                Login
              </Button>
              <Button
                onClick={() => openAuth({ tab: 'register' })}
                className="gradient-brand hover:opacity-90 text-brand-foreground"
              >
                Get Started
              </Button>
            </>
          )}

          {/* Mobile menu - only render after mount to avoid hydration mismatch with Radix aria-controls IDs */}
          {mounted && (
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[320px] p-0">
                <SheetHeader className="p-4 border-b">
                  <SheetTitle className="flex items-center gap-2">
                    <div className="size-8 rounded-lg gradient-brand flex items-center justify-center text-brand-foreground">
                      <GraduationCap className="size-4" />
                    </div>
                    {siteName}
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col p-2">
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-muted"
                  >
                    <Search className="size-4" />
                    Search
                  </button>
                  {navItems.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => handleNav(item.path)}
                      className={cn(
                        'px-3 py-2 rounded-md text-sm font-medium text-left hover:bg-muted',
                        isActive(item.path) && 'bg-muted text-foreground'
                      )}
                    >
                      {item.label}
                    </button>
                  ))}
                  {!user && (
                    <div className="mt-2 pt-2 border-t flex flex-col gap-2">
                      <Button variant="outline" onClick={() => { openAuth({ tab: 'login' }); setMobileOpen(false) }}>
                        Login
                      </Button>
                      <Button onClick={() => { openAuth({ tab: 'register' }); setMobileOpen(false) }} className="gradient-brand text-brand-foreground">
                        Get Started
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>

      {mounted && <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />}
    </header>
  )
}
