"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, ArrowRight, Shield, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface LodgeCardProps {
  lodge: {
    id: string;
    name: string;
    city: string;
    pricePerNight: number;
    roomsAvailable: number;
    totalRooms: number;
    imageUrl: string;
    rating: number;
    reviewCount: number;
    tags?: string[];
    amenities?: string[];
    description?: string;
  };
  index?: number;
}

export function LodgeCard({ lodge, index = 0 }: LodgeCardProps) {
  const urgencyPercent = Math.round(
    ((lodge.totalRooms - lodge.roomsAvailable) / lodge.totalRooms) * 100
  );
  const isUrgent = lodge.roomsAvailable <= 2;

  return (
    <Card className="card-hover overflow-hidden border-0 bg-card/80 backdrop-blur-sm group animate-fadeIn stagger-children">
      {/* Image Section */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={lodge.imageUrl}
          alt={lodge.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {lodge.tags?.map((tag) => {
            if (tag === "Popular") {
              return (
                <Badge
                  key={tag}
                  className="bg-amber-500/90 text-white border-0 text-xs font-semibold backdrop-blur-sm"
                >
                  <Zap className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              );
            }
            if (tag.includes("room")) {
              return (
                <Badge
                  key={tag}
                  className="bg-red-500/90 text-white border-0 text-xs font-semibold backdrop-blur-sm urgency-pulse"
                >
                  {tag}
                </Badge>
              );
            }
            if (tag === "Filling fast") {
              return (
                <Badge
                  key={tag}
                  className="bg-orange-500/90 text-white border-0 text-xs font-semibold backdrop-blur-sm"
                >
                  {tag}
                </Badge>
              );
            }
            return (
              <Badge
                key={tag}
                className="bg-green-500/90 text-white border-0 text-xs font-semibold backdrop-blur-sm"
              >
                {tag}
              </Badge>
            );
          })}
        </div>

        {/* Price badge - bottom right */}
        <div className="absolute bottom-3 right-3">
          <div className="bg-black/80 backdrop-blur-sm rounded-lg px-3 py-1.5">
            <span className="text-white font-bold text-lg">K{lodge.pricePerNight}</span>
            <span className="text-white/60 text-xs ml-1">/night</span>
          </div>
        </div>

        {/* Availability bar - bottom left */}
        <div className="absolute bottom-3 left-3">
          <div className="bg-black/60 backdrop-blur-sm rounded-lg px-2.5 py-1 flex items-center gap-1.5">
            <div className="w-16 h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  isUrgent ? "bg-red-500" : urgencyPercent > 50 ? "bg-orange-500" : "bg-green-500"
                }`}
                style={{ width: `${urgencyPercent}%` }}
              />
            </div>
            <span className="text-white/80 text-[11px]">
              {lodge.roomsAvailable} left
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-4">
        {/* Name and rating */}
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-semibold text-base leading-tight line-clamp-1 group-hover:text-primary transition-colors">
            {lodge.name}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-sm font-semibold">{lodge.rating}</span>
            <span className="text-xs text-muted-foreground">({lodge.reviewCount})</span>
          </div>
        </div>

        {/* City */}
        <div className="flex items-center gap-1 text-muted-foreground mb-3">
          <MapPin className="w-3.5 h-3.5" />
          <span className="text-sm">{lodge.city}</span>
        </div>

        {/* Trust signal */}
        <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 mb-3">
          <Shield className="w-3.5 h-3.5" />
          <span>No online payment — pay on arrival</span>
        </div>

        {/* Action */}
        <Link
          href={`/lodges/${lodge.id}`}
          className="flex items-center justify-between w-full py-2.5 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors group/btn"
        >
          <span>View Lodge</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
        </Link>
      </CardContent>
    </Card>
  );
}

export function LodgeCardSkeleton() {
  return (
    <Card className="overflow-hidden border-0 bg-card/80">
      <div className="aspect-[16/10] bg-muted animate-pulse" />
      <CardContent className="p-4 space-y-3">
        <div className="h-5 bg-muted rounded animate-pulse w-3/4" />
        <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
        <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
        <div className="h-10 bg-muted rounded-lg animate-pulse" />
      </CardContent>
    </Card>
  );
}
