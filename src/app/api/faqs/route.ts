import { db } from '@/lib/db'
import { handleApiError, ok, parseJSON } from '@/lib/api'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const faqs = await db.fAQ.findMany({
      where: { published: true },
      orderBy: [{ category: 'asc' }, { order: 'asc' }],
    })
    const grouped: Record<string, typeof faqs> = {}
    faqs.forEach((f) => {
      const c = f.category || 'GENERAL'
      if (!grouped[c]) grouped[c] = []
      grouped[c].push(f)
    })
    return ok({ faqs, grouped })
  } catch (e) {
    return handleApiError(e)
  }
}
