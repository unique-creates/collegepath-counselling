import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth-server'
import { handleApiError, ok, err, slugify } from '@/lib/api'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const schema = z.object({
  subject: z.string().min(3).max(200),
  category: z.string(),
  priority: z.string().optional(),
  message: z.string().min(10).max(5000),
})

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return err('Unauthorized', 401)
    const queries = await db.query.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: 'desc' },
      include: { _count: { select: { messages: true } } },
    })
    return ok({ queries })
  } catch (e) {
    return handleApiError(e)
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) return err('Unauthorized', 401)
    const body = await req.json()
    const parsed = schema.parse(body)

    const year = new Date().getFullYear()
    const count = await db.query.count({
      where: { ticketId: { startsWith: `TKT-${year}-` } },
    })
    const ticketId = `TKT-${year}-${String(count + 1).padStart(4, '0')}`

    const q = await db.query.create({
      data: {
        ticketId,
        userId: user.id,
        subject: parsed.subject,
        category: parsed.category,
        priority: parsed.priority || 'NORMAL',
        status: 'OPEN',
      },
    })
    await db.queryMessage.create({
      data: {
        queryId: q.id,
        userId: user.id,
        senderRole: 'STUDENT',
        message: parsed.message,
      },
    })
    await db.notification.create({
      data: {
        userId: user.id,
        title: 'Support Ticket Created',
        message: `Your ticket ${ticketId} has been created. We'll respond soon.`,
        type: 'INFO',
        link: '#/dashboard/support',
      },
    })
    return ok({ ticketId: q.ticketId })
  } catch (e) {
    return handleApiError(e)
  }
}
