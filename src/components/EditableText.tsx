'use client'

import React, { useState, useRef, useEffect } from 'react'

interface EditableTextProps {
  value: string
  onChange: (value: string) => void
  onFontSizeChange?: (fontSize: number) => void
  fontSize?: number
  className?: string
  placeholder?: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div' | 'button'
  multiline?: boolean
  maxLength?: number
  style?: React.CSSProperties
}

export function EditableText({
  value,
  onChange,
  onFontSizeChange,
  fontSize: initialFontSize,
  className = '',
  placeholder = 'Click to edit...',
  as: Component = 'div',
  multiline = false,
  maxLength,
  style
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [tempValue, setTempValue] = useState(value)
  const [fontSize, setFontSize] = useState(initialFontSize || 16)
  const [showFontSizeControl, setShowFontSizeControl] = useState(false)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setTempValue(value)
  }, [value])

  useEffect(() => {
    if (initialFontSize) {
      setFontSize(initialFontSize)
    }
  }, [initialFontSize])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditing(true)
    setShowFontSizeControl(true)
  }

  const handleFontSizeChange = (newSize: number) => {
    setFontSize(newSize)
    if (onFontSizeChange) {
      onFontSizeChange(newSize)
    }
  }

  const handleBlur = () => {
    setIsEditing(false)
    if (tempValue.trim() !== value) {
      onChange(tempValue.trim() || value)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault()
      handleBlur()
    }
    if (e.key === 'Escape') {
      setTempValue(value)
      setIsEditing(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value
    if (!maxLength || newValue.length <= maxLength) {
      setTempValue(newValue)
    }
  }

  if (isEditing) {
    const InputComponent = multiline ? 'textarea' : 'input'
    return (
      <div ref={containerRef} className="editable-text-container" style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
        {/* Font Size Control */}
        {showFontSizeControl && onFontSizeChange && (
          <div style={{
            position: 'absolute',
            top: '-50px',
            left: '0',
            background: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(59, 130, 246, 0.5)',
            borderRadius: '8px',
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            zIndex: 1000,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
          }}>
            <span style={{ color: '#fff', fontSize: '12px', fontWeight: '600', minWidth: '60px' }}>Size: {fontSize}px</span>
            <input
              type="range"
              min="8"
              max="120"
              value={fontSize}
              onChange={(e) => handleFontSizeChange(Number(e.target.value))}
              style={{
                width: '150px',
                accentColor: '#3b82f6',
                cursor: 'pointer'
              }}
            />
            <button
              onClick={() => setShowFontSizeControl(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '18px',
                padding: '0 4px'
              }}
              title="Close"
            >
              ×
            </button>
          </div>
        )}
        
        <InputComponent
          ref={inputRef as any}
          type={multiline ? undefined : 'text'}
          value={tempValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={`editable-text-input ${className}`}
          placeholder={placeholder}
          maxLength={maxLength}
          style={{
            ...style,
            width: '100%',
            background: 'rgba(255, 255, 255, 0.95)',
            color: '#000',
            border: '2px solid #3b82f6',
            borderRadius: '4px',
            padding: '8px 12px',
            fontSize: `${fontSize}px`,
            fontFamily: 'inherit',
            fontWeight: 'inherit',
            lineHeight: 'inherit',
            outline: 'none',
            boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.2)',
            resize: multiline ? 'vertical' : 'none',
            minHeight: multiline ? '60px' : 'auto'
          }}
        />
        <style jsx>{`
          .editable-text-input::placeholder {
            color: #9ca3af;
            opacity: 0.7;
          }
        `}</style>
      </div>
    )
  }

  return (
    <Component
      className={`editable-text ${className}`}
      onClick={handleClick}
      style={{
        ...style,
        fontSize: `${fontSize}px`,
        cursor: 'pointer',
        position: 'relative',
        transition: 'all 0.2s ease',
        outline: '2px dashed rgba(59, 130, 246, 0.5)',
        outlineOffset: '4px',
        backgroundColor: 'rgba(59, 130, 246, 0.05)',
        padding: '4px 8px',
        borderRadius: '4px'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.outline = '3px dashed rgba(59, 130, 246, 1)'
        e.currentTarget.style.outlineOffset = '4px'
        e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.15)'
        e.currentTarget.style.boxShadow = '0 0 30px rgba(59, 130, 246, 0.5)'
        e.currentTarget.style.transform = 'scale(1.02)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.outline = '2px dashed rgba(59, 130, 246, 0.5)'
        e.currentTarget.style.outlineOffset = '4px'
        e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.05)'
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.transform = 'scale(1)'
      }}
      title="✏️ Click to edit text and adjust font size"
    >
      <span style={{ position: 'relative', display: 'inline-block' }}>
        {value || placeholder}
        <span style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          fontSize: '16px',
          opacity: 0.7
        }}>
          ✏️
        </span>
      </span>
    </Component>
  )
}
