'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  Heart,
  LogOut,
  ShieldCheck,
  Loader2,
  Settings,
} from 'lucide-react'
import Link from 'next/link'

interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string | null
  avatarUrl?: string | null
  role: string
  createdAt: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [favoriteCount, setFavoriteCount] = useState(0)
  const [listingCount, setListingCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [sessionRes, favRes, listingRes] = await Promise.all([
          fetch('/api/auth/session'),
          fetch('/api/favorites'),
          fetch('/api/listings'),
        ])

        const sessionData = await sessionRes.json()
        const favData = await favRes.json()
        const listingData = await listingRes.json()

        if (!sessionData.user) {
          router.push('/auth/signin')
          return
        }

        setUser(sessionData.user)
        setFavoriteCount(Array.isArray(favData) ? favData.length : 0)
        setListingCount(Array.isArray(listingData) ? listingData.length : 0)
      } catch {
        router.push('/auth/signin')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleSignOut = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  const getInitials = (name: string) => {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-ZM', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <Loader2 className="size-6 text-[#006633] animate-spin" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      {/* Header */}
      <div className="bg-[#006633] px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => router.push('/')}
          className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center"
        >
          <ArrowLeft className="size-4 text-white" />
        </button>
        <h1 className="text-white font-bold text-lg">Profile</h1>
      </div>

      <div className="flex-1 px-4 py-6 max-w-md mx-auto w-full space-y-4">
        {/* Avatar & Name */}
        <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
          <div className="mx-auto w-20 h-20 rounded-full bg-[#006633] border-4 border-[#006633]/10 flex items-center justify-center mb-4">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-white text-2xl font-bold">
                {getInitials(user.name)}
              </span>
            )}
          </div>
          <h2 className="text-lg font-bold text-gray-900">{user.name}</h2>
          <div className="flex items-center justify-center gap-1.5 mt-1">
            {user.role === 'admin' && (
              <span className="inline-flex items-center gap-1 bg-[#006633]/10 text-[#006633] text-[10px] font-semibold px-2 py-0.5 rounded-full">
                <ShieldCheck className="size-3" />
                Admin
              </span>
            )}
            <span className="text-sm text-gray-500">{user.email}</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Member since {formatDate(user.createdAt)}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
            <Heart className="size-5 text-red-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-gray-900">{favoriteCount}</p>
            <p className="text-[10px] text-gray-500">Saved</p>
          </div>
          <Link href="/" className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors">
            <ShieldCheck className="size-5 text-[#006633] mx-auto mb-1" />
            <p className="text-lg font-bold text-gray-900">{listingCount}</p>
            <p className="text-[10px] text-gray-500">Listings</p>
          </Link>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
            <Settings className="size-5 text-gray-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-gray-900">0</p>
            <p className="text-[10px] text-gray-500">Reviews</p>
          </div>
        </div>

        {/* Info sections */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50">
          <div className="px-4 py-3.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
              <User className="size-4 text-gray-500" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Full Name</p>
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
            </div>
          </div>

          <div className="px-4 py-3.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
              <Mail className="size-4 text-gray-500" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Email</p>
              <p className="text-sm font-medium text-gray-900">{user.email}</p>
            </div>
          </div>

          <div className="px-4 py-3.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
              <Phone className="size-4 text-gray-500" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Phone</p>
              <p className="text-sm font-medium text-gray-900">
                {user.phone || 'Not provided'}
              </p>
            </div>
          </div>

          <div className="px-4 py-3.5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
              <Calendar className="size-4 text-gray-500" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Joined</p>
              <p className="text-sm font-medium text-gray-900">{formatDate(user.createdAt)}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50">
          <Link
            href="/"
            className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors"
          >
            <Heart className="size-4 text-red-500" />
            <span className="text-sm font-medium text-gray-700">My Saved Listings</span>
          </Link>
          <Link
            href="/"
            className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors"
          >
            <Settings className="size-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Account Settings</span>
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-red-50 transition-colors"
          >
            <LogOut className="size-4 text-red-500" />
            <span className="text-sm font-medium text-red-600">Sign Out</span>
          </button>
        </div>

        {/* App version */}
        <p className="text-center text-[10px] text-gray-400 pt-2">
          Housemate ZM v1.0.0
        </p>
      </div>
    </div>
  )
}
