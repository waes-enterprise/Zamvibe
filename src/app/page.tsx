'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Header } from '@/components/marketplace/header'
import { FeaturedCarousel, type Listing } from '@/components/marketplace/featured-carousel'
import { CategoryRow, type Category } from '@/components/marketplace/category-row'
import { ListingGrid } from '@/components/marketplace/listing-grid'
import { ListingDetail } from '@/components/marketplace/listing-detail'
import { FavoritesSheet } from '@/components/marketplace/favorites-sheet'

// Next.js image config: allow picsum.photos
const FALLBACK_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2YxZjVmNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5IiBmb250LXNpemU9IjIwIj5JbWFnZTwvdGV4dD48L3N2Zz4='

function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  let sessionId = localStorage.getItem('hmz-session')
  if (!sessionId) {
    sessionId = crypto.randomUUID()
    localStorage.setItem('hmz-session', sessionId)
  }
  return sessionId
}

export default function Home() {
  // Data states
  const [listings, setListings] = useState<Listing[]>([])
  const [featuredListings, setFeaturedListings] = useState<Listing[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // UI states
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
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
        const [listingsRes, featuredRes, categoriesRes] = await Promise.all([
          fetch('/api/listings'),
          fetch('/api/listings/featured'),
          fetch('/api/categories'),
        ])

        const listingsData = await listingsRes.json()
        const featuredData = await featuredRes.json()
        const categoriesData = await categoriesRes.json()

        setListings(listingsData)
        setFeaturedListings(featuredData)
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

  const handleOpenPostAd = useCallback(() => {
    // Placeholder for future post ad functionality
    alert('Post Ad feature coming soon! Contact us to list your property.')
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        favoritesCount={favoriteIds.size}
        onOpenFavorites={() => setFavoritesOpen(true)}
        onOpenPostAd={handleOpenPostAd}
      />

      {/* Main Content */}
      <main className="flex-1 pb-6">
        {/* Featured Carousel */}
        {!searchQuery && activeCategory === 'All' && (
          <FeaturedCarousel
            listings={featuredListings}
            onSelectListing={handleSelectListing}
          />
        )}

        {/* Categories */}
        <CategoryRow
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* Section header */}
        <div className="px-4 py-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold">
            {activeCategory === 'All'
              ? 'All Listings'
              : activeCategory}
            <span className="text-muted-foreground font-normal ml-1.5">
              ({filteredListings.length})
            </span>
          </h2>
          {(searchQuery || activeCategory !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('')
                setActiveCategory('All')
              }}
              className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Listings Grid */}
        <ListingGrid
          listings={filteredListings}
          favorites={favoriteIds}
          onToggleFavorite={toggleFavorite}
          onSelectListing={handleSelectListing}
          isLoading={isLoading}
        />
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-4 mt-auto">
        <div className="px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()}{' '}
            <span className="font-semibold text-foreground">
              Housemate <span className="text-emerald-600">ZM</span>
            </span>{' '}
            — Rent Anything in Zambia
          </p>
          <p>Lusaka · Kitwe · Ndola · Livingstone · Chipata · Kabwe</p>
        </div>
      </footer>

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
