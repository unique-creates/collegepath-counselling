import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword, verifyPassword } from '@/lib/auth-crypto'
import { handleApiError, ok, err } from '@/lib/api'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const schema = z.object({
  token: z.string().min(10),
  password: z.string().min(8).max(128),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.parse(body)
    const reset = await db.passwordReset.findUnique({
      where: { token: parsed.token },
    })
    if (!reset) return err('Invalid or expired token', 400)
    if (reset.usedAt || reset.expiresAt < new Date())
      return err('Token expired. Please request a new one.', 400)

    await db.$transaction([
      db.user.update({
        where: { id: reset.userId },
        data: { passwordHash: hashPassword(parsed.password) },
      }),
      db.passwordReset.update({
        where: { id: reset.id },
        data: { usedAt: new Date() },
      }),
    ])
    return ok({ ok: true })
  } catch (e) {
    return handleApiError(e)
  }
}
