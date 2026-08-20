import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth-server'
import { handleApiError, ok, err } from '@/lib/api'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return err('Unauthorized', 401)

    const apps = await db.counsellingApplication.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        program: {
          select: { title: true, slug: true, heroImage: true, duration: true },
        },
      },
    })

    return ok({
      applications: apps.map((a) => ({
        ...a,
        formData: a.formData ? JSON.parse(a.formData) : null,
      })),
    })
  } catch (e) {
    return handleApiError(e)
  }
}
