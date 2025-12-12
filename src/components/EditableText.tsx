'use client'

import React, { useState, useRef, useEffect } from 'react'

interface EditableTextProps {
  value: string
  onChange: (value: string) => void
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
  className = '',
  placeholder = 'Click to edit...',
  as: Component = 'div',
  multiline = false,
  maxLength,
  style
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [tempValue, setTempValue] = useState(value)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setTempValue(value)
  }, [value])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditing(true)
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
            fontSize: 'inherit',
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
        cursor: 'pointer',
        position: 'relative',
        transition: 'all 0.2s ease',
        outline: 'none'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.outline = '3px dashed rgba(59, 130, 246, 0.8)'
        e.currentTarget.style.outlineOffset = '2px'
        e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.05)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.outline = 'none'
        e.currentTarget.style.backgroundColor = 'transparent'
      }}
      title="✏️ Click to edit this text"
    >
      <span style={{ position: 'relative', display: 'inline-block' }}>
        {value || placeholder}
      </span>
    </Component>
  )
}
