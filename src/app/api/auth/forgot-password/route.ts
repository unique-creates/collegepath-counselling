import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { generateToken } from '@/lib/auth-crypto'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import { handleApiError, ok, err } from '@/lib/api'
import { z } from 'zod'

const schema = z.object({ email: z.string().email() })

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req)
    const rl = rateLimit(`forgot:${ip}`, 5, 60 * 60 * 1000)
    if (!rl.ok) return err('Too many requests. Try later.', 429)

    const body = await req.json()
    const parsed = schema.parse(body)

    const user = await db.user.findUnique({
      where: { email: parsed.email.toLowerCase() },
      select: { id: true, status: true, name: true, email: true },
    })
    if (!user) return ok({ ok: true, message: 'If your email is registered, a reset link has been generated.' })
    if (user.status !== 'ACTIVE') return ok({ ok: true, message: 'If your email is registered, a reset link has been generated.' })

    const token = generateToken(48)
    const expires = new Date(Date.now() + 1000 * 60 * 30) // 30 min
    await db.passwordReset.create({
      data: {
        userId: user.id,
        token,
        expiresAt: expires,
      },
    })

    // In production with email service configured, send email here.
    // For now, return the reset link so the user can use it.
    const resetLink = `/#/reset-password?token=${token}`

    return ok({
      ok: true,
      resetLink,
      message: 'A password reset link has been generated. Use it to reset your password.',
    })
  } catch (e) {
    return handleApiError(e)
  }
}
