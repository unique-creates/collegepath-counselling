import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth-server'
import { handleApiError, ok } from '@/lib/api'

export const dynamic = 'force-dynamic'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params
    const body = await req.json()
    const update: any = { ...body }
    if (body.startAt) update.startAt = new Date(body.startAt)
    if (body.endAt) update.endAt = new Date(body.endAt)
    const popup = await db.popup.update({ where: { id }, data: update })
    return ok({ popup })
  } catch (e) {
    return handleApiError(e)
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params
    await db.popup.delete({ where: { id } })
    return ok({ ok: true })
  } catch (e) {
    return handleApiError(e)
  }
}
