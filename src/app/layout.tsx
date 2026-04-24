import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0a0a0a",
};

export const metadata: Metadata = {
  title: "ZamVibe — Zambian Entertainment & Viral News",
  description:
    "Real-time Zambian entertainment news, celebrity gossip, viral videos, and trending stories. Your #1 source for Zambian pop culture.",
  keywords: [
    "Zambia",
    "Zambian news",
    "entertainment",
    "celebrity gossip",
    "viral",
    "music",
    "ZamVibe",
    "Chef 187",
    "Yo Maps",
    "Mampi",
    "Lusaka",
  ],
  authors: [{ name: "ZamVibe" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="icon" href="/zamvibe/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} font-sans antialiased bg-[#0a0a0a] text-white`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
