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
} from 'lucide-react';
import { Button } from '@/components/ui/button';

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
          description: 'The lodge is reviewing your request. You\'ll be notified when they respond.',
          color: 'text-amber-500',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          iconBg: 'bg-amber-100',
        };
      case 'CONFIRMED':
        return {
          icon: <CheckCircle2 className="w-8 h-8" />,
          label: 'Booking Confirmed!',
          description: 'Your reservation has been confirmed. Enjoy your stay!',
          color: 'text-green-500',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          iconBg: 'bg-green-100',
        };
      case 'REJECTED':
        return {
          icon: <XCircle className="w-8 h-8" />,
          label: 'Reservation Not Available',
          description: 'Unfortunately, the lodge could not accommodate your request. Please try another lodge.',
          color: 'text-red-500',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          iconBg: 'bg-red-100',
        };
      case 'EXPIRED':
        return {
          icon: <AlertTriangle className="w-8 h-8" />,
          label: 'Reservation Expired',
          description: 'This reservation has expired because it was not confirmed within 45 minutes.',
          color: 'text-red-500',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          iconBg: 'bg-red-100',
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
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-lg mx-auto px-4 pt-6">
          <div className="animate-shimmer h-10 w-10 rounded-xl mb-6" />
          <div className="animate-shimmer h-64 rounded-2xl" />
          <div className="animate-shimmer h-32 rounded-2xl mt-4" />
        </div>
      </div>
    );
  }

  if (error || !reservation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">Reservation not found</h2>
          <p className="text-sm text-slate-500 mb-4">This reservation doesn&apos;t exist or has been removed.</p>
          <Link href="/">
            <Button className="rounded-xl">Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(reservation.status);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-xl hover:bg-gray-100"
            onClick={() => router.push('/')}
          >
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </Button>
          <h1 className="text-lg font-bold text-slate-900">Reservation Status</h1>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Status Card */}
          <div className={`bg-white rounded-2xl shadow-sm border ${statusConfig.borderColor} p-6 text-center mb-4`}>
            <div className={`w-16 h-16 rounded-2xl ${statusConfig.iconBg} flex items-center justify-center mx-auto mb-4 ${statusConfig.color}`}>
              {statusConfig.icon}
            </div>

            <h2 className={`text-xl font-bold ${statusConfig.color} mb-2`}>
              {statusConfig.label}
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              {statusConfig.description}
            </p>

            {/* Countdown for PENDING */}
            {reservation.status === 'PENDING' && countdown && (
              <div className="mt-6">
                <div className="text-xs text-slate-400 mb-2">Time remaining</div>
                <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-6 py-3">
                  <Clock className="w-5 h-5 text-amber-500" />
                  <span className="text-3xl font-bold font-mono text-amber-600 tracking-wider">
                    {countdown}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-2 animate-pulse-soft">
                  Auto-refreshing every 10 seconds...
                </div>
              </div>
            )}

            {/* Success animation for CONFIRMED */}
            {reservation.status === 'CONFIRMED' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
                className="mt-6"
              >
                <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium text-green-700">See you soon!</span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Reservation Details */}
          <div className="bg-white rounded-2xl shadow-sm p-5 mb-4">
            <h3 className="font-semibold text-slate-900 mb-4">Reservation Details</h3>

            {/* Reservation ID */}
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-slate-500">Reservation ID</span>
              <button
                onClick={copyId}
                className="flex items-center gap-2 group"
              >
                <code className="text-sm font-mono font-semibold text-slate-900 bg-gray-50 px-2.5 py-1 rounded-lg">
                  {reservation.shortId}
                </code>
                <Copy className={`w-3.5 h-3.5 ${copied ? 'text-green-500' : 'text-slate-300 group-hover:text-slate-500'} transition-colors`} />
              </button>
            </div>

            {/* Guest name */}
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-slate-500">Guest</span>
              <span className="text-sm font-medium text-slate-900">{reservation.userName}</span>
            </div>

            {/* Contact */}
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-slate-500">Contact</span>
              <span className="text-sm font-medium text-slate-900">{reservation.userContact}</span>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-slate-500">Status</span>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusConfig.bgColor} ${statusConfig.color}`}>
                {reservation.status}
              </span>
            </div>
          </div>

          {/* Lodge Details */}
          <div className="bg-white rounded-2xl shadow-sm p-5 mb-4">
            <h3 className="font-semibold text-slate-900 mb-3">Lodge</h3>
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-amber-500" />
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/lodges/${reservation.lodgeId}`} className="font-semibold text-sm text-slate-900 hover:text-amber-600 transition-colors">
                  {reservation.lodgeName}
                </Link>
                <div className="text-xs text-slate-500 mt-0.5">{reservation.lodgeLocation}</div>
                <div className="text-xs text-slate-400 mt-0.5">{reservation.lodgeAddress}</div>
                <div className="text-sm font-semibold text-amber-600 mt-1.5">
                  K{reservation.lodgePrice.toLocaleString()}/{reservation.lodgePriceUnit}
                </div>
              </div>
            </div>

            {/* Call button */}
            <a
              href={`tel:${reservation.lodgePhone}`}
              className="flex items-center justify-center gap-2 mt-4 p-3 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-colors"
            >
              <Phone className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">Call Lodge</span>
            </a>
          </div>

          {/* Actions */}
          {reservation.status === 'EXPIRED' || reservation.status === 'REJECTED' ? (
            <div className="flex gap-3">
              <Link href="/lodges" className="flex-1">
                <Button className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold shadow-lg shadow-amber-500/20">
                  Try Another Lodge
                </Button>
              </Link>
            </div>
          ) : reservation.status === 'CONFIRMED' ? (
            <div className="flex gap-3">
              <Link href="/" className="flex-1">
                <Button className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold shadow-lg shadow-amber-500/20">
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
                className="flex-1 h-12 rounded-xl"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Link href="/lodges" className="flex-1">
                <Button variant="outline" className="w-full h-12 rounded-xl">
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
