import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { handleApiError, ok, err, parseJSON } from '@/lib/api'

export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const post = await db.blogPost.findUnique({
      where: { slug },
      include: {
        author: { select: { name: true, image: true } },
        category: { select: { slug: true, name: true } },
      },
    })
    if (!post || post.status !== 'PUBLISHED' || (post.publishedAt && post.publishedAt > new Date()))
      return err('Article not found', 404)

    // Related posts
    const related = await db.blogPost.findMany({
      where: {
        status: 'PUBLISHED',
        publishedAt: { lte: new Date() },
        slug: { not: slug },
        OR: post.categoryId
          ? [{ categoryId: post.categoryId }]
          : [{ title: { contains: post.title.slice(0, 10) } }],
      },
      take: 3,
      orderBy: { publishedAt: 'desc' },
      select: {
        slug: true,
        title: true,
        excerpt: true,
        featuredImage: true,
        publishedAt: true,
      },
    })

    return ok({
      post: {
        ...post,
        tags: parseJSON(post.tags, []),
        tableOfContents: parseJSON(post.tableOfContents, []),
        faqs: parseJSON(post.faqs, []),
      },
      related,
    })
  } catch (e) {
    return handleApiError(e)
  }
}
