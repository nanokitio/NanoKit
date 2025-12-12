'use client'

import React, { useState, useRef, useEffect } from 'react'
import { FloatingToolbar } from './FloatingToolbar'

interface EditableTextCanvaProps {
  value: string
  onChange: (value: string) => void
  onStyleChange?: (styles: TextStyles) => void
  className?: string
  placeholder?: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div' | 'button'
  multiline?: boolean
  maxLength?: number
  style?: React.CSSProperties
  initialStyles?: TextStyles
}

export interface TextStyles {
  fontSize: number
  fontFamily: string
  isBold: boolean
  isItalic: boolean
  isUnderline: boolean
  textAlign: 'left' | 'center' | 'right'
  color: string
}

export function EditableTextCanva({
  value,
  onChange,
  onStyleChange,
  className = '',
  placeholder = 'Click to edit...',
  as: Component = 'div',
  multiline = false,
  maxLength,
  style,
  initialStyles
}: EditableTextCanvaProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSelected, setIsSelected] = useState(false)
  const [tempValue, setTempValue] = useState(value)
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 })
  
  const [textStyles, setTextStyles] = useState<TextStyles>({
    fontSize: initialStyles?.fontSize || 16,
    fontFamily: initialStyles?.fontFamily || 'Inter',
    isBold: initialStyles?.isBold || false,
    isItalic: initialStyles?.isItalic || false,
    isUnderline: initialStyles?.isUnderline || false,
    textAlign: initialStyles?.textAlign || 'left',
    color: initialStyles?.color || '#000000'
  })

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

  useEffect(() => {
    if (isSelected && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setToolbarPosition({
        x: rect.left + rect.width / 2,
        y: rect.top
      })
    }
  }, [isSelected, textStyles])

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsSelected(true)
    setIsEditing(true)
    
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setToolbarPosition({
        x: rect.left + rect.width / 2,
        y: rect.top
      })
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
      setIsSelected(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value
    if (!maxLength || newValue.length <= maxLength) {
      setTempValue(newValue)
    }
  }

  const updateStyle = (updates: Partial<TextStyles>) => {
    const newStyles = { ...textStyles, ...updates }
    setTextStyles(newStyles)
    onStyleChange?.(newStyles)
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsSelected(false)
        setIsEditing(false)
      }
    }

    if (isSelected) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isSelected])

  const computedStyle: React.CSSProperties = {
    ...style,
    fontSize: `${textStyles.fontSize}px`,
    fontFamily: textStyles.fontFamily,
    fontWeight: textStyles.isBold ? 'bold' : style?.fontWeight || 'normal',
    fontStyle: textStyles.isItalic ? 'italic' : 'normal',
    textDecoration: textStyles.isUnderline ? 'underline' : 'none',
    textAlign: textStyles.textAlign,
    color: textStyles.color,
    cursor: 'pointer',
    position: 'relative',
    transition: 'all 0.2s ease',
    outline: isSelected ? '2px solid #3b82f6' : 'none',
    outlineOffset: '4px',
    padding: '8px 12px',
    borderRadius: '4px',
    minHeight: multiline ? '60px' : 'auto'
  }

  if (isEditing) {
    const InputComponent = multiline ? 'textarea' : 'input'
    return (
      <>
        <div ref={containerRef} style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
          <InputComponent
            ref={inputRef as any}
            type={multiline ? undefined : 'text'}
            value={tempValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            maxLength={maxLength}
            style={{
              ...computedStyle,
              width: '100%',
              background: 'rgba(255, 255, 255, 0.95)',
              border: '2px solid #3b82f6',
              boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.2)',
              resize: multiline ? 'vertical' : 'none'
            }}
          />
        </div>
        
        {isSelected && (
          <FloatingToolbar
            position={toolbarPosition}
            fontSize={textStyles.fontSize}
            onFontSizeChange={(size) => updateStyle({ fontSize: size })}
            fontFamily={textStyles.fontFamily}
            onFontFamilyChange={(font) => updateStyle({ fontFamily: font })}
            isBold={textStyles.isBold}
            isItalic={textStyles.isItalic}
            isUnderline={textStyles.isUnderline}
            onBoldToggle={() => updateStyle({ isBold: !textStyles.isBold })}
            onItalicToggle={() => updateStyle({ isItalic: !textStyles.isItalic })}
            onUnderlineToggle={() => updateStyle({ isUnderline: !textStyles.isUnderline })}
            textAlign={textStyles.textAlign}
            onAlignChange={(align) => updateStyle({ textAlign: align })}
            color={textStyles.color}
            onColorChange={(color) => updateStyle({ color })}
          />
        )}
      </>
    )
  }

  return (
    <>
      <Component
        ref={containerRef as any}
        className={`editable-text-canva ${className}`}
        onClick={handleClick}
        style={computedStyle}
        title="✏️ Click to edit and format text"
      >
        {value || placeholder}
        
        {/* Selection Handles */}
        {isSelected && (
          <>
            <div style={{
              position: 'absolute',
              top: '-6px',
              left: '-6px',
              width: '12px',
              height: '12px',
              background: '#3b82f6',
              border: '2px solid white',
              borderRadius: '50%',
              cursor: 'nwse-resize'
            }} />
            <div style={{
              position: 'absolute',
              top: '-6px',
              right: '-6px',
              width: '12px',
              height: '12px',
              background: '#3b82f6',
              border: '2px solid white',
              borderRadius: '50%',
              cursor: 'nesw-resize'
            }} />
            <div style={{
              position: 'absolute',
              bottom: '-6px',
              left: '-6px',
              width: '12px',
              height: '12px',
              background: '#3b82f6',
              border: '2px solid white',
              borderRadius: '50%',
              cursor: 'nesw-resize'
            }} />
            <div style={{
              position: 'absolute',
              bottom: '-6px',
              right: '-6px',
              width: '12px',
              height: '12px',
              background: '#3b82f6',
              border: '2px solid white',
              borderRadius: '50%',
              cursor: 'nwse-resize'
            }} />
          </>
        )}
      </Component>

      {isSelected && !isEditing && (
        <FloatingToolbar
          position={toolbarPosition}
          fontSize={textStyles.fontSize}
          onFontSizeChange={(size) => updateStyle({ fontSize: size })}
          fontFamily={textStyles.fontFamily}
          onFontFamilyChange={(font) => updateStyle({ fontFamily: font })}
          isBold={textStyles.isBold}
          isItalic={textStyles.isItalic}
          isUnderline={textStyles.isUnderline}
          onBoldToggle={() => updateStyle({ isBold: !textStyles.isBold })}
          onItalicToggle={() => updateStyle({ isItalic: !textStyles.isItalic })}
          onUnderlineToggle={() => updateStyle({ isUnderline: !textStyles.isUnderline })}
          textAlign={textStyles.textAlign}
          onAlignChange={(align) => updateStyle({ textAlign: align })}
          color={textStyles.color}
          onColorChange={(color) => updateStyle({ color })}
        />
      )}
    </>
  )
}
