'use client'

import {
  Home,
  Tractor,
  Building2,
  Warehouse,
  PartyPopper,
  Car,
  Mountain,
  Store,
  CircleParking,
  LayoutGrid,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface Category {
  name: string
  icon: string
}

const iconMap: Record<string, LucideIcon> = {
  LayoutGrid,
  Home,
  Tractor,
  Building2,
  Warehouse,
  PartyPopper,
  Car,
  Mountain,
  Store,
  CircleParking,
}

interface CategoryRowProps {
  categories: Category[]
  activeCategory: string
  onCategoryChange: (category: string) => void
}

export function CategoryRow({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryRowProps) {
  return (
    <section className="px-4 py-2">
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const Icon = iconMap[cat.icon] || LayoutGrid
          const isActive = activeCategory === cat.name

          return (
            <button
              key={cat.name}
              onClick={() => onCategoryChange(cat.name)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors shrink-0 ${
                isActive
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <Icon className="size-3.5" />
              {cat.name}
            </button>
          )
        })}
      </div>
    </section>
  )
}
