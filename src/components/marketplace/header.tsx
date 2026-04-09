'use client'

import { Search, MapPin, SlidersHorizontal, ChevronDown } from 'lucide-react'
import { useState } from 'react'

interface HeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  activeView: 'list' | 'map'
  onViewChange: (view: 'list' | 'map') => void
}

export function Header({
  searchQuery,
  onSearchChange,
  activeView,
  onViewChange,
}: HeaderProps) {
  const [showFilters, setShowFilters] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-[#006633]">
      {/* Top bar */}
      <div className="flex items-center px-4 py-3 gap-3">
        {/* Logo */}
        <div className="shrink-0">
          <h1 className="text-white font-bold text-lg tracking-tight">
            Housemate<span className="text-[#4ade80]">.zm</span>
          </h1>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Sign In button */}
        <button className="px-4 py-1.5 rounded-full bg-white text-[#006633] text-xs font-semibold hover:bg-gray-100 transition-colors">
          Sign In
        </button>
      </div>

      {/* Search bar */}
      <div className="px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search location, property type..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-10 pl-9 pr-4 text-sm rounded-lg bg-white text-gray-800 placeholder:text-gray-400 outline-none"
          />
        </div>
      </div>

      {/* Filter buttons row */}
      <div className="px-4 pb-3 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#004d26] text-white text-xs font-medium whitespace-nowrap shrink-0"
        >
          <SlidersHorizontal className="size-3" />
          Filters
        </button>

        <button className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#004d26] text-white text-xs font-medium whitespace-nowrap shrink-0">
          <MapPin className="size-3" />
          Where
          <ChevronDown className="size-3" />
        </button>

        <button className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#004d26] text-white text-xs font-medium whitespace-nowrap shrink-0">
          Type
          <ChevronDown className="size-3" />
        </button>

        <button className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#004d26] text-white text-xs font-medium whitespace-nowrap shrink-0">
          Price Range
          <ChevronDown className="size-3" />
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* List / Map toggle */}
        <div className="flex items-center rounded-full bg-[#004d26] p-0.5 shrink-0">
          <button
            onClick={() => onViewChange('list')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              activeView === 'list'
                ? 'bg-white text-[#006633]'
                : 'text-white/70 hover:text-white'
            }`}
          >
            List
          </button>
          <button
            onClick={() => onViewChange('map')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              activeView === 'map'
                ? 'bg-white text-[#006633]'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Map
          </button>
        </div>
      </div>
    </header>
  )
}
