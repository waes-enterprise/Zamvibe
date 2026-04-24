import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '5');

    const skip = (page - 1) * limit;

    const [videos, total] = await Promise.all([
      db.videoClip.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      db.videoClip.count(),
    ]);

    return NextResponse.json({
      videos,
      total,
      hasMore: skip + videos.length < total,
    });
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 });
  }
}
