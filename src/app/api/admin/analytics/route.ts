import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth-server'
import { handleApiError, ok } from '@/lib/api'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await requireAdmin()

    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const [
      totalUsers,
      newUsers,
      totalAdmins,
      totalCounsellors,
      counsellingRegistrations,
      newApplications,
      leads,
      newLeads,
      convertedLeads,
      queries,
      openQueries,
      totalPrograms,
      activePrograms,
      totalColleges,
      totalPosts,
      publishedPosts,
      totalFaqs,
      totalTestimonials,
      recentSignups,
      programStats,
      topColleges,
      blogTraffic,
    ] = await Promise.all([
      db.user.count(),
      db.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      db.user.count({ where: { role: 'ADMIN' } }),
      db.user.count({ where: { role: 'COUNSELLOR' } }),
      db.counsellingApplication.count(),
      db.counsellingApplication.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      db.lead.count(),
      db.lead.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      db.lead.count({ where: { status: 'CONVERTED' } }),
      db.query.count(),
      db.query.count({ where: { status: 'OPEN' } }),
      db.counsellingProgram.count(),
      db.counsellingProgram.count({ where: { status: 'PUBLISHED' } }),
      db.college.count({ where: { status: 'PUBLISHED' } }),
      db.blogPost.count(),
      db.blogPost.count({ where: { status: 'PUBLISHED' } }),
      db.fAQ.count({ where: { published: true } }),
      db.testimonial.count({ where: { status: 'PUBLISHED' } }),
      db.user.findMany({
        where: { createdAt: { gte: sevenDaysAgo } },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, name: true, email: true, createdAt: true },
      }),
      db.counsellingProgram.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          title: true,
          slug: true,
          _count: { select: { applications: true } },
        },
      }),
      db.college.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { rating: 'desc' },
        take: 5,
        select: {
          id: true,
          name: true,
          slug: true,
          rating: true,
          _count: { select: { savedBy: true } },
        },
      }),
      db.blogPost.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { publishedAt: 'desc' },
        take: 5,
        select: { id: true, title: true, slug: true, publishedAt: true },
      }),
    ])

    const conversionRate = totalUsers > 0 ? (convertedLeads / totalUsers) * 100 : 0
    const leadConversionRate = leads > 0 ? (convertedLeads / leads) * 100 : 0

    return ok({
      overview: {
        totalUsers,
        newUsers,
        totalAdmins,
        totalCounsellors,
        counsellingRegistrations,
        newApplications,
        leads,
        newLeads,
        convertedLeads,
        queries,
        openQueries,
        totalPrograms,
        activePrograms,
        totalColleges,
        totalPosts,
        publishedPosts,
        totalFaqs,
        totalTestimonials,
        conversionRate: Number(conversionRate.toFixed(2)),
        leadConversionRate: Number(leadConversionRate.toFixed(2)),
      },
      recentSignups,
      programStats: programStats.map((p) => ({
        ...p,
        applications: p._count.applications,
        _count: undefined,
      })),
      topColleges: topColleges.map((c) => ({
        ...c,
        saves: c._count.savedBy,
        _count: undefined,
      })),
      recentPosts: blogTraffic,
    })
  } catch (e) {
    return handleApiError(e)
  }
}
