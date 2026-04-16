'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Search, Star, ChevronRight, ArrowRight, Loader2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Lodge {
  id: string;
  name: string;
  location: string;
  price: number;
  priceUnit: string;
  rating: number;
  gradient: string;
  availability: string;
  distance: number | null;
}

const AMENITY_ICONS: Record<string, string> = {
  WiFi: '📶',
  Parking: '🅿️',
  Pool: '🏊',
  Restaurant: '🍽️',
  AC: '❄️',
  Bar: '🍸',
};

export default function HomePage() {
  const [featuredLodges, setFeaturedLodges] = useState<Lodge[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [detectingLocation, setDetectingLocation] = useState(false);

  useEffect(() => {
    fetchFeaturedLodges();
  }, [userLocation]);

  const fetchFeaturedLodges = async () => {
    try {
      const params = new URLSearchParams();
      params.set('sort', 'rating');
      if (userLocation) {
        params.set('lat', userLocation.lat.toString());
        params.set('lng', userLocation.lng.toString());
      }
      const res = await fetch(`/api/lodges?${params.toString()}`);
      const data = await res.json();
      setFeaturedLodges(data.lodges.slice(0, 3));
    } catch {
      // Silent fail
    } finally {
      setLoading(false);
    }
  };

  const detectLocation = () => {
    setDetectingLocation(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setDetectingLocation(false);
        },
        () => {
          setDetectingLocation(false);
        },
        { timeout: 10000 }
      );
    } else {
      setDetectingLocation(false);
    }
  };

  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case 'LIKELY_AVAILABLE':
        return { label: 'Available', color: 'bg-green-100 text-green-700' };
      case 'CHECK':
        return { label: 'Check', color: 'bg-blue-100 text-blue-700' };
      case 'LIKELY_FULL':
        return { label: 'Full', color: 'bg-red-100 text-red-700' };
      default:
        return { label: 'Check', color: 'bg-blue-100 text-blue-700' };
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3.5 h-3.5 ${
          i < Math.round(rating)
            ? 'fill-amber-400 text-amber-400'
            : 'fill-gray-200 text-gray-200'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-white">
        {/* Decorative circles */}
        <div className="absolute top-[-40px] right-[-40px] w-64 h-64 rounded-full bg-white/10" />
        <div className="absolute bottom-[-60px] left-[-30px] w-80 h-80 rounded-full bg-white/5" />
        <div className="absolute top-1/2 right-1/4 w-32 h-32 rounded-full bg-white/10" />

        <div className="relative max-w-lg mx-auto px-4 pt-16 pb-20">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 mb-8"
          >
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">StayNow</span>
          </motion.div>

          {/* Tagline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-bold leading-tight mb-4"
          >
            Find a place to stay,{' '}
            <span className="text-amber-100">right now</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white/80 text-lg mb-8 leading-relaxed"
          >
            Browse nearby lodges across Zambia. Request a reservation and get confirmed in minutes.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col gap-3"
          >
            <Link href="/lodges">
              <Button
                size="lg"
                className="w-full bg-white text-amber-600 hover:bg-amber-50 rounded-xl h-14 text-base font-semibold shadow-lg shadow-black/10 transition-all hover:shadow-xl"
              >
                <Search className="w-5 h-5 mr-2" />
                Find a Place to Stay
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="lg"
              onClick={detectLocation}
              disabled={detectingLocation}
              className="w-full text-white/90 hover:text-white hover:bg-white/10 rounded-xl h-12"
            >
              {detectingLocation ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <MapPin className="w-4 h-4 mr-2" />
              )}
              {detectingLocation
                ? 'Detecting location...'
                : userLocation
                ? '📍 Location detected'
                : 'Use my location'}
            </Button>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-lg mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-bold text-slate-900 mb-6">How it works</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: '🔍', label: 'Find', desc: 'Browse lodges' },
              { icon: '📱', label: 'Request', desc: 'Book instantly' },
              { icon: '✅', label: 'Confirm', desc: 'Get approved' },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="text-center p-3"
              >
                <div className="text-3xl mb-2">{step.icon}</div>
                <div className="font-semibold text-sm text-slate-900">{step.label}</div>
                <div className="text-xs text-slate-500 mt-1">{step.desc}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Featured Lodges */}
      <section className="max-w-lg mx-auto px-4 pb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-slate-900">Featured Lodges</h2>
          <Link href="/lodges" className="text-amber-600 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-shimmer rounded-2xl h-40" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {featuredLodges.map((lodge, i) => {
              const badge = getAvailabilityBadge(lodge.availability);
              return (
                <motion.div
                  key={lodge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <Link href={`/lodges/${lodge.id}`}>
                    <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl">
                      <div className="flex">
                        {/* Image placeholder */}
                        <div className={`w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br ${lodge.gradient} flex-shrink-0 flex items-center justify-center relative`}>
                          <MapPin className="w-8 h-8 text-white/60" />
                          <span className={`absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${badge.color}`}>
                            {badge.label}
                          </span>
                        </div>
                        {/* Content */}
                        <CardContent className="p-4 flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-900 text-sm sm:text-base truncate">
                            {lodge.name}
                          </h3>
                          <div className="flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span className="text-xs text-slate-500 truncate">{lodge.location}</span>
                            {lodge.distance && (
                              <span className="text-[10px] text-slate-400 ml-1">
                                {lodge.distance.toFixed(0)} km
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 mt-2">
                            {renderStars(lodge.rating)}
                            <span className="text-xs text-slate-400 ml-1">{lodge.rating}</span>
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <div>
                              <span className="font-bold text-amber-600">K{lodge.price.toLocaleString()}</span>
                              <span className="text-xs text-slate-400">/{lodge.priceUnit}</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-300" />
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* Admin Link */}
      <section className="max-w-lg mx-auto px-4 pb-10">
        <div className="border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
              <Shield className="w-4 h-4 text-slate-500" />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-700">Admin Dashboard</div>
              <div className="text-xs text-slate-400">Manage reservations</div>
            </div>
          </div>
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-700">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
