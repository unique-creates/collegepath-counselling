import { NextRequest } from 'next/server'
import { getCurrentUser } from '@/lib/auth-server'
import { db } from '@/lib/db'
import { handleApiError, ok } from '@/lib/api'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return ok({ user: null })
    const profile = await db.studentProfile.findUnique({
      where: { userId: user.id },
    })
    return ok({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
      },
      profile,
    })
  } catch (e) {
    return handleApiError(e)
  }
}
