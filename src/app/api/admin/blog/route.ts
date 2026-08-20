import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth-server'
import { handleApiError, ok, err, slugify } from '@/lib/api'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await requireAdmin()
    const posts = await db.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { name: true } },
        category: { select: { slug: true, name: true } },
      },
    })
    return ok({
      posts: posts.map((p) => ({
        ...p,
        tags: p.tags ? JSON.parse(p.tags) : [],
        faqs: p.faqs ? JSON.parse(p.faqs) : [],
        tableOfContents: p.tableOfContents ? JSON.parse(p.tableOfContents) : [],
      })),
    })
  } catch (e) {
    return handleApiError(e)
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAdmin()
    const body = await req.json()
    const slug = body.slug || slugify(body.title)
    const existing = await db.blogPost.findUnique({ where: { slug } })
    if (existing) return err('Slug already used', 409)

    const post = await db.blogPost.create({
      data: {
        slug,
        title: body.title,
        excerpt: body.excerpt || null,
        content: body.content || '',
        featuredImage: body.featuredImage || null,
        authorId: user.id,
        categoryId: body.categoryId || null,
        status: body.status || 'DRAFT',
        tags: body.tags ? JSON.stringify(body.tags) : null,
        tableOfContents: body.tableOfContents ? JSON.stringify(body.tableOfContents) : null,
        seoTitle: body.seoTitle || null,
        seoDescription: body.seoDescription || null,
        seoKeywords: body.seoKeywords || null,
        ogImage: body.ogImage || null,
        canonicalUrl: body.canonicalUrl || null,
        noindex: body.noindex || false,
        faqs: body.faqs ? JSON.stringify(body.faqs) : null,
        publishedAt: body.status === 'PUBLISHED' ? new Date() : null,
      },
    })
    return ok({ post })
  } catch (e) {
    return handleApiError(e)
  }
}
