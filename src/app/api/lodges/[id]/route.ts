import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const GRADIENTS = [
  'from-amber-400 to-orange-500',
  'from-emerald-400 to-teal-500',
  'from-sky-400 to-blue-500',
  'from-rose-400 to-pink-500',
  'from-cyan-400 to-blue-600',
  'from-violet-400 to-purple-500',
  'from-amber-500 to-red-500',
  'from-lime-400 to-green-600',
  'from-orange-400 to-amber-600',
  'from-teal-400 to-emerald-600',
  'from-blue-400 to-indigo-500',
  'from-yellow-400 to-orange-500',
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const allLodges = await db.lodge.findMany();
    const lodgeIndex = allLodges.findIndex((l) => l.id === id);
    const gradient = GRADIENTS[Math.max(0, lodgeIndex) % GRADIENTS.length];

    const lodge = await db.lodge.findUnique({
      where: { id },
      include: {
        reservations: {
          where: {
            status: { in: ['PENDING', 'CONFIRMED'] },
            expiresAt: { gt: new Date() },
          },
        },
      },
    });

    if (!lodge) {
      return NextResponse.json({ error: 'Lodge not found' }, { status: 404 });
    }

    const activeReservations = lodge.reservations.length;
    let availability: 'LIKELY_AVAILABLE' | 'CHECK' | 'LIKELY_FULL';
    if (activeReservations < 3) {
      availability = 'LIKELY_AVAILABLE';
    } else if (activeReservations <= 7) {
      availability = 'CHECK';
    } else {
      availability = 'LIKELY_FULL';
    }

    return NextResponse.json({
      id: lodge.id,
      name: lodge.name,
      description: lodge.description,
      location: lodge.location,
      address: lodge.address,
      phone: lodge.phone,
      price: lodge.price,
      priceUnit: lodge.priceUnit,
      latitude: lodge.latitude,
      longitude: lodge.longitude,
      amenities: JSON.parse(lodge.amenities || '[]'),
      rating: lodge.rating,
      totalRooms: lodge.totalRooms,
      gradient,
      activeReservations,
      availability,
      createdAt: lodge.createdAt,
    });
  } catch (error) {
    console.error('Error fetching lodge:', error);
    return NextResponse.json({ error: 'Failed to fetch lodge' }, { status: 500 });
  }
}
