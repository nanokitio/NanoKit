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
    
    setIsEditMode(inIframe && editParam === '1')
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

  return { isEditMode, notifyChange, notifyFontSizeChange }
}
