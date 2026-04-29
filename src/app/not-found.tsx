import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] px-4">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#ff4444]/10 flex items-center justify-center">
          <svg className="w-12 h-12 text-[#ff4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-6xl font-bold text-white mb-2">404</h1>
        <h2 className="text-xl font-semibold text-white mb-4">This page doesn&apos;t exist</h2>
        <p className="text-[#aaaaaa] mb-8">
          But our entertainment news is just a click away!
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 bg-[#ff4444] text-white font-medium rounded-lg hover:bg-[#cc0000] transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}
