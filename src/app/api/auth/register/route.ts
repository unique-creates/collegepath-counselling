import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword } from '@/lib/auth-crypto'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import { handleApiError, ok, err } from '@/lib/api'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const schema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().toLowerCase(),
  password: z.string().min(8).max(128),
  phone: z.string().optional().or(z.literal('')),
})

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req)
    const rl = rateLimit(`register:${ip}`, 5, 60 * 60 * 1000)
    if (!rl.ok) return err('Too many registrations. Try later.', 429)

    const body = await req.json()
    const parsed = schema.parse(body)

    const existing = await db.user.findUnique({
      where: { email: parsed.email },
      select: { id: true },
    })
    if (existing) return err('Email is already registered', 409)

    const user = await db.user.create({
      data: {
        name: parsed.name,
        email: parsed.email,
        passwordHash: hashPassword(parsed.password),
        role: 'STUDENT',
        phone: parsed.phone || null,
      },
    })
    await db.studentProfile.create({
      data: {
        userId: user.id,
        fullName: parsed.name,
        phone: parsed.phone || null,
      },
    })
    await db.notification.create({
      data: {
        userId: user.id,
        title: 'Welcome to CollegePath! 🎓',
        message:
          'Your account has been created. Browse counselling programs and explore colleges to get started.',
        type: 'SUCCESS',
      },
    })
    return ok({ id: user.id, email: user.email, name: user.name }, { status: 201 })
  } catch (e) {
    return handleApiError(e)
  }
}
