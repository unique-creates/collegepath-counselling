import { db } from '@/lib/db'
import { handleApiError, ok } from '@/lib/api'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const programs = await db.counsellingProgram.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      select: {
        id: true,
        slug: true,
        title: true,
        shortDescription: true,
        duration: true,
        price: true,
        isPaid: true,
        featured: true,
        heroImage: true,
        regStartDate: true,
        regEndDate: true,
        seoTitle: true,
        seoDescription: true,
      },
    })
    return ok({ programs })
  } catch (e) {
    return handleApiError(e)
  }
}
