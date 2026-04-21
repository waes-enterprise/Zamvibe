'use client'

import Image from 'next/image'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  MapPin,
  Heart,
  Phone,
  Mail,
  Star,
  ShieldCheck,
  Share2,
} from 'lucide-react'
import type { Listing } from './listing-card'
import { formatPrice } from './listing-card'

interface ListingDetailProps {
  listing: Listing | null
  open: boolean
  isFavorited: boolean
  onOpenChange: (open: boolean) => void
  onToggleFavorite: () => void
}

export function ListingDetail({
  listing,
  open,
  isFavorited,
  onOpenChange,
  onToggleFavorite,
}: ListingDetailProps) {
  if (!listing) return null

  // Generate consistent rating from id
  const hash = listing.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const rating = (3.5 + (hash % 15) / 10).toFixed(1)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-0 gap-0 rounded-xl">
        {/* Image */}
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <Image
            src={listing.imageUrl}
            alt={listing.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 500px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          {/* Action buttons on image */}
          <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
            <button className="h-8 w-8 rounded-full bg-white/90 flex items-center justify-center">
              <Share2 className="size-4 text-gray-600" />
            </button>
            <button
              onClick={onToggleFavorite}
              className="h-8 w-8 rounded-full bg-white/90 flex items-center justify-center"
            >
              <Heart
                className={`size-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
              />
            </button>
          </div>

          {/* Price overlay */}
          <div className="absolute bottom-3 left-3 z-10">
            <div className="bg-[#006633] text-white px-3 py-1.5 rounded-lg">
              <span className="text-lg font-bold">{formatPrice(listing.price)}</span>
              <span className="text-xs text-white/80"> / {listing.priceUnit}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <DialogHeader className="text-left space-y-1 p-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <DialogTitle className="text-base font-bold leading-tight text-gray-900">
                  {listing.title}
                </DialogTitle>
                <div className="flex items-center gap-1.5 text-gray-500 text-sm mt-1">
                  <MapPin className="size-3.5 shrink-0" />
                  <span className="text-xs">{listing.location}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg shrink-0">
                <Star className="size-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-bold text-gray-800">{rating}</span>
              </div>
            </div>
          </DialogHeader>

          {/* Badges row */}
          <div className="flex flex-wrap gap-1.5">
            <Badge className="bg-[#006633]/10 text-[#006633] border-0 rounded-md text-[11px] font-medium">
              {listing.category}
            </Badge>
            {listing.tier !== 'standard' && (
              <Badge className="bg-[#006633]/10 text-[#006633] border-0 rounded-md text-[11px] font-medium gap-1">
                <ShieldCheck className="size-3" />
                Verified
              </Badge>
            )}
          </div>

          <Separator />

          <DialogDescription className="text-[13px] leading-relaxed text-gray-600 whitespace-pre-wrap">
            {listing.description}
          </DialogDescription>

          <Separator />

          {/* Contact Info */}
          {(listing.contactPhone || listing.contactEmail) && (
            <div className="space-y-2">
              <h4 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Contact Information
              </h4>
              <div className="space-y-2">
                {listing.contactPhone && (
                  <a
                    href={`tel:${listing.contactPhone}`}
                    className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#006633] flex items-center justify-center">
                      <Phone className="size-3.5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{listing.contactPhone}</span>
                  </a>
                )}
                {listing.contactEmail && (
                  <a
                    href={`mailto:${listing.contactEmail}`}
                    className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#006633] flex items-center justify-center">
                      <Mail className="size-3.5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{listing.contactEmail}</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-1 pb-1">
            <Button
              variant="outline"
              className="flex-1 gap-1.5 rounded-lg h-10 border-gray-200"
              onClick={onToggleFavorite}
            >
              <Heart
                className={`size-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`}
              />
              {isFavorited ? 'Saved' : 'Save'}
            </Button>
            {listing.contactPhone ? (
              <Button
                className="flex-1 gap-1.5 bg-[#006633] hover:bg-[#004d26] rounded-lg h-10"
                asChild
              >
                <a href={`tel:${listing.contactPhone}`}>
                  <Phone className="size-4" />
                  Call Now
                </a>
              </Button>
            ) : listing.contactEmail ? (
              <Button
                className="flex-1 gap-1.5 bg-[#006633] hover:bg-[#004d26] rounded-lg h-10"
                asChild
              >
                <a href={`mailto:${listing.contactEmail}`}>
                  <Mail className="size-4" />
                  Email
                </a>
              </Button>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
