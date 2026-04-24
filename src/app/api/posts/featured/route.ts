import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const index = parseInt(searchParams.get('index') || '0');

    const featuredPosts = await db.post.findMany({
      where: {
        status: 'published',
        isFeatured: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (featuredPosts.length === 0) {
      return NextResponse.json({ post: null });
    }

    const safeIndex = index % featuredPosts.length;
    const post = featuredPosts[safeIndex];

    return NextResponse.json({
      post,
      total: featuredPosts.length,
      index: safeIndex,
    });
  } catch (error) {
    console.error('Error fetching featured:', error);
    return NextResponse.json({ error: 'Failed to fetch featured' }, { status: 500 });
  }
}
