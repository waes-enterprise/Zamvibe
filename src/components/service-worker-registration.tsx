'use client'

import { useEffect } from 'react'

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('serviceWorker' in navigator)) return

    // Register service worker
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('[SW] Registered:', registration.scope)

        // Check for updates periodically (every 30 minutes)
        setInterval(() => {
          registration.update()
        }, 30 * 60 * 1000)
      })
      .catch((err) => {
        console.warn('[SW] Registration failed:', err)
      })
  }, [])

  return null
}
