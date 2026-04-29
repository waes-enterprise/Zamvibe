import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, createToken } from '@/lib/auth';

// Admin credentials (in production, use a database)
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json({ success: false, error: 'Password is required' }, { status: 400 });
    }

    // Verify password
    if (ADMIN_PASSWORD_HASH) {
      const isValid = await verifyPassword(password, ADMIN_PASSWORD_HASH);
      if (!isValid) {
        return NextResponse.json({ success: false, error: 'Wrong password' }, { status: 401 });
      }
    } else {
      // Fallback: check against env variable (for backward compat during migration)
      const envPassword = process.env.ADMIN_PASSWORD || 'zamvibe2025';
      if (password !== envPassword) {
        return NextResponse.json({ success: false, error: 'Wrong password' }, { status: 401 });
      }
    }

    // Create proper JWT token with 7-day expiry
    const token = await createToken({
      userId: 'admin',
      email: 'admin@zamvibe.com',
      name: 'ZamVibe Admin',
      role: 'admin',
    });

    return NextResponse.json({
      success: true,
      token,
      expiresIn: '7d',
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }
}
