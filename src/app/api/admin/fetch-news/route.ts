import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

// Helper to verify admin JWT token
async function verifyAdminAuth(request: NextRequest): Promise<boolean> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return false;

  const token = authHeader.replace('Bearer ', '');
  const payload = await verifyToken(token);
  return payload?.role === 'admin';
}

export async function POST(request: NextRequest) {
  // Verify admin authentication
  const isAuth = await verifyAdminAuth(request);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
  }

  const fetchKey = process.env.FETCH_NEWS_KEY || 'zamvibe-fetch-2025';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://zamvibe.vercel.app';

  try {
    const response = await fetch(`${baseUrl}/api/fetch-news?key=${fetchKey}`, {
      method: 'POST',
    });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Fetch news proxy error:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}
