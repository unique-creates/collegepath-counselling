import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth-server'
import { handleApiError, ok, err } from '@/lib/api'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return err('Unauthorized', 401)
    const saved = await db.savedCollege.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        college: {
          select: {
            slug: true,
            name: true,
            shortName: true,
            state: true,
            city: true,
            type: true,
            rating: true,
            feesMin: true,
            feesMax: true,
            imageUrl: true,
          },
        },
      },
    })
    return ok({ saved })
  } catch (e) {
    return handleApiError(e)
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) return err('Unauthorized', 401)
    const body = await req.json()
    const { collegeId } = body
    if (!collegeId) return err('collegeId required', 400)

    const existing = await db.savedCollege.findUnique({
      where: { userId_collegeId: { userId: user.id, collegeId } },
    })
    if (existing) {
      await db.savedCollege.delete({ where: { id: existing.id } })
      return ok({ saved: false })
    }
    await db.savedCollege.create({
      data: { userId: user.id, collegeId },
    })
    return ok({ saved: true })
  } catch (e) {
    return handleApiError(e)
  }
}
