import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// ============================================================
// ZamVibe Entertainment News Fetcher
// Pulls entertainment content from 30+ African entertainment sources
// ============================================================

interface RSSItem {
  title: string;
  link: string;
  description: string;
  content: string;
  pubDate: string;
  imageUrl: string;
  source: string;
}

interface FeedSource {
  name: string;
  url: string;
  category: string;
  type: 'rss' | 'scrape';
  scrapeUrl?: string;
  selector?: string;
}

// 30+ pure African entertainment sources
const ENTERTAINMENT_FEEDS: FeedSource[] = [
  // === ZAMBIAN ENTERTAINMENT ===
  { name: 'Kalemba', url: 'https://kalemba.net/feed/', category: 'Gossip', type: 'rss' },
  { name: 'Zed Corner', url: 'https://www.zedcorner.com/feed/', category: 'Music', type: 'rss' },
  { name: 'Mwebantu Entertainment', url: 'https://www.mwebantu.com/entertainment/feed/', category: 'Entertainment', type: 'rss' },
  { name: 'Tumfweko Entertainment', url: 'https://tumfweko.com/category/entertainment/feed/', category: 'Entertainment', type: 'rss' },

  // === NIGERIAN ENTERTAINMENT ===
  { name: 'BellaNaija', url: 'https://bellanaija.com/feed/', category: 'Celebrity', type: 'rss' },
  { name: 'Nigeria Entertainment Today', url: 'https://net.ng/feed/', category: 'Celebrity', type: 'rss' },
  { name: 'Pulse Nigeria', url: 'https://pulse.ng/entertainment/feed/', category: 'Celebrity', type: 'rss' },
  { name: 'Laila Ijeoma', url: 'https://www.lailasnews.com/feed/', category: 'Gossip', type: 'rss' },
  { name: 'Kemi Filani', url: 'https://www.kemifilani.ng/feed/', category: 'Gossip', type: 'rss' },
  { name: 'Nollywood Post', url: 'https://nollywoodpost.com.ng/feed/', category: 'Movies & TV', type: 'rss' },

  // === SOUTH AFRICAN ENTERTAINMENT ===
  { name: 'Briefly News', url: 'https://briefly.co.za/feed/', category: 'Celebrity', type: 'rss' },
  { name: 'ZAlebs', url: 'https://www.zalebs.com/feed/', category: 'Celebrity', type: 'rss' },
  { name: 'SA Hip Hop Mag', url: 'https://sahiphopmag.co.za/feed/', category: 'Music', type: 'rss' },
  { name: 'Drum Magazine', url: 'https://www.drum.co.za/feed/', category: 'Celebrity', type: 'rss' },
  { name: 'ZAlebs TV', url: 'https://www.zalebs.com/category/tv/feed/', category: 'Movies & TV', type: 'rss' },

  // === GHANAIAN ENTERTAINMENT ===
  { name: 'GhanaWeb Entertainment', url: 'https://www.ghanaweb.com/GhanaHomePage/entertainment/rss.php', category: 'Entertainment', type: 'rss' },
  { name: 'Ameyaw Debrah', url: 'https://www.ameyawdebrah.com/feed/', category: 'Celebrity', type: 'rss' },
  { name: 'Yen.com.gh', url: 'https://yen.com.gh/entertainment/feed/', category: 'Celebrity', type: 'rss' },

  // === KENYAN ENTERTAINMENT ===
  { name: 'Pulse Live Kenya', url: 'https://pulselive.co.ke/entertainment/feed/', category: 'Celebrity', type: 'rss' },
  { name: 'Kenyans.co.ke', url: 'https://www.kenyans.co.ke/feed/', category: 'Celebrity', type: 'rss' },
  { name: 'Classic 105', url: 'https://classic105.com/feed/', category: 'Celebrity', type: 'rss' },

  // === PAN-AFRICAN MUSIC & CULTURE ===
  { name: 'OkayAfrica', url: 'https://www.okayafrica.com/feed/', category: 'Music', type: 'rss' },
  { name: 'This Is Africa', url: 'https://thisisafrica.me/feed/', category: 'Culture', type: 'rss' },
  { name: 'Brittle Paper', url: 'https://brittlepaper.com/feed/', category: 'Culture', type: 'rss' },
  { name: 'Music in Africa', url: 'https://www.musicinafrica.net/feed', category: 'Music', type: 'rss' },

  // === GLOBAL ENTERTAINMENT (Afrobeats/African relevant) ===
  { name: 'Billboard Afrobeats', url: 'https://www.billboard.com/feed/', category: 'Music', type: 'rss' },
  { name: 'Complex Music', url: 'https://www.complex.com/music/feed/', category: 'Music', type: 'rss' },
  { name: 'Rolling Stone Music', url: 'https://www.rollingstone.com/music/music-news/feed/', category: 'Music', type: 'rss' },
  { name: 'The Fader', url: 'https://www.thefader.com/feed/', category: 'Music', type: 'rss' },
  { name: 'Hot New Hip Hop', url: 'https://www.hotnewhiphop.com/feed/', category: 'Music', type: 'rss' },
  { name: 'BET', url: 'https://www.bet.com/feed', category: 'Celebrity', type: 'rss' },
  { name: 'E! Online', url: 'https://www.eonline.com/feed', category: 'Celebrity', type: 'rss' },
  { name: 'TMZ', url: 'https://www.tmz.com/feed/', category: 'Gossip', type: 'rss' },
];

