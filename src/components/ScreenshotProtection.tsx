'use client'

import { useEffect, useRef, useState } from 'react'

interface ScreenshotProtectionProps {
  children: React.ReactNode
  disabled?: boolean  // Fully disable protection
  editMode?: boolean  // Allow editing but keep alerts
}

export default function ScreenshotProtection({ 
  children,
  disabled = false,
  editMode = false
}: ScreenshotProtectionProps) {
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')

  useEffect(() => {
    // Skip ALL protections if disabled
    if (disabled) return
    
    // Skip in development mode
    if (process.env.NODE_ENV !== 'production') {
      console.log('[DEV MODE] Screenshot protection in dev mode')
    }

    // Show friendly alert
    const showProtectionAlert = (message: string) => {
      setAlertMessage(message)
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 3000)
    }

    // Block inspection shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12 - DevTools
      if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault()
        showProtectionAlert('Developer tools are disabled on this page')
        return false
      }

      // Ctrl+Shift+I / Cmd+Option+I - Inspect Element
      if ((e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) || 
          (e.metaKey && e.altKey && (e.key === 'I' || e.key === 'i'))) {
        e.preventDefault()
        showProtectionAlert('Inspect element is disabled on this page')
        return false
      }

      // Ctrl+Shift+J / Cmd+Option+J - Console
      if ((e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j')) || 
          (e.metaKey && e.altKey && (e.key === 'J' || e.key === 'j'))) {
        e.preventDefault()
        showProtectionAlert('Console is disabled on this page')
        return false
      }

      // Ctrl+Shift+C / Cmd+Option+C - Element Selector
      if ((e.ctrlKey && e.shiftKey && (e.key === 'C' || e.key === 'c')) || 
          (e.metaKey && e.altKey && (e.key === 'C' || e.key === 'c'))) {
        e.preventDefault()
        showProtectionAlert('Element selector is disabled on this page')
        return false
      }

      // Ctrl+U / Cmd+U - View Source
      if ((e.ctrlKey && e.key === 'u') || (e.metaKey && e.key === 'u')) {
        e.preventDefault()
        showProtectionAlert('View source is disabled on this page')
        return false
      }
    }

    // Prevent right-click with alert
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      showProtectionAlert('Right-click is disabled on this page')
      return false
    }

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown, true)
    document.addEventListener('contextmenu', handleContextMenu, true)

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true)
      document.removeEventListener('contextmenu', handleContextMenu, true)
    }
  }, [disabled])

  // If fully disabled, just return children
  if (disabled) {
    return <>{children}</>
  }

  return (
    <div className="relative">
      {/* Content - Allow text selection in editMode */}
      <div 
        className="relative"
        style={{
          // Only disable selection if NOT in edit mode
          userSelect: editMode ? 'auto' : 'none',
          WebkitUserSelect: editMode ? 'auto' : 'none'
        }}
      >
        {children}
      </div>

      {/* Friendly Alert Modal */}
      {showAlert && (
        <div className="fixed inset-0 flex items-center justify-center z-[99999] pointer-events-none">
          <div className="bg-slate-900/95 backdrop-blur-sm border border-red-500/50 rounded-xl p-6 shadow-2xl shadow-red-500/20 max-w-sm mx-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">Protected Content</h3>
                <p className="text-slate-400 text-xs mt-1">{alertMessage}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image protection CSS - Only if not in edit mode */}
      {!editMode && (
        <style jsx global>{`
          img {
            -webkit-user-drag: none !important;
            user-drag: none !important;
            pointer-events: none !important;
          }
        `}</style>
      )}
    </div>
  )
}
