'use client'

import { ListingCard, ListingCardSkeleton } from './listing-card'
import type { Listing } from './featured-carousel'

interface ListingGridProps {
  listings: Listing[]
  favorites: Set<string>
  onToggleFavorite: (listing: Listing) => void
  onSelectListing: (listing: Listing) => void
  isLoading?: boolean
}

export function ListingGrid({
  listings,
  favorites,
  onToggleFavorite,
  onSelectListing,
  isLoading,
}: ListingGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 px-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ListingCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <span className="text-2xl">🏠</span>
        </div>
        <h3 className="font-semibold text-sm mb-1">No listings found</h3>
        <p className="text-muted-foreground text-xs max-w-xs">
          Try adjusting your search or filters to find what you&apos;re looking for.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 px-4">
      {listings.map((listing) => (
        <ListingCard
          key={listing.id}
          listing={listing}
          isFavorited={favorites.has(listing.id)}
          onToggleFavorite={onToggleFavorite}
          onSelectListing={onSelectListing}
        />
      ))}
    </div>
  )
}
