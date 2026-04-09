'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Header } from '@/components/marketplace/header'
import { CategoryRow, type Category } from '@/components/marketplace/category-row'
import { ListingGrid } from '@/components/marketplace/listing-grid'
import { ListingDetail } from '@/components/marketplace/listing-detail'
import { FavoritesSheet } from '@/components/marketplace/favorites-sheet'
import { BottomNav, type TabType } from '@/components/marketplace/bottom-nav'
import { ChevronRight } from 'lucide-react'
import type { Listing } from '@/components/marketplace/listing-card'

function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  let sessionId = localStorage.getItem('hmz-session')
  if (!sessionId) {
    sessionId = crypto.randomUUID()
    localStorage.setItem('hmz-session', sessionId)
  }
  return sessionId
}

// Section configuration matching the screenshot
const sections = [
  { key: 'all', title: 'All Collection', description: 'Browse all available listings' },
  { key: 'budget', title: 'Budget Friendly', description: 'Affordable options under K3,000' },
  { key: 'executive', title: 'Executive Living', description: 'Premium properties for discerning tenants' },
  { key: 'top', title: 'Top Rated', description: 'Highest rated properties by users' },
]

function getListingsForSection(sectionKey: string, listings: Listing[]): Listing[] {
  switch (sectionKey) {
    case 'budget':
      return listings.filter(l => l.price < 3000).slice(0, 6)
    case 'executive':
      return listings
        .filter(l => l.tier === 'premium' || l.tier === 'featured' || l.price >= 5000)
        .slice(0, 6)
    case 'top': {
      // Sort by a pseudo-rating derived from tier + creation date
      return [...listings]
        .sort((a, b) => {
          const tierOrder: Record<string, number> = { premium: 4, featured: 3, spotlight: 2, standard: 1 }
          const scoreA = (tierOrder[a.tier] || 1) + (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) / 100000000000
          const scoreB = (tierOrder[b.tier] || 1) + (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) / 100000000000
          return scoreB - scoreA
        })
        .slice(0, 6)
    }
    default:
      return listings.slice(0, 6)
  }
}

