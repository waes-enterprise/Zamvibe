'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  MapPin,
  Star,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  activeReservations?: number;
}

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'near', label: 'Near me' },
  { key: 'top', label: 'Top Rated' },
  { key: 'budget', label: 'Budget' },
];

const SORT_OPTIONS = [
  { key: 'rating', label: 'Top Rated' },
  { key: 'nearest', label: 'Nearest' },
  { key: 'price_asc', label: 'Price Low→High' },
  { key: 'price_desc', label: 'Price High→Low' },
];

export default function LodgesPage() {
  const searchParams = useSearchParams();
  const [lodges, setLodges] = useState<Lodge[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [showSortMenu, setShowSortMenu] = useState(false);

  useEffect(() => {
    fetchLodges();
  }, []);

  const fetchLodges = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/lodges?sort=rating');
      const data = await res.json();
      if (data.lodges) {
        setLodges(data.lodges);
      }
    } catch (error) {
      console.error('Failed to fetch lodges:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLodges = useMemo(() => {
    let result = [...lodges];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.location.toLowerCase().includes(q) ||
          l.address.toLowerCase().includes(q) ||
          l.amenities?.some((a) => a.toLowerCase().includes(q))
      );
    }

    // Category filters
    switch (activeFilter) {
      case 'near':
        result = result.filter((l) => l.distance !== null).sort((a, b) => (a.distance ?? 9999) - (b.distance ?? 9999));
        break;
      case 'top':
        result = result.filter((l) => l.rating >= 4.5);
        break;
      case 'budget':
        result = result.filter((l) => l.price <= 400);
        break;
    }

    // Sort
    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'nearest':
        result.sort((a, b) => (a.distance ?? 9999) - (b.distance ?? 9999));
        break;
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
    }

    return result;
  }, [lodges, searchQuery, activeFilter, sortBy]);

  const currentSortLabel = SORT_OPTIONS.find((s) => s.key === sortBy)?.label || 'Sort';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="shrink-0 rounded-xl cursor-pointer">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-slate-900">Lodges</h1>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by name, location, or amenity..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-xl h-11 bg-gray-50 border-0 focus-visible:ring-1"
            />
          </div>

          {/* Filters and Sort */}
          <div className="flex items-center justify-between mt-3 gap-3">
            <div className="flex gap-2 overflow-x-auto no-scrollbar flex-1">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setActiveFilter(f.key)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                    activeFilter === f.key
                      ? 'bg-slate-900 text-white'
                      : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Sort dropdown */}
            <div className="relative shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="rounded-xl gap-1.5 h-9 text-xs font-medium cursor-pointer"
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
                {currentSortLabel}
              </Button>

              {showSortMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowSortMenu(false)} />
                  <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 min-w-[160px] animate-scale-in">
                    {SORT_OPTIONS.map((s) => (
                      <button
                        key={s.key}
                        onClick={() => {
                          setSortBy(s.key);
                          setShowSortMenu(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                          sortBy === s.key
                            ? 'bg-amber-50 text-amber-700 font-medium'
                            : 'text-slate-700 hover:bg-gray-50'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Results */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Loading state */}
        {loading ? (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse-soft" />
              <span className="text-sm text-slate-500">Checking availability...</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-44 rounded-2xl w-full" />
                  <Skeleton className="h-4 w-3/4 rounded-lg" />
                  <Skeleton className="h-3 w-1/2 rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        ) : filteredLodges.length === 0 ? (
          /* Empty state */
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-7 h-7 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No lodges found</h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto">
              We&apos;re expanding in this area 👀 Try nearby towns or check back soon.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('all');
              }}
              className="mt-4 rounded-xl cursor-pointer"
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <>
            {/* Results count */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm font-medium text-slate-700">
                {filteredLodges.length} lodge{filteredLodges.length !== 1 ? 's' : ''} found
              </span>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLodges.map((lodge, i) => (
                <LodgeCard
                  key={lodge.id}
                  lodge={{
                    ...lodge,
                    imageSlug: lodge.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                    activeReservations: lodge.activeReservations,
                  }}
                  index={i}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
