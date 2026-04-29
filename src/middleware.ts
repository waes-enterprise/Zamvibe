import { NextRequest, NextResponse } from 'next/server'

// Rate limiting store (in-memory for serverless, per-instance)
const rateLimiter = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const entry = rateLimiter.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimiter.set(ip, { count: 1, resetAt: now + windowMs })
    return true
  }
  if (entry.count >= limit) return false
  entry.count++
  return true
}

// Security headers
const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Add security headers to all responses
  for (const [key, value] of Object.entries(securityHeaders)) {
    response.headers.set(key, value)
  }

  // Rate limit API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'

    // Stricter rate limits for sensitive endpoints
    if (request.nextUrl.pathname.includes('/contact') && request.method === 'POST') {
      if (!checkRateLimit(`contact:${ip}`, 3, 60_000)) {
        return NextResponse.json({ error: 'Too many requests. Try again later.' }, { status: 429 })
      }
    }

    if (request.nextUrl.pathname.includes('/view') && request.method === 'POST') {
      if (!checkRateLimit(`view:${ip}`, 30, 60_000)) {
        return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
      }
    }

    if (request.nextUrl.pathname.includes('/share') && request.method === 'POST') {
      if (!checkRateLimit(`share:${ip}`, 20, 60_000)) {
        return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
      }
    }

    // Admin auth rate limiting (brute force protection)
    if (request.nextUrl.pathname.includes('/admin/auth') && request.method === 'POST') {
      if (!checkRateLimit(`auth:${ip}`, 5, 300_000)) {
        return NextResponse.json({ success: false, error: 'Too many login attempts. Try again in 5 minutes.' }, { status: 429 })
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icons|uploads).*)',
  ],
}
