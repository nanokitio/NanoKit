'use client'

import React, { useState, useRef, useEffect } from 'react'

interface SimpleEditableTextProps {
  value: string
  onChange: (value: string) => void
  className?: string
  placeholder?: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div'
  style?: React.CSSProperties
}

export function SimpleEditableText({
  value,
  onChange,
  className = '',
  placeholder = 'Click to edit...',
  as: Component = 'div',
  style
}: SimpleEditableTextProps) {
  const [localValue, setLocalValue] = useState(value)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleInput = (e: React.FormEvent<HTMLElement>) => {
    const newValue = e.currentTarget.textContent || ''
    setLocalValue(newValue)
    onChange(newValue)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      ;(e.target as HTMLElement).blur()
    }
  }

  return (
    <Component
      ref={ref as any}
      contentEditable={true}
      suppressContentEditableWarning
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      className={`simple-editable ${className}`}
      style={{
        ...style,
        outline: 'none',
        cursor: 'text',
        minHeight: '1em',
        position: 'relative'
      }}
      data-placeholder={placeholder}
    >
      {localValue || placeholder}
    </Component>
  )
}
