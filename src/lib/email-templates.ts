/**
 * Email Templates for Workflows
 * Each function returns HTML and plain text versions of the email
 */

const createEmailHTML = (header: string, content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; text-align: center; }
    .content { padding: 40px; }
    .footer { background-color: #f8f9fa; padding: 30px; text-align: center; color: #666666; font-size: 14px; }
    .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white !important; padding: 15px 40px; text-decoration: none; border-radius: 50px; font-weight: 600; margin: 20px 0; }
    .highlight-box { background-color: #f0f9ff; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">${header}</div>
    <div class="content">${content}</div>
    <div class="footer">
      <p style="margin: 0 0 10px 0;"><strong>PrelanderAI</strong></p>
      <p style="margin: 0; font-size: 12px; color: #999;">© 2025 PrelanderAI. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.landertag.com'

export function welcome(data: any) {
  const html = createEmailHTML(
    `<h1 style="margin: 0; font-size: 32px;">🎉 Welcome to PrelanderAI!</h1>
     <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">Your Journey Starts Here</p>`,
    `<p>Hey there! 👋</p>
     <p>We're thrilled to have you on board. PrelanderAI is your secret weapon for creating stunning, high-converting prelanders in minutes.</p>
     <div class="highlight-box">
       <h3 style="margin: 0 0 15px 0; color: #667eea;">✨ What You Can Do:</h3>
       <ul style="line-height: 1.8;">
         <li>Create beautiful prelanders with AI assistance</li>
         <li>Choose from professional templates</li>
         <li>Protect your pages with advanced security</li>
         <li>Host directly on AWS or download</li>
       </ul>
     </div>
     <div style="text-align: center;"><a href="${APP_URL}" class="button">Create Your First Prelander</a></div>
     <p>Cheers,<br><strong>The PrelanderAI Team</strong></p>`
  )
  const text = `Welcome to PrelanderAI!\n\nWe're thrilled to have you on board.\n\nGet started: ${APP_URL}\n\nCheers,\nThe PrelanderAI Team`
  return { html, text }
}

export function getting_started(data: any) {
  const html = createEmailHTML(
    `<h1 style="margin: 0; font-size: 28px;">🚀 Create Your First Prelander</h1>`,
    `<p>Ready to create something amazing?</p>
     <div class="highlight-box">
       <h3 style="color: #667eea;">📋 Quick Start:</h3>
       <ol style="line-height: 2;">
         <li><strong>Choose Your Template</strong></li>
         <li><strong>Customize Your Content</strong></li>
         <li><strong>Add Security Features</strong></li>
         <li><strong>Deploy or Download</strong></li>
       </ol>
     </div>
     <div style="text-align: center;"><a href="${APP_URL}/dashboard" class="button">Start Creating Now</a></div>`
  )
  const text = `Create Your First Prelander\n\nQuick Start Guide:\n1. Choose Template\n2. Customize Content\n3. Add Security\n4. Deploy/Download\n\n${APP_URL}/dashboard`
  return { html, text }
}

export function tips_tricks(data: any) {
  const html = createEmailHTML(
    `<h1 style="margin: 0; font-size: 28px;">💡 Pro Tips for Better Prelanders</h1>`,
    `<p>Want to take your prelanders to the next level?</p>
     <div style="margin: 30px 0;">
       <div style="border-left: 4px solid #10b981; padding: 15px; margin-bottom: 15px; background: #f0fdf4;">
         <h4 style="margin: 0 0 10px 0;">🎯 Clear Value Proposition</h4>
         <p style="margin: 0;">Make it crystal clear what you're offering in the first 3 seconds.</p>
       </div>
       <div style="border-left: 4px solid #3b82f6; padding: 15px; margin-bottom: 15px; background: #eff6ff;">
         <h4 style="margin: 0 0 10px 0;">🔒 Enable Security Features</h4>
         <p style="margin: 0;">Protect your work with code obfuscation and domain locking.</p>
       </div>
       <div style="border-left: 4px solid #f59e0b; padding: 15px; background: #fffbeb;">
         <h4 style="margin: 0 0 10px 0;">⚡ Fast Loading is Key</h4>
         <p style="margin: 0;">Use AWS hosting for lightning-fast delivery.</p>
       </div>
     </div>
     <div style="text-align: center;"><a href="${APP_URL}/dashboard" class="button">Apply These Tips</a></div>`
  )
  const text = `Pro Tips:\n🎯 Clear value proposition\n🔒 Security features\n⚡ Fast loading\n\n${APP_URL}/dashboard`
  return { html, text }
}

export function upgrade_prompt(data: any) {
  const html = createEmailHTML(
    `<h1 style="margin: 0; font-size: 28px;">⭐ Unlock Premium Features</h1>`,
    `<p>Ready to unlock even more power?</p>
     <div class="highlight-box">
       <h3 style="color: #667eea;">🚀 Premium Features:</h3>
       <ul style="line-height: 2;">
         <li>✨ Unlimited Prelanders</li>
         <li>🔐 Advanced Security</li>
         <li>🎨 Premium Templates</li>
         <li>⚡ Priority Support</li>
       </ul>
     </div>
     <div style="text-align: center;"><a href="${APP_URL}/pricing" class="button">Upgrade to Premium</a></div>
     <div style="background: #f0fdf4; padding: 15px; text-align: center; border-radius: 8px;">
       <p style="margin: 0;">💰 Use code <strong>WELCOME20</strong> for 20% off!</p>
     </div>`
  )
  const text = `Unlock Premium Features\n\nPremium: Unlimited prelanders, advanced security, premium templates, priority support\n\nUse code WELCOME20 for 20% off!\n\n${APP_URL}/pricing`
  return { html, text }
}

export function prelander_created(data: any) {
  const { siteName, slug } = data
  const html = createEmailHTML(
    `<h1 style="margin: 0; font-size: 28px;">✅ Your Prelander is Ready!</h1>`,
    `<p>Great work! Your prelander "<strong>${siteName || 'Untitled'}</strong>" has been created successfully.</p>
     <div class="highlight-box">
       <h3 style="color: #667eea;">📦 What's Next?</h3>
       <p><strong>Slug:</strong> ${slug || 'N/A'}<br><strong>Status:</strong> Ready to deploy or download</p>
     </div>
     <div style="text-align: center;"><a href="${APP_URL}/dashboard" class="button">View Your Prelander</a></div>`
  )
  const text = `Your Prelander is Ready!\n\n"${siteName}" created successfully.\nSlug: ${slug}\n\n${APP_URL}/dashboard`
  return { html, text }
}

export function optimization_tips(data: any) {
  const html = createEmailHTML(
    `<h1 style="margin: 0; font-size: 28px;">📈 Optimize Performance</h1>`,
    `<p>Your prelander is live! Here's how to maximize performance:</p>
     <div style="margin: 20px 0;">
       <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 10px;">
         <h4 style="margin: 0;">✅ Test on Multiple Devices</h4>
       </div>
       <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 10px;">
         <h4 style="margin: 0;">✅ A/B Test Your Headlines</h4>
       </div>
       <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
         <h4 style="margin: 0;">✅ Track Conversions</h4>
       </div>
     </div>
     <div style="text-align: center;"><a href="${APP_URL}/dashboard" class="button">Access Dashboard</a></div>`
  )
  const text = `Optimize Performance\n\n✅ Test devices\n✅ A/B test headlines\n✅ Track conversions\n\n${APP_URL}/dashboard`
  return { html, text }
}

export function download_password(data: any) {
  const { password, siteName, slug, isSecurePackage } = data
  const html = createEmailHTML(
    `<h1 style="margin: 0; font-size: 28px;">🔐 Your Secure Download Password</h1>
     ${isSecurePackage ? '<p style="margin: 10px 0 0 0;"><span style="background: #10b981; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: bold;">MAXIMUM SECURITY</span></p>' : ''}`,
    `<p>Your prelander "<strong>${siteName}</strong>" is ready to download.</p>
     <div style="background: white; border: 3px solid #667eea; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0;">
       <p style="margin: 0 0 15px 0; color: #666; font-size: 14px;">Your Password:</p>
       <div style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 3px; font-family: monospace;">${password}</div>
     </div>
     <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 4px;">
       <h3 style="margin: 0 0 10px 0;">⚠️ Important:</h3>
       <ul style="margin: 0; padding-left: 20px;">
         <li>Expires in 24 hours</li>
         <li>Keep secure, do not share</li>
         <li>${isSecurePackage ? 'Includes obfuscation & domain locking' : 'AES-256 encrypted'}</li>
       </ul>
     </div>
     <div style="text-align: center;"><a href="${APP_URL}/dashboard" class="button">Download Now</a></div>
     <p style="font-size: 14px; color: #666;">Slug: ${slug}<br>Generated: ${new Date().toLocaleString()}</p>`
  )
  const text = `Your Secure Download Password\n\n"${siteName}"\nPassword: ${password}\n\n⚠️ Expires in 24 hours\nSlug: ${slug}\n\n${APP_URL}/dashboard`
  return { html, text }
}

export function hosting_help(data: any) {
  const html = createEmailHTML(
    `<h1 style="margin: 0; font-size: 28px;">🌐 Need Help with Hosting?</h1>`,
    `<p>Downloaded your prelander? Here are hosting options:</p>
     <div class="highlight-box">
       <h3 style="color: #667eea;">Recommended Hosting:</h3>
       <ul style="line-height: 2;">
         <li>🚀 <strong>AWS S3</strong> - Fast, scalable, reliable</li>
         <li>⚡ <strong>Netlify</strong> - Easy deployment</li>
         <li>🌐 <strong>Vercel</strong> - Zero configuration</li>
       </ul>
     </div>
     <p>Need help? Reply to this email!</p>`
  )
  const text = `Need Help with Hosting?\n\nRecommended: AWS S3, Netlify, Vercel\n\nReply for help!`
  return { html, text }
}

export function hosting_success(data: any) {
  const { hostedUrl, brandName } = data
  const html = createEmailHTML(
    `<h1 style="margin: 0; font-size: 28px;">🎉 Your Prelander is Live!</h1>`,
    `<p>Your prelander "<strong>${brandName}</strong>" is now live!</p>
     <div class="highlight-box">
       <h3 style="color: #667eea;">🔗 LIVE URL:</h3>
       <p><a href="${hostedUrl}" style="color: #667eea; word-break: break-all;">${hostedUrl}</a></p>
     </div>
     <div style="text-align: center;"><a href="${hostedUrl}" class="button">View Live Prelander</a></div>`
  )
  const text = `Your Prelander is Live!\n\n"${brandName}"\n${hostedUrl}\n\nView it now!`
  return { html, text }
}

export function performance_check(data: any) {
  const html = createEmailHTML(
    `<h1 style="margin: 0; font-size: 28px;">📊 Performance Check-in</h1>`,
    `<p>How is your prelander performing?</p>
     <p>We'd love to hear about your results!</p>
     <div style="text-align: center;"><a href="${APP_URL}/dashboard" class="button">View Analytics</a></div>`
  )
  const text = `Performance Check-in\n\nHow is your prelander performing?\n\n${APP_URL}/dashboard`
  return { html, text }
}

export function trial_7days(data: any) {
  const html = createEmailHTML(
    `<h1 style="margin: 0; font-size: 28px;">⏰ Trial Expires in 7 Days</h1>`,
    `<p>Your trial expires in <strong>7 days</strong>.</p>
     <p>Upgrade now to keep all your features!</p>
     <div style="text-align: center;"><a href="${APP_URL}/pricing" class="button">Upgrade Now</a></div>`
  )
  const text = `Trial Expires in 7 Days\n\nUpgrade to keep your features:\n${APP_URL}/pricing`
  return { html, text }
}

export function trial_3days(data: any) {
  const html = createEmailHTML(
    `<h1 style="margin: 0; font-size: 28px;">⚠️ Only 3 Days Left</h1>`,
    `<p>Your trial expires in <strong>3 days</strong>!</p>
     <div style="text-align: center;"><a href="${APP_URL}/pricing" class="button">Upgrade Today</a></div>`
  )
  const text = `Only 3 Days Left in Your Trial!\n\nUpgrade: ${APP_URL}/pricing`
  return { html, text }
}

export function trial_1day(data: any) {
  const html = createEmailHTML(
    `<h1 style="margin: 0; font-size: 28px;">🚨 Last Day of Trial!</h1>`,
    `<p>Your trial expires <strong>tomorrow</strong>!</p>
     <p>Upgrade now to avoid losing access.</p>
     <div style="text-align: center;"><a href="${APP_URL}/pricing" class="button">Upgrade Now</a></div>`
  )
  const text = `Last Day of Your Trial!\n\nUpgrade now:\n${APP_URL}/pricing`
  return { html, text }
}
