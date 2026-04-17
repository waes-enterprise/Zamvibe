"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  MapPin,
  Shield,
  Phone,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Wifi,
  Car,
  UtensilsCrossed,
  Waves,
  Dumbbell,
  Briefcase,
  Tv,
  BedDouble,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface Lodge {
  id: string;
  name: string;
  city: string;
  address: string;
  description: string;
  pricePerNight: number;
  roomsAvailable: number;
  totalRooms: number;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  tags?: string[];
  amenities?: string[];
  latitude: number;
  longitude: number;
}

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  "Wi-Fi": <Wifi className="w-4 h-4" />,
  Pool: <Waves className="w-4 h-4" />,
  "Infinity Pool": <Waves className="w-4 h-4" />,
  Restaurant: <UtensilsCrossed className="w-4 h-4" />,
  Parking: <Car className="w-4 h-4" />,
  "Secure Parking": <Shield className="w-4 h-4" />,
  "Air Conditioning": <Tv className="w-4 h-4" />,
  "Room Service": <BedDouble className="w-4 h-4" />,
  Breakfast: <UtensilsCrossed className="w-4 h-4" />,
  Gym: <Dumbbell className="w-4 h-4" />,
  "Conference Room": <Briefcase className="w-4 h-4" />,
  TV: <Tv className="w-4 h-4" />,
  Bar: <UtensilsCrossed className="w-4 h-4" />,
  Balcony: <MapPin className="w-4 h-4" />,
  Garden: <MapPin className="w-4 h-4" />,
  "Hot Shower": <Waves className="w-4 h-4" />,
  Workspace: <Briefcase className="w-4 h-4" />,
  "Airport Shuttle": <Car className="w-4 h-4" />,
  "Rooftop Terrace": <MapPin className="w-4 h-4" />,
  "Tour Desk": <MapPin className="w-4 h-4" />,
  "River View": <Waves className="w-4 h-4" />,
  "Lake View": <Waves className="w-4 h-4" />,
  "Valley View": <MapPin className="w-4 h-4" />,
  Laundry: <BedDouble className="w-4 h-4" />,
  Generator: <BedDouble className="w-4 h-4" />,
  Campfire: <BedDouble className="w-4 h-4" />,
  Fishing: <BedDouble className="w-4 h-4" />,
  "Bird Watching": <BedDouble className="w-4 h-4" />,
  "Boat Cruises": <Waves className="w-4 h-4" />,
  "Private Deck": <MapPin className="w-4 h-4" />,
};

