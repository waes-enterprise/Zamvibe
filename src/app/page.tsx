'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  Search, Eye, Share2, Play, X, Flame, Clock, ChevronLeft, ChevronRight,
  Home, TrendingUp, Music, Film, MessageCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Footer } from '@/components/footer';

// ===================== TYPES =====================
interface Post {
  id: string;
  headline: string;
  body: string;
  category: string;
  imageUrl: string;
  videoUrl: string;
  isBreaking: boolean;
  isFeatured: boolean;
  views: number;
  shares: number;
  clicks: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface TrendingTopic {
  id: string;
  title: string;
  rank: number;
  posts: number;
  category: string;
}

interface VideoClip {
  id: string;
  headline: string;
  videoUrl: string;
  thumbnail: string;
  views: number;
  category: string;
  createdAt: string;
}

// ===================== HELPERS =====================
const CATEGORY_COLORS: Record<string, string> = {
  Music: '#a855f7', Celebrity: '#3ea6ff', Gossip: '#f59e0b', Viral: '#ef4444',
  'Movies & TV': '#e91e63', Comedy: '#f97316', Fashion: '#ec4899',
  Culture: '#06b6d4', Entertainment: '#ff4444', Lifestyle: '#22c55e',
};

const CATEGORY_CHIPS = [
  { label: 'All', icon: '📰', cat: 'All' },
  { label: 'Trending', icon: '🔥', cat: 'Trending' },
  { label: 'Music', icon: '🎵', cat: 'Music' },
  { label: 'Celebrity', icon: '⭐', cat: 'Celebrity' },
  { label: 'Movies & TV', icon: '🎬', cat: 'Movies & TV' },
  { label: 'Comedy', icon: '😂', cat: 'Comedy' },
  { label: 'Fashion', icon: '👗', cat: 'Fashion' },
  { label: 'Gossip', icon: '💬', cat: 'Gossip' },
  { label: 'Culture', icon: '🌍', cat: 'Culture' },
];

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString('en-ZM', { month: 'short', day: 'numeric' });
}

function estimateReadTime(body: string): string {
  const words = body.split(/\s+/).length;
  const mins = Math.max(1, Math.ceil(words / 200));
  return `${mins}:${String((mins % 1) * 60).padStart(2, '0').slice(0, 2)}`;
}

// ===================== COMPONENTS =====================

