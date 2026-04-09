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
  CalendarDays,
  Clock,
  Crown,
  Star,
  Zap,
} from 'lucide-react'
import type { Listing } from './featured-carousel'
import { formatPrice } from './featured-carousel'

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

  const tierConfig: Record<string, { icon: typeof Crown; color: string; label: string }> = {
    premium: { icon: Crown, color: 'text-amber-500', label: 'Premium' },
    featured: { icon: Star, color: 'text-emerald-500', label: 'Featured' },
    spotlight: { icon: Zap, color: 'text-sky-500', label: 'Spotlight' },
    standard: { icon: Star, color: 'text-gray-400', label: 'Standard' },
  }

  const tier = tierConfig[listing.tier] || tierConfig.standard
  const TierIcon = tier.icon

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-0 gap-0">
        {/* Image */}
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-lg">
          <Image
            src={listing.imageUrl}
            alt={listing.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 500px"
            priority
          />
          {listing.tier !== 'standard' && (
            <Badge
              className={`absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-foreground border-0 rounded-full text-xs px-2.5 gap-1 z-10`}
            >
              <TierIcon className={`size-3.5 ${tier.color}`} />
              {tier.label}
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          <DialogHeader className="text-left space-y-2 p-0">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <DialogTitle className="text-lg leading-tight">
                  {listing.title}
                </DialogTitle>
                <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                  <MapPin className="size-3.5 shrink-0" />
                  <span>{listing.location}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-emerald-600 font-bold text-lg">
                  {formatPrice(listing.price)}
                </p>
                <p className="text-muted-foreground text-xs">per {listing.priceUnit}</p>
              </div>
            </div>
          </DialogHeader>

          <Separator />

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="rounded-full text-xs">
              {listing.category}
            </Badge>
            <Badge variant="outline" className="rounded-full text-xs gap-1">
              <CalendarDays className="size-3" />
              {new Date(listing.createdAt).toLocaleDateString('en-ZM', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </Badge>
            <Badge variant="outline" className="rounded-full text-xs gap-1">
              <Clock className="size-3" />
              {new Date(listing.createdAt).toLocaleTimeString('en-ZM', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Badge>
          </div>

          <DialogDescription className="text-sm leading-relaxed text-foreground/80 whitespace-pre-wrap">
            {listing.description}
          </DialogDescription>

          <Separator />

          {/* Contact Info */}
          {(listing.contactPhone || listing.contactEmail) && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Contact Information
              </h4>
              <div className="space-y-1.5">
                {listing.contactPhone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="size-3.5 text-muted-foreground" />
                    <a
                      href={`tel:${listing.contactPhone}`}
                      className="text-emerald-600 hover:underline"
                    >
                      {listing.contactPhone}
                    </a>
                  </div>
                )}
                {listing.contactEmail && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="size-3.5 text-muted-foreground" />
                    <a
                      href={`mailto:${listing.contactEmail}`}
                      className="text-emerald-600 hover:underline"
                    >
                      {listing.contactEmail}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <Button
              variant="outline"
              className="flex-1 gap-1.5"
              onClick={onToggleFavorite}
            >
              <Heart
                className={`size-4 ${
                  isFavorited ? 'fill-red-500 text-red-500' : ''
                }`}
              />
              {isFavorited ? 'Saved' : 'Save'}
            </Button>
            {listing.contactPhone && (
              <Button
                className="flex-1 gap-1.5 bg-emerald-500 hover:bg-emerald-600"
                asChild
              >
                <a href={`tel:${listing.contactPhone}`}>
                  <Phone className="size-4" />
                  Contact
                </a>
              </Button>
            )}
            {listing.contactEmail && !listing.contactPhone && (
              <Button
                className="flex-1 gap-1.5 bg-emerald-500 hover:bg-emerald-600"
                asChild
              >
                <a href={`mailto:${listing.contactEmail}`}>
                  <Mail className="size-4" />
                  Email
                </a>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
