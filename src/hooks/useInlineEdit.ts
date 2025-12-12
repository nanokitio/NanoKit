'use client'

import { useEffect, useState } from 'react'

export function useInlineEdit() {
  const [isEditMode, setIsEditMode] = useState(false)

  useEffect(() => {
    // Check if we're in an iframe (editor preview)
    const inIframe = window.self !== window.top
    
    // Check URL params for edit mode
    const params = new URLSearchParams(window.location.search)
    const editParam = params.get('edit')
    const previewParam = params.get('preview')
    
    // Enable edit mode if:
    // 1. We're in an iframe AND
    // 2. Either edit=1 OR preview=1 (both indicate we're in the editor)
    const editMode = inIframe && (editParam === '1' || previewParam === '1')
    
    console.log('🔍 Inline Edit Debug:', {
      inIframe,
      editParam,
      previewParam,
      editMode,
      url: window.location.href
    })
    
    setIsEditMode(editMode)
  }, [])

  const notifyChange = (field: string, value: string | number) => {
    if (isEditMode && window.parent) {
      window.parent.postMessage({
        type: 'CONTENT_CHANGE',
        field,
        value
      }, '*')
    }
  }

  const notifyFontSizeChange = (field: string, fontSize: number) => {
    if (isEditMode && window.parent) {
      window.parent.postMessage({
        type: 'FONT_SIZE_CHANGE',
        field,
        fontSize
      }, '*')
    }
  }

  const notifyStyleChange = (field: string, styles: any) => {
    if (isEditMode && window.parent) {
      window.parent.postMessage({
        type: 'STYLE_CHANGE',
        field,
        styles
      }, '*')
    }
  }

  return { isEditMode, notifyChange, notifyFontSizeChange, notifyStyleChange }
}
