'use client'

import { useState } from 'react'
import { BrandConfig } from '@/lib/types'
import { InlineEditableText } from '@/components/InlineEditableText'

interface Template14Props {
  brand: BrandConfig
}

export function Template14({ brand }: Template14Props) {
  const [headline, setHeadline] = useState(brand.copy?.headline || 'SPIN THE WHEEL');
  
  const ctaUrl = brand.ctaUrl || '#'
  const logoUrl = brand.logoUrl || ''
  const popupTitle = (brand as any).popupTitle || 'WINNER!'
  const popupMessage = (brand as any).popupMessage || 'Congratulations! You won'
  const popupPrize = (brand as any).popupPrize || '$800'
  const wheelValues = (brand as any).wheelValues || '$100, $200, $500, $1000, $2000, $5000, $800, $1500'
  const backgroundColor = (brand as any).backgroundColor || '#001a33'
  const backgroundImage = (brand as any).backgroundImage || ''

  const notifyChange = (field: string, value: string) => {
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'CONTENT_CHANGE', field, value }, '*');
    }
  };

  const gameUrl = `https://www.nanokit.io/templates/game/game.html?theme=underwater&url=${encodeURIComponent(ctaUrl)}&popupTitle=${encodeURIComponent(popupTitle)}&popupMessage=${encodeURIComponent(popupMessage)}&popupPrize=${encodeURIComponent(popupPrize)}&wheelValues=${encodeURIComponent(wheelValues)}&logoUrl=${encodeURIComponent(logoUrl)}`
  
  return (
    <div 
      className="w-full h-screen relative overflow-hidden"
      style={{ 
        background: backgroundImage 
          ? `url('${backgroundImage}') center/cover no-repeat, ${backgroundColor}` 
          : backgroundColor 
      }}
    >
      {/* Editable Title Overlay */}
      <div className="absolute top-5 left-1/2 transform -translate-x-1/2 z-50 text-center px-5 max-w-[90%]">
        <InlineEditableText
          value={headline}
          onChange={(val) => { setHeadline(val); notifyChange('headline', val); }}
          className="text-4xl md:text-5xl font-black text-white drop-shadow-lg"
          style={{
            textShadow: '0 0 20px rgba(79, 195, 255, 0.8), 0 0 40px rgba(79, 195, 255, 0.5)'
          }}
          placeholder="Enter headline..."
          initialStyles={{ fontSize: 40, fontWeight: 'bold', fontStyle: 'normal', textDecoration: 'none', textAlign: 'center' }}
        />
      </div>

      {/* Game iframe */}
      <iframe 
        src={gameUrl}
        className="absolute inset-0 w-full h-full border-0"
        allowFullScreen
      />
    </div>
  )
}
