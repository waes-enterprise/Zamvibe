import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ data: [] })
}

export async function PATCH() {
  return NextResponse.json({ success: true })
}
