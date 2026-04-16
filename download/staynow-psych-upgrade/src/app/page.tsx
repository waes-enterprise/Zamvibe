"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  ArrowRight,
  Shield,
  Clock,
  MapPin,
  Star,
  TrendingUp,
  Users,
  Phone,
  Zap,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LodgeCard, LodgeCardSkeleton } from "@/components/lodge-card";
import { Input } from "@/components/ui/input";

interface Lodge {
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
  featured?: boolean;
}

export default function HomePage() {
  const [lodges, setLodges] = useState<Lodge[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchLodges() {
      try {
        const res = await fetch("/api/lodges");
        if (res.ok) {
          const data = await res.json();
          setLodges(Array.isArray(data) ? data : data.lodges || []);
        }
      } catch {
        // Fallback: show empty
      } finally {
        setLoading(false);
      }
    }
    fetchLodges();
  }, []);

  const featuredLodges = lodges.filter((l) => l.featured);
  const filteredLodges = searchQuery
    ? lodges.filter(
        (l) =>
          l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.city.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : featuredLodges.length > 0
    ? featuredLodges
    : lodges.slice(0, 6);

  const totalAvailable = lodges.reduce((sum, l) => sum + l.roomsAvailable, 0);

  return (
    <div className="min-h-screen">
      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        {/* Glowing orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/20 rounded-full blur-[100px] animate-float" />
        <div
          className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-float"
          style={{ animationDelay: "1.5s" }}
        />

        <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-28 text-center">
          {/* Live indicator */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6 animate-fadeIn">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-white/80">
              {totalAvailable} rooms available right now across Zambia
            </span>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 animate-slideUp leading-tight">
            Your Perfect Lodge
            <br />
            <span className="gradient-text">Is One Tap Away</span>
          </h1>

          <p
            className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-8 animate-fadeIn"
            style={{ animationDelay: "0.2s" }}
          >
            Discover hand-picked lodges across Zambia. Real-time availability,
            honest reviews, and the best prices guaranteed.
            <span className="block mt-2 text-amber-400 font-medium">
              No online payment needed — pay on arrival.
            </span>
          </p>

          {/* Search bar */}
          <div
            className="max-w-lg mx-auto mb-8 animate-fadeIn"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-amber-400 transition-colors" />
              <Input
                placeholder="Search by lodge name or city..."
                className="pl-12 pr-4 py-6 bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-2xl h-auto text-base backdrop-blur-sm focus:border-amber-500/50 focus:ring-amber-500/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* CTA buttons */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fadeIn"
            style={{ animationDelay: "0.4s" }}
          >
            <Link href="/lodges">
              <Button
                size="lg"
                className="rounded-xl px-8 py-6 text-base bg-amber-500 hover:bg-amber-600 text-black font-semibold gap-2 shadow-lg shadow-amber-500/25 transition-all hover:shadow-amber-500/40 hover:scale-[1.02]"
              >
                Browse All Lodges
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <p className="text-white/40 text-sm">
              or{" "}
              <span className="text-white/60 underline underline-offset-2 cursor-pointer hover:text-white/80">
                learn how StayNow works
              </span>
            </p>
          </div>
        </div>

        {/* Fade to background */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* ===== TRUST BAR ===== */}
      <section className="border-b bg-card/50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <TrustItem
              icon={<Shield className="w-5 h-5 text-emerald-500" />}
              title="Pay on Arrival"
              desc="No online payment needed"
            />
            <TrustItem
              icon={<Clock className="w-5 h-5 text-blue-500" />}
              title="Instant Confirmation"
              desc="Reserve in seconds"
            />
            <TrustItem
              icon={<MapPin className="w-5 h-5 text-amber-500" />}
              title="10+ Locations"
              desc="Across all Zambia"
            />
            <TrustItem
              icon={<CheckCircle2 className="w-5 h-5 text-purple-500" />}
              title="Verified Lodges"
              desc="Quality guaranteed"
            />
          </div>
        </div>
      </section>

      {/* ===== FEATURED LODGES ===== */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-5 h-5 text-amber-500" />
              <h2 className="text-2xl font-bold">
                {searchQuery ? "Search Results" : "Available Tonight"}
              </h2>
            </div>
            <p className="text-muted-foreground text-sm">
              {searchQuery
                ? `${filteredLodges.length} lodge${filteredLodges.length !== 1 ? "s" : ""} found`
                : "Rooms are filling up — head there now to secure your spot"}
            </p>
          </div>
          <Link href="/lodges">
            <Button variant="ghost" className="gap-1 text-sm">
              View all <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <LodgeCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredLodges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {filteredLodges.map((lodge, i) => (
              <LodgeCard key={lodge.id} lodge={lodge} index={i} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </section>

      {/* ===== SOCIAL PROOF ===== */}
      <section className="bg-card/50 border-y">
        <div className="max-w-6xl mx-auto px-4 py-12 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-bold">Travellers Love StayNow</h2>
          </div>
          <div className="flex items-center justify-center gap-6 mt-4 flex-wrap">
            <StatBadge
              value="1,200+"
              label="Bookings"
            />
            <StatBadge
              value="4.6"
              label="Avg Rating"
              icon={<Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />}
            />
            <StatBadge value="10+" label="Cities" />
            <StatBadge
              value="500+"
              label="Happy Guests"
              icon={<Users className="w-3.5 h-3.5" />}
            />
          </div>
        </div>
      </section>

      {/* ===== BOTTOM CTA ===== */}
      <section className="max-w-6xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-3">Ready to book your stay?</h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Head there now to secure your spot before rooms run out.
        </p>
        <Link href="/lodges">
          <Button
            size="lg"
            className="rounded-xl px-8 bg-amber-500 hover:bg-amber-600 text-black font-semibold gap-2"
          >
            Find My Lodge
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </section>
    </div>
  );
}

function TrustItem({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold leading-tight">{title}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}

function StatBadge({
  value,
  label,
  icon,
}: {
  value: string;
  label: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-muted">
      {icon}
      <span className="font-bold text-sm">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16 animate-fadeIn">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
        <Search className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No lodges found</h3>
      <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-4">
        We could not find any lodges matching your search. Try a different city
        or lodge name.
      </p>
      <Button
        variant="outline"
        className="gap-2"
        onClick={() => window.location.reload()}
      >
        <Phone className="w-4 h-4" />
        Browse All Lodges
      </Button>
    </div>
  );
}
