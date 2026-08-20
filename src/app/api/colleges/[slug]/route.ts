import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { handleApiError, ok, err, parseJSON } from '@/lib/api'

export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const college = await db.college.findUnique({
      where: { slug },
      include: {
        branches: {
          orderBy: { name: 'asc' },
        },
      },
    })
    if (!college || college.status !== 'PUBLISHED') return err('College not found', 404)

    // Related colleges (same state or same type)
    const related = await db.college.findMany({
      where: {
        status: 'PUBLISHED',
        slug: { not: slug },
        OR: [{ state: college.state }, { type: college.type }],
      },
      take: 4,
      select: {
        slug: true,
        name: true,
        shortName: true,
        state: true,
        city: true,
        rating: true,
        imageUrl: true,
        type: true,
      },
    })

    return ok({
      college: {
        ...college,
        placementSummary: parseJSON(college.placementSummary, null),
        faqs: parseJSON(college.faqs, []),
      },
      related,
    })
  } catch (e) {
    return handleApiError(e)
  }
}
