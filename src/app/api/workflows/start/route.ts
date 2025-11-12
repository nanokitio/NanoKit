import { NextRequest, NextResponse } from 'next/server'
import { startWorkflow } from '@/lib/email-workflows'
import { createClient } from '@/lib/supabase/server'

/**
 * POST /api/workflows/start
 * Start an email workflow for a user
 */
export async function POST(request: NextRequest) {
  try {
    const { workflowId, userEmail, userId, metadata } = await request.json()

    // Validate input
    if (!workflowId || !userEmail || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: workflowId, userEmail, userId' },
        { status: 400 }
      )
    }

    // Verify user exists
    const supabase = await createClient()
    const { data: user } = await supabase.auth.getUser()

    if (!user.user || user.user.id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Start workflow
    const result = await startWorkflow(workflowId, userEmail, userId, metadata)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      workflowRecordId: result.workflowRecordId,
      message: `Workflow ${workflowId} started successfully`,
    })
  } catch (error) {
    console.error('Error starting workflow:', error)
    return NextResponse.json(
      { error: 'Failed to start workflow', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
