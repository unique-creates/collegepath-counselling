import { db } from '@/lib/db'
import { handleApiError, ok, parseJSON } from '@/lib/api'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const list = await db.testimonial.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: [{ rating: 'desc' }, { createdAt: 'desc' }],
    })
    return ok({ testimonials: list })
  } catch (e) {
    return handleApiError(e)
  }
}
