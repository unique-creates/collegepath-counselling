import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth-server'
import { handleApiError, ok, err, slugify } from '@/lib/api'

export const dynamic = 'force-dynamic'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params
    const body = await req.json()
    const update: any = { ...body }
    if (body.slug) update.slug = slugify(body.slug)
    if (body.placementSummary) update.placementSummary = JSON.stringify(body.placementSummary)
    if (body.faqs) update.faqs = JSON.stringify(body.faqs)
    const college = await db.college.update({ where: { id }, data: update })
    return ok({ college })
  } catch (e) {
    return handleApiError(e)
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params
    await db.college.delete({ where: { id } })
    return ok({ ok: true })
  } catch (e) {
    return handleApiError(e)
  }
}
