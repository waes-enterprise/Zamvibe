'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Edit, Star, Heart, Calendar, MapPin, Tag, DollarSign } from 'lucide-react'
import { PageHeader } from '@/components/admin/page-header'
import { StatusBadge } from '@/components/admin/status-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import { format } from 'date-fns'

interface ListingDetail {
  id: string
  title: string
  description: string
  price: number
  priceUnit: string
  location: string
  category: string
  imageUrl: string
  tier: string
  status: string
  isFeatured: boolean
  isApproved: boolean
  createdAt: string
  updatedAt: string
  contactPhone?: string
  contactEmail?: string
  owner: { id: string; name: string; email: string; phone?: string } | null
  categoryRef?: { id: string; name: string; slug: string; icon?: string } | null
  _count: { favorites: number }
}

export default function AdminListingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [listing, setListing] = useState<ListingDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchListing() {
      try {
        const res = await fetch(`/api/admin/listings/${id}`)
        if (res.ok) {
          const data = await res.json()
          setListing(data.listing || data)
        } else {
          toast.error('Listing not found')
        }
      } catch {
        toast.error('Failed to load listing')
      } finally {
        setLoading(false)
      }
    }
    fetchListing()
  }, [id])

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-80 rounded-xl" />
          <div className="space-y-6">
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="space-y-6">
        <PageHeader title="Listing Not Found" icon={Tag} />
        <Card className="rounded-xl border bg-white shadow-sm">
          <CardContent className="p-12 text-center">
            <p className="text-gray-500 mb-4">The listing you&apos;re looking for doesn&apos;t exist or has been removed.</p>
            <Button variant="outline" onClick={() => router.push('/admin/listings')}>
              Back to Listings
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push('/admin/listings')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <PageHeader
          title={listing.title}
          description={listing.location}
          icon={Tag}
          action={
            <Button
              onClick={() => router.push(`/admin/listings/${id}/edit`)}
              className="bg-[#006633] hover:bg-[#004d26] text-white"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Image */}
        <div className="lg:col-span-1">
          <Card className="rounded-xl border bg-white shadow-sm overflow-hidden">
            {listing.imageUrl ? (
              <img
                src={listing.imageUrl}
                alt={listing.title}
                className="w-full aspect-[4/3] object-cover"
              />
            ) : (
              <div className="w-full aspect-[4/3] bg-gray-100 flex items-center justify-center">
                <Tag className="w-12 h-12 text-gray-300" />
              </div>
            )}
          </Card>
        </div>

        {/* Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Listing Info */}
          <Card className="rounded-xl border bg-white shadow-sm">
            <CardContent className="p-6 space-y-5">
              <h3 className="font-semibold text-gray-900">Listing Details</h3>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* Price */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Price</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    K{listing.price.toLocaleString()}
                    <span className="text-sm font-normal text-gray-400">/{listing.priceUnit}</span>
                  </p>
                </div>

                {/* Category */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Category</span>
                  </div>
                  <Badge variant="secondary" className="font-medium">
                    {listing.categoryRef?.name || listing.category}
                  </Badge>
                </div>

                {/* Location */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Location</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{listing.location}</p>
                </div>

                {/* Tier */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Star className="w-3.5 h-3.5" />
                    <span>Tier</span>
                  </div>
                  <StatusBadge type="tier" value={listing.tier} />
                </div>

                {/* Status */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <span>Status</span>
                  </div>
                  <StatusBadge type="status" value={listing.status} />
                </div>

                {/* Favorites */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Heart className="w-3.5 h-3.5" />
                    <span>Favorites</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {listing._count.favorites} {listing._count.favorites === 1 ? 'favorite' : 'favorites'}
                  </p>
                </div>

                {/* Featured */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Star className="w-3.5 h-3.5" />
                    <span>Featured</span>
                  </div>
                  <p className="text-sm font-medium">
                    {listing.isFeatured ? (
                      <span className="text-amber-600 flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> Yes
                      </span>
                    ) : (
                      <span className="text-gray-400">No</span>
                    )}
                  </p>
                </div>

                {/* Created */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Created</span>
                  </div>
                  <p className="text-sm text-gray-900">
                    {format(new Date(listing.createdAt), 'MMM d, yyyy')}
                  </p>
                </div>

                {/* Updated */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Updated</span>
                  </div>
                  <p className="text-sm text-gray-900">
                    {format(new Date(listing.updatedAt), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-xs text-gray-400 mb-1">Description</p>
                <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                  {listing.description}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Owner */}
          {listing.owner && (
            <Card className="rounded-xl border bg-white shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Owner</h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#006633]/10 flex items-center justify-center">
                    <span className="text-[#006633] font-semibold text-sm">
                      {listing.owner.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{listing.owner.name}</p>
                    <p className="text-xs text-gray-500">{listing.owner.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contact Information */}
          <Card className="rounded-xl border bg-white shadow-sm">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Phone</p>
                  <p className="text-sm font-medium text-gray-900">
                    {listing.contactPhone || 'Not provided'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Email</p>
                  <p className="text-sm font-medium text-gray-900">
                    {listing.contactEmail || 'Not provided'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
