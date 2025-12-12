'use client'

import React from 'react'
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Type, Palette, MoreHorizontal } from 'lucide-react'

interface FloatingToolbarProps {
  position: { x: number; y: number }
  fontSize: number
  onFontSizeChange: (size: number) => void
  fontFamily?: string
  onFontFamilyChange?: (font: string) => void
  isBold?: boolean
  isItalic?: boolean
  isUnderline?: boolean
  onBoldToggle?: () => void
  onItalicToggle?: () => void
  onUnderlineToggle?: () => void
  textAlign?: 'left' | 'center' | 'right'
  onAlignChange?: (align: 'left' | 'center' | 'right') => void
  color?: string
  onColorChange?: (color: string) => void
}

const FONT_FAMILIES = [
  'Inter',
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Georgia',
  'Courier New',
  'Verdana',
  'Trebuchet MS',
  'Impact',
  'Comic Sans MS'
]

export function FloatingToolbar({
  position,
  fontSize,
  onFontSizeChange,
  fontFamily = 'Inter',
  onFontFamilyChange,
  isBold,
  isItalic,
  isUnderline,
  onBoldToggle,
  onItalicToggle,
  onUnderlineToggle,
  textAlign = 'left',
  onAlignChange,
  color = '#000000',
  onColorChange
}: FloatingToolbarProps) {
  const [showFontPicker, setShowFontPicker] = React.useState(false)
  const [showColorPicker, setShowColorPicker] = React.useState(false)

  return (
    <div
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y - 60}px`,
        background: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '8px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        zIndex: 10000,
        fontFamily: 'Inter, sans-serif'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Font Family Selector */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setShowFontPicker(!showFontPicker)}
          style={{
            padding: '6px 12px',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            background: 'white',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '500',
            minWidth: '120px',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <span>{fontFamily}</span>
          <span style={{ fontSize: '10px', marginLeft: '8px' }}>▼</span>
        </button>
        
        {showFontPicker && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: '4px',
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            maxHeight: '200px',
            overflowY: 'auto',
            minWidth: '150px',
            zIndex: 10001
          }}>
            {FONT_FAMILIES.map(font => (
              <div
                key={font}
                onClick={() => {
                  onFontFamilyChange?.(font)
                  setShowFontPicker(false)
                }}
                style={{
                  padding: '8px 12px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontFamily: font,
                  background: fontFamily === font ? '#f3f4f6' : 'transparent',
                  transition: 'background 0.15s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                onMouseLeave={(e) => e.currentTarget.style.background = fontFamily === font ? '#f3f4f6' : 'transparent'}
              >
                {font}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Divider */}
      <div style={{ width: '1px', height: '24px', background: '#e5e7eb', margin: '0 4px' }} />

      {/* Font Size */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <button
          onClick={() => onFontSizeChange(Math.max(8, fontSize - 2))}
          style={{
            width: '24px',
            height: '24px',
            border: '1px solid #e5e7eb',
            borderRadius: '4px',
            background: 'white',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          -
        </button>
        <input
          type="number"
          value={fontSize}
          onChange={(e) => onFontSizeChange(Number(e.target.value))}
          style={{
            width: '50px',
            padding: '4px 8px',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            fontSize: '13px',
            textAlign: 'center'
          }}
          min="8"
          max="200"
        />
        <button
          onClick={() => onFontSizeChange(Math.min(200, fontSize + 2))}
          style={{
            width: '24px',
            height: '24px',
            border: '1px solid #e5e7eb',
            borderRadius: '4px',
            background: 'white',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          +
        </button>
      </div>

      {/* Divider */}
      <div style={{ width: '1px', height: '24px', background: '#e5e7eb', margin: '0 4px' }} />

      {/* Text Formatting */}
      <button
        onClick={onBoldToggle}
        style={{
          width: '32px',
          height: '32px',
          border: 'none',
          borderRadius: '6px',
          background: isBold ? '#e0f2fe' : 'transparent',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.15s'
        }}
        title="Bold"
      >
        <Bold size={16} color={isBold ? '#0284c7' : '#6b7280'} />
      </button>

      <button
        onClick={onItalicToggle}
        style={{
          width: '32px',
          height: '32px',
          border: 'none',
          borderRadius: '6px',
          background: isItalic ? '#e0f2fe' : 'transparent',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.15s'
        }}
        title="Italic"
      >
        <Italic size={16} color={isItalic ? '#0284c7' : '#6b7280'} />
      </button>

      <button
        onClick={onUnderlineToggle}
        style={{
          width: '32px',
          height: '32px',
          border: 'none',
          borderRadius: '6px',
          background: isUnderline ? '#e0f2fe' : 'transparent',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.15s'
        }}
        title="Underline"
      >
        <Underline size={16} color={isUnderline ? '#0284c7' : '#6b7280'} />
      </button>

      {/* Divider */}
      <div style={{ width: '1px', height: '24px', background: '#e5e7eb', margin: '0 4px' }} />

      {/* Text Alignment */}
      <button
        onClick={() => onAlignChange?.('left')}
        style={{
          width: '32px',
          height: '32px',
          border: 'none',
          borderRadius: '6px',
          background: textAlign === 'left' ? '#e0f2fe' : 'transparent',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        title="Align Left"
      >
        <AlignLeft size={16} color={textAlign === 'left' ? '#0284c7' : '#6b7280'} />
      </button>

      <button
        onClick={() => onAlignChange?.('center')}
        style={{
          width: '32px',
          height: '32px',
          border: 'none',
          borderRadius: '6px',
          background: textAlign === 'center' ? '#e0f2fe' : 'transparent',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        title="Align Center"
      >
        <AlignCenter size={16} color={textAlign === 'center' ? '#0284c7' : '#6b7280'} />
      </button>

      <button
        onClick={() => onAlignChange?.('right')}
        style={{
          width: '32px',
          height: '32px',
          border: 'none',
          borderRadius: '6px',
          background: textAlign === 'right' ? '#e0f2fe' : 'transparent',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        title="Align Right"
      >
        <AlignRight size={16} color={textAlign === 'right' ? '#0284c7' : '#6b7280'} />
      </button>

      {/* Divider */}
      <div style={{ width: '1px', height: '24px', background: '#e5e7eb', margin: '0 4px' }} />

      {/* Color Picker */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          style={{
            width: '32px',
            height: '32px',
            border: 'none',
            borderRadius: '6px',
            background: 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
          title="Text Color"
        >
          <Palette size={16} color="#6b7280" />
          <div style={{
            position: 'absolute',
            bottom: '4px',
            width: '16px',
            height: '3px',
            background: color,
            borderRadius: '2px'
          }} />
        </button>

        {showColorPicker && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginTop: '8px',
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            zIndex: 10001
          }}>
            <input
              type="color"
              value={color}
              onChange={(e) => onColorChange?.(e.target.value)}
              style={{
                width: '150px',
                height: '40px',
                border: 'none',
                cursor: 'pointer'
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
