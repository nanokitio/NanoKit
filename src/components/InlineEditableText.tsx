'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Type, Check, X, ChevronDown, Copy, ArrowUp, ArrowDown, Minus, Palette } from 'lucide-react'

interface InlineEditableTextProps {
  value: string
  onChange: (value: string) => void
  onStyleChange?: (styles: TextStyles) => void
  onDuplicate?: () => void
  onPositionChange?: (position: 'top' | 'center' | 'bottom') => void
  className?: string
  placeholder?: string
  style?: React.CSSProperties
  initialStyles?: TextStyles
  showPositionControls?: boolean
  showDuplicateButton?: boolean
}

export interface TextStyles {
  fontSize: number
  fontFamily?: string
  fontWeight: 'normal' | 'bold'
  fontStyle: 'normal' | 'italic'
  textDecoration: 'none' | 'underline'
  textAlign: 'left' | 'center' | 'right'
  color?: string
}

const PRESET_COLORS = [
  '#ffffff', '#000000', '#ef4444', '#f97316', '#eab308', 
  '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
  '#fbbf24', '#a3e635', '#2dd4bf', '#60a5fa', '#c084fc'
]

const FONT_SIZES = [12, 14, 16, 18, 20, 24, 28, 32, 36, 42, 48, 56, 64, 72, 96]

const FONTS = [
  { name: 'Default', value: 'inherit' },
  { name: 'Inter', value: 'var(--font-inter)' },
  { name: 'Roboto', value: 'var(--font-roboto)' },
  { name: 'Open Sans', value: 'var(--font-open-sans)' },
  { name: 'Lato', value: 'var(--font-lato)' },
  { name: 'Montserrat', value: 'var(--font-montserrat)' },
  { name: 'Poppins', value: 'var(--font-poppins)' },
  { name: 'Playfair', value: 'var(--font-playfair)' },
  { name: 'Oswald', value: 'var(--font-oswald)' },
  { name: 'Raleway', value: 'var(--font-raleway)' },
  { name: 'Bebas Neue', value: 'var(--font-bebas)' },
]

