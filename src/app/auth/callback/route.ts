import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const type = requestUrl.searchParams.get('type')
  const next = requestUrl.searchParams.get('next')
  const error_description = requestUrl.searchParams.get('error_description')
  
  console.log('Auth callback triggered:', { code: !!code, type, error_description })

  // Handle errors from Supabase (expired links, etc.)
  if (error_description) {
    console.error('Auth error from Supabase:', error_description)
    
    // If it's a password recovery error, redirect to forgot-password with message
    if (type === 'recovery' || error_description.includes('Email link')) {
      return NextResponse.redirect(
        new URL('/forgot-password?error=link_expired&message=The reset link has expired. Please request a new one.', requestUrl.origin)
      )
    }
    
    return NextResponse.redirect(
      new URL('/login?error=auth_failed&message=' + encodeURIComponent(error_description), requestUrl.origin)
    )
  }

  if (code) {
    const supabase = await createClient()
    
    // Exchange code for session
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Error exchanging code for session:', error)
      
      // If it's a password recovery that failed, send to forgot-password
      if (type === 'recovery') {
        return NextResponse.redirect(
          new URL('/forgot-password?error=session_failed&message=The reset link is invalid or has expired. Please request a new one.', requestUrl.origin)
        )
      }
      
      return NextResponse.redirect(
        new URL('/login?error=auth_callback_failed', requestUrl.origin)
      )
    }

    // Check if this is a password recovery flow
    // Supabase sends type=recovery for password reset
    if (type === 'recovery') {
      console.log('Password recovery flow - redirecting to reset-password')
      return NextResponse.redirect(new URL('/reset-password', requestUrl.origin))
    }
    
    // Successful login - go to dashboard
    console.log('Successful auth - redirecting to dashboard')
    return NextResponse.redirect(new URL('/dashboard', requestUrl.origin))
  }

  // No code provided - redirect to login
  console.log('No code provided - redirecting to login')
  const redirectTo = next || '/login'
  return NextResponse.redirect(new URL(redirectTo, requestUrl.origin))
}
