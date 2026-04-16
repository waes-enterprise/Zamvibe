'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Star, Phone, Navigation } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface LodgeCardProps {
  lodge: {
    id: string;
    name: string;
    location: string;
    price: number;
    priceUnit: string;
    rating: number;
    availability: string;
    distance: number | null;
    gradient: string;
    imageSlug?: string;
  };
  index?: number;
  variant?: 'default' | 'featured' | 'compact';
}

const AVAILABILITY_CONFIG: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; className: string }> = {
  LIKELY_AVAILABLE: {
    label: 'Available tonight',
    variant: 'default',
    className: 'bg-green-500/90 text-white border-green-400',
  },
  CHECK: {
    label: 'Filling fast',
    variant: 'secondary',
    className: 'bg-amber-500/90 text-white border-amber-400',
  },
  LIKELY_FULL: {
    label: '2 rooms left',
    variant: 'destructive',
    className: 'bg-red-500/90 text-white border-red-400',
  },
};

export default function LodgeCard({ lodge, index = 0, variant = 'default' }: LodgeCardProps) {
  const [imgError, setImgError] = useState(false);
  const availConfig = AVAILABILITY_CONFIG[lodge.availability] || AVAILABILITY_CONFIG.CHECK;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < Math.round(rating)
            ? 'fill-amber-400 text-amber-400'
            : 'fill-white/30 text-white/30'
        }`}
      />
    ));
  };

  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: index * 0.06 }}
      >
        <Link href={`/lodges/${lodge.id}`}>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden card-hover">
            <div className="flex">
              {/* Image */}
              <div className="w-28 h-28 sm:w-36 sm:h-36 flex-shrink-0 relative overflow-hidden">
                {!imgError && lodge.imageSlug ? (
                  <img
                    src={`/lodges/${lodge.imageSlug}.jpg`}
                    alt={lodge.name}
                    className="w-full h-full object-cover"
                    onError={() => setImgError(true)}
                    loading="lazy"
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${lodge.gradient}`} />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <span className={`absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${availConfig.className} backdrop-blur-sm`}>
                  {availConfig.label}
                </span>
              </div>

              {/* Content */}
              <div className="p-3 sm:p-4 flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm sm:text-[15px] truncate leading-tight">
                    {lodge.name}
                  </h3>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                    <span className="text-xs text-slate-500 truncate">{lodge.location}</span>
                    {lodge.distance != null && lodge.distance > 0 && (
                      <Badge variant="outline" className="ml-auto text-[10px] h-4 px-1.5 text-slate-400 border-slate-200 shrink-0">
                        {lodge.distance.toFixed(0)} km
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1">
                    {renderStars(lodge.rating)}
                    <span className="text-xs text-slate-400 ml-1">{lodge.rating}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-amber-600 text-base">K{lodge.price.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-400">/{lodge.priceUnit}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group"
    >
      <Link href={`/lodges/${lodge.id}`} className="block">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden card-hover relative">
          {/* Image */}
          <div className="h-44 sm:h-48 relative overflow-hidden">
            {!imgError && lodge.imageSlug ? (
              <img
                src={`/lodges/${lodge.imageSlug}.jpg`}
                alt={lodge.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={() => setImgError(true)}
                loading="lazy"
              />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${lodge.gradient} transition-transform duration-500 group-hover:scale-105`} />
            )}

            {/* Gradient overlay at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

            {/* Availability badge */}
            <span className={`absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-1 rounded-full ${availConfig.className} backdrop-blur-sm`}>
              {availConfig.label}
            </span>

            {/* Distance badge */}
            {lodge.distance != null && lodge.distance > 0 && (
              <span className="absolute top-3 right-3 text-[11px] font-medium px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-slate-700 flex items-center gap-1">
                <Navigation className="w-3 h-3" />
                {lodge.distance.toFixed(0)} km
              </span>
            )}

            {/* Price overlay at bottom */}
            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
              <div>
                <h3 className="font-bold text-white text-base drop-shadow-lg truncate">
                  {lodge.name}
                </h3>
                <div className="flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-white/70" />
                  <span className="text-xs text-white/80">{lodge.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {renderStars(lodge.rating)}
                <span className="text-sm font-medium text-slate-500 ml-1">{lodge.rating}</span>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold text-slate-900">K{lodge.price.toLocaleString()}</span>
                <span className="text-xs text-slate-400 ml-0.5">/{lodge.priceUnit}</span>
              </div>
            </div>

            {/* Call lodge button */}
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-3 rounded-xl text-xs font-medium border-gray-200 text-slate-600 hover:bg-green-50 hover:text-green-700 hover:border-green-200 transition-all"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <Phone className="w-3.5 h-3.5 mr-1.5" />
              Call lodge
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
