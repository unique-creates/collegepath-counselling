import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import { handleApiError, ok, err } from '@/lib/api'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const schema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  phone: z.string().optional().or(z.literal('')),
  subject: z.string().min(3).max(200),
  message: z.string().min(10).max(5000),
})

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req)
    const rl = rateLimit(`contact:${ip}`, 5, 60 * 60 * 1000)
    if (!rl.ok) return err('Too many messages. Try later.', 429)

    const body = await req.json()
    const parsed = schema.parse(body)
    const msg = await db.contactMessage.create({
      data: {
        name: parsed.name,
        email: parsed.email,
        phone: parsed.phone || null,
        subject: parsed.subject,
        message: parsed.message,
      },
    })

    // Auto-create lead for admin
    await db.lead.create({
      data: {
        name: parsed.name,
        email: parsed.email,
        phone: parsed.phone || null,
        source: 'CONTACT_FORM',
        programInterest: parsed.subject,
        status: 'NEW',
        notes: parsed.message.slice(0, 500),
      },
    })

    return ok({ id: msg.id, ok: true })
  } catch (e) {
    return handleApiError(e)
  }
}
