'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  MapPin,
  Star,
  Phone,
  Clock,
  Wifi,
  Car,
  Waves,
  UtensilsCrossed,
  Snowflake,
  Wine,
  Loader2,
  AlertCircle,
  Navigation,
  Shield,
  CheckCircle2,
  BedDouble,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface Lodge {
  id: string;
  name: string;
  description: string;
  location: string;
  address: string;
  phone: string;
  price: number;
  priceUnit: string;
  rating: number;
  gradient: string;
  availability: string;
  amenities: string[];
  totalRooms: number;
  activeReservations: number;
}

const AMENITY_MAP: Record<string, { icon: React.ReactNode; label: string }> = {
  WiFi: { icon: <Wifi className="w-4 h-4" />, label: 'WiFi' },
  Parking: { icon: <Car className="w-4 h-4" />, label: 'Parking' },
  Pool: { icon: <Waves className="w-4 h-4" />, label: 'Pool' },
  Restaurant: { icon: <UtensilsCrossed className="w-4 h-4" />, label: 'Restaurant' },
  AC: { icon: <Snowflake className="w-4 h-4" />, label: 'Air Conditioning' },
  Bar: { icon: <Wine className="w-4 h-4" />, label: 'Bar' },
  Breakfast: { icon: <UtensilsCrossed className="w-4 h-4" />, label: 'Breakfast' },
};

function getImageSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');
}