export default function LodgeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [lodge, setLodge] = useState<Lodge | null>(null);
  const [loading, setLoading] = useState(true);
  const [reserving, setReserving] = useState(false);

  useEffect(() => {
    async function fetchLodge() {
      try {
        const res = await fetch("/api/lodges/" + params.id);
        if (res.ok) {
          const data = await res.json();
          setLodge(data);
        }
      } catch {
        // empty
      } finally {
        setLoading(false);
      }
    }
    fetchLodge();
  }, [params.id]);

  async function handleReserve() {
    if (!lodge) return;
    setReserving(true);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lodgeId: lodge.id }),
      });
      if (res.ok) {
        const data = await res.json();
        router.push("/reservations/" + data.id);
      }
    } catch {
      // empty
    } finally {
      setReserving(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        <div className="h-72 bg-muted rounded-2xl animate-pulse" />
        <div className="h-8 bg-muted rounded animate-pulse w-2/3" />
        <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
        <div className="h-40 bg-muted rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!lodge) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-semibold mb-2">Lodge not found</h2>
        <p className="text-muted-foreground mb-4">
          This lodge may have been removed or the link is incorrect.
        </p>
        <Link href="/lodges">
          <Button variant="outline">Back to Lodges</Button>
        </Link>
      </div>
    );
  }

  const isUrgent = lodge.roomsAvailable <= 2;
  const urgencyPercent = Math.round(
    ((lodge.totalRooms - lodge.roomsAvailable) / lodge.totalRooms) * 100
  );

  return (
    <div className="max-w-4xl mx-auto px-4 pb-24">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mt-4 mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Hero Image */}
      <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-6 animate-fadeIn">
        <Image
          src={lodge.imageUrl}
          alt={lodge.name}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 896px) 100vw, 896px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Tags */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {lodge.tags?.map((tag) => (
            <Badge
              key={tag}
              className={
                (tag.includes("room")
                  ? "bg-red-500/90"
                  : tag === "Filling fast"
                  ? "bg-orange-500/90"
                  : "bg-green-500/90") +
                " text-white border-0 backdrop-blur-sm text-xs font-semibold " +
                (tag.includes("room") ? "urgency-pulse" : "")
              }
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Price overlay */}
        <div className="absolute bottom-4 right-4">
          <div className="bg-black/80 backdrop-blur-sm rounded-xl px-5 py-3">
            <span className="text-white font-bold text-2xl">
              K{lodge.pricePerNight}
            </span>
            <span className="text-white/60 text-sm"> / night</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="animate-slideUp">
        {/* Name and rating */}
        <div className="flex items-start justify-between gap-4 mb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl md:text-3xl font-bold">{lodge.name}</h1>
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{lodge.address || lodge.city}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 bg-amber-50 dark:bg-amber-500/10 px-3 py-1.5 rounded-full">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="font-semibold">{lodge.rating}</span>
            <span className="text-sm text-muted-foreground">
              ({lodge.reviewCount})
            </span>
          </div>
        </div>

        {/* Urgency bar */}
        <Card className="my-4 border-0 bg-muted/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {isUrgent ? (
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                ) : (
                  <Clock className="w-4 h-4 text-emerald-500" />
                )}
                <span className="text-sm font-medium">
                  {isUrgent
                    ? "Only " +
                      lodge.roomsAvailable +
                      " room" +
                      (lodge.roomsAvailable !== 1 ? "s" : "") +
                      " left — book now!"
                    : lodge.roomsAvailable +
                      " room" +
                      (lodge.roomsAvailable !== 1 ? "s" : "") +
                      " available"}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {lodge.roomsAvailable} of {lodge.totalRooms}
              </span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={
                  "h-full rounded-full transition-all " +
                  (isUrgent
                    ? "bg-red-500 urgency-pulse"
                    : urgencyPercent > 50
                    ? "bg-orange-500"
                    : "bg-emerald-500")
                }
                style={{ width: urgencyPercent + "%" }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">About this lodge</h2>
          <p className="text-muted-foreground leading-relaxed">
            {lodge.description}
          </p>
        </div>

        {/* Amenities */}
        {lodge.amenities && lodge.amenities.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Amenities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {lodge.amenities.map((amenity) => (
                <div
                  key={amenity}
                  className="flex items-center gap-2.5 p-3 rounded-lg bg-muted/50"
                >
                  <div className="text-muted-foreground">
                    {AMENITY_ICONS[amenity] || (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                  </div>
                  <span className="text-sm">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trust signals */}
        <Card className="border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/30 mb-6">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-sm mb-1">
                  No online payment — pay on arrival
                </p>
                <p className="text-xs text-muted-foreground">
                  Your reservation is confirmed instantly. Pay directly at the
                  lodge when you arrive. No credit card required, no hidden fees.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t px-4 py-3 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Per night</p>
            <p className="text-xl font-bold">K{lodge.pricePerNight}</p>
          </div>
          <div className="flex gap-2">
            <a href={"tel:info" + lodge.city.toLowerCase() + "@staynow.co.zm"}>
              <Button variant="outline" size="lg" className="gap-2">
                <Phone className="w-4 h-4" />
                Call
              </Button>
            </a>
            <Button
              size="lg"
              onClick={handleReserve}
              disabled={reserving || lodge.roomsAvailable === 0}
              className="bg-amber-500 hover:bg-amber-600 text-black font-semibold gap-2 px-8 min-w-[160px]"
            >
              {lodge.roomsAvailable === 0
                ? "Sold Out"
                : reserving
                ? "Reserving..."
                : "Reserve Now"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
