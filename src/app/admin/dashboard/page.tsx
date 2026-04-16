'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  LogOut,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Users,
  ClipboardList,
  Loader2,
  Shield,
  Home,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Reservation {
  id: string;
  shortId: string;
  userName: string;
  userContact: string;
  lodgeName: string;
  lodgeLocation: string;
  status: string;
  createdAt: string;
  expiresAt: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    rejected: 0,
  });

  // Check auth
  useEffect(() => {
    const isAdmin = localStorage.getItem('staynow_admin');
    if (!isAdmin) {
      router.push('/admin');
    }
  }, [router]);

  const fetchReservations = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/reservations?auth=staynow-admin-2024');
      if (res.status === 401) {
        router.push('/admin');
        return;
      }
      const data = await res.json();
      setReservations(data.reservations || []);

      const r = data.reservations || [];
      setStats({
        total: r.length,
        pending: r.filter((res: Reservation) => res.status === 'PENDING').length,
        confirmed: r.filter((res: Reservation) => res.status === 'CONFIRMED').length,
        rejected: r.filter((res: Reservation) => res.status === 'REJECTED').length,
      });
    } catch {
      // Silent fail
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  // Auto-refresh every 15 seconds
  useEffect(() => {
    const interval = setInterval(fetchReservations, 15000);
    return () => clearInterval(interval);
  }, [fetchReservations]);

  const handleAction = async (id: string, status: 'CONFIRMED' | 'REJECTED') => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin/reservations/${id}?auth=staynow-admin-2024`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || 'Action failed');
        return;
      }

      toast.success(`Reservation ${status.toLowerCase()}`);
      fetchReservations();
    } catch {
      toast.error('Something went wrong');
    } finally {
      setActionLoading(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('staynow_admin');
    router.push('/admin');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return { label: 'Pending', color: 'bg-amber-100 text-amber-700', icon: <Clock className="w-3 h-3" /> };
      case 'CONFIRMED':
        return { label: 'Confirmed', color: 'bg-green-100 text-green-700', icon: <CheckCircle2 className="w-3 h-3" /> };
      case 'REJECTED':
        return { label: 'Rejected', color: 'bg-red-100 text-red-700', icon: <XCircle className="w-3 h-3" /> };
      case 'EXPIRED':
        return { label: 'Expired', color: 'bg-gray-100 text-gray-500', icon: <AlertTriangle className="w-3 h-3" /> };
      default:
        return { label: status, color: 'bg-gray-100 text-gray-500', icon: <Clock className="w-3 h-3" /> };
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 pt-6">
          <div className="animate-shimmer h-10 w-40 rounded-xl mb-6" />
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-shimmer h-24 rounded-2xl" />
            ))}
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-shimmer h-20 rounded-2xl mb-3" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-gray-100">
                <ArrowLeft className="w-5 h-5 text-slate-700" />
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Admin Dashboard</h1>
              <p className="text-[10px] text-slate-400">StayNow Management</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={fetchReservations}
              className="h-9 w-9 rounded-xl hover:bg-gray-100"
            >
              <RefreshCw className="w-4 h-4 text-slate-500" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="h-9 w-9 rounded-xl hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <ClipboardList className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-xs text-slate-400">Total</span>
              </div>
              <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-amber-600" />
                </div>
                <span className="text-xs text-slate-400">Pending</span>
              </div>
              <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-xs text-slate-400">Confirmed</span>
              </div>
              <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                  <XCircle className="w-4 h-4 text-red-600" />
                </div>
                <span className="text-xs text-slate-400">Rejected</span>
              </div>
              <div className="text-2xl font-bold text-red-500">{stats.rejected}</div>
            </div>
          </div>

          {/* Reservation List */}
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Reservations</h2>

            {reservations.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <Users className="w-7 h-7 text-gray-300" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">No reservations yet</h3>
                <p className="text-sm text-slate-500">Reservations will appear here when guests book</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reservations.map((res, i) => {
                  const badge = getStatusBadge(res.status);
                  return (
                    <motion.div
                      key={res.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.03 }}
                      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
                    >
                      {/* Top row: ID and status */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <code className="text-xs font-mono font-semibold text-slate-600 bg-gray-50 px-2 py-1 rounded-lg">
                            #{res.shortId}
                          </code>
                          <span className="text-xs text-slate-400">
                            {formatDate(res.createdAt)} · {formatTime(res.createdAt)}
                          </span>
                        </div>
                        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${badge.color} flex items-center gap-1`}>
                          {badge.icon}
                          {badge.label}
                        </span>
                      </div>

                      {/* Guest & Lodge */}
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-sm font-medium text-slate-900">{res.userName}</span>
                          <span className="text-xs text-slate-400">{res.userContact}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Home className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-sm text-slate-600">{res.lodgeName}</span>
                          <span className="text-xs text-slate-400">· {res.lodgeLocation}</span>
                        </div>
                      </div>

                      {/* Actions for PENDING */}
                      {res.status === 'PENDING' && (
                        <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                          <Button
                            size="sm"
                            onClick={() => handleAction(res.id, 'CONFIRMED')}
                            disabled={actionLoading === res.id}
                            className="flex-1 h-9 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-medium"
                          >
                            {actionLoading === res.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                                Confirm
                              </>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAction(res.id, 'REJECTED')}
                            disabled={actionLoading === res.id}
                            className="flex-1 h-9 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl text-sm font-medium"
                          >
                            {actionLoading === res.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <>
                                <XCircle className="w-3.5 h-3.5 mr-1" />
                                Reject
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Auto-refresh notice */}
          <div className="text-center py-4">
            <div className="inline-flex items-center gap-2 text-xs text-slate-400">
              <Shield className="w-3 h-3" />
              Auto-refreshing every 15 seconds
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
