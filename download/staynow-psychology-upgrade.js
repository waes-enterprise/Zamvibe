#!/usr/bin/env node
/**
 * StayNow Psychology-Focused UI Upgrade
 * ========================================
 * Run in your StayNow project root: node staynow-psychology-upgrade.js
 * 
 * Features:
 * - 10 realistic Zambian lodge seed data
 * - Psychology-driven urgency & trust signals
 * - "No online payment — pay on arrival" messaging
 * - Animated lodge cards with scarcity badges
 * - Premium dark hero with emotional copy
 * - Friendly empty states
 * - 45-min reservation countdown timer
 * - Micro-interactions & smooth animations
 */

const fs = require('fs');
const path = require('path');

const files = {};

// ============================================================================
// 1. prisma/seed.ts — 10 Zambian Lodges
// ============================================================================
files['prisma/seed.ts'] = `import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const lodges = [
  {
    id: 'lodge-001',
    name: 'Copperbelt Executive Lodge',
    description: 'A refined retreat in the heart of Chingola, Copperbelt Executive Lodge offers spacious air-conditioned rooms with flat-screen TVs, complimentary Wi-Fi, and a sparkling outdoor pool. Perfect for business travellers and mining professionals visiting the Copperbelt Province. Enjoy on-site dining at our a la carte restaurant, or unwind with a cold Mosi by the poolside after a long day.',
    city: 'Chingola',
    address: 'Kabundi Road, Chingola, Copperbelt Province',
    latitude: -12.5286,
    longitude: 27.8833,
    pricePerNight: 450,
    totalRooms: 12,
    roomsAvailable: 3,
    amenities: ['Wi-Fi', 'Pool', 'Restaurant', 'Parking', 'Air Conditioning', 'Room Service'],
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=500&fit=crop',
    rating: 4.3,
    reviewCount: 87,
    featured: true,
    tags: ['Available tonight', 'Filling fast'],
  },
  {
    id: 'lodge-002',
    name: 'Mokorro Guest House',
    description: 'Mokorro Guest House offers a warm Zambian welcome in Kitwe, the bustling hub of the Copperbelt. Our cosy en-suite rooms come with hot showers, satellite TV, and free breakfast. Located just minutes from Kitwe\'s CBD and major shopping centres. Whether you are passing through or staying for work, Mokorro feels like home away from home.',
    city: 'Kitwe',
    address: 'Parklands Road, Kitwe, Copperbelt Province',
    latitude: -12.8167,
    longitude: 28.2,
    pricePerNight: 300,
    totalRooms: 8,
    roomsAvailable: 2,
    amenities: ['Wi-Fi', 'Breakfast', 'Parking', 'Hot Shower', 'TV'],
    imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=500&fit=crop',
    rating: 4.1,
    reviewCount: 63,
    featured: true,
    tags: ['Only 2 rooms left'],
  },
  {
    id: 'lodge-003',
    name: 'Savannah Rest Lodge',
    description: 'Set against the scenic backdrop of Ndola\'s green suburbs, Savannah Rest Lodge combines modern comfort with the tranquillity of nature. Each room features a private balcony, minibar, and premium bedding. Our lush gardens and braai area make it ideal for weekend getaways. Conference facilities available for corporate events up to 50 guests.',
    city: 'Ndola',
    address: 'Kansenshi Road, Ndola, Copperbelt Province',
    latitude: -12.9587,
    longitude: 28.6366,
    pricePerNight: 400,
    totalRooms: 15,
    roomsAvailable: 5,
    amenities: ['Wi-Fi', 'Pool', 'Restaurant', 'Garden', 'Conference Room', 'Balcony'],
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=500&fit=crop',
    rating: 4.5,
    reviewCount: 124,
    featured: true,
    tags: ['Available tonight'],
  },
  {
    id: 'lodge-004',
    name: 'Lusaka Comfort Inn',
    description: 'Located in Lusaka\'s vibrant East Park area, Comfort Inn is the capital\'s best-kept secret for affordable luxury. Walk to Arcades Shopping Mall, Manda Hill, and dozens of restaurants. Our rooftop terrace offers stunning city views at sunset. Every room includes a workstation, perfect for digital nomads and business travellers.',
    city: 'Lusaka',
    address: 'Church Road, Lusaka, Lusaka Province',
    latitude: -15.3875,
    longitude: 28.3228,
    pricePerNight: 600,
    totalRooms: 20,
    roomsAvailable: 1,
    amenities: ['Wi-Fi', 'Rooftop Terrace', 'Restaurant', 'Gym', 'Workspace', 'Airport Shuttle'],
    imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=500&fit=crop',
    rating: 4.7,
    reviewCount: 213,
    featured: true,
    tags: ['Only 1 room left', 'Popular'],
  },
  {
    id: 'lodge-005',
    name: 'Livingstone Safari Lodge',
    description: 'Just 15 minutes from Victoria Falls, Livingstone Safari Lodge is your gateway to Zambia\'s premier tourist destination. Thatched chalets with authentic African decor, a riverside bar overlooking the Zambezi, and daily guided tours to the Falls. We arrange sunset river cruises, bungee jumping, and helicopter flights. An unforgettable experience awaits.',
    city: 'Livingstone',
    address: 'Mosi-oa-Tunya Road, Livingstone, Southern Province',
    latitude: -17.8419,
    longitude: 25.8543,
    pricePerNight: 700,
    totalRooms: 10,
    roomsAvailable: 2,
    amenities: ['Wi-Fi', 'River View', 'Restaurant', 'Tour Desk', 'Pool', 'Bar'],
    imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=500&fit=crop',
    rating: 4.8,
    reviewCount: 342,
    featured: true,
    tags: ['Filling fast'],
  },
  {
    id: 'lodge-006',
    name: 'Kafue River Camp',
    description: 'Nestled on the banks of the mighty Kafue River, this eco-friendly camp offers a true Zambian bush experience. Wake up to hippo calls, enjoy bird watching from your deck, and fall asleep under a blanket of stars. Comfortable safari tents with en-suite bathrooms. Ideal for nature lovers, anglers, and anyone seeking to disconnect from the hustle.',
    city: 'Kafue',
    address: 'Kafue River Road, Kafue, Lusaka Province',
    latitude: -15.77,
    longitude: 28.17,
    pricePerNight: 350,
    totalRooms: 6,
    roomsAvailable: 4,
    amenities: ['River View', 'Bird Watching', 'Fishing', 'Campfire', 'Breakfast', 'Parking'],
    imageUrl: 'https://images.unsplash.com/photo-1510278715850-9a2712ea1eb3?w=800&h=500&fit=crop',
    rating: 4.4,
    reviewCount: 56,
    featured: false,
    tags: ['Available tonight'],
  },
  {
    id: 'lodge-007',
    name: 'Chipata Gateway Lodge',
    description: 'The perfect stopover on your way to South Luangwa National Park or the Malawi border. Chipata Gateway Lodge offers clean, comfortable rooms at unbeatable prices. Our friendly staff can arrange safari packages, vehicle hire, and local tours. Enjoy traditional Zambian cuisine at our in-house restaurant, or grab a cold drink at the bar after a day on the road.',
    city: 'Chipata',
    address: 'Mchinji Road, Chipata, Eastern Province',
    latitude: -13.6327,
    longitude: 32.6464,
    pricePerNight: 250,
    totalRooms: 10,
    roomsAvailable: 6,
    amenities: ['Wi-Fi', 'Restaurant', 'Bar', 'Parking', 'Tour Desk', 'Breakfast'],
    imageUrl: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=500&fit=crop',
    rating: 4.0,
    reviewCount: 38,
    featured: false,
    tags: ['Great value'],
  },
  {
    id: 'lodge-008',
    name: 'Sunset Ridge Hotel',
    description: 'Perched on the hills overlooking Kabwe, Sunset Ridge Hotel offers panoramic views of the Zambian countryside. Our boutique hotel features elegantly decorated rooms, an infinity pool, and one of the finest restaurants in Central Province. Perfect for romantic getaways, anniversaries, or simply treating yourself to something special.',
    city: 'Kabwe',
    address: 'Broadway Road, Kabwe, Central Province',
    latitude: -14.4669,
    longitude: 28.4464,
    pricePerNight: 500,
    totalRooms: 14,
    roomsAvailable: 3,
    amenities: ['Wi-Fi', 'Infinity Pool', 'Restaurant', 'Garden', 'Valley View', 'Room Service'],
    imageUrl: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=500&fit=crop',
    rating: 4.6,
    reviewCount: 91,
    featured: true,
    tags: ['Filling fast', 'Premium'],
  },
  {
    id: 'lodge-009',
    name: 'Siavonga Lake Resort',
    description: 'Escape to the shores of Lake Kariba at Siavonga Lake Resort. Our lakeside chalets offer direct water access, private decks, and breathtaking sunset views over the lake. Enjoy boat cruises, fishing expeditions, and fresh tilapia from the lake. A tranquil paradise just two hours from Lusaka, perfect for weekend retreats and family holidays.',
    city: 'Siavonga',
    address: 'Lake Kariba Drive, Siavonga, Southern Province',
    latitude: -16.5403,
    longitude: 28.7069,
    pricePerNight: 550,
    totalRooms: 8,
    roomsAvailable: 2,
    amenities: ['Lake View', 'Boat Cruises', 'Fishing', 'Restaurant', 'Pool', 'Private Deck'],
    imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=500&fit=crop',
    rating: 4.7,
    reviewCount: 78,
    featured: true,
    tags: ['Only 2 rooms left', 'Weekend favourite'],
  },
  {
    id: 'lodge-010',
    name: 'Solwezi Travellers Inn',
    description: 'The top-rated accommodation in Solwezi, North-Western Province. Solwezi Travellers Inn caters to the growing mining and business community with modern rooms, reliable power backup, high-speed internet, and a 24-hour front desk. Our conference room seats 30 and we offer laundry service for extended stays. Clean, safe, and always welcoming.',
    city: 'Solwezi',
    address: 'Kansanshi Road, Solwezi, North-Western Province',
    latitude: -11.7186,
    longitude: 26.3847,
    pricePerNight: 380,
    totalRooms: 16,
    roomsAvailable: 7,
    amenities: ['Wi-Fi', 'Generator', 'Conference Room', 'Laundry', 'Restaurant', 'Secure Parking'],
    imageUrl: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&h=500&fit=crop',
    rating: 4.2,
    reviewCount: 45,
    featured: false,
    tags: ['Available tonight', 'Business friendly'],
  },
];

async function main() {
  console.log('Seeding 10 Zambian lodges into StayNow...');

  for (const lodge of lodges) {
    const { tags, amenities, ...data } = lodge;
    await prisma.lodge.upsert({
      where: { id: data.id },
      update: { ...data, amenities: { set: amenities } },
      create: { ...data, amenities: { set: amenities } },
    });
    console.log('  Seeded:', lodge.name);
  }

  console.log('Done! All 10 lodges seeded successfully.');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
`;

