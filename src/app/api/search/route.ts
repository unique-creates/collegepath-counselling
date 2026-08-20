import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { handleApiError, ok } from '@/lib/api'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = (searchParams.get('q') || '').trim()
    if (!q || q.length < 2) return ok({ colleges: [], programs: [], posts: [], faqs: [] })

    const [colleges, programs, posts, faqs] = await Promise.all([
      db.college.findMany({
        where: {
          status: 'PUBLISHED',
          OR: [
            { name: { contains: q } },
            { shortName: { contains: q } },
            { description: { contains: q } },
            { state: { contains: q } },
            { city: { contains: q } },
          ],
        },
        take: 8,
        select: {
          slug: true,
          name: true,
          shortName: true,
          state: true,
          city: true,
          type: true,
          imageUrl: true,
        },
      }),
      db.counsellingProgram.findMany({
        where: {
          status: 'PUBLISHED',
          OR: [{ title: { contains: q } }, { description: { contains: q } }],
        },
        take: 5,
        select: { slug: true, title: true, shortDescription: true, heroImage: true },
      }),
      db.blogPost.findMany({
        where: {
          status: 'PUBLISHED',
          OR: [{ title: { contains: q } }, { excerpt: { contains: q } }],
        },
        take: 5,
        select: { slug: true, title: true, excerpt: true, featuredImage: true, publishedAt: true },
      }),
      db.fAQ.findMany({
        where: { published: true, OR: [{ question: { contains: q } }, { answer: { contains: q } }] },
        take: 5,
        select: { id: true, question: true, answer: true, category: true },
      }),
    ])

    return ok({ colleges, programs, posts, faqs })
  } catch (e) {
    return handleApiError(e)
  }
}
