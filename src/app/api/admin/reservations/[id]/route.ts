import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const authKey = searchParams.get('auth');

    // Simple admin auth check
    if (authKey !== 'staynow-admin-2024') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { status } = body;

    if (!['CONFIRMED', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { error: 'Status must be CONFIRMED or REJECTED' },
        { status: 400 }
      );
    }

    const reservation = await db.reservation.findUnique({ where: { id } });
    if (!reservation) {
      return NextResponse.json(
        { error: 'Reservation not found' },
        { status: 404 }
      );
    }

    if (reservation.status !== 'PENDING') {
      return NextResponse.json(
        { error: `Cannot update a ${reservation.status} reservation` },
        { status: 400 }
      );
    }

    const updated = await db.reservation.update({
      where: { id },
      data: { status },
      include: {
        lodge: {
          select: { name: true, location: true },
        },
      },
    });

    return NextResponse.json({
      id: updated.id,
      shortId: updated.id.substring(0, 8),
      userName: updated.userName,
      lodgeName: updated.lodge.name,
      lodgeLocation: updated.lodge.location,
      status: updated.status,
    });
  } catch (error) {
    console.error('Error updating reservation:', error);
    return NextResponse.json(
      { error: 'Failed to update reservation' },
      { status: 500 }
    );
  }
}
