import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth-server'
import { handleApiError, ok, err } from '@/lib/api'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const schema = z.object({
  message: z.string().min(2).max(5000),
})

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser()
    if (!user) return err('Unauthorized', 401)
    const { id } = await params
    const query = await db.query.findFirst({
      where: { id, userId: user.id },
      select: { id: true, status: true },
    })
    if (!query) return err('Ticket not found', 404)

    const body = await req.json()
    const parsed = schema.parse(body)

    await db.queryMessage.create({
      data: {
        queryId: query.id,
        userId: user.id,
        senderRole: 'STUDENT',
        message: parsed.message,
      },
    })
    if (query.status === 'RESOLVED' || query.status === 'CLOSED') {
      await db.query.update({
        where: { id: query.id },
        data: { status: 'OPEN' },
      })
    }
    return ok({ ok: true })
  } catch (e) {
    return handleApiError(e)
  }
}