export default function LodgeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [lodge, setLodge] = useState<Lodge | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Reservation modal state
  const [showModal, setShowModal] = useState(false);
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchLodge();
  }, [id]);

  const fetchLodge = async () => {
    try {
      const res = await fetch(`/api/lodges/${id}`);
      if (!res.ok) {
        setError(true);
        return;
      }
      const data = await res.json();
      setLodge(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case 'LIKELY_AVAILABLE':
        return {
          label: 'Available tonight',
          color: 'bg-green-500/90 text-white',
          dot: 'bg-green-300',
          urgency: null,
        };
      case 'CHECK':
        return {
          label: 'Filling fast',
          color: 'bg-amber-500/90 text-white',
          dot: 'bg-amber-300',
          urgency: 'Rooms are booking up quickly',
        };
      case 'LIKELY_FULL':
        return {
          label: '2 rooms left',
          color: 'bg-red-500/90 text-white',
          dot: 'bg-red-300',
          urgency: 'Only 2 rooms remaining tonight',
        };
      default:
        return {
          label: 'Check Availability',
          color: 'bg-slate-500/90 text-white',
          dot: 'bg-slate-300',
          urgency: null,
        };
    }
  };

  const roomsAvailable = lodge ? Math.max(0, lodge.totalRooms - (lodge.activeReservations || 0)) : 0;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.round(rating)
            ? 'fill-amber-400 text-amber-400'
            : 'fill-gray-200 text-gray-200'
        }`}
      />
    ));
  };

  const handleReserve = async () => {
    if (!formName.trim() || !formPhone.trim()) {
      toast.error('Please fill in your name and phone number');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lodgeId: id,
          userName: formName.trim(),
          userContact: formPhone.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Failed to create reservation');
        return;
      }

      toast.success('Reservation request sent!');
      router.push(`/reservations/${data.id}`);
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Skeleton className="h-72 w-full" />
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
          <Skeleton className="h-8 w-3/4 rounded-xl" />
          <Skeleton className="h-4 w-1/2 rounded-lg" />
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
        </div>
      </div>
    );
  }

  // Error state
  if (error || !lodge) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 rounded-3xl bg-red-50 flex items-center justify-center mx-auto mb-5">
            <AlertCircle className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Lodge not found</h2>
          <p className="text-sm text-slate-500 mb-6 max-w-xs mx-auto">
            This lodge may have been removed or doesn&apos;t exist.
          </p>
          <Link href="/lodges">
            <Button className="rounded-xl bg-slate-900 hover:bg-slate-800">
              Browse All Lodges
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const badge = getAvailabilityBadge(lodge.availability);
  const imageSlug = getImageSlug(lodge.name);

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Hero image */}
      <div className="relative h-72 sm:h-80">
        {!imgError ? (
          <img
            src={`/lodges/${imageSlug}.jpg`}
            alt={lodge.name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${lodge.gradient}`} />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/10" />

        {/* Back button */}
        <div className="absolute top-4 left-4 z-10">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-xl bg-white/90 hover:bg-white shadow-sm backdrop-blur-sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </Button>
        </div>

        {/* Availability badge */}
        <div className="absolute top-4 right-4 z-10">
          <Badge
            className={`text-xs font-semibold px-3 py-1.5 rounded-full ${badge.color} backdrop-blur-sm shadow-sm flex items-center gap-1.5`}
          >
            <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
            {badge.label}
          </Badge>
        </div>

        {/* MapPin icon center */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <MapPin className="w-16 h-16 text-white/15" />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 -mt-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Main info card */}
          <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 mb-4">
            <div className="flex items-start gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex-1">
                {lodge.name}
              </h1>
              {/* Verified badge */}
              <Badge
                variant="outline"
                className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full border-green-200 bg-green-50 text-green-700"
              >
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            </div>

            <div className="flex items-center gap-1.5 mt-2">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-500">{lodge.location}</span>
              <span className="text-slate-300 mx-1">·</span>
              <span className="text-sm text-slate-400">{lodge.address}</span>
            </div>

            {/* Rating & Price */}
            <div className="flex items-center justify-between mt-5">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">{renderStars(lodge.rating)}</div>
                <span className="text-sm font-semibold text-slate-700">{lodge.rating}</span>
                <span className="text-xs text-slate-400 ml-1">
                  ({Math.floor(Math.random() * 50) + 20} reviews)
                </span>
              </div>
              <div className="text-right">
                <span className="text-2xl sm:text-3xl font-bold text-slate-900">
                  K{lodge.price.toLocaleString()}
                </span>
                <span className="text-sm text-slate-400 ml-1">/{lodge.priceUnit}</span>
              </div>
            </div>

            {/* Rooms available */}
            <div className="flex items-center gap-2 mt-4">
              <BedDouble className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-500">
                <span className="font-semibold text-slate-700">{roomsAvailable}</span> rooms available tonight
              </span>
            </div>
          </div>

          {/* Urgency info box */}
          {badge.urgency && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4 flex items-start gap-3"
            >
              <Clock className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-amber-800">{badge.urgency}</p>
                <p className="text-xs text-amber-600 mt-0.5">
                  Reservation expires in 45 minutes. Book now to secure your room.
                </p>
              </div>
            </motion.div>
          )}

          {/* Trust signals */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-700">Verified location</div>
                <div className="text-[10px] text-slate-400">Confirmed by StayNow</div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-700">Instant confirmation</div>
                <div className="text-[10px] text-slate-400">No payment needed</div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 mb-4">
            <h2 className="font-bold text-slate-900 mb-3">About this lodge</h2>
            <p className="text-sm text-slate-600 leading-relaxed">{lodge.description}</p>
          </div>

          {/* Amenities */}
          {lodge.amenities && lodge.amenities.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 mb-4">
              <h2 className="font-bold text-slate-900 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {lodge.amenities.map((amenity) => {
                  const amenityInfo = AMENITY_MAP[amenity];
                  return (
                    <div
                      key={amenity}
                      className="flex items-center gap-2.5 bg-gray-50 rounded-xl px-3.5 py-3"
                    >
                      <span className="text-amber-500">
                        {amenityInfo?.icon || <CheckCircle2 className="w-4 h-4" />}
                      </span>
                      <span className="text-sm font-medium text-slate-700">
                        {amenityInfo?.label || amenity}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Map placeholder */}
          <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 mb-4">
            <h2 className="font-bold text-slate-900 mb-4">Location</h2>
            <div className="h-44 bg-gray-100 rounded-xl flex flex-col items-center justify-center gap-2.5 border border-gray-200 border-dashed">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <Navigation className="w-6 h-6 text-amber-500" />
              </div>
              <span className="text-sm font-medium text-slate-500">Map coming soon</span>
              <span className="text-xs text-slate-400">{lodge.address}</span>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 mb-4">
            <h2 className="font-bold text-slate-900 mb-4">Contact</h2>
            <a
              href={`tel:${lodge.phone}`}
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-green-50 transition-colors group"
            >
              <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <Phone className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-slate-900">{lodge.phone}</div>
                <div className="text-xs text-slate-400">Tap to call</div>
              </div>
              <span className="text-xs font-semibold text-green-600 opacity-0 group-hover:opacity-100 transition-opacity">
                Call now →
              </span>
            </a>
          </div>
        </motion.div>
      </div>

      {/* Fixed bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <a
              href={`tel:${lodge.phone}`}
              className="shrink-0"
            >
              <Button
                size="lg"
                className="h-13 px-5 sm:px-6 bg-green-600 hover:bg-green-500 text-white rounded-xl font-semibold shadow-lg shadow-green-600/20 transition-all"
              >
                <Phone className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Call lodge</span>
                <span className="sm:hidden">Call</span>
              </Button>
            </a>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-slate-400">Price per night</div>
              <div className="font-bold text-slate-900 text-lg">
                K{lodge.price.toLocaleString()}
                <span className="text-xs text-slate-400 font-normal ml-1">/{lodge.priceUnit}</span>
              </div>
            </div>
            <Button
              size="lg"
              onClick={() => setShowModal(true)}
              className="h-13 px-6 sm:px-8 bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-xl font-semibold shadow-lg shadow-amber-500/25 transition-all"
            >
              <Clock className="w-4 h-4 mr-2" />
              Reserve Now
            </Button>
          </div>
        </div>
      </div>

      {/* Reservation Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md mx-4 rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl">Request Reservation</DialogTitle>
            <DialogDescription className="text-slate-500">
              Enter your details to request a stay at {lodge.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Lodge summary in modal */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-white/70" />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-sm text-slate-900 truncate">
                  {lodge.name}
                </div>
                <div className="text-xs text-slate-500">
                  {lodge.location} · K{lodge.price.toLocaleString()}/{lodge.priceUnit}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                  Full Name
                </Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="mt-1.5 h-11 rounded-xl"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-sm font-medium text-slate-700">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  placeholder="+260 9XX XXX XXX"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="mt-1.5 h-11 rounded-xl"
                />
              </div>
            </div>

            {/* Info notice */}
            <div className="flex items-start gap-2.5 p-3.5 bg-amber-50 rounded-xl border border-amber-100">
              <Clock className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-amber-700 leading-relaxed">
                Your reservation will be valid for <strong>45 minutes</strong>. The lodge
                will confirm or reject your request. No payment required.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setShowModal(false)}
                className="flex-1 h-11 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={handleReserve}
                disabled={submitting || !formName.trim() || !formPhone.trim()}
                className="flex-1 h-11 bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-xl font-semibold"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Request Stay'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
