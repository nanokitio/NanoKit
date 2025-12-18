'use client'

import { useState, useEffect } from 'react'
import { BrandConfig } from '@/lib/types'
import { InlineEditableText } from '@/components/InlineEditableText'
import ScreenshotProtection from '@/components/ScreenshotProtection'

interface Template15Props {
  brand: BrandConfig
}

export function Template15({ brand }: Template15Props) {
  const [headline, setHeadline] = useState(brand.copy?.headline || 'SPIN THE WHEEL');
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Detect edit mode (inside iframe with edit param)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const inIframe = window.self !== window.top;
    const editParam = params.get('edit') === '1' || params.get('preview') === '1';
    setIsEditMode(inIframe && editParam);
  }, []);

  const ctaUrl = brand.ctaUrl || '#'
  const logoUrl = brand.logoUrl || ''
  const popupTitle = (brand as any).popupTitle || 'WINNER!'
  const popupMessage = (brand as any).popupMessage || 'Congratulations! You won'
  const popupPrize = (brand as any).popupPrize || '$800'
  const wheelValues = (brand as any).wheelValues || '$100, $200, $500, $1000, $2000, $5000, $800, $1500'
  const backgroundColor = (brand as any).backgroundColor || '#8B0000'
  const backgroundImage = (brand as any).backgroundImage || ''

  const notifyChange = (field: string, value: string) => {
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'CONTENT_CHANGE', field, value }, '*');
    }
  };

  const gameUrl = `https://www.nanokit.io/templates/game/game.html?theme=china&url=${encodeURIComponent(ctaUrl)}&popupTitle=${encodeURIComponent(popupTitle)}&popupMessage=${encodeURIComponent(popupMessage)}&popupPrize=${encodeURIComponent(popupPrize)}&wheelValues=${encodeURIComponent(wheelValues)}&logoUrl=${encodeURIComponent(logoUrl)}`
  
  return (
    <ScreenshotProtection disabled={isEditMode} editMode={isEditMode}>
      <div 
        className="w-full h-screen relative overflow-hidden"
        style={{ 
          background: backgroundImage 
            ? `url('${backgroundImage}') center/cover no-repeat, ${backgroundColor}` 
            : backgroundColor 
        }}
      >
        {/* Editable Title Overlay - Extra top space in edit mode for toolbar */}
        <div className={`absolute left-1/2 transform -translate-x-1/2 z-50 text-center px-5 max-w-[90%] ${isEditMode ? 'top-16' : 'top-5'}`}>
          <InlineEditableText
            value={headline}
            onChange={(val) => { setHeadline(val); notifyChange('headline', val); }}
            className="text-4xl md:text-5xl font-black text-yellow-400 drop-shadow-lg"
            style={{
              textShadow: '0 0 20px rgba(255, 215, 0, 0.8), 0 0 40px rgba(255, 0, 0, 0.5)'
            }}
            placeholder="Enter headline..."
            initialStyles={{ fontSize: 40, fontWeight: 'bold', fontStyle: 'normal', textDecoration: 'none', textAlign: 'center' }}
            fieldName="headline"
          />
        </div>

        {/* Game iframe */}
        <iframe 
          src={gameUrl}
          className="absolute inset-0 w-full h-full border-0"
          allowFullScreen
        />
      </div>
    </ScreenshotProtection>
  )
}
