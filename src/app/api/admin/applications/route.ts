import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth-server'
import { handleApiError, ok, parseJSON } from '@/lib/api'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    await requireAdmin()
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') || ''
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100)

    const where: any = {}
    if (status) where.status = status

    const [apps, total] = await Promise.all([
      db.counsellingApplication.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              studentProfile: true,
            },
          },
          program: { select: { id: true, title: true, slug: true } },
        },
      }),
      db.counsellingApplication.count({ where }),
    ])

    return ok({
      applications: apps.map((a) => ({
        ...a,
        formData: a.formData ? parseJSON(a.formData, {}) : {},
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch (e) {
    return handleApiError(e)
  }
}
