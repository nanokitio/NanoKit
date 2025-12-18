/**
 * Site Protection System
 * Prevents cloning, copying, and unauthorized access to published sites
 * Now with advanced encryption and obfuscation
 */

import { createSecurePackage } from './encryption';

export function generateProtectionScript(): string {
  return `
(function() {
  'use strict';
  
  // Disable right-click
  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
  }, false);
  
  // Disable text selection
  document.addEventListener('selectstart', function(e) {
    e.preventDefault();
    return false;
  }, false);
  
  // Disable copy
  document.addEventListener('copy', function(e) {
    e.preventDefault();
    return false;
  }, false);
  
  // Disable cut
  document.addEventListener('cut', function(e) {
    e.preventDefault();
    return false;
  }, false);
  
  // Disable keyboard shortcuts
  document.addEventListener('keydown', function(e) {
    // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+S, Ctrl+Shift+C
    if (
      e.keyCode === 123 || // F12
      (e.ctrlKey && e.shiftKey && e.keyCode === 73) || // Ctrl+Shift+I
      (e.ctrlKey && e.shiftKey && e.keyCode === 74) || // Ctrl+Shift+J
      (e.ctrlKey && e.keyCode === 85) || // Ctrl+U
      (e.ctrlKey && e.keyCode === 83) || // Ctrl+S
      (e.ctrlKey && e.shiftKey && e.keyCode === 67) || // Ctrl+Shift+C
      (e.metaKey && e.altKey && e.keyCode === 73) || // Cmd+Option+I (Mac)
      (e.metaKey && e.altKey && e.keyCode === 74) || // Cmd+Option+J (Mac)
      (e.metaKey && e.keyCode === 85) || // Cmd+U (Mac)
      (e.metaKey && e.keyCode === 83) // Cmd+S (Mac)
    ) {
      e.preventDefault();
      return false;
    }
  }, false);
  
  // Detect DevTools
  var devtools = {
    isOpen: false,
    orientation: null
  };
  
  var threshold = 160;
  var emitEvent = function(isOpen, orientation) {
    if (devtools.isOpen !== isOpen || devtools.orientation !== orientation) {
      devtools.isOpen = isOpen;
      devtools.orientation = orientation;
      if (isOpen) {
        // Redirect or show warning
        document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#000;color:#fff;font-family:sans-serif;text-align:center;"><div><h1>⚠️ Access Denied</h1><p>Developer tools are not allowed on this site.</p></div></div>';
      }
    }
  };
  
  setInterval(function() {
    var widthThreshold = window.outerWidth - window.innerWidth > threshold;
    var heightThreshold = window.outerHeight - window.innerHeight > threshold;
    var orientation = widthThreshold ? 'vertical' : 'horizontal';
    
    if (!(heightThreshold && widthThreshold) &&
        ((window.Firebug && window.Firebug.chrome && window.Firebug.chrome.isInitialized) || widthThreshold || heightThreshold)) {
      emitEvent(true, orientation);
    } else {
      emitEvent(false, null);
    }
  }, 500);
  
  // Disable drag and drop
  document.addEventListener('dragstart', function(e) {
    e.preventDefault();
    return false;
  }, false);
  
  // Disable print
  window.addEventListener('beforeprint', function(e) {
    e.preventDefault();
    document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#000;color:#fff;font-family:sans-serif;text-align:center;"><div><h1>⚠️ Printing Disabled</h1><p>This content cannot be printed.</p></div></div>';
  });
  
  // Detect screenshot attempts (PrintScreen key)
  document.addEventListener('keyup', function(e) {
    if (e.key === 'PrintScreen' || e.keyCode === 44) {
      navigator.clipboard.writeText('');
      alert('Screenshots are disabled on this site.');
    }
  });
  
  // Blur content when window loses focus (screenshot protection)
  var blurTimeout;
  window.addEventListener('blur', function() {
    blurTimeout = setTimeout(function() {
      document.body.style.filter = 'blur(10px)';
    }, 100);
  });
  
  window.addEventListener('focus', function() {
    clearTimeout(blurTimeout);
    document.body.style.filter = 'none';
  });
  
  // Disable console
  if (!window.console) window.console = {};
  var methods = ['log', 'debug', 'warn', 'info', 'error'];
  for (var i = 0; i < methods.length; i++) {
    console[methods[i]] = function() {};
  }
  
  // Anti-debugging
  setInterval(function() {
    debugger;
  }, 100);
  
  // Watermark overlay (invisible but detectable)
  var watermark = document.createElement('div');
  watermark.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:999999;opacity:0.01;';
  watermark.setAttribute('data-protection', 'nanokit');
  document.body.appendChild(watermark);
  
  // Detect if running in iframe (anti-embedding)
  if (window.self !== window.top) {
    document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#000;color:#fff;font-family:sans-serif;text-align:center;"><div><h1>⚠️ Embedding Not Allowed</h1><p>This site cannot be displayed in an iframe.</p></div></div>';
  }
  
  // Disable CSS inspection
  Object.defineProperty(document, 'styleSheets', {
    get: function() {
      return [];
    }
  });
  
  console.log('%c⚠️ STOP!', 'color: red; font-size: 50px; font-weight: bold;');
  console.log('%cThis is a protected site. Unauthorized access or copying is prohibited.', 'color: red; font-size: 16px;');
  
})();
`.trim();
}

export function injectProtection(html: string): string {
  const protectionScript = generateProtectionScript();
  
  // Inject protection script before closing body tag
  if (html.includes('</body>')) {
    return html.replace(
      '</body>',
      `<script>${protectionScript}</script></body>`
    );
  }
  
  // If no body tag, append at the end
  return html + `<script>${protectionScript}</script>`;
}

export function addProtectionStyles(css: string): string {
  const protectionCSS = `
/* Anti-cloning protection styles */
* {
  -webkit-user-select: none !important;
  -moz-user-select: none !important;
  -ms-user-select: none !important;
  user-select: none !important;
  -webkit-touch-callout: none !important;
}

body {
  -webkit-user-drag: none !important;
  -khtml-user-drag: none !important;
  -moz-user-drag: none !important;
  -o-user-drag: none !important;
  user-drag: none !important;
}

img {
  pointer-events: none !important;
  -webkit-user-drag: none !important;
  -khtml-user-drag: none !important;
  -moz-user-drag: none !important;
  -o-user-drag: none !important;
  user-drag: none !important;
}
`.trim();

  return css + '\n\n' + protectionCSS;
}

/**
 * Apply full encryption to HTML and CSS
 * This creates a self-decrypting package with maximum protection
 */
export function applyFullEncryption(
  html: string,
  css: string,
  userId: string,
  domainLock?: string
): string {
  // First add protection script and styles
  const protectedHTML = injectProtection(html);
  const protectedCSS = addProtectionStyles(css);
  
  // Then encrypt everything
  return createSecurePackage(protectedHTML, protectedCSS, userId, domainLock);
}

/**
 * Check if encryption should be applied
 * Apply to all published sites by default
 */
export function shouldEncrypt(status: string): boolean {
  return status === 'published';
}
