import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth-server'
import { handleApiError, ok, err, slugify } from '@/lib/api'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await requireAdmin()
    const colleges = await db.college.findMany({
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      include: { _count: { select: { branches: true } } },
    })
    // Parse JSON fields so the admin form can edit them properly
    return ok({
      colleges: colleges.map((c) => ({
        ...c,
        placementSummary: c.placementSummary ? JSON.parse(c.placementSummary) : null,
        faqs: c.faqs ? JSON.parse(c.faqs) : [],
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
    const slug = body.slug || slugify(body.name)
    const existing = await db.college.findUnique({ where: { slug } })
    if (existing) return err('Slug already used', 409)
    const college = await db.college.create({
      data: {
        slug,
        name: body.name,
        shortName: body.shortName || null,
        description: body.description || '',
        state: body.state || '',
        city: body.city || '',
        type: body.type || 'PRIVATE',
        established: body.established || null,
        website: body.website || null,
        email: body.email || null,
        phone: body.phone || null,
        address: body.address || null,
        logoUrl: body.logoUrl || null,
        imageUrl: body.imageUrl || null,
        admissionProcess: body.admissionProcess || null,
        counsellingBody: body.counsellingBody || null,
        placementSummary: body.placementSummary ? JSON.stringify(body.placementSummary) : null,
        feesMin: body.feesMin || null,
        feesMax: body.feesMax || null,
        rating: body.rating || null,
        status: body.status || 'DRAFT',
        featured: body.featured || false,
        seoTitle: body.seoTitle || null,
        seoDescription: body.seoDescription || null,
        ogImage: body.ogImage || null,
        canonicalUrl: body.canonicalUrl || null,
        noindex: body.noindex || false,
        faqs: body.faqs ? JSON.stringify(body.faqs) : null,
      },
    })
    return ok({ college })
  } catch (e) {
    return handleApiError(e)
  }
}