// Breaking News Ticker
function BreakingTicker({ posts }: { posts: Post[] }) {
  const breaking = posts.filter(p => p.isBreaking);
  if (breaking.length === 0) return null;
  const text = breaking.map(p => p.headline).join('     ●     ');
  return (
    <div className="bg-[#ff4444] w-full overflow-hidden relative h-7 flex items-center z-[60]">
      <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center pl-3 bg-[#ff4444]">
        <span className="flex items-center gap-1.5 text-[10px] font-bold text-white tracking-wide uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse-live" />
          BREAKING
        </span>
      </div>
      <div className="overflow-hidden ml-[90px]">
        <div className="animate-ticker whitespace-nowrap text-xs text-white font-medium">
          {text}
        </div>
      </div>
    </div>
  );
}

// Header
function Header({ searchQuery, onSearchChange, showFetchBtn, onFetchNews, fetching }: {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  showFetchBtn: boolean;
  onFetchNews: () => void;
  fetching: boolean;
}) {
  return (
    <header className="sticky top-0 z-50 bg-[#0f0f0f]/95 backdrop-blur-md border-b border-[#272727]">
      <div className="flex items-center justify-between px-4 h-14">
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 bg-[#ff4444] rounded-lg flex items-center justify-center">
            <Play className="w-4 h-4 text-white fill-white ml-0.5" />
          </div>
          <span className="text-xl font-bold text-[#f1f1f1] tracking-tight">
            Zam<span className="text-[#ff4444]">Vibe</span>
          </span>
        </div>

        {/* Search */}
        <div className="hidden sm:flex flex-1 max-w-xl mx-4">
          <div className="relative w-full group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#aaa] pointer-events-none" />
            <Input
              type="text"
              placeholder="Search stories..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 h-10 bg-[#121212] border-[#303030] rounded-full text-sm text-[#f1f1f1] placeholder:text-[#888] focus:border-[#3ea6ff] focus:ring-0 transition-colors"
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {showFetchBtn && (
            <Button
              onClick={onFetchNews}
              disabled={fetching}
              size="sm"
              className="bg-[#ff4444] hover:bg-[#ff5555] text-white text-xs px-3 h-8 rounded-full font-medium"
            >
              {fetching ? 'Fetching...' : 'Fetch News'}
            </Button>
          )}
          {/* Mobile search toggle */}
          <button
            className="sm:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#272727] transition-colors"
            onClick={() => {
              const el = document.getElementById('mobile-search');
              if (el) el.focus();
            }}
          >
            <Search className="w-5 h-5 text-[#f1f1f1]" />
          </button>
        </div>
      </div>
      {/* Mobile search bar */}
      <div className="sm:hidden px-4 pb-2">
        <Input
          id="mobile-search"
          type="text"
          placeholder="Search stories..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-4 pr-4 h-9 bg-[#121212] border-[#303030] rounded-full text-xs text-[#f1f1f1] placeholder:text-[#888] focus:border-[#3ea6ff] focus:ring-0"
        />
      </div>
    </header>
  );
}

// Category Chips
function CategoryChips({ active, onChange }: { active: string; onChange: (c: string) => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  return (
    <div className="sticky top-14 sm:top-14 z-40 bg-[#0f0f0f]/95 backdrop-blur-md border-b border-[#272727]">
      <div ref={scrollRef} className="flex gap-2 overflow-x-auto no-scrollbar px-4 py-2">
        {CATEGORY_CHIPS.map(chip => (
          <button
            key={chip.cat}
            onClick={() => onChange(chip.cat)}
            className={`shrink-0 px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              active === chip.cat
                ? 'bg-[#f1f1f1] text-[#0f0f0f]'
                : 'bg-[#272727] text-[#f1f1f1] hover:bg-[#333] border border-[#303030]'
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// Hero Carousel
function HeroCarousel({ posts, onPostClick }: { posts: Post[]; onPostClick: (p: Post) => void }) {
  const [current, setCurrent] = useState(0);
  const featured = useMemo(() => posts.filter(p => p.isFeatured && p.imageUrl).slice(0, 5), [posts]);

  useEffect(() => {
    if (featured.length < 2) return;
    const timer = setInterval(() => setCurrent(c => (c + 1) % featured.length), 5000);
    return () => clearInterval(timer);
  }, [featured.length]);

  if (featured.length === 0) {
    return (
      <div className="px-4 pt-4">
        <Skeleton className="w-full h-[200px] md:h-[350px] rounded-xl" />
      </div>
    );
  }

  const post = featured[current];
  return (
    <div className="relative w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={post.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full h-[220px] sm:h-[300px] md:h-[400px] cursor-pointer"
          onClick={() => onPostClick(post)}
        >
          <img
            src={post.imageUrl}
            alt={post.headline}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          <div className="hero-overlay absolute inset-0" />
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
            <div className="flex items-center gap-2 mb-2">
              <span
                className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md"
                style={{
                  backgroundColor: (CATEGORY_COLORS[post.category] || '#ff4444') + 'DD',
                  color: '#fff',
                }}
              >
                {post.category}
              </span>
              {post.isBreaking && (
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-[#ff4444] text-white rounded-md flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse-live" />
                  LIVE
                </span>
              )}
            </div>
            <h2 className="text-lg md:text-3xl font-bold text-white leading-tight line-clamp-2 mb-2 max-w-3xl">
              {post.headline}
            </h2>
            <div className="flex items-center gap-3 text-xs text-[#aaa]">
              <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {formatNumber(post.views)} views</span>
              <span>{timeAgo(post.createdAt)}</span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      {/* Nav Arrows */}
      {featured.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); setCurrent(c => (c - 1 + featured.length) % featured.length); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setCurrent(c => (c + 1) % featured.length); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </>
      )}
      {/* Dots */}
      {featured.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
          {featured.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === current ? 'bg-white w-4' : 'bg-white/40 hover:bg-white/60'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Video Section
function VideoSection({ clips }: { clips: VideoClip[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
    }
  };
  if (clips.length === 0) return null;

  return (
    <section className="px-4 py-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold text-[#f1f1f1] flex items-center gap-2">
          <Film className="w-5 h-5 text-[#ff4444]" />
          Must Watch
        </h2>
        <div className="flex gap-1">
          <button onClick={() => scroll('left')} className="w-7 h-7 rounded-full bg-[#272727] hover:bg-[#333] flex items-center justify-center transition-colors">
            <ChevronLeft className="w-4 h-4 text-[#f1f1f1]" />
          </button>
          <button onClick={() => scroll('right')} className="w-7 h-7 rounded-full bg-[#272727] hover:bg-[#333] flex items-center justify-center transition-colors">
            <ChevronRight className="w-4 h-4 text-[#f1f1f1]" />
          </button>
        </div>
      </div>
      <div ref={scrollRef} className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {clips.map(clip => (
          <div key={clip.id} className="shrink-0 w-[200px] sm:w-[240px] group cursor-pointer">
            <div className="relative w-full h-[115px] sm:h-[135px] rounded-xl overflow-hidden bg-[#1a1a1a]">
              {clip.thumbnail ? (
                <img src={clip.thumbnail} alt={clip.headline} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#ff4444]/20 to-purple-900/20">
                  <Play className="w-8 h-8 text-white/30" />
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-black/70 flex items-center justify-center group-hover:bg-[#ff4444]/90 transition-colors">
                  <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                </div>
              </div>
            </div>
            <p className="text-xs font-semibold text-[#f1f1f1] mt-2 line-clamp-2 leading-tight">{clip.headline}</p>
            <p className="text-[10px] text-[#aaa] mt-0.5">{formatNumber(clip.views)} views</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// Post Card (YouTube style)
function PostCard({ post, onClick }: { post: Post; onClick: (p: Post) => void }) {
  const [imgError, setImgError] = useState(false);
  const hasImage = post.imageUrl && !imgError;

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={() => onClick(post)}
      className="yt-card cursor-pointer group rounded-xl overflow-hidden bg-[#1a1a1a] border border-[#272727] hover:border-[#404040] hover:yt-shadow-hover"
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-video bg-[#1a1a1a] overflow-hidden">
        {hasImage ? (
          <img
            src={post.imageUrl}
            alt={post.headline}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#272727] to-[#1a1a1a]">
            <Play className="w-8 h-8 text-[#555]" />
          </div>
        )}
        {/* Category badge */}
        <span
          className="absolute top-2 left-2 px-2 py-0.5 text-[9px] font-bold uppercase rounded-md"
          style={{
            backgroundColor: (CATEGORY_COLORS[post.category] || '#ff4444') + 'CC',
            color: '#fff',
          }}
        >
          {post.category}
        </span>
        {/* Duration badge */}
        <span className="absolute bottom-2 right-2 px-1.5 py-0.5 text-[10px] font-medium bg-black/80 text-white rounded">
          {estimateReadTime(post.body)}
        </span>
        {/* Breaking */}
        {post.isBreaking && (
          <span className="absolute top-2 right-2 px-1.5 py-0.5 text-[9px] font-bold uppercase bg-[#ff4444] text-white rounded flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-white animate-pulse-live" />
            BREAKING
          </span>
        )}
      </div>
      {/* Info */}
      <div className="p-3">
        <h3 className="text-sm font-semibold text-[#f1f1f1] leading-snug line-clamp-2 group-hover:text-[#3ea6ff] transition-colors">
          {post.headline}
        </h3>
        <div className="flex items-center gap-2 mt-1.5 text-[11px] text-[#aaa]">
          <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" /> {formatNumber(post.views)}</span>
          <span>•</span>
          <span>{timeAgo(post.createdAt)}</span>
        </div>
      </div>
    </motion.article>
  );
}

// Skeleton Card
function PostCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden bg-[#1a1a1a] border border-[#272727]">
      <Skeleton className="w-full aspect-video" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-2/3 rounded" />
        <div className="flex gap-2">
          <Skeleton className="h-3 w-12 rounded" />
          <Skeleton className="h-3 w-8 rounded" />
        </div>
      </div>
    </div>
  );
}

// Trending Sidebar
function TrendingSidebar({ topics, onPostClick }: { topics: TrendingTopic[]; onPostClick: (p: Post) => void }) {
  return (
    <aside className="sticky top-36 space-y-4">
      <div className="bg-[#1a1a1a] rounded-xl border border-[#272727] p-4">
        <h3 className="text-sm font-bold text-[#f1f1f1] flex items-center gap-2 mb-3">
          <Flame className="w-4 h-4 text-[#ff4444]" />
          Trending Now
          <span className="flex items-center gap-0.5 ml-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff4444] animate-pulse-live" />
          </span>
        </h3>
        <div className="space-y-1">
          {topics.slice(0, 10).map(topic => (
            <div
              key={topic.id}
              className="flex items-start gap-2.5 py-2 px-2 rounded-lg hover:bg-[#272727] transition-colors cursor-pointer group"
            >
              <span className="text-sm font-bold text-[#555] group-hover:text-[#ff4444] transition-colors w-5 shrink-0 text-right">
                {topic.rank}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-[#f1f1f1] group-hover:text-white transition-colors line-clamp-1">
                  {topic.title}
                </p>
                <p className="text-[10px] text-[#888]">{formatNumber(topic.posts)} posts</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

// Post Modal
function PostModal({ post, open, onClose }: { post: Post | null; open: boolean; onClose: () => void }) {
  const [imgError, setImgError] = useState(false);
  if (!post) return null;

  const shareWhatsApp = () => {
    const text = `${post.headline} — ZamVibe`;
    const url = typeof window !== 'undefined' ? window.location.href : '';
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
    fetch(`/api/posts/${post.id}/share`, { method: 'POST' }).catch(() => {});
  };
  const shareTwitter = () => {
    const text = encodeURIComponent(post.headline);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=zamvibe.vercel.app`, '_blank');
  };
  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=zamvibe.vercel.app`, '_blank');
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-[101] max-h-[90vh] overflow-y-auto rounded-t-2xl bg-[#1a1a1a] border-t border-[#272727]"
          >
            {/* Drag handle */}
            <div className="sticky top-0 z-10 flex justify-center pt-2 pb-3 bg-[#1a1a1a]">
              <div className="w-10 h-1 rounded-full bg-[#555]" />
              <button
                onClick={onClose}
                className="absolute right-4 top-3 w-8 h-8 rounded-full bg-[#272727] hover:bg-[#333] flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-[#f1f1f1]" />
              </button>
            </div>

            {post.imageUrl && !imgError && (
              <div className="relative w-full h-[200px] md:h-[300px]">
                <img src={post.imageUrl} alt={post.headline} className="w-full h-full object-cover" onError={() => setImgError(true)} />
                <div className="hero-overlay absolute inset-0" />
                <div className="absolute bottom-4 left-4 flex gap-2">
                  <span
                    className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md"
                    style={{ backgroundColor: (CATEGORY_COLORS[post.category] || '#ff4444') + 'CC', color: '#fff' }}
                  >
                    {post.category}
                  </span>
                  {post.isBreaking && (
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-[#ff4444] text-white rounded-md flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse-live" />
                      BREAKING
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="p-6">
              <h2 className="text-xl md:text-2xl font-bold text-[#f1f1f1] leading-tight mb-3">
                {post.headline}
              </h2>
              <div className="flex items-center gap-4 text-xs text-[#aaa] mb-4">
                <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {formatNumber(post.views)} views</span>
                <span className="flex items-center gap-1"><Share2 className="w-3.5 h-3.5" /> {formatNumber(post.shares)} shares</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {timeAgo(post.createdAt)}</span>
              </div>
              <div className="text-sm text-[#ccc] leading-relaxed whitespace-pre-line mb-6">
                {post.body}
              </div>

              {/* Share buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <Button onClick={shareWhatsApp} className="bg-[#25D366] hover:bg-[#22c55e] text-white text-xs gap-1.5 rounded-full px-4 h-8">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  WhatsApp
                </Button>
                <Button onClick={shareTwitter} variant="outline" className="border-[#303030] text-[#f1f1f1] hover:bg-[#272727] text-xs gap-1.5 rounded-full px-4 h-8">
                  𝕏 Twitter
                </Button>
                <Button onClick={shareFacebook} variant="outline" className="border-[#303030] text-[#f1f1f1] hover:bg-[#272727] text-xs gap-1.5 rounded-full px-4 h-8">
                  📘 Facebook
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Empty State
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-6xl mb-4">📺</div>
      <h3 className="text-lg font-bold text-[#f1f1f1] mb-2">No stories yet</h3>
      <p className="text-sm text-[#aaa] max-w-sm">Check back soon for the latest entertainment news, music, celebrity gossip, and viral stories from across Africa!</p>
    </div>
  );
}

// Mobile Bottom Nav
function MobileBottomNav({ activeTab, onChange }: { activeTab: string; onChange: (tab: string) => void }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'music', label: 'Music', icon: Music },
    { id: 'video', label: 'Video', icon: Film },
    { id: 'search', label: 'Search', icon: MessageCircle },
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0f0f0f]/95 backdrop-blur-md border-t border-[#272727] md:hidden">
      <div className="flex items-center justify-around h-14">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 transition-colors ${
              activeTab === tab.id ? 'text-[#f1f1f1]' : 'text-[#888] hover:text-[#aaa]'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

// ===================== MAIN PAGE =====================
export default function ZamVibePage() {
  // State
  const [posts, setPosts] = useState<Post[]>([]);
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
  const [videoClips, setVideoClips] = useState<VideoClip[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [showFetchBtn, setShowFetchBtn] = useState(false);
  const [mobileTab, setMobileTab] = useState('home');
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Fetch more posts for infinite scroll
  const fetchMorePosts = useCallback(async () => {
    try {
      const res = await fetch(`/api/posts?limit=20&offset=${posts.length}`);
      if (res.ok) {
        const data = await res.json();
        const newPosts = data.posts || [];
        if (newPosts.length > 0) {
          setPosts(prev => {
            const existingIds = new Set(prev.map(p => p.id));
            const unique = newPosts.filter((p: Post) => !existingIds.has(p.id));
            return [...prev, ...unique];
          });
        }
      }
    } catch {
      // Silently fail
    }
  }, [posts.length]);

  // Scroll listener for fetch button
  useEffect(() => {
    const handler = () => setShowFetchBtn(window.scrollY > 500);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Infinite scroll observer
  const setupObserver = useCallback(() => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchMorePosts();
        }
      },
      { threshold: 0 }
    );
    if (sentinelRef.current) observerRef.current.observe(sentinelRef.current);
  }, [fetchMorePosts]);

  useEffect(() => {
    setupObserver();
    return () => { if (observerRef.current) observerRef.current.disconnect(); };
  }, [setupObserver]);

  // Fetch data on mount
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const [postsRes, trendingRes, videosRes] = await Promise.allSettled([
          fetch('/api/posts?limit=50'),
          fetch('/api/posts/trending'),
          fetch('/api/videos'),
        ]);
        if (cancelled) return;
        if (postsRes.status === 'fulfilled' && postsRes.value.ok) {
          const data = await postsRes.value.json();
          setPosts(data.posts || []);
        }
        if (trendingRes.status === 'fulfilled' && trendingRes.value.ok) {
          const data = await trendingRes.value.json();
          setTrendingTopics(data.trendingTopics || []);
        }
        if (videosRes.status === 'fulfilled' && videosRes.value.ok) {
          const data = await videosRes.value.json();
          setVideoClips(data.videos || []);
        }
      } catch {
        // Silently fail
      }
      if (!cancelled) setLoading(false);
    };
    load();
    return () => { cancelled = true; };
  }, []);

  // Fetch news
  const handleFetchNews = async () => {
    setFetching(true);
    try {
      await fetch('/api/admin/fetch-news', { method: 'POST' });
      fetchInitialData();
    } catch {}
    setFetching(false);
  };

  // Open post modal
  const handlePostClick = useCallback((post: Post) => {
    setSelectedPost(post);
    setModalOpen(true);
    // Track view
    fetch(`/api/posts/${post.id}/view`, { method: 'POST' }).catch(() => {});
  }, []);

  // Filtered posts
  const filteredPosts = useMemo(() => {
    let result = posts;
    if (activeCategory === 'Trending') {
      result = result.filter(p => p.isFeatured || p.views > 500 || p.isBreaking);
    } else if (activeCategory !== 'All') {
      result = result.filter(p => p.category === activeCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.headline.toLowerCase().includes(q) || p.body.toLowerCase().includes(q));
    }
    return result;
  }, [posts, activeCategory, searchQuery]);

  // Handle mobile tab
  const handleMobileTab = (tab: string) => {
    setMobileTab(tab);
    if (tab === 'home') setActiveCategory('All');
    else if (tab === 'trending') setActiveCategory('Trending');
    else if (tab === 'music') setActiveCategory('Music');
    else if (tab === 'video') {
      const videoEl = document.getElementById('video-section');
      if (videoEl) videoEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-[#f1f1f1]">
      {/* Breaking ticker */}
      <BreakingTicker posts={posts} />

      {/* Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        showFetchBtn={showFetchBtn}
        onFetchNews={handleFetchNews}
        fetching={fetching}
      />

      {/* Category Chips */}
      <CategoryChips active={activeCategory} onChange={setActiveCategory} />

      {/* Main Content */}
      <main className="pb-20 md:pb-8">
        {/* Hero Carousel */}
        <HeroCarousel posts={posts} onPostClick={handlePostClick} />

        {/* Video Section */}
        <VideoSection clips={videoClips} />

        {/* Two-column layout on desktop */}
        <div className="flex gap-6 px-4 mt-2">
          {/* Main Grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <PostCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredPosts.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredPosts.map(post => (
                  <PostCard key={post.id} post={post} onClick={handlePostClick} />
                ))}
              </div>
            )}
            {/* Infinite scroll sentinel */}
            <div ref={sentinelRef} className="h-10 flex items-center justify-center">
              {!loading && filteredPosts.length > 0 && (
                <p className="text-xs text-[#555]">Loading more stories...</p>
              )}
            </div>
          </div>

          {/* Sidebar - desktop only */}
          <div className="hidden lg:block w-72 shrink-0">
            <TrendingSidebar topics={trendingTopics} onPostClick={handlePostClick} />
          </div>
        </div>

        {/* Mobile Trending Section */}
        <div className="lg:hidden px-4 py-4">
          {trendingTopics.length > 0 && (
            <div className="bg-[#1a1a1a] rounded-xl border border-[#272727] p-4">
              <h3 className="text-sm font-bold text-[#f1f1f1] flex items-center gap-2 mb-3">
                <Flame className="w-4 h-4 text-[#ff4444]" />
                Trending Now
              </h3>
              <div className="space-y-2">
                {trendingTopics.slice(0, 5).map(topic => (
                  <div key={topic.id} className="flex items-start gap-2.5 py-1.5">
                    <span className="text-sm font-bold text-[#555] w-5 text-right shrink-0">{topic.rank}</span>
                    <p className="text-xs font-medium text-[#f1f1f1] line-clamp-1">{topic.title}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Post Modal */}
      <PostModal post={selectedPost} open={modalOpen} onClose={() => setModalOpen(false)} />

      {/* Footer */}
      <Footer />

      {/* Mobile Bottom Nav */}
      <MobileBottomNav activeTab={mobileTab} onChange={handleMobileTab} />
    </div>
  );
}
