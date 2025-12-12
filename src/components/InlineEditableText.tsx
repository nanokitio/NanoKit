'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Type } from 'lucide-react'

interface InlineEditableTextProps {
  value: string
  onChange: (value: string) => void
  onStyleChange?: (styles: TextStyles) => void
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div' | 'button'
  placeholder?: string
  style?: React.CSSProperties
  initialStyles?: TextStyles
}

export interface TextStyles {
  fontSize: number
  fontWeight: 'normal' | 'bold'
  fontStyle: 'normal' | 'italic'
  textDecoration: 'none' | 'underline'
  textAlign: 'left' | 'center' | 'right'
}

const FONT_SIZES = [12, 14, 16, 18, 20, 24, 28, 32, 36, 42, 48, 56, 64, 72, 96]

export function InlineEditableText({
  value,
  onChange,
  onStyleChange,
  className = '',
  as: Component = 'div',
  placeholder = 'Click to edit...',
  style,
  initialStyles
}: InlineEditableTextProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [showToolbar, setShowToolbar] = useState(false)
  const [localValue, setLocalValue] = useState(value)
  const [textStyles, setTextStyles] = useState<TextStyles>(initialStyles || {
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    textDecoration: 'none',
    textAlign: 'center'
  })
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 })
  const [showFontSizeDropdown, setShowFontSizeDropdown] = useState(false)
  
  const contentRef = useRef<HTMLDivElement>(null)
  const toolbarRef = useRef<HTMLDivElement>(null)

  // Sync with external value
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  // Position toolbar above the element
  useEffect(() => {
    if (showToolbar && contentRef.current) {
      const rect = contentRef.current.getBoundingClientRect()
      setToolbarPosition({
        top: rect.top - 50,
        left: rect.left + rect.width / 2 - 150
      })
    }
  }, [showToolbar, isEditing])

  // Close toolbar when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        contentRef.current && 
        !contentRef.current.contains(e.target as Node) &&
        toolbarRef.current &&
        !toolbarRef.current.contains(e.target as Node)
      ) {
        setShowToolbar(false)
        setIsEditing(false)
        setShowFontSizeDropdown(false)
        // Save on blur
        if (localValue !== value) {
          onChange(localValue)
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [localValue, value, onChange])

  const handleClick = () => {
    setIsEditing(true)
    setShowToolbar(true)
    // Focus the editable element
    setTimeout(() => {
      if (contentRef.current) {
        contentRef.current.focus()
      }
    }, 0)
  }

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const newValue = e.currentTarget.textContent || ''
    setLocalValue(newValue)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      setIsEditing(false)
      setShowToolbar(false)
      onChange(localValue)
    }
    if (e.key === 'Escape') {
      setIsEditing(false)
      setShowToolbar(false)
      setLocalValue(value) // Reset to original
    }
  }

  const updateStyle = (key: keyof TextStyles, val: any) => {
    const newStyles = { ...textStyles, [key]: val }
    setTextStyles(newStyles)
    onStyleChange?.(newStyles)
  }

  const toggleBold = () => {
    updateStyle('fontWeight', textStyles.fontWeight === 'bold' ? 'normal' : 'bold')
  }

  const toggleItalic = () => {
    updateStyle('fontStyle', textStyles.fontStyle === 'italic' ? 'normal' : 'italic')
  }

  const toggleUnderline = () => {
    updateStyle('textDecoration', textStyles.textDecoration === 'underline' ? 'none' : 'underline')
  }

  const setAlignment = (align: 'left' | 'center' | 'right') => {
    updateStyle('textAlign', align)
  }

  const setFontSize = (size: number) => {
    updateStyle('fontSize', size)
    setShowFontSizeDropdown(false)
  }

  const combinedStyle: React.CSSProperties = {
    ...style,
    fontSize: `${textStyles.fontSize}px`,
    fontWeight: textStyles.fontWeight,
    fontStyle: textStyles.fontStyle,
    textDecoration: textStyles.textDecoration,
    textAlign: textStyles.textAlign,
    outline: isEditing ? '2px solid #3b82f6' : 'none',
    outlineOffset: '4px',
    cursor: 'text',
    minWidth: '50px',
    transition: 'outline 0.2s ease'
  }

  return (
    <>
      {/* Floating Toolbar */}
      {showToolbar && (
        <div
          ref={toolbarRef}
          className="fixed z-[10000] bg-slate-900/95 backdrop-blur-sm border border-slate-700 rounded-lg shadow-2xl p-2 flex items-center gap-1"
          style={{
            top: Math.max(10, toolbarPosition.top),
            left: Math.max(10, toolbarPosition.left),
          }}
        >
          {/* Font Size Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowFontSizeDropdown(!showFontSizeDropdown)}
              className="flex items-center gap-1 px-2 py-1.5 text-white hover:bg-slate-700 rounded text-sm font-medium min-w-[60px] justify-between"
            >
              <Type size={14} />
              <span>{textStyles.fontSize}</span>
            </button>
            {showFontSizeDropdown && (
              <div className="absolute top-full left-0 mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-1 max-h-48 overflow-y-auto z-10">
                {FONT_SIZES.map(size => (
                  <button
                    key={size}
                    onClick={() => setFontSize(size)}
                    className={`w-full px-4 py-1.5 text-left text-sm hover:bg-slate-700 ${
                      textStyles.fontSize === size ? 'bg-blue-600 text-white' : 'text-slate-300'
                    }`}
                  >
                    {size}px
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-px h-6 bg-slate-700 mx-1" />

          {/* Bold */}
          <button
            onClick={toggleBold}
            className={`p-1.5 rounded hover:bg-slate-700 ${
              textStyles.fontWeight === 'bold' ? 'bg-blue-600 text-white' : 'text-slate-300'
            }`}
            title="Bold"
          >
            <Bold size={16} />
          </button>

          {/* Italic */}
          <button
            onClick={toggleItalic}
            className={`p-1.5 rounded hover:bg-slate-700 ${
              textStyles.fontStyle === 'italic' ? 'bg-blue-600 text-white' : 'text-slate-300'
            }`}
            title="Italic"
          >
            <Italic size={16} />
          </button>

          {/* Underline */}
          <button
            onClick={toggleUnderline}
            className={`p-1.5 rounded hover:bg-slate-700 ${
              textStyles.textDecoration === 'underline' ? 'bg-blue-600 text-white' : 'text-slate-300'
            }`}
            title="Underline"
          >
            <Underline size={16} />
          </button>

          <div className="w-px h-6 bg-slate-700 mx-1" />

          {/* Alignment */}
          <button
            onClick={() => setAlignment('left')}
            className={`p-1.5 rounded hover:bg-slate-700 ${
              textStyles.textAlign === 'left' ? 'bg-blue-600 text-white' : 'text-slate-300'
            }`}
            title="Align Left"
          >
            <AlignLeft size={16} />
          </button>
          <button
            onClick={() => setAlignment('center')}
            className={`p-1.5 rounded hover:bg-slate-700 ${
              textStyles.textAlign === 'center' ? 'bg-blue-600 text-white' : 'text-slate-300'
            }`}
            title="Align Center"
          >
            <AlignCenter size={16} />
          </button>
          <button
            onClick={() => setAlignment('right')}
            className={`p-1.5 rounded hover:bg-slate-700 ${
              textStyles.textAlign === 'right' ? 'bg-blue-600 text-white' : 'text-slate-300'
            }`}
            title="Align Right"
          >
            <AlignRight size={16} />
          </button>
        </div>
      )}

      {/* Editable Content */}
      <div
        ref={contentRef}
        contentEditable={isEditing}
        suppressContentEditableWarning
        onClick={handleClick}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        className={`inline-editable-text ${className} ${isEditing ? 'editing' : ''}`}
        style={combinedStyle}
        data-placeholder={placeholder}
      >
        {localValue || placeholder}
      </div>

      {/* Hover indicator styles */}
      <style jsx global>{`
        .inline-editable-text {
          position: relative;
          border-radius: 4px;
          transition: all 0.2s ease;
        }
        .inline-editable-text:not(.editing):hover {
          outline: 2px dashed rgba(59, 130, 246, 0.5) !important;
          outline-offset: 4px;
          cursor: text;
        }
        .inline-editable-text:not(.editing):hover::after {
          content: '✏️';
          position: absolute;
          top: -8px;
          right: -8px;
          font-size: 14px;
          opacity: 0.8;
        }
        .inline-editable-text.editing {
          background: rgba(59, 130, 246, 0.05);
        }
        .inline-editable-text:empty::before {
          content: attr(data-placeholder);
          color: rgba(255,255,255,0.4);
          pointer-events: none;
        }
      `}</style>
    </>
  )
}
