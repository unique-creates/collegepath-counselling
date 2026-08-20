import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { handleApiError, ok, err, parseJSON } from '@/lib/api'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = Math.min(parseInt(searchParams.get('limit') || '12', 10), 50)
    const category = searchParams.get('category') || ''
    const tag = searchParams.get('tag') || ''
    const search = searchParams.get('search') || ''

    const where: any = { status: 'PUBLISHED', publishedAt: { lte: new Date() } }
    if (category) {
      where.category = { slug: category }
    }
    if (tag) {
      where.tags = { contains: tag }
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } },
      ]
    }

    const total = await db.blogPost.count({ where })
    const posts = await db.blogPost.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        featuredImage: true,
        publishedAt: true,
        tags: true,
        seoTitle: true,
        seoDescription: true,
        author: { select: { name: true, image: true } },
        category: { select: { slug: true, name: true } },
      },
    })

    const categories = await db.blogCategory.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { posts: { where: { status: 'PUBLISHED' } } } } },
    })

    return ok({
      posts: posts.map((p) => ({
        ...p,
        tags: parseJSON(p.tags, []),
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      categories,
    })
  } catch (e) {
    return handleApiError(e)
  }
}
