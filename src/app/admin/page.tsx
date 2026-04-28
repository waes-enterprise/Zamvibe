'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft, Eye, EyeOff, Loader2, Newspaper, Plus, Trash2, Star, Flame, RefreshCw, TrendingUp, Image, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const ADMIN_PASSWORD = 'zamvibe2025';

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
  status: string;
  createdAt: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'fetch' | 'create'>('content');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [fetchResult, setFetchResult] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  // Create post form
  const [createForm, setCreateForm] = useState({
    headline: '', body: '', category: 'Music', imageUrl: '', videoUrl: '', isFeatured: false, isBreaking: false
  });

  // Auth
  useEffect(() => {
    const auth = localStorage.getItem('zamvibe_admin');
    if (auth === 'true') setAuthenticated(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('zamvibe_admin', 'true');
      setAuthenticated(true);
      toast.success('Welcome to ZamVibe Admin!');
      fetchPosts();
    } else {
      toast.error('Wrong password!');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('zamvibe_admin');
    setAuthenticated(false);
  };

  // Fetch posts
  const fetchPosts = useCallback(async () => {
    setLoadingPosts(true);
    try {
      const res = await fetch('/api/posts?limit=100');
      const data = await res.json();
      setPosts(data.posts || []);
    } catch {
      toast.error('Failed to load posts');
    }
    setLoadingPosts(false);
  }, []);

  useEffect(() => {
    if (authenticated) fetchPosts();
  }, [authenticated, fetchPosts]);

  // Fetch entertainment news
  const handleFetchNews = async () => {
    setFetching(true);
    setFetchResult(null);
    try {
      const res = await fetch('/api/fetch-news?key=zamvibe-fetch-2025', { method: 'POST' });
      const data = await res.json();
      setFetchResult(data);
      if (data.success) {
        toast.success(`Fetched ${data.stats?.totalFetched || 0} stories, saved ${data.stats?.totalSaved || 0} new!`);
        fetchPosts();
      } else {
        toast.error(data.error || 'Failed to fetch news');
      }
    } catch {
      toast.error('Failed to fetch entertainment news');
    }
    setFetching(false);
  };

  // Delete post
  const handleDeletePost = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    try {
      await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      toast.success('Post deleted');
      fetchPosts();
    } catch {
      toast.error('Failed to delete');
    }
  };

  // Toggle featured
  const handleToggleFeatured = async (post: Post) => {
    try {
      await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...post, isFeatured: !post.isFeatured }),
      });
      toast.success(post.isFeatured ? 'Removed from featured' : 'Added to featured!');
      fetchPosts();
    } catch {
      toast.error('Failed to update');
    }
  };

  // Create post
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.headline.trim()) {
      toast.error('Headline is required');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createForm),
      });
      if (res.ok) {
        toast.success('Post created!');
        setCreateForm({ headline: '', body: '', category: 'Music', imageUrl: '', videoUrl: '', isFeatured: false, isBreaking: false });
        setActiveTab('content');
        fetchPosts();
      }
    } catch {
      toast.error('Failed to create post');
    }
    setLoading(false);
  };

  // Filtered posts
  const filteredPosts = posts.filter(p => {
    if (filterCategory !== 'All' && p.category !== filterCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return p.headline.toLowerCase().includes(q) || p.body.toLowerCase().includes(q);
    }
    return true;
  });

  const categories = ['All', ...new Set(posts.map(p => p.category))];

  // Stats
  const totalViews = posts.reduce((a, p) => a + (p.views || 0), 0);
  const featuredCount = posts.filter(p => p.isFeatured).length;

  // ============ LOGIN SCREEN ============
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to ZamVibe
          </Link>
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">ZamVibe</h1>
            <p className="text-sm text-gray-400 mt-1">Entertainment Admin Panel</p>
          </div>
          <form onSubmit={handleLogin} className="bg-[#141414] rounded-2xl border border-gray-800 p-6 space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-300">Admin Password</Label>
              <div className="relative mt-1.5">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 rounded-xl bg-[#1a1a1a] border-gray-700 text-white"
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full h-11 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-xl font-semibold">
              Sign In
            </Button>
          </form>
        </motion.div>
      </div>
    );
  }

  // ============ ADMIN DASHBOARD ============
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xl font-black bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
              ZAMVIBE
            </Link>
            <span className="text-xs text-gray-500">Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-400 hover:text-white">
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total Posts', value: posts.length, icon: Newspaper, color: 'from-blue-500 to-cyan-500' },
            { label: 'Featured', value: featuredCount, icon: Star, color: 'from-yellow-500 to-orange-500' },
            { label: 'Total Views', value: totalViews.toLocaleString(), icon: TrendingUp, color: 'from-green-500 to-emerald-500' },
            { label: 'Categories', value: categories.length - 1, icon: Flame, color: 'from-purple-500 to-pink-500' },
          ].map(stat => (
            <div key={stat.label} className="bg-[#141414] rounded-xl border border-gray-800 p-4">
              <div className="flex items-center gap-2 mb-1">
                <stat.icon className={`w-4 h-4 bg-gradient-to-r ${stat.color} bg-clip-text`} style={{ color: stat.color.includes('blue') ? '#3b82f6' : stat.color.includes('yellow') ? '#f59e0b' : stat.color.includes('green') ? '#22c55e' : '#a855f7' }} />
                <span className="text-xs text-gray-500">{stat.label}</span>
              </div>
              <div className="text-xl font-bold">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-800 pb-3">
          {[
            { id: 'content' as const, label: 'Content', icon: Newspaper },
            { id: 'fetch' as const, label: 'Fetch News', icon: RefreshCw },
            { id: 'create' as const, label: 'Create Post', icon: Plus },
          ].map(tab => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className={activeTab === tab.id ? 'bg-gradient-to-r from-red-500 to-pink-600' : 'text-gray-400 hover:text-white'}
            >
              <tab.icon className="w-4 h-4 mr-1" /> {tab.label}
            </Button>
          ))}
        </div>

        {/* CONTENT TAB */}
        {activeTab === 'content' && (
          <div>
            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-[#141414] border-gray-700 text-white rounded-xl"
                />
              </div>
              <div className="flex gap-1 overflow-x-auto pb-1">
                {categories.slice(0, 8).map(cat => (
                  <Button
                    key={cat}
                    variant={filterCategory === cat ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterCategory(cat)}
                    className={filterCategory === cat ? 'bg-red-500 text-white' : 'border-gray-700 text-gray-400 hover:text-white text-xs whitespace-nowrap'}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>

            {/* Posts list */}
            {loadingPosts ? (
              <div className="text-center py-12 text-gray-500">Loading posts...</div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Newspaper className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No posts found. Fetch entertainment news to get started!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredPosts.map(post => (
                  <div key={post.id} className="bg-[#141414] rounded-xl border border-gray-800 p-4 flex gap-4">
                    {/* Thumbnail */}
                    <div className="w-20 h-20 rounded-lg bg-gray-800 overflow-hidden flex-shrink-0">
                      {post.imageUrl ? (
                        <img src={post.imageUrl} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><Image className="w-6 h-6 text-gray-600" /></div>
                      )}
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-sm text-white truncate">{post.headline}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">{post.category}</span>
                            {post.isFeatured && <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />}
                            {post.isBreaking && <Flame className="w-3 h-3 text-orange-500" />}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {post.views} views · {post.shares} shares · {new Date(post.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <button
                            onClick={() => handleToggleFeatured(post)}
                            className="p-1.5 rounded-lg hover:bg-gray-700 transition"
                            title={post.isFeatured ? 'Unfeature' : 'Feature'}
                          >
                            <Star className={`w-4 h-4 ${post.isFeatured ? 'text-yellow-500 fill-yellow-500' : 'text-gray-500'}`} />
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* FETCH NEWS TAB */}
        {activeTab === 'fetch' && (
          <div className="max-w-lg mx-auto text-center py-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center mx-auto mb-6">
              <RefreshCw className={`w-10 h-10 text-white ${fetching ? 'animate-spin' : ''}`} />
            </div>
            <h2 className="text-2xl font-bold mb-2">Fetch Entertainment News</h2>
            <p className="text-gray-400 mb-6">
              Pulls the latest entertainment, music, celebrity gossip, and trending stories from 20+ Zambian &amp; African sources.
              Content is automatically filtered and categorized.
            </p>
            <Button
              onClick={handleFetchNews}
              disabled={fetching}
              size="lg"
              className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-xl px-8 h-12 font-semibold"
            >
              {fetching ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Fetching...</> : <><RefreshCw className="w-4 h-4 mr-2" /> Fetch News Now</>}
            </Button>

            {fetchResult && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 bg-[#141414] rounded-xl border border-gray-800 p-4 text-left">
                <h3 className="font-semibold text-sm mb-3">Fetch Results</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-gray-500">Feeds:</span> <span className="text-white">{fetchResult.stats?.feedsProcessed || 0}</span></div>
                  <div><span className="text-gray-500">Fetched:</span> <span className="text-white">{fetchResult.stats?.totalFetched || 0}</span></div>
                  <div><span className="text-green-400">Saved:</span> <span className="text-green-400 font-bold">{fetchResult.stats?.totalSaved || 0}</span></div>
                  <div><span className="text-gray-500">Skipped:</span> <span className="text-white">{fetchResult.stats?.totalSkipped || 0}</span></div>
                  <div><span className="text-gray-500">Time:</span> <span className="text-white">{fetchResult.stats?.elapsedSeconds || 0}s</span></div>
                  <div><span className="text-gray-500">Errors:</span> <span className="text-white">{fetchResult.stats?.errors || 0}</span></div>
                </div>
                {fetchResult.errors && fetchResult.errors.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-800">
                    <p className="text-xs text-gray-500 mb-1">Errors:</p>
                    {fetchResult.errors.map((err: string, i: number) => (
                      <p key={i} className="text-xs text-red-400">· {err}</p>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            <div className="mt-8 text-left">
              <h3 className="font-semibold text-sm mb-3 text-gray-400">Sources (20+ feeds)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-500">
                {["Kalemba (Gossip)", "Zed Corner (Music)", "Mwebantu (Viral)", "Tumfweko (News)", "Zambia Reports", "Daily Mail", "Zambian Observer", "Lusaka Times", "OkayAfrica (Music)", "Pulse Live Kenya", "Citizen TV Kenya", "Briefly News SA", "ZAlebs (Celebrity)", "SA Hip Hop Mag", "GhanaWeb", "Nigeria Ent. Today", "BellaNaija", "Billboard", "Complex", "Rolling Stone"].map(s => (
                  <div key={s} className="flex items-center gap-1.5 bg-[#141414] rounded-lg px-3 py-2">
                    <Newspaper className="w-3 h-3 text-red-400" /> {s}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CREATE POST TAB */}
        {activeTab === 'create' && (
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-300">Headline *</Label>
                <Input
                  value={createForm.headline}
                  onChange={(e) => setCreateForm(f => ({ ...f, headline: e.target.value }))}
                  placeholder="Enter headline..."
                  className="mt-1.5 bg-[#141414] border-gray-700 text-white rounded-xl"
                  required
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-300">Body</Label>
                <textarea
                  value={createForm.body}
                  onChange={(e) => setCreateForm(f => ({ ...f, body: e.target.value }))}
                  placeholder="Enter story body..."
                  rows={5}
                  className="w-full mt-1.5 bg-[#141414] border border-gray-700 text-white rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-300">Category</Label>
                  <select
                    value={createForm.category}
                    onChange={(e) => setCreateForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full mt-1.5 bg-[#141414] border border-gray-700 text-white rounded-xl px-3 py-2 text-sm"
                  >
                    {['Music', 'Celebrity', 'Gossip', 'Viral', 'Movies & TV', 'Comedy', 'Fashion', 'Lifestyle'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-300">Image URL</Label>
                  <Input
                    value={createForm.imageUrl}
                    onChange={(e) => setCreateForm(f => ({ ...f, imageUrl: e.target.value }))}
                    placeholder="https://..."
                    className="mt-1.5 bg-[#141414] border-gray-700 text-white rounded-xl"
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-300">Video URL (optional)</Label>
                <Input
                  value={createForm.videoUrl}
                  onChange={(e) => setCreateForm(f => ({ ...f, videoUrl: e.target.value }))}
                  placeholder="https://youtube.com/watch?v=..."
                  className="mt-1.5 bg-[#141414] border-gray-700 text-white rounded-xl"
                />
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={createForm.isFeatured}
                    onChange={(e) => setCreateForm(f => ({ ...f, isFeatured: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-300">Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={createForm.isBreaking}
                    onChange={(e) => setCreateForm(f => ({ ...f, isBreaking: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-300">Breaking</span>
                </label>
              </div>
              <Button type="submit" disabled={loading} className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-xl px-6 h-11 font-semibold">
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                Create Post
              </Button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
