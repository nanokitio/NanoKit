import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
// @ts-ignore - javascript-obfuscator doesn't have perfect types
import JavaScriptObfuscator from 'javascript-obfuscator'

// Initialize S3 Client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
})

export async function POST(request: NextRequest) {
  try {
    const { slug, email, domainLock, currentData } = await request.json()

    if (!slug || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: slug and email' },
        { status: 400 }
      )
    }

    // Validate AWS credentials
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      return NextResponse.json(
        { error: 'AWS credentials not configured' },
        { status: 500 }
      )
    }

    // Get authenticated user
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get site data
    const { data: site, error: siteError } = await supabase
      .from('sites')
      .select('*')
      .eq('slug', slug)
      .single()

    if (siteError || !site) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 })
    }

    // Generate unique S3 key
    const timestamp = Date.now()
    const s3Key = `${user.id}/${slug}-${timestamp}/index.html`
    const s3KeyCSS = `${user.id}/${slug}-${timestamp}/style.css`

    // Generate protected prelander with fingerprinting
    // Use currentData from editor if available, otherwise fall back to site data
    const { html, css } = await generateSecurePrelanderWithFingerprint(
      site,
      user.id,
      domainLock,
      currentData
    )

    const bucketName = process.env.AWS_S3_BUCKET || 'landertag'

    // Upload HTML to S3
    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: s3Key,
        Body: html,
        ContentType: 'text/html',
        CacheControl: 'public, max-age=31536000',
      })
    )

    // Upload CSS to S3
    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: s3KeyCSS,
        Body: css,
        ContentType: 'text/css',
        CacheControl: 'public, max-age=31536000',
      })
    )

    // Generate public URLs - use S3 regional endpoint (no SSL issues)
    const cloudFrontDomain = process.env.AWS_CLOUDFRONT_DOMAIN
    const awsRegion = process.env.AWS_REGION || 'us-east-1'
    
    // Use S3 regional endpoint which supports HTTPS correctly
    const baseUrl = cloudFrontDomain 
      ? `https://${cloudFrontDomain}` 
      : `https://${bucketName}.s3.${awsRegion}.amazonaws.com`
    const hostedUrl = `${baseUrl}/${s3Key}`

    // Save deployment record to database
    const { data: deployment, error: deploymentError } = await supabase
      .from('prelander_deployments')
      .insert({
        user_id: user.id,
        site_id: site.id,
        email: email,
        package_type: 'aws_hosted',
        hosted_url: hostedUrl,
        s3_key: s3Key,
        domain_lock: domainLock || null,
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null,
        user_agent: request.headers.get('user-agent') || null,
      })
      .select()
      .single()

    if (deploymentError) {
      console.error('Failed to save deployment:', deploymentError)
      // Continue anyway - hosting was successful
    }

    // Send email notification
    try {
      const { sendHostingEmail } = await import('@/lib/aws-ses')
      await sendHostingEmail({
        to: email,
        brandName: site.brand_name,
        hostedUrl,
        domainLock: domainLock || undefined,
      })
    } catch (emailError) {
      console.error('Failed to send email:', emailError)
      // Continue - hosting was successful even if email failed
    }

    return NextResponse.json({
      success: true,
      hostedUrl,
      message: 'Prelander hosted successfully on AWS S3',
      deployment: deployment,
    })
  } catch (error) {
    console.error('AWS hosting error:', error)
    return NextResponse.json(
      {
        error: 'Failed to host prelander',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

async function generateSecurePrelanderWithFingerprint(
  site: any,
  userId: string,
  domainLock?: string,
  currentData?: any
) {
  // Use currentData from editor if available, otherwise use site data
  const data = currentData || site
  
  // Prepare basic content data
  const basicData = {
    brandName: data.brandName || site.brand_name,
    headline: data.headline || site.headline,
    subheadline: data.subheadline || site.subheadline,
    cta: data.cta || site.cta,
    ctaUrl: data.ctaUrl || site.cta_url,
    templateId: data.templateId || site.template_id || '1',
    colors: {
      primary: data.primaryColor || site.primary_color,
      secondary: data.secondaryColor || site.secondary_color,
      accent: data.accentColor || site.accent_color,
    },
    logo: data.logoUrl || site.logo_url,
  }
  
  // Prepare content with user fingerprint
  const contentData = {
    ...basicData,
    html: generateTemplateHTML(basicData),
    // Hidden fingerprint
    __aff: userId,
    __ts: Date.now(),
  }

  // Generate secure JavaScript with fingerprinting
  const secureJS = generateFingerprintedJS(contentData, userId, domainLock)

  // Obfuscate the JavaScript
  const obfuscatedJS = JavaScriptObfuscator.obfuscate(secureJS, {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.75,
    numbersToExpressions: true,
    simplify: true,
    stringArrayShuffle: true,
    splitStrings: true,
    stringArrayThreshold: 0.75,
    transformObjectKeys: true,
    unicodeEscapeSequence: false,
    identifierNamesGenerator: 'hexadecimal',
    renameGlobals: false,
    selfDefending: true,
    stringArray: true,
    rotateStringArray: true,
    deadCodeInjection: true,
    deadCodeInjectionThreshold: 0.4,
    debugProtection: false,
    disableConsoleOutput: false,
  }).getObfuscatedCode()

  // Generate HTML with obfuscated JS
  const html = generateSecureHTML(obfuscatedJS, contentData)
  const css = generateCSS(contentData.colors)

  return { html, css }
}

function generateFingerprintedJS(
  content: any,
  userId: string,
  domainLock?: string
): string {
  // Encode content as base64
  const encodedContent = Buffer.from(JSON.stringify(content)).toString('base64')

  return `
// Protected Content - Powered by PrelanderAI
// Unauthorized modification or distribution is prohibited
(function() {
  'use strict';
  
  // Encrypted content
  var data = '${encodedContent}';
  var fingerprint = '${Buffer.from(userId).toString('base64')}';
  ${domainLock ? `var allowedDomain = '${domainLock}';` : ''}
  
  // Anti-tampering check
  function verify() {
    try {
      if (!window || !document) {
        throw new Error('Invalid environment');
      }
      
      ${
        domainLock
          ? `
      // Domain lock validation
      if (window.location.hostname !== allowedDomain && !window.location.hostname.endsWith('.' + allowedDomain)) {
        document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:Arial;text-align:center;flex-direction:column;"><h1>⚠️ Unauthorized Domain</h1><p>This prelander is locked to: <strong>' + allowedDomain + '</strong></p><p style="color:#666;font-size:14px;">Contact support if you believe this is an error.</p></div>';
        return false;
      }
      `
          : ''
      }
      
      return true;
    } catch (e) {
      return false;
    }
  }
  
  // Initialize content
  function init() {
    if (!verify()) {
      return;
    }
    
    try {
      // Decode content
      var decoded = atob(data);
      var content = JSON.parse(decoded);
      
      // Inject HTML
      var container = document.getElementById('app-root');
      if (container) {
        container.innerHTML = content.html;
      }
      
      // Apply colors
      if (content.colors) {
        var root = document.documentElement;
        root.style.setProperty('--primary-color', content.colors.primary || '#4a90e2');
        root.style.setProperty('--secondary-color', content.colors.secondary || '#7b68ee');
        root.style.setProperty('--accent-color', content.colors.accent || '#ffd700');
      }
      
      // Hide loading screen
      var loader = document.getElementById('loading-screen');
      if (loader) {
        loader.style.opacity = '0';
        setTimeout(function() { 
          loader.style.display = 'none'; 
        }, 300);
      }
      
      // Add tracking metadata
      track(content);
      
      // Anti-screenshot protection
      preventScreenCapture();
      
    } catch (e) {
      console.error('Initialization failed:', e);
      var container = document.getElementById('app-root');
      if (container) {
        container.innerHTML = '<div style="text-align:center;padding:50px;font-family:Arial;color:#666;"><h2>Unable to load content</h2><p>Please refresh the page or contact support.</p></div>';
      }
    }
  }
  
  function track(content) {
    // Add hidden fingerprint
    var meta = document.createElement('meta');
    meta.name = 'forge-id';
    meta.content = fingerprint;
    document.head.appendChild(meta);
    
    // Hidden tracking div
    var tracker = document.createElement('div');
    tracker.style.display = 'none';
    tracker.setAttribute('data-aff', content.__aff || '');
    tracker.setAttribute('data-ts', content.__ts || '');
    tracker.setAttribute('data-source', 'prelander-ai');
    document.body.appendChild(tracker);
    
    // Track page visibility
    window.__AFF_ID__ = content.__aff;
    window.__FORGE_TS__ = content.__ts;
    
    // Anti-tampering validation
    if (!content.__aff || content.__aff.length < 8) {
      console.warn('Invalid license detected');
    }
  }
  
  function preventScreenCapture() {
    // Detect PrintScreen key
    document.addEventListener('keyup', function(e) {
      if (e.key === 'PrintScreen') {
        navigator.clipboard.writeText('');
        console.log('Screenshot attempt detected');
      }
    });
    
    // Detect common screenshot shortcuts
    document.addEventListener('keydown', function(e) {
      // Cmd+Shift+3, Cmd+Shift+4 (Mac)
      // Windows+PrintScreen (Windows)
      if ((e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4')) ||
          (e.key === 'PrintScreen' && e.shiftKey)) {
        e.preventDefault();
        console.log('Screenshot shortcut blocked');
      }
    });
    
    // Watermark overlay (optional)
    var watermark = document.createElement('div');
    watermark.textContent = 'Protected by PrelanderAI';
    watermark.style.cssText = 'position:fixed;bottom:10px;right:10px;font-size:10px;color:rgba(0,0,0,0.1);pointer-events:none;z-index:999999;';
    document.body.appendChild(watermark);
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Self-defense mechanism
  setInterval(function() {
    if (!document.querySelector('[data-source="prelander-ai"]')) {
      console.warn('Tampering detected');
      // Optionally reload or disable
    }
  }, 5000);
  
})();
  `.trim()
}

function generateSecureHTML(obfuscatedJS: string, contentData: any): string {
  const isSpinTemplate = contentData.templateId === '3'
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="generator" content="PrelanderAI">
    <meta name="robots" content="noindex, nofollow">
    <title>${contentData.brandName}</title>
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <link rel="stylesheet" href="style.css">
    <style>
        /* Loading screen styles */
        #loading-screen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            color: white;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            transition: opacity 0.3s ease;
        }
        .spinner {
            width: 50px;
            height: 50px;
            border: 4px solid rgba(255,255,255,0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 1s ease-in-out infinite;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        #app-root {
            min-height: 100vh;
        }
    </style>
</head>
<body>
    <!-- Loading screen -->
    <div id="loading-screen">
        <div style="text-align: center;">
            <div class="spinner"></div>
            <p style="margin-top: 20px;">Loading...</p>
        </div>
    </div>
    
    <!-- Main content container -->
    <div id="app-root"></div>
    
    <!-- Protected script -->
    <script>
${obfuscatedJS}
    </script>
</body>
</html>`
}

function generateCSS(colors: any): string {
  return `
/* Landing Page Styles - PrelanderAI */
:root {
    --primary-color: ${colors.primary || '#4a90e2'};
    --secondary-color: ${colors.secondary || '#7b68ee'};
    --accent-color: ${colors.accent || '#ffd700'};
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.6;
    color: #333;
    background: #f8f9fa;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.hero {
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
    color: white;
    padding: 100px 0;
    text-align: center;
}

h1, h2, h3, h4, h5, h6 {
    font-family: 'Poppins', sans-serif;
}

.hero h1 {
    font-size: 48px;
    font-weight: 700;
    margin-bottom: 20px;
    font-family: 'Poppins', sans-serif;
}

.cta-button {
    display: inline-block;
    background: var(--accent-color);
    color: #333;
    padding: 15px 40px;
    border-radius: 50px;
    text-decoration: none;
    font-weight: 600;
    font-size: 18px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.cta-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
}

/* Responsive */
@media (max-width: 768px) {
    .hero h1 {
        font-size: 32px;
    }
    
    .hero {
        padding: 60px 0;
    }
}

/* User-select disable for protection */
body {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

/* Prevent right-click context menu */
body {
    -webkit-touch-callout: none;
}
`.trim()
}

function generateTemplateHTML(data: any): string {
  const templateId = data.templateId || '1'
  
  // Template 3: Spin to Win
  if (templateId === '3') {
    return `
    <div style="min-height: 100vh; background: linear-gradient(135deg, ${data.colors.primary} 0%, ${data.colors.secondary} 100%); display: flex; align-items: center; justify-content: center; padding: 20px;">
      <div style="background: white; border-radius: 20px; padding: 40px; max-width: 600px; width: 100%; text-align: center; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
        ${data.logo ? `<img src="${data.logo}" alt="Logo" style="max-width: 150px; margin-bottom: 30px;">` : ''}
        <h1 style="font-family: 'Poppins', sans-serif; font-size: 36px; font-weight: 700; color: #1a202c; margin-bottom: 15px;">${data.headline || 'Spin to Win!'}</h1>
        ${data.subheadline ? `<p style="font-size: 18px; color: #4a5568; margin-bottom: 30px;">${data.subheadline}</p>` : ''}
        
        <div id="wheel-container" style="position: relative; width: 300px; height: 300px; margin: 30px auto;">
          <canvas id="wheel" width="300" height="300" style="border-radius: 50%; box-shadow: 0 10px 30px rgba(0,0,0,0.2);"></canvas>
          <div id="spin-button" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; border-radius: 50%; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-weight: 700; font-size: 16px; box-shadow: 0 5px 15px rgba(0,0,0,0.3); z-index: 10; font-family: 'Poppins', sans-serif;">SPIN</div>
        </div>
        
        <a href="${data.ctaUrl || '#'}" id="claim-button" style="display: inline-block; background: ${data.colors.accent}; color: #1a202c; padding: 15px 40px; border-radius: 50px; text-decoration: none; font-weight: 600; font-size: 18px; margin-top: 20px; opacity: 0; pointer-events: none; transition: all 0.3s ease; font-family: 'Poppins', sans-serif;">${data.cta || 'Claim Prize'}</a>
      </div>
    </div>
    
    <script>
      (function() {
        var canvas = document.getElementById('wheel');
        var ctx = canvas.getContext('2d');
        var prizes = ['10% OFF', '20% OFF', '30% OFF', 'FREE ITEM', '15% OFF', '5% OFF'];
        var colors = ['${data.colors.primary}', '${data.colors.secondary}', '${data.colors.accent}', '${data.colors.primary}', '${data.colors.secondary}', '${data.colors.accent}'];
        var startAngle = 0;
        var arc = Math.PI / (prizes.length / 2);
        var spinTimeout = null;
        var spinAngleStart = Math.random() * 10 + 10;
        var spinTime = 0;
        var spinTimeTotal = Math.random() * 3 + 4 * 1000;
        
        function drawWheel() {
          var outsideRadius = 140;
          var insideRadius = 30;
          ctx.clearRect(0, 0, 300, 300);
          ctx.strokeStyle = 'white';
          ctx.lineWidth = 2;
          
          for (var i = 0; i < prizes.length; i++) {
            var angle = startAngle + i * arc;
            ctx.fillStyle = colors[i % colors.length];
            ctx.beginPath();
            ctx.arc(150, 150, outsideRadius, angle, angle + arc, false);
            ctx.arc(150, 150, insideRadius, angle + arc, angle, true);
            ctx.fill();
            ctx.stroke();
            ctx.save();
            
            ctx.fillStyle = 'white';
            ctx.font = 'bold 14px Poppins, sans-serif';
            ctx.translate(150 + Math.cos(angle + arc / 2) * (outsideRadius + insideRadius) / 2, 150 + Math.sin(angle + arc / 2) * (outsideRadius + insideRadius) / 2);
            ctx.rotate(angle + arc / 2 + Math.PI / 2);
            var text = prizes[i];
            ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
            ctx.restore();
          }
          
          // Draw arrow
          ctx.fillStyle = '#1a202c';
          ctx.beginPath();
          ctx.moveTo(150 - 4, 10);
          ctx.lineTo(150 + 4, 10);
          ctx.lineTo(150 + 4, 25);
          ctx.lineTo(150 + 9, 25);
          ctx.lineTo(150 + 0, 35);
          ctx.lineTo(150 - 9, 25);
          ctx.lineTo(150 - 4, 25);
          ctx.lineTo(150 - 4, 10);
          ctx.fill();
        }
        
        function spin() {
          spinAngleStart = Math.random() * 10 + 10;
          spinTime = 0;
          spinTimeTotal = Math.random() * 3 + 4 * 1000;
          rotateWheel();
        }
        
        function rotateWheel() {
          spinTime += 30;
          if (spinTime >= spinTimeTotal) {
            stopRotateWheel();
            return;
          }
          var spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
          startAngle += (spinAngle * Math.PI / 180);
          drawWheel();
          spinTimeout = setTimeout(rotateWheel, 30);
        }
        
        function stopRotateWheel() {
          clearTimeout(spinTimeout);
          var degrees = startAngle * 180 / Math.PI + 90;
          var arcd = arc * 180 / Math.PI;
          var index = Math.floor((360 - degrees % 360) / arcd);
          var prize = prizes[index];
          
          setTimeout(function() {
            alert('🎉 Congratulations! You won: ' + prize);
            document.getElementById('claim-button').style.opacity = '1';
            document.getElementById('claim-button').style.pointerEvents = 'auto';
          }, 500);
        }
        
        function easeOut(t, b, c, d) {
          var ts = (t /= d) * t;
          var tc = ts * t;
          return b + c * (tc + -3 * ts + 3 * t);
        }
        
        document.getElementById('spin-button').addEventListener('click', function() {
          this.style.pointerEvents = 'none';
          spin();
        });
        
        drawWheel();
      })();
    </script>
    `.trim()
  }
  
  // Template 2: Modern Gradient
  if (templateId === '2') {
    return `
    <div style="min-height: 100vh; background: linear-gradient(135deg, ${data.colors.primary} 0%, ${data.colors.secondary} 100%); display: flex; align-items: center; justify-content: center; padding: 20px;">
      <div style="text-align: center; max-width: 800px;">
        ${data.logo ? `<img src="${data.logo}" alt="Logo" style="max-width: 200px; margin-bottom: 40px; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.2));">` : ''}
        <h1 style="font-family: 'Poppins', sans-serif; font-size: 56px; font-weight: 800; color: white; margin-bottom: 20px; text-shadow: 0 4px 10px rgba(0,0,0,0.3);">${data.headline || 'Welcome'}</h1>
        ${data.subheadline ? `<p style="font-size: 22px; color: rgba(255,255,255,0.95); margin-bottom: 40px; text-shadow: 0 2px 5px rgba(0,0,0,0.2);">${data.subheadline}</p>` : ''}
        <a href="${data.ctaUrl || '#'}" style="display: inline-block; background: ${data.colors.accent}; color: #1a202c; padding: 18px 50px; border-radius: 50px; text-decoration: none; font-weight: 700; font-size: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); transition: transform 0.3s ease, box-shadow 0.3s ease; font-family: 'Poppins', sans-serif;" onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 15px 40px rgba(0,0,0,0.4)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 10px 30px rgba(0,0,0,0.3)';">${data.cta || 'Get Started'}</a>
      </div>
    </div>
    `.trim()
  }
  
  // Template 1: Classic Hero (default)
  return `
  <div style="min-height: 100vh; background: ${data.colors.primary}; display: flex; align-items: center; justify-content: center; padding: 20px;">
    <div style="text-align: center; max-width: 700px;">
      ${data.logo ? `<img src="${data.logo}" alt="Logo" style="max-width: 180px; margin-bottom: 30px;">` : ''}
      <h1 style="font-family: 'Poppins', sans-serif; font-size: 48px; font-weight: 700; color: white; margin-bottom: 15px;">${data.headline || data.brandName || 'Welcome'}</h1>
      ${data.subheadline ? `<p style="font-size: 20px; color: rgba(255,255,255,0.9); margin-bottom: 35px;">${data.subheadline}</p>` : ''}
      <a href="${data.ctaUrl || '#'}" style="display: inline-block; background: ${data.colors.accent}; color: #1a202c; padding: 15px 40px; border-radius: 50px; text-decoration: none; font-weight: 600; font-size: 18px; transition: transform 0.3s ease, box-shadow 0.3s ease; box-shadow: 0 5px 20px rgba(0,0,0,0.2); font-family: 'Poppins', sans-serif;" onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 8px 25px rgba(0,0,0,0.3)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 5px 20px rgba(0,0,0,0.2)';">${data.cta || 'Get Started'}</a>
    </div>
  </div>
  `.trim()
}

function generateDefaultHTML(site: any): string {
  return generateTemplateHTML({
    brandName: site.brand_name,
    headline: site.headline,
    subheadline: site.subheadline,
    cta: site.cta,
    ctaUrl: site.cta_url,
    templateId: site.template_id || '1',
    colors: {
      primary: site.primary_color,
      secondary: site.secondary_color,
      accent: site.accent_color
    },
    logo: site.logo_url
  })
}
