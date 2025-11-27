'use client'

import React from 'react'
import { BrandConfig } from '@/lib/types'
import { EditableText } from '@/components/EditableText'

interface Template16Props {
  brand: BrandConfig
}

export function Template16({ brand }: Template16Props) {
  const [subtitle, setSubtitle] = React.useState('Fortune Wheel - Christmas Theme 🎄')
  const [infoText, setInfoText] = React.useState('This template uses an interactive Phaser game engine.\nPreview it in the editor to see the full wheel game experience!')
  
  const handleInlineEdit = (field: string, value: string) => {
    if (brand.editable && window.parent) {
      window.parent.postMessage({ type: 'inlineEdit', field, value }, '*')
    }
  }
  
  return (
    <div className="w-full h-screen bg-gradient-to-b from-green-900 to-red-700 flex items-center justify-center">
      <div className="text-center text-white p-8">
        <h1 className="text-4xl font-bold mb-4">
          <EditableText 
            value={brand.copy?.headline || 'SPIN THE WHEEL'}
            onChange={(value) => handleInlineEdit('headline', value)}
            disabled={!brand.editable}
            className="inline"
          />
        </h1>
        <p className="text-xl mb-6">
          <EditableText 
            value={subtitle}
            onChange={(value) => { setSubtitle(value); handleInlineEdit('subtitle', value); }}
            disabled={!brand.editable}
            className="inline"
          />
        </p>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto">
          <p className="text-sm opacity-90">
            <EditableText 
              value={infoText}
              onChange={(value) => { setInfoText(value); handleInlineEdit('infoText', value); }}
              disabled={!brand.editable}
              multiline
              className="inline"
            />
          </p>
        </div>
      </div>
    </div>
  )
}
