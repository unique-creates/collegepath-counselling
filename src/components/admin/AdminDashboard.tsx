'use client'

import { useEffect, useState, useCallback } from 'react'
import { useHashRouter } from '@/lib/router'
import { useSession } from '@/lib/session'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { PageSkeleton, EmptyState } from '@/components/site/LoadingStates'
import { useAuthDialog } from '@/lib/auth-dialog'
import { useSettings } from '@/lib/settings'
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Building2,
  FileText,
  HelpCircle,
  MessageSquare,
  UserPlus,
  ListChecks,
  Settings,
  Search,
  Loader2,
  Pencil,
  Trash2,
  Plus,
  X,
  TrendingUp,
  Star,
  Eye,
  CheckCircle2,
  Clock,
  Send,
  Radio,
  MessageSquareWarning,
  Megaphone,
  Upload,
  Check,
  IndianRupee,
} from 'lucide-react'
import type { Lead } from '@/lib/types'
import { cn } from '@/lib/utils'

const nav = [
  { label: 'Overview', path: '/admin', icon: LayoutDashboard },
  { label: 'Users', path: '/admin/users', icon: Users },
  { label: 'Programs', path: '/admin/programs', icon: GraduationCap },
  { label: 'Applications', path: '/admin/applications', icon: ListChecks },
  { label: 'Preference Orders', path: '/admin/preferences', icon: ListChecks },
  { label: 'Colleges', path: '/admin/colleges', icon: Building2 },
  { label: 'Blog', path: '/admin/blog', icon: FileText },
  { label: 'FAQs', path: '/admin/faqs', icon: HelpCircle },
  { label: 'Queries', path: '/admin/queries', icon: MessageSquare },
  { label: 'Leads', path: '/admin/leads', icon: UserPlus },
  { label: 'Testimonials', path: '/admin/testimonials', icon: Star },
  { label: 'Contact Messages', path: '/admin/contact', icon: MessageSquare },
  { label: 'Live Updates', path: '/admin/live-updates', icon: Radio },
  { label: 'Popups', path: '/admin/popups', icon: MessageSquareWarning },
  { label: 'Banners', path: '/admin/banners', icon: Megaphone },
  { label: 'Settings', path: '/admin/settings', icon: Settings },
]