// Entertainment keywords for filtering & categorization
const ENTERTAINMENT_KEYWORDS = {
  Music: ['music', 'song', 'album', 'artist', 'singer', 'rapper', 'dj ', 'concert', 'festival',
    'chef 187', 'yo maps', 'mampi', 'nez long', 'bobby east', 'slap dee', 'cynthia kazimoto',
    'jordan nkisi', 'muhammad', 'macky 2', 'funny g', 'juliani', 'marky 2', 't-sean',
    'afrobeat', 'afrobeats', 'amapiano', 'hip hop', 'hiphop', 'r&b', 'dancehall', 'reggae',
    'collabo', 'feature', 'remix', 'ep ', 'lp ', 'single', 'track', 'studio', 'record',
    'spotify', 'apple music', 'youtube music', 'boomplay', 'audiomack', 'soundcloud',
    'grammy', 'bet awards', 'mtv awards', 'all africa music awards', 'afrima',
    'music video', 'lyric', 'verse', 'chorus', 'beat', 'producer', 'label', 'distribut'],
  'Celebrity': ['celebrity', 'gossip', 'star', 'famous', 'influencer', 'social media', 'instagram',
    'tiktok', 'twitter', 'trending', 'viral', 'drama', 'scandal', 'controversy', 'breakup',
    'relationship', 'dating', 'married', 'wedding', 'baby', 'pregnant', 'engaged',
    'bail ', 'arrest', 'court', 'lawsuit', 'divorce', 'cheat', 'ex-', 'reunion',
    'red carpet', 'award show', 'premiere', 'launch', 'brand deal', 'endorsement',
    'photo', 'photoshoot', 'magazine cover', 'interview', 'reveals', 'confirms', 'denies',
    'reacts', 'claps back', 'fires back', 'shades', 'slams', 'praises'],
  'Movies & TV': ['movie', 'film', 'tv show', 'series', 'netflix', 'showmax', 'amazon prime',
    'disney', 'nollywood', 'ghallywood', 'ollywood', 'actor', 'actress', 'director',
    'producer', 'trailer', 'release', 'premiere', 'box office', 'oscar', 'emmy',
    'season', 'episode', 'binge', 'streaming', 'documentary', 'reality tv', 'reality show',
    'big brother', 'bbnaija', 'bbtitans', 'idols', 'got talent', 'x factor'],
  Comedy: ['comedy', 'comedian', 'funny', 'skit', 'prank', 'joke', 'laugh', 'hilarious',
    'stand-up', 'standup', 'roast', 'parody', 'meme', 'memes', 'troll', 'trolling',
    'chris rock', 'dave chappelle', 'kevin hart', 'trevor noah', 'basketmouth',
    'akpororo', 'ay makun', 'elenu', 'mr macaroni', 'broda shaggi', 'taaooma'],
  Fashion: ['fashion', 'style', 'outfit', 'dress', 'designer', 'brand', 'clothing',
    'collection', 'runway', 'fashion week', 'hairstyle', 'makeup', 'beauty',
    'sneakers', 'shoes', 'jewelry', 'accessories', 'trend', 'wardrobe', 'ootd',
    'luxury', 'gucci', 'prada', 'versace', 'louis vuitton', 'balenciaga'],
  Viral: ['viral', 'trending', 'shock', 'surprise', 'amazing', 'incredible', 'unbelievable',
    'outrage', 'drama', 'caught on camera', 'must see', 'heartbreaking', 'inspiring',
    'hero', 'miracle', 'bizarre', 'weird', 'crazy', 'mad', 'lit', 'fire', 'slay',
    'goals', 'mood', 'periodt', 'no cap', 'bet', 'facts', 'based', 'cooked'],
  Culture: ['culture', 'african culture', 'heritage', 'festival', 'tradition', 'art',
    'exhibition', 'gallery', 'museum', 'african art', 'pan african', 'afrofuturism',
    'literature', 'book launch', 'author', 'novel', 'poetry', 'spoken word'],
};

