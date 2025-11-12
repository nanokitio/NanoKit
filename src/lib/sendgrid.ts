import sgMail from '@sendgrid/mail'

// Initialize SendGrid
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || ''
const SENDER_EMAIL = process.env.SENDGRID_SENDER_EMAIL || 'noreply@landertag.com'
const SENDER_NAME = process.env.SENDGRID_SENDER_NAME || 'PrelanderAI'

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY)
}

interface SendEmailParams {
  to: string
  subject: string
  html: string
  text?: string
  from?: {
    email: string
    name: string
  }
  templateId?: string
  dynamicTemplateData?: Record<string, any>
}

/**
 * Send email using SendGrid
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
  from,
  templateId,
  dynamicTemplateData,
}: SendEmailParams) {
  if (!SENDGRID_API_KEY) {
    console.warn('⚠️ SENDGRID_API_KEY not configured. Email not sent.')
    return { success: false, error: 'SendGrid not configured' }
  }

  try {
    const msg: any = {
      to,
      from: from || {
        email: SENDER_EMAIL,
        name: SENDER_NAME,
      },
    }

    // Use dynamic template if provided
    if (templateId && dynamicTemplateData) {
      msg.templateId = templateId
      msg.dynamicTemplateData = dynamicTemplateData
    } else {
      // Use custom HTML
      msg.subject = subject
      msg.html = html
      if (text) {
        msg.text = text
      }
    }

    const response = await sgMail.send(msg)
    
    console.log('✅ Email sent successfully via SendGrid:', {
      to,
      subject: templateId ? `Template: ${templateId}` : subject,
      statusCode: response[0].statusCode,
    })

    return {
      success: true,
      messageId: response[0].headers['x-message-id'],
      statusCode: response[0].statusCode,
    }
  } catch (error: any) {
    console.error('❌ SendGrid email error:', error)
    
    if (error.response) {
      console.error('SendGrid Error Details:', error.response.body)
    }

    return {
      success: false,
      error: error.message || 'Failed to send email',
      details: error.response?.body,
    }
  }
}

/**
 * Send bulk emails (up to 1000 recipients)
 */
export async function sendBulkEmails(emails: SendEmailParams[]) {
  if (!SENDGRID_API_KEY) {
    console.warn('⚠️ SENDGRID_API_KEY not configured. Bulk emails not sent.')
    return { success: false, error: 'SendGrid not configured' }
  }

  try {
    const messages = emails.map(({ to, subject, html, text, from }) => ({
      to,
      from: from || {
        email: SENDER_EMAIL,
        name: SENDER_NAME,
      },
      subject,
      html,
      text,
    }))

    const response = await sgMail.send(messages as any)
    
    console.log(`✅ Sent ${messages.length} emails via SendGrid`)

    return {
      success: true,
      count: messages.length,
      responses: response,
    }
  } catch (error: any) {
    console.error('❌ SendGrid bulk email error:', error)
    return {
      success: false,
      error: error.message || 'Failed to send bulk emails',
    }
  }
}

/**
 * Send templated email using SendGrid dynamic templates
 */
export async function sendTemplatedEmail(
  to: string,
  templateId: string,
  dynamicData: Record<string, any>,
  from?: { email: string; name: string }
) {
  return sendEmail({
    to,
    subject: '', // Not needed for templates
    html: '', // Not needed for templates
    templateId,
    dynamicTemplateData: dynamicData,
    from,
  })
}

/**
 * Schedule email to be sent at specific time
 * Note: This requires SendGrid's Scheduled Sends feature
 */
export async function scheduleEmail(
  params: SendEmailParams,
  sendAt: number // Unix timestamp
) {
  if (!SENDGRID_API_KEY) {
    console.warn('⚠️ SENDGRID_API_KEY not configured. Email not scheduled.')
    return { success: false, error: 'SendGrid not configured' }
  }

  try {
    const msg: any = {
      to: params.to,
      from: params.from || {
        email: SENDER_EMAIL,
        name: SENDER_NAME,
      },
      subject: params.subject,
      html: params.html,
      text: params.text,
      sendAt, // Unix timestamp
    }

    const response = await sgMail.send(msg)
    
    console.log('✅ Email scheduled via SendGrid:', {
      to: params.to,
      subject: params.subject,
      sendAt: new Date(sendAt * 1000).toISOString(),
    })

    return {
      success: true,
      messageId: response[0].headers['x-message-id'],
      scheduledAt: sendAt,
    }
  } catch (error: any) {
    console.error('❌ SendGrid schedule email error:', error)
    return {
      success: false,
      error: error.message || 'Failed to schedule email',
    }
  }
}

export default {
  sendEmail,
  sendBulkEmails,
  sendTemplatedEmail,
  scheduleEmail,
}
