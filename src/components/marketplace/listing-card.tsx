'use client'

import { Heart, MapPin, Star, ShieldCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import Image from 'next/image'

export interface Listing {
  id: string
  title: string
  description: string
  price: number
  priceUnit: string
  location: string
  category: string
  imageUrl: string
  tier: string
  contactPhone?: string | null
  contactEmail?: string | null
  isFeatured: boolean
  createdAt: string
}

export function formatPrice(price: number) {
  return `K${price.toLocaleString()}`
}

function TimeAgo({ dateStr }: { dateStr: string }) {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHrs / 24)

  if (diffHrs < 1) return 'Just now'
  if (diffHrs < 24) return `${diffHrs}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return `${Math.floor(diffDays / 7)}w ago`
}

// Generate a fake rating based on listing id
function getRating(id: string): number {
  const hash = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return 3.5 + (hash % 15) / 10 // 3.5 to 5.0
}

interface ListingCardProps {
  listing: Listing
  isFavorited: boolean
  onToggleFavorite: (listing: Listing) => void
  onSelectListing: (listing: Listing) => void
}

export function ListingCard({
  listing,
  isFavorited,
  onToggleFavorite,
  onSelectListing,
}: ListingCardProps) {
  const rating = getRating(listing.id)

  return (
    <div
      className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-100"
      onClick={() => onSelectListing(listing)}
    >
      {/* Image section */}
      <div className="relative aspect-[3/2] overflow-hidden bg-gray-100">
        <Image
          src={listing.imageUrl}
          alt={listing.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
        />

        {/* Verified badge */}
        {listing.tier !== 'standard' && (
          <div className="absolute top-2 left-2 z-10">
            <span className="inline-flex items-center gap-1 bg-[#006633] text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
              <ShieldCheck className="size-3" />
              Verified
            </span>
          </div>
        )}

        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleFavorite(listing)
          }}
          className="absolute top-2 right-2 z-10 h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors"
        >
          <Heart
            className={`size-4 transition-colors ${
              isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400'
            }`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-3 space-y-1.5">
        <h3 className="text-[13px] font-semibold text-gray-900 line-clamp-2 leading-snug">
          {listing.title}
        </h3>

        {/* Category + rating */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-gray-500 font-medium">{listing.category}</span>
          <div className="flex items-center gap-0.5">
            <Star className="size-3 fill-amber-400 text-amber-400" />
            <span className="text-[11px] font-semibold text-gray-700">{rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-gray-400">
          <MapPin className="size-3 shrink-0" />
          <span className="text-[11px] truncate">{listing.location}</span>
        </div>

        {/* Price */}
        <div className="pt-0.5">
          <span className="text-sm font-bold text-gray-900">
            {formatPrice(listing.price)}
          </span>
          <span className="text-[11px] text-gray-400 font-normal"> / {listing.priceUnit}</span>
        </div>
      </div>
    </div>
  )
}

export function ListingCardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
      <Skeleton className="aspect-[3/2] w-full" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  )
}
