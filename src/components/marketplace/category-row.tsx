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
    <section className="px-4 py-3">
      <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const Icon = iconMap[cat.icon] || LayoutGrid
          const isActive = activeCategory === cat.name

          return (
            <button
              key={cat.name}
              onClick={() => onCategoryChange(cat.name)}
              className="flex flex-col items-center gap-1.5 shrink-0 group"
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                  isActive
                    ? 'bg-[#006633] text-white'
                    : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
                }`}
              >
                <Icon className="size-5" />
              </div>
              <span
                className={`text-[10px] font-medium whitespace-nowrap ${
                  isActive ? 'text-[#006633]' : 'text-gray-500'
                }`}
              >
                {cat.name}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
