"use client";

import { useEffect, useState } from "react";
import { Search, MapPin, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LodgeCard, LodgeCardSkeleton } from "@/components/lodge-card";

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
  featured?: boolean;
}

const ZAMBIAN_CITIES = [
  "All Cities",
  "Lusaka",
  "Livingstone",
  "Ndola",
  "Kitwe",
  "Chingola",
  "Kabwe",
  "Chipata",
  "Kafue",
  "Siavonga",
  "Solwezi",
];

const SORT_OPTIONS = [
  { label: "Recommended", value: "recommended" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Top Rated", value: "rating" },
  { label: "Fewest Rooms Left", value: "urgency" },
];

export default function LodgesPage() {
  const [lodges, setLodges] = useState<Lodge[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [sortBy, setSortBy] = useState("recommended");

  useEffect(() => {
    async function fetchLodges() {
      try {
        const res = await fetch("/api/lodges");
        if (res.ok) {
          const data = await res.json();
          setLodges(Array.isArray(data) ? data : data.lodges || []);
        }
      } catch {
        // empty
      } finally {
        setLoading(false);
      }
    }
    fetchLodges();
  }, []);

  const filtered = lodges
    .filter((l) => {
      if (selectedCity !== "All Cities" && l.city !== selectedCity) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          l.name.toLowerCase().includes(q) || l.city.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price_asc":
          return a.pricePerNight - b.pricePerNight;
        case "price_desc":
          return b.pricePerNight - a.pricePerNight;
        case "rating":
          return b.rating - a.rating;
        case "urgency":
          return a.roomsAvailable - b.roomsAvailable;
        default:
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      }
    });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Browse Lodges</h1>
        <p className="text-muted-foreground">
          {lodges.length} lodges across Zambia — head there now to secure your
          spot
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search lodges or cities..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="pl-9 pr-8 py-2 border rounded-lg text-sm bg-background appearance-none cursor-pointer"
            >
              {ZAMBIAN_CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="relative">
            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="pl-9 pr-8 py-2 border rounded-lg text-sm bg-background appearance-none cursor-pointer"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* City filter pills */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4 mb-6">
        {ZAMBIAN_CITIES.map((city) => {
          const count =
            city === "All Cities"
              ? lodges.length
              : lodges.filter((l) => l.city === city).length;
          if (city !== "All Cities" && count === 0) return null;
          return (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCity === city
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {city}
              <span className="ml-1.5 text-xs opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <LodgeCardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <>
          <p className="text-sm text-muted-foreground mb-4">
            Showing {filtered.length} lodge
            {filtered.length !== 1 ? "s" : ""}
            {selectedCity !== "All Cities" && ` in ${selectedCity}`}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {filtered.map((lodge, i) => (
              <LodgeCard key={lodge.id} lodge={lodge} index={i} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-16 animate-fadeIn">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No lodges found</h3>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-4">
            No lodges match your current filters. Try selecting a different city
            or clearing your search.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearch("");
              setSelectedCity("All Cities");
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
