import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

const APP_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://zamvibe.vercel.app';

export async function GET() {
  try {
    const posts = await db.post.findMany({
      where: { status: 'published' },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>ZamVibe — Africa's #1 Entertainment Hub</title>
    <link>${APP_URL}</link>
    <description>Real-time African entertainment news, celebrity gossip, music, viral videos, and trending stories from Zambia, Nigeria, South Africa, Ghana, Kenya &amp; more.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${APP_URL}/api/feed" rel="self" type="application/rss+xml"/>
    ${posts.map(post => `
    <item>
      <title><![CDATA[${post.headline}]]></title>
      <link>${APP_URL}/posts/${post.id}</link>
      <guid isPermaLink="true">${APP_URL}/posts/${post.id}</guid>
      <description><![CDATA[${post.body.substring(0, 200)}]]></description>
      <category>${post.category}</category>
      <dc:creator>${post.source || 'ZamVibe'}</dc:creator>
      <pubDate>${new Date(post.createdAt).toUTCString()}</pubDate>
      ${post.imageUrl ? `<enclosure url="${post.imageUrl}" type="image/jpeg"/>` : ''}
    </item>`).join('')}
  </channel>
</rss>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 's-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('RSS feed error:', error);
    return NextResponse.json({ error: 'Failed to generate feed' }, { status: 500 });
  }
}
