'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] px-4">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#ff4444]/10 flex items-center justify-center">
          <svg className="w-12 h-12 text-[#ff4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h1 className="text-6xl font-bold text-white mb-2">Oops!</h1>
        <h2 className="text-xl font-semibold text-white mb-4">Something went wrong</h2>
        <p className="text-[#aaaaaa] mb-8">
          An unexpected error occurred. Please try again.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center px-6 py-3 bg-[#ff4444] text-white font-medium rounded-lg hover:bg-[#cc0000] transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-[#1a1a1a] text-white font-medium rounded-lg border border-[#272727] hover:border-[#ff4444]/40 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
