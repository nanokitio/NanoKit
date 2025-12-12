'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Type, Check, X } from 'lucide-react'

interface InlineEditableTextProps {
  value: string
  onChange: (value: string) => void
  onStyleChange?: (styles: TextStyles) => void
  className?: string
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
  placeholder = 'Click to edit...',
  style,
  initialStyles
}: InlineEditableTextProps) {
  const [isEditing, setIsEditing] = useState(false)
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
  
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const toolbarRef = useRef<HTMLDivElement>(null)

  // Sync with external value
  useEffect(() => {
    if (!isEditing) {
      setLocalValue(value)
    }
  }, [value, isEditing])

  // Position toolbar above the element
  useEffect(() => {
    if (isEditing && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setToolbarPosition({
        top: rect.top - 55,
        left: rect.left + rect.width / 2 - 175
      })
    }
  }, [isEditing])

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleClick = () => {
    if (!isEditing) {
      setIsEditing(true)
    }
  }

  const handleSave = () => {
    setIsEditing(false)
    setShowFontSizeDropdown(false)
    onChange(localValue)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setShowFontSizeDropdown(false)
    setLocalValue(value)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSave()
    }
    if (e.key === 'Escape') {
      handleCancel()
    }
  }

  const updateStyle = (key: keyof TextStyles, val: any) => {
    const newStyles = { ...textStyles, [key]: val }
    setTextStyles(newStyles)
    onStyleChange?.(newStyles)
  }

  const toggleBold = () => updateStyle('fontWeight', textStyles.fontWeight === 'bold' ? 'normal' : 'bold')
  const toggleItalic = () => updateStyle('fontStyle', textStyles.fontStyle === 'italic' ? 'normal' : 'italic')
  const toggleUnderline = () => updateStyle('textDecoration', textStyles.textDecoration === 'underline' ? 'none' : 'underline')
  const setAlignment = (align: 'left' | 'center' | 'right') => updateStyle('textAlign', align)
  const setFontSize = (size: number) => { updateStyle('fontSize', size); setShowFontSizeDropdown(false) }

  const textStyle: React.CSSProperties = {
    ...style,
    fontSize: `${textStyles.fontSize}px`,
    fontWeight: textStyles.fontWeight,
    fontStyle: textStyles.fontStyle,
    textDecoration: textStyles.textDecoration,
    textAlign: textStyles.textAlign,
  }

  return (
    <div ref={containerRef} className="relative inline-block">
      {/* Floating Toolbar - Only when editing */}
      {isEditing && (
        <div
          ref={toolbarRef}
          className="fixed z-[10000] bg-slate-900 border border-slate-600 rounded-lg shadow-2xl p-2 flex items-center gap-1"
          style={{
            top: Math.max(10, toolbarPosition.top),
            left: Math.max(10, Math.min(toolbarPosition.left, window.innerWidth - 370)),
          }}
        >
          {/* Font Size */}
          <div className="relative">
            <button
              onClick={() => setShowFontSizeDropdown(!showFontSizeDropdown)}
              className="flex items-center gap-1 px-2 py-1.5 text-white hover:bg-slate-700 rounded text-sm font-medium min-w-[55px] justify-between"
            >
              <Type size={14} />
              <span>{textStyles.fontSize}</span>
            </button>
            {showFontSizeDropdown && (
              <div className="absolute top-full left-0 mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-xl py-1 max-h-48 overflow-y-auto z-20 min-w-[80px]">
                {FONT_SIZES.map(size => (
                  <button
                    key={size}
                    onClick={() => setFontSize(size)}
                    className={`w-full px-3 py-1.5 text-left text-sm hover:bg-slate-700 ${
                      textStyles.fontSize === size ? 'bg-blue-600 text-white' : 'text-slate-300'
                    }`}
                  >
                    {size}px
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-px h-6 bg-slate-600 mx-1" />

          {/* Bold */}
          <button onClick={toggleBold} className={`p-1.5 rounded hover:bg-slate-700 ${textStyles.fontWeight === 'bold' ? 'bg-blue-600 text-white' : 'text-slate-300'}`} title="Bold">
            <Bold size={16} />
          </button>

          {/* Italic */}
          <button onClick={toggleItalic} className={`p-1.5 rounded hover:bg-slate-700 ${textStyles.fontStyle === 'italic' ? 'bg-blue-600 text-white' : 'text-slate-300'}`} title="Italic">
            <Italic size={16} />
          </button>

          {/* Underline */}
          <button onClick={toggleUnderline} className={`p-1.5 rounded hover:bg-slate-700 ${textStyles.textDecoration === 'underline' ? 'bg-blue-600 text-white' : 'text-slate-300'}`} title="Underline">
            <Underline size={16} />
          </button>

          <div className="w-px h-6 bg-slate-600 mx-1" />

          {/* Alignment */}
          <button onClick={() => setAlignment('left')} className={`p-1.5 rounded hover:bg-slate-700 ${textStyles.textAlign === 'left' ? 'bg-blue-600 text-white' : 'text-slate-300'}`} title="Left">
            <AlignLeft size={16} />
          </button>
          <button onClick={() => setAlignment('center')} className={`p-1.5 rounded hover:bg-slate-700 ${textStyles.textAlign === 'center' ? 'bg-blue-600 text-white' : 'text-slate-300'}`} title="Center">
            <AlignCenter size={16} />
          </button>
          <button onClick={() => setAlignment('right')} className={`p-1.5 rounded hover:bg-slate-700 ${textStyles.textAlign === 'right' ? 'bg-blue-600 text-white' : 'text-slate-300'}`} title="Right">
            <AlignRight size={16} />
          </button>

          <div className="w-px h-6 bg-slate-600 mx-1" />

          {/* Save/Cancel */}
          <button onClick={handleSave} className="p-1.5 rounded hover:bg-green-600 text-green-400 hover:text-white" title="Save (Enter)">
            <Check size={16} />
          </button>
          <button onClick={handleCancel} className="p-1.5 rounded hover:bg-red-600 text-red-400 hover:text-white" title="Cancel (Esc)">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Display or Edit Mode */}
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => setTimeout(handleSave, 200)}
          className={`bg-transparent border-2 border-blue-500 rounded px-2 py-1 outline-none ${className}`}
          style={{
            ...textStyle,
            minWidth: '100px',
            width: `${Math.max(100, localValue.length * 12)}px`,
            color: 'inherit'
          }}
          placeholder={placeholder}
        />
      ) : (
        <div
          onClick={handleClick}
          className={`cursor-text hover:outline hover:outline-2 hover:outline-dashed hover:outline-blue-400 hover:outline-offset-4 rounded transition-all ${className}`}
          style={textStyle}
          title="Click to edit"
        >
          {localValue || placeholder}
          <span className="absolute -top-2 -right-2 text-sm opacity-0 hover:opacity-100 transition-opacity">✏️</span>
        </div>
      )}
    </div>
  )
}
