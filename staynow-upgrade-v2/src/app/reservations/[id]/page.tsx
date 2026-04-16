'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Phone,
  Copy,
  MapPin,
  User,
  PhoneCall,
  Calendar,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface Reservation {
  id: string;
  shortId: string;
  lodgeId: string;
  lodgeName: string;
  lodgeLocation: string;
  lodgeAddress: string;
  lodgePhone?: string;
  lodgePrice?: number;
  lodgePriceUnit?: string;
  userName: string;
  userContact: string;
  status: string;
  createdAt: string;
  expiresAt: string;
}

function getCountdown(expiresAt: string): { minutes: number; seconds: number; expired: boolean } {
  const now = Date.now();
  const expiry = new Date(expiresAt).getTime();
  const diff = expiry - now;

  if (diff <= 0) return { minutes: 0, seconds: 0, expired: true };

  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { minutes, seconds, expired: false };
}

function formatCountdown(minutes: number, seconds: number): string {
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function getStatusConfig(status: string) {
  switch (status) {
    case 'PENDING':
      return {
        icon: <Clock className="w-8 h-8" />,
        label: 'Waiting for confirmation',
        message: 'Your reservation is being reviewed by the lodge.',
        bgClass: 'bg-amber-50 border-amber-100',
        iconClass: 'text-amber-500',
        badgeClass: 'bg-amber-100 text-amber-700 border-0',
      };
    case 'CONFIRMED':
      return {
        icon: <CheckCircle2 className="w-8 h-8" />,
        label: 'Booking Confirmed!',
        message: 'Head there now to secure your spot.',
        bgClass: 'bg-green-50 border-green-100',
        iconClass: 'text-green-500',
        badgeClass: 'bg-green-100 text-green-700 border-0',
      };
    case 'REJECTED':
      return {
        icon: <XCircle className="w-8 h-8" />,
        label: 'Not Available',
        message: 'This lodge could not confirm your reservation. Try another lodge or call them directly.',
        bgClass: 'bg-red-50 border-red-100',
        iconClass: 'text-red-500',
        badgeClass: 'bg-red-100 text-red-700 border-0',
      };
    case 'EXPIRED':
      return {
        icon: <AlertCircle className="w-8 h-8" />,
        label: 'Reservation Expired',
        message: 'Your 45-minute reservation window has ended. You can try reserving again.',
        bgClass: 'bg-red-50 border-red-100',
        iconClass: 'text-red-500',
        badgeClass: 'bg-red-100 text-red-700 border-0',
      };
    default:
      return {
        icon: <AlertCircle className="w-8 h-8" />,
        label: 'Unknown Status',
        message: 'Please contact the lodge for more information.',
        bgClass: 'bg-gray-50 border-gray-100',
        iconClass: 'text-gray-500',
        badgeClass: 'bg-gray-100 text-gray-700 border-0',
      };
  }
}

export default function ReservationStatusPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const id = params.id as string;

  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState({ minutes: 0, seconds: 0, expired: false });
  const [copied, setCopied] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const refreshRef = useRef<NodeJS.Timeout | null>(null);

  const fetchReservation = useCallback(async () => {
    try {
      const res = await fetch(`/api/reservations/${id}`);
      if (res.ok) {
        const data = await res.json();
        setReservation(data);
        if (data.status !== 'PENDING') {
          if (refreshRef.current) clearInterval(refreshRef.current);
        }
      }
    } catch (error) {
      console.error('Failed to fetch reservation:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchReservation();

    // Auto-refresh every 10 seconds for PENDING
    refreshRef.current = setInterval(() => {
      fetchReservation();
    }, 10000);

    return () => {
      if (refreshRef.current) clearInterval(refreshRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchReservation]);

  // Countdown timer
  useEffect(() => {
    if (reservation?.status !== 'PENDING' || !reservation.expiresAt) return;

    const updateCountdown = () => {
      const cd = getCountdown(reservation.expiresAt);
      setCountdown(cd);
      if (cd.expired) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        fetchReservation(); // Re-fetch to get EXPIRED status
      }
    };

    updateCountdown();
    intervalRef.current = setInterval(updateCountdown, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [reservation?.status, reservation?.expiresAt, fetchReservation]);

  const copyId = () => {
    if (!reservation) return;
    navigator.clipboard.writeText(reservation.shortId).then(() => {
      setCopied(true);
      toast({
        title: 'Copied!',
        description: `Reservation ID ${reservation.shortId} copied to clipboard.`,
      });
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      toast({
        title: 'Failed to copy',
        description: 'Please copy the ID manually.',
      });
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
          <Skeleton className="h-10 w-32 rounded-xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-60 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Reservation not found</h2>
          <p className="text-slate-500 mb-4">This reservation may not exist or has been removed.</p>
          <Link href="/">
            <Button className="rounded-xl cursor-pointer">Go home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(reservation.status);
  const isPending = reservation.status === 'PENDING';
  const isUrgent = isPending && countdown.minutes < 5 && !countdown.expired;
  const isConfirmed = reservation.status === 'CONFIRMED';

  // Timeline steps
  const timelineSteps = [
    { label: 'Requested', active: true },
    {
      label: 'Processing',
      active: reservation.status === 'CONFIRMED' || reservation.status === 'REJECTED' || reservation.status === 'EXPIRED',
    },
    {
      label: reservation.status === 'CONFIRMED' ? 'Confirmed' : reservation.status === 'REJECTED' ? 'Rejected' : 'Confirmed',
      active: reservation.status === 'CONFIRMED' || reservation.status === 'REJECTED' || reservation.status === 'EXPIRED',
      isFinal: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/lodges">
            <Button variant="ghost" size="icon" className="shrink-0 rounded-xl cursor-pointer">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-bold text-slate-900">Reservation Status</h1>
          <div className="ml-auto">
            <Badge className={statusConfig.badgeClass}>{reservation.status}</Badge>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Status card */}
        <div className={`rounded-2xl border p-6 text-center ${statusConfig.bgClass}`}>
          <div className={`${statusConfig.iconClass} flex items-center justify-center mb-3 ${
            isPending && !countdown.expired ? 'animate-pulse-soft' : ''
          }`}>
            {statusConfig.icon}
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">{statusConfig.label}</h2>
          <p className="text-sm text-slate-600 max-w-sm mx-auto">{statusConfig.message}</p>

          {/* Countdown timer for PENDING */}
          {isPending && !countdown.expired && (
            <div className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl ${
              isUrgent ? 'bg-red-100 animate-countdown-pulse' : 'bg-amber-100'
            }`}>
              <Clock className={`w-4 h-4 ${isUrgent ? 'text-red-600 animate-urgent-pulse' : 'text-amber-600'}`} />
              <span className={`font-mono text-lg font-bold ${
                isUrgent ? 'text-red-600' : 'text-amber-700'
              }`}>
                {formatCountdown(countdown.minutes, countdown.seconds)}
              </span>
            </div>
          )}

          {isConfirmed && (
            <div className="mt-4">
              <Link href={`/lodges/${reservation.lodgeId}`}>
                <Button className="bg-green-500 hover:bg-green-400 text-white rounded-xl cursor-pointer">
                  <MapPin className="w-4 h-4 mr-2" />
                  Get Directions
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Progress</h3>
          <div className="flex items-center gap-0">
            {timelineSteps.map((step, i) => (
              <div key={i} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div
                    className={`timeline-dot ${
                      step.active
                        ? `timeline-dot-active text-${i === timelineSteps.length - 1 && reservation.status === 'REJECTED' ? 'red' : i === timelineSteps.length - 1 && reservation.status === 'EXPIRED' ? 'red' : 'green'}-500`
                        : 'timeline-dot-inactive text-slate-300'
                    }`}
                    style={{
                      borderColor: step.active
                        ? (i === timelineSteps.length - 1 && (reservation.status === 'REJECTED' || reservation.status === 'EXPIRED') ? '#ef4444' : '#22c55e')
                        : '#cbd5e1',
                      color: step.active
                        ? (i === timelineSteps.length - 1 && (reservation.status === 'REJECTED' || reservation.status === 'EXPIRED') ? '#ef4444' : '#22c55e')
                        : '#cbd5e1',
                    }}
                  />
                  <span className={`text-[11px] mt-1.5 font-medium ${
                    step.active ? 'text-slate-700' : 'text-slate-400'
                  }`}>
                    {step.label}
                  </span>
                </div>
                {i < timelineSteps.length - 1 && (
                  <div
                    className="timeline-line mx-2 mt-[-20px]"
                    style={{
                      borderColor: '#cbd5e1',
                      background: step.active ? (i < timelineSteps.length - 2 ? '#22c55e' : '#cbd5e1') : '#cbd5e1',
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Reservation details */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Reservation Details</h3>

          {/* ID - copyable */}
          <div className="flex items-center justify-between py-2 border-b border-gray-50">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-500">Reservation ID</span>
            </div>
            <button
              onClick={copyId}
              className="flex items-center gap-1.5 text-sm font-mono font-semibold text-slate-900 hover:text-amber-600 transition-colors cursor-pointer"
            >
              {reservation.shortId}
              <Copy className={`w-3.5 h-3.5 ${copied ? 'text-green-500' : 'text-slate-400'}`} />
            </button>
          </div>

          {/* Guest name */}
          <div className="flex items-center justify-between py-2 border-b border-gray-50">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <User className="w-3.5 h-3.5" />
              Guest
            </div>
            <span className="text-sm font-medium text-slate-900">{reservation.userName}</span>
          </div>

          {/* Contact */}
          <div className="flex items-center justify-between py-2 border-b border-gray-50">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <PhoneCall className="w-3.5 h-3.5" />
              Contact
            </div>
            <span className="text-sm font-medium text-slate-900">{reservation.userContact}</span>
          </div>

          {/* Requested date */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Calendar className="w-3.5 h-3.5" />
              Requested
            </div>
            <span className="text-sm text-slate-700">
              {new Date(reservation.createdAt).toLocaleDateString('en-ZM', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </div>

        {/* Lodge info summary */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Lodge</h3>
            <Link href={`/lodges/${reservation.lodgeId}`} className="text-xs text-amber-600 font-medium hover:text-amber-700">
              View lodge →
            </Link>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{reservation.lodgeName}</p>
              <p className="text-sm text-slate-500">{reservation.lodgeLocation}</p>
              <p className="text-xs text-slate-400 truncate">{reservation.lodgeAddress}</p>
              {reservation.lodgePrice && (
                <p className="text-sm font-semibold text-slate-700 mt-1">
                  K{reservation.lodgePrice}/{reservation.lodgePriceUnit}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-3 pb-6">
          {reservation.lodgePhone && (
            <a href={`tel:${reservation.lodgePhone}`}>
              <Button
                className="w-full h-12 rounded-xl bg-green-500 hover:bg-green-400 text-white font-semibold gap-2 cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                Call lodge to confirm
              </Button>
            </a>
          )}

          {(reservation.status === 'REJECTED' || reservation.status === 'EXPIRED') && (
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => router.push('/lodges')}
                className="flex-1 h-12 rounded-xl font-semibold cursor-pointer"
              >
                Find another lodge
              </Button>
              <Button
                onClick={() => router.push(`/lodges/${reservation.lodgeId}`)}
                className="flex-1 h-12 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold cursor-pointer"
              >
                Try again
              </Button>
            </div>
          )}

          {isConfirmed && (
            <Button
              variant="outline"
              onClick={() => router.push('/lodges')}
              className="w-full h-12 rounded-xl font-semibold cursor-pointer"
            >
              Browse more lodges
            </Button>
          )}

          {isPending && (
            <p className="text-xs text-center text-slate-400 flex items-center justify-center gap-1.5">
              <Loader2 className="w-3 h-3 animate-spin" />
              Auto-refreshing every 10 seconds
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
