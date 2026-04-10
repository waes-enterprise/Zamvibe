'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, MapPin, X, Heart, Loader2 } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import type { Listing } from '@/components/marketplace/listing-card'
import { formatPrice } from '@/components/marketplace/listing-card'

// ─── Helpers ──────────────────────────────────────────────────────────

function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  let sessionId = localStorage.getItem('hmz-session')
  if (!sessionId) {
    sessionId = crypto.randomUUID()
    localStorage.setItem('hmz-session', sessionId)
  }
  return sessionId
}

// ─── Page Component ───────────────────────────────────────────────────

export default function SavedListingsPage() {
  const router = useRouter()

  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [removedFeedback, setRemovedFeedback] = useState<string | null>(null)

  // Check auth & fetch favorites
  useEffect(() => {
    async function init() {
      try {
        // Check auth
        const sessionRes = await fetch('/api/auth/session')
        const sessionData = await sessionRes.json()
        const authenticated = !!sessionData.user
        setIsAuthenticated(authenticated)

        // Fetch favorites
        const sessionId = getSessionId()
        const urlParam = authenticated ? '' : `?sessionId=${sessionId}`
        const favRes = await fetch(`/api/favorites${urlParam}`)
        const favData = await favRes.json()
        setListings(Array.isArray(favData) ? favData : [])
      } catch {
        setListings([])
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  // Remove favorite
  const handleRemove = useCallback(async (listingId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (removingId) return

    setRemovingId(listingId)
    try {
      const sessionId = getSessionId()
      const urlParam = isAuthenticated
        ? `?listingId=${listingId}`
        : `?listingId=${listingId}&sessionId=${sessionId}`
      const res = await fetch(`/api/favorites${urlParam}`, { method: 'DELETE' })
      if (res.ok) {
        setListings(prev => prev.filter(l => l.id !== listingId))
        setRemovedFeedback(listingId)
        setTimeout(() => setRemovedFeedback(null), 1500)
      }
    } catch {
      // ignore
    } finally {
      setRemovingId(null)
    }
  }, [isAuthenticated, removingId])

  // ─── Loading State ─────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa]">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-[#006633]">
          <div className="flex items-center px-4 py-3 gap-3">
            <div className="h-9 w-9 rounded-full bg-white/20 animate-pulse" />
            <Skeleton className="h-5 w-36 bg-white/20" />
          </div>
        </header>
        {/* Subtitle */}
        <div className="px-4 py-2.5">
          <Skeleton className="h-4 w-32" />
        </div>
        {/* Skeleton Grid */}
        <div className="px-4 pb-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                <Skeleton className="aspect-[3/2] w-full" />
                <div className="p-3 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // ─── Empty State ───────────────────────────────────────────────────
  if (listings.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8f9fa]">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-[#006633]">
          <div className="flex items-center px-4 py-3 gap-3">
            <button
              onClick={() => router.back()}
              className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <ArrowLeft className="size-4 text-white" />
            </button>
            <h1 className="text-white font-bold text-lg tracking-tight">Saved Listings</h1>
          </div>
        </header>

        {/* Empty state */}
        <div className="flex flex-col items-center justify-center px-4 py-20">
          <Heart className="size-16 text-gray-300 mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-1">No saved listings yet</h2>
          <p className="text-sm text-gray-500 mb-6 text-center">
            Start exploring and save listings you like
          </p>
          <Link
            href="/explore"
            className="px-6 py-2.5 rounded-lg bg-[#006633] text-white text-sm font-semibold hover:bg-[#004d26] transition-colors shadow-sm"
          >
            Explore Listings
          </Link>
        </div>
      </div>
    )
  }

  // ─── Main Render ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* A. Green Header Bar */}
      <header className="sticky top-0 z-40 bg-[#006633]">
        <div className="flex items-center px-4 py-3 gap-3">
          <button
            onClick={() => router.back()}
            className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="size-4 text-white" />
          </button>
          <h1 className="text-white font-bold text-lg tracking-tight">Saved Listings</h1>
        </div>
      </header>

      {/* B. Subtitle bar */}
      <div className="px-4 py-2.5">
        <p className="text-xs text-gray-500 font-medium">
          {listings.length} listing{listings.length !== 1 ? 's' : ''} saved
        </p>
      </div>

      {/* C. Listings Grid */}
      <div className="px-4 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {listings.map(listing => (
            <div
              key={listing.id}
              className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-100"
              onClick={() => router.push(`/listings/${listing.id}`)}
            >
              {/* Image */}
              <div className="relative aspect-[3/2] overflow-hidden bg-gray-100">
                <Image
                  src={listing.imageUrl}
                  alt={listing.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                  loading="lazy"
                />

                {/* Verified badge */}
                {listing.tier !== 'standard' && (
                  <span className="absolute top-2 left-2 inline-flex items-center gap-0.5 bg-[#006633] text-white text-[9px] font-semibold px-1.5 py-0.5 rounded">
                    Verified
                  </span>
                )}

                {/* Remove button */}
                <button
                  onClick={(e) => handleRemove(listing.id, e)}
                  disabled={removingId === listing.id}
                  className="absolute top-2 right-2 h-7 w-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors"
                >
                  {removingId === listing.id ? (
                    <Loader2 className="size-3.5 text-gray-500 animate-spin" />
                  ) : removedFeedback === listing.id ? (
                    <span className="text-[9px] font-semibold text-[#006633]">Removed</span>
                  ) : (
                    <X className="size-4 text-gray-500" />
                  )}
                </button>
              </div>

              {/* Content */}
              <div className="p-3 space-y-1">
                {/* Title */}
                <h3 className="text-[13px] font-semibold text-gray-900 line-clamp-2 leading-snug">
                  {listing.title}
                </h3>

                {/* Location */}
                <div className="flex items-center gap-1 text-gray-400">
                  <MapPin className="size-3 shrink-0" />
                  <span className="text-[11px] truncate">{listing.location}</span>
                </div>

                {/* Price */}
                <div className="pt-0.5">
                  <span className="text-sm font-bold text-gray-900">
                    K{listing.price.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-gray-400 font-normal"> / {listing.priceUnit}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
