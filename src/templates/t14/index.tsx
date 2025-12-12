'use client'

import { useState } from 'react'
import { BrandConfig } from '@/lib/types'
import { SimpleEditableText } from '@/components/SimpleEditableText'
import { useInlineEdit } from '@/hooks/useInlineEdit'

interface Template14Props {
  brand: BrandConfig
}

export function Template14({ brand }: Template14Props) {
  const { notifyChange } = useInlineEdit()
  const [headline, setHeadline] = useState(brand.copy?.headline || 'SPIN THE WHEEL')
  
  return (
    <div className="w-full h-screen bg-gradient-to-b from-blue-900 to-blue-600 flex items-center justify-center">
      <div className="text-center text-white p-8">
        <SimpleEditableText
          value={headline}
          onChange={(val) => {
            setHeadline(val)
            notifyChange('headline', val)
          }}
          className="text-4xl font-bold mb-4"
          as="h1"
          placeholder="SPIN THE WHEEL"
        />
        <p className="text-xl mb-6">Fortune Wheel - Underwater Theme 🌊</p>
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
