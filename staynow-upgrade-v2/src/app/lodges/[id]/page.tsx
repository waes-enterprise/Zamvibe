'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Star,
  MapPin,
  Phone,
  Shield,
  CheckCircle2,
  Clock,
  CreditCard,
  Wifi,
  Car,
  Waves,
  UtensilsCrossed,
  Wind,
  Wine,
  Coffee,
  Users,
  Navigation,
  Loader2,
  AlertTriangle,
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
import { useToast } from '@/hooks/use-toast';

interface Lodge {
  id: string;
  name: string;
  description: string;
  location: string;
  address: string;
  phone: string;
  price: number;
  priceUnit: string;
  latitude: number | null;
  longitude: number | null;
  amenities: string[];
  rating: number;
  totalRooms: number;
  gradient: string;
  activeReservations: number;
  availability: string;
}

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  WiFi: <Wifi className="w-4 h-4" />,
  Pool: <Waves className="w-4 h-4" />,
  Breakfast: <Coffee className="w-4 h-4" />,
  Parking: <Car className="w-4 h-4" />,
  AC: <Wind className="w-4 h-4" />,
  Restaurant: <UtensilsCrossed className="w-4 h-4" />,
  Bar: <Wine className="w-4 h-4" />,
};

export default function LodgeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const id = params.id as string;

  const [lodge, setLodge] = useState<Lodge | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);
  const [showReservationDialog, setShowReservationDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ userName: '', userContact: '' });

  useEffect(() => {
    fetchLodge();
  }, [id]);

  const fetchLodge = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/lodges/${id}`);
      if (res.ok) {
        const data = await res.json();
        setLodge(data);
      }
    } catch (error) {
      console.error('Failed to fetch lodge:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReserve = async () => {
    if (!formData.userName.trim() || !formData.userContact.trim()) {
      toast({
        title: 'Missing information',
        description: 'Please enter your name and phone number.',
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lodgeId: id,
          userName: formData.userName.trim(),
          userContact: formData.userContact.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: 'Reservation created!',
          description: `Your reservation ID: ${data.shortId}`,
        });
        router.push(`/reservations/${data.id}`);
      } else {
        toast({
          title: 'Reservation failed',
          description: data.error || 'Something went wrong. Please try again.',
        });
      }
    } catch {
      toast({
        title: 'Network error',
        description: 'Please check your connection and try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const imageSlug = lodge?.name
    ? lodge.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    : '';

  const availableRooms = lodge ? lodge.totalRooms - lodge.activeReservations : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Skeleton className="h-64 w-full" />
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-60 w-full" />
        </div>
      </div>
    );
  }

  if (!lodge) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Lodge not found</h2>
          <p className="text-slate-500 mb-4">This lodge may have been removed.</p>
          <Link href="/lodges">
            <Button className="rounded-xl cursor-pointer">Browse all lodges</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Image Header */}
      <div className="relative h-64 sm:h-80 w-full overflow-hidden">
        {imageSlug && !imgError ? (
          <Image
            src={`/lodges/${imageSlug}.jpg`}
            alt={lodge.name}
            fill
            className="object-cover"
            priority
            sizes="100vw"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${lodge.gradient}`} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Back button */}
        <Link
          href="/lodges"
          className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 -mt-12 relative z-10">
        {/* Name + Verified */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 sm:p-6 mb-4">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
              {lodge.name}
            </h1>
            <Badge className="bg-green-100 text-green-700 border-0 shrink-0 mt-1">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Verified
            </Badge>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-slate-500 mb-3">
            <MapPin className="w-4 h-4 shrink-0" />
            <span className="text-sm">{lodge.location}</span>
            <span className="text-slate-300">·</span>
            <span className="text-sm">{lodge.address}</span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-bold text-slate-900">{lodge.rating.toFixed(1)}</span>
            </div>
            <span className="text-sm text-slate-400">·</span>
            <span className="text-sm text-slate-500">{lodge.totalRooms} rooms</span>
            <span className="text-sm text-slate-400">·</span>
            <span className="text-sm text-slate-500">
              {availableRooms > 0 ? `${availableRooms} rooms available tonight` : 'Check availability'}
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-slate-900">K{lodge.price}</span>
            <span className="text-lg text-slate-500">/{lodge.priceUnit}</span>
          </div>
        </div>

        {/* Urgency box */}
        {lodge.availability === 'LIKELY_FULL' && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-4 flex items-start gap-3 animate-countdown-pulse">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-800">
                {availableRooms > 0 ? `${availableRooms} rooms left tonight` : 'Almost fully booked'}
              </p>
              <p className="text-xs text-red-600 mt-0.5">Bookings closing soon — reserve now</p>
            </div>
          </div>
        )}

        {lodge.availability === 'CHECK' && (
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-4 flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800">Filling fast</p>
              <p className="text-xs text-amber-600 mt-0.5">{availableRooms} rooms remaining tonight</p>
            </div>
          </div>
        )}

        {/* Trust signals */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { icon: <Shield className="w-4 h-4 text-green-600" />, label: 'Verified location' },
            { icon: <CheckCircle2 className="w-4 h-4 text-amber-600" />, label: 'Instant confirmation' },
            { icon: <CreditCard className="w-4 h-4 text-purple-600" />, label: 'No online payment' },
          ].map((signal, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-3 text-center">
              <div className="flex items-center justify-center mb-1">{signal.icon}</div>
              <span className="text-[11px] text-slate-500 leading-tight">{signal.label}</span>
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-2">About this lodge</h2>
          <p className="text-sm text-slate-600 leading-relaxed">{lodge.description}</p>
        </div>

        {/* Amenities */}
        {lodge.amenities && lodge.amenities.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Amenities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {lodge.amenities.map((amenity) => (
                <div
                  key={amenity}
                  className="flex items-center gap-2.5 bg-gray-50 rounded-xl px-3 py-2.5"
                >
                  <span className="text-slate-500">
                    {AMENITY_ICONS[amenity] || <CheckCircle2 className="w-4 h-4" />}
                  </span>
                  <span className="text-sm font-medium text-slate-700">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Map placeholder */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-3">Location</h2>
          <div className="bg-gray-100 rounded-2xl h-48 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-400">{lodge.address}</p>
              {lodge.latitude && lodge.longitude && (
                <p className="text-xs text-slate-300 mt-1">
                  {lodge.latitude.toFixed(4)}, {lodge.longitude.toFixed(4)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Contact section */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-3">Contact</h2>
          <a
            href={`tel:${lodge.phone}`}
            className="flex items-center gap-3 bg-gray-50 rounded-2xl p-4 hover:bg-gray-100 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <Phone className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Call lodge directly</p>
              <p className="text-sm text-slate-500">{lodge.phone}</p>
            </div>
          </a>
          <p className="text-xs text-slate-400 mt-2 px-1">
            No online payment — pay on arrival
          </p>
        </div>
      </div>

      {/* Fixed bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 z-30">
        <div className="max-w-2xl mx-auto flex gap-3">
          <a
            href={`tel:${lodge.phone}`}
            className="flex-1"
          >
            <Button
              variant="outline"
              className="w-full h-12 rounded-xl text-sm font-semibold gap-2 cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              Call lodge
            </Button>
          </a>
          <Button
            onClick={() => setShowReservationDialog(true)}
            className="flex-[2] h-12 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 text-sm font-semibold gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            Reserve Now
          </Button>
        </div>
      </div>

      {/* Reservation Dialog */}
      <Dialog open={showReservationDialog} onOpenChange={setShowReservationDialog}>
        <DialogContent className="sm:max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl">Reserve your room</DialogTitle>
            <DialogDescription className="text-sm text-slate-500">
              {lodge.name} · K{lodge.price}/{lodge.priceUnit}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            {/* Info boxes */}
            <div className="bg-amber-50 rounded-xl p-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <p className="text-xs text-amber-700 font-medium">Your reservation expires in 45 minutes</p>
            </div>

            <div className="bg-green-50 rounded-xl p-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-green-600 shrink-0" />
              <p className="text-xs text-green-700 font-medium">No online payment — pay on arrival</p>
            </div>

            {/* Name input */}
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={formData.userName}
                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                className="rounded-xl h-11"
              />
            </div>

            {/* Phone input */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+260 9XX XXX XXX"
                value={formData.userContact}
                onChange={(e) => setFormData({ ...formData, userContact: e.target.value })}
                className="rounded-xl h-11"
              />
            </div>

            {/* Submit */}
            <Button
              onClick={handleReserve}
              disabled={submitting || !formData.userName.trim() || !formData.userContact.trim()}
              className="w-full h-12 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Creating reservation...
                </>
              ) : (
                'Confirm Reservation'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
