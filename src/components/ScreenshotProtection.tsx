'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface ScreenshotProtectionProps {
  children: React.ReactNode
  disabled?: boolean  // Disable protection for edit mode
}

export default function ScreenshotProtection({ 
  children,
  disabled = false
}: ScreenshotProtectionProps) {
  const [isBlocked, setIsBlocked] = useState(false)
  const blockOverlayRef = useRef<HTMLDivElement>(null)

  // Disable console methods to prevent code inspection (ONLY IN PRODUCTION)
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      // Disable console ONLY in production
      const noop = () => {}
      ;['log', 'debug', 'info', 'warn', 'error'].forEach(method => {
        (console as any)[method] = noop
      })
    }
  }, [])

  useEffect(() => {
    // Skip if disabled (edit mode)
    if (disabled) {
      console.log('[EDIT MODE] Screenshot protection disabled')
      return
    }
    
    // Skip all protections in development mode
    if (process.env.NODE_ENV !== 'production') {
      console.log('[DEV MODE] Screenshot protection disabled for debugging')
      return
    }

    // 1. AGGRESSIVE DevTools/Inspect Element Detection
    const detectDevTools = () => {
      const threshold = 160
      const widthThreshold = window.outerWidth - window.innerWidth > threshold
      const heightThreshold = window.outerHeight - window.innerHeight > threshold
      
      // Check if devtools are open
      if (widthThreshold || heightThreshold) {
        blockScreen()
        return true
      }
      
      // Alternative detection methods
      const devtools = /./
      devtools.toString = function() {
        blockScreen()
        return 'DevTools detected'
      }
      
      return false
    }

    // 2. Block ALL inspection shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12 - DevTools
      if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault()
        blockScreen()
        return false
      }

      // Ctrl+Shift+I / Cmd+Option+I - Inspect Element
      if ((e.ctrlKey && e.shiftKey && e.key === 'I') || 
          (e.metaKey && e.altKey && e.key === 'i')) {
        e.preventDefault()
        blockScreen()
        return false
      }

      // Ctrl+Shift+J / Cmd+Option+J - Console
      if ((e.ctrlKey && e.shiftKey && e.key === 'J') || 
          (e.metaKey && e.altKey && e.key === 'j')) {
        e.preventDefault()
        blockScreen()
        return false
      }

      // Ctrl+Shift+C / Cmd+Option+C - Element Selector
      if ((e.ctrlKey && e.shiftKey && e.key === 'C') || 
          (e.metaKey && e.altKey && e.key === 'c')) {
        e.preventDefault()
        blockScreen()
        return false
      }

      // Ctrl+U / Cmd+Option+U - View Source
      if ((e.ctrlKey && e.key === 'u') || 
          (e.metaKey && e.altKey && e.key === 'u')) {
        e.preventDefault()
        blockScreen()
        return false
      }

      // PrintScreen detection
      if (e.key === 'PrintScreen' || e.keyCode === 44) {
        e.preventDefault()
        navigator.clipboard.writeText('')
        blockScreen()
        return false
      }

      // Mac screenshot shortcuts
      if (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5')) {
        e.preventDefault()
        blockScreen()
        return false
      }

      // Ctrl+S / Cmd+S - Save page
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        return false
      }

      // Ctrl+P / Cmd+P - Print
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault()
        return false
      }
    }

    // 3. Block screen permanently when detected
    const blockScreen = () => {
      setIsBlocked(true)
      if (blockOverlayRef.current) {
        blockOverlayRef.current.style.display = 'flex'
      }
      // Reload page after 3 seconds
      setTimeout(() => {
        window.location.reload()
      }, 3000)
    }

    // 4. Prevent right-click and show warning
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      blockScreen()
      return false
    }

    // 5. Detect window blur (possible screen recording)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden, possible recording
      }
    }

    // 6. Disable drag
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault()
      return false
    }

    // 7. Detect copy attempt
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault()
      return false
    }

    // 8. Continuous DevTools detection
    const detectExtensions = setInterval(() => {
      detectDevTools()
    }, 500) // Check every 500ms

    // 9. Debugger trap (breaks if DevTools open)
    const debuggerTrap = setInterval(() => {
      const start = performance.now()
      debugger // This pauses if DevTools open
      const end = performance.now()
      if (end - start > 100) {
        blockScreen()
      }
    }, 1000)

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown, true)
    document.addEventListener('keyup', handleKeyDown, true)
    document.addEventListener('contextmenu', handleContextMenu, true)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    document.addEventListener('dragstart', handleDragStart, true)
    document.addEventListener('copy', handleCopy, true)
    document.addEventListener('cut', handleCopy, true)

    // Disable paste inspector
    document.addEventListener('paste', (e) => e.preventDefault(), true)

    // Initial DevTools check
    detectDevTools()

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true)
      document.removeEventListener('keyup', handleKeyDown, true)
      document.removeEventListener('contextmenu', handleContextMenu, true)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      document.removeEventListener('dragstart', handleDragStart, true)
      document.removeEventListener('copy', handleCopy, true)
      document.removeEventListener('cut', handleCopy, true)
      clearInterval(detectExtensions)
      clearInterval(debuggerTrap)
    }
  }, [])


  // If disabled, just return children without protection
  if (disabled) {
    return <>{children}</>
  }

  return (
    <div className="relative select-none" style={{ userSelect: 'none', WebkitUserSelect: 'none' }}>
      {/* Content */}
      <div 
        className="relative"
        style={{
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          userSelect: 'none',
          pointerEvents: 'auto'
        }}
        onDragStart={(e) => e.preventDefault()}
        onContextMenu={(e) => e.preventDefault()}
      >
        {children}
      </div>

      {/* Block Overlay - Shown when violation detected */}
      <div
        ref={blockOverlayRef}
        className="fixed inset-0 bg-black z-[99999] items-center justify-center"
        style={{ display: isBlocked ? 'flex' : 'none' }}
      >
        <div className="text-center text-white p-8">
          <div className="mb-6">
            <svg className="w-20 h-20 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-4">Access Denied</h2>
          <p className="text-xl mb-2">Unauthorized action detected</p>
          <p className="text-gray-400 mb-6">This content is protected and cannot be inspected or captured</p>
          <div className="inline-flex items-center gap-2 text-sm text-gray-500">
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Reloading in 3 seconds...</span>
          </div>
        </div>
      </div>

      {/* Global CSS protection - Only apply if not disabled */}
      {!disabled && (
        <style jsx global>{`
          body {
            -webkit-user-select: none !important;
            -moz-user-select: none !important;
            -ms-user-select: none !important;
            user-select: none !important;
          }
          
          * {
            -webkit-user-select: none !important;
            -moz-user-select: none !important;
            -ms-user-select: none !important;
            user-select: none !important;
          }
          
          img {
            -webkit-user-drag: none !important;
            -khtml-user-drag: none !important;
            -moz-user-drag: none !important;
            -o-user-drag: none !important;
            user-drag: none !important;
            pointer-events: none !important;
          }

          ::selection {
            background: transparent !important;
            color: inherit !important;
          }

          ::-moz-selection {
            background: transparent !important;
            color: inherit !important;
          }

          /* Hide scrollbars to prevent iframe detection */
          ::-webkit-scrollbar {
            width: 0px;
            background: transparent;
          }
        `}</style>
      )}
    </div>
  )
}
