import { NextResponse } from 'next/server';

// ============================================
// Live Entertainment & Social Media Trending API
// Aggregates real trending topics from multiple sources
// ============================================

interface TrendingItem {
  title: string;
  source: string;
  category: string;
  url: string;
  engagement?: string;
  timestamp: string;
}

async function fetchWithTimeout(url: string, timeout = 8000): Promise<string | null> {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ZamVibeBot/1.0; +https://zamvibe.vercel.app)',
        'Accept': 'application/json, text/html, */*',
      },
    });
    clearTimeout(id);
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

// Fetch trending topics from Google Trends RSS (Zambia)
async function fetchGoogleTrendsZM(): Promise<TrendingItem[]> {
  try {
    const xml = await fetchWithTimeout('https://trends.google.com/trending/rss?geo=ZM', 10000);
    if (!xml) return [];

    const items: TrendingItem[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
    let match;
    while ((match = itemRegex.exec(xml)) !== null) {
      const itemXml = match[1];
      const titleMatch = itemXml.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/i)
        || itemXml.match(/<title>([\s\S]*?)<\/title>/i);
      const linkMatch = itemXml.match(/<link>([\s\S]*?)<\/link>/i);
      const approxMatch = itemXml.match(/<approx_traffic>([\s\S]*?)<\/approx_traffic>/i);

      if (titleMatch?.[1]?.trim()) {
        items.push({
          title: titleMatch[1].trim(),
          source: 'Google Trends Zambia',
          category: 'Trending',
          url: linkMatch?.[1]?.trim() || '#',
          engagement: approxMatch?.[1]?.trim() || '',
          timestamp: new Date().toISOString(),
        });
      }
    }
    return items.slice(0, 20);
  } catch {
    return [];
  }
}

// Fetch trending topics from Google Trends RSS (Nigeria - bigger market)
async function fetchGoogleTrendsNG(): Promise<TrendingItem[]> {
  try {
    const xml = await fetchWithTimeout('https://trends.google.com/trending/rss?geo=NG', 10000);
    if (!xml) return [];

    const items: TrendingItem[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
    let match;
    while ((match = itemRegex.exec(xml)) !== null) {
      const itemXml = match[1];
      const titleMatch = itemXml.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/i)
        || itemXml.match(/<title>([\s\S]*?)<\/title>/i);
      const linkMatch = itemXml.match(/<link>([\s\S]*?)<\/link>/i);

      if (titleMatch?.[1]?.trim()) {
        items.push({
          title: titleMatch[1].trim(),
          source: 'Google Trends Nigeria',
          category: 'Trending',
          url: linkMatch?.[1]?.trim() || '#',
          timestamp: new Date().toISOString(),
        });
      }
    }
    return items.slice(0, 15);
  } catch {
    return [];
  }
}

// Fetch trending topics from Google Trends RSS (South Africa)
async function fetchGoogleTrendsZA(): Promise<TrendingItem[]> {
  try {
    const xml = await fetchWithTimeout('https://trends.google.com/trending/rss?geo=ZA', 10000);
    if (!xml) return [];

    const items: TrendingItem[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
    let match;
    while ((match = itemRegex.exec(xml)) !== null) {
      const itemXml = match[1];
      const titleMatch = itemXml.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/i)
        || itemXml.match(/<title>([\s\S]*?)<\/title>/i);
      const linkMatch = itemXml.match(/<link>([\s\S]*?)<\/link>/i);

      if (titleMatch?.[1]?.trim()) {
        items.push({
          title: titleMatch[1].trim(),
          source: 'Google Trends South Africa',
          category: 'Trending',
          url: linkMatch?.[1]?.trim() || '#',
          timestamp: new Date().toISOString(),
        });
      }
    }
    return items.slice(0, 15);
  } catch {
    return [];
  }
}

