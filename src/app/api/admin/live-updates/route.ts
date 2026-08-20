import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth-server'
import { handleApiError, ok, err } from '@/lib/api'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await requireAdmin()
    const updates = await db.liveUpdate.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    })
    return ok({ updates })
  } catch (e) {
    return handleApiError(e)
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()
    const body = await req.json()
    if (!body.message) return err('Message required', 400)
    const update = await db.liveUpdate.create({
      data: {
        message: body.message,
        link: body.link || null,
        icon: body.icon || null,
        status: body.status || 'PUBLISHED',
        order: body.order || 0,
      },
    })
    return ok({ update })
  } catch (e) {
    return handleApiError(e)
  }
}
