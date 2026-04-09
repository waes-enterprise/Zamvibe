'use client'

import { ListingCard, ListingCardSkeleton } from './listing-card'
import type { Listing } from './listing-card'

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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 px-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <ListingCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <svg className="size-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </div>
        <h3 className="font-semibold text-sm mb-1 text-gray-700">No listings found</h3>
        <p className="text-gray-400 text-xs max-w-xs">
          Try adjusting your search or filters to find what you&apos;re looking for.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 px-4">
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
