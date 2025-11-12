import { NextRequest, NextResponse } from 'next/server'
import { stopWorkflow } from '@/lib/email-workflows'
import { createClient } from '@/lib/supabase/server'

/**
 * POST /api/workflows/stop
 * Stop/cancel an active workflow
 */
export async function POST(request: NextRequest) {
  try {
    const { workflowRecordId } = await request.json()

    if (!workflowRecordId) {
      return NextResponse.json(
        { error: 'Missing workflowRecordId' },
        { status: 400 }
      )
    }

    // Verify user owns the workflow
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: workflow } = await supabase
      .from('email_workflows')
      .select('user_id')
      .eq('id', workflowRecordId)
      .single()

    if (!workflow || workflow.user_id !== user.id) {
      return NextResponse.json({ error: 'Workflow not found or unauthorized' }, { status: 404 })
    }

    // Stop workflow
    await stopWorkflow(workflowRecordId)

    return NextResponse.json({
      success: true,
      message: 'Workflow stopped successfully',
    })
  } catch (error) {
    console.error('Error stopping workflow:', error)
    return NextResponse.json(
      { error: 'Failed to stop workflow', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
