import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, message } = body || {}

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 })
    }

    // Contact form submission - for now just log
    console.log('Contact form:', { name, email, message })

    return NextResponse.json({ success: true, message: 'Message received!' })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

export async function GET() {
  return NextResponse.json({ success: true })
}
