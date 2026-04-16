'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Star, Phone, Navigation } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface LodgeCardProps {
  lodge: {
    id: string;
    name: string;
    description?: string;
    location: string;
    address?: string;
    phone?: string;
    price: number;
    priceUnit: string;
    rating: number;
    gradient: string;
    availability: string;
    distance: number | null;
    amenities?: string[];
    imageSlug?: string;
  };
  index?: number;
}

function getAvailabilityBadge(availability: string, activeReservations?: number) {
  switch (availability) {
    case 'LIKELY_AVAILABLE':
      return { label: 'Available tonight', className: 'bg-green-500 text-white border-0' };
    case 'CHECK':
      return { label: 'Filling fast', className: 'bg-amber-500 text-white border-0' };
    case 'LIKELY_FULL':
      return { label: `Only ${activeReservations || 2} rooms left`, className: 'bg-red-500 text-white border-0' };
    default:
      return { label: 'Check availability', className: 'bg-slate-500 text-white border-0' };
  }
}

function getDistanceLabel(distance: number | null): string | null {
  if (distance === null) return null;
  if (distance < 1) return `${Math.round(distance * 1000)}m away`;
  return `${distance.toFixed(1)} km away`;
}

export default function LodgeCard({ lodge, index = 0 }: LodgeCardProps) {
  const [imgError, setImgError] = useState(false);
  const imageSrc = lodge.imageSlug ? `/lodges/${lodge.imageSlug}.jpg` : null;
  const availabilityBadge = getAvailabilityBadge(lodge.availability);
  const distanceLabel = getDistanceLabel(lodge.distance);

  return (
    <Link href={`/lodges/${lodge.id}`} className="block">
      <div
        className="card-hover rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm"
        style={{ animationDelay: `${index * 0.08}s` }}
      >
        {/* Image area with gradient fallback */}
        <div className="relative h-44 w-full overflow-hidden">
          {imageSrc && !imgError ? (
            <Image
              src={imageSrc}
              alt={lodge.name}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className={`absolute inset-0 bg-gradient-to-br ${lodge.gradient}`} />
          )}

          {/* Gradient overlay at bottom of image */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Availability badge */}
          <div className="absolute top-3 left-3">
            <Badge className={availabilityBadge.className} style={{ fontSize: '11px' }}>
              {availabilityBadge.label}
            </Badge>
          </div>

          {/* Distance badge */}
          {distanceLabel && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-white/90 text-slate-700 border-0 backdrop-blur-sm" style={{ fontSize: '11px' }}>
                <Navigation className="w-3 h-3 mr-1" />
                {distanceLabel}
              </Badge>
            </div>
          )}

          {/* Lodge name on image */}
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="text-white font-bold text-base leading-tight drop-shadow-lg truncate">
              {lodge.name}
            </h3>
          </div>
        </div>

        {/* Card content */}
        <div className="p-4">
          {/* Location */}
          <div className="flex items-center gap-1.5 text-slate-500 mb-2">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="text-sm truncate">{lodge.location}</span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex items-center gap-0.5">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-semibold text-slate-900">{lodge.rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Price and call */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-slate-900">K{lodge.price}</span>
              <span className="text-sm text-slate-500">/{lodge.priceUnit}</span>
            </div>
            {lodge.phone && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.location.href = `tel:${lodge.phone}`;
                }}
                className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-lg transition-colors"
              >
                <Phone className="w-3 h-3" />
                Call
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
