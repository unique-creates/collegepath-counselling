import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth-server'
import { handleApiError, ok, err } from '@/lib/api'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await requireAdmin()
    const faqs = await db.fAQ.findMany({
      orderBy: [{ category: 'asc' }, { order: 'asc' }],
    })
    return ok({ faqs })
  } catch (e) {
    return handleApiError(e)
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()
    const body = await req.json()
    const faq = await db.fAQ.create({
      data: {
        question: body.question,
        answer: body.answer,
        category: body.category || 'GENERAL',
        order: body.order || 0,
        published: body.published ?? true,
      },
    })
    return ok({ faq })
  } catch (e) {
    return handleApiError(e)
  }
}