// ============================================================================
// 2. src/app/globals.css — Psychology Animations
// ============================================================================
files['src/app/globals.css'] = `@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
  --color-sidebar-ring: var(--sidebar-ring);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar: var(--sidebar);
  --color-chart-5: var(--chart-5);
  --color-chart-4: var(--chart-4);
  --color-chart-3: var(--chart-3);
  --color-chart-2: var(--chart-2);
  --color-chart-1: var(--chart-1);
  --color-ring: var(--ring);
  --color-input: var(--input);
  --color-border: var(--border);
  --color-destructive: var(--destructive);
  --color-accent-foreground: var(--accent-foreground);
  --color-accent: var(--accent);
  --color-muted-foreground: var(--muted-foreground);
  --color-muted: var(--muted);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-secondary: var(--secondary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary: var(--primary);
  --color-popover-foreground: var(--popover-foreground);
  --color-popover: var(--popover);
  --color-card-foreground: var(--card-foreground);
  --color-card: var(--card);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}

:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0.08 265);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.965 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.965 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.965 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0.08 265);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.965 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.205 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(0.3 0 0);
  --input: oklch(0.3 0 0);
  --ring: oklch(0.551 0 0);
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(0.3 0 0);
  --sidebar-ring: oklch(0.551 0 0);
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

/* ========== PSYCHOLOGY ANIMATIONS ========== */

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-6px); }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
  50% { box-shadow: 0 0 0 8px rgba(34, 197, 94, 0); }
}

@keyframes countdown-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes gradient-x {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-out forwards;
}

.animate-slideUp {
  animation: slideUp 0.6s ease-out forwards;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-shimmer {
  background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
}

.animate-pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}

.animate-countdown {
  animation: countdown-pulse 1s ease-in-out infinite;
}

.animate-gradient-x {
  background-size: 200% 200%;
  animation: gradient-x 3s ease infinite;
}

/* Card hover micro-interaction */
.card-hover {
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

/* Urgency badge pulse */
.urgency-pulse {
  animation: pulse-glow 1.5s ease-in-out infinite;
}

/* Stagger children animation helper */
.stagger-children > * {
  opacity: 0;
  animation: fadeIn 0.5s ease-out forwards;
}
.stagger-children > *:nth-child(1) { animation-delay: 0.05s; }
.stagger-children > *:nth-child(2) { animation-delay: 0.1s; }
.stagger-children > *:nth-child(3) { animation-delay: 0.15s; }
.stagger-children > *:nth-child(4) { animation-delay: 0.2s; }
.stagger-children > *:nth-child(5) { animation-delay: 0.25s; }
.stagger-children > *:nth-child(6) { animation-delay: 0.3s; }
.stagger-children > *:nth-child(7) { animation-delay: 0.35s; }
.stagger-children > *:nth-child(8) { animation-delay: 0.4s; }
.stagger-children > *:nth-child(9) { animation-delay: 0.45s; }
.stagger-children > *:nth-child(10) { animation-delay: 0.5s; }

/* Gradient text utility */
.gradient-text {
  background: linear-gradient(135deg, #f59e0b 0%, #ef4444 50%, #f59e0b 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradient-x 3s ease infinite;
}

/* Hide scrollbar but allow scroll */
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
`;

