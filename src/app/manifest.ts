import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ZamVibe',
    short_name: 'ZamVibe',
    description: "Africa's #1 Entertainment Hub — Music, Celebrity Gossip, Viral Stories",
    start_url: '/',
    display: 'standalone',
    background_color: '#0f0f0f',
    theme_color: '#ff4444',
    orientation: 'portrait-primary',
    scope: '/',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    categories: ['entertainment', 'music', 'news', 'celebrity'],
    lang: 'en',
    dir: 'ltr',
  }
}
