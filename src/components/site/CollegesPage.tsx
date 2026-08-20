'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { useHashRouter } from '@/lib/router'
import { useSession } from '@/lib/session'
import { useAuthDialog } from '@/lib/auth-dialog'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/site/LoadingStates'
import { RatingStars } from '@/components/site/RatingStars'
import {
  Search,
  SlidersHorizontal,
  Building2,
  MapPin,
  GraduationCap,
  IndianRupee,
  Heart,
  X,
  ArrowRight,
} from 'lucide-react'
import type { CollegeListItem } from '@/lib/types'

type Filters = {
  states: string[]
  cities: string[]
  types: string[]
  branches: string[]
  counsellingBodies: string[]
}

export function CollegesPage() {
  const { navigate } = useHashRouter()
  const { user } = useSession()
  const { openAuth } = useAuthDialog()
  const [colleges, setColleges] = useState<CollegeListItem[]>([])
  const [filters, setFilters] = useState<Filters | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedState, setSelectedState] = useState<string>('')
  const [selectedCity, setSelectedCity] = useState<string>('')
  const [selectedType, setSelectedType] = useState<string>('')
  const [selectedBranch, setSelectedBranch] = useState<string>('')
  const [selectedBody, setSelectedBody] = useState<string>('')
  const [sort, setSort] = useState<string>('featured')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [compareIds, setCompareIds] = useState<string[]>([])
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const fetchColleges = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (selectedState) params.set('state', selectedState)
    if (selectedCity) params.set('city', selectedCity)
    if (selectedType) params.set('type', selectedType)
    if (selectedBranch) params.set('branch', selectedBranch)
    if (selectedBody) params.set('counsellingBody', selectedBody)
    params.set('sort', sort)
    params.set('page', String(page))
    params.set('limit', '12')

    const res = await fetch(`/api/colleges?${params}`, { cache: 'no-store' })
    const data = await res.json()
    setColleges(data.colleges || [])
    setTotalPages(data.pagination?.totalPages || 1)
    if (data.filters) setFilters(data.filters)
    setLoading(false)
  }, [search, selectedState, selectedCity, selectedType, selectedBranch, selectedBody, sort, page])

  useEffect(() => {
    fetchColleges()
  }, [fetchColleges])

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1)
  }, [search, selectedState, selectedCity, selectedType, selectedBranch, selectedBody, sort])

  // Load saved colleges if logged in
  useEffect(() => {
    if (user) {
      fetch('/api/student/saved-colleges', { cache: 'no-store' })
        .then((r) => r.json())
        .then((d) => setSavedIds(new Set((d.saved || []).map((s: any) => s.collegeId))))
        .catch(() => {})
    }
  }, [user])

  const toggleSave = async (collegeId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!user) {
      openAuth({ tab: 'login', redirectTo: '/colleges' })
      return
    }
    const isSaved = savedIds.has(collegeId)
    setSavedIds((cur) => {
      const next = new Set(cur)
      if (isSaved) next.delete(collegeId)
      else next.add(collegeId)
      return next
    })
    await fetch('/api/student/saved-colleges', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ collegeId }),
    })
  }

  const toggleCompare = (collegeSlug: string) => {
    setCompareIds((cur) => {
      if (cur.includes(collegeSlug)) return cur.filter((id) => id !== collegeSlug)
      if (cur.length >= 3) return cur
      return [...cur, collegeSlug]
    })
  }

  const applyFilters = () => {
    fetchColleges()
    setMobileFiltersOpen(false)
  }

  const resetFilters = () => {
    setSelectedState('')
    setSelectedCity('')
    setSelectedType('')
    setSelectedBranch('')
    setSelectedBody('')
    setSearch('')
  }

  const activeFilterCount = [selectedState, selectedCity, selectedType, selectedBranch, selectedBody].filter(Boolean).length

  const FilterPanel = (
    <div className="space-y-5">
      <div>
        <Label className="text-xs font-semibold uppercase text-muted-foreground mb-2 block">State</Label>
        <Select value={selectedState || 'ALL'} onValueChange={(v) => setSelectedState(v === 'ALL' ? '' : v)}>
          <SelectTrigger className="w-full"><SelectValue placeholder="All states" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All states</SelectItem>
            {filters?.states.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-xs font-semibold uppercase text-muted-foreground mb-2 block">City</Label>
        <Select value={selectedCity || 'ALL'} onValueChange={(v) => setSelectedCity(v === 'ALL' ? '' : v)}>
          <SelectTrigger className="w-full"><SelectValue placeholder="All cities" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All cities</SelectItem>
            {filters?.cities.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-xs font-semibold uppercase text-muted-foreground mb-2 block">College Type</Label>
        <Select value={selectedType || 'ALL'} onValueChange={(v) => setSelectedType(v === 'ALL' ? '' : v)}>
          <SelectTrigger className="w-full"><SelectValue placeholder="All types" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All types</SelectItem>
            {filters?.types.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-xs font-semibold uppercase text-muted-foreground mb-2 block">Branch</Label>
        <Select value={selectedBranch || 'ALL'} onValueChange={(v) => setSelectedBranch(v === 'ALL' ? '' : v)}>
          <SelectTrigger className="w-full"><SelectValue placeholder="All branches" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All branches</SelectItem>
            {filters?.branches.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-xs font-semibold uppercase text-muted-foreground mb-2 block">Counselling Body</Label>
        <Select value={selectedBody || 'ALL'} onValueChange={(v) => setSelectedBody(v === 'ALL' ? '' : v)}>
          <SelectTrigger className="w-full"><SelectValue placeholder="All bodies" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All bodies</SelectItem>
            {filters?.counsellingBodies.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      {activeFilterCount > 0 && (
        <Button variant="ghost" size="sm" onClick={resetFilters} className="w-full">
          <X className="size-3.5 mr-1" /> Clear filters ({activeFilterCount})
        </Button>
      )}
    </div>
  )

  return (
    <div className="container-wide py-10 md:py-14">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-balance">
          College Explorer
        </h1>
        <p className="mt-3 text-muted-foreground text-lg">
          Search, filter and compare {filters ? `${filters.states.length * 10}+` : '500+'} engineering colleges across India.
        </p>
      </header>

      {/* Search bar */}
      <div className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by college name, city or description..."
            className="pl-9"
          />
        </div>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-[140px] sm:w-[180px]"><SelectValue placeholder="Sort by" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Featured first</SelectItem>
            <SelectItem value="name">Name (A-Z)</SelectItem>
            <SelectItem value="rating">Rating (high to low)</SelectItem>
            <SelectItem value="fees_asc">Fees (low to high)</SelectItem>
            <SelectItem value="fees_desc">Fees (high to low)</SelectItem>
          </SelectContent>
        </Select>
        <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="lg:hidden shrink-0">
              <SlidersHorizontal className="size-4 mr-1" />
              Filters
              {activeFilterCount > 0 && (
                <Badge className="ml-1 size-5 p-0 text-[10px] flex items-center justify-center">{activeFilterCount}</Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] overflow-y-auto">
            <SheetHeader className="mb-4">
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            {FilterPanel}
            <Button className="w-full mt-6 gradient-brand text-brand-foreground" onClick={applyFilters}>
              Apply filters
            </Button>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        {/* Desktop filters */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 bg-card border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Filters</h2>
              <SlidersHorizontal className="size-4 text-muted-foreground" />
            </div>
            {FilterPanel}
          </div>
        </aside>

        {/* College grid */}
        <div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-64 w-full rounded-xl" />
              ))}
            </div>
          ) : colleges.length === 0 ? (
            <EmptyState
              title="No colleges found"
              description="Try adjusting your filters or search keywords."
              icon={<Building2 className="size-12" />}
              action={activeFilterCount > 0 ? <Button variant="outline" onClick={resetFilters}>Clear filters</Button> : undefined}
            />
          ) : (
            <>
              <div className="text-sm text-muted-foreground mb-4">
                Showing <span className="font-medium text-foreground">{colleges.length}</span> colleges
                {activeFilterCount > 0 && ` • ${activeFilterCount} filter${activeFilterCount > 1 ? 's' : ''} active`}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {colleges.map((c) => (
                  <Card
                    key={c.id}
                    className="hover:shadow-md transition-shadow cursor-pointer group flex flex-col"
                    onClick={() => navigate(`/colleges/${c.slug}`)}
                  >
                    <div className="aspect-[16/9] bg-muted relative overflow-hidden rounded-t-lg">
                      {c.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={c.imageUrl} alt={c.name} className="size-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="size-full flex items-center justify-center">
                          <Building2 className="size-12 text-muted-foreground/40" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2 flex gap-1.5">
                        <button
                          onClick={(e) => toggleSave(c.id, e)}
                          className="size-8 rounded-full bg-background/90 hover:bg-background flex items-center justify-center shadow-sm transition-colors"
                          aria-label={savedIds.has(c.id) ? 'Unsave' : 'Save'}
                        >
                          <Heart className={`size-4 ${savedIds.has(c.id) ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
                        </button>
                      </div>
                      {c.featured && (
                        <Badge variant="default" className="absolute top-2 left-2 bg-amber-500 text-white">Featured</Badge>
                      )}
                    </div>
                    <CardContent className="p-4 flex-1 flex flex-col">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-base leading-tight line-clamp-2">{c.shortName || c.name}</h3>
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                        <MapPin className="size-3" />
                        {c.city}, {c.state}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap mb-3">
                        <Badge variant="outline" className="text-[10px]">{c.type}</Badge>
                        {c.counsellingBody && <Badge variant="secondary" className="text-[10px]">{c.counsellingBody}</Badge>}
                        <Badge variant="outline" className="text-[10px]">{c._count.branches} branches</Badge>
                      </div>
                      <div className="mt-auto pt-3 border-t flex items-center justify-between">
                        <div>
                          {c.rating && <RatingStars value={c.rating} size={11} />}
                          {c.feesMin && (
                            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-0.5">
                              <IndianRupee className="size-3" />
                              {(c.feesMin / 100000).toFixed(1)}L{(c.feesMax ?? c.feesMin) !== c.feesMin && c.feesMax ? ` - ${(c.feesMax / 100000).toFixed(1)}L` : ''}/yr
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Checkbox
                            checked={compareIds.includes(c.slug)}
                            onCheckedChange={() => toggleCompare(c.slug)}
                            onClick={(e) => e.stopPropagation()}
                            id={`compare-${c.slug}`}
                            className="data-[state=checked]:bg-primary"
                          />
                          <Label htmlFor={`compare-${c.slug}`} className="text-xs cursor-pointer" onClick={(e) => e.stopPropagation()}>
                            Compare
                          </Label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Compare bar */}
      {compareIds.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t shadow-lg p-3">
          <div className="container-wide flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">{compareIds.length} selected for comparison</span>
              <span className="text-muted-foreground hidden sm:inline">(max 3)</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setCompareIds([])}>
                Clear
              </Button>
              <Button
                size="sm"
                className="gradient-brand text-brand-foreground"
                disabled={compareIds.length < 2}
                onClick={() => navigate(`/compare?ids=${compareIds.join(',')}`)}
              >
                Compare now <ArrowRight className="ml-1 size-3.5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
