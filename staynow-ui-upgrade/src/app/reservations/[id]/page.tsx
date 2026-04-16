'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Phone,
  AlertTriangle,
  RefreshCw,
  Home,
  Loader2,
  Copy,
  Calendar,
  User,
  CreditCard,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface Reservation {
  id: string;
  shortId: string;
  lodgeId: string;
  lodgeName: string;
  lodgeLocation: string;
  lodgeAddress: string;
  lodgePhone: string;
  lodgePrice: number;
  lodgePriceUnit: string;
  userName: string;
  userContact: string;
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'EXPIRED';
  createdAt: string;
  expiresAt: string;
}

export default function ReservationStatusPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [countdown, setCountdown] = useState('');
  const [copied, setCopied] = useState(false);

  const fetchReservation = useCallback(async () => {
    try {
      const res = await fetch(`/api/reservations/${id}`);
      if (!res.ok) {
        setError(true);
        return;
      }
      const data = await res.json();
      setReservation(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchReservation();
  }, [fetchReservation]);

  // Auto-refresh every 10 seconds
  useEffect(() => {
    const interval = setInterval(fetchReservation, 10000);
    return () => clearInterval(interval);
  }, [fetchReservation]);

  // Countdown timer
  useEffect(() => {
    if (!reservation || reservation.status !== 'PENDING') return;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const expires = new Date(reservation.expiresAt).getTime();
      const diff = expires - now;

      if (diff <= 0) {
        setCountdown('00:00');
        return;
      }

      const minutes = Math.floor(diff / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setCountdown(
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [reservation]);

  const copyId = () => {
    if (reservation) {
      navigator.clipboard.writeText(reservation.shortId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'PENDING':
        return {
          icon: <Clock className="w-8 h-8" />,
          label: 'Pending Confirmation',
          description: "The lodge is reviewing your request. You'll be notified when they respond.",
          color: 'text-amber-600',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          iconBg: 'bg-amber-100',
          badgeBg: 'bg-amber-100 text-amber-700',
        };
      case 'CONFIRMED':
        return {
          icon: <CheckCircle2 className="w-8 h-8" />,
          label: 'Booking Confirmed!',
          description: 'Your reservation has been confirmed. Enjoy your stay!',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          iconBg: 'bg-green-100',
          badgeBg: 'bg-green-100 text-green-700',
        };
      case 'REJECTED':
        return {
          icon: <XCircle className="w-8 h-8" />,
          label: 'Reservation Not Available',
          description:
            'Unfortunately, the lodge could not accommodate your request. Please try another lodge.',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          iconBg: 'bg-red-100',
          badgeBg: 'bg-red-100 text-red-700',
        };
      case 'EXPIRED':
        return {
          icon: <AlertTriangle className="w-8 h-8" />,
          label: 'Reservation Expired',
          description:
            'This reservation has expired because it was not confirmed within 45 minutes.',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          iconBg: 'bg-red-100',
          badgeBg: 'bg-red-100 text-red-700',
        };
      default:
        return {
          icon: <Clock className="w-8 h-8" />,
          label: 'Unknown',
          description: '',
          color: 'text-slate-500',
          bgColor: 'bg-slate-50',
          borderColor: 'border-slate-200',
          iconBg: 'bg-slate-100',
          badgeBg: 'bg-slate-100 text-slate-700',
        };
    }
  };

  // Timeline steps
  const getTimelineSteps = (status: string) => {
    const steps = [
      { label: 'Requested', active: true, completed: true },
      { label: 'Processing', active: status === 'PENDING', completed: status !== 'PENDING' },
      { label: 'Confirmed', active: false, completed: status === 'CONFIRMED' },
    ];
    return steps;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 pt-6">
          <Skeleton className="h-10 w-10 rounded-xl mb-6" />
          <Skeleton className="h-72 rounded-2xl" />
          <Skeleton className="h-40 rounded-2xl mt-4" />
        </div>
      </div>
    );
  }

  // Error state
  if (error || !reservation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 rounded-3xl bg-red-50 flex items-center justify-center mx-auto mb-5">
            <XCircle className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Reservation not found</h2>
          <p className="text-sm text-slate-500 mb-6 max-w-xs mx-auto">
            This reservation doesn&apos;t exist or has been removed.
          </p>
          <Link href="/">
            <Button className="rounded-xl bg-slate-900 hover:bg-slate-800">Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(reservation.status);
  const timelineSteps = getTimelineSteps(reservation.status);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-xl hover:bg-gray-100"
            onClick={() => router.push('/')}
          >
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </Button>
          <h1 className="text-lg font-bold text-slate-900 flex-1">Reservation Status</h1>
          <Badge className={`${statusConfig.badgeBg} text-[11px] font-bold px-3 py-1 rounded-full`}>
            {reservation.status}
          </Badge>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Status Card */}
          <div
            className={`bg-white rounded-2xl shadow-sm border ${statusConfig.borderColor} p-6 sm:p-8 text-center mb-4`}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className={`w-20 h-20 rounded-3xl ${statusConfig.iconBg} flex items-center justify-center mx-auto mb-5 ${statusConfig.color}`}
            >
              {statusConfig.icon}
            </motion.div>

            <h2 className={`text-2xl font-bold ${statusConfig.color} mb-2`}>
              {statusConfig.label}
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
              {statusConfig.description}
            </p>

            {/* Countdown for PENDING */}
            {reservation.status === 'PENDING' && countdown && (
              <div className="mt-6">
                <div className="text-xs text-slate-400 mb-2 font-medium uppercase tracking-wider">
                  Reservation expires in
                </div>
                <div
                  className={`inline-flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-8 py-4 ${countdown <= '10:00' ? 'animate-countdown-pulse' : ''}`}
                >
                  <Clock className="w-5 h-5 text-amber-500" />
                  <span
                    className={`text-4xl font-bold font-mono tracking-wider ${countdown <= '05:00' ? 'text-red-600' : 'text-amber-600'}`}
                  >
                    {countdown}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-3 animate-pulse-soft">
                  Auto-refreshing every 10 seconds...
                </div>
              </div>
            )}

            {/* Success for CONFIRMED */}
            {reservation.status === 'CONFIRMED' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
                className="mt-6"
              >
                <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-5 py-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-semibold text-green-700">
                    See you soon!
                  </span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Status Timeline */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 mb-4">
            <h3 className="font-bold text-slate-900 mb-5">Status Timeline</h3>
            <div className="flex items-center justify-between">
              {timelineSteps.map((step, i) => (
                <div key={i} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        step.completed
                          ? 'bg-green-500 text-white'
                          : step.active
                          ? 'bg-amber-500 text-white animate-pulse-soft'
                          : 'bg-gray-100 text-slate-400'
                      }`}
                    >
                      {step.completed ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        i + 1
                      )}
                    </div>
                    <span
                      className={`text-[11px] mt-1.5 font-medium ${
                        step.completed
                          ? 'text-green-600'
                          : step.active
                          ? 'text-amber-600'
                          : 'text-slate-400'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {i < timelineSteps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 mt-[-20px] rounded-full ${
                        step.completed ? 'bg-green-400' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Reservation Details */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 mb-4">
            <h3 className="font-bold text-slate-900 mb-4">Reservation Details</h3>

            {/* Reservation ID */}
            <div className="flex items-center justify-between py-3.5 border-b border-gray-50">
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-500">Reservation ID</span>
              </div>
              <button onClick={copyId} className="flex items-center gap-2 group">
                <code className="text-sm font-mono font-semibold text-slate-900 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                  {reservation.shortId}
                </code>
                <Copy
                  className={`w-3.5 h-3.5 transition-colors ${
                    copied ? 'text-green-500' : 'text-slate-300 group-hover:text-slate-500'
                  }`}
                />
              </button>
            </div>

            {/* Guest name */}
            <div className="flex items-center justify-between py-3.5 border-b border-gray-50">
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-500">Guest</span>
              </div>
              <span className="text-sm font-semibold text-slate-900">
                {reservation.userName}
              </span>
            </div>

            {/* Contact */}
            <div className="flex items-center justify-between py-3.5 border-b border-gray-50">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-500">Contact</span>
              </div>
              <span className="text-sm font-semibold text-slate-900">
                {reservation.userContact}
              </span>
            </div>

            {/* Created */}
            <div className="flex items-center justify-between py-3.5">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-500">Requested</span>
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

          {/* Lodge Info Summary */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 mb-4">
            <h3 className="font-bold text-slate-900 mb-4">Lodge</h3>
            <Link href={`/lodges/${reservation.lodgeId}`} className="group block">
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-7 h-7 text-white/70" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-900 text-sm group-hover:text-amber-600 transition-colors flex items-center gap-1">
                    {reservation.lodgeName}
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {reservation.lodgeLocation}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {reservation.lodgeAddress}
                  </div>
                  <div className="text-sm font-bold text-slate-900 mt-2">
                    K{reservation.lodgePrice.toLocaleString()}
                    <span className="text-xs text-slate-400 font-normal">/{reservation.lodgePriceUnit}</span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Call lodge button */}
            <a
              href={`tel:${reservation.lodgePhone}`}
              className="flex items-center justify-center gap-2 mt-5 p-3.5 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-colors group"
            >
              <Phone className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-green-700">Call lodge to confirm</span>
            </a>
          </div>

          {/* Action Buttons */}
          {reservation.status === 'EXPIRED' || reservation.status === 'REJECTED' ? (
            <div className="flex gap-3">
              <Link href="/lodges" className="flex-1">
                <Button className="w-full h-12 bg-amber-500 hover:bg-amber-400 text-slate-900 rounded-xl font-semibold shadow-lg shadow-amber-500/20">
                  Try Another Lodge
                </Button>
              </Link>
            </div>
          ) : reservation.status === 'CONFIRMED' ? (
            <div className="flex gap-3">
              <a href={`tel:${reservation.lodgePhone}`} className="flex-1">
                <Button className="w-full h-12 bg-green-600 hover:bg-green-500 text-white rounded-xl font-semibold shadow-lg shadow-green-600/20">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Lodge
                </Button>
              </a>
              <Link href="/" className="flex-1">
                <Button
                  variant="outline"
                  className="w-full h-12 rounded-xl font-semibold"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={fetchReservation}
                className="flex-1 h-12 rounded-xl font-medium"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Link href="/lodges" className="flex-1">
                <Button
                  variant="outline"
                  className="w-full h-12 rounded-xl font-medium"
                >
                  Browse Lodges
                </Button>
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
