import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireStaff } from '@/lib/auth-server'
import { handleApiError, ok, err } from '@/lib/api'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const schema = z.object({
  userIds: z.array(z.string()).min(1),
  title: z.string().optional(),
  notes: z.string().optional().or(z.literal('')),
  status: z.string().default('DRAFT'),
})

// Create preference orders for multiple students at once (optionally with a PDF)
export async function POST(req: NextRequest) {
  try {
    await requireStaff()
    const body = await req.json()
    const parsed = schema.parse(body)

    // Verify all users exist and are students
    const users = await db.user.findMany({
      where: { id: { in: parsed.userIds } },
      select: { id: true, role: true, name: true, email: true },
    })
    if (users.length !== parsed.userIds.length) {
      return err('One or more students not found', 404)
    }
    const nonStudents = users.filter((u) => u.role !== 'STUDENT')
    if (nonStudents.length > 0) {
      return err(`Some selected users are not students: ${nonStudents.map((u) => u.email).join(', ')}`, 400)
    }

    const created = await Promise.all(
      parsed.userIds.map((userId) =>
        db.preferenceOrder.create({
          data: {
            userId,
            status: parsed.status,
            notes: parsed.notes || null,
            title: parsed.title || null,
          },
        })
      )
    )

    return ok({ preferences: created, count: created.length })
  } catch (e) {
    return handleApiError(e)
  }
}
