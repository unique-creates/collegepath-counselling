import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireStaff } from '@/lib/auth-server'
import { handleApiError, ok, err } from '@/lib/api'

export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireStaff()
    const { id } = await params
    const query = await db.query.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        messages: { orderBy: { createdAt: 'asc' } },
      },
    })
    if (!query) return err('Ticket not found', 404)
    return ok({ query })
  } catch (e) {
    return handleApiError(e)
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireStaff()
    const { id } = await params
    const body = await req.json()
    const update: any = {}
    if (body.status) update.status = body.status
    if (body.assignedTo !== undefined) update.assignedTo = body.assignedTo
    if (body.priority) update.priority = body.priority
    const q = await db.query.update({ where: { id }, data: update })
    return ok({ query: q })
  } catch (e) {
    return handleApiError(e)
  }
}
