'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Zap,
  Search,
  Eye,
  Share2,
  Play,
  X,
  TrendingUp,
  Flame,
  ChevronRight,
  RefreshCw,
  Shield,
  Clock,
  Send,
  Star,
  Trash2,
  Lock,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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

interface CategoryInfo {
  name: string;
  color: string;
  count: number;
}

// ===================== HELPERS =====================
const CATEGORY_COLORS: Record<string, string> = {
  Music: '#a855f7',
  Gossip: '#f59e0b',
  Viral: '#ef4444',
  Lifestyle: '#22c55e',
};

const CATEGORY_BG: Record<string, string> = {
  Music: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  Gossip: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  Viral: 'bg-red-500/15 text-red-400 border-red-500/30',
  Lifestyle: 'bg-green-500/15 text-green-400 border-green-500/30',
};

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

// ===================== COMPONENTS =====================

// --- Breaking News Ticker ---
function BreakingNewsTicker({ headlines }: { headlines: string[] }) {
  if (headlines.length === 0) return null;
  const tickerText = headlines.join('    ●    ');

  return (
    <div className="breaking-gradient w-full overflow-hidden relative py-1.5">
      <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center pl-3">
        <span className="flex items-center gap-1.5 text-xs font-bold text-white tracking-wide uppercase">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse-live" />
          Breaking
        </span>
      </div>
      <div className="overflow-hidden ml-[90px]">
        <div className="animate-ticker whitespace-nowrap text-sm text-white font-medium">
          {tickerText}
        </div>
      </div>
    </div>
  );
}

// --- Header ---
function Header({ searchQuery, onSearchChange }: { searchQuery: string; onSearchChange: (q: string) => void }) {
  return (
    <header className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
        <div className="flex items-center gap-2 shrink-0">
          <Zap className="w-7 h-7 text-red-500 fill-red-500" />
          <h1 className="text-xl font-black tracking-tight">
            <span className="text-white">ZAM</span>
            <span className="text-red-500">VIBE</span>
          </h1>
        </div>
        <div className="flex-1 max-w-md ml-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <Input
              type="text"
              placeholder="Search stories..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 bg-[#141414] border-[#262626] text-white text-sm h-9 placeholder:text-neutral-600 focus:border-red-500/50"
            />
          </div>
        </div>
      </div>
    </header>
  );
}

