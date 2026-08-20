'use client'

import { useEffect, useState } from 'react'
import { useHashRouter } from '@/lib/router'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CardGridSkeleton, EmptyState } from '@/components/site/LoadingStates'
import { Calendar, User, ArrowRight, FileText } from 'lucide-react'
import type { BlogListItem, BlogCategory } from '@/lib/types'

type Props = { categorySlug?: string }

export function BlogListPage({ categorySlug }: Props) {
  const { navigate } = useHashRouter()
  const [posts, setPosts] = useState<BlogListItem[]>([])
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (categorySlug) params.set('category', categorySlug)
    params.set('page', String(page))
    fetch(`/api/blog?${params}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        setPosts(d.posts || [])
        setCategories(d.categories || [])
        setTotalPages(d.pagination?.totalPages || 1)
      })
      .finally(() => setLoading(false))
  }, [categorySlug, page])

  const activeCategory = categories.find((c) => c.slug === categorySlug)

  return (
    <div className="container-wide py-10 md:py-14">
      <header className="max-w-3xl mb-10">
        <Badge variant="secondary" className="mb-3">Blog & Guides</Badge>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-balance">
          {activeCategory ? activeCategory.name : 'Counselling & college guides'}
        </h1>
        <p className="mt-4 text-muted-foreground text-lg">
          In-depth guides on JoSAA, UPTAC, CSAB, college comparisons, cutoff trends and career options. Written by experienced counsellors.
        </p>
      </header>

      {/* Category chips */}
      {!categorySlug && categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <Button
            variant={!categorySlug ? 'default' : 'outline'}
            size="sm"
            onClick={() => navigate('/blog')}
          >
            All posts
          </Button>
          {categories.map((c) => (
            <Button
              key={c.slug}
              variant={categorySlug === c.slug ? 'default' : 'outline'}
              size="sm"
              onClick={() => navigate(`/blog/category/${c.slug}`)}
            >
              {c.name} <span className="ml-1 opacity-60">({c._count?.posts || 0})</span>
            </Button>
          ))}
        </div>
      )}

      {loading ? (
        <CardGridSkeleton count={6} />
      ) : posts.length === 0 ? (
        <EmptyState
          title="No articles found"
          description={categorySlug ? `No posts in "${activeCategory?.name}" category yet.` : 'No blog posts published yet.'}
          icon={<FileText className="size-12" />}
          action={categorySlug && <Button variant="outline" onClick={() => navigate('/blog')}>View all posts</Button>}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((p) => (
              <Card
                key={p.id}
                className="flex flex-col hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
                onClick={() => navigate(`/blog/${p.slug}`)}
              >
                <div className="aspect-[16/9] bg-muted relative overflow-hidden">
                  {p.featuredImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.featuredImage} alt={p.title} className="size-full object-cover" />
                  ) : (
                    <div className="size-full flex items-center justify-center">
                      <FileText className="size-12 text-muted-foreground/40" />
                    </div>
                  )}
                  {p.category && (
                    <Badge variant="secondary" className="absolute top-2 left-2">
                      {p.category.name}
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4 flex-1 flex flex-col">
                  <h3 className="font-semibold text-base leading-tight line-clamp-2 mb-2">{p.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-3 flex-1">{p.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t">
                    <div className="flex items-center gap-2">
                      {p.author?.name && (
                        <span className="flex items-center gap-1">
                          <User className="size-3" />
                          {p.author.name}
                        </span>
                      )}
                    </div>
                    {p.publishedAt && (
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        {new Date(p.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                Previous
              </Button>
              <span className="text-sm">Page {page} of {totalPages}</span>
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
