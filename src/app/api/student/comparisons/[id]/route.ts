import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth-server'
import { handleApiError, ok, err } from '@/lib/api'

export const dynamic = 'force-dynamic'

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user) return err('Unauthorized', 401)
    const { id } = await params
    await db.collegeComparison.deleteMany({
      where: { id, userId: user.id },
    })
    return ok({ ok: true })
  } catch (e) {
    return handleApiError(e)
  }
}
