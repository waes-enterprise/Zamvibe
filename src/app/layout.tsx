import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import ServiceWorkerRegistration from "@/components/service-worker-registration";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#006633",
};

export const metadata: Metadata = {
  title: "Housemate ZM - Rent Anything in Zambia",
  description:
    "Premium marketplace for renting rooms, farms, offices, storage, event spaces, garages, warehouses, land, shops, and parking in Zambia. Browse listings across Lusaka, Kitwe, Ndola, Livingstone, and more.",
  keywords: [
    "Zambia",
    "rent",
    "marketplace",
    "rooms",
    "farms",
    "offices",
    "Lusaka",
    "property",
    "Housemate ZM",
  ],
  authors: [{ name: "Housemate ZM" }],
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Housemate ZM",
  },
  openGraph: {
    title: "Housemate ZM - Rent Anything in Zambia",
    description:
      "Premium marketplace for renting anything in Zambia. Rooms, farms, offices, event spaces and more.",
    siteName: "Housemate ZM",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Housemate ZM - Rent Anything in Zambia",
    description: "Premium marketplace for renting anything in Zambia.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <ServiceWorkerRegistration />
        <Toaster />
      </body>
    </html>
  );
}
