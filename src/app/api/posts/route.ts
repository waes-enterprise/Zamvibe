import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const postSchema = z.object({
  headline: z.string().min(3, 'Headline must be at least 3 characters'),
  body: z.string().default(''),
  category: z.string().default('Viral'),
  imageUrl: z.string().default(''),
  videoUrl: z.string().default(''),
  isBreaking: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  status: z.string().default('published'),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category') || '';
    const sort = searchParams.get('sort') || 'latest';
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {
      status: 'published',
    };

    if (category && category !== 'All') {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { headline: { contains: search } },
        { body: { contains: search } },
      ];
    }

    const orderBy = sort === 'trending'
      ? [{ views: 'desc' as const }, { shares: 'desc' as const }, { clicks: 'desc' as const }]
      : [{ createdAt: 'desc' as const }];

    const [posts, total] = await Promise.all([
      db.post.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      db.post.count({ where }),
    ]);

    return NextResponse.json({
      posts,
      total,
      hasMore: skip + posts.length < total,
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Simple auth check for mutations
    const authHeader = request.headers.get('authorization');
    const adminPassword = process.env.ADMIN_PASSWORD || 'zamvibe2025';
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      let isValid = token === adminPassword;
      if (!isValid) {
        try {
          const decoded = Buffer.from(token, 'base64').toString('utf-8');
          isValid = decoded.startsWith('admin:');
        } catch {}
      }
      if (!isValid) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    } else {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validated = postSchema.parse(body);

    const post = await db.post.create({
      data: validated,
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
