import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/sendgrid'
import { createClient } from '@/lib/supabase/server'

/**
 * POST /api/send-email
 * Send a single email using SendGrid
 */
export async function POST(request: NextRequest) {
  try {
    const { to, subject, html, text, templateId, dynamicTemplateData } = await request.json()

    // Validate input
    if (!to || (!subject && !templateId)) {
      return NextResponse.json(
        { error: 'Missing required fields: to, and either subject or templateId' },
        { status: 400 }
      )
    }

    // Optional: Verify user is authenticated
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Send email
    const result = await sendEmail({
      to,
      subject: subject || '',
      html: html || '',
      text,
      templateId,
      dynamicTemplateData,
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error, details: result.details },
        { status: 500 }
      )
    }

    // Log to database
    await supabase.from('email_logs').insert({
      user_id: user.id,
      email: to,
      subject: subject || 'Template Email',
      status: 'sent',
      provider: 'sendgrid',
      provider_message_id: result.messageId,
      sent_at: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
      message: 'Email sent successfully',
    })
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { error: 'Failed to send email', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
