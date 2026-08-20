import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth-server'
import { handleApiError, ok } from '@/lib/api'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await requireAdmin()
    const settings = await db.siteSetting.findUnique({ where: { id: 'default' } })
    return ok({ settings })
  } catch (e) {
    return handleApiError(e)
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAdmin()
    const body = await req.json()
    // Strip fields that Prisma manages automatically (id is primary key, updatedAt is @updatedAt)
    // so the update operation doesn't silently fail.
    const { id, updatedAt, createdAt, ...updateData } = body
    const settings = await db.siteSetting.upsert({
      where: { id: 'default' },
      update: updateData,
      create: { id: 'default', ...updateData },
    })
    return ok({ settings })
  } catch (e) {
    return handleApiError(e)
  }
}
