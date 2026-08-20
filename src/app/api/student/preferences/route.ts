import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth-server'
import { handleApiError, ok, err } from '@/lib/api'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return err('Unauthorized', 401)

    const prefs = await db.preferenceOrder.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          orderBy: { rank: 'asc' },
          include: {
            college: {
              select: { slug: true, name: true, shortName: true, city: true, state: true, imageUrl: true },
            },
            branch: { select: { name: true, fullName: true, feesAnnual: true } },
          },
        },
      },
    })
    return ok({ preferences: prefs })
  } catch (e) {
    return handleApiError(e)
  }
}
