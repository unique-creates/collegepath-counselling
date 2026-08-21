'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useHashRouter, useRoute } from '@/lib/router'
import { useSession } from '@/lib/session'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { PageSkeleton, EmptyState } from '@/components/site/LoadingStates'
import { useAuthDialog } from '@/lib/auth-dialog'
import {
  LayoutDashboard,
  User as UserIcon,
  GraduationCap,
  Heart,
  GitCompare,
  MessageSquare,
  Bell,
  ListChecks,
  Loader2,
  Plus,
  X,
  Building2,
  Calendar,
  Send,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  FileText,
  Download,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react'
import type { Application, PreferenceOrder, Query, Notification, CollegeListItem } from '@/lib/types'
import { cn } from '@/lib/utils'

const nav = [
  { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
  { label: 'My Applications', path: '/dashboard/applications', icon: GraduationCap },
  { label: 'Preference Guidance', path: '/dashboard/preferences', icon: ListChecks },
  { label: 'Saved Colleges', path: '/dashboard/saved', icon: Heart },
  { label: 'Comparisons', path: '/dashboard/comparisons', icon: GitCompare },
  { label: 'Support Tickets', path: '/dashboard/support', icon: MessageSquare },
  { label: 'Notifications', path: '/dashboard/notifications', icon: Bell },
  { label: 'Profile', path: '/dashboard/profile', icon: UserIcon },
]

export function StudentDashboard() {
  const { user, loading } = useSession()
  const { path, navigate } = useHashRouter()
  const { openAuth } = useAuthDialog()

  if (loading) return <PageSkeleton />

  if (!user) {
    return (
      <div className="container-wide py-16">
        <EmptyState
          title="Sign in required"
          description="Please sign in to access your student dashboard."
          icon={<UserIcon className="size-12" />}
          action={<Button onClick={() => openAuth({ tab: 'login', redirectTo: '/dashboard' })} className="gradient-brand text-brand-foreground">Sign in</Button>}
        />
      </div>
    )
  }

  // Don't show student dashboard for admin-only paths
  return (
    <div className="container-wide py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 bg-card border-2 rounded-2xl shadow-md overflow-hidden">
            {/* User profile header - gradient background */}
            <div className="gradient-brand text-brand-foreground px-4 py-6 text-center">
              <div className="size-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-3xl font-bold mx-auto mb-3 border-2 border-white/30">
                {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="font-bold text-base">{user.name}</div>
              <div className="text-xs opacity-90 truncate">{user.email}</div>
            </div>
            {/* Nav items - centered, card-style */}
            <nav className="p-3 space-y-1.5">
              {nav.map((n) => {
                const active = path === n.path || (n.path !== '/dashboard' && path.startsWith(n.path))
                return (
                  <button
                    key={n.path}
                    onClick={() => navigate(n.path)}
                    className={cn(
                      'w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl text-sm font-bold transition-all text-center border-2',
                      active
                        ? 'gradient-brand text-brand-foreground border-transparent shadow-md scale-[1.02]'
                        : 'border-transparent text-foreground hover:bg-muted hover:border-border'
                    )}
                  >
                    <n.icon className="size-5 shrink-0" />
                    <span>{n.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </aside>

        {/* Mobile nav - centered dropdown with icons */}
        <div className="lg:hidden">
          <Select value={path} onValueChange={(v) => navigate(v)}>
            <SelectTrigger className="w-full text-center font-bold text-base h-12"><SelectValue /></SelectTrigger>
            <SelectContent>
              {nav.map((n) => (
                <SelectItem key={n.path} value={n.path}>
                  <span className="flex items-center gap-2 font-medium">
                    <n.icon className="size-4" />
                    {n.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Content */}
        <div className="min-w-0">
          <DashboardContent path={path} />
        </div>
      </div>
    </div>
  )
}

function DashboardContent({ path }: { path: string }) {
  if (path === '/dashboard' || path === '/dashboard/') return <OverviewTab />
  if (path.startsWith('/dashboard/applications/')) return <ApplicationDetailTab />
  if (path.startsWith('/dashboard/applications')) return <ApplicationsTab />
  if (path.startsWith('/dashboard/preferences')) return <PreferencesTab />
  if (path.startsWith('/dashboard/saved')) return <SavedCollegesTab />
  if (path.startsWith('/dashboard/comparisons')) return <ComparisonsTab />
  if (path.startsWith('/dashboard/support/')) return <QueryDetailTab />
  if (path.startsWith('/dashboard/support')) return <SupportTab />
  if (path.startsWith('/dashboard/notifications')) return <NotificationsTab />
  if (path.startsWith('/dashboard/profile')) return <ProfileTab />
  return <OverviewTab />
}

function OverviewTab() {
  const { navigate } = useHashRouter()
  const { user } = useSession()
  const [stats, setStats] = useState({ applications: 0, preferences: 0, saved: 0, tickets: 0, notifications: 0 })

  useEffect(() => {
    Promise.all([
      fetch('/api/student/applications', { cache: 'no-store' }).then((r) => r.json()),
      fetch('/api/student/preferences', { cache: 'no-store' }).then((r) => r.json()),
      fetch('/api/student/saved-colleges', { cache: 'no-store' }).then((r) => r.json()),
      fetch('/api/student/queries', { cache: 'no-store' }).then((r) => r.json()),
      fetch('/api/student/notifications', { cache: 'no-store' }).then((r) => r.json()),
    ]).then(([a, p, s, q, n]) => {
      setStats({
        applications: a.applications?.length || 0,
        preferences: p.preferences?.length || 0,
        saved: s.saved?.length || 0,
        tickets: q.queries?.length || 0,
        notifications: n.unreadCount || 0,
      })
    })
  }, [])

  const cards = [
    { label: 'Applications', value: stats.applications, icon: GraduationCap, color: 'text-emerald-600', path: '/dashboard/applications' },
    { label: 'Preference Orders', value: stats.preferences, icon: ListChecks, color: 'text-blue-600', path: '/dashboard/preferences' },
    { label: 'Saved Colleges', value: stats.saved, icon: Heart, color: 'text-rose-600', path: '/dashboard/saved' },
    { label: 'Support Tickets', value: stats.tickets, icon: MessageSquare, color: 'text-amber-600', path: '/dashboard/support' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Welcome back, {user?.name?.split(' ')[0]}!</h1>
        <p className="text-muted-foreground text-sm mt-1">Here's your counselling overview.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {cards.map((c) => (
          <Card key={c.label} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(c.path)}>
            <CardContent className="p-4">
              <c.icon className={cn('size-5 mb-2', c.color)} />
              <div className="text-2xl font-bold">{c.value}</div>
              <div className="text-xs text-muted-foreground">{c.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button variant="outline" onClick={() => navigate('/counselling')} className="justify-start">
            <GraduationCap className="mr-2 size-4" /> Browse counselling programs
          </Button>
          <Button variant="outline" onClick={() => navigate('/colleges')} className="justify-start">
            <Building2 className="mr-2 size-4" /> Explore colleges
          </Button>
          <Button variant="outline" onClick={() => navigate('/dashboard/support')} className="justify-start">
            <MessageSquare className="mr-2 size-4" /> Open a support ticket
          </Button>
          <Button variant="outline" onClick={() => navigate('/dashboard/profile')} className="justify-start">
            <UserIcon className="mr-2 size-4" /> Update profile
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

function ApplicationsTab() {
  const { navigate } = useHashRouter()
  const [apps, setApps] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/student/applications', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setApps(d.applications || []))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <PageSkeleton />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Applications</h1>
          <p className="text-sm text-muted-foreground">Track your counselling program registrations.</p>
        </div>
        <Button onClick={() => navigate('/counselling')} className="gradient-brand text-brand-foreground">
          <Plus className="mr-2 size-4" /> New application
        </Button>
      </div>

      {apps.length === 0 ? (
        <EmptyState
          title="No applications yet"
          description="Browse counselling programs and register to get started."
          icon={<GraduationCap className="size-12" />}
          action={<Button onClick={() => navigate('/counselling')} className="gradient-brand text-brand-foreground">Browse programs</Button>}
        />
      ) : (
        <div className="space-y-3">
          {apps.map((a) => (
            <Card key={a.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/dashboard/applications/${a.id}`)}>
              <CardContent className="p-4 flex items-start gap-4">
                <div className="size-12 rounded-lg gradient-brand text-brand-foreground flex items-center justify-center shrink-0">
                  <GraduationCap className="size-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-sm">{a.program.title}</h3>
                    <Badge variant={statusVariant(a.status)} className="shrink-0 text-[10px]">{formatStatus(a.status)}</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">{a.applicationId}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Applied on {new Date(a.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function ApplicationDetailTab() {
  const { path, navigate } = useHashRouter()
  const appId = path.split('/').pop() || ''
  const [app, setApp] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    fetch(`/api/student/applications/${appId}`, { cache: 'no-store' })
      .then((r) => {
        if (!r.ok) throw new Error('not found')
        return r.json()
      })
      .then((d) => {
        setApp(d.application)
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [appId])

  if (loading) return <PageSkeleton />
  if (notFound || !app) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => navigate('/dashboard/applications')}>
          <ArrowLeft className="mr-2 size-4" /> Back to applications
        </Button>
        <EmptyState title="Application not found" description="This application does not exist." />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={() => navigate('/dashboard/applications')}>
        <ArrowLeft className="mr-2 size-4" /> Back to applications
      </Button>

      <div>
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <h1 className="text-2xl font-bold">{app.program?.title}</h1>
          <Badge variant={statusVariant(app.status)} className="text-[10px]">{formatStatus(app.status)}</Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          Application ID: <span className="font-mono">{app.applicationId}</span>
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          Applied on {new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Application Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {app.formData && typeof app.formData === 'object' && Object.entries(app.formData).map(([k, v]: [string, any]) => (
            <div key={k} className="flex items-start gap-2">
              <span className="font-medium capitalize min-w-[140px]">{k.replace(/([A-Z])/g, ' $1').trim()}:</span>
              <span className="text-muted-foreground">{String(v || '-')}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {app.notes && (
        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="text-base">Admin Notes</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">{app.notes}</CardContent>
        </Card>
      )}
    </div>
  )
}

function PreferencesTab() {
  const { navigate } = useHashRouter()
  const [prefs, setPrefs] = useState<PreferenceOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<PreferenceOrder | null>(null)

  const load = useCallback(() => {
    fetch('/api/student/preferences', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setPrefs(d.preferences || []))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  if (loading) return <PageSkeleton />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Preference Guidance</h1>
        <p className="text-sm text-muted-foreground">
          Your personalised college + branch preference orders, prepared by our expert counsellors.
        </p>
      </div>

      {prefs.length === 0 ? (
        <EmptyState
          title="No preference orders yet"
          description="Register for a counselling program to receive a personalised preference order."
          icon={<ListChecks className="size-12" />}
          action={<Button onClick={() => navigate('/counselling')} className="gradient-brand text-brand-foreground">Browse programs</Button>}
        />
      ) : (
        <div className="space-y-3">
          {prefs.map((p) => (
            <Card key={p.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelected(p)}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold">Preference Order</h3>
                  <Badge variant={p.status === 'PUBLISHED' ? 'default' : 'secondary'} className="text-[10px]">
                    {p.status}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  {p.items.length} colleges in your preference list
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {p.items.slice(0, 5).map((it) => (
                    <Badge key={it.id} variant="outline" className="text-[10px]">
                      {it.rank}. {it.college.shortName || it.college.name}
                    </Badge>
                  ))}
                  {p.items.length > 5 && (
                    <Badge variant="outline" className="text-[10px]">+{p.items.length - 5} more</Badge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Updated {new Date(p.updatedAt).toLocaleDateString('en-IN')}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Detail dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto scroll-pretty">
          <DialogHeader>
            <DialogTitle>Your Preference Order</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-3">
              {selected.notes && (
                <Card className="bg-muted/30">
                  <CardContent className="p-3 text-sm">
                    <div className="font-medium text-xs text-muted-foreground mb-1">Counsellor notes</div>
                    {selected.notes}
                  </CardContent>
                </Card>
              )}
              <ol className="space-y-2">
                {selected.items.map((it) => (
                  <li key={it.id}>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="size-8 rounded-full gradient-brand text-brand-foreground flex items-center justify-center text-sm font-bold shrink-0">
                            {it.rank}
                          </div>
                          <div className="flex-1 min-w-0">
                            <button
                              onClick={() => { setSelected(null); navigate(`/colleges/${it.college.slug}`) }}
                              className="font-medium text-sm hover:text-primary"
                            >
                              {it.college.name}
                            </button>
                            {it.branch && (
                              <div className="text-xs text-muted-foreground">
                                {it.branch.fullName || it.branch.name}
                                {it.branch.feesAnnual && ` • ₹${(it.branch.feesAnnual / 100000).toFixed(1)}L/yr`}
                              </div>
                            )}
                            {it.recommendation && (
                              <div className="text-sm text-muted-foreground mt-1 italic">
                                "{it.recommendation}"
                              </div>
                            )}
                            {it.notes && (
                              <div className="text-xs text-muted-foreground mt-1">{it.notes}</div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </li>
                ))}
              </ol>
              {selected.pdfUrl && (
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-4 flex items-center gap-3">
                    <FileText className="size-8 text-primary shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">Preference Order Document</div>
                      <div className="text-xs text-muted-foreground truncate">{selected.pdfName || 'PDF file'}</div>
                    </div>
                    <Button asChild size="sm" className="gradient-brand text-brand-foreground shrink-0">
                      <a href={selected.pdfUrl} target="_blank" rel="noopener noreferrer">
                        <Download className="mr-1 size-3.5" /> Download
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function SavedCollegesTab() {
  const { navigate } = useHashRouter()
  const [saved, setSaved] = useState<Array<{ id: string; college: CollegeListItem }>>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(() => {
    fetch('/api/student/saved-colleges', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setSaved(d.saved || []))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  if (loading) return <PageSkeleton />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Saved Colleges</h1>
          <p className="text-sm text-muted-foreground">Colleges you've bookmarked for later.</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/colleges')}>
          <Plus className="mr-1 size-4" /> Browse colleges
        </Button>
      </div>

      {saved.length === 0 ? (
        <EmptyState
          title="No saved colleges"
          description="Click the heart icon on any college to save it here."
          icon={<Heart className="size-12" />}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {saved.map((s) => (
            <Card key={s.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/colleges/${s.college.slug}`)}>
              <CardContent className="p-4 flex items-start gap-3">
                <Building2 className="size-8 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm">{s.college.name}</h3>
                  <div className="text-xs text-muted-foreground">{s.college.city}, {s.college.state}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function ComparisonsTab() {
  const { navigate } = useHashRouter()
  const [comparisons, setComparisons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/student/comparisons', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setComparisons(d.comparisons || []))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <PageSkeleton />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">College Comparisons</h1>
        <p className="text-sm text-muted-foreground">Saved college comparisons.</p>
      </div>

      {comparisons.length === 0 ? (
        <EmptyState
          title="No comparisons yet"
          description="Compare colleges side by side to make informed decisions."
          icon={<GitCompare className="size-12" />}
          action={<Button onClick={() => navigate('/colleges')} className="gradient-brand text-brand-foreground">Browse colleges</Button>}
        />
      ) : (
        <div className="space-y-3">
          {comparisons.map((c) => (
            <Card key={c.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => {
              const ids = [c.collegeA?.slug, c.collegeB?.slug, c.collegeC?.slug].filter(Boolean).join(',')
              navigate(`/compare?ids=${ids}`)
            }}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 flex-wrap">
                  {c.collegeA && <Badge variant="secondary">{c.collegeA.name}</Badge>}
                  {c.collegeB && <Badge variant="secondary">{c.collegeB.name}</Badge>}
                  {c.collegeC && <Badge variant="secondary">{c.collegeC.name}</Badge>}
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Created {new Date(c.createdAt).toLocaleDateString('en-IN')}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function SupportTab() {
  const { navigate } = useHashRouter()
  const [queries, setQueries] = useState<Query[]>([])
  const [loading, setLoading] = useState(true)
  const [newOpen, setNewOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(() => {
    fetch('/api/student/queries', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setQueries(d.queries || []))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    const formData = new FormData(e.currentTarget)
    const body = Object.fromEntries(formData.entries())
    try {
      const res = await fetch('/api/student/queries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to create ticket')
        return
      }
      setNewOpen(false)
      load()
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <PageSkeleton />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Support Tickets</h1>
          <p className="text-sm text-muted-foreground">Get help from our team.</p>
        </div>
        <Button onClick={() => setNewOpen(true)} className="gradient-brand text-brand-foreground">
          <Plus className="mr-2 size-4" /> New ticket
        </Button>
      </div>

      {queries.length === 0 ? (
        <EmptyState
          title="No tickets yet"
          description="Have a question? Open a ticket and our team will help you."
          icon={<MessageSquare className="size-12" />}
          action={<Button onClick={() => setNewOpen(true)} className="gradient-brand text-brand-foreground">New ticket</Button>}
        />
      ) : (
        <div className="space-y-3">
          {queries.map((q) => (
            <Card key={q.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/dashboard/support/${q.id}`)}>
              <CardContent className="p-4 flex items-start gap-3">
                <div className="shrink-0">
                  {q.status === 'OPEN' && <Circle className="size-5 text-blue-500" />}
                  {q.status === 'IN_PROGRESS' && <Clock className="size-5 text-amber-500" />}
                  {q.status === 'RESOLVED' && <CheckCircle2 className="size-5 text-green-600" />}
                  {q.status === 'CLOSED' && <X className="size-5 text-muted-foreground" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-sm">{q.subject}</h3>
                    <Badge variant={statusVariant(q.status)} className="text-[10px] shrink-0">{formatStatus(q.status)}</Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="font-mono">{q.ticketId}</span>
                    <Badge variant="outline" className="text-[10px]">{q.category}</Badge>
                    {q._count && <span>{q._count.messages} messages</span>}
                    <span>{new Date(q.updatedAt).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* New ticket dialog */}
      <Dialog open={newOpen} onOpenChange={setNewOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New support ticket</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <Label htmlFor="subject" className="text-xs">Subject *</Label>
              <Input id="subject" name="subject" required placeholder="Brief summary of your issue" />
            </div>
            <div>
              <Label htmlFor="category" className="text-xs">Category *</Label>
              <Select name="category" defaultValue="GENERAL" required>
                <SelectTrigger id="category"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="GENERAL">General</SelectItem>
                  <SelectItem value="ADMISSION">Admission</SelectItem>
                  <SelectItem value="COUNSELLING">Counselling</SelectItem>
                  <SelectItem value="TECHNICAL">Technical</SelectItem>
                  <SelectItem value="PAYMENT">Payment</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="priority" className="text-xs">Priority</Label>
              <Select name="priority" defaultValue="NORMAL">
                <SelectTrigger id="priority"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="NORMAL">Normal</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="message" className="text-xs">Message *</Label>
              <Textarea id="message" name="message" required rows={5} placeholder="Describe your issue in detail..." />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={submitting} className="w-full gradient-brand text-brand-foreground">
              {submitting && <Loader2 className="size-4 mr-2 animate-spin" />}
              Create ticket
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function QueryDetailTab() {
  const { path, navigate } = useHashRouter()
  const queryId = path.split('/').pop() || ''
  const [query, setQuery] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/student/queries/${queryId}`, { cache: 'no-store' })
      if (!res.ok) {
        setError('Ticket not found')
        return
      }
      const data = await res.json()
      setQuery(data.query)
    } catch {
      setError('Failed to load ticket')
    } finally {
      setLoading(false)
    }
  }, [queryId])

  useEffect(() => {
    load()
  }, [load])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [query?.messages])

  const handleReply = async () => {
    if (!reply.trim()) return
    setSending(true)
    setError(null)
    try {
      const res = await fetch(`/api/student/queries/${queryId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: reply }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Failed to send reply')
        return
      }
      setReply('')
      load()
    } finally {
      setSending(false)
    }
  }

  if (loading) return <PageSkeleton />
  if (error || !query) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => navigate('/dashboard/support')}>
          <ArrowLeft className="mr-2 size-4" /> Back to tickets
        </Button>
        <EmptyState title="Ticket not found" description={error || 'The ticket you are looking for does not exist.'} />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Back button + header */}
      <div className="space-y-3">
        <Button variant="outline" onClick={() => navigate('/dashboard/support')}>
          <ArrowLeft className="mr-2 size-4" /> Back to tickets
        </Button>
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h1 className="text-xl md:text-2xl font-bold">{query.subject}</h1>
            <Badge variant={statusVariant(query.status)} className="text-[10px]">{formatStatus(query.status)}</Badge>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="font-mono">{query.ticketId}</span>
            <Badge variant="outline" className="text-[10px]">{query.category}</Badge>
            <Badge variant="outline" className="text-[10px]">{query.priority}</Badge>
            <span>Created {new Date(query.createdAt).toLocaleDateString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Messages thread */}
      <Card className="flex flex-col" style={{ height: '60vh', minHeight: '400px' }}>
        <CardHeader className="border-b shrink-0">
          <CardTitle className="text-base">Conversation</CardTitle>
        </CardHeader>
        <div className="flex-1 overflow-y-auto scroll-pretty p-4 space-y-3">
          {query.messages?.length === 0 ? (
            <div className="text-center py-8 text-sm text-muted-foreground">No messages yet</div>
          ) : (
            query.messages?.map((m: any) => {
              const isStudent = m.senderRole === 'STUDENT'
              const isAdmin = m.senderRole === 'ADMIN' || m.senderRole === 'COUNSELLOR'
              return (
                <div key={m.id} className={cn('flex', isStudent ? 'justify-end' : 'justify-start')}>
                  <div className={cn(
                    'max-w-[80%] rounded-lg p-3',
                    isStudent
                      ? 'gradient-brand text-brand-foreground'
                      : 'bg-muted'
                  )}>
                    <div className="text-xs opacity-80 mb-1 flex items-center gap-1">
                      {isAdmin && <ShieldCheck className="size-3" />}
                      <span className="font-medium">
                        {isStudent ? 'You' : m.senderRole === 'COUNSELLOR' ? 'Counsellor' : 'Admin'}
                      </span>
                      <span>•</span>
                      <span>{new Date(m.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="text-sm whitespace-pre-wrap break-words">{m.message}</div>
                  </div>
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>
        {/* Reply box */}
        <div className="border-t p-3 shrink-0">
          <div className="flex gap-2">
            <Textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Type your reply..."
              rows={2}
              className="flex-1 resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleReply()
                }
              }}
            />
            <Button
              onClick={handleReply}
              disabled={sending || !reply.trim()}
              className="gradient-brand text-brand-foreground shrink-0"
            >
              {sending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            </Button>
          </div>
          {error && <p className="text-sm text-destructive mt-2">{error}</p>}
        </div>
      </Card>
    </div>
  )
}

function NotificationsTab() {
  const [notifs, setNotifs] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(() => {
    fetch('/api/student/notifications', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setNotifs(d.notifications || []))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  if (loading) return <PageSkeleton />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Notifications</h1>
        <p className="text-sm text-muted-foreground">Updates about your applications and counselling.</p>
      </div>

      {notifs.length === 0 ? (
        <EmptyState
          title="No notifications"
          description="You'll see updates about your applications and counselling here."
          icon={<Bell className="size-12" />}
        />
      ) : (
        <div className="space-y-2">
          {notifs.map((n) => (
            <Card
              key={n.id}
              className={cn(!n.read && 'border-primary/40 bg-primary/5')}
              onClick={async () => {
                if (!n.read) {
                  await fetch(`/api/student/notifications/${n.id}/read`, { method: 'PATCH' })
                  load()
                }
              }}
            >
              <CardContent className="p-4 flex items-start gap-3 cursor-pointer">
                <div className="shrink-0">
                  {n.type === 'SUCCESS' && <CheckCircle2 className="size-5 text-green-600" />}
                  {n.type === 'INFO' && <AlertCircle className="size-5 text-blue-600" />}
                  {n.type === 'WARNING' && <AlertCircle className="size-5 text-amber-600" />}
                  {n.type === 'ERROR' && <X className="size-5 text-red-600" />}
                  {n.type === 'ANNOUNCEMENT' && <Bell className="size-5 text-primary" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-sm">{n.title}</h3>
                    {!n.read && <Badge variant="default" className="text-[10px]">New</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{n.message}</p>
                  <div className="text-xs text-muted-foreground mt-1">
                    {new Date(n.createdAt).toLocaleString('en-IN')}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function ProfileTab() {
  const { user } = useSession()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/student/profile', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setProfile(d.profile || {}))
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    const formData = new FormData(e.currentTarget)
    const body = Object.fromEntries(formData.entries())
    try {
      await fetch('/api/student/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <PageSkeleton />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-sm text-muted-foreground">Update your personal and academic information.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="name" className="text-xs">Full Name *</Label>
              <Input id="name" name="name" defaultValue={profile.fullName || user?.name || ''} required />
            </div>
            <div>
              <Label htmlFor="phone" className="text-xs">Phone</Label>
              <Input id="phone" name="phone" defaultValue={profile.phone || ''} />
            </div>
            <div>
              <Label htmlFor="email" className="text-xs">Email</Label>
              <Input id="email" value={user?.email || ''} disabled className="bg-muted/50" />
            </div>
            <div>
              <Label htmlFor="state" className="text-xs">State</Label>
              <Input id="state" name="state" defaultValue={profile.state || ''} />
            </div>
            <div>
              <Label htmlFor="city" className="text-xs">City</Label>
              <Input id="city" name="city" defaultValue={profile.city || ''} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Academic Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="examType" className="text-xs">Exam</Label>
              <Select name="examType" defaultValue={profile.examType || 'JEE_MAIN'}>
                <SelectTrigger id="examType"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="JEE_MAIN">JEE Main</SelectItem>
                  <SelectItem value="JEE_ADVANCED">JEE Advanced</SelectItem>
                  <SelectItem value="NEET">NEET</SelectItem>
                  <SelectItem value="GATE">GATE</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="examRank" className="text-xs">Exam Rank</Label>
              <Input id="examRank" name="examRank" defaultValue={profile.examRank || ''} placeholder="e.g. AIR 4500" />
            </div>
            <div>
              <Label htmlFor="examPercentile" className="text-xs">Percentile</Label>
              <Input id="examPercentile" name="examPercentile" defaultValue={profile.examPercentile || ''} placeholder="e.g. 95.34" />
            </div>
            <div>
              <Label htmlFor="category" className="text-xs">Category</Label>
              <Select name="category" defaultValue={profile.category || 'General'}>
                <SelectTrigger id="category"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="General">General</SelectItem>
                  <SelectItem value="OBC">OBC</SelectItem>
                  <SelectItem value="SC">SC</SelectItem>
                  <SelectItem value="ST">ST</SelectItem>
                  <SelectItem value="EWS">EWS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="preferredCourse" className="text-xs">Preferred Course</Label>
              <Input id="preferredCourse" name="preferredCourse" defaultValue={profile.preferredCourse || ''} placeholder="B.Tech" />
            </div>
            <div>
              <Label htmlFor="preferredBranch" className="text-xs">Preferred Branch</Label>
              <Input id="preferredBranch" name="preferredBranch" defaultValue={profile.preferredBranch || ''} placeholder="CSE" />
            </div>
            <div>
              <Label htmlFor="targetYear" className="text-xs">Target Year</Label>
              <Input id="targetYear" name="targetYear" defaultValue={profile.targetYear || ''} placeholder="2026" />
            </div>
            <div>
              <Label htmlFor="classLevel" className="text-xs">Class Level</Label>
              <Select name="classLevel" defaultValue={profile.classLevel || '12th_pass'}>
                <SelectTrigger id="classLevel"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="12th_studying">12th Studying</SelectItem>
                  <SelectItem value="12th_pass">12th Pass</SelectItem>
                  <SelectItem value="graduate">Graduate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={saving} className="gradient-brand text-brand-foreground">
            {saving && <Loader2 className="size-4 mr-2 animate-spin" />}
            Save profile
          </Button>
          {saved && (
            <span className="text-sm text-green-600 flex items-center gap-1">
              <CheckCircle2 className="size-4" /> Saved
            </span>
          )}
        </div>
      </form>

      {/* Change Password */}
      <ChangePasswordSection />
    </div>
  )
}

function ChangePasswordSection() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      return
    }
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to change password')
        return
      }
      setSuccess(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setSuccess(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-base">Change Password</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
          <div>
            <Label htmlFor="currentPassword" className="text-xs">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          <div>
            <Label htmlFor="newPassword" className="text-xs">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              placeholder="Min 8 characters"
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword" className="text-xs">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              placeholder="Re-enter new password"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          {success && (
            <p className="text-sm text-green-600 flex items-center gap-1">
              <CheckCircle2 className="size-4" /> Password changed successfully!
            </p>
          )}
          <Button type="submit" disabled={saving} className="gradient-brand text-brand-foreground">
            {saving && <Loader2 className="size-4 mr-2 animate-spin" />}
            Change Password
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

// Helper functions
function statusVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'SUBMITTED': return 'secondary'
    case 'APPROVED':
    case 'ENROLLED':
    case 'PUBLISHED':
    case 'RESOLVED':
      return 'default'
    case 'REJECTED':
    case 'CLOSED':
      return 'destructive'
    default: return 'outline'
  }
}

function formatStatus(status: string): string {
  return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}
