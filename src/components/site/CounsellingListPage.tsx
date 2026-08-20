'use client'

import { useEffect, useState } from 'react'
import { useHashRouter } from '@/lib/router'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, ArrowRight, Star, Sparkles } from 'lucide-react'
import { CardGridSkeleton, EmptyState } from '@/components/site/LoadingStates'
import type { ProgramListItem } from '@/lib/types'

export function CounsellingListPage() {
  const { navigate } = useHashRouter()
  const [programs, setPrograms] = useState<ProgramListItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/programs', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setPrograms(d.programs || []))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="container-wide py-10 md:py-14">
      <header className="max-w-3xl mb-10">
        <Badge variant="secondary" className="mb-3 gap-1">
          <Sparkles className="size-3" /> Counselling Programs
        </Badge>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-balance">
          Expert counselling for every admission round
        </h1>
        <p className="mt-4 text-muted-foreground text-lg text-pretty">
          Choose from our free and paid counselling programs for JoSAA, UPTAC, CSAB and state CETs. Get a personalised preference order built by experienced counsellors.
        </p>
      </header>

      {loading ? (
        <CardGridSkeleton count={6} />
      ) : programs.length === 0 ? (
        <EmptyState
          title="No programs available"
          description="Please check back later or contact us for personalised counselling."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {programs.map((p) => (
            <Card
              key={p.id}
              className="flex flex-col hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/counselling/${p.slug}`)}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={p.isPaid ? 'default' : 'secondary'} className="shrink-0">
                    {p.isPaid ? `₹${p.price.toLocaleString('en-IN')}` : 'Free'}
                  </Badge>
                  {p.featured && (
                    <Badge variant="outline" className="gap-1">
                      <Star className="size-3 fill-amber-400 text-amber-400" /> Featured
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg leading-snug">{p.title}</CardTitle>
                <CardDescription className="line-clamp-2 min-h-[40px]">
                  {p.shortDescription}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex items-end">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {p.duration && (
                    <span className="flex items-center gap-1">
                      <Clock className="size-3.5" /> {p.duration}
                    </span>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View details
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
