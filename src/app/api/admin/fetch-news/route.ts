import { NextResponse } from 'next/server';

export async function POST() {
  const fetchKey = process.env.FETCH_NEWS_KEY || 'zamvibe-fetch-2025';
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'https://zamvibe.vercel.app'}/api/fetch-news?key=${fetchKey}`, {
    method: 'POST',
  });
  const data = await response.json();
  return NextResponse.json(data);
}
