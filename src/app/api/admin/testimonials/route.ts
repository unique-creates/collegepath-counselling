import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth-server'
import { handleApiError, ok, err } from '@/lib/api'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await requireAdmin()
    const t = await db.testimonial.findMany({
      orderBy: [{ createdAt: 'desc' }],
    })
    return ok({ testimonials: t })
  } catch (e) {
    return handleApiError(e)
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()
    const body = await req.json()
    const t = await db.testimonial.create({
      data: {
        name: body.name,
        role: body.role || null,
        avatar: body.avatar || null,
        rating: body.rating || 5,
        content: body.content,
        college: body.college || null,
        exam: body.exam || null,
        rank: body.rank || null,
        status: body.status || 'PUBLISHED',
      },
    })
    return ok({ testimonial: t })
  } catch (e) {
    return handleApiError(e)
  }
}
