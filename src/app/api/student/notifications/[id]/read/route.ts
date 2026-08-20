import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth-server'
import { handleApiError, ok, err } from '@/lib/api'

export const dynamic = 'force-dynamic'

export async function PATCH(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user) return err('Unauthorized', 401)
    const { id } = await params
    await db.notification.updateMany({
      where: { id, userId: user.id },
      data: { read: true },
    })
    return ok({ ok: true })
  } catch (e) {
    return handleApiError(e)
  }
}
