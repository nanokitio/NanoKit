import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'

// Initialize SES Client
const sesClient = new SESClient({
  region: process.env.AWS_SES_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
})

interface SendHostingEmailParams {
  to: string
  brandName: string
  hostedUrl: string
  domainLock?: string
}

export async function sendHostingEmail({
  to,
  brandName,
  hostedUrl,
  domainLock,
}: SendHostingEmailParams) {
  const senderEmail = process.env.AWS_SES_SENDER_EMAIL || 'noreply@landertab.com'

  const htmlBody = generateHostingEmailHTML(brandName, hostedUrl, domainLock)
  const textBody = generateHostingEmailText(brandName, hostedUrl, domainLock)

  try {
    const command = new SendEmailCommand({
      Source: senderEmail,
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Subject: {
          Data: `✅ Your Prelander is Live: ${brandName}`,
          Charset: 'UTF-8',
        },
        Body: {
          Html: {
            Data: htmlBody,
            Charset: 'UTF-8',
          },
          Text: {
            Data: textBody,
            Charset: 'UTF-8',
          },
        },
      },
    })

    const response = await sesClient.send(command)
    return { success: true, messageId: response.MessageId }
  } catch (error) {
    console.error('Failed to send email via SES:', error)
    throw new Error(`Email sending failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

function generateHostingEmailHTML(
  brandName: string,
  hostedUrl: string,
  domainLock?: string
): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Prelander is Live</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; border-radius: 8px 8px 0 0;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                                ✅ Your Prelander is Live!
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Body -->
                    <tr>
                        <td style="padding: 40px;">
                            <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #333333;">
                                Great news! Your prelander <strong>"${brandName}"</strong> has been successfully deployed to AWS and is now live.
                            </p>
                            
                            <!-- URL Box -->
                            <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 30px 0; border-radius: 4px;">
                                <p style="margin: 0 0 10px 0; font-size: 14px; color: #666666; font-weight: 600;">
                                    🔗 LIVE URL:
                                </p>
                                <a href="${hostedUrl}" style="color: #667eea; text-decoration: none; font-size: 16px; word-break: break-all;">
                                    ${hostedUrl}
                                </a>
                            </div>
                            
                            ${
                              domainLock
                                ? `
                            <!-- Domain Lock Notice -->
                            <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; margin: 20px 0; border-radius: 4px;">
                                <p style="margin: 0 0 10px 0; font-size: 14px; color: #856404; font-weight: 600;">
                                    🔒 Domain Lock Active
                                </p>
                                <p style="margin: 0; font-size: 14px; color: #856404; line-height: 1.6;">
                                    This prelander is restricted to: <strong>${domainLock}</strong><br>
                                    It will not function on any other domain.
                                </p>
                            </div>
                            `
                                : ''
                            }
                            
                            <!-- Features List -->
                            <div style="margin: 30px 0;">
                                <h2 style="font-size: 18px; color: #333333; margin: 0 0 15px 0;">
                                    What's Included:
                                </h2>
                                <ul style="margin: 0; padding-left: 20px;">
                                    <li style="margin-bottom: 10px; color: #666666; line-height: 1.6;">
                                        ✨ <strong>Code Obfuscation</strong> - Your content is protected from cloning
                                    </li>
                                    <li style="margin-bottom: 10px; color: #666666; line-height: 1.6;">
                                        🔐 <strong>Affiliate Fingerprinting</strong> - Embedded tracking for attribution
                                    </li>
                                    <li style="margin-bottom: 10px; color: #666666; line-height: 1.6;">
                                        🛡️ <strong>Anti-Tampering Protection</strong> - Automated integrity checks
                                    </li>
                                    <li style="margin-bottom: 10px; color: #666666; line-height: 1.6;">
                                        📸 <strong>Screenshot Prevention</strong> - Basic anti-screenshot measures
                                    </li>
                                    <li style="margin-bottom: 10px; color: #666666; line-height: 1.6;">
                                        ⚡ <strong>CDN Delivery</strong> - Fast loading via AWS infrastructure
                                    </li>
                                </ul>
                            </div>
                            
                            <!-- CTA Button -->
                            <div style="text-align: center; margin: 40px 0;">
                                <a href="${hostedUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 15px 40px; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 16px;">
                                    View Your Prelander
                                </a>
                            </div>
                            
                            <!-- Next Steps -->
                            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 4px; margin-top: 30px;">
                                <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #333333;">
                                    Next Steps:
                                </h3>
                                <ol style="margin: 0; padding-left: 20px; color: #666666; line-height: 1.8;">
                                    <li>Test your prelander to ensure everything works correctly</li>
                                    <li>Share the URL with your target audience</li>
                                    <li>Monitor performance in your dashboard</li>
                                    <li>Update content anytime through PrelanderAI</li>
                                </ol>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; text-align: center;">
                            <p style="margin: 0 0 10px 0; font-size: 14px; color: #666666;">
                                Powered by <strong>PrelanderAI</strong>
                            </p>
                            <p style="margin: 0; font-size: 12px; color: #999999;">
                                This prelander is protected by advanced security measures.<br>
                                Unauthorized reproduction or distribution is prohibited.
                            </p>
                        </td>
                    </tr>
                </table>
                
                <!-- Disclaimer -->
                <table role="presentation" style="width: 600px; margin: 20px auto 0;">
                    <tr>
                        <td style="text-align: center; padding: 0 20px;">
                            <p style="margin: 0; font-size: 12px; color: #999999; line-height: 1.6;">
                                Need help? Contact us at support@landertab.com<br>
                                © 2025 PrelanderAI. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
  `.trim()
}

function generateHostingEmailText(
  brandName: string,
  hostedUrl: string,
  domainLock?: string
): string {
  return `
Your Prelander is Live!

Great news! Your prelander "${brandName}" has been successfully deployed to AWS and is now live.

LIVE URL:
${hostedUrl}

${
  domainLock
    ? `
⚠️ DOMAIN LOCK ACTIVE
This prelander is restricted to: ${domainLock}
It will not function on any other domain.
`
    : ''
}

What's Included:
✨ Code Obfuscation - Your content is protected from cloning
🔐 Affiliate Fingerprinting - Embedded tracking for attribution
🛡️ Anti-Tampering Protection - Automated integrity checks
📸 Screenshot Prevention - Basic anti-screenshot measures
⚡ CDN Delivery - Fast loading via AWS infrastructure

Next Steps:
1. Test your prelander to ensure everything works correctly
2. Share the URL with your target audience
3. Monitor performance in your dashboard
4. Update content anytime through PrelanderAI

---
Powered by PrelanderAI
This prelander is protected by advanced security measures.
Unauthorized reproduction or distribution is prohibited.

Need help? Contact us at support@landertab.com
© 2025 PrelanderAI. All rights reserved.
  `.trim()
}

// Alternative: Send simple notification email
export async function sendSimpleNotification({
  to,
  subject,
  message,
}: {
  to: string
  subject: string
  message: string
}) {
  const senderEmail = process.env.AWS_SES_SENDER_EMAIL || 'noreply@landertab.com'

  try {
    const command = new SendEmailCommand({
      Source: senderEmail,
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: 'UTF-8',
        },
        Body: {
          Text: {
            Data: message,
            Charset: 'UTF-8',
          },
        },
      },
    })

    const response = await sesClient.send(command)
    return { success: true, messageId: response.MessageId }
  } catch (error) {
    console.error('Failed to send notification email:', error)
    throw error
  }
}
