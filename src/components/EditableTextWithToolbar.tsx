'use client'

import React, { useState, useRef, useEffect } from 'react'
import { FloatingToolbar } from './FloatingToolbar'

interface EditableTextWithToolbarProps {
  value: string
  onChange: (value: string) => void
  className?: string
  placeholder?: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div'
  style?: React.CSSProperties
}

export function EditableTextWithToolbar({
  value,
  onChange,
  className = '',
  placeholder = 'Click to edit...',
  as: Component = 'div',
  style
}: EditableTextWithToolbarProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [tempValue, setTempValue] = useState(value)
  const [showToolbar, setShowToolbar] = useState(false)
  
  // Text formatting states
  const [fontSize, setFontSize] = useState(16)
  const [fontFamily, setFontFamily] = useState('Inter')
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('left')
  const [color, setColor] = useState('#ffffff')
  
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setTempValue(value)
  }, [value])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      // Select all text
      const range = document.createRange()
      const sel = window.getSelection()
      range.selectNodeContents(inputRef.current)
      sel?.removeAllRanges()
      sel?.addRange(range)
    }
  }, [isEditing])

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditing(true)
    setShowToolbar(true)
  }

  const handleBlur = (e: React.FocusEvent) => {
    // Don't blur if clicking on toolbar
    if (e.relatedTarget && containerRef.current?.contains(e.relatedTarget as Node)) {
      return
    }
    
    setTimeout(() => {
      setIsEditing(false)
      setShowToolbar(false)
      if (tempValue.trim() !== value) {
        onChange(tempValue.trim() || value)
      }
    }, 200)
  }

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const newValue = e.currentTarget.textContent || ''
    setTempValue(newValue)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      inputRef.current?.blur()
    }
    if (e.key === 'Escape') {
      setTempValue(value)
      setIsEditing(false)
      setShowToolbar(false)
    }
  }

  const applyFormatting = () => {
    return {
      fontSize: `${fontSize}px`,
      fontFamily,
      fontWeight: isBold ? 'bold' : 'normal',
      fontStyle: isItalic ? 'italic' : 'normal',
      textDecoration: isUnderline ? 'underline' : 'none',
      textAlign,
      color
    }
  }

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
      {/* Floating Toolbar */}
      {showToolbar && (
        <FloatingToolbar
          fontSize={fontSize}
          fontFamily={fontFamily}
          isBold={isBold}
          isItalic={isItalic}
          isUnderline={isUnderline}
          textAlign={textAlign}
          color={color}
          onFontSizeChange={setFontSize}
          onFontFamilyChange={setFontFamily}
          onBoldToggle={() => setIsBold(!isBold)}
          onItalicToggle={() => setIsItalic(!isItalic)}
          onUnderlineToggle={() => setIsUnderline(!isUnderline)}
          onAlignChange={setTextAlign}
          onColorChange={setColor}
        />
      )}

      {isEditing ? (
        <Component
          ref={inputRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={`editable-text-input ${className}`}
          style={{
            ...style,
            ...applyFormatting(),
            outline: '2px solid #3b82f6',
            outlineOffset: '4px',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            padding: '8px',
            borderRadius: '4px',
            minHeight: '40px',
            cursor: 'text'
          }}
        >
          {tempValue}
        </Component>
      ) : (
        <Component
          className={`editable-text ${className}`}
          onClick={handleClick}
          style={{
            ...style,
            ...applyFormatting(),
            cursor: 'pointer',
            position: 'relative',
            transition: 'all 0.2s ease',
            outline: '2px dashed rgba(59, 130, 246, 0.3)',
            outlineOffset: '4px',
            backgroundColor: 'rgba(59, 130, 246, 0.05)',
            padding: '8px',
            borderRadius: '4px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.outline = '2px dashed rgba(59, 130, 246, 0.8)'
            e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)'
            e.currentTarget.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.outline = '2px dashed rgba(59, 130, 246, 0.3)'
            e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.05)'
            e.currentTarget.style.boxShadow = 'none'
          }}
          title="✏️ Click to edit with formatting options"
        >
          {value || placeholder}
          <span style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            fontSize: '14px',
            background: '#3b82f6',
            color: 'white',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.8
          }}>
            ✏️
          </span>
        </Component>
      )}
    </div>
  )
}