// ============================================================================
// 3. src/app/layout.tsx — Updated Layout with PWA & Psychology Meta
// ============================================================================
files['src/app/layout.tsx'] = `import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StayNow | Book Zambian Lodges Instantly",
  description: "Discover and book the best lodges across Zambia. No online payment needed — pay on arrival. Available rooms are filling up fast!",
  keywords: ["Zambia", "lodge", "booking", "hotel", "accommodation", "Lusaka", "Livingstone", "Copperbelt"],
  openGraph: {
    title: "StayNow | Book Zambian Lodges Instantly",
    description: "Find your perfect lodge in Zambia. Real-time availability, best prices, pay on arrival.",
    type: "website",
    locale: "en_ZM",
    siteName: "StayNow",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "theme-color": "#0a0a0a",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={\`\${geistSans.variable} \${geistMono.variable} antialiased\`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <header className="flex h-14 items-center gap-3 border-b px-4">
                <SidebarTrigger className="-ml-1" />
                <div className="flex-1" />
              </header>
              <main className="flex-1 overflow-auto">
                {children}
              </main>
            </SidebarInset>
          </SidebarProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
`;

// ============================================================================
// 4. src/components/lodge-card.tsx — Psychology-Driven Lodge Card
// ============================================================================
files['src/components/lodge-card.tsx'] = `"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Users, ArrowRight, Shield, Zap } from "lucide-react";
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
  const isPopular = lodge.tags?.includes("Popular");

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
                className={\`h-full rounded-full transition-all \${
                  isUrgent ? "bg-red-500" : urgencyPercent > 50 ? "bg-orange-500" : "bg-green-500"
                }\`}
                style={{ width: \`\${urgencyPercent}%\` }}
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
          href={\`/lodges/\${lodge.id}\`}
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
`;

