import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth-server'
import { handleApiError, ok, err } from '@/lib/api'

export const dynamic = 'force-dynamic'

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ collegeId: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user) return err('Unauthorized', 401)
    const { collegeId } = await params
    await db.savedCollege.deleteMany({
      where: { userId: user.id, collegeId },
    })
    return ok({ ok: true })
  } catch (e) {
    return handleApiError(e)
  }
}
