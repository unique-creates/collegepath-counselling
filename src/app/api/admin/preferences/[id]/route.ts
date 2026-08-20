import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireStaff } from '@/lib/auth-server'
import { handleApiError, ok, err } from '@/lib/api'

export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireStaff()
    const { id } = await params
    const pref = await db.preferenceOrder.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: {
          orderBy: { rank: 'asc' },
          include: { college: true, branch: true },
        },
      },
    })
    if (!pref) return err('Preference order not found', 404)
    return ok({ preference: pref })
  } catch (e) {
    return handleApiError(e)
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireStaff()
    const { id } = await params
    const body = await req.json()
    const update: any = {}
    if (body.status) update.status = body.status
    if (body.notes !== undefined) update.notes = body.notes
    if (body.title !== undefined) update.title = body.title
    if (body.pdfUrl !== undefined) update.pdfUrl = body.pdfUrl
    if (body.pdfName !== undefined) update.pdfName = body.pdfName

    const pref = await db.preferenceOrder.update({ where: { id }, data: update })

    // Notify student when published
    if (body.status === 'PUBLISHED' && pref.userId) {
      await db.notification.create({
        data: {
          userId: pref.userId,
          title: 'Preference Order Published!',
          message: 'Your personalized college + branch preference order is now available in your dashboard.',
          type: 'SUCCESS',
          link: '#/dashboard/preferences',
        },
      })
    }
    return ok({ preference: pref })
  } catch (e) {
    return handleApiError(e)
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireStaff()
    const { id } = await params
    await db.preferenceOrder.delete({ where: { id } })
    return ok({ ok: true })
  } catch (e) {
    return handleApiError(e)
  }
}