// --- Featured Story Block ---
function FeaturedStoryBlock({ post, total, currentIndex }: { post: Post | null; total: number; currentIndex: number }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (!post) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-4">
        <Skeleton className="w-full h-[280px] md:h-[380px] rounded-xl" />
      </div>
    );
  }

  const hasImage = post.imageUrl && !imgError;

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div
        className="relative w-full h-[280px] md:h-[380px] rounded-xl overflow-hidden cursor-pointer group viral-card-glow border border-[#262626]"
        style={{ animationDelay: '0.1s', opacity: 1, animation: 'fadeInUp 0.5s ease-out forwards' }}
      >
        {hasImage ? (
          <>
            <img
              src={post.imageUrl}
              alt={post.headline}
              className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
            />
            {!imgLoaded && <Skeleton className="absolute inset-0 w-full h-full" />}
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-red-900/30 via-[#141414] to-purple-900/30" />
        )}
        <div className="hero-overlay absolute inset-0" />
        <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-red-600 text-white rounded">
              Featured
            </span>
            <span
              className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded border"
              style={{
                backgroundColor: CATEGORY_COLORS[post.category] + '20',
                color: CATEGORY_COLORS[post.category],
                borderColor: CATEGORY_COLORS[post.category] + '40',
              }}
            >
              {post.category}
            </span>
          </div>
          <h2 className="text-xl md:text-3xl font-black text-white leading-tight mb-2 line-clamp-3">
            {post.headline}
          </h2>
          <div className="flex items-center gap-4 text-neutral-400 text-xs">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {formatNumber(post.views)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {timeAgo(post.createdAt)}
            </span>
          </div>
        </div>
        {total > 1 && (
          <div className="absolute bottom-3 right-5 flex gap-1.5">
            {Array.from({ length: total }).map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentIndex ? 'bg-red-500 w-6' : 'bg-white/30'}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// --- Category Tabs ---
function CategoryTabs({
  categories,
  activeCategory,
  onCategoryChange,
}: {
  categories: CategoryInfo[];
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
}) {
  const allCount = categories.reduce((sum, c) => sum + c.count, 0);
  const tabs = [{ name: 'All', color: '#ef4444', count: allCount }, ...categories];

  return (
    <div className="max-w-7xl mx-auto px-4 py-2">
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => onCategoryChange(tab.name)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border ${
              activeCategory === tab.name
                ? 'text-white border-transparent'
                : 'text-neutral-400 bg-[#141414] border-[#262626] hover:border-neutral-600'
            }`}
            style={
              activeCategory === tab.name
                ? { backgroundColor: tab.color + '20', color: tab.color, borderColor: tab.color + '40' }
                : undefined
            }
          >
            {tab.name}
            <span className="ml-1.5 text-xs opacity-60">{tab.count}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// --- Post Card ---
function PostCard({
  post,
  onClick,
}: {
  post: Post;
  onClick: (post: Post) => void;
}) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const hasImage = post.imageUrl && !imgError;

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `${post.headline} — ZamVibe`;
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const waUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
    window.open(waUrl, '_blank');
    try {
      await fetch(`/api/posts/${post.id}/share`, { method: 'POST' });
    } catch {}
  };

  return (
    <article
      onClick={() => onClick(post)}
      className="bg-[#141414] border border-[#262626] rounded-xl overflow-hidden cursor-pointer viral-card-glow group"
    >
      {hasImage && (
        <div className="relative w-full h-48 overflow-hidden">
          <img
            src={post.imageUrl}
            alt={post.headline}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
          />
          {!imgLoaded && <Skeleton className="absolute inset-0 w-full h-full" />}
          <div className="absolute top-3 left-3 flex gap-1.5">
            {post.isBreaking && (
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider breaking-gradient text-white rounded flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse-live" />
                Breaking
              </span>
            )}
            <span
              className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded border"
              style={{
                backgroundColor: CATEGORY_COLORS[post.category] + '20',
                color: CATEGORY_COLORS[post.category],
                borderColor: CATEGORY_COLORS[post.category] + '40',
              }}
            >
              {post.category}
            </span>
          </div>
        </div>
      )}
      {!hasImage && (
        <div className="w-full h-20 bg-gradient-to-r from-[#1a1a1a] to-[#141414] flex items-center px-4 gap-2">
          {post.isBreaking && (
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider breaking-gradient text-white rounded flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse-live" />
              Breaking
            </span>
          )}
          <span
            className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded border ${CATEGORY_BG[post.category] || 'bg-neutral-500/15 text-neutral-400 border-neutral-500/30'}`}
          >
            {post.category}
          </span>
        </div>
      )}
      <div className="p-4">
        <h3 className="text-base md:text-lg font-bold text-white leading-snug mb-2 line-clamp-2 group-hover:text-red-400 transition-colors">
          {post.headline}
        </h3>
        {post.body && (
          <p className="text-sm text-neutral-500 leading-relaxed mb-3 line-clamp-2">
            {post.body}
          </p>
        )}
        <div className="flex items-center justify-between text-xs text-neutral-600">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {formatNumber(post.views)}
            </span>
            <span className="flex items-center gap-1">
              <Share2 className="w-3.5 h-3.5" />
              {formatNumber(post.shares)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {timeAgo(post.createdAt)}
            </span>
          </div>
          <button
            onClick={handleShare}
            className="p-1.5 rounded-full hover:bg-green-500/10 transition-colors group/share"
            aria-label="Share on WhatsApp"
          >
            <svg className="w-4 h-4 text-green-500 group-hover/share:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}

// --- Post Card Skeleton ---
function PostCardSkeleton() {
  return (
    <div className="bg-[#141414] border border-[#262626] rounded-xl overflow-hidden">
      <Skeleton className="w-full h-48" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex gap-3">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    </div>
  );
}

// --- Trending Panel ---
function TrendingPanel({ topics }: { topics: TrendingTopic[] }) {
  return (
    <div className="bg-[#141414] border border-[#262626] rounded-xl p-4 sticky top-16">
      <div className="flex items-center gap-2 mb-4">
        <Flame className="w-5 h-5 text-red-500" />
        <h3 className="text-sm font-black uppercase tracking-wider text-white">Trending Now</h3>
        <span className="flex items-center gap-1 ml-auto">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse-live" />
          <span className="text-[10px] font-bold text-red-400 uppercase">Live</span>
        </span>
      </div>
      <div className="space-y-1">
        {topics.map((topic) => (
          <div
            key={topic.id}
            className="flex items-start gap-3 py-2.5 px-2 rounded-lg hover:bg-[#1a1a1a] transition-colors cursor-pointer group"
          >
            <span className="text-lg font-black text-neutral-600 group-hover:text-red-500 transition-colors w-6 shrink-0">
              {topic.rank}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-neutral-300 group-hover:text-white transition-colors line-clamp-1">
                {topic.title}
              </p>
              <p className="text-xs text-neutral-600 mt-0.5">
                {formatNumber(topic.posts)} posts
              </p>
            </div>
            {topic.category && (
              <span
                className="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded shrink-0"
                style={{
                  backgroundColor: CATEGORY_COLORS[topic.category] + '15',
                  color: CATEGORY_COLORS[topic.category],
                }}
              >
                {topic.category}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Video Feed ---
function VideoFeed({ clips }: { clips: VideoClip[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section id="video-section" className="py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">🎬</span>
          <h2 className="text-lg font-black text-white">Videos</h2>
          <ChevronRight className="w-4 h-4 text-neutral-500" />
        </div>
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 no-scrollbar"
        >
          {clips.map((clip) => (
            <div
              key={clip.id}
              className="shrink-0 w-[200px] md:w-[240px] bg-[#141414] border border-[#262626] rounded-xl overflow-hidden cursor-pointer group viral-card-glow"
            >
              <div className="relative w-full h-[280px] md:h-[340px] overflow-hidden bg-[#1a1a1a]">
                {clip.thumbnail ? (
                  <img
                    src={clip.thumbnail}
                    alt={clip.headline}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-900/20 to-purple-900/20">
                    <Play className="w-12 h-12 text-white/30" />
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center group-hover:bg-red-600/80 transition-colors">
                    <Play className="w-6 h-6 text-white fill-white ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-2 left-2 right-2">
                  <span
                    className="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded"
                    style={{
                      backgroundColor: CATEGORY_COLORS[clip.category] + '20',
                      color: CATEGORY_COLORS[clip.category],
                    }}
                  >
                    {clip.category}
                  </span>
                </div>
              </div>
              <div className="p-3">
                <h4 className="text-sm font-semibold text-white line-clamp-2 mb-1.5">
                  {clip.headline}
                </h4>
                <span className="text-xs text-neutral-500 flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {formatNumber(clip.views)} views
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- Post Modal ---
function PostModal({ post, open, onClose }: { post: Post | null; open: boolean; onClose: () => void }) {
  const [imgError, setImgError] = useState(false);

  if (!post) return null;

  // Reset image error when post changes via key-based approach (parent passes key={post.id})

  const handleShare = () => {
    const text = `${post.headline} — ZamVibe`;
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const waUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#141414] border-[#262626] text-white p-0">
        {post.imageUrl && !imgError && (
          <div className="relative w-full h-[250px] md:h-[350px]">
            <img
              src={post.imageUrl}
              alt={post.headline}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
            <div className="hero-overlay absolute inset-0" />
            <div className="absolute top-4 left-4 flex gap-2">
              {post.isBreaking && (
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider breaking-gradient text-white rounded flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse-live" />
                  Breaking
                </span>
              )}
              <span
                className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded border"
                style={{
                  backgroundColor: CATEGORY_COLORS[post.category] + '20',
                  color: CATEGORY_COLORS[post.category],
                  borderColor: CATEGORY_COLORS[post.category] + '40',
                }}
              >
                {post.category}
              </span>
            </div>
          </div>
        )}
        <div className="p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl md:text-2xl font-black text-white leading-tight">
              {post.headline}
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-4 text-xs text-neutral-500 mb-4">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {formatNumber(post.views)} views
            </span>
            <span className="flex items-center gap-1">
              <Share2 className="w-3.5 h-3.5" />
              {formatNumber(post.shares)} shares
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {timeAgo(post.createdAt)}
            </span>
          </div>
          <div className="prose prose-invert prose-sm max-w-none">
            <p className="text-neutral-300 leading-relaxed whitespace-pre-line">{post.body}</p>
          </div>
          <div className="mt-6 flex gap-3">
            <Button
              onClick={handleShare}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Share on WhatsApp
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="border-[#262626] text-neutral-400 hover:text-white"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// --- Admin Panel ---
function AdminPanel({ open, onClose, adminPosts, onRefresh }: { open: boolean; onClose: () => void; adminPosts: Post[]; onRefresh: () => void }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('zamvibe_admin') === 'true';
    }
    return false;
  });
  const [password, setPassword] = useState('');

  const [formData, setFormData] = useState({
    headline: '',
    body: '',
    category: 'Viral',
    imageUrl: '',
    videoUrl: '',
    isBreaking: false,
    isFeatured: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');

  const handleLogin = () => {
    if (password === 'zamvibe2025') {
      setIsAuthenticated(true);
      localStorage.setItem('zamvibe_admin', 'true');
      setAuthError('');
    } else {
      setAuthError('Wrong password. Try: zamvibe2025');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.headline.trim()) return;
    setSubmitting(true);
    try {
      await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      setFormData({ headline: '', body: '', category: 'Viral', imageUrl: '', videoUrl: '', isBreaking: false, isFeatured: false });
      onRefresh();
    } catch {}
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/posts/${id}`, { method: 'DELETE' }).catch(() => {});
      onRefresh();
    } catch {}
  };

  const handleToggleFeatured = () => {
    onRefresh();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-[#0a0a0a] overflow-y-auto">
      <div className="max-w-2xl mx-auto p-4">
        <div className="flex items-center justify-between mb-6 pt-2">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-black text-white">Admin Panel</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-neutral-400 hover:text-white">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {!isAuthenticated ? (
          <div className="bg-[#141414] border border-[#262626] rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-5 h-5 text-red-500" />
              <h3 className="font-bold text-white">Admin Login</h3>
            </div>
            <p className="text-sm text-neutral-500 mb-4">Enter the admin password to access the dashboard.</p>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              className="bg-[#1a1a1a] border-[#262626] text-white mb-3"
            />
            {authError && <p className="text-xs text-red-400 mb-3">{authError}</p>}
            <Button onClick={handleLogin} className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold">
              Login
            </Button>
          </div>
        ) : (
          <>
            {/* Create Post Form */}
            <div className="bg-[#141414] border border-[#262626] rounded-xl p-6 mb-6">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Send className="w-4 h-4 text-red-500" />
                Create New Post
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label className="text-neutral-400 text-sm">Headline *</Label>
                  <Input
                    required
                    value={formData.headline}
                    onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                    placeholder="Enter headline..."
                    className="bg-[#1a1a1a] border-[#262626] text-white mt-1"
                  />
                </div>
                <div>
                  <Label className="text-neutral-400 text-sm">Body</Label>
                  <Textarea
                    value={formData.body}
                    onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                    placeholder="Enter article body..."
                    rows={4}
                    className="bg-[#1a1a1a] border-[#262626] text-white mt-1 resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-neutral-400 text-sm">Category</Label>
                    <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                      <SelectTrigger className="bg-[#1a1a1a] border-[#262626] text-white mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a1a] border-[#262626]">
                        <SelectItem value="Music">Music</SelectItem>
                        <SelectItem value="Gossip">Gossip</SelectItem>
                        <SelectItem value="Viral">Viral</SelectItem>
                        <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-neutral-400 text-sm">Image URL</Label>
                    <Input
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="https://..."
                      className="bg-[#1a1a1a] border-[#262626] text-white mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-neutral-400 text-sm">Video URL</Label>
                  <Input
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    placeholder="https://..."
                    className="bg-[#1a1a1a] border-[#262626] text-white mt-1"
                  />
                </div>
                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="breaking"
                      checked={formData.isBreaking}
                      onCheckedChange={(v) => setFormData({ ...formData, isBreaking: v === true })}
                      className="border-red-500 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                    />
                    <Label htmlFor="breaking" className="text-sm text-red-400 font-semibold cursor-pointer">
                      Breaking News
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="featured"
                      checked={formData.isFeatured}
                      onCheckedChange={(v) => setFormData({ ...formData, isFeatured: v === true })}
                      className="border-amber-500 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
                    />
                    <Label htmlFor="featured" className="text-sm text-amber-400 font-semibold cursor-pointer">
                      Featured
                    </Label>
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                  Publish Post
                </Button>
              </form>
            </div>

            {/* Recent Posts */}
            <div className="bg-[#141414] border border-[#262626] rounded-xl p-6">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-red-500" />
                Recent Posts
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
                {adminPosts.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-[#1a1a1a] border border-[#262626]"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white line-clamp-1">{p.headline}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded ${CATEGORY_BG[p.category] || ''}`}>
                          {p.category}
                        </span>
                        {p.isBreaking && (
                          <span className="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded bg-red-500/15 text-red-400">Breaking</span>
                        )}
                        {p.isFeatured && (
                          <span className="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400">Featured</span>
                        )}
                        <span className="text-[10px] text-neutral-600">{timeAgo(p.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => handleToggleFeatured()}
                        className="p-1.5 rounded hover:bg-amber-500/10 transition-colors"
                        aria-label="Toggle featured"
                      >
                        <Star className={`w-3.5 h-3.5 ${p.isFeatured ? 'text-amber-400 fill-amber-400' : 'text-neutral-600'}`} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 rounded hover:bg-red-500/10 transition-colors"
                        aria-label="Delete post"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-neutral-600 hover:text-red-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// --- Bottom Nav ---
function BottomNav({
  activeTab,
  onTabChange,
  onAdminOpen,
}: {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAdminOpen: () => void;
}) {
  const tabs = [
    { id: 'home', label: 'Home', icon: () => <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
    { id: 'trending', label: 'Trending', icon: () => <TrendingUp className="w-5 h-5" /> },
    { id: 'video', label: 'Videos', icon: () => <Play className="w-5 h-5" /> },
    { id: 'admin', label: 'Admin', icon: () => <Shield className="w-5 h-5" /> },
  ];

  const handleClick = (tabId: string) => {
    if (tabId === 'admin') {
      onAdminOpen();
    } else {
      onTabChange(tabId);
      if (tabId === 'video') {
        document.getElementById('video-section')?.scrollIntoView({ behavior: 'smooth' });
      } else if (tabId === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (tabId === 'trending') {
        document.getElementById('trending-section')?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-t border-[#1a1a1a] pb-safe">
      <div className="max-w-lg mx-auto flex items-center justify-around py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleClick(tab.id)}
              className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-lg transition-colors ${
                isActive ? 'text-red-500' : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              <Icon />
              <span className="text-[10px] font-semibold">{tab.label}</span>
              {isActive && <span className="w-1 h-1 rounded-full bg-red-500 mt-0.5" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

// ===================== MAIN PAGE =====================
export default function ZamVibePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
  const [featuredPost, setFeaturedPost] = useState<Post | null>(null);
  const [featuredTotal, setFeaturedTotal] = useState(0);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [videoClips, setVideoClips] = useState<VideoClip[]>([]);
  const [breakingHeadlines, setBreakingHeadlines] = useState<string[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch categories
  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(() => {});
  }, []);

  // Fetch trending
  useEffect(() => {
    fetch('/api/posts/trending')
      .then((r) => r.json())
      .then((data) => {
        if (data.trendingTopics) setTrendingTopics(data.trendingTopics);
      })
      .catch(() => {});
  }, []);

  // Fetch videos
  useEffect(() => {
    fetch('/api/videos?limit=8')
      .then((r) => r.json())
      .then((data) => {
        if (data.videos) setVideoClips(data.videos);
      })
      .catch(() => {});
  }, []);

  // Fetch breaking headlines
  useEffect(() => {
    fetch('/api/posts?category=All&sort=trending&limit=50')
      .then((r) => r.json())
      .then((data) => {
        if (data.posts) {
          const breaking = data.posts.filter((p: Post) => p.isBreaking);
          setBreakingHeadlines(breaking.map((p: Post) => p.headline));
        }
      })
      .catch(() => {});
  }, []);

  // Featured story rotation
  useEffect(() => {
    const fetchFeatured = async (index: number) => {
      try {
        const res = await fetch(`/api/posts/featured?index=${index}`);
        const data = await res.json();
        if (data.post) {
          setFeaturedPost(data.post);
          setFeaturedTotal(data.total || 1);
          setFeaturedIndex(data.index || 0);
        }
      } catch {}
    };

    fetchFeatured(0);
    const interval = setInterval(() => {
      setFeaturedIndex((prev) => {
        fetchFeatured(prev + 1);
        return prev + 1;
      });
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // Fetch posts (main feed)
  const fetchPosts = useCallback(
    async (pageNum: number, append: boolean, cat: string, search: string) => {
      try {
        const params = new URLSearchParams({
          page: pageNum.toString(),
          limit: '10',
          sort: 'latest',
        });
        if (cat && cat !== 'All') params.set('category', cat);
        if (search) params.set('search', search);

        const res = await fetch(`/api/posts?${params}`);
        const data = await res.json();

        if (data.posts) {
          setPosts(append ? (prev: Post[]) => [...prev, ...data.posts] : data.posts);
          setHasMore(data.hasMore);
        }
      } catch {}
    },
    []
  );

  // Initial load and category/search changes
  useEffect(() => {
    let cancelled = false;
    const doFetch = async () => {
      if (!cancelled) {
        setLoading(true);
        setPage(1);
        setPosts([]);
      }
      await fetchPosts(1, false, activeCategory, searchQuery);
      if (!cancelled) setLoading(false);
    };
    doFetch();
    return () => { cancelled = true; };
  }, [activeCategory, searchQuery, fetchPosts]);

  // Search debounce
  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      setPage(1);
      setPosts([]);
      fetchPosts(1, false, activeCategory, q);
    }, 400);
  };

  // Infinite scroll observer
  useEffect(() => {
    if (!loadMoreRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          setLoadingMore(true);
          const nextPage = page + 1;
          setPage(nextPage);
          fetchPosts(nextPage, true, activeCategory, searchQuery).finally(() => setLoadingMore(false));
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, page, activeCategory, searchQuery, fetchPosts]);

  // Track view when opening modal
  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setModalOpen(true);
    fetch(`/api/posts/${post.id}/view`, { method: 'POST' }).catch(() => {});
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Breaking News Ticker */}
      <BreakingNewsTicker headlines={breakingHeadlines} />

      {/* Header */}
      <Header searchQuery={searchQuery} onSearchChange={handleSearchChange} />

      {/* Featured Story */}
      <FeaturedStoryBlock
        post={featuredPost}
        total={featuredTotal}
        currentIndex={featuredIndex}
      />

      {/* Category Tabs */}
      <CategoryTabs
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={(cat) => {
          setActiveCategory(cat);
          window.scrollTo({ top: 300, behavior: 'smooth' });
        }}
      />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex gap-6">
          {/* Main Feed */}
          <div className="flex-1 min-w-0">
            {/* Search indicator */}
            {searchQuery && (
              <div className="flex items-center gap-2 mb-4 text-sm text-neutral-400">
                <Search className="w-4 h-4" />
                <span>Showing results for &quot;{searchQuery}&quot;</span>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-red-400 hover:text-red-300 font-semibold"
                >
                  Clear
                </button>
              </div>
            )}

            {loading ? (
              <div className="grid gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <PostCardSkeleton key={i} />
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-neutral-500 text-lg">No stories found</p>
                <p className="text-neutral-600 text-sm mt-2">Try a different category or search term</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {posts.map((post, i) => (
                  <div
                    key={post.id}
                    className="animate-slide-in-right"
                    style={{ animationDelay: `${Math.min(i * 0.05, 0.5)}s`, opacity: 0 }}
                  >
                    <PostCard post={post} onClick={handlePostClick} />
                  </div>
                ))}
              </div>
            )}

            {/* Load More Sentinel */}
            <div ref={loadMoreRef} className="py-8">
              {loadingMore && (
                <div className="flex items-center justify-center gap-2 text-neutral-500 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading more stories...
                </div>
              )}
              {!hasMore && posts.length > 0 && (
                <div className="text-center text-neutral-600 text-sm py-4">
                  You&apos;re all caught up! 🔥
                </div>
              )}
            </div>
          </div>

          {/* Trending Sidebar (Desktop) */}
          <aside id="trending-section" className="hidden lg:block w-80 shrink-0">
            <TrendingPanel topics={trendingTopics} />

            {/* Stats Card */}
            <div className="bg-[#141414] border border-[#262626] rounded-xl p-4 mt-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-white mb-3 flex items-center gap-2">
                📊 Quick Stats
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Total Stories', value: posts.length > 0 ? '26+' : '...' },
                  { label: 'Trending Topics', value: trendingTopics.length.toString() || '10' },
                  { label: 'Video Clips', value: videoClips.length.toString() || '8' },
                  { label: 'Categories', value: categories.length.toString() || '4' },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between">
                    <span className="text-xs text-neutral-500">{stat.label}</span>
                    <span className="text-sm font-bold text-white">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile Trending Section */}
      <section className="lg:hidden py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 mb-3">
            <Flame className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-black text-white">Trending Now</h2>
            <span className="flex items-center gap-1 ml-auto">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse-live" />
              <span className="text-[10px] font-bold text-red-400 uppercase">Live</span>
            </span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {trendingTopics.slice(0, 5).map((topic) => (
              <div
                key={topic.id}
                className="shrink-0 bg-[#141414] border border-[#262626] rounded-lg px-4 py-3 min-w-[160px] cursor-pointer hover:border-red-500/30 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-black text-red-500">#{topic.rank}</span>
                  {topic.category && (
                    <span
                      className="text-[8px] font-semibold uppercase px-1.5 py-0.5 rounded"
                      style={{
                        backgroundColor: CATEGORY_COLORS[topic.category] + '15',
                        color: CATEGORY_COLORS[topic.category],
                      }}
                    >
                      {topic.category}
                    </span>
                  )}
                </div>
                <p className="text-xs font-semibold text-neutral-300 line-clamp-2">{topic.title}</p>
                <p className="text-[10px] text-neutral-600 mt-1">{formatNumber(topic.posts)} posts</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Feed */}
      <VideoFeed clips={videoClips} />

      {/* Footer spacer for bottom nav */}
      <div className="h-20" />

      {/* Bottom Nav */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} onAdminOpen={() => setAdminOpen(true)} />

      {/* Post Modal */}
      <PostModal key={selectedPost?.id || 'empty'} post={selectedPost} open={modalOpen} onClose={() => setModalOpen(false)} />

      {/* Admin Panel */}
      <AdminPanel open={adminOpen} onClose={() => setAdminOpen(false)} adminPosts={posts} onRefresh={() => { setPage(1); fetchPosts(1, false, activeCategory, searchQuery); }} />
    </main>
  );
}
