import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

const CATEGORIES = [
  { name: 'Music', color: '#a855f7' },
  { name: 'Gossip', color: '#f59e0b' },
  { name: 'Viral', color: '#ef4444' },
  { name: 'Lifestyle', color: '#22c55e' },
];

export async function GET() {
  try {
    const categoriesWithCounts = await Promise.all(
      CATEGORIES.map(async (cat) => {
        const count = await db.post.count({
          where: { category: cat.name, status: 'published' },
        });
        return { ...cat, count };
      })
    );

    return NextResponse.json(categoriesWithCounts);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}
