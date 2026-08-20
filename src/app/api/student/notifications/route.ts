import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth-server'
import { handleApiError, ok, err } from '@/lib/api'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return err('Unauthorized', 401)
    const notifs = await db.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
    const unreadCount = notifs.filter((n) => !n.read).length
    return ok({ notifications: notifs, unreadCount })
  } catch (e) {
    return handleApiError(e)
  }
}