export function InlineEditableText({
  value,
  onChange,
  onStyleChange,
  onDuplicate,
  onPositionChange,
  className = '',
  placeholder = 'Click to edit...',
  style,
  initialStyles,
  showPositionControls = true,
  showDuplicateButton = true
}: InlineEditableTextProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [localValue, setLocalValue] = useState(value)
  const [textStyles, setTextStyles] = useState<TextStyles>(initialStyles || {
    fontSize: 16,
    fontFamily: 'inherit',
    fontWeight: 'normal',
    fontStyle: 'normal',
    textDecoration: 'none',
    textAlign: 'center',
    color: '#ffffff'
  })
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 })
  const [showFontSizeDropdown, setShowFontSizeDropdown] = useState(false)
  const [showFontFamilyDropdown, setShowFontFamilyDropdown] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
  
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const toolbarRef = useRef<HTMLDivElement>(null)

  // Sync with external value
  useEffect(() => {
    if (!isEditing) {
      setLocalValue(value)
    }
  }, [value, isEditing])

  // Position toolbar BELOW the element always
  useEffect(() => {
    if (isEditing && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      // Always position toolbar below the text with 15px gap
      const toolbarTop = rect.bottom + 15
      setToolbarPosition({
        top: toolbarTop,
        left: Math.max(10, Math.min(rect.left + rect.width / 2 - 250, window.innerWidth - 520))
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

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    console.log('InlineEditableText clicked!', { value: localValue, isEditing })
    if (!isEditing) {
      setIsEditing(true)
    }
  }

  const handleSave = () => {
    setIsEditing(false)
    setShowFontSizeDropdown(false)
    setShowFontFamilyDropdown(false)
    setShowColorPicker(false)
    onChange(localValue)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setShowFontSizeDropdown(false)
    setShowFontFamilyDropdown(false)
    setShowColorPicker(false)
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
  const setFontFamily = (font: string) => { updateStyle('fontFamily', font); setShowFontFamilyDropdown(false) }
  const setColor = (color: string) => { updateStyle('color', color); setShowColorPicker(false) }
  
  const closeAllDropdowns = () => {
    setShowFontSizeDropdown(false)
    setShowFontFamilyDropdown(false)
    setShowColorPicker(false)
  }
  
  const currentFontName = FONTS.find(f => f.value === textStyles.fontFamily)?.name || 'Default'

  const textStyle: React.CSSProperties = {
    ...style,
    fontSize: `${textStyles.fontSize}px`,
    fontFamily: textStyles.fontFamily || 'inherit',
    fontWeight: textStyles.fontWeight,
    fontStyle: textStyles.fontStyle,
    color: textStyles.color || '#ffffff',
    textDecoration: textStyles.textDecoration,
    textAlign: textStyles.textAlign,
  }

  return (
    <div ref={containerRef} className="relative" style={{ zIndex: 10 }}>
      {/* Floating Toolbar - Only when editing */}
      {isEditing && (
        <div
          ref={toolbarRef}
          className="fixed z-[99999] rounded-xl shadow-2xl p-2 flex items-center gap-1 backdrop-blur-sm"
          style={{
            top: Math.max(10, toolbarPosition.top),
            left: Math.max(10, Math.min(toolbarPosition.left, window.innerWidth - 520)),
            backgroundColor: 'rgba(15, 23, 42, 0.98)',
            border: '2px solid rgba(100, 116, 139, 0.5)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255,255,255,0.1)',
          }}
          onMouseDown={(e) => e.preventDefault()}
        >
          {/* Font Family */}
          <div className="relative">
            <button
              onClick={() => { setShowFontFamilyDropdown(!showFontFamilyDropdown); setShowFontSizeDropdown(false) }}
              className="flex items-center gap-1 px-2 py-1.5 text-white hover:bg-slate-700 rounded text-sm font-medium min-w-[90px] justify-between"
            >
              <span className="truncate">{currentFontName}</span>
              <ChevronDown size={12} />
            </button>
            {showFontFamilyDropdown && (
              <div className="absolute top-full left-0 mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-xl py-1 max-h-60 overflow-y-auto z-20 min-w-[140px]">
                {FONTS.map(font => (
                  <button
                    key={font.value}
                    onClick={() => setFontFamily(font.value)}
                    className={`w-full px-3 py-2 text-left text-sm hover:bg-slate-700 ${
                      textStyles.fontFamily === font.value ? 'bg-blue-600 text-white' : 'text-slate-300'
                    }`}
                    style={{ fontFamily: font.value }}
                  >
                    {font.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Font Size */}
          <div className="relative">
            <button
              onClick={() => { setShowFontSizeDropdown(!showFontSizeDropdown); setShowFontFamilyDropdown(false) }}
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

          {/* Color Picker - Spectrum/Prisma style */}
          <div className="relative">
            <button
              onClick={() => { setShowColorPicker(!showColorPicker); setShowFontSizeDropdown(false); setShowFontFamilyDropdown(false) }}
              className="p-1.5 rounded hover:bg-slate-700 text-slate-300 flex items-center gap-1"
              title="Text Color"
            >
              <Palette size={16} />
              <div 
                className="w-4 h-4 rounded border border-slate-500" 
                style={{ backgroundColor: textStyles.color || '#ffffff' }}
              />
            </button>
            {showColorPicker && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-slate-800 border border-slate-600 rounded-lg shadow-2xl p-3 z-[10001]" style={{ minWidth: '220px' }}>
                {/* Spectrum Color Picker */}
                <div className="mb-3">
                  <input
                    type="color"
                    value={textStyles.color || '#ffffff'}
                    onChange={(e) => updateStyle('color', e.target.value)}
                    className="w-full h-32 cursor-pointer rounded-lg border-0"
                    style={{ 
                      padding: 0,
                      background: 'transparent'
                    }}
                    title="Pick any color"
                  />
                </div>
                
                {/* Quick Colors Row */}
                <div className="flex gap-1 justify-center mb-2">
                  {['#ffffff', '#000000', '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'].map(color => (
                    <button
                      key={color}
                      onClick={() => setColor(color)}
                      className={`w-5 h-5 rounded-full border hover:scale-110 transition-transform ${
                        textStyles.color === color ? 'border-white border-2' : 'border-slate-500'
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
                
                {/* Current Color Display */}
                <div className="flex items-center gap-2 bg-slate-700 rounded px-2 py-1">
                  <div 
                    className="w-6 h-6 rounded border border-slate-500" 
                    style={{ backgroundColor: textStyles.color || '#ffffff' }}
                  />
                  <input
                    type="text"
                    value={textStyles.color || '#ffffff'}
                    onChange={(e) => {
                      if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                        setColor(e.target.value)
                      }
                    }}
                    className="bg-transparent text-white text-sm font-mono flex-1 outline-none"
                    placeholder="#ffffff"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Position Controls */}
          {showPositionControls && onPositionChange && (
            <>
              <div className="w-px h-6 bg-slate-600 mx-1" />
              <button 
                onClick={() => onPositionChange('top')} 
                className="p-1.5 rounded hover:bg-slate-700 text-slate-300" 
                title="Move to top"
              >
                <ArrowUp size={16} />
              </button>
              <button 
                onClick={() => onPositionChange('center')} 
                className="p-1.5 rounded hover:bg-slate-700 text-slate-300" 
                title="Move to center"
              >
                <Minus size={16} />
              </button>
              <button 
                onClick={() => onPositionChange('bottom')} 
                className="p-1.5 rounded hover:bg-slate-700 text-slate-300" 
                title="Move to bottom"
              >
                <ArrowDown size={16} />
              </button>
            </>
          )}

          {/* Duplicate Button */}
          {showDuplicateButton && onDuplicate && (
            <>
              <div className="w-px h-6 bg-slate-600 mx-1" />
              <button 
                onClick={onDuplicate} 
                className="p-1.5 rounded hover:bg-purple-600 text-purple-400 hover:text-white" 
                title="Duplicate text"
              >
                <Copy size={16} />
              </button>
            </>
          )}

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
          onBlur={(e) => {
            // Don't close if clicking on toolbar
            const toolbar = toolbarRef.current
            if (toolbar && e.relatedTarget && toolbar.contains(e.relatedTarget as Node)) {
              return
            }
            // Small delay to allow toolbar clicks
            setTimeout(() => {
              if (!showFontSizeDropdown && !showFontFamilyDropdown && !showColorPicker) {
                handleSave()
              }
            }, 300)
          }}
          className="bg-slate-800/90 border-2 border-blue-500 rounded px-2 py-1 outline-none text-white"
          style={{
            ...textStyle,
            minWidth: '100px',
            width: `${Math.max(100, localValue.length * 12)}px`,
            color: '#ffffff',
            WebkitTextFillColor: '#ffffff'
          }}
          placeholder={placeholder}
        />
      ) : (
        <div
          onClick={handleClick}
          onMouseDown={(e) => { e.stopPropagation(); }}
          className={`cursor-pointer rounded-sm transition-all editable-text ${className}`}
          style={{ 
            ...textStyle, 
            position: 'relative', 
            zIndex: 100,
            outline: '1px dashed rgba(6, 182, 212, 0.4)',
            outlineOffset: '2px',
          }}
          title="Click to edit"
          data-editable="true"
        >
          {localValue || placeholder}
        </div>
      )}
    </div>
  )
}
