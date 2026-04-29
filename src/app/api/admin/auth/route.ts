import { NextRequest, NextResponse } from 'next/server';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'zamvibe2025';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    if (password === ADMIN_PASSWORD) {
      // Create a simple token (in production, use proper JWT)
      const token = Buffer.from(`admin:${Date.now()}`).toString('base64');
      return NextResponse.json({ success: true, token });
    }
    return NextResponse.json({ success: false, error: 'Wrong password' }, { status: 401 });
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }
}
