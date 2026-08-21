import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth-server'
import { hashPassword, verifyPassword } from '@/lib/auth-crypto'
import { handleApiError, ok, err } from '@/lib/api'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const schema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(128),
})

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) return err('Unauthorized', 401)

    const body = await req.json()
    const parsed = schema.parse(body)

    // Get the user's current password hash
    const dbUser = await db.user.findUnique({
      where: { id: user.id },
      select: { passwordHash: true },
    })
    if (!dbUser) return err('User not found', 404)

    // Verify current password
    const isValid = verifyPassword(parsed.currentPassword, dbUser.passwordHash)
    if (!isValid) return err('Current password is incorrect', 400)

    // Prevent same password
    if (parsed.currentPassword === parsed.newPassword) {
      return err('New password must be different from current password', 400)
    }

    // Hash and save new password
    await db.user.update({
      where: { id: user.id },
      data: { passwordHash: hashPassword(parsed.newPassword) },
    })

    return ok({ success: true })
  } catch (e) {
    return handleApiError(e)
  }
}
