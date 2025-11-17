import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    await supabase.auth.signOut()
    
    // Redirect to home page after sign out
    return NextResponse.redirect(new URL('/', request.url))
  } catch (error) {
    console.error('Sign out error:', error)
    // Even if there's an error, redirect to home
    return NextResponse.redirect(new URL('/', request.url))
  }
}

// Also handle GET requests in case the form method isn't recognized
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    await supabase.auth.signOut()
    
    return NextResponse.redirect(new URL('/', request.url))
  } catch (error) {
    console.error('Sign out error:', error)
    return NextResponse.redirect(new URL('/', request.url))
  }
}