// ============================================================================
// 5. src/app/page.tsx — Premium Psychology Home Page
// ============================================================================
files['src/app/page.tsx'] = `"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
import { Badge } from "@/components/ui/badge";
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
          <div className="absolute inset-0" style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)",
            backgroundSize: "40px 40px"
          }} />
        </div>

        {/* Glowing orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/20 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: "1.5s" }} />

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

          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-8 animate-fadeIn" style={{ animationDelay: "0.2s" }}>
            Discover hand-picked lodges across Zambia. Real-time availability, honest reviews, and the best prices guaranteed.
            <span className="block mt-2 text-amber-400 font-medium">
              No online payment needed — pay on arrival.
            </span>
          </p>

          {/* Search bar */}
          <div className="max-w-lg mx-auto mb-8 animate-fadeIn" style={{ animationDelay: "0.3s" }}>
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
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fadeIn" style={{ animationDelay: "0.4s" }}>
            <Link href="/lodges">
              <Button size="lg" className="rounded-xl px-8 py-6 text-base bg-amber-500 hover:bg-amber-600 text-black font-semibold gap-2 shadow-lg shadow-amber-500/25 transition-all hover:shadow-amber-500/40 hover:scale-[1.02]">
                Browse All Lodges
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <p className="text-white/40 text-sm">
              or <span className="text-white/60 underline underline-offset-2 cursor-pointer hover:text-white/80">learn how StayNow works</span>
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
                ? \`\${filteredLodges.length} lodge\${filteredLodges.length !== 1 ? "s" : ""} found\`
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
            <StatBadge value="1,200+" label="Bookings" />
            <StatBadge value="4.6" label="Avg Rating" icon={<Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />} />
            <StatBadge value="10+" label="Cities" />
            <StatBadge value="500+" label="Happy Guests" icon={<Users className="w-3.5 h-3.5" />} />
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
          <Button size="lg" className="rounded-xl px-8 bg-amber-500 hover:bg-amber-600 text-black font-semibold gap-2">
            Find My Lodge
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </section>
    </div>
  );
}

function TrustItem({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
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

function StatBadge({ value, label, icon }: { value: string; label: string; icon?: React.ReactNode }) {
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
        We could not find any lodges matching your search. Try a different city or lodge name.
      </p>
      <Button variant="outline" className="gap-2" onClick={() => window.location.reload()}>
        <Phone className="w-4 h-4" />
        Browse All Lodges
      </Button>
    </div>
  );
}
`;

