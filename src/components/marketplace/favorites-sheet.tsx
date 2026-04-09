'use client'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Heart, MapPin, X } from 'lucide-react'
import Image from 'next/image'
import type { Listing } from './featured-carousel'
import { formatPrice } from './featured-carousel'

interface FavoritesSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  favorites: Listing[]
  onRemoveFavorite: (listingId: string) => void
  onSelectListing: (listing: Listing) => void
}

export function FavoritesSheet({
  open,
  onOpenChange,
  favorites,
  onRemoveFavorite,
  onSelectListing,
}: FavoritesSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-sm p-0">
        <SheetHeader className="p-4 pb-2 border-b">
          <SheetTitle className="flex items-center gap-2">
            <Heart className="size-4 text-red-500 fill-red-500" />
            Saved Listings
          </SheetTitle>
          <SheetDescription>
            {favorites.length === 0
              ? 'No saved listings yet'
              : `${favorites.length} saved listing${favorites.length > 1 ? 's' : ''}`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto max-h-[calc(100vh-80px)]">
          {favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-3">
                <Heart className="size-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium mb-1">No favorites yet</p>
              <p className="text-xs text-muted-foreground">
                Tap the heart icon on listings to save them here
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {favorites.map((listing) => (
                <div
                  key={listing.id}
                  className="flex gap-3 p-3 hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => {
                    onOpenChange(false)
                    onSelectListing(listing)
                  }}
                >
                  <div className="relative w-20 h-16 rounded-md overflow-hidden shrink-0 bg-muted">
                    <Image
                      src={listing.imageUrl}
                      alt={listing.title}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium line-clamp-1">
                      {listing.title}
                    </h4>
                    <p className="text-emerald-600 text-xs font-semibold">
                      {formatPrice(listing.price)}/{listing.priceUnit}
                    </p>
                    <div className="flex items-center gap-1 text-muted-foreground mt-0.5">
                      <MapPin className="size-3" />
                      <span className="text-[11px] truncate">{listing.location}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onRemoveFavorite(listing.id)
                    }}
                    className="self-start p-1 hover:bg-muted rounded-md transition-colors"
                  >
                    <X className="size-3.5 text-muted-foreground" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
