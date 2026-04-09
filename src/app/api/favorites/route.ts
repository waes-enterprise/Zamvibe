import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json([])
    }

    const favorites = await db.favorite.findMany({
      where: { sessionId },
      include: { listing: true },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(favorites.map(f => f.listing))
  } catch (error) {
    console.error('Error fetching favorites:', error)
    return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { listingId, sessionId } = await request.json()

    if (!listingId || !sessionId) {
      return NextResponse.json({ error: 'Missing listingId or sessionId' }, { status: 400 })
    }

    const existing = await db.favorite.findFirst({
      where: { listingId, sessionId },
    })

    if (existing) {
      return NextResponse.json({ message: 'Already favorited' }, { status: 200 })
    }

    const favorite = await db.favorite.create({
      data: { listingId, sessionId },
    })

    return NextResponse.json(favorite, { status: 201 })
  } catch (error) {
    console.error('Error creating favorite:', error)
    return NextResponse.json({ error: 'Failed to create favorite' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const listingId = searchParams.get('listingId')
    const sessionId = searchParams.get('sessionId')

    if (!listingId || !sessionId) {
      return NextResponse.json({ error: 'Missing listingId or sessionId' }, { status: 400 })
    }

    await db.favorite.deleteMany({
      where: { listingId, sessionId },
    })

    return NextResponse.json({ message: 'Favorite removed' })
  } catch (error) {
    console.error('Error removing favorite:', error)
    return NextResponse.json({ error: 'Failed to remove favorite' }, { status: 500 })
  }
}
