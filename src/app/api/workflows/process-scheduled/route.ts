import { NextRequest, NextResponse } from 'next/server'
import { processScheduledEmails } from '@/lib/email-workflows'

/**
 * GET /api/workflows/process-scheduled
 * Process scheduled emails (called by cron job)
 * 
 * This endpoint should be protected and only callable by:
 * 1. Vercel Cron Jobs
 * 2. External cron service with secret token
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authorization
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET || 'your-secret-token'

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('🕐 Processing scheduled emails...')

    // Process scheduled emails
    const result = await processScheduledEmails()

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      processed: result.processed,
      message: `Successfully processed ${result.processed} scheduled emails`,
    })
  } catch (error) {
    console.error('Error processing scheduled emails:', error)
    return NextResponse.json(
      { error: 'Failed to process scheduled emails', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Also support POST for Vercel Cron
export async function POST(request: NextRequest) {
  return GET(request)
}
