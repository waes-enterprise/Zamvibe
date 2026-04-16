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

function getGradient(index: number): string {
  return GRADIENTS[index % GRADIENTS.length];
}

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const sort = searchParams.get('sort') || 'rating';
    const lat = parseFloat(searchParams.get('lat') || '0');
    const lng = parseFloat(searchParams.get('lng') || '0');
    const hasLocation = lat !== 0 && lng !== 0;

    const lodges = await db.lodge.findMany({
      include: {
        reservations: {
          where: {
            status: { in: ['PENDING', 'CONFIRMED'] },
            expiresAt: { gt: new Date() },
          },
        },
      },
    });

    let enrichedLodges = lodges.map((lodge, index) => {
      const activeReservations = lodge.reservations.length;
      let availability: 'LIKELY_AVAILABLE' | 'CHECK' | 'LIKELY_FULL';
      if (activeReservations < 3) {
        availability = 'LIKELY_AVAILABLE';
      } else if (activeReservations <= 7) {
        availability = 'CHECK';
      } else {
        availability = 'LIKELY_FULL';
      }

      const distance = hasLocation && lodge.latitude && lodge.longitude
        ? calculateDistance(lat, lng, lodge.latitude, lodge.longitude)
        : null;

      return {
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
        gradient: getGradient(index),
        activeReservations,
        availability,
        distance,
      };
    });

    // Filter by search
    if (search) {
      const s = search.toLowerCase();
      enrichedLodges = enrichedLodges.filter(
        (l) =>
          l.name.toLowerCase().includes(s) ||
          l.location.toLowerCase().includes(s) ||
          l.address.toLowerCase().includes(s)
      );
    }

    // Sort
    switch (sort) {
      case 'nearest':
        enrichedLodges.sort((a, b) => (a.distance ?? 9999) - (b.distance ?? 9999));
        break;
      case 'price_asc':
        enrichedLodges.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        enrichedLodges.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
      default:
        enrichedLodges.sort((a, b) => b.rating - a.rating);
        break;
    }

    return NextResponse.json({ lodges: enrichedLodges });
  } catch (error) {
    console.error('Error fetching lodges:', error);
    return NextResponse.json({ error: 'Failed to fetch lodges' }, { status: 500 });
  }
}
