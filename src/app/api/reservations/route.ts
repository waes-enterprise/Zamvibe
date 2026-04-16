import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lodgeId, userName, userContact } = body;

    if (!lodgeId || !userName || !userContact) {
      return NextResponse.json(
        { error: 'lodgeId, userName, and userContact are required' },
        { status: 400 }
      );
    }

    // Verify lodge exists
    const lodge = await db.lodge.findUnique({ where: { id: lodgeId } });
    if (!lodge) {
      return NextResponse.json({ error: 'Lodge not found' }, { status: 404 });
    }

    // Create or find user
    let user = await db.user.findFirst({ where: { contact: userContact } });
    if (!user) {
      user = await db.user.create({
        data: {
          name: userName,
          contact: userContact,
        },
      });
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 45 * 60 * 1000); // 45 minutes

    const reservation = await db.reservation.create({
      data: {
        userId: user.id,
        lodgeId,
        userName,
        userContact,
        status: 'PENDING',
        expiresAt,
      },
      include: {
        lodge: {
          select: {
            name: true,
            location: true,
            address: true,
          },
        },
      },
    });

    return NextResponse.json({
      id: reservation.id,
      shortId: reservation.id.substring(0, 8),
      lodgeId: reservation.lodgeId,
      lodgeName: reservation.lodge.name,
      lodgeLocation: reservation.lodge.location,
      lodgeAddress: reservation.lodge.address,
      userName: reservation.userName,
      userContact: reservation.userContact,
      status: reservation.status,
      createdAt: reservation.createdAt,
      expiresAt: reservation.expiresAt,
    });
  } catch (error) {
    console.error('Error creating reservation:', error);
    return NextResponse.json(
      { error: 'Failed to create reservation' },
      { status: 500 }
    );
  }
}
