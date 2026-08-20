import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth-server'
import { handleApiError, ok, err } from '@/lib/api'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await requireAdmin()
    const banners = await db.banner.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    })
    return ok({ banners })
  } catch (e) {
    return handleApiError(e)
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()
    const body = await req.json()
    if (!body.message) return err('Message required', 400)
    const banner = await db.banner.create({
      data: {
        message: body.message,
        link: body.link || null,
        ctaText: body.ctaText || null,
        variant: body.variant || 'info',
        dismissible: body.dismissible ?? true,
        status: body.status || 'PUBLISHED',
        order: body.order || 0,
        startAt: body.startAt ? new Date(body.startAt) : null,
        endAt: body.endAt ? new Date(body.endAt) : null,
      },
    })
    return ok({ banner })
  } catch (e) {
    return handleApiError(e)
  }
}
