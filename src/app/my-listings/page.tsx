'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, MapPin, Building2, Loader2, Plus } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

interface ListingItem {
  id: string
  title: string
  description: string
  price: number
  priceUnit: string
  location: string
  category: string
  imageUrl: string
  tier: string
  isFeatured: boolean
  status: string
  createdAt: string
}

export default function MyListingsPage() {
  const router = useRouter()
  const [listings, setListings] = useState<ListingItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [sessionRes, listingRes] = await Promise.all([
          fetch('/api/auth/session'),
          fetch('/api/listings'),
        ])

        const sessionData = await sessionRes.json()
        if (!sessionData.user) {
          router.push('/auth/signin')
          return
        }

        const userId = sessionData.user.id
        const allListings = await listingRes.json()
        const myListings = Array.isArray(allListings)
          ? allListings.filter((l: ListingItem) => l.ownerId === userId)
          : []

        setListings(myListings)
      } catch {
        router.push('/auth/signin')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

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
            <h1 className="text-white font-bold text-lg tracking-tight">My Listings</h1>
          </div>
        </header>

        {/* Empty state */}
        <div className="flex flex-col items-center justify-center px-4 py-20">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Building2 className="size-8 text-gray-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">No listings yet</h2>
          <p className="text-sm text-gray-500 mb-6 text-center max-w-xs">
            You haven&apos;t posted any listings yet. Start sharing your property with the community.
          </p>
          <button
            onClick={() => alert('Post a Listing feature coming soon!')}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#006633] text-white text-sm font-semibold hover:bg-[#004d26] transition-colors shadow-sm"
          >
            <Plus className="size-4" />
            Post a Listing
          </button>
        </div>
      </div>
    )
  }

  // ─── Main Render ───────────────────────────────────────────────────
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
          <h1 className="text-white font-bold text-lg tracking-tight">My Listings</h1>
        </div>
      </header>

      {/* Subtitle */}
      <div className="px-4 py-2.5">
        <p className="text-xs text-gray-500 font-medium">
          {listings.length} listing{listings.length !== 1 ? 's' : ''} posted
        </p>
      </div>

      {/* Listings Grid */}
      <div className="px-4 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {listings.map(listing => (
            <Link
              key={listing.id}
              href={`/listings/${listing.id}`}
              className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
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

                {/* Status badge */}
                {listing.status === 'active' && (
                  <span className="absolute top-2 right-2 inline-flex items-center bg-green-500 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded">
                    Active
                  </span>
                )}
                {listing.status === 'pending' && (
                  <span className="absolute top-2 right-2 inline-flex items-center bg-amber-500 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded">
                    Pending
                  </span>
                )}
                {listing.status === 'archived' && (
                  <span className="absolute top-2 right-2 inline-flex items-center bg-gray-500 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded">
                    Archived
                  </span>
                )}
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
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
