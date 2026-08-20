import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireStaff } from '@/lib/auth-server'
import { handleApiError, ok, err } from '@/lib/api'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const schema = z.object({
  message: z.string().min(1).max(5000),
})

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireStaff()
    const { id } = await params
    const query = await db.query.findUnique({ where: { id } })
    if (!query) return err('Ticket not found', 404)

    const body = await req.json()
    const parsed = schema.parse(body)

    const msg = await db.queryMessage.create({
      data: {
        queryId: query.id,
        userId: user.id,
        senderRole: user.role,
        message: parsed.message,
      },
    })

    // Auto update status to in_progress if open
    if (query.status === 'OPEN') {
      await db.query.update({
        where: { id: query.id },
        data: { status: 'IN_PROGRESS' },
      })
    }
    // Notify student
    await db.notification.create({
      data: {
        userId: query.userId,
        title: 'Reply on your support ticket',
        message: `New reply on ticket "${query.subject}"`,
        type: 'INFO',
        link: '#/dashboard/support',
      },
    })
    return ok({ message: msg })
  } catch (e) {
    return handleApiError(e)
  }
}
