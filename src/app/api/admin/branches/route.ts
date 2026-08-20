import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth-server'
import { handleApiError, ok, err } from '@/lib/api'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()
    const body = await req.json()
    const branch = await db.branch.create({
      data: {
        collegeId: body.collegeId,
        name: body.name,
        fullName: body.fullName || null,
        duration: body.duration || null,
        totalSeats: body.totalSeats || null,
        feesAnnual: body.feesAnnual || null,
        placementRate: body.placementRate || null,
        avgPackage: body.avgPackage || null,
        highestPackage: body.highestPackage || null,
        topRecruiters: body.topRecruiters ? JSON.stringify(body.topRecruiters) : null,
        description: body.description || null,
        cutoffInfo: body.cutoffInfo || null,
      },
    })
    return ok({ branch })
  } catch (e) {
    return handleApiError(e)
  }
}