const GENERAL_EXCLUDE_KEYWORDS = [
  // Politics & Government
  'politics', 'election', 'vote', 'parliament', 'president', 'minister', 'cabinet',
  'opposition', 'ruling party', 'constitution', 'legislation', 'budget speech',
  'governor', 'senator', 'mayor', 'councillor', 'mp ', 'member of parliament',
  'political party', 'campaign rally', 'poll', 'ballot', 'inauguration',
  // Economy & Policy
  'inflation rate', 'gdp', 'trade deficit', 'fiscal', 'monetary policy', 'treasury',
  'imf', 'world bank', 'donor', 'aid package', 'debt relief', 'loan',
  'tax reform', 'revenue authority', 'central bank', 'interest rate',
  'economic growth', 'economic outlook', 'funding', 'budget allocation',
  'mining tax', 'copper export', 'fertilizer subsidy', 'agricultural policy',
  // Conflict & Security
  'military', 'army', 'insurgency', 'terrorism', 'security forces', 'peacekeeping',
  'armed conflict', 'ceasefire', 'war zone', 'refugee crisis', 'humanitarian',
  'corruption scandal', 'anti-corruption', 'tribunal', 'judiciary',
  'arrest warrant', 'court ruling', 'prosecution', 'sentence',
  // Infrastructure (boring)
  'road construction', 'infrastructure development', 'power outage', 'water shortage',
  'healthcare system', 'education reform', 'civil service',
];

function classifyContent(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();

  // Check for excluded keywords first
  for (const kw of GENERAL_EXCLUDE_KEYWORDS) {
    if (text.includes(kw)) return 'EXCLUDE';
  }

  // Score each entertainment category
  const scores: Record<string, number> = {};
  for (const [category, keywords] of Object.entries(ENTERTAINMENT_KEYWORDS)) {
    scores[category] = 0;
    for (const kw of keywords) {
      if (text.includes(kw)) scores[category]++;
    }
  }

  // Find the highest scoring category
  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  if (best[1] >= 1) return best[0];

  // Default: keep if has some entertainment signal
  const hasWeakSignal = ['star', 'show', 'new', 'latest', 'drops', 'shares', 'fans', 'people']
    .some(kw => text.includes(kw));
  return hasWeakSignal ? 'Viral' : 'EXCLUDE';
}

function extractImageFromXML(itemXml: string): string {
  // Try enclosure
  const enclosureMatch = itemXml.match(/<enclosure[^>]*url=["']([^"']+)["'][^>]*>/i);
  if (enclosureMatch && /\.(jpg|jpeg|png|webp|gif)/i.test(enclosureMatch[1])) {
    return enclosureMatch[1];
  }

  // Try media:content
  const mediaContent = itemXml.match(/<media:content[^>]*url=["']([^"']+)["'][^>]*>/i);
  if (mediaContent) return mediaContent[1];

  // Try media:thumbnail
  const mediaThumb = itemXml.match(/<media:thumbnail[^>]*url=["']([^"']+)["'][^>]*>/i);
  if (mediaThumb) return mediaThumb[1];

  // Try img tags in content:encoded
  const imgMatch = itemXml.match(/<img[^>]*src=["']([^"']+)["'][^>]*>/i);
  if (imgMatch && !imgMatch[1].includes('data:image') && !imgMatch[1].includes('pixel') && !imgMatch[1].includes('1x1')) {
    return imgMatch[1];
  }

  return '';
}

