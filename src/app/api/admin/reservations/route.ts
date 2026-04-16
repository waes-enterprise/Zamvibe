import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const authKey = searchParams.get('auth');

    // Simple admin auth check
    if (authKey !== 'staynow-admin-2024') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Auto-expire pending reservations past their deadline
    await db.reservation.updateMany({
      where: {
        status: 'PENDING',
        expiresAt: { lt: new Date() },
      },
      data: { status: 'EXPIRED' },
    });

    const reservations = await db.reservation.findMany({
      include: {
        lodge: {
          select: {
            name: true,
            location: true,
          },
        },
        user: {
          select: {
            name: true,
            contact: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      reservations: reservations.map((r) => ({
        id: r.id,
        shortId: r.id.substring(0, 8),
        userName: r.userName,
        userContact: r.userContact,
        lodgeName: r.lodge.name,
        lodgeLocation: r.lodge.location,
        status: r.status,
        createdAt: r.createdAt,
        expiresAt: r.expiresAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching admin reservations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reservations' },
      { status: 500 }
    );
  }
}
