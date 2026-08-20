import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth-server'
import { handleApiError, ok, err } from '@/lib/api'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const schema = z.object({
  name: z.string().min(2).max(80).optional(),
  phone: z.string().optional().or(z.literal('')),
  state: z.string().optional().or(z.literal('')),
  city: z.string().optional().or(z.literal('')),
  examType: z.string().optional().or(z.literal('')),
  examRank: z.string().optional().or(z.literal('')),
  examPercentile: z.string().optional().or(z.literal('')),
  category: z.string().optional().or(z.literal('')),
  preferredCourse: z.string().optional().or(z.literal('')),
  preferredBranch: z.string().optional().or(z.literal('')),
  targetYear: z.string().optional().or(z.literal('')),
  classLevel: z.string().optional().or(z.literal('')),
  bio: z.string().max(2000).optional().or(z.literal('')),
})

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) return err('Unauthorized', 401)
    const profile = await db.studentProfile.findUnique({ where: { userId: user.id } })
    return ok({
      user: { name: user.name, email: user.email, image: user.image, role: user.role },
      profile,
    })
  } catch (e) {
    return handleApiError(e)
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) return err('Unauthorized', 401)
    const body = await req.json()
    const parsed = schema.parse(body)

    // Update user name/image
    await db.user.update({
      where: { id: user.id },
      data: {
        name: parsed.name ?? undefined,
        phone: parsed.phone || null,
      },
    })

    // Upsert profile
    await db.studentProfile.upsert({
      where: { userId: user.id },
      update: {
        fullName: parsed.name ?? undefined,
        phone: parsed.phone || null,
        state: parsed.state || null,
        city: parsed.city || null,
        examType: parsed.examType || null,
        examRank: parsed.examRank || null,
        examPercentile: parsed.examPercentile || null,
        category: parsed.category || null,
        preferredCourse: parsed.preferredCourse || null,
        preferredBranch: parsed.preferredBranch || null,
        targetYear: parsed.targetYear || null,
        classLevel: parsed.classLevel || null,
        bio: parsed.bio || null,
      },
      create: {
        userId: user.id,
        fullName: parsed.name || user.name || '',
        phone: parsed.phone || null,
        state: parsed.state || null,
        city: parsed.city || null,
        examType: parsed.examType || null,
        examRank: parsed.examRank || null,
        examPercentile: parsed.examPercentile || null,
        category: parsed.category || null,
        preferredCourse: parsed.preferredCourse || null,
        preferredBranch: parsed.preferredBranch || null,
        targetYear: parsed.targetYear || null,
        classLevel: parsed.classLevel || null,
        bio: parsed.bio || null,
      },
    })
    return ok({ ok: true })
  } catch (e) {
    return handleApiError(e)
  }
}
