import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const tier = searchParams.get('tier')
    const search = searchParams.get('search')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')

    const where: Record<string, unknown> = {}

    if (category && category !== 'All') {
      where.category = category
    }
    if (tier && tier !== 'All') {
      where.tier = tier
    }
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { location: { contains: search } },
      ]
    }
    if (minPrice) {
      where.price = { ...((where.price as Record<string, unknown>) || {}), gte: parseFloat(minPrice) }
    }
    if (maxPrice) {
      where.price = { ...((where.price as Record<string, unknown>) || {}), lte: parseFloat(maxPrice) }
    }

    const listings = await db.listing.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
    })

    return NextResponse.json(listings)
  } catch (error) {
    console.error('Error fetching listings:', error)
    return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 })
  }
}
