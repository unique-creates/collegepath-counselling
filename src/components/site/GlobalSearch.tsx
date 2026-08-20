'use client'

import { useEffect, useState, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, FileText, Building2, GraduationCap, HelpCircle } from 'lucide-react'
import { useHashRouter } from '@/lib/router'
import type { CollegeListItem, ProgramListItem, BlogListItem, FAQ } from '@/lib/types'
import { cn } from '@/lib/utils'

type Results = {
  colleges: CollegeListItem[]
  programs: ProgramListItem[]
  posts: BlogListItem[]
  faqs: FAQ[]
}

export function GlobalSearch({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [q, setQ] = useState('')
  const [results, setResults] = useState<Results | null>(null)
  const [loading, setLoading] = useState(false)
  const { navigate } = useHashRouter()

  useEffect(() => {
    if (!open) {
      setQ('')
      setResults(null)
      return
    }
  }, [open])

  useEffect(() => {
    if (!q || q.length < 2) {
      setResults(null)
      return
    }
    let cancelled = false
    setLoading(true)
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, { cache: 'no-store' })
        if (!cancelled && res.ok) {
          setResults(await res.json())
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }, 250)
    return () => {
      cancelled = true
      clearTimeout(t)
    }
  }, [q])

  const go = useCallback(
    (path: string) => {
      onOpenChange(false)
      navigate(path)
    },
    [navigate, onOpenChange]
  )

  const hasResults =
    results &&
    (results.colleges.length > 0 ||
      results.programs.length > 0 ||
      results.posts.length > 0 ||
      results.faqs.length > 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl p-0 gap-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Search</DialogTitle>
        </DialogHeader>
        <div className="flex items-center border-b px-4">
          <Search className="size-4 text-muted-foreground shrink-0" />
          <Input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search colleges, counselling programs, articles, FAQs..."
            className="border-0 focus-visible:ring-0 shadow-none"
          />
        </div>

        <div className="max-h-[60vh] overflow-y-auto scroll-pretty">
          {!q && (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Start typing to search across colleges, programs, articles and FAQs.
            </div>
          )}
          {q && loading && (
            <div className="p-4 space-y-2">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          )}
          {q && !loading && !hasResults && (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No results found for "{q}"
            </div>
          )}
          {q && !loading && hasResults && (
            <div className="divide-y">
              {results!.programs.length > 0 && (
                <Section icon={<GraduationCap className="size-4" />} title="Counselling Programs">
                  {results!.programs.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => go(`/counselling/${p.slug}`)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/60 text-left transition-colors"
                    >
                      <div className="size-9 rounded-md gradient-brand text-brand-foreground flex items-center justify-center shrink-0">
                        <GraduationCap className="size-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-sm truncate">{p.title}</div>
                        <div className="text-xs text-muted-foreground truncate">{p.shortDescription}</div>
                      </div>
                    </button>
                  ))}
                </Section>
              )}
              {results!.colleges.length > 0 && (
                <Section icon={<Building2 className="size-4" />} title="Colleges">
                  {results!.colleges.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => go(`/colleges/${c.slug}`)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/60 text-left transition-colors"
                    >
                      <div className="size-9 rounded-md bg-muted flex items-center justify-center shrink-0">
                        <Building2 className="size-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-sm truncate">{c.name}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {c.city}, {c.state} • {c.type}
                        </div>
                      </div>
                    </button>
                  ))}
                </Section>
              )}
              {results!.posts.length > 0 && (
                <Section icon={<FileText className="size-4" />} title="Blog Articles">
                  {results!.posts.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => go(`/blog/${p.slug}`)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/60 text-left transition-colors"
                    >
                      <div className="size-9 rounded-md bg-muted flex items-center justify-center shrink-0">
                        <FileText className="size-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-sm truncate">{p.title}</div>
                        <div className="text-xs text-muted-foreground truncate">{p.excerpt}</div>
                      </div>
                    </button>
                  ))}
                </Section>
              )}
              {results!.faqs.length > 0 && (
                <Section icon={<HelpCircle className="size-4" />} title="FAQs">
                  {results!.faqs.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => go(`/faq`)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/60 text-left transition-colors"
                    >
                      <div className="size-9 rounded-md bg-muted flex items-center justify-center shrink-0">
                        <HelpCircle className="size-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-sm truncate">{f.question}</div>
                        <div className="text-xs text-muted-foreground truncate">{f.answer}</div>
                      </div>
                    </button>
                  ))}
                </Section>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="px-4 py-2 bg-muted/40 text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
        {icon}
        {title}
      </div>
      <div>{children}</div>
    </div>
  )
}
