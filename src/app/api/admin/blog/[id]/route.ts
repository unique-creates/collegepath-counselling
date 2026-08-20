import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth-server'
import { handleApiError, ok, err, slugify } from '@/lib/api'

export const dynamic = 'force-dynamic'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params
    const body = await req.json()
    const update: any = { ...body }
    if (body.slug) update.slug = slugify(body.slug)
    if (body.tags) update.tags = JSON.stringify(body.tags)
    if (body.tableOfContents) update.tableOfContents = JSON.stringify(body.tableOfContents)
    if (body.faqs) update.faqs = JSON.stringify(body.faqs)
    if (body.status === 'PUBLISHED' && !body.publishedAt) update.publishedAt = new Date()
    const post = await db.blogPost.update({ where: { id }, data: update })
    return ok({ post })
  } catch (e) {
    return handleApiError(e)
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params
    await db.blogPost.delete({ where: { id } })
    return ok({ ok: true })
  } catch (e) {
    return handleApiError(e)
  }
}
