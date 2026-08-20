import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth-server'
import { handleApiError, ok, err } from '@/lib/api'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const schema = z.object({
  name: z.string().optional(),
  collegeAId: z.string(),
  collegeBId: z.string().optional(),
  collegeCId: z.string().optional(),
})

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return err('Unauthorized', 401)
    const comparisons = await db.collegeComparison.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        collegeA: { select: { slug: true, name: true, shortName: true, imageUrl: true, city: true, state: true } },
        collegeB: { select: { slug: true, name: true, shortName: true, imageUrl: true, city: true, state: true } },
        collegeC: { select: { slug: true, name: true, shortName: true, imageUrl: true, city: true, state: true } },
      },
    })
    return ok({ comparisons })
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
    const comp = await db.collegeComparison.create({
      data: {
        userId: user.id,
        name: parsed.name,
        collegeAId: parsed.collegeAId,
        collegeBId: parsed.collegeBId || null,
        collegeCId: parsed.collegeCId || null,
      },
    })
    return ok({ comparison: comp })
  } catch (e) {
    return handleApiError(e)
  }
}
