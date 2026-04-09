'use client'

import { Search, Plus, Heart } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface HeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  favoritesCount: number
  onOpenFavorites: () => void
  onOpenPostAd: () => void
}

export function Header({
  searchQuery,
  onSearchChange,
  favoritesCount,
  onOpenFavorites,
  onOpenPostAd,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 h-12 flex items-center px-3 gap-2 bg-white/80 backdrop-blur-md border-b border-border">
      {/* Logo */}
      <div className="flex items-center gap-1 shrink-0">
        <div className="w-6 h-6 rounded-md bg-emerald-500 flex items-center justify-center">
          <span className="text-white font-bold text-xs">H</span>
        </div>
        <span className="font-bold text-sm hidden sm:block">
          Housemate <span className="text-emerald-600">ZM</span>
        </span>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search listings..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-8 pl-8 pr-3 text-sm rounded-full bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-emerald-500/50"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs font-medium hidden sm:flex"
          onClick={onOpenPostAd}
        >
          <Plus className="size-3.5 mr-1" />
          Post Ad
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 relative"
          onClick={onOpenFavorites}
        >
          <Heart className="size-4" />
          {favoritesCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 text-[10px] font-bold bg-emerald-500 text-white rounded-full flex items-center justify-center">
              {favoritesCount > 9 ? '9+' : favoritesCount}
            </span>
          )}
        </Button>
      </div>
    </header>
  )
}
