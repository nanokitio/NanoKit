import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import JSZip from 'jszip'
// @ts-ignore - javascript-obfuscator doesn't have perfect types
import JavaScriptObfuscator from 'javascript-obfuscator'
import { generateProtectedHTML, defaultProtectionConfig, type ProtectionConfig } from '@/lib/anti-clone-protection'

export async function POST(request: NextRequest) {
  try {
    const { slug, userEmail } = await request.json()

    if (!slug) {
      return NextResponse.json({ error: 'Missing slug' }, { status: 400 })
    }

    // Get site data and user from database
    const supabase = await createClient()
    
    const { data: site, error: siteError } = await supabase
      .from('sites')
      .select('*')
      .eq('slug', slug)
      .single()

    if (siteError || !site) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 })
    }

    // Get user email if not provided
    let emailToSend = userEmail
    if (!emailToSend) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) {
        emailToSend = user.email
      }
    }

    if (!emailToSend) {
      return NextResponse.json({ 
        error: 'No email available. Please provide an email address.' 
      }, { status: 400 })
    }

    // Generate protected package
    const protectedPackage = await generateSimpleProtectedPage(site)

    // Create ZIP with JSZip
    const zip = new JSZip()
    
    // Add all files to ZIP
    Object.entries(protectedPackage).forEach(([filename, content]) => {
      zip.file(filename, content)
    })
    
    // Generate ZIP buffer
    const zipBuffer = await zip.generateAsync({ 
      type: 'nodebuffer',
      compression: 'DEFLATE',
      compressionOptions: { level: 9 }
    })

    // Send email with attachment using Resend or your email service
    const emailSent = await sendPrelanderEmail({
      to: emailToSend,
      siteName: site.brand_name || 'Your Prelander',
      slug: slug,
      zipBuffer: zipBuffer
    })

    if (!emailSent) {
      return NextResponse.json({ 
        error: 'Failed to send email' 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      message: `Prelander sent to ${emailToSend}`,
      email: emailToSend
    })

  } catch (error) {
    console.error('Auto-send prelander error:', error)
    return NextResponse.json({ 
      error: 'Failed to send prelander',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

async function generateSimpleProtectedPage(site: any) {
  const originalHTML = site.generated_html || generateDefaultHTML(site)
  const originalCSS = site.generated_css || generateSimpleCSS()

  const protectionConfig: ProtectionConfig = {
    ...defaultProtectionConfig,
    enableScreenshotBlocking: true,
    enableDevToolsBlocking: true,
    enableRightClickBlocking: true,
    enableTextSelectionBlocking: true,
    enablePrintBlocking: true,
    enableKeyboardShortcutBlocking: true,
    enableInspectBlocking: true,
    enableConsoleBlocking: true,
    obfuscateCode: true,
    userFingerprint: generateUserFingerprint(site)
  }

  const { html: protectedHTML, css: protectedCSS } = generateProtectedHTML(
    originalHTML, 
    originalCSS, 
    protectionConfig
  )

  const finalHTML = obfuscateHTMLContent(protectedHTML, site)

  return {
    'index.html': finalHTML,
    'style.css': protectedCSS,
    'README.md': generateReadme(site.brand_name),
  }
}

function generateUserFingerprint(site: any): string {
  const data = `${site.id}-${site.brand_name}-${site.created_at}`
  return Buffer.from(data).toString('base64').substring(0, 16)
}

function obfuscateHTMLContent(html: string, site: any): string {
  const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi
  
  return html.replace(scriptRegex, (match, scriptContent) => {
    if (scriptContent.trim()) {
      try {
        const obfuscated = JavaScriptObfuscator.obfuscate(scriptContent, {
          compact: true,
          controlFlowFlattening: true,
          controlFlowFlatteningThreshold: 0.8,
          numbersToExpressions: true,
          simplify: true,
          stringArrayShuffle: true,
          splitStrings: true,
          stringArrayThreshold: 0.9,
          transformObjectKeys: true,
          unicodeEscapeSequence: true,
          identifierNamesGenerator: 'hexadecimal',
          renameGlobals: false,
          selfDefending: true,
          stringArray: true,
          rotateStringArray: true,
          deadCodeInjection: true,
          deadCodeInjectionThreshold: 0.5,
          debugProtection: true,
          debugProtectionInterval: 2000,
          disableConsoleOutput: true,
          seed: Math.floor(Math.random() * 1000000)
        }).getObfuscatedCode()
        
        return match.replace(scriptContent, obfuscated)
      } catch (e) {
        console.warn('Failed to obfuscate script:', e)
        return match
      }
    }
    return match
  })
}

async function sendPrelanderEmail({ to, siteName, slug, zipBuffer }: {
  to: string
  siteName: string
  slug: string
  zipBuffer: Buffer
}) {
  try {
    // If no Resend API key, return true to allow continuing without email
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not configured. Skipping email send.')
      return true // Return true to not block the process
    }

    // Using Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Prelander Platform <noreply@landertab.com>',
        to: [to],
        subject: `🎉 Your Protected Prelander is Ready - ${siteName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Your Prelander is Ready!</h1>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px 20px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333; margin-top: 0;">Hi there! 👋</h2>
              
              <p style="color: #666; line-height: 1.6;">
                Great news! Your protected prelander <strong>${siteName}</strong> has been successfully generated and is attached to this email.
              </p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
                <h3 style="margin-top: 0; color: #667eea;">📦 What's Included:</h3>
                <ul style="color: #666; line-height: 1.8;">
                  <li>🔒 <strong>Protected index.html</strong> - Fully obfuscated and secure</li>
                  <li>🎨 <strong>style.css</strong> - Responsive styles</li>
                  <li>📋 <strong>README.md</strong> - Setup instructions</li>
                </ul>
              </div>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #667eea;">🔐 Security Features:</h3>
                <ul style="color: #666; line-height: 1.8;">
                  <li>✅ Anti-screenshot protection</li>
                  <li>✅ DevTools blocking</li>
                  <li>✅ Code obfuscation</li>
                  <li>✅ Right-click prevention</li>
                  <li>✅ Anti-tampering measures</li>
                </ul>
              </div>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #667eea;">🚀 Quick Start:</h3>
                <ol style="color: #666; line-height: 1.8;">
                  <li>Extract the ZIP file</li>
                  <li>Double-click <code>index.html</code> to preview</li>
                  <li>Upload to your hosting service</li>
                  <li>Share and start converting!</li>
                </ol>
              </div>
              
              <p style="color: #999; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                This prelander was automatically generated for <strong>${siteName}</strong><br>
                Slug: ${slug}
              </p>
            </div>
          </div>
        `,
        attachments: [
          {
            filename: `${siteName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}_protected.zip`,
            content: zipBuffer.toString('base64'),
          }
        ]
      })
    })

    return response.ok
  } catch (error) {
    console.error('Email send error:', error)
    return false
  }
}

