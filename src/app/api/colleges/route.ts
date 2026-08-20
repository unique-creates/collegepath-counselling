import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { handleApiError, ok } from '@/lib/api'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const state = searchParams.get('state') || ''
    const city = searchParams.get('city') || ''
    const type = searchParams.get('type') || ''
    const branch = searchParams.get('branch') || ''
    const counsellingBody = searchParams.get('counsellingBody') || ''
    const minFees = searchParams.get('minFees')
    const maxFees = searchParams.get('maxFees')
    const sort = searchParams.get('sort') || 'featured' // featured | name | rating | fees_asc | fees_desc
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = Math.min(parseInt(searchParams.get('limit') || '12', 10), 50)

    const where: any = { status: 'PUBLISHED' }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { shortName: { contains: search } },
        { description: { contains: search } },
      ]
    }
    if (state) where.state = state
    if (city) where.city = city
    if (type) where.type = type
    if (counsellingBody) where.counsellingBody = counsellingBody
    if (branch) {
      where.branches = { some: { name: { contains: branch } } }
    }
    if (minFees || maxFees) {
      where.feesMin = {}
      if (minFees) where.feesMin.gte = parseFloat(minFees)
      if (maxFees) {
        where.feesMax = { lte: parseFloat(maxFees) }
      }
    }

    let orderBy: any = [{ featured: 'desc' }, { name: 'asc' }]
    if (sort === 'name') orderBy = { name: 'asc' }
    if (sort === 'rating') orderBy = { rating: 'desc' }
    if (sort === 'fees_asc') orderBy = { feesMin: 'asc' }
    if (sort === 'fees_desc') orderBy = { feesMin: 'desc' }

    const total = await db.college.count({ where })
    const colleges = await db.college.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        slug: true,
        name: true,
        shortName: true,
        state: true,
        city: true,
        type: true,
        established: true,
        rating: true,
        feesMin: true,
        feesMax: true,
        imageUrl: true,
        logoUrl: true,
        counsellingBody: true,
        featured: true,
        _count: { select: { branches: true } },
      },
    })

    // Get filters
    const states = await db.college.findMany({
      where: { status: 'PUBLISHED' },
      select: { state: true },
      distinct: ['state'],
    })
    const cities = await db.college.findMany({
      where: { status: 'PUBLISHED' },
      select: { city: true },
      distinct: ['city'],
    })
    const types = await db.college.findMany({
      where: { status: 'PUBLISHED' },
      select: { type: true },
      distinct: ['type'],
    })
    const branches = await db.branch.findMany({
      select: { name: true },
      distinct: ['name'],
      orderBy: { name: 'asc' },
    })
    const counsellingBodies = await db.college.findMany({
      where: { status: 'PUBLISHED' },
      select: { counsellingBody: true },
      distinct: ['counsellingBody'],
    })

    return ok({
      colleges,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      filters: {
        states: states.map((s) => s.state).filter(Boolean),
        cities: cities.map((c) => c.city).filter(Boolean),
        types: types.map((t) => t.type).filter(Boolean),
        branches: branches.map((b) => b.name).filter(Boolean),
        counsellingBodies: counsellingBodies.map((c) => c.counsellingBody).filter(Boolean),
      },
    })
  } catch (e) {
    return handleApiError(e)
  }
}
