'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Search,
  MapPin,
  SlidersHorizontal,
  X,
  Loader2,
  Home,
  Navigation,
  Star,
  DollarSign,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import LodgeCard from '@/components/lodge-card';

interface Lodge {
  id: string;
  name: string;
  description: string;
  location: string;
  address: string;
  phone: string;
  price: number;
  priceUnit: string;
  rating: number;
  gradient: string;
  availability: string;
  distance: number | null;
  amenities: string[];
}

type FilterPill = 'all' | 'near' | 'top' | 'budget';
type SortOption = 'rating' | 'nearest' | 'price_asc' | 'price_desc';

const FILTER_PILLS: { key: FilterPill; label: string; icon: React.ReactNode }[] = [
  { key: 'all', label: 'All', icon: <Home className="w-3.5 h-3.5" /> },
  { key: 'near', label: 'Near me', icon: <Navigation className="w-3.5 h-3.5" /> },
  { key: 'top', label: 'Top Rated', icon: <Star className="w-3.5 h-3.5" /> },
  { key: 'budget', label: 'Budget', icon: <DollarSign className="w-3.5 h-3.5" /> },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'rating', label: 'Top Rated' },
  { value: 'nearest', label: 'Nearest' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
];

function getImageSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');
}

export default function LodgesPage() {
  const [lodges, setLodges] = useState<Lodge[]>([]);
  const [displayLodges, setDisplayLodges] = useState<Lodge[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('rating');
  const [activeFilter, setActiveFilter] = useState<FilterPill>('all');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchLodges = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const params = new URLSearchParams();
      params.set('sort', sort);
      if (search) params.set('search', search);
      if (userLocation) {
        params.set('lat', userLocation.lat.toString());
        params.set('lng', userLocation.lng.toString());
      }

      const res = await fetch(`/api/lodges?${params.toString()}`);
      const data = await res.json();
      setLodges(data.lodges || []);
      setHasSearched(true);
    } catch {
      setLodges([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [sort, search, userLocation]);

  useEffect(() => {
    fetchLodges();
  }, [fetchLodges]);

  // Apply filters
  useEffect(() => {
    let filtered = [...lodges];

    switch (activeFilter) {
      case 'near':
        filtered = filtered.filter((l) => l.distance != null && l.distance < 50);
        break;
      case 'top':
        filtered = filtered.filter((l) => l.rating >= 4.5);
        break;
      case 'budget':
        filtered = filtered.filter((l) => l.price <= 400);
        break;
    }

    setDisplayLodges(filtered);
  }, [lodges, activeFilter]);

  const detectLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {},
        { timeout: 10000 }
      );
    }
  };

  useEffect(() => {
    detectLocation();
  }, []);

  const handleRefresh = () => {
    fetchLodges(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-xl hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5 text-slate-700" />
            </Button>
          </Link>
          <h1 className="text-lg font-bold text-slate-900 flex-1">Lodges</h1>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-xl hover:bg-gray-100"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <Loader2
              className={`w-4 h-4 text-slate-500 ${refreshing ? 'animate-spin' : ''}`}
            />
          </Button>
        </div>

        {/* Search bar */}
        <div className="max-w-4xl mx-auto px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by name or location..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                if (!e.target.value) setHasSearched(false);
              }}
              className="pl-10 pr-10 h-11 rounded-xl border-gray-200 bg-gray-50/80 focus:bg-white text-sm"
            />
            {search && (
              <button
                onClick={() => {
                  setSearch('');
                  setHasSearched(false);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
              </button>
            )}
          </div>
        </div>

        {/* Filter pills & sort */}
        <div className="max-w-4xl mx-auto px-4 pb-3 flex items-center gap-2 overflow-x-auto">
          {FILTER_PILLS.map((pill) => (
            <button
              key={pill.key}
              onClick={() => setActiveFilter(pill.key)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeFilter === pill.key
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-gray-100 text-slate-500 hover:bg-gray-200'
              }`}
            >
              {pill.icon}
              {pill.label}
            </button>
          ))}

          <div className="ml-auto relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="h-8 rounded-lg border-gray-200 text-xs text-slate-500"
            >
              <SlidersHorizontal className="w-3 h-3 mr-1" />
              {SORT_OPTIONS.find((o) => o.value === sort)?.label}
            </Button>

            <AnimatePresence>
              {showSortMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute top-full right-0 mt-1 bg-white rounded-xl border border-gray-200 shadow-lg z-50 overflow-hidden min-w-[160px]"
                >
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSort(option.value);
                        setShowSortMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                        sort === option.value
                          ? 'text-amber-600 font-medium bg-amber-50'
                          : 'text-slate-600'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Results count */}
      {!loading && displayLodges.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 pt-4 pb-2">
          <p className="text-sm text-slate-400">
            <span className="font-semibold text-slate-600">{displayLodges.length}</span>{' '}
            lodge{displayLodges.length !== 1 ? 's' : ''} found
            {userLocation && (
              <span className="ml-1">near you</span>
            )}
          </p>
        </div>
      )}

      {/* Lodge grid */}
      <div className="max-w-4xl mx-auto px-4 pb-24">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 rounded-2xl w-full" />
                <Skeleton className="h-4 w-3/4 rounded-lg" />
                <Skeleton className="h-3 w-1/2 rounded-lg" />
              </div>
            ))}
          </div>
        ) : hasSearched && displayLodges.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center pt-20"
          >
            <div className="w-20 h-20 rounded-3xl bg-gray-100 flex items-center justify-center mx-auto mb-5">
              <Home className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              No lodges found
            </h3>
            <p className="text-sm text-slate-500 max-w-xs mx-auto mb-6 leading-relaxed">
              {search
                ? `No results for "${search}". Try a different search term.`
                : "We're still adding places. Try nearby areas or check back soon."}
            </p>
            <div className="flex items-center justify-center gap-3">
              {search && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearch('');
                    setHasSearched(false);
                  }}
                  className="rounded-xl"
                >
                  Clear search
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveFilter('all')}
                className="rounded-xl"
              >
                Show all lodges
              </Button>
            </div>

            {/* Friendly illustration area */}
            <div className="mt-10 max-w-sm mx-auto">
              <div className="flex items-center justify-center gap-4 opacity-40">
                <MapPin className="w-8 h-8 text-slate-300" />
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-xs text-slate-400">Zambia</span>
                <div className="h-px flex-1 bg-slate-200" />
                <MapPin className="w-8 h-8 text-slate-300" />
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {displayLodges.map((lodge, i) => (
              <LodgeCard
                key={lodge.id}
                lodge={{
                  ...lodge,
                  imageSlug: getImageSlug(lodge.name),
                }}
                index={i}
              />
            ))}
          </div>
        )}
      </div>

      {/* Click outside to close sort menu */}
      {showSortMenu && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowSortMenu(false)}
        />
      )}
    </div>
  );
}
