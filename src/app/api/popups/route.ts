import { db } from '@/lib/db'
import { handleApiError, ok } from '@/lib/api'

export const dynamic = 'force-dynamic'

// Returns the currently active popup (the most recent published one that's within its date range)
export async function GET() {
  try {
    const now = new Date()
    const popup = await db.popup.findFirst({
      where: {
        status: 'PUBLISHED',
        AND: [
          { OR: [{ startAt: null }, { startAt: { lte: now } }] },
          { OR: [{ endAt: null }, { endAt: { gte: now } }] },
        ],
      },
      orderBy: { createdAt: 'desc' },
    })
    return ok({ popup })
  } catch (e) {
    return handleApiError(e)
  }
}
