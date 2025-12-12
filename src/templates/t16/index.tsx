'use client'

import { useState } from 'react'
import { BrandConfig } from '@/lib/types'
import { InlineEditableText } from '@/components/InlineEditableText'

interface Template16Props {
  brand: BrandConfig
}

export function Template16({ brand }: Template16Props) {
  const [headline, setHeadline] = useState(brand.copy?.headline || 'SPIN THE WHEEL');

  const notifyChange = (field: string, value: string) => {
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'CONTENT_CHANGE', field, value }, '*');
    }
  };
  
  return (
    <div className="w-full h-screen bg-gradient-to-b from-green-900 to-red-700 flex items-center justify-center">
      <div className="text-center text-white p-8">
        <div className="mb-4">
          <InlineEditableText
            value={headline}
            onChange={(val) => { setHeadline(val); notifyChange('headline', val); }}
            className="text-4xl font-bold text-white"
            placeholder="Enter headline..."
            initialStyles={{ fontSize: 36, fontWeight: 'bold', fontStyle: 'normal', textDecoration: 'none', textAlign: 'center' }}
          />
        </div>
        <p className="text-xl mb-6">Fortune Wheel - Christmas Theme 🎄</p>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto">
          <p className="text-sm opacity-90">
            This template uses an interactive Phaser game engine.
            <br />
            Preview it in the editor to see the full wheel game experience!
          </p>
        </div>
      </div>
    </div>
  )
}
