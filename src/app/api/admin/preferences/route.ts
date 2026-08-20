import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireStaff } from '@/lib/auth-server'
import { handleApiError, ok, err } from '@/lib/api'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const schema = z.object({
  userId: z.string(),
  applicationId: z.string().optional(),
  status: z.string().default('DRAFT'),
  notes: z.string().optional().or(z.literal('')),
})

export async function GET(req: NextRequest) {
  try {
    await requireStaff()
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const where: any = {}
    if (userId) where.userId = userId
    const prefs = await db.preferenceOrder.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: {
          orderBy: { rank: 'asc' },
          include: { college: true, branch: true },
        },
      },
    })
    return ok({ preferences: prefs })
  } catch (e) {
    return handleApiError(e)
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireStaff()
    const body = await req.json()
    const parsed = schema.parse(body)
    const pref = await db.preferenceOrder.create({
      data: {
        userId: parsed.userId,
        applicationId: parsed.applicationId || null,
        status: parsed.status,
        notes: parsed.notes || null,
      },
    })
    return ok({ preference: pref })
  } catch (e) {
    return handleApiError(e)
  }
}
