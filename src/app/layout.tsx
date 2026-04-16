import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#D97706",
};

export const metadata: Metadata = {
  title: "StayNow - Find a Place to Stay",
  description:
    "Find and reserve nearby lodges in Zambia. Browse lodges in Lusaka, Livingstone, Kitwe, Ndola, Siavonga, and Chipata. Book your stay instantly.",
  keywords: [
    "Zambia",
    "lodge",
    "reservation",
    "hotel",
    "accommodation",
    "Lusaka",
    "Livingstone",
    "StayNow",
  ],
  authors: [{ name: "StayNow" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body
        className={`${geistSans.variable} font-sans antialiased bg-white text-slate-900`}
      >
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
