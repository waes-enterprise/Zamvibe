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
  ChevronRight,
  Loader2,
  AlertCircle,
  Navigation,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
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
}

const AMENITY_MAP: Record<string, { icon: React.ReactNode; label: string }> = {
  WiFi: { icon: <Wifi className="w-4 h-4" />, label: 'WiFi' },
  Parking: { icon: <Car className="w-4 h-4" />, label: 'Parking' },
  Pool: { icon: <Waves className="w-4 h-4" />, label: 'Pool' },
  Restaurant: { icon: <UtensilsCrossed className="w-4 h-4" />, label: 'Restaurant' },
  AC: { icon: <Snowflake className="w-4 h-4" />, label: 'Air Conditioning' },
  Bar: { icon: <Wine className="w-4 h-4" />, label: 'Bar' },
};

export default function LodgeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [lodge, setLodge] = useState<Lodge | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
        return { label: 'Available', color: 'bg-green-100 text-green-700', dot: 'bg-green-500' };
      case 'CHECK':
        return { label: 'Check Availability', color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' };
      case 'LIKELY_FULL':
        return { label: 'Likely Full', color: 'bg-red-100 text-red-700', dot: 'bg-red-500' };
      default:
        return { label: 'Check Availability', color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' };
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="animate-shimmer h-64" />
        <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
          <div className="animate-shimmer h-8 w-3/4 rounded-xl" />
          <div className="animate-shimmer h-4 w-1/2 rounded-lg" />
          <div className="animate-shimmer h-24 rounded-xl" />
          <div className="animate-shimmer h-16 rounded-xl" />
          <div className="animate-shimmer h-20 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !lodge) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">Lodge not found</h2>
          <p className="text-sm text-slate-500 mb-4">This lodge may have been removed or doesn&apos;t exist.</p>
          <Link href="/lodges">
            <Button className="rounded-xl">Browse Lodges</Button>
          </Link>
        </div>
      </div>
    );
  }

  const badge = getAvailabilityBadge(lodge.availability);

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Hero image */}
      <div className="relative">
        <div className={`h-64 bg-gradient-to-br ${lodge.gradient} relative`}>
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

          {/* Back button */}
          <div className="absolute top-4 left-4 z-10">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl bg-white/90 hover:bg-white shadow-sm"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-5 h-5 text-slate-700" />
            </Button>
          </div>

          {/* Availability badge */}
          <div className="absolute top-4 right-4 z-10">
            <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${badge.color} flex items-center gap-1.5 shadow-sm`}>
              <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
              {badge.label}
            </span>
          </div>

          {/* MapPin icon in center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <MapPin className="w-16 h-16 text-white/20" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 -mt-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Main card */}
          <div className="bg-white rounded-2xl shadow-lg p-5 mb-4">
            {/* Name & location */}
            <h1 className="text-xl font-bold text-slate-900">{lodge.name}</h1>
            <div className="flex items-center gap-1.5 mt-1.5">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-500">{lodge.location}</span>
              <span className="text-slate-300">·</span>
              <span className="text-sm text-slate-400">{lodge.address}</span>
            </div>

            {/* Rating & Price */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-1.5">
                {renderStars(lodge.rating)}
                <span className="text-sm font-medium text-slate-600 ml-1">{lodge.rating}</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-amber-600">K{lodge.price.toLocaleString()}</span>
                <span className="text-sm text-slate-400 ml-1">/{lodge.priceUnit}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl shadow-sm p-5 mb-4">
            <h2 className="font-semibold text-slate-900 mb-2">About this lodge</h2>
            <p className="text-sm text-slate-600 leading-relaxed">{lodge.description}</p>
          </div>

          {/* Amenities */}
          {lodge.amenities && lodge.amenities.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm p-5 mb-4">
              <h2 className="font-semibold text-slate-900 mb-3">Amenities</h2>
              <div className="grid grid-cols-3 gap-2">
                {lodge.amenities.map((amenity) => {
                  const amenityInfo = AMENITY_MAP[amenity];
                  return (
                    <div
                      key={amenity}
                      className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5"
                    >
                      <span className="text-amber-500">
                        {amenityInfo?.icon || <ChevronRight className="w-4 h-4" />}
                      </span>
                      <span className="text-xs font-medium text-slate-700">{amenityInfo?.label || amenity}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Map placeholder */}
          <div className="bg-white rounded-2xl shadow-sm p-5 mb-4">
            <h2 className="font-semibold text-slate-900 mb-3">Location</h2>
            <div className="h-40 bg-gray-100 rounded-xl flex flex-col items-center justify-center gap-2 border border-gray-200 border-dashed">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <Navigation className="w-5 h-5 text-amber-500" />
              </div>
              <span className="text-sm text-slate-400">Map coming soon</span>
              <span className="text-xs text-slate-300">{lodge.address}</span>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white rounded-2xl shadow-sm p-5 mb-4">
            <h2 className="font-semibold text-slate-900 mb-3">Contact</h2>
            <a href={`tel:${lodge.phone}`} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                <Phone className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-slate-900">{lodge.phone}</div>
                <div className="text-xs text-slate-400">Tap to call</div>
              </div>
            </a>
          </div>
        </motion.div>
      </div>

      {/* Fixed bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="text-xs text-slate-400">Price per night</div>
              <div className="font-bold text-amber-600 text-lg">K{lodge.price.toLocaleString()}</div>
            </div>
            <Button
              size="lg"
              onClick={() => setShowModal(true)}
              className="h-13 px-8 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold shadow-lg shadow-amber-500/25 transition-all"
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
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${lodge.gradient} flex items-center justify-center flex-shrink-0`}>
                <MapPin className="w-6 h-6 text-white/60" />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-sm text-slate-900 truncate">{lodge.name}</div>
                <div className="text-xs text-slate-500">{lodge.location} · K{lodge.price.toLocaleString()}/{lodge.priceUnit}</div>
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
            <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-xl">
              <Clock className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-amber-700">
                Your reservation will be valid for <strong>45 minutes</strong>. The lodge will confirm or reject your request. No payment required.
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
                className="flex-1 h-11 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold"
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