// ============================================================================
// 6. src/app/lodges/page.tsx — Browse Lodges Page
// ============================================================================
files['src/app/lodges/page.tsx'] = `"use client";

import { useEffect, useState } from "react";
import { Search, SlidersHorizontal, MapPin, ArrowUpDown } from "lucide-react";
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
      } catch {}
      finally {
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
        return l.name.toLowerCase().includes(q) || l.city.toLowerCase().includes(q);
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
          {lodges.length} lodges across Zambia — head there now to secure your spot
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
                <option key={c} value={c}>{c}</option>
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
                <option key={o.value} value={o.value}>{o.label}</option>
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
              className={\`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all \${
                selectedCity === city
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }\`}
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
            Showing {filtered.length} lodge{filtered.length !== 1 ? "s" : ""}
            {selectedCity !== "All Cities" && \` in \${selectedCity}\`}
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
            No lodges match your current filters. Try selecting a different city or clearing your search.
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
`;

// ============================================================================
// 7. src/app/lodges/[id]/page.tsx — Lodge Detail with Psychology
// ============================================================================
files['src/app/lodges/[id]/page.tsx'] = `"use client";

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
  Users,
  Wifi,
  Car,
  UtensilsCrossed,
  Waves,
  Dumbbell,
  Briefcase,
  Tv,
  WifiOff,
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
  "Pool": <Waves className="w-4 h-4" />,
  "Restaurant": <UtensilsCrossed className="w-4 h-4" />,
  "Parking": <Car className="w-4 h-4" />,
  "Air Conditioning": <WifiOff className="w-4 h-4" />,
  "Room Service": <BedDouble className="w-4 h-4" />,
  "Breakfast": <UtensilsCrossed className="w-4 h-4" />,
  "Gym": <Dumbbell className="w-4 h-4" />,
  "Conference Room": <Briefcase className="w-4 h-4" />,
  "TV": <Tv className="w-4 h-4" />,
  "Bar": <UtensilsCrossed className="w-4 h-4" />,
  "Balcony": <MapPin className="w-4 h-4" />,
  "Garden": <MapPin className="w-4 h-4" />,
  "Hot Shower": <Waves className="w-4 h-4" />,
  "Workspace": <Briefcase className="w-4 h-4" />,
  "Airport Shuttle": <Car className="w-4 h-4" />,
  "Rooftop Terrace": <MapPin className="w-4 h-4" />,
  "Tour Desk": <MapPin className="w-4 h-4" />,
  "River View": <Waves className="w-4 h-4" />,
  "Lake View": <Waves className="w-4 h-4" />,
  "Valley View": <MapPin className="w-4 h-4" />,
  "Laundry": <WifiOff className="w-4 h-4" />,
  "Generator": <WifiOff className="w-4 h-4" />,
  "Secure Parking": <Shield className="w-4 h-4" />,
  "Campfire": <WifiOff className="w-4 h-4" />,
  "Fishing": <WifiOff className="w-4 h-4" />,
  "Bird Watching": <WifiOff className="w-4 h-4" />,
  "Boat Cruises": <Waves className="w-4 h-4" />,
  "Private Deck": <MapPin className="w-4 h-4" />,
  "Infinity Pool": <Waves className="w-4 h-4" />,
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
        const res = await fetch(\\\`/api/lodges/\\\${params.id}\\\`);
        if (res.ok) {
          const data = await res.json();
          setLodge(data);
        }
      } catch {}
      finally {
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
        router.push(\\\`/reservations/\\\${data.id}\\\`);
      }
    } catch {}
    finally {
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
        <p className="text-muted-foreground mb-4">This lodge may have been removed or the link is incorrect.</p>
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
              className={\`\${
                tag.includes("room") ? "bg-red-500/90" : tag === "Filling fast" ? "bg-orange-500/90" : "bg-green-500/90"
              } text-white border-0 backdrop-blur-sm text-xs font-semibold \${
                tag.includes("room") ? "urgency-pulse" : ""
              }\`}
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Price overlay */}
        <div className="absolute bottom-4 right-4">
          <div className="bg-black/80 backdrop-blur-sm rounded-xl px-5 py-3">
            <span className="text-white font-bold text-2xl">K{lodge.pricePerNight}</span>
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
            <span className="text-sm text-muted-foreground">({lodge.reviewCount})</span>
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
                    ? \\\`Only \\\${lodge.roomsAvailable} room\\\${lodge.roomsAvailable !== 1 ? "s" : ""} left — book now!\\\`
                    : \\\`\\\${lodge.roomsAvailable} room\\\${lodge.roomsAvailable !== 1 ? "s" : ""} available\\\`}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {lodge.roomsAvailable} of {lodge.totalRooms}
              </span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={\`h-full rounded-full transition-all \${
                  isUrgent ? "bg-red-500 urgency-pulse" : urgencyPercent > 50 ? "bg-orange-500" : "bg-emerald-500"
                }\`}
                style={{ width: \\\`\\\${urgencyPercent}%\\\` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">About this lodge</h2>
          <p className="text-muted-foreground leading-relaxed">{lodge.description}</p>
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
                    {AMENITY_ICONS[amenity] || <CheckCircle2 className="w-4 h-4" />}
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
                  Your reservation is confirmed instantly. Pay directly at the lodge when you arrive.
                  No credit card required, no hidden fees.
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
            <a href={\\\`tel:info\\\${lodge.city.toLowerCase()}@staynow.co.zm\\\`}>
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
`;

