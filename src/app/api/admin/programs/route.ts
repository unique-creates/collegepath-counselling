import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth-server'
import { handleApiError, ok, err, slugify } from '@/lib/api'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await requireAdmin()
    const programs = await db.counsellingProgram.findMany({
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    })
    return ok({
      programs: programs.map((p) => ({
        ...p,
        whatIncluded: p.whatIncluded ? JSON.parse(p.whatIncluded) : [],
        benefits: p.benefits ? JSON.parse(p.benefits) : [],
        process: p.process ? JSON.parse(p.process) : [],
        faqs: p.faqs ? JSON.parse(p.faqs) : [],
      })),
    })
  } catch (e) {
    return handleApiError(e)
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()
    const body = await req.json()
    const slug = body.slug || slugify(body.title)
    if (!slug) return err('Slug required', 400)
    const existing = await db.counsellingProgram.findUnique({ where: { slug } })
    if (existing) return err('Slug already used', 409)

    const program = await db.counsellingProgram.create({
      data: {
        slug,
        title: body.title,
        shortDescription: body.shortDescription || null,
        description: body.description || '',
        eligibility: body.eligibility || null,
        whatIncluded: body.whatIncluded ? JSON.stringify(body.whatIncluded) : null,
        benefits: body.benefits ? JSON.stringify(body.benefits) : null,
        process: body.process ? JSON.stringify(body.process) : null,
        duration: body.duration || null,
        price: body.price || 0,
        isPaid: body.isPaid || false,
        status: body.status || 'DRAFT',
        featured: body.featured || false,
        regStartDate: body.regStartDate ? new Date(body.regStartDate) : null,
        regEndDate: body.regEndDate ? new Date(body.regEndDate) : null,
        faqs: body.faqs ? JSON.stringify(body.faqs) : null,
        heroImage: body.heroImage || null,
        seoTitle: body.seoTitle || null,
        seoDescription: body.seoDescription || null,
        seoKeywords: body.seoKeywords || null,
        ogImage: body.ogImage || null,
        canonicalUrl: body.canonicalUrl || null,
        noindex: body.noindex || false,
      },
    })
    return ok({ program })
  } catch (e) {
    return handleApiError(e)
  }
}
