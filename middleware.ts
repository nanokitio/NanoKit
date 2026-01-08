import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  // Handle game files - allow public access without authentication
  // Updated: 2025-11-24 - Force redeploy for FisherMan Slot fix
  if (request.nextUrl.pathname.startsWith('/templates/game/') || 
      request.nextUrl.pathname.startsWith('/FisherMan Slot/')) {
    const response = NextResponse.next()
    const pathname = request.nextUrl.pathname
    
    // Set proper MIME types
    if (pathname.endsWith('.html')) {
      response.headers.set('Content-Type', 'text/html; charset=utf-8')
    } else if (pathname.endsWith('.js')) {
      response.headers.set('Content-Type', 'application/javascript')
    } else if (pathname.endsWith('.json')) {
      response.headers.set('Content-Type', 'application/json')
    } else if (pathname.endsWith('.png')) {
      response.headers.set('Content-Type', 'image/png')
    } else if (pathname.endsWith('.jpg') || pathname.endsWith('.jpeg')) {
      response.headers.set('Content-Type', 'image/jpeg')
    } else if (pathname.endsWith('.webp')) {
      response.headers.set('Content-Type', 'image/webp')
    } else if (pathname.endsWith('.ogg')) {
      response.headers.set('Content-Type', 'audio/ogg')
    } else if (pathname.endsWith('.mp3')) {
      response.headers.set('Content-Type', 'audio/mpeg')
    } else if (pathname.endsWith('.mp4')) {
      response.headers.set('Content-Type', 'video/mp4')
    } else if (pathname.endsWith('.ttf') || pathname.endsWith('.woff') || pathname.endsWith('.woff2')) {
      response.headers.set('Content-Type', 'font/' + pathname.split('.').pop())
    }
    
    // Add CORS headers for cross-origin requests from S3
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type')
    
    // Add cache headers
    response.headers.set('Cache-Control', 'public, max-age=3600')
    
    return response
  }
  
  // Handle Construct 3 game files with proper MIME types
  if (request.nextUrl.pathname.startsWith('/CastleSlot/')) {
    const response = NextResponse.next()
    
    // Set proper MIME types for Construct 3 files
    const pathname = request.nextUrl.pathname
    
    if (pathname.endsWith('.js')) {
      response.headers.set('Content-Type', 'application/javascript')
    } else if (pathname.endsWith('.json')) {
      response.headers.set('Content-Type', 'application/json')
    } else if (pathname.endsWith('.wasm')) {
      response.headers.set('Content-Type', 'application/wasm')
    } else if (pathname.endsWith('.png')) {
      response.headers.set('Content-Type', 'image/png')
    } else if (pathname.endsWith('.jpg') || pathname.endsWith('.jpeg')) {
      response.headers.set('Content-Type', 'image/jpeg')
    } else if (pathname.endsWith('.webp')) {
      response.headers.set('Content-Type', 'image/webp')
    } else if (pathname.endsWith('.ogg')) {
      response.headers.set('Content-Type', 'audio/ogg')
    } else if (pathname.endsWith('.mp3')) {
      response.headers.set('Content-Type', 'audio/mpeg')
    } else if (pathname.endsWith('.mp4')) {
      response.headers.set('Content-Type', 'video/mp4')
    } else if (pathname.endsWith('.webm')) {
      response.headers.set('Content-Type', 'video/webm')
    }
    
    // Add CORS headers for cross-origin requests
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type')
    
    // Add cache headers for better performance
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
    
    return response
  }
  
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Static files (images, videos, fonts, etc.)
     * Include CastleSlot and game files for proper MIME type handling
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.webp$|.*\\.mp4$|.*\\.webm$|.*\\.mp3$|.*\\.ogg$|.*\\.woff$|.*\\.woff2$|.*\\.ttf$|.*\\.ico$).*)',
    '/CastleSlot/:path*',
    '/FisherMan Slot/:path*',
    '/templates/game/:path*',
  ],
}
