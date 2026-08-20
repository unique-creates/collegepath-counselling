import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth-server'
import { handleApiError, ok, err, slugify } from '@/lib/api'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await requireAdmin()
    const categories = await db.blogCategory.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { posts: true } } },
    })
    return ok({ categories })
  } catch (e) {
    return handleApiError(e)
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()
    const body = await req.json()
    const slug = body.slug || slugify(body.name)
    const existing = await db.blogCategory.findUnique({ where: { slug } })
    if (existing) return err('Slug used', 409)
    const cat = await db.blogCategory.create({
      data: { slug, name: body.name, description: body.description || null },
    })
    return ok({ category: cat })
  } catch (e) {
    return handleApiError(e)
  }
}
