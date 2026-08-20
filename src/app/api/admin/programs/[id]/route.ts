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
    if (body.whatIncluded) update.whatIncluded = JSON.stringify(body.whatIncluded)
    if (body.benefits) update.benefits = JSON.stringify(body.benefits)
    if (body.process) update.process = JSON.stringify(body.process)
    if (body.faqs) update.faqs = JSON.stringify(body.faqs)
    if (body.regStartDate) update.regStartDate = new Date(body.regStartDate)
    if (body.regEndDate) update.regEndDate = new Date(body.regEndDate)

    const program = await db.counsellingProgram.update({
      where: { id },
      data: update,
    })
    return ok({ program })
  } catch (e) {
    return handleApiError(e)
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params
    await db.counsellingProgram.delete({ where: { id } })
    return ok({ ok: true })
  } catch (e) {
    return handleApiError(e)
  }
}
