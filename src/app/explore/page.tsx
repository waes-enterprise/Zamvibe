'use client'

import { useState, useEffect, useCallback, useMemo, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Search, SlidersHorizontal, X, Heart, Star, MapPin, ChevronDown, ArrowUpDown, Home } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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

function getRating(id: string): number {
  const hash = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return 3.5 + (hash % 15) / 10
}

const CATEGORIES = [
  'All', 'Rooms', 'Farms', 'Offices', 'Storage', 'Event Spaces',
  'Garages', 'Warehouses', 'Land', 'Shops', 'Parking', 'Other',
]

const TIERS = ['All', 'Standard', 'Featured', 'Spotlight', 'Premium']

const PRICE_RANGES = [
  { label: 'Any', min: '', max: '' },
  { label: 'Under K1,000', min: '', max: '1000' },
  { label: 'K1,000 - K3,000', min: '1000', max: '3000' },
  { label: 'K3,000 - K5,000', min: '3000', max: '5000' },
  { label: 'K5,000 - K10,000', min: '5000', max: '10000' },
  { label: 'K10,000 - K20,000', min: '10000', max: '20000' },
  { label: 'Over K20,000', min: '20000', max: '' },
]

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'top', label: 'Top Rated' },
]

const ITEMS_PER_PAGE = 12

function ExplorePageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // URL params on mount
  const initialQuery = searchParams.get('q') || ''
  const initialCategory = searchParams.get('category') || ''
  const initialTier = searchParams.get('tier') || ''
  const initialMinPrice = searchParams.get('minPrice') || ''
  const initialMaxPrice = searchParams.get('maxPrice') || ''
  const initialSort = searchParams.get('sort') || ''

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [category, setCategory] = useState(initialCategory)
  const [tier, setTier] = useState(initialTier)
  const [priceRange, setPriceRange] = useState(() => {
    if (initialMinPrice || initialMaxPrice) {
      const found = PRICE_RANGES.find(
        r => r.min === initialMinPrice && r.max === initialMaxPrice
      )
      return found?.label || 'Any'
    }
    return 'Any'
  })
  const [sort, setSort] = useState(initialSort || 'newest')

  // UI state
  const [listings, setListings] = useState<Listing[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [filterSheetOpen, setFilterSheetOpen] = useState(false)

  // Temporary filter state (for sheet)
  const [tempCategory, setTempCategory] = useState(initialCategory || 'All')
  const [tempTier, setTempTier] = useState(initialTier || 'All')
  const [tempPriceRange, setTempPriceRange] = useState(() => {
    if (initialMinPrice || initialMaxPrice) {
      const found = PRICE_RANGES.find(
        r => r.min === initialMinPrice && r.max === initialMaxPrice
      )
      return found?.label || 'Any'
    }
    return 'Any'
  })

  const sessionId = getSessionId()

  // Check auth on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/session')
        const data = await res.json()
        setIsAuthenticated(!!data.user)
      } catch {
        // Not authenticated
      }
    }
    checkAuth()
  }, [])

  // Fetch favorites on mount
  useEffect(() => {
    async function fetchFavorites() {
      try {
        const urlParam = isAuthenticated ? '' : `?sessionId=${sessionId}`
        const res = await fetch(`/api/favorites${urlParam}`)
        const data = await res.json()
        setFavorites(new Set((data || []).map((f: Listing) => f.id)))
      } catch {
        // Ignore
      }
    }
    fetchFavorites()
  }, [sessionId, isAuthenticated])

  // Parse current price range
  const currentPriceRange = useMemo(() => {
    return PRICE_RANGES.find(r => r.label === priceRange) || PRICE_RANGES[0]
  }, [priceRange])

  // Build API query params
  const buildQueryParams = useCallback(() => {
    const params: Record<string, string> = {}
    if (searchQuery.trim()) params.search = searchQuery.trim()
    if (category && category !== 'All') params.category = category
    if (tier && tier !== 'All') params.tier = tier.toLowerCase()
    if (currentPriceRange.min) params.minPrice = currentPriceRange.min
    if (currentPriceRange.max) params.maxPrice = currentPriceRange.max
    return params
  }, [searchQuery, category, tier, currentPriceRange])

  // Fetch listings
  useEffect(() => {
    async function fetchListings() {
      setIsLoading(true)
      try {
        const params = buildQueryParams()
        const qs = new URLSearchParams(params).toString()
        const res = await fetch(`/api/listings${qs ? `?${qs}` : ''}`)
        const data = await res.json()
        setListings(Array.isArray(data) ? data : [])
        setDisplayCount(ITEMS_PER_PAGE)
      } catch (error) {
        console.error('Failed to fetch listings:', error)
        setListings([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchListings()
  }, [buildQueryParams])

  // Sort listings client-side
  const sortedListings = useMemo(() => {
    const sorted = [...listings]
    switch (sort) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price)
        break
      case 'top':
        sorted.sort((a, b) => getRating(b.id) - getRating(a.id))
        break
      case 'newest':
      default:
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
    }
    return sorted
  }, [listings, sort])

  const displayedListings = sortedListings.slice(0, displayCount)
  const hasMore = displayCount < sortedListings.length

  // Active filters check
  const hasActiveFilters = (category && category !== 'All') ||
    (tier && tier !== 'All') ||
    priceRange !== 'Any' ||
    searchQuery.trim().length > 0

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setSearchQuery('')
    setCategory('All')
    setTier('All')
    setPriceRange('Any')
    setSort('newest')
    setTempCategory('All')
    setTempTier('All')
    setTempPriceRange('Any')
    router.push('/explore', { scroll: false })
  }, [router])

  // Remove individual filter
  const removeFilter = useCallback((type: 'category' | 'tier' | 'price' | 'search') => {
    switch (type) {
      case 'category':
        setCategory('All')
        setTempCategory('All')
        break
      case 'tier':
        setTier('All')
        setTempTier('All')
        break
      case 'price':
        setPriceRange('Any')
        setTempPriceRange('Any')
        break
      case 'search':
        setSearchQuery('')
        break
    }
  }, [])

  // Apply filters from sheet
  const applyFilters = useCallback(() => {
    setCategory(tempCategory === 'All' ? '' : tempCategory)
    setTier(tempTier === 'All' ? '' : tempTier)
    setPriceRange(tempPriceRange)
    setFilterSheetOpen(false)
  }, [tempCategory, tempTier, tempPriceRange])

  // Reset sheet filters
  const resetSheetFilters = useCallback(() => {
    setTempCategory('All')
    setTempTier('All')
    setTempPriceRange('Any')
  }, [])

  // Toggle favorite
  const toggleFavorite = useCallback(async (listingId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    const isFav = favorites.has(listingId)

    try {
      if (isFav) {
        const urlParam = isAuthenticated
          ? `?listingId=${listingId}`
          : `?listingId=${listingId}&sessionId=${sessionId}`
        await fetch(`/api/favorites${urlParam}`, { method: 'DELETE' })
        setFavorites(prev => {
          const next = new Set(prev)
          next.delete(listingId)
          return next
        })
      } else {
        await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ listingId, sessionId: isAuthenticated ? undefined : sessionId }),
        })
        setFavorites(prev => new Set(prev).add(listingId))
      }
    } catch {
      // Ignore
    }
  }, [sessionId, isAuthenticated, favorites])

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa]">
      {/* A. Green Header Bar */}
      <header className="sticky top-0 z-40 bg-[#006633]">
        <div className="flex items-center px-4 py-3 gap-3">
          {/* Back + Logo */}
          <button
            onClick={() => router.push('/')}
            className="shrink-0 flex items-center gap-1"
          >
            <Home className="size-5 text-white" />
          </button>
          <h1 className="text-white font-bold text-lg tracking-tight shrink-0">
            Housemate<span className="text-[#4ade80]">.zm</span>
          </h1>
        </div>

        {/* Search bar - wider and prominent */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search location, property type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-12 text-sm rounded-xl bg-white text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-white/30 transition-shadow"
            />
            {/* Filter button inside search */}
            <button
              onClick={() => setFilterSheetOpen(true)}
              className={`absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${
                hasActiveFilters
                  ? 'bg-[#006633] text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              <SlidersHorizontal className="size-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        {/* B. Active Filters Bar */}
        {hasActiveFilters && (
          <div className="px-4 py-2.5 bg-white border-b border-gray-100">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-0.5">
              {searchQuery.trim() && (
                <FilterChip
                  label={`"${searchQuery.trim()}"`}
                  onRemove={() => removeFilter('search')}
                />
              )}
              {category && category !== 'All' && (
                <FilterChip
                  label={category}
                  onRemove={() => removeFilter('category')}
                />
              )}
              {tier && tier !== 'All' && (
                <FilterChip
                  label={tier}
                  onRemove={() => removeFilter('tier')}
                />
              )}
              {priceRange !== 'Any' && (
                <FilterChip
                  label={priceRange}
                  onRemove={() => removeFilter('price')}
                />
              )}
              <button
                onClick={clearAllFilters}
                className="text-[11px] font-semibold text-[#006633] whitespace-nowrap ml-1 hover:text-[#004d26] transition-colors"
              >
                Clear all
              </button>
            </div>
          </div>
        )}

        {/* C. Results Info Bar */}
        {!isLoading && (
          <div className="px-4 py-3 flex items-center justify-between">
            <p className="text-xs text-gray-500 font-medium">
              {sortedListings.length} listing{sortedListings.length !== 1 ? 's' : ''} found
            </p>
            <div className="flex items-center gap-1.5">
              <ArrowUpDown className="size-3.5 text-gray-400" />
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="h-8 text-xs border-gray-200 bg-white w-auto min-w-[130px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Loading State - Skeleton Grid */}
        {isLoading && (
          <div className="px-4 pb-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                  <Skeleton className="aspect-[3/2] w-full" />
                  <div className="p-3 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-3 w-2/3" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* D. Results Grid */}
        {!isLoading && displayedListings.length > 0 && (
          <div className="px-4 pb-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {displayedListings.map(listing => (
                <ExploreCard
                  key={listing.id}
                  listing={listing}
                  isFavorited={favorites.has(listing.id)}
                  onToggleFavorite={toggleFavorite}
                  onClick={() => router.push(`/listings/${listing.id}`)}
                />
              ))}
            </div>

            {/* F. Load More */}
            {hasMore && (
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => setDisplayCount(prev => prev + ITEMS_PER_PAGE)}
                  className="px-8 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                >
                  Load More ({sortedListings.length - displayCount} remaining)
                </button>
              </div>
            )}
          </div>
        )}

        {/* H. Empty State */}
        {!isLoading && displayedListings.length === 0 && (
          <div className="flex flex-col items-center justify-center px-4 py-20">
            <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Search className="size-8 text-gray-300" />
            </div>
            <h3 className="text-base font-semibold text-gray-700 mb-1">
              No listings found
            </h3>
            <p className="text-sm text-gray-400 mb-6 text-center">
              Try adjusting your search or filters
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="px-6 py-2.5 rounded-xl bg-[#006633] text-white text-sm font-semibold hover:bg-[#004d26] transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </main>

      {/* E. Filters Sheet */}
      <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl max-h-[85vh] overflow-y-auto px-4 pb-8">
          <SheetHeader className="pb-2">
            <SheetTitle className="text-base font-bold text-gray-900">Filters</SheetTitle>
            <SheetDescription>Refine your search results</SheetDescription>
          </SheetHeader>

          <div className="space-y-6 mt-2">
            {/* Category Filter */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 block">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setTempCategory(cat)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                      tempCategory === cat
                        ? 'bg-[#006633] text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Price Range */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 block">
                Price Range
              </label>
              <div className="flex flex-wrap gap-2">
                {PRICE_RANGES.map(range => (
                  <button
                    key={range.label}
                    onClick={() => setTempPriceRange(range.label)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                      tempPriceRange === range.label
                        ? 'bg-[#006633] text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Tier Filter */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 block">
                Tier
              </label>
              <div className="flex flex-wrap gap-2">
                {TIERS.map(t => (
                  <button
                    key={t}
                    onClick={() => setTempTier(t)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                      tempTier === t
                        ? 'bg-[#006633] text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={resetSheetFilters}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Reset
              </button>
              <button
                onClick={applyFilters}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-white bg-[#006633] hover:bg-[#004d26] transition-colors shadow-sm"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

// Filter chip component
function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full bg-[#006633]/10 text-[#006633] text-[11px] font-semibold whitespace-nowrap shrink-0">
      {label}
      <button
        onClick={onRemove}
        className="h-4 w-4 rounded-full bg-[#006633]/20 flex items-center justify-center hover:bg-[#006633]/30 transition-colors"
      >
        <X className="size-2.5" />
      </button>
    </span>
  )
}

// Explore card (inline, no dialog behavior)
function ExploreCard({
  listing,
  isFavorited,
  onToggleFavorite,
  onClick,
}: {
  listing: Listing
  isFavorited: boolean
  onToggleFavorite: (listingId: string, e: React.MouseEvent) => void
  onClick: () => void
}) {
  const rating = getRating(listing.id)

  return (
    <div
      className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-100"
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative aspect-[3/2] overflow-hidden bg-gray-100">
        <img
          src={listing.imageUrl}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Tier badge */}
        {listing.tier !== 'standard' && (
          <span className="absolute top-2 left-2 inline-flex items-center gap-0.5 bg-[#006633] text-white text-[9px] font-semibold px-1.5 py-0.5 rounded">
            Verified
          </span>
        )}

        {/* Heart button */}
        <button
          onClick={(e) => onToggleFavorite(listing.id, e)}
          className="absolute top-2 right-2 h-7 w-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors"
        >
          <Heart
            className={`size-3.5 transition-colors ${
              isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400'
            }`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-2.5 space-y-1">
        {/* Title */}
        <h3 className="text-[13px] font-semibold text-gray-900 line-clamp-2 leading-snug">
          {listing.title}
        </h3>

        {/* Category + Rating */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-gray-500 font-medium">{listing.category}</span>
          <div className="flex items-center gap-0.5">
            <Star className="size-3 fill-amber-400 text-amber-400" />
            <span className="text-[11px] font-semibold text-gray-700">{rating.toFixed(1)}</span>
          </div>
        </div>

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
  )
}

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f8f9fa]">
          <header className="sticky top-0 z-40 bg-[#006633] h-24" />
          <div className="px-4 py-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                  <Skeleton className="aspect-[3/2] w-full" />
                  <div className="p-3 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-3 w-2/3" />
                    <Skeleton className="h-4 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <ExplorePageContent />
    </Suspense>
  )
}
