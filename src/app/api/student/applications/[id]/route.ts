import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth-server'
import { handleApiError, ok, err } from '@/lib/api'

export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user) return err('Unauthorized', 401)
    const { id } = await params

    const app = await db.counsellingApplication.findFirst({
      where: { id, userId: user.id },
      include: { program: true },
    })
    if (!app) return err('Application not found', 404)

    // Get preference order if exists
    const preferenceOrder = await db.preferenceOrder.findFirst({
      where: { userId: user.id, applicationId: app.id, status: 'PUBLISHED' },
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

    return ok({
      application: {
        ...app,
        formData: app.formData ? JSON.parse(app.formData) : null,
      },
      preferenceOrder,
    })
  } catch (e) {
    return handleApiError(e)
  }
}
