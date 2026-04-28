import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ posts: 0, views: 0 })
}
