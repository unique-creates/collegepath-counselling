import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  const base = 'https://collegepath.example'
  const now = new Date()

  const [programs, colleges, posts, categories] = await Promise.all([
    db.counsellingProgram.findMany({
      where: { status: 'PUBLISHED', noindex: false },
      select: { slug: true, updatedAt: true },
    }),
    db.college.findMany({
      where: { status: 'PUBLISHED', noindex: false },
      select: { slug: true, updatedAt: true },
    }),
    db.blogPost.findMany({
      where: { status: 'PUBLISHED', noindex: false, publishedAt: { lte: now } },
      select: { slug: true, publishedAt: true, updatedAt: true },
    }),
    db.blogCategory.findMany({ select: { slug: true } }),
  ])

  const urls: Array<{ loc: string; lastmod?: string; changefreq?: string; priority?: number }> = [
    { loc: `${base}/`, changefreq: 'daily', priority: 1.0 },
    { loc: `${base}/#/counselling`, changefreq: 'daily', priority: 0.9 },
    { loc: `${base}/#/colleges`, changefreq: 'daily', priority: 0.9 },
    { loc: `${base}/#/blog`, changefreq: 'daily', priority: 0.8 },
    { loc: `${base}/#/about`, changefreq: 'monthly', priority: 0.6 },
    { loc: `${base}/#/contact`, changefreq: 'monthly', priority: 0.6 },
    { loc: `${base}/#/faq`, changefreq: 'weekly', priority: 0.7 },
    { loc: `${base}/#/compare`, changefreq: 'weekly', priority: 0.7 },
  ]

  programs.forEach((p) =>
    urls.push({
      loc: `${base}/#/counselling/${p.slug}`,
      lastmod: p.updatedAt.toISOString(),
      changefreq: 'weekly',
      priority: 0.8,
    })
  )
  colleges.forEach((c) =>
    urls.push({
      loc: `${base}/#/colleges/${c.slug}`,
      lastmod: c.updatedAt.toISOString(),
      changefreq: 'weekly',
      priority: 0.8,
    })
  )
  posts.forEach((p) =>
    urls.push({
      loc: `${base}/#/blog/${p.slug}`,
      lastmod: (p.publishedAt || p.updatedAt).toISOString(),
      changefreq: 'monthly',
      priority: 0.7,
    })
  )
  categories.forEach((c) =>
    urls.push({
      loc: `${base}/#/blog/category/${c.slug}`,
      changefreq: 'weekly',
      priority: 0.6,
    })
  )

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>${
      u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''
    }${u.changefreq ? `\n    <changefreq>${u.changefreq}</changefreq>` : ''}${
      u.priority !== undefined ? `\n    <priority>${u.priority}</priority>` : ''
    }
  </url>`
  )
  .join('\n')}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
