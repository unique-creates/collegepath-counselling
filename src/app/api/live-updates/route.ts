import { db } from '@/lib/db'
import { handleApiError, ok } from '@/lib/api'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const updates = await db.liveUpdate.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      select: { id: true, message: true, link: true, icon: true },
    })
    return ok({ updates })
  } catch (e) {
    return handleApiError(e)
  }
}
