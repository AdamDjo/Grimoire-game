import { NextResponse, type NextRequest } from 'next/server'

import { createClient } from '@/lib/supabase/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL

async function proxy(request: NextRequest, path: string[]) {
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const url = `${API_URL}/api/${path.join('/')}${request.nextUrl.search}`
  const headers: HeadersInit = { 'Content-Type': 'application/json' }
  if (session?.access_token) {
    headers.Authorization = `Bearer ${session.access_token}`
  }

  const body =
    request.method === 'GET' || request.method === 'HEAD' ? undefined : await request.text()

  const response = await fetch(url, {
    method: request.method,
    headers,
    body,
  })

  const data: unknown = await response.json()
  return NextResponse.json(data, { status: response.status })
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxy(request, (await params).path)
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxy(request, (await params).path)
}
