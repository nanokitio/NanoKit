import { sendEmail } from './sendgrid'
import { createClient } from '@/lib/supabase/server'

// Workflow types
export type WorkflowTrigger = 
  | 'user_signup'
  | 'prelander_created'
  | 'prelander_downloaded'
  | 'prelander_hosted'
  | 'trial_expiring'
  | 'subscription_cancelled'
  | 'manual'

export interface EmailStep {
  id: string
  name: string
  subject: string
  templateKey: string
  delayHours: number // Delay from previous step (0 for immediate)
  condition?: (userData: any) => boolean // Optional condition to send
}

export interface EmailWorkflow {
  id: string
  name: string
  trigger: WorkflowTrigger
  enabled: boolean
  steps: EmailStep[]
}

// Define your email workflows here
export const EMAIL_WORKFLOWS: EmailWorkflow[] = [
  // ONBOARDING WORKFLOW
  {
    id: 'onboarding',
    name: 'User Onboarding Sequence',
    trigger: 'user_signup',
    enabled: true,
    steps: [
      {
        id: 'welcome',
        name: 'Welcome Email',
        subject: '🎉 Welcome to PrelanderAI!',
        templateKey: 'welcome',
        delayHours: 0, // Immediate
      },
      {
        id: 'getting_started',
        name: 'Getting Started Guide',
        subject: '🚀 Create Your First Prelander',
        templateKey: 'getting_started',
        delayHours: 24, // 1 day later
      },
      {
        id: 'tips_tricks',
        name: 'Tips & Best Practices',
        subject: '💡 Pro Tips for Better Prelanders',
        templateKey: 'tips_tricks',
        delayHours: 72, // 3 days after getting_started (96 total)
      },
      {
        id: 'upgrade_prompt',
        name: 'Upgrade Benefits',
        subject: '⭐ Unlock Premium Features',
        templateKey: 'upgrade_prompt',
        delayHours: 120, // 5 days after tips (216 total = 9 days)
      },
    ],
  },

  // PRELANDER CREATED WORKFLOW
  {
    id: 'prelander_created',
    name: 'Prelander Creation Follow-up',
    trigger: 'prelander_created',
    enabled: true,
    steps: [
      {
        id: 'creation_success',
        name: 'Creation Confirmation',
        subject: '✅ Your Prelander is Ready!',
        templateKey: 'prelander_created',
        delayHours: 0,
      },
      {
        id: 'optimization_tips',
        name: 'Optimization Tips',
        subject: '📈 Optimize Your Prelander Performance',
        templateKey: 'optimization_tips',
        delayHours: 48, // 2 days later
      },
    ],
  },

  // DOWNLOAD WORKFLOW
  {
    id: 'download_workflow',
    name: 'Download & Hosting Guide',
    trigger: 'prelander_downloaded',
    enabled: true,
    steps: [
      {
        id: 'download_password',
        name: 'Download Password',
        subject: '🔐 Your Secure Download Password',
        templateKey: 'download_password',
        delayHours: 0,
      },
      {
        id: 'hosting_help',
        name: 'Hosting Assistance',
        subject: '🌐 Need Help with Hosting?',
        templateKey: 'hosting_help',
        delayHours: 24,
      },
    ],
  },

  // HOSTING WORKFLOW
  {
    id: 'hosting_workflow',
    name: 'Hosted Prelander Follow-up',
    trigger: 'prelander_hosted',
    enabled: true,
    steps: [
      {
        id: 'hosting_success',
        name: 'Hosting Confirmation',
        subject: '🎉 Your Prelander is Live!',
        templateKey: 'hosting_success',
        delayHours: 0,
      },
      {
        id: 'performance_check',
        name: 'Performance Check-in',
        subject: '📊 How is Your Prelander Performing?',
        templateKey: 'performance_check',
        delayHours: 168, // 7 days later
      },
    ],
  },

  // TRIAL EXPIRING WORKFLOW
  {
    id: 'trial_expiring',
    name: 'Trial Expiration Reminders',
    trigger: 'trial_expiring',
    enabled: true,
    steps: [
      {
        id: 'trial_7days',
        name: '7 Days Before Expiration',
        subject: '⏰ Your Trial Expires in 7 Days',
        templateKey: 'trial_7days',
        delayHours: 0,
      },
      {
        id: 'trial_3days',
        name: '3 Days Before Expiration',
        subject: '⚠️ Only 3 Days Left in Your Trial',
        templateKey: 'trial_3days',
        delayHours: 96, // 4 days later (3 days before expiration)
      },
      {
        id: 'trial_1day',
        name: '1 Day Before Expiration',
        subject: '🚨 Last Day of Your Trial!',
        templateKey: 'trial_1day',
        delayHours: 48, // 2 days later (1 day before expiration)
      },
    ],
  },
]

