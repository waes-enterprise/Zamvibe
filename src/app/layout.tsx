import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Housemate ZM - Rent Anything in Zambia",
  description: "Premium marketplace for renting rooms, farms, offices, storage, event spaces, garages, warehouses, land, shops, and parking in Zambia. Browse listings across Lusaka, Kitwe, Ndola, Livingstone, and more.",
  keywords: ["Zambia", "rent", "marketplace", "rooms", "farms", "offices", "Lusaka", "property", "Housemate ZM"],
  authors: [{ name: "Housemate ZM" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Housemate ZM - Rent Anything in Zambia",
    description: "Premium marketplace for renting anything in Zambia. Rooms, farms, offices, event spaces and more.",
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