export function AdminDashboard() {
  const { user, loading } = useSession()
  const { path, navigate } = useHashRouter()
  const { openAuth } = useAuthDialog()

  if (loading) return <PageSkeleton />

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="container-wide py-16">
        <EmptyState
          title="Admin access required"
          description="Sign in with an admin account to access the dashboard."
          icon={<Settings className="size-12" />}
          action={<Button onClick={() => openAuth({ tab: 'login', redirectTo: '/admin' })} className="gradient-brand text-brand-foreground">Sign in as admin</Button>}
        />
      </div>
    )
  }

  return (
    <div className="container-wide py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 bg-card border-2 rounded-2xl shadow-md overflow-hidden">
            {/* Admin profile header - gradient background */}
            <div className="gradient-brand text-brand-foreground px-4 py-6 text-center">
              <div className="size-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-3xl font-bold mx-auto mb-3 border-2 border-white/30">
                {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'A'}
              </div>
              <div className="font-bold text-base">{user.name}</div>
              <div className="text-xs opacity-90 truncate">{user.email}</div>
              <div className="inline-block mt-2 px-2 py-0.5 rounded-full bg-white/20 text-xs font-bold">
                ADMIN
              </div>
            </div>
            {/* Nav items - centered, card-style */}
            <nav className="p-3 space-y-1.5 max-h-[60vh] overflow-y-auto scroll-pretty">
              {nav.map((n) => {
                const active = path === n.path || (n.path !== '/admin' && path.startsWith(n.path))
                return (
                  <button
                    key={n.path}
                    onClick={() => navigate(n.path)}
                    className={cn(
                      'w-full flex items-center justify-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold transition-all text-center border-2',
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

        <div className="min-w-0">
          <AdminContent path={path} />
        </div>
      </div>
    </div>
  )
}

function AdminContent({ path }: { path: string }) {
  if (path === '/admin' || path === '/admin/') return <AdminOverview />
  if (path.startsWith('/admin/users')) return <AdminUsers />
  if (path.startsWith('/admin/programs')) return <AdminPrograms />
  if (path.startsWith('/admin/applications')) return <AdminApplications />
  if (path.startsWith('/admin/preferences')) return <AdminPreferences />
  if (path.startsWith('/admin/colleges')) return <AdminColleges />
  if (path.startsWith('/admin/blog')) return <AdminBlog />
  if (path.startsWith('/admin/faqs')) return <AdminFAQs />
  if (path.startsWith('/admin/queries')) return <AdminQueries />
  if (path.startsWith('/admin/leads')) return <AdminLeads />
  if (path.startsWith('/admin/testimonials')) return <AdminTestimonials />
  if (path.startsWith('/admin/contact')) return <AdminContactMessages />
  if (path.startsWith('/admin/live-updates')) return <AdminLiveUpdates />
  if (path.startsWith('/admin/popups')) return <AdminPopups />
  if (path.startsWith('/admin/banners')) return <AdminBanners />
  if (path.startsWith('/admin/settings')) return <AdminSettings />
  return <AdminOverview />
}

function AdminOverview() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/analytics', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setData(d))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <PageSkeleton />

  const cards = [
    { label: 'Total Users', value: data?.overview.totalUsers, sub: `+${data?.overview.newUsers} this month`, icon: Users, color: 'text-emerald-600' },
    { label: 'Applications', value: data?.overview.counsellingRegistrations, sub: `+${data?.overview.newApplications} this week`, icon: ListChecks, color: 'text-blue-600' },
    { label: 'Leads', value: data?.overview.leads, sub: `+${data?.overview.newLeads} this week`, icon: UserPlus, color: 'text-amber-600' },
    { label: 'Open Queries', value: data?.overview.openQueries, sub: `${data?.overview.queries} total`, icon: MessageSquare, color: 'text-rose-600' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Overview of platform activity.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <c.icon className={cn('size-5', c.color)} />
                <TrendingUp className="size-3 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">{c.value}</div>
              <div className="text-xs text-muted-foreground">{c.label}</div>
              <div className="text-xs text-emerald-600 mt-1">{c.sub}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Popular Programs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data?.programStats?.map((p: any) => (
                <div key={p.id} className="flex items-center justify-between text-sm">
                  <span className="truncate">{p.title}</span>
                  <Badge variant="secondary">{p.applications} apps</Badge>
                </div>
              )) || <p className="text-sm text-muted-foreground">No data</p>}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Colleges (by saves)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data?.topColleges?.map((c: any) => (
                <div key={c.id} className="flex items-center justify-between text-sm">
                  <span className="truncate">{c.name}</span>
                  <Badge variant="secondary">{c.saves} saves</Badge>
                </div>
              )) || <p className="text-sm text-muted-foreground">No data</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Conversion Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-muted-foreground">Lead → User conversion</div>
              <div className="text-xl font-bold text-emerald-600">{data?.overview.leadConversionRate}%</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Converted Leads</div>
              <div className="text-xl font-bold">{data?.overview.convertedLeads}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Total Counsellors</div>
              <div className="text-xl font-bold">{data?.overview.totalCounsellors}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Published Posts</div>
              <div className="text-xl font-bold">{data?.overview.publishedPosts}/{data?.overview.totalPosts}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function AdminUsers() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const load = useCallback(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    params.set('page', String(page))
    fetch(`/api/admin/users?${params}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        setUsers(d.users || [])
        setTotalPages(d.pagination?.totalPages || 1)
      })
      .finally(() => setLoading(false))
  }, [search, page])

  useEffect(() => { load() }, [load])

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Users</h1>
        <p className="text-sm text-muted-foreground">Manage student, counsellor and admin accounts.</p>
      </div>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email..." className="pl-9" />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-sm text-muted-foreground">Loading...</div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">No users found</div>
          ) : (
            <div className="overflow-x-auto scroll-pretty">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Apps</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{u.email}</TableCell>
                      <TableCell><Badge variant="outline">{u.role}</Badge></TableCell>
                      <TableCell>
                        <Badge variant={u.status === 'ACTIVE' ? 'default' : u.status === 'PENDING' ? 'secondary' : 'destructive'}>
                          {u.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{u._count?.applications || 0}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{new Date(u.createdAt).toLocaleDateString('en-IN')}</TableCell>
                      <TableCell className="text-right">
                        <Select
                          value={u.status}
                          onValueChange={async (v) => {
                            await fetch(`/api/admin/users/${u.id}`, {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ status: v }),
                            })
                            load()
                          }}
                        >
                          <SelectTrigger className="w-[120px] h-8 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ACTIVE">Activate</SelectItem>
                            <SelectItem value="SUSPENDED">Suspend</SelectItem>
                            <SelectItem value="PENDING">Pending</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Previous</Button>
          <span className="text-sm">Page {page} of {totalPages}</span>
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</Button>
        </div>
      )}
    </div>
  )
}

function AdminPrograms() {
  const [programs, setPrograms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<any | null>(null)
  const [creating, setCreating] = useState(false)

  const load = useCallback(() => {
    fetch('/api/admin/programs', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setPrograms(d.programs || []))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Counselling Programs</h1>
          <p className="text-sm text-muted-foreground">Create and manage counselling programs.</p>
        </div>
        <Button onClick={() => setCreating(true)} className="gradient-brand text-brand-foreground">
          <Plus className="mr-2 size-4" /> New program
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-sm text-muted-foreground">Loading...</div>
      ) : programs.length === 0 ? (
        <EmptyState title="No programs yet" description="Create your first counselling program." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {programs.map((p) => (
            <Card key={p.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-semibold text-sm">{p.title}</h3>
                    <div className="text-xs text-muted-foreground font-mono">/{p.slug}</div>
                  </div>
                  <Badge variant={p.status === 'PUBLISHED' ? 'default' : 'secondary'} className="text-[10px]">{p.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{p.shortDescription}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                  <Badge variant="outline">{p.isPaid ? `₹${p.price}` : 'Free'}</Badge>
                  {p.featured && <Badge variant="outline">Featured</Badge>}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setEditing(p)} className="flex-1">
                    <Pencil className="size-3.5 mr-1" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      if (confirm('Delete this program?')) {
                        await fetch(`/api/admin/programs/${p.id}`, { method: 'DELETE' })
                        load()
                      }
                    }}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {(editing || creating) && (
        <ProgramEditDialog
          program={editing}
          onClose={() => { setEditing(null); setCreating(false) }}
          onSaved={() => { setEditing(null); setCreating(false); load() }}
        />
      )}
    </div>
  )
}

function ProgramEditDialog({ program, onClose, onSaved }: { program: any | null; onClose: () => void; onSaved: () => void }) {
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: program?.title || '',
    slug: program?.slug || '',
    shortDescription: program?.shortDescription || '',
    description: program?.description || '',
    eligibility: program?.eligibility || '',
    duration: program?.duration || '',
    price: program?.price || 0,
    isPaid: program?.isPaid || false,
    status: program?.status || 'PUBLISHED',
    featured: program?.featured || false,
    whatIncluded: (program?.whatIncluded || []).join('\n'),
    benefits: (program?.benefits || []).join('\n'),
    process: (program?.process || []).join('\n'),
    faqs: (program?.faqs || []).map((f: any) => `${f.q}|||${f.a}`).join('\n'),
    heroImage: program?.heroImage || '',
    seoTitle: program?.seoTitle || '',
    seoDescription: program?.seoDescription || '',
    seoKeywords: program?.seoKeywords || '',
    ogImage: program?.ogImage || '',
    canonicalUrl: program?.canonicalUrl || '',
    noindex: program?.noindex || false,
  })

  const handleSave = async () => {
    setSaving(true)
    const body = {
      title: form.title,
      slug: form.slug,
      shortDescription: form.shortDescription,
      description: form.description,
      eligibility: form.eligibility,
      duration: form.duration,
      price: Number(form.price),
      isPaid: form.isPaid,
      status: form.status,
      featured: form.featured,
      whatIncluded: form.whatIncluded.split('\n').filter(Boolean),
      benefits: form.benefits.split('\n').filter(Boolean),
      process: form.process.split('\n').filter(Boolean),
      faqs: form.faqs.split('\n').filter(Boolean).map((l) => {
        const [q, a] = l.split('|||')
        return { q: q?.trim(), a: a?.trim() }
      }),
      heroImage: form.heroImage,
      seoTitle: form.seoTitle,
      seoDescription: form.seoDescription,
      seoKeywords: form.seoKeywords,
      ogImage: form.ogImage,
      canonicalUrl: form.canonicalUrl,
      noindex: form.noindex,
    }
    try {
      const url = program ? `/api/admin/programs/${program.id}` : '/api/admin/programs'
      const method = program ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const data = await res.json()
        alert(data.error || 'Save failed')
        return
      }
      onSaved()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto scroll-pretty">
        <DialogHeader>
          <DialogTitle>{program ? 'Edit Program' : 'New Program'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs">Slug (auto from title)</Label>
              <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated" />
            </div>
          </div>
          <div>
            <Label className="text-xs">Short Description</Label>
            <Input value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} />
          </div>
          <div>
            <Label className="text-xs">Description</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
          </div>
          <div>
            <Label className="text-xs">Eligibility</Label>
            <Textarea value={form.eligibility} onChange={(e) => setForm({ ...form, eligibility: e.target.value })} rows={2} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs">Duration</Label>
              <Input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="7-10 days" />
            </div>
            <div>
              <Label className="text-xs">Price (₹)</Label>
              <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
            </div>
            <div>
              <Label className="text-xs">Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label className="text-xs">Hero Image URL</Label>
            <Input value={form.heroImage} onChange={(e) => setForm({ ...form, heroImage: e.target.value })} placeholder="https://..." />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.isPaid} onChange={(e) => setForm({ ...form, isPaid: e.target.checked })} />
              Paid
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
              Featured
            </label>
          </div>
          <div>
            <Label className="text-xs">What's Included (one per line)</Label>
            <Textarea value={form.whatIncluded} onChange={(e) => setForm({ ...form, whatIncluded: e.target.value })} rows={4} />
          </div>
          <div>
            <Label className="text-xs">Benefits (one per line)</Label>
            <Textarea value={form.benefits} onChange={(e) => setForm({ ...form, benefits: e.target.value })} rows={3} />
          </div>
          <div>
            <Label className="text-xs">Process (one per line)</Label>
            <Textarea value={form.process} onChange={(e) => setForm({ ...form, process: e.target.value })} rows={4} />
          </div>
          <div>
            <Label className="text-xs">FAQs (format: Question|||Answer, one per line)</Label>
            <Textarea value={form.faqs} onChange={(e) => setForm({ ...form, faqs: e.target.value })} rows={3} placeholder="What documents do I need?|||You will need..." />
          </div>

          <div className="border-t pt-3 mt-3">
            <div className="text-sm font-semibold mb-2">SEO</div>
            <div className="space-y-3">
              <div>
                <Label className="text-xs">SEO Title</Label>
                <Input value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs">SEO Description</Label>
                <Textarea value={form.seoDescription} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })} rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">SEO Keywords</Label>
                  <Input value={form.seoKeywords} onChange={(e) => setForm({ ...form, seoKeywords: e.target.value })} />
                </div>
                <div>
                  <Label className="text-xs">OG Image URL</Label>
                  <Input value={form.ogImage} onChange={(e) => setForm({ ...form, ogImage: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Canonical URL</Label>
                  <Input value={form.canonicalUrl} onChange={(e) => setForm({ ...form, canonicalUrl: e.target.value })} />
                </div>
                <label className="flex items-center gap-2 text-sm pt-5">
                  <input type="checkbox" checked={form.noindex} onChange={(e) => setForm({ ...form, noindex: e.target.checked })} />
                  Noindex (hide from search)
                </label>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving} className="gradient-brand text-brand-foreground">
            {saving && <Loader2 className="size-4 mr-2 animate-spin" />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function AdminApplications() {
  const [apps, setApps] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selected, setSelected] = useState<any | null>(null)

  const load = useCallback(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (status) params.set('status', status)
    params.set('page', String(page))
    fetch(`/api/admin/applications?${params}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        setApps(d.applications || [])
        setTotalPages(d.pagination?.totalPages || 1)
      })
      .finally(() => setLoading(false))
  }, [status, page])

  useEffect(() => { load() }, [load])

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Applications</h1>
        <p className="text-sm text-muted-foreground">Manage counselling program applications.</p>
      </div>
      <Select value={status || 'all'} onValueChange={(v) => { setStatus(v === 'all' ? '' : v); setPage(1) }}>
        <SelectTrigger className="w-[180px]"><SelectValue placeholder="All statuses" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="SUBMITTED">Submitted</SelectItem>
          <SelectItem value="REVIEWING">Reviewing</SelectItem>
          <SelectItem value="APPROVED">Approved</SelectItem>
          <SelectItem value="ENROLLED">Enrolled</SelectItem>
          <SelectItem value="REJECTED">Rejected</SelectItem>
        </SelectContent>
      </Select>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-sm text-muted-foreground">Loading...</div>
          ) : apps.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">No applications found</div>
          ) : (
            <div className="overflow-x-auto scroll-pretty">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>App ID</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Program</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applied</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apps.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="font-mono text-xs">{a.applicationId}</TableCell>
                      <TableCell>
                        <div className="font-medium text-sm">{a.user.name}</div>
                        <div className="text-xs text-muted-foreground">{a.user.email}</div>
                      </TableCell>
                      <TableCell className="text-sm">{a.program.title}</TableCell>
                      <TableCell>
                        <Badge variant={a.status === 'APPROVED' || a.status === 'ENROLLED' ? 'default' : a.status === 'REJECTED' ? 'destructive' : 'secondary'}>
                          {a.status}
                        </Badge>
                        {a.paymentStatus && a.paymentStatus !== 'NONE' && (
                          <Badge
                            variant={a.paymentStatus === 'VERIFIED' ? 'default' : a.paymentStatus === 'REJECTED' ? 'destructive' : 'secondary'}
                            className="text-[10px] ml-1"
                          >
                            {a.paymentStatus === 'PENDING_VERIFICATION' ? '💰 Pending' : a.paymentStatus === 'VERIFIED' ? '✓ Paid' : '✗ Rejected'}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{new Date(a.createdAt).toLocaleDateString('en-IN')}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" onClick={() => setSelected(a)}>
                          <Eye className="size-3.5 mr-1" /> View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {selected && (
        <Dialog open onOpenChange={() => setSelected(null)}>
          <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto scroll-pretty">
            <DialogHeader>
              <DialogTitle>Application {selected.applicationId}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Student:</span> {selected.user.name}</div>
                <div><span className="text-muted-foreground">Email:</span> {selected.user.email}</div>
                <div><span className="text-muted-foreground">Phone:</span> {selected.user.phone || '-'}</div>
                <div><span className="text-muted-foreground">Program:</span> {selected.program.title}</div>
              </div>
              {selected.user.studentProfile && (
                <div className="grid grid-cols-2 gap-3 text-sm bg-muted/30 p-3 rounded-lg">
                  <div><span className="text-muted-foreground">Exam:</span> {selected.user.studentProfile.examType || '-'}</div>
                  <div><span className="text-muted-foreground">Rank:</span> {selected.user.studentProfile.examRank || '-'}</div>
                  <div><span className="text-muted-foreground">Category:</span> {selected.user.studentProfile.category || '-'}</div>
                  <div><span className="text-muted-foreground">State:</span> {selected.user.studentProfile.state || '-'}</div>
                </div>
              )}
              <div className="bg-muted/30 p-3 rounded-lg">
                <div className="text-xs font-medium text-muted-foreground mb-2">Form Data</div>
                <pre className="text-xs overflow-x-auto">{JSON.stringify(selected.formData, null, 2)}</pre>
              </div>

              {/* Payment screenshot section */}
              {selected.paymentScreenshotUrl && (
                <div className="border-2 border-primary/30 rounded-xl p-4 bg-primary/5 space-y-3">
                  <div className="text-sm font-bold flex items-center gap-2">
                    <IndianRupee className="size-4" /> Payment Proof
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant={
                      selected.paymentStatus === 'VERIFIED' ? 'default' :
                      selected.paymentStatus === 'REJECTED' ? 'destructive' : 'secondary'
                    } className="text-[10px]">
                      {selected.paymentStatus === 'PENDING_VERIFICATION' ? 'Pending Verification' :
                       selected.paymentStatus === 'VERIFIED' ? 'Verified' :
                       selected.paymentStatus === 'REJECTED' ? 'Rejected' : 'No Payment'}
                    </Badge>
                    {selected.paymentNotes && (
                      <span className="text-xs text-muted-foreground">Ref: {selected.paymentNotes}</span>
                    )}
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selected.paymentScreenshotUrl}
                    alt="Payment screenshot"
                    className="w-full rounded-lg border max-h-96 object-contain bg-muted"
                  />
                  <a
                    href={selected.paymentScreenshotUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline block"
                  >
                    View full image →
                  </a>
                  {/* Payment verification controls */}
                  <div className="flex items-center gap-2 pt-2 border-t">
                    <Button
                      size="sm"
                      variant="default"
                      className="gradient-brand text-brand-foreground"
                      onClick={async () => {
                        await fetch(`/api/admin/applications/${selected.id}`, {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ paymentStatus: 'VERIFIED' }),
                        })
                        setSelected({ ...selected, paymentStatus: 'VERIFIED' })
                        load()
                      }}
                      disabled={selected.paymentStatus === 'VERIFIED'}
                    >
                      <CheckCircle2 className="size-3.5 mr-1" /> Verify Payment
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={async () => {
                        await fetch(`/api/admin/applications/${selected.id}`, {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ paymentStatus: 'REJECTED' }),
                        })
                        setSelected({ ...selected, paymentStatus: 'REJECTED' })
                        load()
                      }}
                      disabled={selected.paymentStatus === 'REJECTED'}
                    >
                      <X className="size-3.5 mr-1" /> Reject Payment
                    </Button>
                  </div>
                </div>
              )}

              <div>
                <Label className="text-xs">Update Application Status</Label>
                <Select defaultValue={selected.status} onValueChange={async (v) => {
                  await fetch(`/api/admin/applications/${selected.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: v }),
                  })
                  setSelected({ ...selected, status: v })
                  load()
                }}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SUBMITTED">Submitted</SelectItem>
                    <SelectItem value="REVIEWING">Reviewing</SelectItem>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                    <SelectItem value="ENROLLED">Enrolled</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

function AdminPreferences() {
  const [prefs, setPrefs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [showBulkCreate, setShowBulkCreate] = useState(false)
  const [users, setUsers] = useState<any[]>([])
  const [colleges, setColleges] = useState<any[]>([])
  const [selected, setSelected] = useState<any | null>(null)

  const load = useCallback(() => {
    fetch('/api/admin/preferences', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setPrefs(d.preferences || []))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
    fetch('/api/admin/users?limit=100', { cache: 'no-store' }).then((r) => r.json()).then((d) => setUsers(d.users || []))
    fetch('/api/colleges?limit=100', { cache: 'no-store' }).then((r) => r.json()).then((d) => setColleges(d.colleges || []))
  }, [load])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Preference Orders</h1>
          <p className="text-sm text-muted-foreground">Create and manage student preference orders.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowBulkCreate(true)}>
            <Users className="mr-2 size-4" /> Bulk create + PDF
          </Button>
          <Button onClick={() => setShowCreate(true)} className="gradient-brand text-brand-foreground">
            <Plus className="mr-2 size-4" /> New order
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-sm text-muted-foreground">Loading...</div>
      ) : prefs.length === 0 ? (
        <EmptyState title="No preference orders" description="Create a preference order for a student." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {prefs.map((p) => (
            <Card key={p.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelected(p)}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <div className="font-semibold text-sm">{p.user?.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{p.user?.email}</div>
                  </div>
                  <Badge variant={p.status === 'PUBLISHED' ? 'default' : 'secondary'} className="text-[10px] shrink-0">{p.status}</Badge>
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <span>{p.items?.length || 0} preferences</span>
                  {p.pdfUrl && <Badge variant="outline" className="text-[10px] gap-1"><FileText className="size-3" /> PDF</Badge>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showCreate && (
        <Dialog open onOpenChange={() => setShowCreate(false)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Preference Order</DialogTitle>
            </DialogHeader>
            <CreatePrefForm users={users} onClose={() => setShowCreate(false)} onCreated={() => { setShowCreate(false); load() }} />
          </DialogContent>
        </Dialog>
      )}

      {showBulkCreate && (
        <Dialog open onOpenChange={() => setShowBulkCreate(false)}>
          <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto scroll-pretty">
            <DialogHeader>
              <DialogTitle>Bulk Create + Upload PDF</DialogTitle>
            </DialogHeader>
            <BulkCreatePrefForm
              users={users}
              onClose={() => setShowBulkCreate(false)}
              onCreated={() => { setShowBulkCreate(false); load() }}
            />
          </DialogContent>
        </Dialog>
      )}

      {selected && (
        <Dialog open onOpenChange={() => setSelected(null)}>
          <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto scroll-pretty">
            <DialogHeader>
              <DialogTitle>Preference Order - {selected.user?.name}</DialogTitle>
            </DialogHeader>
            <PrefEditForm pref={selected} colleges={colleges} onClose={() => setSelected(null)} onSaved={() => { setSelected(null); load() }} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

function CreatePrefForm({ users, onClose, onCreated }: { users: any[]; onClose: () => void; onCreated: () => void }) {
  const [userId, setUserId] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!userId) return
    setError(null)
    setSaving(true)
    try {
      const res = await fetch('/api/admin/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, status: 'DRAFT' }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Failed to create preference order')
        return
      }
      onCreated()
    } catch (e: any) {
      setError(e.message || 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <Label className="text-xs">Select Student</Label>
        <Select value={userId} onValueChange={setUserId}>
          <SelectTrigger><SelectValue placeholder="Choose a student..." /></SelectTrigger>
          <SelectContent>
            {users.filter((u) => u.role === 'STUDENT').map((u) => (
              <SelectItem key={u.id} value={u.id}>{u.name} ({u.email})</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {users.filter((u) => u.role === 'STUDENT').length === 0 && (
        <p className="text-xs text-muted-foreground">No students found. Students will appear here after they register.</p>
      )}
      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={saving || !userId} className="gradient-brand text-brand-foreground">
          {saving && <Loader2 className="size-4 mr-2 animate-spin" />} Create
        </Button>
      </div>
    </div>
  )
}

function BulkCreatePrefForm({ users, onClose, onCreated }: { users: any[]; onClose: () => void; onCreated: () => void }) {
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set())
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const students = users.filter((u) => u.role === 'STUDENT')

  const toggleUser = (userId: string) => {
    setSelectedUserIds((cur) => {
      const next = new Set(cur)
      if (next.has(userId)) next.delete(userId)
      else next.add(userId)
      return next
    })
  }

  const selectAll = () => {
    if (selectedUserIds.size === students.length) {
      setSelectedUserIds(new Set())
    } else {
      setSelectedUserIds(new Set(students.map((s) => s.id)))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        setError('Please select a PDF file')
        setPdfFile(null)
        e.target.value = ''
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('File too large. Max 10MB.')
        setPdfFile(null)
        e.target.value = ''
        return
      }
      setError(null)
      setPdfFile(file)
    }
  }

  const handleSubmit = async () => {
    if (selectedUserIds.size === 0) {
      setError('Please select at least one student')
      return
    }
    setError(null)
    setSuccess(null)
    setSaving(true)
    try {
      // Step 1: Create preference orders for all selected students
      const res = await fetch('/api/admin/preferences/bulk-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userIds: Array.from(selectedUserIds),
          title: title || undefined,
          notes: notes || undefined,
          status: 'DRAFT',
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Failed to create preference orders')
        return
      }
      const data = await res.json()
      const preferenceOrderIds = (data.preferences || []).map((p: any) => p.id)

      // Step 2: If a PDF was uploaded, attach it to all created preference orders
      if (pdfFile && preferenceOrderIds.length > 0) {
        const formData = new FormData()
        formData.append('pdf', pdfFile)
        formData.append('preferenceOrderIds', JSON.stringify(preferenceOrderIds))
        const uploadRes = await fetch('/api/admin/preferences/upload-pdf', {
          method: 'POST',
          body: formData,
        })
        if (!uploadRes.ok) {
          const uploadData = await uploadRes.json().catch(() => ({}))
          setError(`Preference orders created, but PDF upload failed: ${uploadData.error || 'Unknown error'}`)
          return
        }
      }

      setSuccess(`Successfully created ${preferenceOrderIds.length} preference order(s)${pdfFile ? ' with PDF attached' : ''}.`)
      setTimeout(() => onCreated(), 1500)
    } catch (e: any) {
      setError(e.message || 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
        Select multiple students and optionally upload a PDF file (preference list, signed form, etc.). The PDF will be attached to each student's preference order.
      </div>

      {/* Student selection */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="text-xs">Select Students ({selectedUserIds.size} selected)</Label>
          {students.length > 0 && (
            <button
              type="button"
              onClick={selectAll}
              className="text-xs text-primary hover:underline"
            >
              {selectedUserIds.size === students.length ? 'Deselect all' : 'Select all'}
            </button>
          )}
        </div>
        <div className="border rounded-md max-h-48 overflow-y-auto scroll-pretty">
          {students.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">No students found</div>
          ) : (
            students.map((u) => (
              <label
                key={u.id}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-muted/50 border-b last:border-0',
                  selectedUserIds.has(u.id) && 'bg-primary/5'
                )}
              >
                <Checkbox
                  checked={selectedUserIds.has(u.id)}
                  onCheckedChange={() => toggleUser(u.id)}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{u.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{u.email}</div>
                </div>
              </label>
            ))
          )}
        </div>
      </div>

      {/* Title */}
      <div>
        <Label className="text-xs">Title (optional)</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. JEE Main 2026 Preference Order" />
      </div>

      {/* Notes */}
      <div>
        <Label className="text-xs">Notes (optional)</Label>
        <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Notes visible to students..." />
      </div>

      {/* PDF upload */}
      <div>
        <Label className="text-xs">PDF File (optional - max 10MB)</Label>
        <div className="border-2 border-dashed border-border rounded-md p-4">
          <input
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            className="hidden"
            id="pdf-upload"
          />
          <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center justify-center gap-2 py-4">
            <Upload className="size-8 text-muted-foreground" />
            {pdfFile ? (
              <>
                <div className="text-sm font-medium text-primary flex items-center gap-1">
                  <Check className="size-4" /> {pdfFile.name}
                </div>
                <div className="text-xs text-muted-foreground">{(pdfFile.size / 1024 / 1024).toFixed(2)} MB - Click to change</div>
              </>
            ) : (
              <>
                <div className="text-sm font-medium">Click to upload PDF</div>
                <div className="text-xs text-muted-foreground">This PDF will be attached to all selected students</div>
              </>
            )}
          </label>
        </div>
      </div>

      {error && (
        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>
      )}
      {success && (
        <div className="text-sm text-green-600 bg-green-50 dark:bg-green-950/30 p-3 rounded-md flex items-center gap-2">
          <CheckCircle2 className="size-4" /> {success}
        </div>
      )}

      <div className="flex gap-2 justify-end pt-2 border-t">
        <Button variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          disabled={saving || selectedUserIds.size === 0}
          className="gradient-brand text-brand-foreground"
        >
          {saving && <Loader2 className="size-4 mr-2 animate-spin" />}
          {saving ? 'Creating...' : `Create ${selectedUserIds.size > 0 ? `(${selectedUserIds.size})` : ''}`}
        </Button>
      </div>
    </div>
  )
}

function PrefEditForm({ pref, colleges, onClose, onSaved }: { pref: any; colleges: any[]; onClose: () => void; onSaved: () => void }) {
  const [items, setItems] = useState<any[]>(pref.items || [])
  const [saving, setSaving] = useState(false)
  const [newCollege, setNewCollege] = useState('')
  const [newBranchId, setNewBranchId] = useState('')
  const [newBranchName, setNewBranchName] = useState('')
  const [newRec, setNewRec] = useState('')
  const [branches, setBranches] = useState<any[]>([])
  const [loadingBranches, setLoadingBranches] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [pdfUploading, setPdfUploading] = useState(false)
  const [currentPdfUrl, setCurrentPdfUrl] = useState<string | null>(pref.pdfUrl || null)
  const [currentPdfName, setCurrentPdfName] = useState<string | null>(pref.pdfName || null)

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setSaveError('Please select a PDF file')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setSaveError('File too large. Max 10MB.')
      return
    }
    setSaveError(null)
    setPdfUploading(true)
    try {
      const formData = new FormData()
      formData.append('pdf', file)
      formData.append('preferenceOrderIds', JSON.stringify([pref.id]))
      const res = await fetch('/api/admin/preferences/upload-pdf', {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setSaveError(data.error || 'PDF upload failed')
        return
      }
      const data = await res.json()
      setCurrentPdfUrl(data.pdfUrl)
      setCurrentPdfName(data.pdfName)
    } finally {
      setPdfUploading(false)
    }
  }

  // Load branches when college changes
  useEffect(() => {
    if (!newCollege) {
      setBranches([])
      setNewBranchId('')
      setNewBranchName('')
      return
    }
    setLoadingBranches(true)
    const college = colleges.find((c) => c.id === newCollege)
    if (college?.slug) {
      fetch(`/api/colleges/${college.slug}`, { cache: 'no-store' })
        .then((r) => r.json())
        .then((d) => {
          setBranches(d.college?.branches || [])
          setNewBranchId('')
          setNewBranchName('')
        })
        .finally(() => setLoadingBranches(false))
    }
  }, [newCollege, colleges])

  const addItem = () => {
    if (!newCollege) return
    setItems([...items, {
      rank: items.length + 1,
      collegeId: newCollege,
      branchId: newBranchId || null,
      branchName: newBranchName || '',
      recommendation: newRec,
      notes: '',
      college: colleges.find((c) => c.id === newCollege),
    }])
    setNewCollege('')
    setNewBranchId('')
    setNewBranchName('')
    setNewRec('')
  }

  const removeItem = (idx: number) => {
    const next = items.filter((_, i) => i !== idx).map((it, i) => ({ ...it, rank: i + 1 }))
    setItems(next)
  }

  const moveItem = (idx: number, dir: -1 | 1) => {
    if (idx + dir < 0 || idx + dir >= items.length) return
    const next = [...items]
    const [item] = next.splice(idx, 1)
    next.splice(idx + dir, 0, item)
    setItems(next.map((it, i) => ({ ...it, rank: i + 1 })))
  }

  const handleSave = async () => {
    setSaving(true)
    setSaveError(null)
    try {
      const res1 = await fetch(`/api/admin/preferences/${pref.id}/items`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((it) => ({
            rank: it.rank,
            collegeId: it.collegeId,
            branchId: it.branchId || null,
            recommendation: it.recommendation || null,
            notes: it.notes || null,
          })),
        }),
      })
      if (!res1.ok) {
        const data = await res1.json().catch(() => ({}))
        setSaveError(data.error || 'Failed to save preference items')
        return
      }
      const res2 = await fetch(`/api/admin/preferences/${pref.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'PUBLISHED' }),
      })
      if (!res2.ok) {
        const data = await res2.json().catch(() => ({}))
        setSaveError(data.error || 'Failed to publish preference order')
        return
      }
      onSaved()
    } catch (e: any) {
      setSaveError(e.message || 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_2fr_auto] gap-2 items-end">
        <div>
          <Label className="text-xs">College</Label>
          <Select value={newCollege} onValueChange={setNewCollege}>
            <SelectTrigger><SelectValue placeholder="Select college..." /></SelectTrigger>
            <SelectContent>
              {colleges.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">Branch (optional)</Label>
          {loadingBranches ? (
            <div className="text-xs text-muted-foreground py-2">Loading branches...</div>
          ) : branches.length > 0 ? (
            <Select
              value={newBranchId}
              onValueChange={(v) => {
                setNewBranchId(v)
                const b = branches.find((br) => br.id === v)
                setNewBranchName(b ? (b.fullName || b.name) : '')
              }}
            >
              <SelectTrigger><SelectValue placeholder="Select branch..." /></SelectTrigger>
              <SelectContent>
                {branches.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}{b.fullName ? ` - ${b.fullName}` : ''}</SelectItem>)}
              </SelectContent>
            </Select>
          ) : (
            <div className="text-xs text-muted-foreground py-2">{newCollege ? 'No branches found' : 'Select college first'}</div>
          )}
        </div>
        <div>
          <Label className="text-xs">Recommendation</Label>
          <Input value={newRec} onChange={(e) => setNewRec(e.target.value)} placeholder="Why this college for the student?" />
        </div>
        <Button onClick={addItem} type="button" disabled={!newCollege}>
          <Plus className="size-4" />
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8 text-sm text-muted-foreground">Add colleges to the preference order.</div>
      ) : (
        <div className="space-y-2">
          {items.map((it, idx) => (
            <Card key={idx}>
              <CardContent className="p-3 flex items-center gap-3">
                <div className="size-8 rounded-full gradient-brand text-brand-foreground flex items-center justify-center text-sm font-bold shrink-0">
                  {it.rank}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{it.college?.name}</div>
                  {it.branchName && <div className="text-xs text-muted-foreground">{it.branchName}</div>}
                  {it.recommendation && <div className="text-xs text-muted-foreground italic truncate">"{it.recommendation}"</div>}
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => moveItem(idx, -1)} disabled={idx === 0}>
                    <span className="text-xs">↑</span>
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => moveItem(idx, 1)} disabled={idx === items.length - 1}>
                    <span className="text-xs">↓</span>
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => removeItem(idx)}>
                    <X className="size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {saveError && (
        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{saveError}</div>
      )}

      {/* PDF attachment */}
      <div className="border-t pt-4 mt-4">
        <div className="text-sm font-semibold mb-2 flex items-center gap-2">
          <FileText className="size-4" /> PDF Attachment
        </div>
        {currentPdfUrl ? (
          <div className="flex items-center justify-between gap-2 bg-muted/30 p-3 rounded-md">
            <a
              href={currentPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline flex items-center gap-1 min-w-0"
            >
              <FileText className="size-4 shrink-0" />
              <span className="truncate">{currentPdfName || 'View PDF'}</span>
            </a>
            <div className="flex items-center gap-2 shrink-0">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handlePdfUpload}
                  className="hidden"
                />
                <span className="text-xs text-primary hover:underline cursor-pointer">
                  {pdfUploading ? 'Uploading...' : 'Change'}
                </span>
              </label>
              <button
                type="button"
                onClick={async () => {
                  await fetch(`/api/admin/preferences/${pref.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ pdfUrl: null, pdfName: null }),
                  })
                  setCurrentPdfUrl(null)
                  setCurrentPdfName(null)
                }}
                className="text-xs text-destructive hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="border-2 border-dashed border-border rounded-md p-4">
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handlePdfUpload}
              className="hidden"
              id={`pdf-upload-${pref.id}`}
            />
            <label htmlFor={`pdf-upload-${pref.id}`} className="cursor-pointer flex flex-col items-center justify-center gap-2 py-4">
              {pdfUploading ? (
                <Loader2 className="size-8 text-muted-foreground animate-spin" />
              ) : (
                <Upload className="size-8 text-muted-foreground" />
              )}
              <div className="text-sm font-medium">Click to upload PDF</div>
              <div className="text-xs text-muted-foreground">Max 10MB</div>
            </label>
          </div>
        )}
      </div>

      <div className="flex gap-2 justify-end pt-4 border-t">
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} disabled={saving} className="gradient-brand text-brand-foreground">
          {saving && <Loader2 className="size-4 mr-2 animate-spin" />}
          Publish to student
        </Button>
      </div>
    </div>
  )
}

function AdminColleges() {
  const [colleges, setColleges] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<any | null>(null)
  const [creating, setCreating] = useState(false)

  const load = useCallback(() => {
    fetch('/api/admin/colleges', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setColleges(d.colleges || []))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Colleges</h1>
          <p className="text-sm text-muted-foreground">Add and manage college listings.</p>
        </div>
        <Button onClick={() => setCreating(true)} className="gradient-brand text-brand-foreground">
          <Plus className="mr-2 size-4" /> New college
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-sm text-muted-foreground">Loading...</div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto scroll-pretty">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Branches</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {colleges.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{c.city}, {c.state}</TableCell>
                      <TableCell><Badge variant="outline">{c.type}</Badge></TableCell>
                      <TableCell>{c._count?.branches || 0}</TableCell>
                      <TableCell><Badge variant={c.status === 'PUBLISHED' ? 'default' : 'secondary'}>{c.status}</Badge></TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" onClick={() => setEditing(c)}>
                          <Pencil className="size-3.5 mr-1" /> Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {(editing || creating) && (
        <CollegeEditDialog
          college={editing}
          onClose={() => { setEditing(null); setCreating(false) }}
          onSaved={() => { setEditing(null); setCreating(false); load() }}
        />
      )}
    </div>
  )
}

function CollegeEditDialog({ college, onClose, onSaved }: { college: any | null; onClose: () => void; onSaved: () => void }) {
  const [saving, setSaving] = useState(false)
  const ps = college?.placementSummary || {}
  const [form, setForm] = useState({
    name: college?.name || '',
    slug: college?.slug || '',
    shortName: college?.shortName || '',
    description: college?.description || '',
    state: college?.state || '',
    city: college?.city || '',
    type: college?.type || 'PRIVATE',
    established: college?.established || '',
    website: college?.website || '',
    email: college?.email || '',
    phone: college?.phone || '',
    address: college?.address || '',
    counsellingBody: college?.counsellingBody || '',
    feesMin: college?.feesMin || '',
    feesMax: college?.feesMax || '',
    rating: college?.rating || '',
    status: college?.status || 'PUBLISHED',
    featured: college?.featured || false,
    admissionProcess: college?.admissionProcess || '',
    logoUrl: college?.logoUrl || '',
    imageUrl: college?.imageUrl || '',
    // Placement summary (flattened for editing)
    avgPackage: ps.avgPackage || '',
    highestPackage: ps.highestPackage || '',
    placementRate: ps.placementRate || '',
    topRecruiters: (ps.topRecruiters || []).join(', '),
    // FAQs as text format: Question|||Answer, one per line
    faqs: (college?.faqs || []).map((f: any) => `${f.q}|||${f.a}`).join('\n'),
    // SEO fields
    seoTitle: college?.seoTitle || '',
    seoDescription: college?.seoDescription || '',
    seoKeywords: college?.seoKeywords || '',
    ogImage: college?.ogImage || '',
    canonicalUrl: college?.canonicalUrl || '',
    noindex: college?.noindex || false,
  })

  const handleSave = async () => {
    setSaving(true)
    try {
      const url = college ? `/api/admin/colleges/${college.id}` : '/api/admin/colleges'
      const method = college ? 'PATCH' : 'POST'
      const placementSummary = {
        avgPackage: form.avgPackage ? Number(form.avgPackage) : null,
        highestPackage: form.highestPackage ? Number(form.highestPackage) : null,
        placementRate: form.placementRate ? Number(form.placementRate) : null,
        topRecruiters: form.topRecruiters.split(',').map((s) => s.trim()).filter(Boolean),
      }
      const faqs = form.faqs.split('\n').filter(Boolean).map((l) => {
        const [q, a] = l.split('|||')
        return { q: q?.trim(), a: a?.trim() }
      })
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          slug: form.slug,
          shortName: form.shortName,
          description: form.description,
          state: form.state,
          city: form.city,
          type: form.type,
          established: form.established ? Number(form.established) : null,
          website: form.website,
          email: form.email,
          phone: form.phone,
          address: form.address,
          counsellingBody: form.counsellingBody,
          feesMin: form.feesMin ? Number(form.feesMin) : null,
          feesMax: form.feesMax ? Number(form.feesMax) : null,
          rating: form.rating ? Number(form.rating) : null,
          status: form.status,
          featured: form.featured,
          admissionProcess: form.admissionProcess,
          logoUrl: form.logoUrl,
          imageUrl: form.imageUrl,
          placementSummary,
          faqs,
          seoTitle: form.seoTitle,
          seoDescription: form.seoDescription,
          seoKeywords: form.seoKeywords,
          ogImage: form.ogImage,
          canonicalUrl: form.canonicalUrl,
          noindex: form.noindex,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        alert(data.error || 'Save failed')
        return
      }
      onSaved()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto scroll-pretty">
        <DialogHeader>
          <DialogTitle>{college ? 'Edit College' : 'New College'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Name *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs">Short Name</Label>
              <Input value={form.shortName} onChange={(e) => setForm({ ...form, shortName: e.target.value })} placeholder="e.g. IIT Delhi" />
            </div>
          </div>
          <div>
            <Label className="text-xs">Description *</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs">State</Label>
              <Input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs">City</Label>
              <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs">Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="GOVT">Government</SelectItem>
                  <SelectItem value="PRIVATE">Private</SelectItem>
                  <SelectItem value="DEEMED">Deemed</SelectItem>
                  <SelectItem value="AUTONOMOUS">Autonomous</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs">Established</Label>
              <Input type="number" value={form.established} onChange={(e) => setForm({ ...form, established: e.target.value })} placeholder="1961" />
            </div>
            <div>
              <Label className="text-xs">Rating (0-5)</Label>
              <Input type="number" step="0.1" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} placeholder="4.7" />
            </div>
            <div>
              <Label className="text-xs">Counselling Body</Label>
              <Input value={form.counsellingBody} onChange={(e) => setForm({ ...form, counsellingBody: e.target.value })} placeholder="JoSAA, UPTAC, etc" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Fees Min (₹/year)</Label>
              <Input type="number" value={form.feesMin} onChange={(e) => setForm({ ...form, feesMin: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs">Fees Max (₹/year)</Label>
              <Input type="number" value={form.feesMax} onChange={(e) => setForm({ ...form, feesMax: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Website</Label>
              <Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://" />
            </div>
            <div>
              <Label className="text-xs">Email</Label>
              <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Phone</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs">Logo / Image URL</Label>
              <Input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." />
            </div>
          </div>
          <div>
            <Label className="text-xs">Address</Label>
            <Textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} rows={2} />
          </div>
          <div>
            <Label className="text-xs">Admission Process</Label>
            <Textarea value={form.admissionProcess} onChange={(e) => setForm({ ...form, admissionProcess: e.target.value })} rows={2} />
          </div>

          {/* Placement Summary */}
          <div className="border-t pt-3 mt-3">
            <div className="text-sm font-semibold mb-2">Placement Summary</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <Label className="text-xs">Avg Package (LPA)</Label>
                <Input type="number" step="0.1" value={form.avgPackage} onChange={(e) => setForm({ ...form, avgPackage: e.target.value })} placeholder="14" />
              </div>
              <div>
                <Label className="text-xs">Highest (LPA)</Label>
                <Input type="number" step="0.1" value={form.highestPackage} onChange={(e) => setForm({ ...form, highestPackage: e.target.value })} placeholder="100" />
              </div>
              <div>
                <Label className="text-xs">Placement %</Label>
                <Input type="number" value={form.placementRate} onChange={(e) => setForm({ ...form, placementRate: e.target.value })} placeholder="92" />
              </div>
              <div>
                <Label className="text-xs">Logo URL</Label>
                <Input value={form.logoUrl} onChange={(e) => setForm({ ...form, logoUrl: e.target.value })} placeholder="https://..." />
              </div>
            </div>
            <div className="mt-3">
              <Label className="text-xs">Top Recruiters (comma separated)</Label>
              <Input value={form.topRecruiters} onChange={(e) => setForm({ ...form, topRecruiters: e.target.value })} placeholder="Google, Microsoft, Amazon" />
            </div>
          </div>

          {/* FAQs */}
          <div className="border-t pt-3 mt-3">
            <Label className="text-xs">College FAQs (format: Question|||Answer, one per line)</Label>
            <Textarea value={form.faqs} onChange={(e) => setForm({ ...form, faqs: e.target.value })} rows={3} placeholder="What is the admission process?|||Admission is through JEE Main rank followed by JoSAA counselling." />
          </div>

          {/* SEO */}
          <div className="border-t pt-3 mt-3">
            <div className="text-sm font-semibold mb-2">SEO</div>
            <div className="space-y-3">
              <div>
                <Label className="text-xs">SEO Title</Label>
                <Input value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} />
              </div>
              <div>
                <Label className="text-xs">SEO Description</Label>
                <Textarea value={form.seoDescription} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })} rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">SEO Keywords</Label>
                  <Input value={form.seoKeywords} onChange={(e) => setForm({ ...form, seoKeywords: e.target.value })} />
                </div>
                <div>
                  <Label className="text-xs">OG Image URL</Label>
                  <Input value={form.ogImage} onChange={(e) => setForm({ ...form, ogImage: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Canonical URL</Label>
                  <Input value={form.canonicalUrl} onChange={(e) => setForm({ ...form, canonicalUrl: e.target.value })} />
                </div>
                <label className="flex items-center gap-2 text-sm pt-5">
                  <input type="checkbox" checked={form.noindex} onChange={(e) => setForm({ ...form, noindex: e.target.checked })} />
                  Noindex (hide from search)
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 border-t pt-3 mt-3">
            <div className="flex-1">
              <Label className="text-xs">Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <label className="flex items-center gap-2 text-sm pt-5">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
              Featured
            </label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving} className="gradient-brand text-brand-foreground">
            {saving && <Loader2 className="size-4 mr-2 animate-spin" />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function AdminBlog() {
  const [posts, setPosts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<any | null>(null)
  const [creating, setCreating] = useState(false)
  const [showCat, setShowCat] = useState(false)

  const load = useCallback(() => {
    fetch('/api/admin/blog', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setPosts(d.posts || []))
      .finally(() => setLoading(false))
    fetch('/api/admin/blog/categories', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setCategories(d.categories || []))
  }, [])

  useEffect(() => { load() }, [load])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Blog Posts</h1>
          <p className="text-sm text-muted-foreground">Manage articles and categories.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowCat(true)}>
            Categories
          </Button>
          <Button onClick={() => setCreating(true)} className="gradient-brand text-brand-foreground">
            <Plus className="mr-2 size-4" /> New post
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-sm text-muted-foreground">Loading...</div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto scroll-pretty">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Published</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium text-sm max-w-[300px] truncate">{p.title}</TableCell>
                      <TableCell className="text-sm">{p.category?.name || '-'}</TableCell>
                      <TableCell><Badge variant={p.status === 'PUBLISHED' ? 'default' : 'secondary'} className="text-[10px]">{p.status}</Badge></TableCell>
                      <TableCell className="text-xs text-muted-foreground">{p.publishedAt ? new Date(p.publishedAt).toLocaleDateString('en-IN') : '-'}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" onClick={() => setEditing(p)}>
                          <Pencil className="size-3.5 mr-1" /> Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {(editing || creating) && (
        <BlogEditDialog post={editing} categories={categories} onClose={() => { setEditing(null); setCreating(false) }} onSaved={() => { setEditing(null); setCreating(false); load() }} />
      )}

      {showCat && (
        <Dialog open onOpenChange={() => setShowCat(false)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Blog Categories</DialogTitle>
            </DialogHeader>
            <CategoriesManager onClose={() => { setShowCat(false); load() }} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

function CategoriesManager({ onClose }: { onClose: () => void }) {
  const [categories, setCategories] = useState<any[]>([])
  const [name, setName] = useState('')

  const load = useCallback(() => {
    fetch('/api/admin/blog/categories', { cache: 'no-store' }).then((r) => r.json()).then((d) => setCategories(d.categories || []))
  }, [])

  useEffect(() => { load() }, [load])

  const handleAdd = async () => {
    if (!name.trim()) return
    await fetch('/api/admin/blog/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    setName('')
    load()
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Category name" />
        <Button onClick={handleAdd} className="gradient-brand text-brand-foreground">Add</Button>
      </div>
      <div className="space-y-1 max-h-60 overflow-y-auto scroll-pretty">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
            <div>
              <div className="text-sm font-medium">{c.name}</div>
              <div className="text-xs text-muted-foreground">/{c.slug} • {c._count?.posts || 0} posts</div>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={async () => {
                if (confirm('Delete this category?')) {
                  await fetch(`/api/admin/blog/categories/${c.id}`, { method: 'DELETE' })
                  load()
                }
              }}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button variant="outline" onClick={onClose} className="w-full">Done</Button>
    </div>
  )
}

function BlogEditDialog({ post, categories, onClose, onSaved }: { post: any | null; categories: any[]; onClose: () => void; onSaved: () => void }) {
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    categoryId: post?.categoryId || '',
    status: post?.status || 'DRAFT',
    featuredImage: post?.featuredImage || '',
    tags: (post?.tags || []).join(', '),
    seoTitle: post?.seoTitle || '',
    seoDescription: post?.seoDescription || '',
    faqs: (post?.faqs || []).map((f: any) => `${f.q}|||${f.a}`).join('\n'),
    tableOfContents: (post?.tableOfContents || []).map((t: any) => `${t.level}|${t.id}|${t.title}`).join('\n'),
  })

  const handleSave = async () => {
    setSaving(true)
    try {
      const body = {
        ...form,
        categoryId: form.categoryId || null,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        faqs: form.faqs.split('\n').filter(Boolean).map((l) => {
          const [q, a] = l.split('|||')
          return { q: q?.trim(), a: a?.trim() }
        }),
        tableOfContents: form.tableOfContents.split('\n').filter(Boolean).map((l) => {
          const [level, id, title] = l.split('|')
          return { level: Number(level), id: id?.trim(), title: title?.trim() }
        }),
      }
      const url = post ? `/api/admin/blog/${post.id}` : '/api/admin/blog'
      const method = post ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const data = await res.json()
        alert(data.error || 'Save failed')
        return
      }
      onSaved()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto scroll-pretty">
        <DialogHeader>
          <DialogTitle>{post ? 'Edit Post' : 'New Post'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs">Slug</Label>
              <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto" />
            </div>
          </div>
          <div>
            <Label className="text-xs">Excerpt</Label>
            <Textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} />
          </div>
          <div>
            <Label className="text-xs">Content (Markdown - use ## for h2, ### for h3)</Label>
            <Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={10} className="font-mono text-xs" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Category</Label>
              <Select value={form.categoryId} onValueChange={(v) => setForm({ ...form, categoryId: v })}>
                <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label className="text-xs">Featured Image URL</Label>
            <Input value={form.featuredImage} onChange={(e) => setForm({ ...form, featuredImage: e.target.value })} placeholder="https://..." />
          </div>
          <div>
            <Label className="text-xs">Tags (comma separated)</Label>
            <Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="josaa, jee main, counselling" />
          </div>
          <div>
            <Label className="text-xs">FAQs (Question|||Answer, one per line)</Label>
            <Textarea value={form.faqs} onChange={(e) => setForm({ ...form, faqs: e.target.value })} rows={3} />
          </div>
          <div>
            <Label className="text-xs">Table of Contents (level|id|title, one per line)</Label>
            <Textarea value={form.tableOfContents} onChange={(e) => setForm({ ...form, tableOfContents: e.target.value })} rows={3} placeholder="2|eligibility|Eligibility" />
          </div>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <Label className="text-xs">SEO Title</Label>
              <Input value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs">SEO Description</Label>
              <Textarea value={form.seoDescription} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })} rows={2} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving} className="gradient-brand text-brand-foreground">
            {saving && <Loader2 className="size-4 mr-2 animate-spin" />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function AdminFAQs() {
  const [faqs, setFaqs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<any | null>(null)
  const [creating, setCreating] = useState(false)

  const load = useCallback(() => {
    fetch('/api/admin/faqs', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setFaqs(d.faqs || []))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">FAQs</h1>
          <p className="text-sm text-muted-foreground">Manage frequently asked questions.</p>
        </div>
        <Button onClick={() => setCreating(true)} className="gradient-brand text-brand-foreground">
          <Plus className="mr-2 size-4" /> New FAQ
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-sm text-muted-foreground">Loading...</div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto scroll-pretty">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Question</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Published</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {faqs.map((f) => (
                    <TableRow key={f.id}>
                      <TableCell className="font-medium text-sm max-w-[400px] truncate">{f.question}</TableCell>
                      <TableCell><Badge variant="outline" className="text-[10px]">{f.category}</Badge></TableCell>
                      <TableCell>
                        <Badge variant={f.published ? 'default' : 'secondary'} className="text-[10px]">
                          {f.published ? 'Yes' : 'No'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" onClick={() => setEditing(f)}>
                          <Pencil className="size-3.5 mr-1" /> Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {(editing || creating) && (
        <FAQEditDialog faq={editing} onClose={() => { setEditing(null); setCreating(false) }} onSaved={() => { setEditing(null); setCreating(false); load() }} />
      )}
    </div>
  )
}

function FAQEditDialog({ faq, onClose, onSaved }: { faq: any | null; onClose: () => void; onSaved: () => void }) {
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    question: faq?.question || '',
    answer: faq?.answer || '',
    category: faq?.category || 'GENERAL',
    published: faq?.published ?? true,
    order: faq?.order ?? 0,
  })

  const handleSave = async () => {
    setSaving(true)
    try {
      const url = faq ? `/api/admin/faqs/${faq.id}` : '/api/admin/faqs'
      const method = faq ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        alert(data.error || 'Save failed')
        return
      }
      onSaved()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{faq ? 'Edit FAQ' : 'New FAQ'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Question</Label>
            <Input value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} />
          </div>
          <div>
            <Label className="text-xs">Answer</Label>
            <Textarea value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} rows={4} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="GENERAL">General</SelectItem>
                  <SelectItem value="COUNSELLING">Counselling</SelectItem>
                  <SelectItem value="ADMISSION">Admission</SelectItem>
                  <SelectItem value="COLLEGE">College</SelectItem>
                  <SelectItem value="PAYMENT">Payment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Order</Label>
              <Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
            Published
          </label>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving} className="gradient-brand text-brand-foreground">
            {saving && <Loader2 className="size-4 mr-2 animate-spin" />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function AdminQueries() {
  const [queries, setQueries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [selected, setSelected] = useState<any | null>(null)

  const load = useCallback(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (status) params.set('status', status)
    fetch(`/api/admin/queries?${params}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setQueries(d.queries || []))
      .finally(() => setLoading(false))
  }, [status])

  useEffect(() => { load() }, [load])

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Support Queries</h1>
        <p className="text-sm text-muted-foreground">Respond to student support tickets.</p>
      </div>
      <Select value={status || 'all'} onValueChange={(v) => { setStatus(v === 'all' ? '' : v) }}>
        <SelectTrigger className="w-[180px]"><SelectValue placeholder="All statuses" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="OPEN">Open</SelectItem>
          <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
          <SelectItem value="RESOLVED">Resolved</SelectItem>
          <SelectItem value="CLOSED">Closed</SelectItem>
        </SelectContent>
      </Select>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-sm text-muted-foreground">Loading...</div>
          ) : queries.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">No queries found</div>
          ) : (
            <div className="overflow-x-auto scroll-pretty">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticket ID</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {queries.map((q) => (
                    <TableRow key={q.id}>
                      <TableCell className="font-mono text-xs">{q.ticketId}</TableCell>
                      <TableCell className="font-medium text-sm max-w-[280px] truncate">{q.subject}</TableCell>
                      <TableCell className="text-sm">{q.user?.name}</TableCell>
                      <TableCell><Badge variant="outline" className="text-[10px]">{q.category}</Badge></TableCell>
                      <TableCell><Badge variant={q.status === 'RESOLVED' ? 'default' : q.status === 'OPEN' ? 'destructive' : 'secondary'} className="text-[10px]">{q.status}</Badge></TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" onClick={() => setSelected(q)}>
                          <Eye className="size-3.5 mr-1" /> View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {selected && (
        <QueryDetailDialog query={selected} onClose={() => setSelected(null)} onUpdated={() => { setSelected(null); load() }} />
      )}
    </div>
  )
}

function QueryDetailDialog({ query, onClose, onUpdated }: { query: any; onClose: () => void; onUpdated: () => void }) {
  const [messages, setMessages] = useState<any[]>([])
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/queries/${query.id}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setMessages(d.query?.messages || []))
  }, [query.id])

  const handleSend = async () => {
    if (!reply.trim()) return
    setSending(true)
    await fetch(`/api/admin/queries/${query.id}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: reply }),
    })
    setReply('')
    const res = await fetch(`/api/admin/queries/${query.id}`, { cache: 'no-store' })
    const data = await res.json()
    setMessages(data.query?.messages || [])
    setSending(false)
  }

  const updateStatus = async (newStatus: string) => {
    await fetch(`/api/admin/queries/${query.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    onUpdated()
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{query.subject}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto scroll-pretty space-y-3 mb-3">
          {messages.map((m: any) => (
            <div key={m.id} className={cn('flex', m.senderRole === 'STUDENT' ? 'justify-start' : 'justify-end')}>
              <div className={cn(
                'max-w-[75%] rounded-lg p-3',
                m.senderRole === 'STUDENT' ? 'bg-muted' : 'gradient-brand text-brand-foreground'
              )}>
                <div className="text-xs opacity-70 mb-1">{m.senderRole === 'STUDENT' ? query.user?.name : 'Admin'} • {new Date(m.createdAt).toLocaleString('en-IN')}</div>
                <div className="text-sm">{m.message}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t pt-3 space-y-2">
          <Textarea value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Type your reply..." rows={2} />
          <div className="flex gap-2">
            <Button onClick={handleSend} disabled={sending || !reply.trim()} className="gradient-brand text-brand-foreground flex-1">
              {sending && <Loader2 className="size-4 mr-2 animate-spin" />}
              <Send className="size-4 mr-1" /> Send reply
            </Button>
            <Select defaultValue={query.status} onValueChange={updateStatus}>
              <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="OPEN">Open</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="RESOLVED">Resolved</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [editing, setEditing] = useState<Lead | null>(null)

  const load = useCallback(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (status) params.set('status', status)
    params.set('page', String(page))
    fetch(`/api/admin/leads?${params}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        setLeads(d.leads || [])
        setTotalPages(d.pagination?.totalPages || 1)
      })
      .finally(() => setLoading(false))
  }, [status, page])

  useEffect(() => { load() }, [load])

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Leads</h1>
        <p className="text-sm text-muted-foreground">Manage and convert leads.</p>
      </div>
      <Select value={status || 'all'} onValueChange={(v) => { setStatus(v === 'all' ? '' : v); setPage(1) }}>
        <SelectTrigger className="w-[180px]"><SelectValue placeholder="All statuses" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="NEW">New</SelectItem>
          <SelectItem value="CONTACTED">Contacted</SelectItem>
          <SelectItem value="INTERESTED">Interested</SelectItem>
          <SelectItem value="REGISTERED">Registered</SelectItem>
          <SelectItem value="CONVERTED">Converted</SelectItem>
          <SelectItem value="NOT_INTERESTED">Not Interested</SelectItem>
        </SelectContent>
      </Select>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-sm text-muted-foreground">Loading...</div>
          ) : leads.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">No leads found</div>
          ) : (
            <div className="overflow-x-auto scroll-pretty">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Interest</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((l) => (
                    <TableRow key={l.id}>
                      <TableCell className="font-medium text-sm">{l.name}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        <div>{l.email}</div>
                        <div>{l.phone}</div>
                      </TableCell>
                      <TableCell className="text-xs">{l.source}</TableCell>
                      <TableCell className="text-xs">{l.programInterest || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={l.status === 'CONVERTED' ? 'default' : l.status === 'NOT_INTERESTED' ? 'destructive' : 'secondary'} className="text-[10px]">
                          {l.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{new Date(l.createdAt).toLocaleDateString('en-IN')}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" onClick={() => setEditing(l)}>
                          <Pencil className="size-3.5 mr-1" /> Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {editing && (
        <LeadEditDialog lead={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load() }} />
      )}
    </div>
  )
}

function LeadEditDialog({ lead, onClose, onSaved }: { lead: Lead; onClose: () => void; onSaved: () => void }) {
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: lead.name,
    email: lead.email || '',
    phone: lead.phone || '',
    status: lead.status,
    notes: lead.notes || '',
  })

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch(`/api/admin/leads/${lead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      onSaved()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Lead</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Name</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Email</Label>
              <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs">Phone</Label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>
          <div>
            <Label className="text-xs">Status</Label>
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="NEW">New</SelectItem>
                <SelectItem value="CONTACTED">Contacted</SelectItem>
                <SelectItem value="INTERESTED">Interested</SelectItem>
                <SelectItem value="REGISTERED">Registered</SelectItem>
                <SelectItem value="CONVERTED">Converted</SelectItem>
                <SelectItem value="NOT_INTERESTED">Not Interested</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Notes</Label>
            <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving} className="gradient-brand text-brand-foreground">
            {saving && <Loader2 className="size-4 mr-2 animate-spin" />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function AdminTestimonials() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<any | null>(null)
  const [creating, setCreating] = useState(false)

  const load = useCallback(() => {
    fetch('/api/admin/testimonials', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setItems(d.testimonials || []))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Testimonials</h1>
          <p className="text-sm text-muted-foreground">Manage student testimonials.</p>
        </div>
        <Button onClick={() => setCreating(true)} className="gradient-brand text-brand-foreground">
          <Plus className="mr-2 size-4" /> New testimonial
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-sm text-muted-foreground">Loading...</div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto scroll-pretty">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>College</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="font-medium text-sm">{t.name}</TableCell>
                      <TableCell className="text-sm">{t.college || '-'}</TableCell>
                      <TableCell>{t.rating}/5</TableCell>
                      <TableCell><Badge variant={t.status === 'PUBLISHED' ? 'default' : 'secondary'} className="text-[10px]">{t.status}</Badge></TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" onClick={() => setEditing(t)}>
                          <Pencil className="size-3.5 mr-1" /> Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {(editing || creating) && (
        <TestimonialEditDialog testimonial={editing} onClose={() => { setEditing(null); setCreating(false) }} onSaved={() => { setEditing(null); setCreating(false); load() }} />
      )}
    </div>
  )
}

function TestimonialEditDialog({ testimonial, onClose, onSaved }: { testimonial: any | null; onClose: () => void; onSaved: () => void }) {
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: testimonial?.name || '',
    role: testimonial?.role || '',
    content: testimonial?.content || '',
    rating: testimonial?.rating || 5,
    college: testimonial?.college || '',
    exam: testimonial?.exam || '',
    rank: testimonial?.rank || '',
    status: testimonial?.status || 'PUBLISHED',
  })

  const handleSave = async () => {
    setSaving(true)
    try {
      const url = testimonial ? `/api/admin/testimonials/${testimonial.id}` : '/api/admin/testimonials'
      const method = testimonial ? 'PATCH' : 'POST'
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      onSaved()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{testimonial ? 'Edit Testimonial' : 'New Testimonial'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Name *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs">Role</Label>
              <Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="B.Tech CSE student" />
            </div>
          </div>
          <div>
            <Label className="text-xs">Content *</Label>
            <Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={4} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs">Rating</Label>
              <Select value={String(form.rating)} onValueChange={(v) => setForm({ ...form, rating: Number(v) })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[5, 4, 3, 2, 1].map((r) => <SelectItem key={r} value={String(r)}>{r} stars</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Exam</Label>
              <Input value={form.exam} onChange={(e) => setForm({ ...form, exam: e.target.value })} placeholder="JEE Main" />
            </div>
            <div>
              <Label className="text-xs">Rank</Label>
              <Input value={form.rank} onChange={(e) => setForm({ ...form, rank: e.target.value })} placeholder="AIR 4500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">College</Label>
              <Input value={form.college} onChange={(e) => setForm({ ...form, college: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs">Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving} className="gradient-brand text-brand-foreground">
            {saving && <Loader2 className="size-4 mr-2 animate-spin" />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function AdminContactMessages() {
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(() => {
    fetch('/api/admin/contact', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setMessages(d.messages || []))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Contact Messages</h1>
        <p className="text-sm text-muted-foreground">Messages from the contact form.</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-sm text-muted-foreground">Loading...</div>
      ) : messages.length === 0 ? (
        <EmptyState title="No messages yet" description="Contact form submissions will appear here." />
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <Card key={m.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-semibold text-sm">{m.subject}</h3>
                    <div className="text-xs text-muted-foreground">
                      From {m.name} • {m.email} {m.phone && `• ${m.phone}`}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={m.status === 'NEW' ? 'destructive' : 'secondary'} className="text-[10px]">{m.status}</Badge>
                    <span className="text-xs text-muted-foreground">{new Date(m.createdAt).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{m.message}</p>
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      await fetch(`/api/admin/contact/${m.id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ status: m.status === 'NEW' ? 'READ' : 'RESPONDED' }),
                      })
                      load()
                    }}
                  >
                    Mark as {m.status === 'NEW' ? 'read' : 'responded'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function AdminSettings() {
  const { refresh: refreshSiteSettings } = useSettings()
  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/admin/settings', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setSettings(d.settings || {}))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    try {
      await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      // Refresh the public site settings so Header/Footer/metadata update immediately
      await refreshSiteSettings()
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
        <h1 className="text-2xl font-bold">Site Settings</h1>
        <p className="text-sm text-muted-foreground">Configure site-wide settings, SEO and contact info.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Organization Info</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Site Name</Label>
            <Input value={settings.siteName || ''} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} />
          </div>
          <div>
            <Label className="text-xs">Tagline</Label>
            <Input value={settings.tagline || ''} onChange={(e) => setSettings({ ...settings, tagline: e.target.value })} />
          </div>
          <div className="col-span-2">
            <Label className="text-xs">Description</Label>
            <Textarea value={settings.description || ''} onChange={(e) => setSettings({ ...settings, description: e.target.value })} rows={2} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Contact Info</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Contact Email</Label>
            <Input value={settings.contactEmail || ''} onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })} />
          </div>
          <div>
            <Label className="text-xs">Contact Phone</Label>
            <Input value={settings.contactPhone || ''} onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })} />
          </div>
          <div>
            <Label className="text-xs">WhatsApp Number</Label>
            <Input value={settings.whatsappNumber || ''} onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })} placeholder="+91 99999 00000" />
          </div>
          <div>
            <Label className="text-xs">WhatsApp Pre-filled Message</Label>
            <Input value={settings.whatsappMessage || ''} onChange={(e) => setSettings({ ...settings, whatsappMessage: e.target.value })} placeholder="Hi CollegePath, I need help with college counselling." />
          </div>
          <div>
            <Label className="text-xs">UPI ID (for receiving payments)</Label>
            <Input value={settings.upiId || ''} onChange={(e) => setSettings({ ...settings, upiId: e.target.value })} placeholder="collegepath@upi" />
          </div>
          <div className="col-span-1 sm:col-span-2">
            <Label className="text-xs">Address</Label>
            <Input value={settings.address || ''} onChange={(e) => setSettings({ ...settings, address: e.target.value })} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Social Links</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Facebook URL</Label>
            <Input value={settings.facebookUrl || ''} onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })} />
          </div>
          <div>
            <Label className="text-xs">Twitter URL</Label>
            <Input value={settings.twitterUrl || ''} onChange={(e) => setSettings({ ...settings, twitterUrl: e.target.value })} />
          </div>
          <div>
            <Label className="text-xs">Instagram URL</Label>
            <Input value={settings.instagramUrl || ''} onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })} />
          </div>
          <div>
            <Label className="text-xs">YouTube URL</Label>
            <Input value={settings.youtubeUrl || ''} onChange={(e) => setSettings({ ...settings, youtubeUrl: e.target.value })} />
          </div>
          <div>
            <Label className="text-xs">LinkedIn URL</Label>
            <Input value={settings.linkedinUrl || ''} onChange={(e) => setSettings({ ...settings, linkedinUrl: e.target.value })} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">SEO & Analytics</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Default OG Image URL</Label>
            <Input value={settings.defaultOgImage || ''} onChange={(e) => setSettings({ ...settings, defaultOgImage: e.target.value })} />
          </div>
          <div>
            <Label className="text-xs">Google Verification Code</Label>
            <Input value={settings.googleVerification || ''} onChange={(e) => setSettings({ ...settings, googleVerification: e.target.value })} placeholder="google-site-verification" />
          </div>
          <div>
            <Label className="text-xs">Robots Setting</Label>
            <Input value={settings.robotsSetting || ''} onChange={(e) => setSettings({ ...settings, robotsSetting: e.target.value })} placeholder="index, follow" />
          </div>
          <div>
            <Label className="text-xs">Google Analytics ID</Label>
            <Input value={settings.googleAnalyticsId || ''} onChange={(e) => setSettings({ ...settings, googleAnalyticsId: e.target.value })} placeholder="G-XXXXXXXXXX" />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <Button onClick={handleSave} disabled={saving} className="gradient-brand text-brand-foreground">
          {saving && <Loader2 className="size-4 mr-2 animate-spin" />}
          Save settings
        </Button>
        {saved && (
          <span className="text-sm text-green-600 flex items-center gap-1">
            <CheckCircle2 className="size-4" /> Saved
          </span>
        )}
      </div>
    </div>
  )
}

// =====================================================
// LIVE UPDATES
// =====================================================

function AdminLiveUpdates() {
  const [updates, setUpdates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<any | null>(null)
  const [creating, setCreating] = useState(false)

  const load = useCallback(() => {
    fetch('/api/admin/live-updates', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setUpdates(d.updates || []))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Live Updates</h1>
          <p className="text-sm text-muted-foreground">
            Messages that cycle one-by-one at the top of the site (every 5 seconds).
          </p>
        </div>
        <Button onClick={() => setCreating(true)} className="gradient-brand text-brand-foreground">
          <Plus className="mr-2 size-4" /> New update
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-sm text-muted-foreground">Loading...</div>
      ) : updates.length === 0 ? (
        <EmptyState title="No live updates" description="Add messages that will cycle on the site." />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto scroll-pretty">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Message</TableHead>
                    <TableHead>Link</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {updates.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium text-sm max-w-[400px]">{u.message}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{u.link || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={u.status === 'PUBLISHED' ? 'default' : 'secondary'} className="text-[10px]">
                          {u.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{u.order}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" onClick={() => setEditing(u)}>
                          <Pencil className="size-3.5 mr-1" /> Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {(editing || creating) && (
        <LiveUpdateEditDialog
          update={editing}
          onClose={() => { setEditing(null); setCreating(false) }}
          onSaved={() => { setEditing(null); setCreating(false); load() }}
        />
      )}
    </div>
  )
}

function LiveUpdateEditDialog({ update, onClose, onSaved }: { update: any | null; onClose: () => void; onSaved: () => void }) {
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    message: update?.message || '',
    link: update?.link || '',
    icon: update?.icon || '',
    status: update?.status || 'PUBLISHED',
    order: update?.order || 0,
  })

  const handleSave = async () => {
    setSaving(true)
    try {
      const url = update ? `/api/admin/live-updates/${update.id}` : '/api/admin/live-updates'
      const method = update ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, order: Number(form.order) }),
      })
      if (!res.ok) {
        const data = await res.json()
        alert(data.error || 'Save failed')
        return
      }
      onSaved()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{update ? 'Edit Live Update' : 'New Live Update'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Message *</Label>
            <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={2} placeholder="e.g. JoSAA 2026 counselling starts in 3 days!" />
          </div>
          <div>
            <Label className="text-xs">Link (optional - hash route like /counselling)</Label>
            <Input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="/counselling/jee-main-counselling" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Order</Label>
              <Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving || !form.message} className="gradient-brand text-brand-foreground">
            {saving && <Loader2 className="size-4 mr-2 animate-spin" />} Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// =====================================================
// POPUPS
// =====================================================

function AdminPopups() {
  const [popups, setPopups] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<any | null>(null)
  const [creating, setCreating] = useState(false)

  const load = useCallback(() => {
    fetch('/api/admin/popups', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setPopups(d.popups || []))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Popups</h1>
          <p className="text-sm text-muted-foreground">
            Center modal that appears on the user's screen. Only the most recent published popup is shown.
          </p>
        </div>
        <Button onClick={() => setCreating(true)} className="gradient-brand text-brand-foreground">
          <Plus className="mr-2 size-4" /> New popup
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-sm text-muted-foreground">Loading...</div>
      ) : popups.length === 0 ? (
        <EmptyState title="No popups yet" description="Create a popup that will appear at the center of the user's viewport." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {popups.map((p) => (
            <Card key={p.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">{p.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{p.message}</p>
                  </div>
                  <Badge variant={p.status === 'PUBLISHED' ? 'default' : 'secondary'} className="text-[10px] shrink-0">
                    {p.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                  <Badge variant="outline" className="text-[10px]">{p.frequency}</Badge>
                  {p.ctaText && <Badge variant="outline" className="text-[10px]">CTA: {p.ctaText}</Badge>}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setEditing(p)} className="flex-1">
                    <Pencil className="size-3.5 mr-1" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      if (confirm('Delete this popup?')) {
                        await fetch(`/api/admin/popups/${p.id}`, { method: 'DELETE' })
                        load()
                      }
                    }}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {(editing || creating) && (
        <PopupEditDialog
          popup={editing}
          onClose={() => { setEditing(null); setCreating(false) }}
          onSaved={() => { setEditing(null); setCreating(false); load() }}
        />
      )}
    </div>
  )
}

function PopupEditDialog({ popup, onClose, onSaved }: { popup: any | null; onClose: () => void; onSaved: () => void }) {
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: popup?.title || '',
    message: popup?.message || '',
    imageUrl: popup?.imageUrl || '',
    ctaText: popup?.ctaText || '',
    ctaLink: popup?.ctaLink || '',
    status: popup?.status || 'DRAFT',
    frequency: popup?.frequency || 'ONCE_PER_SESSION',
  })

  const handleSave = async () => {
    setSaving(true)
    try {
      const url = popup ? `/api/admin/popups/${popup.id}` : '/api/admin/popups'
      const method = popup ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        alert(data.error || 'Save failed')
        return
      }
      onSaved()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto scroll-pretty">
        <DialogHeader>
          <DialogTitle>{popup ? 'Edit Popup' : 'New Popup'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Title *</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Special Offer!" />
          </div>
          <div>
            <Label className="text-xs">Message *</Label>
            <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={4} placeholder="Get 20% off on JEE Main counselling this week. Limited slots available." />
          </div>
          <div>
            <Label className="text-xs">Image URL (optional)</Label>
            <Input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">CTA Button Text</Label>
              <Input value={form.ctaText} onChange={(e) => setForm({ ...form, ctaText: e.target.value })} placeholder="Register now" />
            </div>
            <div>
              <Label className="text-xs">CTA Link (hash route)</Label>
              <Input value={form.ctaLink} onChange={(e) => setForm({ ...form, ctaLink: e.target.value })} placeholder="/counselling/jee-main-counselling" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Frequency</Label>
              <Select value={form.frequency} onValueChange={(v) => setForm({ ...form, frequency: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ONCE_PER_SESSION">Once per session</SelectItem>
                  <SelectItem value="EVERY_VISIT">Every visit</SelectItem>
                  <SelectItem value="DAILY">Daily (once per day)</SelectItem>
                  <SelectItem value="ALWAYS">Always show</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-md">
            <strong>Note:</strong> Only the most recent published popup is shown to users. To show a different popup, set the current one to Draft/Archived first.
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving || !form.title || !form.message} className="gradient-brand text-brand-foreground">
            {saving && <Loader2 className="size-4 mr-2 animate-spin" />} Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// =====================================================
// BANNERS
// =====================================================

function AdminBanners() {
  const [banners, setBanners] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<any | null>(null)
  const [creating, setCreating] = useState(false)

  const load = useCallback(() => {
    fetch('/api/admin/banners', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setBanners(d.banners || []))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Banners</h1>
          <p className="text-sm text-muted-foreground">
            Top announcement bar shown above the header. First active banner is displayed.
          </p>
        </div>
        <Button onClick={() => setCreating(true)} className="gradient-brand text-brand-foreground">
          <Plus className="mr-2 size-4" /> New banner
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-sm text-muted-foreground">Loading...</div>
      ) : banners.length === 0 ? (
        <EmptyState title="No banners yet" description="Add a top announcement banner." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {banners.map((b) => (
            <Card key={b.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-sm flex-1">{b.message}</p>
                  <Badge variant={b.status === 'PUBLISHED' ? 'default' : 'secondary'} className="text-[10px] shrink-0">
                    {b.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                  <Badge variant="outline" className="text-[10px]">{b.variant}</Badge>
                  {b.ctaText && <Badge variant="outline" className="text-[10px]">CTA: {b.ctaText}</Badge>}
                  {b.dismissible && <Badge variant="outline" className="text-[10px]">Dismissible</Badge>}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setEditing(b)} className="flex-1">
                    <Pencil className="size-3.5 mr-1" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      if (confirm('Delete this banner?')) {
                        await fetch(`/api/admin/banners/${b.id}`, { method: 'DELETE' })
                        load()
                      }
                    }}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {(editing || creating) && (
        <BannerEditDialog
          banner={editing}
          onClose={() => { setEditing(null); setCreating(false) }}
          onSaved={() => { setEditing(null); setCreating(false); load() }}
        />
      )}
    </div>
  )
}

function BannerEditDialog({ banner, onClose, onSaved }: { banner: any | null; onClose: () => void; onSaved: () => void }) {
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    message: banner?.message || '',
    link: banner?.link || '',
    ctaText: banner?.ctaText || '',
    variant: banner?.variant || 'info',
    dismissible: banner?.dismissible ?? true,
    status: banner?.status || 'PUBLISHED',
    order: banner?.order || 0,
  })

  const handleSave = async () => {
    setSaving(true)
    try {
      const url = banner ? `/api/admin/banners/${banner.id}` : '/api/admin/banners'
      const method = banner ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, order: Number(form.order) }),
      })
      if (!res.ok) {
        const data = await res.json()
        alert(data.error || 'Save failed')
        return
      }
      onSaved()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{banner ? 'Edit Banner' : 'New Banner'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Message *</Label>
            <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={2} placeholder="JoSAA 2026 choice filling ends tomorrow!" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">CTA Text (optional)</Label>
              <Input value={form.ctaText} onChange={(e) => setForm({ ...form, ctaText: e.target.value })} placeholder="Learn more" />
            </div>
            <div>
              <Label className="text-xs">Link (hash route)</Label>
              <Input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="/blog/josaa-counselling-complete-guide-2026" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Variant</Label>
              <Select value={form.variant} onValueChange={(v) => setForm({ ...form, variant: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Info (blue)</SelectItem>
                  <SelectItem value="success">Success (green)</SelectItem>
                  <SelectItem value="warning">Warning (amber)</SelectItem>
                  <SelectItem value="error">Error (red)</SelectItem>
                  <SelectItem value="brand">Brand (emerald)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.dismissible} onChange={(e) => setForm({ ...form, dismissible: e.target.checked })} />
              Dismissible by user
            </label>
            <div className="flex-1">
              <Label className="text-xs">Order</Label>
              <Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving || !form.message} className="gradient-brand text-brand-foreground">
            {saving && <Loader2 className="size-4 mr-2 animate-spin" />} Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
