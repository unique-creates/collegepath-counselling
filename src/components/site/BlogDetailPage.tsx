'use client'

import { useEffect, useState } from 'react'
import { useHashRouter } from '@/lib/router'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { PageSkeleton, EmptyState } from '@/components/site/LoadingStates'
import { ArrowLeft, Calendar, User, Tag, Share2, Link2, ListOrdered, ChevronRight } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import type { BlogDetail } from '@/lib/types'

export function BlogDetailPage({ slug }: { slug: string }) {
  const { navigate } = useHashRouter()
  const [post, setPost] = useState<BlogDetail | null>(null)
  const [related, setRelated] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/blog/${slug}`, { cache: 'no-store' })
      .then((r) => {
        if (!r.ok) throw new Error('not found')
        return r.json()
      })
      .then((d) => {
        setPost(d.post)
        setRelated(d.related || [])
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <PageSkeleton />
  if (notFound || !post)
    return (
      <div className="container-wide py-16">
        <EmptyState
          title="Article not found"
          description="This article does not exist or has been removed."
          action={<Button onClick={() => navigate('/blog')}>Back to blog</Button>}
        />
      </div>
    )

  const shareText = `${post.title} - CollegePath`

  const getShareUrl = () => `${window.location.origin}/#/blog/${post.slug}`

  const handleShare = async () => {
    const shareUrl = getShareUrl()
    if (navigator.share) {
      try {
        await navigator.share({ title: post.title, text: shareText, url: shareUrl })
      } catch {}
    } else {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(getShareUrl())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <article className="container-wide py-10 md:py-14">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6 flex-wrap">
        <button onClick={() => navigate('/')} className="hover:text-foreground">Home</button>
        <ChevronRight className="size-3" />
        <button onClick={() => navigate('/blog')} className="hover:text-foreground">Blog</button>
        {post.category && (
          <>
            <ChevronRight className="size-3" />
            <button onClick={() => navigate(`/blog/category/${post.category!.slug}`)} className="hover:text-foreground">
              {post.category.name}
            </button>
          </>
        )}
        <ChevronRight className="size-3" />
        <span className="text-foreground truncate">{post.title}</span>
      </div>

      <button
        onClick={() => navigate(post.category ? `/blog/category/${post.category.slug}` : '/blog')}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="size-4" /> Back to {post.category?.name || 'blog'}
      </button>

      <header className="max-w-3xl mx-auto mb-8">
        {post.category && (
          <Badge variant="secondary" className="mb-3">{post.category.name}</Badge>
        )}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-balance leading-tight">
          {post.title}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground text-pretty">{post.excerpt}</p>
        <div className="mt-6 flex items-center justify-between flex-wrap gap-3 text-sm text-muted-foreground border-b pb-4">
          <div className="flex items-center gap-4">
            {post.author?.name && (
              <span className="flex items-center gap-1.5">
                <User className="size-4" />
                {post.author.name}
              </span>
            )}
            {post.publishedAt && (
              <span className="flex items-center gap-1.5">
                <Calendar className="size-4" />
                {new Date(post.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="mr-1 size-3.5" />
              Share
            </Button>
            <Button variant="outline" size="sm" onClick={handleCopyLink}>
              <Link2 className="mr-1 size-3.5" />
              {copied ? 'Copied!' : 'Copy link'}
            </Button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-8 max-w-5xl mx-auto">
        {/* Article body */}
        <div className="min-w-0">
          {post.featuredImage && (
            <div className="aspect-[16/9] rounded-xl overflow-hidden mb-8 bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.featuredImage} alt={post.title} className="size-full object-cover" />
            </div>
          )}

          {post.tableOfContents.length > 0 && (
            <Card className="lg:hidden mb-6">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3 text-sm font-semibold">
                  <ListOrdered className="size-4" /> Table of contents
                </div>
                <ul className="space-y-1 text-sm">
                  {post.tableOfContents.map((t, idx) => (
                    <li key={idx} style={{ paddingLeft: `${(t.level - 2) * 12}px` }}>
                      <a href={`#${t.id}`} className="text-muted-foreground hover:text-primary">
                        {t.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <div className="prose-blog">
            <ReactMarkdown
              components={{
                h2: ({ node, ...props }) => <h2 id={slugify(props.children)} {...props} />,
                h3: ({ node, ...props }) => <h3 id={slugify(props.children)} {...props} />,
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t flex items-center gap-2 flex-wrap">
              <Tag className="size-4 text-muted-foreground" />
              {post.tags.map((t) => (
                <Badge key={t} variant="outline">{t}</Badge>
              ))}
            </div>
          )}

          {/* FAQ section */}
          {post.faqs.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">FAQs</h2>
              <Accordion type="single" collapsible className="space-y-2">
                {post.faqs.map((f, idx) => (
                  <AccordionItem key={idx} value={`faq-${idx}`} className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline text-left">{f.q}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
        </div>

        {/* Sticky TOC desktop */}
        {post.tableOfContents.length > 0 && (
          <aside className="hidden lg:block">
            <div className="sticky top-20">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3 text-sm font-semibold">
                    <ListOrdered className="size-4" /> Contents
                  </div>
                  <ul className="space-y-1.5 text-sm">
                    {post.tableOfContents.map((t, idx) => (
                      <li key={idx} style={{ paddingLeft: `${(t.level - 2) * 12}px` }}>
                        <a href={`#${t.id}`} className="text-muted-foreground hover:text-primary line-clamp-1">
                          {t.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </aside>
        )}
      </div>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="mt-16 max-w-5xl mx-auto">
          <h2 className="text-xl font-bold mb-4">Related articles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {related.map((p) => (
              <Card
                key={p.slug}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/blog/${p.slug}`)}
              >
                <CardContent className="p-4">
                  <div className="aspect-[16/9] bg-muted rounded-md mb-3 overflow-hidden">
                    {p.featuredImage && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.featuredImage} alt={p.title} className="size-full object-cover" />
                    )}
                  </div>
                  <h3 className="font-medium text-sm line-clamp-2 mb-2">{p.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{p.excerpt}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </article>
  )
}

function slugify(children: any): string {
  const text = typeof children === 'string' ? children : Array.isArray(children) ? children.join('') : String(children || '')
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')
}
