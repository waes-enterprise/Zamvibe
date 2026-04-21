'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft,
  MessageCircle,
  Phone,
  Shield,
  MapPin,
  Lightbulb,
  Bell,
} from 'lucide-react'
import type { Listing } from '@/components/marketplace/listing-card'
import { formatPrice } from '@/components/marketplace/listing-card'

// ─── Page Component ───────────────────────────────────────────────────

export default function InboxPage() {
  const router = useRouter()
  const [featuredListings, setFeaturedListings] = useState<Listing[]>([])

  // Fetch featured listings for suggestions
  useEffect(() => {
    async function fetchFeatured() {
      try {
        const res = await fetch('/api/listings/featured')
        if (res.ok) {
          const data = await res.json()
          const items = Array.isArray(data) ? data : data.listings || []
          setFeaturedListings(items.slice(0, 3))
        }
      } catch {
        // ignore
      }
    }
    fetchFeatured()
  }, [])

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
          <h1 className="text-white font-bold text-lg tracking-tight flex-1">Messages</h1>
          {/* Decorative bell */}
          <div className="relative">
            <Bell className="size-5 text-white/80" />
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-red-400 ring-2 ring-[#006633]" />
          </div>
        </div>
      </header>

      {/* B. Empty State */}
      <div className="flex flex-col items-center justify-center px-4 py-16">
        <MessageCircle className="size-16 text-gray-300 mb-4" />
        <h2 className="text-lg font-semibold text-gray-900 mb-1">No messages yet</h2>
        <p className="text-sm text-gray-500 text-center max-w-xs">
          When you contact a listing owner or someone messages you, conversations will appear here
        </p>
      </div>

      {/* C. Tips Section */}
      <div className="px-4 pb-6">
        <div className="max-w-md mx-auto bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-full bg-amber-50 flex items-center justify-center">
              <Lightbulb className="size-4 text-amber-500" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">Tips for a great experience</h3>
          </div>
          <div className="space-y-4">
            {/* Tip 1 */}
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-[#006633]/10 flex items-center justify-center shrink-0 mt-0.5">
                <Phone className="size-4 text-[#006633]" />
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Contact listing owners directly using the Call or Email buttons on listing pages
              </p>
            </div>
            {/* Tip 2 */}
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-[#006633]/10 flex items-center justify-center shrink-0 mt-0.5">
                <Shield className="size-4 text-[#006633]" />
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Be respectful and clear in your communications
              </p>
            </div>
            {/* Tip 3 */}
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-[#006633]/10 flex items-center justify-center shrink-0 mt-0.5">
                <MapPin className="size-4 text-[#006633]" />
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Always meet in safe, public locations for property viewings
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* D. Featured Listings */}
      {featuredListings.length > 0 && (
        <div className="px-4 pb-8">
          <div className="max-w-md mx-auto bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Featured Properties</h3>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-none">
              {featuredListings.map(listing => (
                <Link
                  key={listing.id}
                  href={`/listings/${listing.id}`}
                  className="group shrink-0 w-44 bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100"
                >
                  <div className="relative aspect-[3/2] overflow-hidden bg-gray-100">
                    <Image
                      src={listing.imageUrl}
                      alt={listing.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="176px"
                      loading="lazy"
                    />
                    {listing.tier !== 'standard' && (
                      <span className="absolute top-1 left-1 inline-flex items-center gap-0.5 bg-[#006633] text-white text-[9px] font-semibold px-1.5 py-0.5 rounded">
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="p-2.5 space-y-0.5">
                    <h4 className="text-[11px] font-semibold text-gray-900 line-clamp-1">
                      {listing.title}
                    </h4>
                    <p className="text-[11px] font-bold text-gray-900">
                      {formatPrice(listing.price)} <span className="font-normal text-gray-400">/ {listing.priceUnit}</span>
                    </p>
                    <p className="text-[10px] text-[#006633] font-medium mt-0.5">Contact</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
