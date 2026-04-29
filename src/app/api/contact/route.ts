import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { sendContactEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message, subject } = body || {};

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
    }

    // Persist to database
    const submission = await db.contactSubmission.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        subject: (subject || '').trim(),
        message: message.trim(),
      },
    });

    // Send email notification (fire-and-forget)
    try {
      sendContactEmail({ name, email, subject: subject || 'Contact Form', message });
    } catch (err) {
      console.error('Failed to send contact email:', err);
    }

    return NextResponse.json({ success: true, message: 'Message received! We\'ll get back to you soon.' });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Failed to submit form' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ success: true });
}
