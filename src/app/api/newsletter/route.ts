import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { sendNewsletterConfirmation } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body || {};

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
    }

    // Upsert subscription
    const subscription = await db.newsletterSubscription.upsert({
      where: { email: email.trim().toLowerCase() },
      create: { email: email.trim().toLowerCase() },
      update: { isActive: true },
    });

    // Send confirmation email (fire-and-forget)
    try {
      sendNewsletterConfirmation(email);
    } catch {}

    return NextResponse.json({
      success: true,
      message: 'Welcome to the ZamVibe newsletter!',
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    if (error instanceof Error && error.message.includes('Unique')) {
      return NextResponse.json({ success: true, message: 'You\'re already subscribed!' });
    }
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body || {};

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    await db.newsletterSubscription.update({
      where: { email: email.trim().toLowerCase() },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true, message: 'Unsubscribed successfully' });
  } catch {
    return NextResponse.json({ error: 'Failed to unsubscribe' }, { status: 500 });
  }
}
