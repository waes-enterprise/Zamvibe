import { NextResponse } from 'next/server';

// ============================================================
// Vercel Cron Endpoint - Triggers entertainment news refresh
// Called by Vercel Cron every 2 hours
// ============================================================

export async function GET(request: Request) {
  try {
    const isCron = request.headers.get('x-vercel-cron') === 'true';

    if (!isCron) {
      return NextResponse.json({ error: 'This endpoint is for cron only' }, { status: 403 });
    }

    // Trigger the fetch-news endpoint
    const fetchUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://zamvibe.vercel.app'}/api/fetch-news?key=${process.env.FETCH_NEWS_KEY || 'zamvibe-fetch-2025'}`;

    const res = await fetch(fetchUrl, {
      method: 'GET',
      headers: {
        'x-vercel-cron': 'true',
      },
    });

    const data = await res.json();

    return NextResponse.json({
      cron: true,
      timestamp: new Date().toISOString(),
      fetchResult: data,
    });
  } catch (error) {
    console.error('Cron refresh error:', error);
    return NextResponse.json(
      { error: 'Cron refresh failed', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    );
  }
}
