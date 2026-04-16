'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, MapPin, Star, SlidersHorizontal, X, Loader2, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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

type SortOption = 'rating' | 'nearest' | 'price_asc' | 'price_desc';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'rating', label: 'Top Rated' },
  { value: 'nearest', label: 'Nearest' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
];

export default function LodgesPage() {
  const [lodges, setLodges] = useState<Lodge[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('rating');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

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
    } catch {
      // Silent fail
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [sort, search, userLocation]);

  useEffect(() => {
    fetchLodges();
  }, [fetchLodges]);

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

  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case 'LIKELY_AVAILABLE':
        return { label: 'Available', color: 'bg-green-100 text-green-700', dot: 'bg-green-500' };
      case 'CHECK':
        return { label: 'Check', color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' };
      case 'LIKELY_FULL':
        return { label: 'Full', color: 'bg-red-100 text-red-700', dot: 'bg-red-500' };
      default:
        return { label: 'Check', color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' };
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'
        }`}
      />
    ));
  };

  const handleRefresh = () => {
    fetchLodges(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-gray-100">
              <ArrowLeft className="w-5 h-5 text-slate-700" />
            </Button>
          </Link>
          <h1 className="text-lg font-bold text-slate-900 flex-1">Nearby Lodges</h1>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-xl hover:bg-gray-100"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <Loader2 className={`w-4 h-4 text-slate-500 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {/* Search bar */}
        <div className="max-w-lg mx-auto px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search by name or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-10 h-11 rounded-xl border-gray-200 bg-gray-50 focus:bg-white text-sm"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Sort bar */}
      <div className="max-w-lg mx-auto px-4 pt-3 pb-2 flex items-center gap-2">
        <div className="relative flex-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSortMenu(!showSortMenu)}
            className="w-full justify-between h-9 rounded-xl border-gray-200 text-sm text-slate-600"
          >
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              {SORT_OPTIONS.find((o) => o.value === sort)?.label}
            </div>
          </Button>

          {showSortMenu && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-gray-200 shadow-lg z-50 overflow-hidden">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSort(option.value);
                    setShowSortMenu(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                    sort === option.value ? 'text-amber-600 font-medium bg-amber-50' : 'text-slate-600'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="text-xs text-slate-400">
          {lodges.length} lodge{lodges.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Lodge list */}
      <div className="max-w-lg mx-auto px-4 pb-24">
        {loading ? (
          <div className="space-y-4 pt-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-shimmer rounded-2xl h-44" />
            ))}
          </div>
        ) : lodges.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center pt-16"
          >
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Home className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">No lodges found</h3>
            <p className="text-sm text-slate-500">Try a different search or location</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearch('')}
              className="mt-4 rounded-xl"
            >
              Clear search
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-4 pt-2">
            {lodges.map((lodge, i) => {
              const badge = getAvailabilityBadge(lodge.availability);
              return (
                <motion.div
                  key={lodge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <Link href={`/lodges/${lodge.id}`}>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300">
                      {/* Image */}
                      <div className={`h-40 bg-gradient-to-br ${lodge.gradient} relative flex items-center justify-center`}>
                        <MapPin className="w-12 h-12 text-white/30" />
                        <span className={`absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-1 rounded-full ${badge.color} flex items-center gap-1.5`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                          {badge.label}
                        </span>
                        {lodge.distance && (
                          <span className="absolute top-3 right-3 text-[11px] font-medium px-2.5 py-1 rounded-full bg-white/90 text-slate-700">
                            {lodge.distance.toFixed(0)} km
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="font-semibold text-slate-900 text-[15px] truncate">
                              {lodge.name}
                            </h3>
                            <div className="flex items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                              <span className="text-xs text-slate-500 truncate">{lodge.location}</span>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="font-bold text-amber-600">K{lodge.price.toLocaleString()}</div>
                            <div className="text-[10px] text-slate-400">/{lodge.priceUnit}</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-1">
                            {renderStars(lodge.rating)}
                            <span className="text-xs text-slate-400 ml-1">{lodge.rating}</span>
                          </div>
                          {lodge.amenities && lodge.amenities.length > 0 && (
                            <div className="flex gap-1">
                              {lodge.amenities.slice(0, 3).map((a) => (
                                <span key={a} className="text-[10px] text-slate-400 bg-gray-100 px-1.5 py-0.5 rounded">
                                  {a}
                                </span>
                              ))}
                            {lodge.amenities.length > 3 && (
                              <span className="text-[10px] text-slate-400">+{lodge.amenities.length - 3}</span>
                            )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Click outside to close sort menu */}
      {showSortMenu && (
        <div className="fixed inset-0 z-30" onClick={() => setShowSortMenu(false)} />
      )}
    </div>
  );
}
