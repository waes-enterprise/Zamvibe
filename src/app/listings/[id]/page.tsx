'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import {
  ArrowLeft,
  MapPin,
  Star,
  ShieldCheck,
  Share2,
  Heart,
  Phone,
  Mail,
  MessageCircle,
  Calendar,
  Tag,
  Crown,
  HeartIcon,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import type { Listing } from '@/components/marketplace/listing-card'
import { formatPrice } from '@/components/marketplace/listing-card'

// ─── Types ────────────────────────────────────────────────────────────

interface ListingDetailData extends Listing {
  ownerId?: string | null
  owner?: { id: string; name: string; email: string; phone: string | null; avatarUrl: string | null } | null
  _count?: { favorites: number }
  status?: string
  updatedAt?: string
}

// ─── Helpers ──────────────────────────────────────────────────────────

function getRating(id: string): number {
  const hash = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return 3.5 + (hash % 15) / 10
}

function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  let sessionId = localStorage.getItem('hmz-session')
  if (!sessionId) {
    sessionId = crypto.randomUUID()
    localStorage.setItem('hmz-session', sessionId)
  }
  return sessionId
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// ─── Page Component ───────────────────────────────────────────────────

export default function ListingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [listing, setListing] = useState<ListingDetailData | null>(null)
  const [similarListings, setSimilarListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFavorited, setIsFavorited] = useState(false)
  const [favLoading, setFavLoading] = useState(false)
  const [shareCopied, setShareCopied] = useState(false)

  // Fetch listing data
  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError(null)

    async function fetchListing() {
      try {
        const res = await fetch(`/api/listings/${id}`)
        if (!res.ok) {
          setError('Listing not found')
          setLoading(false)
          return
        }
        const data: ListingDetailData = await res.json()
        setListing(data)

        // Fetch similar listings
        if (data.category) {
          const simRes = await fetch(`/api/listings?category=${encodeURIComponent(data.category)}`)
          if (simRes.ok) {
            const simData: Listing[] = await simRes.json()
            setSimilarListings(simData.filter((l) => l.id !== id).slice(0, 8))
          }
        }
      } catch {
        setError('Failed to load listing')
      } finally {
        setLoading(false)
      }
    }

    fetchListing()
  }, [id])

  // Check favorite status on mount
  useEffect(() => {
    if (!id) return
    async function checkFavorite() {
      try {
        const sessionId = getSessionId()
        const res = await fetch(`/api/favorites?sessionId=${sessionId}`)
        if (res.ok) {
          const data: Listing[] = await res.json()
          setIsFavorited(data.some((f) => f.id === id))
        }
      } catch {
        // ignore
      }
    }
    checkFavorite()
  }, [id])

  // Toggle favorite
  const toggleFavorite = useCallback(async () => {
    if (!id || favLoading) return
    setFavLoading(true)
    try {
      const sessionId = getSessionId()
      if (isFavorited) {
        await fetch(`/api/favorites?listingId=${id}&sessionId=${sessionId}`, { method: 'DELETE' })
        setIsFavorited(false)
      } else {
        await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ listingId: id, sessionId }),
        })
        setIsFavorited(true)
      }
    } catch {
      // ignore
    } finally {
      setFavLoading(false)
    }
  }, [id, isFavorited, favLoading])

  // Share
  const handleShare = useCallback(async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: listing?.title, url: window.location.href })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        setShareCopied(true)
        setTimeout(() => setShareCopied(false), 2000)
      }
    } catch {
      await navigator.clipboard.writeText(window.location.href)
      setShareCopied(true)
      setTimeout(() => setShareCopied(false), 2000)
    }
  }, [listing])

  // WhatsApp link
  const whatsappLink = listing?.contactPhone
    ? `https://wa.me/${listing.contactPhone.replace(/[^0-9+]/g, '')}`
    : null

  // ─── Render ────────────────────────────────────────────────────────

  if (loading) return <LoadingSkeleton />
  if (error || !listing) return <ErrorState message={error || 'Listing not found'} onBack={() => router.back()} />

  const rating = getRating(listing.id)
  const favoriteCount = listing._count?.favorites ?? 0
  const contactPhone = listing.contactPhone || listing.owner?.phone

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* ─── Hero Image Section ────────────────────────────────── */}
      <div className="relative">
        <div className="relative aspect-[4/3] md:aspect-[16/9] w-full overflow-hidden bg-gray-200">
          <Image
            src={listing.imageUrl}
            alt={listing.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20" />

          {/* Top bar */}
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-3 md:p-4">
            <button
              onClick={() => router.back()}
              className="h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors"
            >
              <ArrowLeft className="size-4 text-gray-700" />
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors"
              >
                <Share2 className="size-4 text-gray-700" />
              </button>
              <button
                onClick={toggleFavorite}
                disabled={favLoading}
                className="h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors"
              >
                {favLoading ? (
                  <Loader2 className="size-4 text-gray-500 animate-spin" />
                ) : (
                  <Heart className={`size-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} />
                )}
              </button>
            </div>
          </div>

          {/* Price overlay */}
          <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4 z-10">
            <div className="bg-[#006633] text-white px-3 py-1.5 md:px-4 md:py-2 rounded-xl shadow-lg">
              <span className="text-lg md:text-xl font-bold">{formatPrice(listing.price)}</span>
              <span className="text-xs md:text-sm text-white/80"> / {listing.priceUnit}</span>
            </div>
          </div>

          {/* Share copied toast */}
          {shareCopied && (
            <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-full shadow-lg">
              Link copied!
            </div>
          )}
        </div>
      </div>

      {/* ─── Content Area ──────────────────────────────────────── */}
      <div className="relative -mt-6 rounded-t-2xl bg-white z-10 min-h-[calc(100vh-60px)]">
        <div className="max-w-3xl mx-auto px-4 md:px-6 pt-5 pb-28">
          {/* Title row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg md:text-xl font-bold text-gray-900 leading-snug">{listing.title}</h1>
              <div className="flex items-center gap-1.5 text-gray-500 mt-1">
                <MapPin className="size-3.5 shrink-0" />
                <span className="text-sm">{listing.location}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1.5 rounded-xl shrink-0 mt-0.5">
              <Star className="size-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-bold text-gray-800">{rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <Badge className="bg-[#006633]/10 text-[#006633] border-0 rounded-md text-xs font-medium">
              {listing.category}
            </Badge>
            {listing.tier !== 'standard' && (
              <Badge className="bg-[#006633]/10 text-[#006633] border-0 rounded-md text-xs font-medium gap-1">
                <ShieldCheck className="size-3" />
                {listing.tier.charAt(0).toUpperCase() + listing.tier.slice(1)}
              </Badge>
            )}
            {listing.isFeatured && (
              <Badge className="bg-amber-100 text-amber-700 border-0 rounded-md text-xs font-medium gap-1">
                <Crown className="size-3" />
                Featured
              </Badge>
            )}
          </div>

          <Separator className="my-4" />

          {/* ─── Description ───────────────────────────────────── */}
          <div>
            <h2 className="text-sm font-bold text-gray-900 mb-2">Description</h2>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{listing.description}</p>
          </div>

          <Separator className="my-4" />

          {/* ─── Details Grid ──────────────────────────────────── */}
          <div>
            <h2 className="text-sm font-bold text-gray-900 mb-3">Details</h2>
            <div className="grid grid-cols-2 gap-3">
              <DetailItem icon={<Tag className="size-4 text-[#006633]" />} label="Price" value={`${formatPrice(listing.price)} / ${listing.priceUnit}`} />
              <DetailItem icon={<Tag className="size-4 text-[#006633]" />} label="Category" value={listing.category} />
              <DetailItem icon={<MapPin className="size-4 text-[#006633]" />} label="Location" value={listing.location} />
              <DetailItem icon={<Crown className="size-4 text-[#006633]" />} label="Tier" value={listing.tier.charAt(0).toUpperCase() + listing.tier.slice(1)} />
              <DetailItem icon={<Calendar className="size-4 text-[#006633]" />} label="Listed" value={formatDate(listing.createdAt)} />
              <DetailItem icon={<HeartIcon className="size-4 text-[#006633]" />} label="Favorites" value={`${favoriteCount} saves`} />
            </div>
          </div>

          {/* ─── Contact Section ───────────────────────────────── */}
          {(contactPhone || listing.contactEmail) && (
            <>
              <Separator className="my-4" />
              <div>
                <h2 className="text-sm font-bold text-gray-900 mb-3">Contact</h2>
                <div className="space-y-2">
                  {contactPhone && (
                    <a
                      href={`tel:${contactPhone}`}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#006633] flex items-center justify-center shrink-0">
                        <Phone className="size-4 text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-400 font-medium">Call</p>
                        <p className="text-sm font-semibold text-gray-800 truncate">{contactPhone}</p>
                      </div>
                    </a>
                  )}
                  {listing.contactEmail && (
                    <a
                      href={`mailto:${listing.contactEmail}`}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#006633] flex items-center justify-center shrink-0">
                        <Mail className="size-4 text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-400 font-medium">Email</p>
                        <p className="text-sm font-semibold text-gray-800 truncate">{listing.contactEmail}</p>
                      </div>
                    </a>
                  )}
                  {whatsappLink && (
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center shrink-0">
                        <MessageCircle className="size-4 text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-400 font-medium">WhatsApp</p>
                        <p className="text-sm font-semibold text-gray-800">Send a message</p>
                      </div>
                    </a>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ─── Similar Listings ──────────────────────────────── */}
          {similarListings.length > 0 && (
            <>
              <Separator className="my-4" />
              <div>
                <h2 className="text-sm font-bold text-gray-900 mb-3">Similar Listings</h2>
                <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-none">
                  {similarListings.map((sl) => (
                    <button
                      key={sl.id}
                      onClick={() => router.push(`/listings/${sl.id}`)}
                      className="group shrink-0 w-40 bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 text-left"
                    >
                      <div className="relative aspect-[3/2] overflow-hidden bg-gray-100">
                        <Image
                          src={sl.imageUrl}
                          alt={sl.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="160px"
                        />
                        {sl.tier !== 'standard' && (
                          <span className="absolute top-1 left-1 inline-flex items-center gap-0.5 bg-[#006633] text-white text-[9px] font-semibold px-1.5 py-0.5 rounded">
                            Verified
                          </span>
                        )}
                      </div>
                      <div className="p-2 space-y-0.5">
                        <h3 className="text-[11px] font-semibold text-gray-900 line-clamp-1">{sl.title}</h3>
                        <p className="text-[11px] font-bold text-gray-900">
                          {formatPrice(sl.price)} <span className="font-normal text-gray-400">/ {sl.priceUnit}</span>
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ─── Fixed Bottom Bar ─────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 px-4 py-3 safe-area-bottom">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <Button
            variant="outline"
            className="flex-1 gap-2 rounded-xl h-11 border-gray-200 font-semibold"
            onClick={toggleFavorite}
            disabled={favLoading}
          >
            {favLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Heart className={`size-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
            )}
            {isFavorited ? 'Saved' : 'Save'}
          </Button>
          {contactPhone ? (
            <Button
              className="flex-[2] gap-2 bg-[#006633] hover:bg-[#004d26] rounded-xl h-11 font-semibold"
              asChild
            >
              <a href={`tel:${contactPhone}`}>
                <Phone className="size-4" />
                Call Now
              </a>
            </Button>
          ) : listing.contactEmail ? (
            <Button
              className="flex-[2] gap-2 bg-[#006633] hover:bg-[#004d26] rounded-xl h-11 font-semibold"
              asChild
            >
              <a href={`mailto:${listing.contactEmail}`}>
                <Mail className="size-4" />
                Contact
              </a>
            </Button>
          ) : (
            <Button className="flex-[2] gap-2 bg-[#006633] hover:bg-[#004d26] rounded-xl h-11 font-semibold" disabled>
              No contact info
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Detail Item Component ────────────────────────────────────────────

function DetailItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-xl p-3">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-sm font-semibold text-gray-800">{value}</p>
    </div>
  )
}

// ─── Loading Skeleton ─────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Hero skeleton */}
      <Skeleton className="aspect-[4/3] md:aspect-[16/9] w-full" />

      {/* Content skeleton */}
      <div className="relative -mt-6 rounded-t-2xl bg-white z-10 min-h-[calc(100vh-60px)]">
        <div className="max-w-3xl mx-auto px-4 md:px-6 pt-5 pb-28 space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20 rounded-md" />
            <Skeleton className="h-6 w-20 rounded-md" />
          </div>
          <Separator />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-3 space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Error State ──────────────────────────────────────────────────────

function ErrorState({ message, onBack }: { message: string; onBack: () => void }) {
  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4">
      <div className="text-center space-y-4 max-w-sm">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto">
          <AlertCircle className="size-8 text-red-400" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">{message}</h2>
        <p className="text-sm text-gray-500">The listing you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <Button
          className="gap-2 bg-[#006633] hover:bg-[#004d26] rounded-xl px-6"
          onClick={onBack}
        >
          <ArrowLeft className="size-4" />
          Go Back
        </Button>
      </div>
    </div>
  )
}
