'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  MapPin,
  Search,
  Star,
  ChevronRight,
  Navigation,
  Loader2,
  Shield,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import LodgeCard from '@/components/lodge-card';

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

const FALLBACK_LODGES: Lodge[] = [
  {
    id: 'fb-1',
    name: 'Victoria Falls Retreat',
    location: 'Livingstone',
    price: 780,
    priceUnit: 'night',
    rating: 4.8,
    gradient: 'from-emerald-400 to-teal-500',
    availability: 'LIKELY_AVAILABLE',
    distance: null,
  },
  {
    id: 'fb-2',
    name: 'Lusaka Premier Lodge',
    location: 'Lusaka',
    price: 950,
    priceUnit: 'night',
    rating: 4.9,
    gradient: 'from-amber-500 to-red-500',
    availability: 'CHECK',
    distance: null,
  },
  {
    id: 'fb-3',
    name: 'Lake Kariba Inn',
    location: 'Siavonga',
    price: 520,
    priceUnit: 'night',
    rating: 4.6,
    gradient: 'from-cyan-400 to-blue-600',
    availability: 'LIKELY_AVAILABLE',
    distance: null,
  },
];

export default function HomePage() {
  const [featuredLodges, setFeaturedLodges] = useState<Lodge[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [detectingLocation, setDetectingLocation] = useState(false);

  useEffect(() => {
    fetchFeaturedLodges();
  }, [userLocation]);

  const fetchFeaturedLodges = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('sort', 'rating');
      if (userLocation) {
        params.set('lat', userLocation.lat.toString());
        params.set('lng', userLocation.lng.toString());
      }
      const res = await fetch(`/api/lodges?${params.toString()}`);
      const data = await res.json();
      if (data.lodges && data.lodges.length > 0) {
        setFeaturedLodges(data.lodges.slice(0, 6));
      } else {
        setFeaturedLodges(FALLBACK_LODGES);
      }
    } catch {
      setFeaturedLodges(FALLBACK_LODGES);
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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white min-h-[480px] sm:min-h-[520px]">
        {/* Animated floating shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-12 right-8 w-32 h-32 rounded-full bg-purple-500/10 animate-float" />
          <div className="absolute top-32 left-4 w-20 h-20 rounded-full bg-amber-500/10 animate-float-delay" />
          <div className="absolute bottom-20 right-16 w-48 h-48 rounded-full bg-purple-400/5 animate-float-slow" />
          <div className="absolute top-1/2 left-1/3 w-16 h-16 rounded-full bg-white/5 animate-float-delay" />
          <div className="absolute bottom-32 left-8 w-24 h-24 rounded-full bg-purple-600/8 animate-float" />
          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
        </div>

        <div className="relative max-w-2xl mx-auto px-4 pt-14 pb-16 sm:pt-20 sm:pb-20">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2.5 mb-10"
          >
            <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-amber-400" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">StayNow</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4"
          >
            Find a place to stay —{' '}
            <span className="gradient-text">without the stress</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/60 text-lg sm:text-xl mb-10 leading-relaxed max-w-md"
          >
            Real lodges. Real availability. Confirm in minutes.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col gap-3 max-w-sm"
          >
            <Link href="/lodges">
              <Button
                size="lg"
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-2xl h-14 text-base font-semibold shadow-lg shadow-amber-500/25 transition-all hover:shadow-xl hover:shadow-amber-500/30"
              >
                <Navigation className="w-5 h-5 mr-2" />
                Find a place near me
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="lg"
              onClick={detectLocation}
              disabled={detectingLocation}
              className="w-full text-white/70 hover:text-white hover:bg-white/10 rounded-2xl h-12 font-medium"
            >
              {detectingLocation ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <MapPin className="w-4 h-4 mr-2" />
              )}
              {detectingLocation
                ? 'Detecting location...'
                : userLocation
                ? 'Location detected'
                : 'Use my location'}
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="max-w-2xl mx-auto px-4 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">How it works</h2>
          <p className="text-slate-500 mb-8">Three simple steps to your next stay.</p>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            {[
              {
                icon: <Search className="w-6 h-6" />,
                label: 'Find',
                desc: 'Browse verified lodges near you with real-time availability',
                color: 'bg-amber-50 text-amber-600',
              },
              {
                icon: <Clock className="w-6 h-6" />,
                label: 'Request',
                desc: 'Tap reserve — no payment needed, just your name and number',
                color: 'bg-purple-50 text-purple-600',
              },
              {
                icon: <CheckCircle2 className="w-6 h-6" />,
                label: 'Confirm',
                desc: 'Get approved in minutes. Show up, check in, relax.',
                color: 'bg-green-50 text-green-600',
              },
            ].map((step, i) => (
              <motion.div key={i} variants={item}>
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow rounded-2xl p-5 sm:p-6 text-center">
                  <div className={`w-12 h-12 rounded-2xl ${step.color} flex items-center justify-center mx-auto mb-4`}>
                    {step.icon}
                  </div>
                  <div className="font-bold text-slate-900 text-lg mb-1">{step.label}</div>
                  <div className="text-sm text-slate-500 leading-relaxed">{step.desc}</div>
                  {i < 2 && (
                    <div className="hidden sm:flex justify-end mt-2 -mb-12 mr-[-24px] relative z-10">
                      <ChevronRight className="w-5 h-5 text-slate-300" />
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ===== FEATURED LODGES ===== */}
      <section className="max-w-2xl mx-auto px-4 pb-12">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">Featured Lodges</h2>
              <p className="text-slate-500 text-sm">Top-rated stays across Zambia</p>
            </div>
            <Link
              href="/lodges"
              className="text-amber-600 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all shrink-0 ml-4"
            >
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-44 rounded-2xl w-full" />
                  <Skeleton className="h-4 w-3/4 rounded-lg" />
                  <Skeleton className="h-3 w-1/2 rounded-lg" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredLodges.map((lodge, i) => (
                <LodgeCard
                  key={lodge.id}
                  lodge={{
                    ...lodge,
                    imageSlug: lodge.id.includes('fb-') ? undefined : lodge.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                  }}
                  index={i}
                />
              ))}
            </div>
          )}
        </motion.div>
      </section>

      {/* ===== TRUST BAR ===== */}
      <section className="border-t border-gray-100 mt-auto">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-500" />
              <span>Verified locations</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-500" />
              <span>Instant confirmation</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-500" />
              <span>45-min reservations</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50/50">
        <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-semibold text-slate-700">StayNow</span>
            <span className="text-xs text-slate-400">Zambia</span>
          </div>
          <Link
            href="/admin"
            className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            Admin Dashboard
          </Link>
        </div>
      </footer>
    </div>
  );
}
