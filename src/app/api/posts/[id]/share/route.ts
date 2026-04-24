import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.post.update({
      where: { id },
      data: { shares: { increment: 1 } },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error incrementing shares:', error);
    return NextResponse.json({ error: 'Failed to update shares' }, { status: 500 });
  }
}
