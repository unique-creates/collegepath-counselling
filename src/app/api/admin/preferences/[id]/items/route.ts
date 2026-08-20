import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireStaff } from '@/lib/auth-server'
import { handleApiError, ok, err } from '@/lib/api'

export const dynamic = 'force-dynamic'

// Create or update preference items (replace all items)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireStaff()
    const { id } = await params
    const body = await req.json()
    const items: Array<{
      rank: number
      collegeId: string
      branchId?: string | null
      recommendation?: string | null
      notes?: string | null
    }> = body.items || []

    const pref = await db.preferenceOrder.findUnique({ where: { id } })
    if (!pref) return err('Preference order not found', 404)

    // Delete existing items
    await db.preferenceItem.deleteMany({ where: { preferenceOrderId: id } })

    // Create new items
    if (items.length > 0) {
      await db.preferenceItem.createMany({
        data: items.map((it) => ({
          preferenceOrderId: id,
          rank: it.rank,
          collegeId: it.collegeId,
          branchId: it.branchId || null,
          recommendation: it.recommendation || null,
          notes: it.notes || null,
        })),
      })
    }
    return ok({ ok: true })
  } catch (e) {
    return handleApiError(e)
  }
}
