'use client'

import React from 'react'
import { EditableTextCanva } from '@/components/EditableTextCanva'

export default function TestCanvaPage() {
  const [headline, setHeadline] = React.useState('Click Me to Edit!')
  const [subheadline, setSubheadline] = React.useState('Try the Canva-style toolbar')

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      gap: '40px'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        maxWidth: '800px',
        width: '100%'
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '20px',
          color: '#1f2937'
        }}>
          🎨 Canva-Style Editor Test
        </h1>
        
        <p style={{
          fontSize: '14px',
          color: '#6b7280',
          marginBottom: '30px',
          lineHeight: '1.6'
        }}>
          Click on any text below to see the floating toolbar with formatting options.
          You can change font, size, bold, italic, underline, alignment, and color.
        </p>

        <div style={{
          background: '#f9fafb',
          padding: '40px',
          borderRadius: '12px',
          marginBottom: '20px'
        }}>
          <EditableTextCanva
            value={headline}
            onChange={(val) => {
              setHeadline(val)
              console.log('Headline changed:', val)
            }}
            onStyleChange={(styles) => {
              console.log('Headline styles changed:', styles)
            }}
            as="h1"
            placeholder="Click to edit headline..."
            initialStyles={{
              fontSize: 48,
              fontFamily: 'Inter',
              isBold: true,
              isItalic: false,
              isUnderline: false,
              textAlign: 'center',
              color: '#1f2937'
            }}
          />
        </div>

        <div style={{
          background: '#f9fafb',
          padding: '30px',
          borderRadius: '12px'
        }}>
          <EditableTextCanva
            value={subheadline}
            onChange={(val) => {
              setSubheadline(val)
              console.log('Subheadline changed:', val)
            }}
            onStyleChange={(styles) => {
              console.log('Subheadline styles changed:', styles)
            }}
            as="p"
            placeholder="Click to edit subheadline..."
            initialStyles={{
              fontSize: 20,
              fontFamily: 'Inter',
              isBold: false,
              isItalic: false,
              isUnderline: false,
              textAlign: 'center',
              color: '#6b7280'
            }}
          />
        </div>

        <div style={{
          marginTop: '30px',
          padding: '20px',
          background: '#eff6ff',
          borderRadius: '8px',
          border: '1px solid #bfdbfe'
        }}>
          <p style={{
            fontSize: '14px',
            color: '#1e40af',
            fontWeight: '600',
            marginBottom: '10px'
          }}>
            ✨ Features to try:
          </p>
          <ul style={{
            fontSize: '13px',
            color: '#3b82f6',
            lineHeight: '1.8',
            paddingLeft: '20px'
          }}>
            <li>Click text to see blue outline and corner handles</li>
            <li>Floating toolbar appears above selected text</li>
            <li>Change font from dropdown (10 fonts available)</li>
            <li>Adjust size with +/- buttons or type exact value</li>
            <li>Toggle Bold, Italic, Underline</li>
            <li>Change text alignment (left, center, right)</li>
            <li>Pick any color with color picker</li>
            <li>Click again to edit the actual text</li>
            <li>Press Enter to save, Escape to cancel</li>
          </ul>
        </div>
      </div>

      <div style={{
        color: 'white',
        fontSize: '12px',
        opacity: 0.8,
        textAlign: 'center'
      }}>
        <p>This is a test page to demonstrate the Canva-style editor</p>
        <p>In production, this will be integrated into template t6 and others</p>
      </div>
    </div>
  )
}