// ============================================================================
// 8. src/app/reservations/[id]/page.tsx — Countdown Timer Page
// ============================================================================
files['src/app/reservations/[id]/page.tsx'] = `"use client";

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
  Calendar,
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
        const res = await fetch(\\\`/api/reservations/\\\${params.id}\\\`);
        if (res.ok) {
          const data = await res.json();
          setReservation(data);
        }
      } catch {}
      finally {
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
    { label: "Reserved", active: true, icon: <CheckCircle2 className="w-5 h-5" /> },
    { label: "Head to Lodge", active: false, icon: <MapPin className="w-5 h-5" /> },
    { label: "Pay on Arrival", active: false, icon: <Shield className="w-5 h-5" /> },
    { label: "Enjoy Your Stay!", active: false, icon: <CheckCircle2 className="w-5 h-5" /> },
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
        <p className="text-muted-foreground mb-4">Check your link and try again.</p>
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
      <Card className={\`mb-6 border-0 \${
        isExpired
          ? "bg-red-50 dark:bg-red-950/30"
          : isCritical
          ? "bg-red-50 dark:bg-red-950/20"
          : isUrgent
          ? "bg-orange-50 dark:bg-orange-950/20"
          : "bg-emerald-50 dark:bg-emerald-950/20"
      }\`}>
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
              <Button onClick={() => router.push(\\\`/lodges/\\\${reservation.lodgeId}\\\`)} className="gap-2">
                Reserve Again <ArrowRight className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <div className={\`flex items-center justify-center gap-2 mb-2 \${isUrgent ? "animate-countdown" : ""}\`}>
                <Clock className={\`w-5 h-5 \${
                  isCritical ? "text-red-500" : isUrgent ? "text-orange-500" : "text-emerald-500"
                }\`} />
                <span className="text-sm font-medium">
                  {isCritical
                    ? "Hurry! Head there now to secure your spot"
                    : isUrgent
                    ? "Time is running out — head to the lodge soon"
                    : "Head there now to secure your spot"}
                </span>
              </div>
              <div className={\`text-5xl font-bold font-mono tracking-wider \${
                isCritical
                  ? "text-red-600 dark:text-red-400"
                  : isUrgent
                  ? "text-orange-600 dark:text-orange-400"
                  : "text-emerald-600 dark:text-emerald-400"
              }\`}>
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
                <div className={\`mt-0.5 \${step.active ? "text-emerald-500" : "text-muted-foreground/40"}\`}>
                  {step.active ? step.icon : <Circle className="w-5 h-5" />}
                </div>
                <div className={\`flex-1 \${
                  i < statusSteps.length - 1 ? "pb-4 border-b border-muted" : ""
                }\`}>
                  <p className={\`text-sm font-medium \${step.active ? "" : "text-muted-foreground"}\`}>
                    {step.label}
                  </p>
                  {step.active && i === 0 && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Reserved at {new Date(reservation.createdAt).toLocaleTimeString()}
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
                window.location.href = \\\`tel:\\\${reservation.lodge.phone}\\\`;
              } else {
                window.location.href = \\\`tel:+260\\\`;
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
`;

// ============================================================================
// WRITE ALL FILES
// ============================================================================
const projectRoot = process.cwd();

let written = 0;
let skipped = 0;

for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(projectRoot, filePath);
  const dir = path.dirname(fullPath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(\`  Written: \${filePath}\`);
  written++;
}

console.log(\`\nDone! \${written} files written.\`);
console.log(\`\nNext steps:\`);
console.log(\`  1. Run seed:    npx prisma db seed\`);
console.log(\`  2. Test local:  npm run dev\`);
console.log(\`  3. Deploy:      git add . && git commit -m "feat: psychology UI upgrade" && git push\`);
