import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth-server'
import { handleApiError, ok, err } from '@/lib/api'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await requireAdmin()
    const popups = await db.popup.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return ok({ popups })
  } catch (e) {
    return handleApiError(e)
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()
    const body = await req.json()
    if (!body.title || !body.message) return err('Title and message required', 400)
    const popup = await db.popup.create({
      data: {
        title: body.title,
        message: body.message,
        imageUrl: body.imageUrl || null,
        ctaText: body.ctaText || null,
        ctaLink: body.ctaLink || null,
        status: body.status || 'DRAFT',
        showOnAllPages: body.showOnAllPages ?? true,
        frequency: body.frequency || 'ONCE_PER_SESSION',
        startAt: body.startAt ? new Date(body.startAt) : null,
        endAt: body.endAt ? new Date(body.endAt) : null,
      },
    })
    return ok({ popup })
  } catch (e) {
    return handleApiError(e)
  }
}
