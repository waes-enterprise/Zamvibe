'use client'

import { Home, Heart, MessageCircle, UserCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export type TabType = 'explore' | 'saved' | 'inbox' | 'profile'

interface BottomNavProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
  savedCount: number
  onOpenFavorites: () => void
}

const tabs: { id: TabType; label: string; icon: typeof Home }[] = [
  { id: 'explore', label: 'Explore', icon: Home },
  { id: 'saved', label: 'Saved', icon: Heart },
  { id: 'inbox', label: 'Inbox', icon: MessageCircle },
  { id: 'profile', label: 'Profile', icon: UserCircle },
]

export function BottomNav({ activeTab, onTabChange, savedCount, onOpenFavorites }: BottomNavProps) {
  const router = useRouter()

  const handleClick = (tab: TabType) => {
    if (tab === 'saved') {
      onOpenFavorites()
      return
    }
    if (tab === 'profile') {
      router.push('/profile')
      return
    }
    if (tab === 'inbox') {
      // Future: inbox page
      return
    }
    onTabChange(tab)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around py-1.5 px-4 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => handleClick(tab.id)}
              className="relative flex flex-col items-center gap-0.5 py-1 px-3"
            >
              <div className="relative">
                <Icon
                  className={`size-5 transition-colors ${
                    isActive ? 'text-[#006633]' : 'text-gray-400'
                  }`}
                />
                {tab.id === 'saved' && savedCount > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 h-4 min-w-4 px-1 text-[9px] font-bold bg-red-500 text-white rounded-full flex items-center justify-center">
                    {savedCount > 9 ? '9+' : savedCount}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] font-medium transition-colors ${
                  isActive ? 'text-[#006633]' : 'text-gray-400'
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-[#006633]" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
