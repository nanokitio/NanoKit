'use client'

import React from 'react'

interface DebugPanelProps {
  isEditMode: boolean
}

export function DebugPanel({ isEditMode }: DebugPanelProps) {
  const debugInfo = React.useMemo(() => {
    if (typeof window === 'undefined') {
      return { inIframe: false, editParam: null, isEditMode: false, url: '' }
    }
    
    const inIframe = window.self !== window.top
    const params = new URLSearchParams(window.location.search)
    const editParam = params.get('edit')
    const url = window.location.href
    
    return { inIframe, editParam, isEditMode, url }
  }, [isEditMode])

  // ALWAYS show debug panel to diagnose issues
  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      left: '10px',
      background: isEditMode ? 'rgba(0, 255, 0, 0.95)' : 'rgba(255, 0, 0, 0.95)',
      color: 'white',
      padding: '12px 20px',
      borderRadius: '8px',
      zIndex: 9999,
      fontWeight: 'bold',
      fontSize: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
      fontFamily: 'monospace',
      lineHeight: '1.6',
      maxWidth: '250px'
    }}>
      <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>🔍 DEBUG INFO:</div>
      <div>In iframe: {debugInfo.inIframe ? '✅ YES' : '❌ NO'}</div>
      <div>edit param: {debugInfo.editParam || '❌ MISSING'}</div>
      <div>Edit mode: {isEditMode ? '✅ ACTIVE' : '❌ INACTIVE'}</div>
      <div style={{ marginTop: '8px', fontSize: '9px', opacity: 0.9, wordBreak: 'break-all', maxWidth: '300px' }}>
        URL: {debugInfo.url}
      </div>
    </div>
  )
}