function extractContentText(itemXml: string): string {
  // Try content:encoded
  const contentEncoded = itemXml.match(/<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/i);
  if (contentEncoded) {
    return contentEncoded[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 500);
  }

  // Try description
  const descMatch = itemXml.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/i)
    || itemXml.match(/<description>([\s\S]*?)<\/description>/i);
  if (descMatch) {
    return descMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 500);
  }

  return '';
}

function parseRSSFeed(xml: string, source: FeedSource): RSSItem[] {
  const items: RSSItem[] = [];

  // Match all <item> blocks
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];

    const titleMatch = itemXml.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/i)
      || itemXml.match(/<title>([\s\S]*?)<\/title>/i);
    const linkMatch = itemXml.match(/<link><!\[CDATA\[([\s\S]*?)\]\]><\/link>/i)
      || itemXml.match(/<link>([\s\S]*?)<\/link>/i);
    const dateMatch = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/i);

    if (!titleMatch || !titleMatch[1].trim()) continue;

    const title = titleMatch[1].trim();
    const link = linkMatch ? linkMatch[1].trim() : '';
    const content = extractContentText(itemXml);
    const imageUrl = extractImageFromXML(itemXml);
    const pubDate = dateMatch ? dateMatch[1].trim() : new Date().toUTCString();

    items.push({
      title,
      link,
      description: content || title,
      content,
      pubDate,
      imageUrl,
      source: source.name,
    });
  }

  return items;
}

async function fetchWithTimeout(url: string, timeout = 10000): Promise<string | null> {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ZamVibeBot/1.0; +https://zamvibe.vercel.app)',
        'Accept': 'application/rss+xml, application/xml, text/xml, application/atom+xml, */*',
      },
    });
    clearTimeout(id);
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

