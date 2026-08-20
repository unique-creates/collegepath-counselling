import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { generateToken } from '@/lib/auth-crypto'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import { handleApiError, ok, err } from '@/lib/api'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

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
      select: { id: true, status: true },
    })
    if (!user) return ok({ ok: true }) // don't leak existence
    if (user.status !== 'ACTIVE') return ok({ ok: true })

    const expires = new Date(Date.now() + 1000 * 60 * 30) // 30 min
    await db.passwordReset.create({
      data: {
        userId: user.id,
        token: generateToken(48),
        expiresAt: expires,
      },
    })
    // Email integration: in production, send via SMTP.
    return ok({ ok: true })
  } catch (e) {
    return handleApiError(e)
  }
}
