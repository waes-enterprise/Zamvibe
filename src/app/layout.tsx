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
  themeColor: "#ff4444",
};

export const metadata: Metadata = {
  title: "ZamVibe — Africa's #1 Entertainment Hub",
  description:
    "Real-time African entertainment news, celebrity gossip, music, viral videos, and trending stories from Zambia, Nigeria, South Africa, Ghana, Kenya & more.",
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
        className={`${geistSans.variable} font-sans antialiased bg-[#0f0f0f] text-white`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
