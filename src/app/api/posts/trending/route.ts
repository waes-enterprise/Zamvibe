import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const trendingTopics = await db.trendingTopic.findMany({
      orderBy: { rank: 'asc' },
    });

    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const trendingPosts = await db.post.findMany({
      where: {
        status: 'published',
        createdAt: { gte: oneDayAgo },
      },
      orderBy: [
        { views: 'desc' },
        { shares: 'desc' },
      ],
      take: 10,
    });

    return NextResponse.json({
      trendingTopics,
      trendingPosts,
    });
  } catch (error) {
    console.error('Error fetching trending:', error);
    return NextResponse.json({ error: 'Failed to fetch trending' }, { status: 500 });
  }
}
