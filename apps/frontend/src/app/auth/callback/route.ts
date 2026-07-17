import { NextResponse, type NextRequest } from 'next/server'

import { getSafeInternalDestination } from '@/lib/internal-navigation'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')
  const next = getSafeInternalDestination(searchParams.get('next'), '/')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(new URL(next, origin))
    }
  }

  const loginUrl = new URL('/login', origin)
  loginUrl.searchParams.set('error', 'callback')
  return NextResponse.redirect(loginUrl)
}
