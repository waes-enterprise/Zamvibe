import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    // Try to get authenticated user
    const token = request.cookies.get('auth-token')?.value
    let userId: string | null = null
    if (token) {
      const payload = await verifyToken(token)
      if (payload) userId = payload.userId
    }

    if (userId) {
      // Authenticated: get user favorites
      const favorites = await db.favorite.findMany({
        where: { userId },
        include: { listing: true },
        orderBy: { createdAt: 'desc' },
      })
      return NextResponse.json(favorites.map((f) => f.listing))
    }

    if (sessionId) {
      // Anonymous: get session favorites
      const favorites = await db.favorite.findMany({
        where: { sessionId },
        include: { listing: true },
        orderBy: { createdAt: 'desc' },
      })
      return NextResponse.json(favorites.map((f) => f.listing))
    }

    return NextResponse.json([])
  } catch (error) {
    console.error('Error fetching favorites:', error)
    return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { listingId, sessionId } = await request.json()

    if (!listingId) {
      return NextResponse.json({ error: 'Missing listingId' }, { status: 400 })
    }

    // Try to get authenticated user
    const token = request.cookies.get('auth-token')?.value
    let userId: string | null = null
    if (token) {
      const payload = await verifyToken(token)
      if (payload) userId = payload.userId
    }

    // Build the where clause based on auth state
    const existingWhere: Record<string, unknown> = { listingId }
    if (userId) {
      existingWhere.userId = userId
    } else if (sessionId) {
      existingWhere.sessionId = sessionId
    }

    if (!userId && !sessionId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const existing = await db.favorite.findFirst({ where: existingWhere })
    if (existing) {
      return NextResponse.json({ message: 'Already favorited' }, { status: 200 })
    }

    const favorite = await db.favorite.create({
      data: {
        listingId,
        userId: userId || undefined,
        sessionId: userId ? null : sessionId,
      },
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

    if (!listingId) {
      return NextResponse.json({ error: 'Missing listingId' }, { status: 400 })
    }

    // Try to get authenticated user
    const token = request.cookies.get('auth-token')?.value
    let userId: string | null = null
    if (token) {
      const payload = await verifyToken(token)
      if (payload) userId = payload.userId
    }

    const deleteWhere: Record<string, unknown> = { listingId }
    if (userId) {
      deleteWhere.userId = userId
    } else if (sessionId) {
      deleteWhere.sessionId = sessionId
    }

    if (!userId && !sessionId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    await db.favorite.deleteMany({ where: deleteWhere })

    return NextResponse.json({ message: 'Favorite removed' })
  } catch (error) {
    console.error('Error removing favorite:', error)
    return NextResponse.json({ error: 'Failed to remove favorite' }, { status: 500 })
  }
}
