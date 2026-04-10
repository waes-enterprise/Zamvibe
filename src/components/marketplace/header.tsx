'use client'

import { Search, MapPin, SlidersHorizontal, ChevronDown, User, LogOut, Menu } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

interface UserState {
  id: string
  name: string
  email: string
  phone?: string | null
  avatarUrl?: string | null
  role: string
}

interface HeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  activeView: 'list' | 'map'
  onViewChange: (view: 'list' | 'map') => void
  onOpenProfile?: () => void
}

export function Header({
  searchQuery,
  onSearchChange,
  activeView,
  onViewChange,
  onOpenProfile,
}: HeaderProps) {
  const [showFilters, setShowFilters] = useState(false)
  const [user, setUser] = useState<UserState | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fetch session on mount
  useEffect(() => {
    async function fetchSession() {
      try {
        const res = await fetch('/api/auth/session')
        const data = await res.json()
        if (data.user) {
          setUser(data.user)
        }
      } catch {
        // Ignore errors
      }
    }
    fetchSession()
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      setShowDropdown(false)
      window.location.href = '/'
    } catch {
      // Ignore
    }
  }

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

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

        {/* Auth button / User avatar */}
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2"
            >
              <div className="h-8 w-8 rounded-full bg-[#004d26] border-2 border-white/30 flex items-center justify-center">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white text-xs font-bold">
                    {getInitials(user.name)}
                  </span>
                )}
              </div>
              <ChevronDown className="size-3 text-white/70" />
            </button>

            {/* Dropdown */}
            {showDropdown && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                {/* User info */}
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                  <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>

                {/* Menu items */}
                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowDropdown(false)
                      onOpenProfile?.()
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User className="size-4 text-gray-400" />
                    My Profile
                  </button>
                  <Link
                    href="/my-listings"
                    onClick={() => setShowDropdown(false)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Menu className="size-4 text-gray-400" />
                    My Listings
                  </Link>
                </div>

                {/* Sign out */}
                <div className="border-t border-gray-100 py-1">
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="size-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/auth/signin"
            className="px-4 py-1.5 rounded-full bg-white text-[#006633] text-xs font-semibold hover:bg-gray-100 transition-colors"
          >
            Sign In
          </Link>
        )}
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
