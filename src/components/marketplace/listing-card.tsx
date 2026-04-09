'use client'

import { Heart, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import type { Listing } from './featured-carousel'
import { TierBadge, TimeAgo, formatPrice } from './featured-carousel'
import Image from 'next/image'

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
  return (
    <div className="group relative rounded-lg overflow-hidden border border-border bg-card shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      <div
        className="relative aspect-[4/3] overflow-hidden"
        onClick={() => onSelectListing(listing)}
      >
        <Image
          src={listing.imageUrl}
          alt={listing.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
        />
        <TierBadge tier={listing.tier} />

        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleFavorite(listing)
          }}
          className="absolute top-2 right-2 z-10 h-7 w-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors"
        >
          <Heart
            className={`size-3.5 transition-colors ${
              isFavorited
                ? 'fill-red-500 text-red-500'
                : 'text-gray-600'
            }`}
          />
        </button>

        {/* Time badge */}
        <div className="absolute bottom-2 right-2 z-10">
          <TimeAgo dateStr={listing.createdAt} />
        </div>
      </div>

      <div className="p-3" onClick={() => onSelectListing(listing)}>
        <h3 className="text-sm font-medium line-clamp-2 mb-1 leading-snug">
          {listing.title}
        </h3>
        <p className="text-emerald-600 font-bold text-sm mb-1">
          {formatPrice(listing.price)}
          <span className="font-normal text-muted-foreground text-xs">
            /{listing.priceUnit}
          </span>
        </p>
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-1 text-muted-foreground min-w-0">
            <MapPin className="size-3 shrink-0" />
            <span className="text-[11px] truncate">{listing.location}</span>
          </div>
          <Badge
            variant="secondary"
            className="text-[10px] px-1.5 rounded-full shrink-0"
          >
            {listing.category}
          </Badge>
        </div>
      </div>
    </div>
  )
}

export function ListingCardSkeleton() {
  return (
    <div className="rounded-lg overflow-hidden border border-border bg-card">
      <Skeleton className="aspect-[4/3] w-full" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex justify-between">
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>
    </div>
  )
}