/**
 * Initialize workflow for a user
 */
export async function startWorkflow(
  workflowId: string,
  userEmail: string,
  userId: string,
  metadata?: Record<string, any>
) {
  const workflow = EMAIL_WORKFLOWS.find(w => w.id === workflowId)
  
  if (!workflow || !workflow.enabled) {
    console.log(`Workflow ${workflowId} not found or disabled`)
    return { success: false, error: 'Workflow not found or disabled' }
  }

  const supabase = await createClient()

  try {
    // Record workflow start
    const { data: workflowData, error: workflowError } = await supabase
      .from('email_workflows')
      .insert({
        workflow_id: workflowId,
        user_id: userId,
        user_email: userEmail,
        status: 'active',
        current_step: 0,
        metadata: metadata || {},
        started_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (workflowError) throw workflowError

    console.log(`✅ Started workflow ${workflowId} for ${userEmail}`)

    // Send first email immediately if delayHours is 0
    const firstStep = workflow.steps[0]
    if (firstStep.delayHours === 0) {
      await sendWorkflowEmail(workflowData.id, 0, userEmail, userId, metadata)
    } else {
      // Schedule first email
      await scheduleWorkflowEmail(workflowData.id, 0, firstStep.delayHours)
    }

    return { success: true, workflowRecordId: workflowData.id }
  } catch (error) {
    console.error('Error starting workflow:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

/**
 * Send a specific step in the workflow
 */
export async function sendWorkflowEmail(
  workflowRecordId: string,
  stepIndex: number,
  userEmail: string,
  userId: string,
  metadata?: Record<string, any>
) {
  const supabase = await createClient()

  try {
    // Get workflow record
    const { data: workflowRecord, error: recordError } = await supabase
      .from('email_workflows')
      .select('*')
      .eq('id', workflowRecordId)
      .single()

    if (recordError) throw recordError

    const workflow = EMAIL_WORKFLOWS.find(w => w.id === workflowRecord.workflow_id)
    if (!workflow) throw new Error('Workflow definition not found')

    const step = workflow.steps[stepIndex]
    if (!step) throw new Error('Step not found')

    // Check condition if exists
    if (step.condition) {
      const shouldSend = step.condition({ ...metadata, userId, userEmail })
      if (!shouldSend) {
        console.log(`Condition not met for step ${step.id}, skipping`)
        
        // Move to next step
        const nextStepIndex = stepIndex + 1
        if (nextStepIndex < workflow.steps.length) {
          await scheduleWorkflowEmail(
            workflowRecordId,
            nextStepIndex,
            workflow.steps[nextStepIndex].delayHours
          )
        }
        return { success: true, skipped: true }
      }
    }

    // Get email template
    const emailTemplate = await getEmailTemplate(step.templateKey, {
      ...metadata,
      userEmail,
      userId,
    })

    // Send email
    const result = await sendEmail({
      to: userEmail,
      subject: step.subject,
      html: emailTemplate.html,
      text: emailTemplate.text,
    })

    if (!result.success) throw new Error(result.error)

    // Record email sent
    await supabase.from('email_logs').insert({
      user_id: userId,
      workflow_id: workflowRecord.workflow_id,
      workflow_record_id: workflowRecordId,
      step_id: step.id,
      email: userEmail,
      subject: step.subject,
      status: 'sent',
      provider: 'sendgrid',
      provider_message_id: result.messageId,
      sent_at: new Date().toISOString(),
    })

    // Update workflow record
    await supabase
      .from('email_workflows')
      .update({
        current_step: stepIndex + 1,
        last_email_sent_at: new Date().toISOString(),
      })
      .eq('id', workflowRecordId)

    console.log(`✅ Sent workflow email: ${step.name} to ${userEmail}`)

    // Schedule next step
    const nextStepIndex = stepIndex + 1
    if (nextStepIndex < workflow.steps.length) {
      await scheduleWorkflowEmail(
        workflowRecordId,
        nextStepIndex,
        workflow.steps[nextStepIndex].delayHours
      )
    } else {
      // Workflow completed
      await supabase
        .from('email_workflows')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('id', workflowRecordId)
    }

    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('Error sending workflow email:', error)
    
    // Log error
    await supabase.from('email_logs').insert({
      user_id: userId,
      workflow_record_id: workflowRecordId,
      email: userEmail,
      status: 'failed',
      error_message: error instanceof Error ? error.message : 'Unknown error',
      sent_at: new Date().toISOString(),
    })

    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

/**
 * Schedule next workflow email
 */
async function scheduleWorkflowEmail(
  workflowRecordId: string,
  stepIndex: number,
  delayHours: number
) {
  const supabase = await createClient()

  const scheduledFor = new Date()
  scheduledFor.setHours(scheduledFor.getHours() + delayHours)

  await supabase.from('email_schedules').insert({
    workflow_record_id: workflowRecordId,
    step_index: stepIndex,
    scheduled_for: scheduledFor.toISOString(),
    status: 'pending',
  })

  console.log(`📅 Scheduled workflow email for ${scheduledFor.toISOString()}`)
}

/**
 * Stop/cancel a workflow
 */
export async function stopWorkflow(workflowRecordId: string) {
  const supabase = await createClient()

  await supabase
    .from('email_workflows')
    .update({
      status: 'cancelled',
      completed_at: new Date().toISOString(),
    })
    .eq('id', workflowRecordId)

  // Cancel scheduled emails
  await supabase
    .from('email_schedules')
    .update({ status: 'cancelled' })
    .eq('workflow_record_id', workflowRecordId)
    .eq('status', 'pending')

  console.log(`🛑 Stopped workflow ${workflowRecordId}`)
}

/**
 * Get email template content
 */
async function getEmailTemplate(
  templateKey: string,
  data: Record<string, any>
): Promise<{ html: string; text: string }> {
  // Import template functions dynamically
  const templates = await import('./email-templates')
  
  const templateFunction = (templates as any)[templateKey]
  
  if (!templateFunction) {
    throw new Error(`Template ${templateKey} not found`)
  }

  return templateFunction(data)
}

/**
 * Process scheduled emails (should be called by a cron job)
 */
export async function processScheduledEmails() {
  const supabase = await createClient()

  try {
    // Get emails that need to be sent
    const { data: scheduled, error } = await supabase
      .from('email_schedules')
      .select('*, email_workflows(*)')
      .eq('status', 'pending')
      .lte('scheduled_for', new Date().toISOString())
      .limit(100)

    if (error) throw error

    console.log(`📬 Processing ${scheduled?.length || 0} scheduled emails`)

    for (const schedule of scheduled || []) {
      const workflow = schedule.email_workflows
      
      await sendWorkflowEmail(
        schedule.workflow_record_id,
        schedule.step_index,
        workflow.user_email,
        workflow.user_id,
        workflow.metadata
      )

      // Mark as sent
      await supabase
        .from('email_schedules')
        .update({ status: 'sent', sent_at: new Date().toISOString() })
        .eq('id', schedule.id)
    }

    return { success: true, processed: scheduled?.length || 0 }
  } catch (error) {
    console.error('Error processing scheduled emails:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
