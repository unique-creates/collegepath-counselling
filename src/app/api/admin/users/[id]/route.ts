import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth-server'
import { handleApiError, ok, err } from '@/lib/api'

export const dynamic = 'force-dynamic'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params
    const body = await req.json()
    const { status, role } = body
    if (status && !['ACTIVE', 'SUSPENDED', 'PENDING'].includes(status))
      return err('Invalid status', 400)
    if (role && !['STUDENT', 'COUNSELLOR', 'ADMIN'].includes(role))
      return err('Invalid role', 400)
    const user = await db.user.update({
      where: { id },
      data: {
        ...(status ? { status } : {}),
        ...(role ? { role } : {}),
      },
      select: { id: true, name: true, email: true, role: true, status: true },
    })
    return ok({ user })
  } catch (e) {
    return handleApiError(e)
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params
    await db.user.delete({ where: { id } })
    return ok({ ok: true })
  } catch (e) {
    return handleApiError(e)
  }
}
