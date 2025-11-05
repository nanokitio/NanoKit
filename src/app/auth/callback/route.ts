import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const type = requestUrl.searchParams.get('type')
  const next = requestUrl.searchParams.get('next')

  if (code) {
    const supabase = await createClient()
    
    // Exchange code for session
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Error exchanging code for session:', error)
      return NextResponse.redirect(new URL('/login?error=auth_callback_failed', requestUrl.origin))
    }

    // Check if this is a password recovery flow
    // Supabase sends type=recovery for password reset
    if (type === 'recovery') {
      return NextResponse.redirect(new URL('/reset-password', requestUrl.origin))
    }
  }

  // Redirect to specified next URL or dashboard
  const redirectTo = next || '/dashboard'
  return NextResponse.redirect(new URL(redirectTo, requestUrl.origin))
}