// Try to fetch og:image from a URL as fallback
async function fetchOgImage(url: string): Promise<string> {
  try {
    const html = await fetchWithTimeout(url, 8000);
    if (!html) return '';
    const ogMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["'][^>]*>/i)
      || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["'][^>]*>/i);
    if (ogMatch) return ogMatch[1];
    // Fallback to first large-ish image
    const imgMatch = html.match(/<img[^>]*src=["']([^"']*(?:upload|content|wp-content|images)[^"']+)["'][^>]*>/i);
    return imgMatch ? imgMatch[1] : '';
  } catch {
    return '';
  }
}

// Generate a placeholder image URL using the title
function getPlaceholderImage(title: string, category: string): string {
  const seed = encodeURIComponent(title.substring(0, 30));
  const colors: Record<string, string> = {
    Music: 'e74c3c',
    'Celebrity': '9b59b6',
    'Movies & TV': '3498db',
    Comedy: 'f39c12',
    Fashion: 'e91e63',
    Viral: '2ecc71',
    Lifestyle: '1abc9c',
    Culture: '00bcd4',
    Entertainment: 'ff5722',
  };
  const color = colors[category] || 'e74c3c';
  return `https://placehold.co/800x450/${color}/ffffff?text=${seed}`;
}

async function fetchFeed(source: FeedSource): Promise<RSSItem[]> {
  const xml = await fetchWithTimeout(source.url, 15000);
  if (!xml) return [];

  return parseRSSFeed(xml, source);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const authKey = searchParams.get('key');

    // Simple auth check for cron/manual triggers
    const validKey = process.env.FETCH_NEWS_KEY || 'zamvibe-fetch-2025';
    if (authKey !== validKey && request.headers.get('x-vercel-cron') !== 'true') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const startTime = Date.now();
    let totalFetched = 0;
    let totalSaved = 0;
    let totalSkipped = 0;
    const errors: string[] = [];

    // Fetch from all sources in parallel (batches)
    const batchSize = 5;
    const allItems: RSSItem[] = [];

    for (let i = 0; i < ENTERTAINMENT_FEEDS.length; i += batchSize) {
      const batch = ENTERTAINMENT_FEEDS.slice(i, i + batchSize);
      const batchResults = await Promise.allSettled(
        batch.map(async (source) => {
          try {
            const items = await fetchFeed(source);
            return items.map(item => ({
              ...item,
              source: source.name,
              _feedCategory: source.category,
            }));
          } catch (e) {
            errors.push(`${source.name}: ${e instanceof Error ? e.message : 'Failed'}`);
            return [];
          }
        })
      );

      for (const result of batchResults) {
        if (result.status === 'fulfilled') {
          allItems.push(...result.value);
        }
      }
    }

    totalFetched = allItems.length;

    // Get existing post links for deduplication
    const existingPosts = await db.post.findMany({
      select: { headline: true },
      where: { status: 'published' },
    });
    const existingHeadlines = new Set(
      existingPosts.map(p => p.headline.toLowerCase().trim())
    );

    // Process items - classify, filter, and save
    for (const item of allItems) {
      // Skip items without titles
      if (!item.title || item.title.length < 10) {
        totalSkipped++;
        continue;
      }

      // Skip very old items (older than 7 days)
      try {
        const itemDate = new Date(item.pubDate);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        if (itemDate < sevenDaysAgo) {
          totalSkipped++;
          continue;
        }
      } catch {
        // If we can't parse the date, keep it
      }

      // Classify content
      const category = classifyContent(item.title, item.description || item.content);
      if (category === 'EXCLUDE') {
        totalSkipped++;
        continue;
      }

      // Deduplication - check if similar headline exists
      const titleLower = item.title.toLowerCase().trim();
      if (existingHeadlines.has(titleLower)) {
        totalSkipped++;
        continue;
      }

      // Fuzzy dedup - check if headline contains mostly the same words
      const words = titleLower.replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 3);
      if (words.length > 3) {
        let isDuplicate = false;
        for (const existing of existingHeadlines) {
          const commonWords = words.filter(w => existing.includes(w)).length;
          if (commonWords > words.length * 0.7) {
            isDuplicate = true;
            break;
          }
        }
        if (isDuplicate) {
          totalSkipped++;
          continue;
        }
      }

      // Get image - use RSS image first, then try og:image from link
      let imageUrl = item.imageUrl || '';
      if (!imageUrl && item.link) {
        imageUrl = await fetchOgImage(item.link);
      }
      // Final fallback to placeholder
      if (!imageUrl) {
        imageUrl = getPlaceholderImage(item.title, category);
      }

      // Clean up description for body
      let body = item.content || item.description || '';
      // Remove HTML tags
      body = body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      // Truncate if too long
      if (body.length > 1000) body = body.substring(0, 1000) + '...';
      // Add source attribution
      if (body && item.link) {
        body += `\n\nSource: ${item.source}`;
      }

      // Determine if should be featured (1 in 15 chance for high-quality content)
      const isFeatured = Math.random() < 0.067 && imageUrl && !imageUrl.includes('placehold.co');

      try {
        await db.post.create({
          data: {
            headline: item.title,
            body,
            category,
            imageUrl,
            status: 'published',
            isFeatured: !!isFeatured,
            isBreaking: false,
            videoUrl: '',
            views: 0,
            shares: 0,
            clicks: 0,
          },
        });
        existingHeadlines.add(titleLower);
        totalSaved++;
      } catch (e) {
        errors.push(`Save failed for "${item.title.substring(0, 50)}": ${e instanceof Error ? e.message : 'Unknown'}`);
      }

      // Small delay to avoid overwhelming the database
      await new Promise(r => setTimeout(r, 50));
    }

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

    return NextResponse.json({
      success: true,
      message: 'Entertainment news fetched successfully',
      stats: {
        feedsProcessed: ENTERTAINMENT_FEEDS.length,
        totalFetched,
        totalSaved,
        totalSkipped,
        errors: errors.length,
        elapsedSeconds: elapsed,
      },
      errors: errors.slice(0, 10), // Only return first 10 errors
    });
  } catch (error) {
    console.error('Fetch news error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Also support POST for manual triggers from admin
export async function POST(request: NextRequest) {
  return GET(request);
}