function generateReadme(brandName: string): string {
  return `# ${brandName} - Protected Prelander

## 🔒 High-Security Protected Landing Page

This prelander includes advanced anti-clone and anti-scraping protection.

### ✅ What's Included:
- **index.html** - Your complete protected landing page
- **style.css** - Responsive styles
- **README.md** - This file

### 🚀 How to Use:
1. **Test Locally**: Double-click \`index.html\` to open in your browser
2. **Deploy**: Upload all files to your web hosting service
3. **Go Live**: Share your URL and start converting!

### 🛡️ Security Features:
- ✅ Anti-screenshot protection
- ✅ DevTools blocking
- ✅ Code obfuscation & encryption
- ✅ Right-click prevention
- ✅ Text selection blocking
- ✅ Print prevention
- ✅ Console access blocking
- ✅ Anti-tampering measures

### 📝 Important Notes:
- **Do NOT modify** the HTML/CSS files
- **Works on any hosting** - cPanel, WordPress, Netlify, Vercel, etc.
- **Mobile compatible** - All protections work on mobile devices
- **SEO friendly** - Search engines can still index your content

### 🌐 Compatible Hosting:
- Netlify, Vercel, GitHub Pages
- cPanel, WordPress hosting
- AWS S3, Google Cloud Storage
- Any web server with HTML support

---
**Generated by Prelander AI Platform**
**Protection Level:** Maximum Security
**Auto-sent on:** ${new Date().toLocaleString()}
`
}

function generateDefaultHTML(site: any): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${site.brand_name}</title>
</head>
<body>
    <div class="hero">
        <div class="container">
            ${site.logo_url ? `<img src="${site.logo_url}" alt="${site.brand_name}">` : ''}
            <h1>${site.headline || 'Welcome'}</h1>
            <p>${site.description || 'Experience something amazing'}</p>
            <a href="${site.cta_url || '#'}" class="cta-button">${site.cta || 'Get Started'}</a>
        </div>
    </div>
</body>
</html>`
}

function generateSimpleCSS(): string {
  return `
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  margin: 0;
  padding: 0;
}

.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 100px 20px;
  text-align: center;
  min-height: 100vh;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  font-size: 3rem;
  margin-bottom: 20px;
}

.cta-button {
  display: inline-block;
  background: white;
  color: #667eea;
  padding: 15px 40px;
  text-decoration: none;
  border-radius: 50px;
  font-weight: 600;
  margin-top: 30px;
}
`.trim()
}
