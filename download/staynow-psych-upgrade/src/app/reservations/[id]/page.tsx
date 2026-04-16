"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Clock,
  CheckCircle2,
  Circle,
  Phone,
  MapPin,
  Shield,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Reservation {
  id: string;
  lodgeId: string;
  status: string;
  createdAt: string;
  lodge?: {
    name: string;
    city: string;
    address: string;
    pricePerNight: number;
    imageUrl: string;
    phone?: string;
  };
}

export default function ReservationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes in seconds

  useEffect(() => {
    async function fetchReservation() {
      try {
        const res = await fetch("/api/reservations/" + params.id);
        if (res.ok) {
          const data = await res.json();
          setReservation(data);
        }
      } catch {
        // empty
      } finally {
        setLoading(false);
      }
    }
    fetchReservation();
  }, [params.id]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isExpired = timeLeft <= 0;
  const isUrgent = timeLeft <= 10 * 60; // Last 10 minutes
  const isCritical = timeLeft <= 5 * 60; // Last 5 minutes

  const statusSteps = [
    {
      label: "Reserved",
      active: true,
      icon: <CheckCircle2 className="w-5 h-5" />,
    },
    {
      label: "Head to Lodge",
      active: false,
      icon: <MapPin className="w-5 h-5" />,
    },
    {
      label: "Pay on Arrival",
      active: false,
      icon: <Shield className="w-5 h-5" />,
    },
    {
      label: "Enjoy Your Stay!",
      active: false,
      icon: <CheckCircle2 className="w-5 h-5" />,
    },
  ];

  if (loading) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8 space-y-4">
        <div className="h-48 bg-muted rounded-2xl animate-pulse" />
        <div className="h-8 bg-muted rounded animate-pulse w-2/3" />
        <div className="h-32 bg-muted rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-semibold mb-2">Reservation not found</h2>
        <p className="text-muted-foreground mb-4">
          Check your link and try again.
        </p>
        <Button variant="outline" onClick={() => router.push("/")}>
          Go Home
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8 pb-24">
      {/* Success header */}
      <div className="text-center mb-8 animate-fadeIn">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h1 className="text-2xl font-bold mb-1">You&apos;re all set!</h1>
        <p className="text-muted-foreground">
          Your room at {reservation.lodge?.name || "the lodge"} is reserved.
        </p>
      </div>

      {/* Countdown Timer */}
      <Card
        className={
          "mb-6 border-0 " +
          (isExpired
            ? "bg-red-50 dark:bg-red-950/30"
            : isCritical
            ? "bg-red-50 dark:bg-red-950/20"
            : isUrgent
            ? "bg-orange-50 dark:bg-orange-950/20"
            : "bg-emerald-50 dark:bg-emerald-950/20")
        }
      >
        <CardContent className="p-6 text-center">
          {isExpired ? (
            <>
              <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="text-lg font-bold text-red-600 dark:text-red-400 mb-1">
                Reservation Expired
              </p>
              <p className="text-sm text-muted-foreground mb-3">
                Your 45-minute window has passed. Please make a new reservation.
              </p>
              <Button
                onClick={() => router.push("/lodges/" + reservation.lodgeId)}
                className="gap-2"
              >
                Reserve Again <ArrowRight className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <div
                className={
                  "flex items-center justify-center gap-2 mb-2 " +
                  (isUrgent ? "animate-countdown" : "")
                }
              >
                <Clock
                  className={
                    "w-5 h-5 " +
                    (isCritical
                      ? "text-red-500"
                      : isUrgent
                      ? "text-orange-500"
                      : "text-emerald-500")
                  }
                />
                <span className="text-sm font-medium">
                  {isCritical
                    ? "Hurry! Head there now to secure your spot"
                    : isUrgent
                    ? "Time is running out — head to the lodge soon"
                    : "Head there now to secure your spot"}
                </span>
              </div>
              <div
                className={
                  "text-5xl font-bold font-mono tracking-wider " +
                  (isCritical
                    ? "text-red-600 dark:text-red-400"
                    : isUrgent
                    ? "text-orange-600 dark:text-orange-400"
                    : "text-emerald-600 dark:text-emerald-400")
                }
              >
                {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Your room is held for 45 minutes after booking
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Reservation Timeline */}
      <Card className="mb-6">
        <CardContent className="p-5">
          <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wide">
            Your Journey
          </h3>
          <div className="space-y-4">
            {statusSteps.map((step, i) => (
              <div key={step.label} className="flex items-start gap-3">
                <div
                  className={
                    "mt-0.5 " +
                    (step.active
                      ? "text-emerald-500"
                      : "text-muted-foreground/40")
                  }
                >
                  {step.active ? step.icon : <Circle className="w-5 h-5" />}
                </div>
                <div
                  className={
                    "flex-1 " +
                    (i < statusSteps.length - 1 ? "pb-4 border-b border-muted" : "")
                  }
                >
                  <p
                    className={
                      "text-sm font-medium " +
                      (step.active ? "" : "text-muted-foreground")
                    }
                  >
                    {step.label}
                  </p>
                  {step.active && i === 0 && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Reserved at{" "}
                      {new Date(reservation.createdAt).toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lodge Info */}
      {reservation.lodge && (
        <Card className="mb-6">
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
              Lodge Details
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold">{reservation.lodge.name}</span>
                <span className="font-bold text-amber-600">
                  K{reservation.lodge.pricePerNight}/night
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="w-3.5 h-3.5" />
                {reservation.lodge.address || reservation.lodge.city}
              </div>
              <div className="flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400 mt-3">
                <Shield className="w-3.5 h-3.5" />
                <span>No online payment — pay on arrival</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Fixed bottom action */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t px-4 py-3 z-50">
        <div className="max-w-lg mx-auto">
          <Button
            size="lg"
            className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 font-semibold"
            onClick={() => {
              if (reservation.lodge?.phone) {
                window.location.href = "tel:" + reservation.lodge.phone;
              } else {
                window.location.href = "tel:+260";
              }
            }}
          >
            <Phone className="w-4 h-4" />
            Call Lodge for Directions
          </Button>
        </div>
      </div>
    </div>
  );
}
