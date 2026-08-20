import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth-server'
import { handleApiError, ok, err } from '@/lib/api'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const schema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  source: z.string().default('MANUAL'),
  programInterest: z.string().optional().or(z.literal('')),
  status: z.string().default('NEW'),
  assignedToId: z.string().optional().nullable(),
  notes: z.string().optional().or(z.literal('')),
})

export async function GET(req: NextRequest) {
  try {
    await requireAdmin()
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') || ''
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100)
    const where: any = {}
    if (status) where.status = status

    const [leads, total] = await Promise.all([
      db.lead.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          assignedTo: { select: { id: true, name: true } },
        },
      }),
      db.lead.count({ where }),
    ])
    return ok({
      leads,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch (e) {
    return handleApiError(e)
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAdmin()
    const body = await req.json()
    const parsed = schema.parse(body)
    const lead = await db.lead.create({
      data: {
        name: parsed.name,
        email: parsed.email || null,
        phone: parsed.phone || null,
        source: parsed.source,
        programInterest: parsed.programInterest || null,
        status: parsed.status,
        assignedToId: parsed.assignedToId || null,
        createdById: user.id,
        notes: parsed.notes || null,
      },
    })
    return ok({ lead })
  } catch (e) {
    return handleApiError(e)
  }
}