// Fetch entertainment headlines from RSS sources (quick scan)
async function fetchEntertainmentHeadlines(): Promise<TrendingItem[]> {
  const sources = [
    { name: 'Kalemba', url: 'https://kalemba.net/feed/', category: 'Gossip' },
    { name: 'Zed Corner', url: 'https://www.zedcorner.com/feed/', category: 'Music' },
    { name: 'BellaNaija', url: 'https://bellanaija.com/feed/', category: 'Celebrity' },
    { name: 'ZAlebs', url: 'https://www.zalebs.com/feed/', category: 'Celebrity' },
    { name: 'Pulse Nigeria', url: 'https://pulse.ng/entertainment/feed/', category: 'Celebrity' },
  ];

  const allItems: TrendingItem[] = [];

  const results = await Promise.allSettled(
    sources.map(async (source) => {
      const xml = await fetchWithTimeout(source.url, 10000);
      if (!xml) return [];

      const items: TrendingItem[] = [];
      const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
      let match;
      let count = 0;
      while ((match = itemRegex.exec(xml)) !== null && count < 5) {
        const itemXml = match[1];
        const titleMatch = itemXml.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/i)
          || itemXml.match(/<title>([\s\S]*?)<\/title>/i);
        const linkMatch = itemXml.match(/<link><!\[CDATA\[([\s\S]*?)\]\]><\/link>/i)
          || itemXml.match(/<link>([\s\S]*?)<\/link>/i);

        if (titleMatch?.[1]?.trim()) {
          items.push({
            title: titleMatch[1].trim(),
            source: source.name,
            category: source.category,
            url: linkMatch?.[1]?.trim() || '#',
            timestamp: new Date().toISOString(),
          });
          count++;
        }
      }
      return items;
    })
  );

  for (const result of results) {
    if (result.status === 'fulfilled') {
      allItems.push(...result.value);
    }
  }

  return allItems;
}

// Fetch latest music/chart data
async function fetchMusicTrends(): Promise<TrendingItem[]> {
  const items: TrendingItem[] = [];

  // Try to get Billboard Afrobeats data
  try {
    const xml = await fetchWithTimeout('https://www.billboard.com/feed/', 10000);
    if (xml) {
      const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
      let match;
      let count = 0;
      while ((match = itemRegex.exec(xml)) !== null && count < 10) {
        const itemXml = match[1];
        const titleMatch = itemXml.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/i)
          || itemXml.match(/<title>([\s\S]*?)<\/title>/i);
        const linkMatch = itemXml.match(/<link><!\[CDATA\[([\s\S]*?)\]\]><\/link>/i)
          || itemXml.match(/<link>([\s\S]*?)<\/link>/i);

        if (titleMatch?.[1]?.trim()) {
          const title = titleMatch[1].trim();
          const musicKeywords = ['music', 'song', 'album', 'artist', 'chart', 'billboard', 'afrobeats', 'amapiano', 'hip hop', 'rapper', 'singer'];
          if (musicKeywords.some(kw => title.toLowerCase().includes(kw))) {
            items.push({
              title,
              source: 'Billboard',
              category: 'Music',
              url: linkMatch?.[1]?.trim() || '#',
              timestamp: new Date().toISOString(),
            });
            count++;
          }
        }
      }
    }
  } catch {}

  return items.slice(0, 8);
}

export async function GET() {
  try {
    const startTime = Date.now();

    // Fetch all data sources in parallel
    const [
      zambiaTrends,
      nigeriaTrends,
      southAfricaTrends,
      entertainmentHeadlines,
      musicTrends,
    ] = await Promise.allSettled([
      fetchGoogleTrendsZM(),
      fetchGoogleTrendsNG(),
      fetchGoogleTrendsZA(),
      fetchEntertainmentHeadlines(),
      fetchMusicTrends(),
    ]);

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      elapsed: `${elapsed}s`,
      data: {
        zambiaTrends: zambiaTrends.status === 'fulfilled' ? zambiaTrends.value : [],
        nigeriaTrends: nigeriaTrends.status === 'fulfilled' ? nigeriaTrends.value : [],
        southAfricaTrends: southAfricaTrends.status === 'fulfilled' ? southAfricaTrends.value : [],
        entertainmentHeadlines: entertainmentHeadlines.status === 'fulfilled' ? entertainmentHeadlines.value : [],
        musicTrends: musicTrends.status === 'fulfilled' ? musicTrends.value : [],
      },
    });
  } catch (error) {
    console.error('Live trending error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch live trends', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    );
  }
}