export default function Home() {
  // Data states
  const [listings, setListings] = useState<Listing[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // UI states
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeTab, setActiveTab] = useState<TabType>('explore')
  const [activeView, setActiveView] = useState<'list' | 'map'>('list')
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [favoritesOpen, setFavoritesOpen] = useState(false)
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set())
  const [favoriteListings, setFavoriteListings] = useState<Listing[]>([])

  const sessionId = getSessionId()

  // Fetch initial data
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const [listingsRes, categoriesRes] = await Promise.all([
          fetch('/api/listings'),
          fetch('/api/categories'),
        ])

        const listingsData = await listingsRes.json()
        const categoriesData = await categoriesRes.json()

        setListings(listingsData)
        setCategories(categoriesData)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Fetch favorites on mount
  useEffect(() => {
    async function fetchFavorites() {
      if (!sessionId) return
      try {
        const res = await fetch(`/api/favorites?sessionId=${sessionId}`)
        const data = await res.json()
        setFavoriteListings(data)
        setFavoriteIds(new Set(data.map((f: Listing) => f.id)))
      } catch {
        console.error('Failed to fetch favorites')
      }
    }

    fetchFavorites()
  }, [sessionId])

  // Filter listings based on search and category
  const filteredListings = useMemo(() => {
    let filtered = listings

    if (activeCategory !== 'All') {
      filtered = filtered.filter((l) => l.category === activeCategory)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q) ||
          l.location.toLowerCase().includes(q)
      )
    }

    return filtered
  }, [listings, activeCategory, searchQuery])

  // Toggle favorite
  const toggleFavorite = useCallback(
    async (listing: Listing) => {
      if (!sessionId) return

      const isFav = favoriteIds.has(listing.id)

      try {
        if (isFav) {
          await fetch(
            `/api/favorites?listingId=${listing.id}&sessionId=${sessionId}`,
            { method: 'DELETE' }
          )
          setFavoriteIds((prev) => {
            const next = new Set(prev)
            next.delete(listing.id)
            return next
          })
          setFavoriteListings((prev) => prev.filter((f) => f.id !== listing.id))
        } else {
          await fetch('/api/favorites', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ listingId: listing.id, sessionId }),
          })
          setFavoriteIds((prev) => new Set(prev).add(listing.id))
          setFavoriteListings((prev) => [listing, ...prev])
        }
      } catch {
        console.error('Failed to toggle favorite')
      }
    },
    [sessionId, favoriteIds]
  )

  const removeFavorite = useCallback(
    async (listingId: string) => {
      if (!sessionId) return
      try {
        await fetch(
          `/api/favorites?listingId=${listingId}&sessionId=${sessionId}`,
          { method: 'DELETE' }
        )
        setFavoriteIds((prev) => {
          const next = new Set(prev)
          next.delete(listingId)
          return next
        })
        setFavoriteListings((prev) => prev.filter((f) => f.id !== listingId))
      } catch {
        console.error('Failed to remove favorite')
      }
    },
    [sessionId]
  )

  const handleSelectListing = useCallback((listing: Listing) => {
    setSelectedListing(listing)
    setDetailOpen(true)
  }, [])

  const isFiltered = searchQuery.trim() || activeCategory !== 'All'

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa]">
      {/* Green Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeView={activeView}
        onViewChange={setActiveView}
      />

      {/* Main Content */}
      <main className="flex-1 pb-20">
        {/* Category icons row */}
        <CategoryRow
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* When filtered, show simple grid */}
        {isFiltered ? (
          <div className="mt-2">
            <ListingGrid
              listings={filteredListings}
              favorites={favoriteIds}
              onToggleFavorite={toggleFavorite}
              onSelectListing={handleSelectListing}
              isLoading={isLoading}
            />
          </div>
        ) : (
          /* Category sections like the screenshot */
          <>
            {sections.map((section, idx) => {
              const sectionListings = getListingsForSection(section.key, listings)

              if (isLoading) {
                return (
                  <section key={section.key} className="mt-4">
                    <div className="px-4 mb-3 flex items-center justify-between">
                      <div>
                        <h2 className="text-sm font-bold text-gray-900">{section.title}</h2>
                        <p className="text-[11px] text-gray-400 mt-0.5">{section.description}</p>
                      </div>
                      <button className="flex items-center gap-0.5 text-[#006633] text-xs font-semibold">
                        See all
                        <ChevronRight className="size-3.5" />
                      </button>
                    </div>
                    <ListingGrid
                      listings={Array(6).fill({}) as unknown as Listing[]}
                      favorites={favoriteIds}
                      onToggleFavorite={toggleFavorite}
                      onSelectListing={handleSelectListing}
                      isLoading={true}
                    />
                  </section>
                )
              }

              if (sectionListings.length === 0) return null

              return (
                <section key={section.key} className="mt-4">
                  {/* Section header */}
                  <div className="px-4 mb-3 flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-bold text-gray-900">{section.title}</h2>
                      <p className="text-[11px] text-gray-400 mt-0.5">{section.description}</p>
                    </div>
                    <button className="flex items-center gap-0.5 text-[#006633] text-xs font-semibold hover:text-[#004d26] transition-colors">
                      See all
                      <ChevronRight className="size-3.5" />
                    </button>
                  </div>

                  {/* Section listings */}
                  {idx === 0 ? (
                    /* First section (All Collection) - horizontal scroll cards */
                    <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-none">
                      {sectionListings.map((listing) => (
                        <HorizontalCard
                          key={listing.id}
                          listing={listing}
                          isFavorited={favoriteIds.has(listing.id)}
                          onToggleFavorite={toggleFavorite}
                          onSelectListing={handleSelectListing}
                        />
                      ))}
                    </div>
                  ) : (
                    /* Other sections - grid */
                    <ListingGrid
                      listings={sectionListings}
                      favorites={favoriteIds}
                      onToggleFavorite={toggleFavorite}
                      onSelectListing={handleSelectListing}
                      isLoading={false}
                    />
                  )}
                </section>
              )
            })}
          </>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        savedCount={favoriteIds.size}
        onOpenFavorites={() => setFavoritesOpen(true)}
      />

      {/* Listing Detail Modal */}
      <ListingDetail
        listing={selectedListing}
        open={detailOpen}
        isFavorited={selectedListing ? favoriteIds.has(selectedListing.id) : false}
        onOpenChange={setDetailOpen}
        onToggleFavorite={() => {
          if (selectedListing) toggleFavorite(selectedListing)
        }}
      />

      {/* Favorites Sheet */}
      <FavoritesSheet
        open={favoritesOpen}
        onOpenChange={setFavoritesOpen}
        favorites={favoriteListings}
        onRemoveFavorite={removeFavorite}
        onSelectListing={handleSelectListing}
      />
    </div>
  )
}

// Horizontal scrollable card for "All Collection" section
function HorizontalCard({
  listing,
  isFavorited,
  onToggleFavorite,
  onSelectListing,
}: {
  listing: Listing
  isFavorited: boolean
  onToggleFavorite: (listing: Listing) => void
  onSelectListing: (listing: Listing) => void
}) {
  const hash = listing.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const rating = (3.5 + (hash % 15) / 10).toFixed(1)

  return (
    <div
      className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-100 shrink-0 w-44"
      onClick={() => onSelectListing(listing)}
    >
      {/* Image */}
      <div className="relative aspect-[3/2] overflow-hidden bg-gray-100">
        <img
          src={listing.imageUrl}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {listing.tier !== 'standard' && (
          <span className="absolute top-1.5 left-1.5 inline-flex items-center gap-0.5 bg-[#006633] text-white text-[9px] font-semibold px-1.5 py-0.5 rounded">
            Verified
          </span>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleFavorite(listing)
          }}
          className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-white/90 flex items-center justify-center"
        >
          <svg
            className={`size-3 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
            viewBox="0 0 24 24"
            fill={isFavorited ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>
      </div>
      {/* Content */}
      <div className="p-2.5 space-y-1">
        <h3 className="text-[12px] font-semibold text-gray-900 line-clamp-1 leading-snug">
          {listing.title}
        </h3>
        <div className="flex items-center gap-1">
          <svg className="size-3 fill-amber-400 text-amber-400" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span className="text-[10px] font-semibold text-gray-600">{rating}</span>
          <span className="text-[10px] text-gray-400">· {listing.category}</span>
        </div>
        <p className="text-[11px] font-bold text-gray-900">
          K{listing.price.toLocaleString()} <span className="font-normal text-gray-400">/ {listing.priceUnit}</span>
        </p>
      </div>
    </div>
  )
}
