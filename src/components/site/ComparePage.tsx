'use client'

import { useEffect, useState } from 'react'
import { useHashRouter, useRoute } from '@/lib/router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState, PageSkeleton } from '@/components/site/LoadingStates'
import { RatingStars } from '@/components/site/RatingStars'
import { Building2, IndianRupee, Briefcase, MapPin, GraduationCap, X, ArrowRight } from 'lucide-react'
import type { CollegeDetail } from '@/lib/types'

export function ComparePage() {
  const { navigate } = useHashRouter()
  const { query } = useRoute()
  const idsParam = query.get('ids') || ''
  const ids = idsParam ? idsParam.split(',').filter(Boolean).slice(0, 3) : []
  const [colleges, setColleges] = useState<(CollegeDetail | null)[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (ids.length === 0) {
      setLoading(false)
      setColleges([])
      return
    }
    setLoading(true)
    Promise.all(
      ids.map((id) =>
        fetch(`/api/colleges/${id}`, { cache: 'no-store' })
          .then((r) => (r.ok ? r.json() : null))
          .then((d) => d?.college || null)
          .catch(() => null)
      )
    ).then((results) => {
      setColleges(results)
      setLoading(false)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsParam])

  const removeCollege = (idx: number) => {
    const newIds = ids.filter((_, i) => i !== idx)
    navigate(`/compare${newIds.length ? `?ids=${newIds.join(',')}` : ''}`)
  }

  if (loading) return <PageSkeleton />

  if (ids.length === 0) {
    return (
      <div className="container-wide py-16">
        <EmptyState
          title="No colleges selected for comparison"
          description="Browse colleges and click 'Compare' to add them here. You can compare up to 3 colleges."
          icon={<Building2 className="size-12" />}
          action={<Button onClick={() => navigate('/colleges')}>Browse colleges</Button>}
        />
      </div>
    )
  }

  const rows = [
    { label: 'Location', key: (c: CollegeDetail) => `${c.city}, ${c.state}` },
    { label: 'Type', key: (c: CollegeDetail) => c.type },
    { label: 'Established', key: (c: CollegeDetail) => c.established?.toString() || '-' },
    { label: 'Counselling Body', key: (c: CollegeDetail) => c.counsellingBody || '-' },
    {
      label: 'Rating',
      key: (c: CollegeDetail) => (c.rating ? <RatingStars value={c.rating} size={12} /> : '-'),
    },
    {
      label: 'Annual Fees',
      key: (c: CollegeDetail) =>
        c.feesMin ? `₹${(c.feesMin / 100000).toFixed(1)}L - ₹${((c.feesMax ?? c.feesMin) / 100000).toFixed(1)}L` : '-',
    },
    {
      label: 'Avg Package',
      key: (c: CollegeDetail) => (c.placementSummary?.avgPackage ? `₹${c.placementSummary.avgPackage} LPA` : '-'),
    },
    {
      label: 'Highest Package',
      key: (c: CollegeDetail) =>
        c.placementSummary?.highestPackage ? `₹${c.placementSummary.highestPackage} LPA` : '-',
    },
    {
      label: 'Placement Rate',
      key: (c: CollegeDetail) => (c.placementSummary?.placementRate ? `${c.placementSummary.placementRate}%` : '-'),
    },
    {
      label: 'Top Recruiters',
      key: (c: CollegeDetail) => (
        <div className="flex flex-wrap gap-1 justify-center">
          {(c.placementSummary?.topRecruiters || []).slice(0, 4).map((r) => (
            <Badge key={r} variant="secondary" className="text-[10px]">{r}</Badge>
          ))}
        </div>
      ),
    },
    {
      label: 'Branches Available',
      key: (c: CollegeDetail) => c.branches.map((b) => b.name).join(', '),
    },
  ]

  return (
    <div className="container-wide py-10 md:py-14">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Compare Colleges</h1>
        <p className="mt-2 text-muted-foreground">
          Side-by-side comparison of {colleges.filter(Boolean).length} colleges. Click on any college name to view full details.
        </p>
      </header>

      {colleges.length < 3 && (
        <Button variant="outline" className="mb-6" onClick={() => navigate('/colleges')}>
          <Building2 className="mr-2 size-4" /> Add more colleges to compare
        </Button>
      )}

      <Card className="overflow-hidden">
        <div className="overflow-x-auto scroll-pretty">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 w-44 sticky left-0 bg-card z-10">College</th>
                {colleges.map((c, idx) => (
                  <th key={idx} className="p-4 text-left align-top min-w-[220px]">
                    {c ? (
                      <div className="space-y-2">
                        <button
                          onClick={() => removeCollege(idx)}
                          className="float-right text-muted-foreground hover:text-destructive"
                          aria-label="Remove from compare"
                        >
                          <X className="size-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/colleges/${c.slug}`)}
                          className="block text-left"
                        >
                          <Building2 className="size-8 text-primary mb-2" />
                          <div className="font-semibold leading-tight">{c.shortName || c.name}</div>
                          <div className="text-xs text-muted-foreground mt-1">{c.city}, {c.state}</div>
                        </button>
                      </div>
                    ) : (
                      <div className="text-muted-foreground text-sm">College not found</div>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx} className="border-b last:border-0">
                  <td className="p-4 font-medium text-sm sticky left-0 bg-card z-10">{row.label}</td>
                  {colleges.map((c, j) => (
                    <td key={j} className="p-4 text-sm text-muted-foreground text-center">
                      {c ? row.key(c) : '-'}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="p-4 sticky left-0 bg-card z-10"></td>
                {colleges.map((c, idx) => (
                  <td key={idx} className="p-4">
                    {c && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => navigate(`/colleges/${c.slug}`)}
                      >
                        View details <ArrowRight className="ml-1 size-3.5" />
                      </Button>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
