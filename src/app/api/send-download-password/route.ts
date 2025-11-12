import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/sendgrid'

export async function POST(request: NextRequest) {
  try {
    const { email, password, siteName, slug, isSecurePackage } = await request.json()

    // Validate input
    if (!email || !password || !siteName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Generate email content
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
    .password-box { background: white; border: 2px solid #667eea; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; }
    .password { font-size: 24px; font-weight: bold; color: #667eea; letter-spacing: 2px; font-family: 'Courier New', monospace; }
    .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; }
    .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
    .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .secure-badge { background: #10b981; color: white; padding: 5px 10px; border-radius: 15px; font-size: 12px; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${isSecurePackage ? '🛡️ Secure Package Access' : '🔐 Your Download Password'}</h1>
      <p>${isSecurePackage ? 'Military-Grade Protected Landing Page' : 'Secure Access to Your Landing Page'}</p>
      ${isSecurePackage ? '<span class="secure-badge">MAXIMUM SECURITY</span>' : ''}
    </div>
    <div class="content">
      <p>Hello,</p>
      <p>You've requested to download your <strong>${siteName}</strong> landing page. ${isSecurePackage ? 'This is a SECURE PACKAGE with advanced protection features.' : 'For security, your files are protected in an encrypted ZIP archive.'}</p>
      
      <div class="password-box">
        <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">Your ${isSecurePackage ? 'Secure Package' : 'ZIP Encryption'} Password:</p>
        <div class="password">${password}</div>
      </div>

      <div class="warning">
        <strong>⚠️ ${isSecurePackage ? 'MAXIMUM SECURITY' : 'Important Security'} Information:</strong>
        <ul style="margin: 10px 0 0 0;">
          <li>This password expires in <strong>24 hours</strong></li>
          <li>Keep this password secure and do not share it</li>
          <li>${isSecurePackage ? 'Package includes JavaScript obfuscation, domain locking, and anti-tampering' : 'The entire ZIP file is encrypted with AES-256 encryption'}</li>
          ${isSecurePackage ? '<li><strong>Code is protected against reverse engineering</strong></li>' : ''}
          <li>If you didn't request this download, please contact support immediately</li>
        </ul>
      </div>

      <p><strong>🔓 ${isSecurePackage ? 'Deployment' : 'Access'} Instructions:</strong></p>
      <ol>
        <li>Download the encrypted ZIP file from your dashboard</li>
        <li>Extract the ZIP using the password above</li>
        ${isSecurePackage ? '<li><strong>Upload ALL files</strong> to your web hosting service (maintain file structure)</li>' : '<li>Upload the extracted <code>index.html</code> file to your hosting service</li>'}
        ${isSecurePackage ? '<li><strong>Do NOT modify any files</strong> - this will break the security features</li>' : ''}
        <li>Test your landing page to ensure it works correctly</li>
        ${isSecurePackage ? '<li>Access via your domain (will not work locally via file://)</li>' : ''}
      </ol>
      
      <p style="background: ${isSecurePackage ? '#dc2626' : '#f0f9ff'}; padding: 15px; border-radius: 8px; color: ${isSecurePackage ? 'white' : '#0369a1'}; margin: 20px 0;">
        <strong>${isSecurePackage ? '🛡️ MAXIMUM PROTECTION!' : '🔒 True Encryption!'}</strong><br>
        ${isSecurePackage ? 'Your landing page is protected with obfuscation, encryption, domain locking, and anti-debugging measures.' : 'Your files are now protected with military-grade AES-256 encryption.'}
      </p>

      <p style="margin-top: 30px;">
        <strong>Site Slug:</strong> ${slug}<br>
        <strong>Generated:</strong> ${new Date().toLocaleString()}
      </p>

      <div class="footer">
        <p>This is an automated security email from Olavivo PrelanderAI</p>
        <p>If you have any questions, please contact our support team</p>
      </div>
    </div>
  </div>
</body>
</html>
    `

    // Send email via SendGrid
    console.log('📧 Sending download password email to:', email)
    
    const emailResult = await sendEmail({
      to: email,
      subject: isSecurePackage ? '🛡️ Your Secure Package Password' : '🔐 Your Download Password',
      html: emailHtml,
    })

    if (!emailResult.success) {
      console.error('❌ Failed to send email:', emailResult.error)
      
      // Return password anyway for user convenience
      return NextResponse.json({ 
        success: false,
        error: 'Failed to send email',
        details: emailResult.error,
        password: password, // Include password so user isn't blocked
        note: 'Email failed to send, but here is your password'
      }, { status: 500 })
    }

    console.log('✅ Email sent successfully via SendGrid')

    // Log email to database
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      await supabase.from('email_logs').insert({
        user_id: user.id,
        email: email,
        subject: isSecurePackage ? '🛡️ Your Secure Package Password' : '🔐 Your Download Password',
        status: 'sent',
        provider: 'sendgrid',
        provider_message_id: emailResult.messageId,
        sent_at: new Date().toISOString(),
      })
    }

    return NextResponse.json({ 
      success: true,
      message: 'Password notification sent successfully',
      emailSent: true,
      messageId: emailResult.messageId,
    })

  } catch (error) {
    console.error('Email sending error:', error)
    return NextResponse.json({ 
      error: 'Failed to send password email',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
