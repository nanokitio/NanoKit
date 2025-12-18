/**
 * Advanced Encryption System for NanoKit
 * Encrypts HTML, CSS, and JavaScript content for maximum protection
 */

import crypto from 'crypto';

// Encryption configuration
const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32;
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const SALT_LENGTH = 64;

/**
 * Generate a cryptographic key from a password
 */
function deriveKey(password: string, salt: Buffer): Buffer {
  return crypto.pbkdf2Sync(password, salt, 100000, KEY_LENGTH, 'sha512');
}

/**
 * Encrypt content using AES-256-GCM
 */
export function encryptContent(content: string, password?: string): {
  encrypted: string;
  salt: string;
  iv: string;
  authTag: string;
} {
  // Generate random password if not provided
  const pwd = password || crypto.randomBytes(32).toString('hex');
  
  // Generate random salt and IV
  const salt = crypto.randomBytes(SALT_LENGTH);
  const iv = crypto.randomBytes(IV_LENGTH);
  
  // Derive encryption key
  const key = deriveKey(pwd, salt);
  
  // Create cipher
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  // Encrypt content
  let encrypted = cipher.update(content, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  
  // Get authentication tag
  const authTag = cipher.getAuthTag();
  
  return {
    encrypted,
    salt: salt.toString('base64'),
    iv: iv.toString('base64'),
    authTag: authTag.toString('base64')
  };
}

/**
 * Decrypt content using AES-256-GCM
 */
export function decryptContent(
  encrypted: string,
  password: string,
  salt: string,
  iv: string,
  authTag: string
): string {
  // Convert from base64
  const saltBuffer = Buffer.from(salt, 'base64');
  const ivBuffer = Buffer.from(iv, 'base64');
  const authTagBuffer = Buffer.from(authTag, 'base64');
  
  // Derive decryption key
  const key = deriveKey(password, saltBuffer);
  
  // Create decipher
  const decipher = crypto.createDecipheriv(ALGORITHM, key, ivBuffer);
  decipher.setAuthTag(authTagBuffer);
  
  // Decrypt content
  let decrypted = decipher.update(encrypted, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

/**
 * XOR encryption for lightweight obfuscation
 */
export function xorEncrypt(text: string, key: string): string {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return Buffer.from(result, 'binary').toString('base64');
}

/**
 * XOR decryption
 */
export function xorDecrypt(encrypted: string, key: string): string {
  const text = Buffer.from(encrypted, 'base64').toString('binary');
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return result;
}

/**
 * Generate self-decrypting HTML wrapper
 */
export function generateEncryptedHTML(
  htmlContent: string,
  cssContent: string,
  userId: string
): string {
  // Generate unique encryption key based on user ID and timestamp
  const encryptionKey = crypto
    .createHash('sha256')
    .update(`${userId}-${Date.now()}-nanokit`)
    .digest('hex')
    .substring(0, 32);
  
  // Encrypt HTML and CSS separately using XOR for client-side decryption
  const encryptedHTML = xorEncrypt(htmlContent, encryptionKey);
  const encryptedCSS = xorEncrypt(cssContent, encryptionKey);
  
  // Create self-decrypting wrapper
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Loading...</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    .loader {
      text-align: center;
      color: white;
    }
    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <div class="loader">
    <div class="spinner"></div>
    <p>Decrypting content...</p>
  </div>
  
  <script>
    (function() {
      'use strict';
      
      // Encrypted content
      const encHTML = '${encryptedHTML}';
      const encCSS = '${encryptedCSS}';
      const key = '${encryptionKey}';
      const userId = '${userId}';
      
      // XOR decrypt function
      function xorDecrypt(encrypted, key) {
        try {
          const text = atob(encrypted);
          let result = '';
          for (let i = 0; i < text.length; i++) {
            result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
          }
          return result;
        } catch (e) {
          console.error('Decryption failed');
          return null;
        }
      }
      
      // Anti-tampering check - Detecta modificaciones no autorizadas
      // Aumentado límite de scripts a 10 para evitar falsos positivos
      const initialScriptCount = document.getElementsByTagName('script').length;
      let tamperCheck = setInterval(function() {
        const scripts = document.getElementsByTagName('script');
        // Solo detecta si se agregan muchos scripts nuevos (inyección masiva)
        if (scripts.length > initialScriptCount + 10) {
          document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#000;color:#fff;font-family:sans-serif;text-align:center;"><div><h1>⚠️ Tampering Detected</h1><p>Unauthorized modification detected.</p></div></div>';
          clearInterval(tamperCheck);
        }
      }, 5000);
      
      // Decrypt and render
      setTimeout(function() {
        const html = xorDecrypt(encHTML, key);
        const css = xorDecrypt(encCSS, key);
        
        if (!html || !css) {
          document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#000;color:#fff;font-family:sans-serif;text-align:center;"><div><h1>⚠️ Decryption Failed</h1><p>Unable to load content.</p></div></div>';
          return;
        }
        
        // Inject CSS
        const styleEl = document.createElement('style');
        styleEl.textContent = css;
        document.head.appendChild(styleEl);
        
        // Inject HTML
        document.body.innerHTML = html;
        
        // Add user fingerprint (hidden)
        const fingerprint = document.createElement('div');
        fingerprint.style.display = 'none';
        fingerprint.setAttribute('data-user', userId);
        fingerprint.setAttribute('data-nanokit', 'true');
        document.body.appendChild(fingerprint);
        
        // Clear encryption data from memory
        encHTML = null;
        encCSS = null;
        key = null;
      }, 500);
      
      // Prevent source viewing
      document.addEventListener('contextmenu', e => e.preventDefault());
      document.addEventListener('keydown', function(e) {
        if (e.keyCode === 123 || (e.ctrlKey && e.shiftKey && e.keyCode === 73) || 
            (e.ctrlKey && e.keyCode === 85) || (e.metaKey && e.altKey && e.keyCode === 73)) {
          e.preventDefault();
          return false;
        }
      });
      
    })();
  </script>
</body>
</html>`;
}

/**
 * Obfuscate JavaScript code
 */
export function obfuscateJS(code: string): string {
  // Simple obfuscation - replace variable names with random strings
  const varMap = new Map<string, string>();
  
  // Generate random variable names
  const generateVarName = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    let name = '_';
    for (let i = 0; i < 8; i++) {
      name += chars[Math.floor(Math.random() * chars.length)];
    }
    return name;
  };
  
  // Replace common variable patterns
  let obfuscated = code;
  const varPattern = /\b(var|let|const)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\b/g;
  
  obfuscated = obfuscated.replace(varPattern, (match, keyword, varName) => {
    if (!varMap.has(varName)) {
      varMap.set(varName, generateVarName());
    }
    return `${keyword} ${varMap.get(varName)}`;
  });
  
  // Minify by removing comments and extra whitespace
  obfuscated = obfuscated
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
    .replace(/\/\/.*/g, '') // Remove single-line comments
    .replace(/\s+/g, ' ') // Collapse whitespace
    .trim();
  
  return obfuscated;
}

/**
 * Create encrypted package with all protections
 */
export function createSecurePackage(
  html: string,
  css: string,
  userId: string,
  domainLock?: string
): string {
  // Add domain lock if specified
  let finalHTML = html;
  if (domainLock) {
    const domainCheckScript = `
    <script>
      (function() {
        const allowedDomain = '${domainLock}';
        const currentDomain = window.location.hostname;
        if (currentDomain !== allowedDomain && !currentDomain.includes(allowedDomain)) {
          document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#000;color:#fff;font-family:sans-serif;text-align:center;"><div><h1>⚠️ Domain Locked</h1><p>This content is locked to: ${domainLock}</p></div></div>';
        }
      })();
    </script>`;
    finalHTML = finalHTML.replace('</body>', `${domainCheckScript}</body>`);
  }
  
  // Generate encrypted HTML
  return generateEncryptedHTML(finalHTML, css, userId);
}
