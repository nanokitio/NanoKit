'use client'

import React, { useState, useEffect } from 'react'
import { BrandConfig, TemplateProps } from '../../lib/types'
import { generateCSSVariables } from '@/lib/colors'
import { InlineEditableText, TextStyles } from '@/components/InlineEditableText'

interface EditableTextItem {
  id: string
  text: string
  position: 'top' | 'center' | 'bottom'
  styles: TextStyles
}

export function Template7({ brand }: TemplateProps) {
  const { brandName, logoUrl, colors, copy } = brand
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [headlineText, setHeadlineText] = useState(copy.headline || 'WIN BIG WITH BONANZA BILLION SLOTS!');
  const [ctaText, setCtaText] = useState(copy.cta || 'CLAIM $1000 BONUS NOW!');
  const [spinning, setSpinning] = useState(false)
  const [spinCount, setSpinCount] = useState(0)
  const [showJackpot, setShowJackpot] = useState(false)
  const [reels, setReels] = useState(['💎', '🍑', '🍑', '🍑', '🍑', '🔔', '⭐', '⭐', '🍇'])
  const [loading, setLoading] = useState(true)
  
  // Additional editable text items
  const [additionalTexts, setAdditionalTexts] = useState<EditableTextItem[]>([])
  const [headlinePosition, setHeadlinePosition] = useState<'top' | 'center' | 'bottom'>('top')
  const [brandPosition, setBrandPosition] = useState<'top' | 'center' | 'bottom'>('top')
  
  // Game section editable texts
  const [slotTitle, setSlotTitle] = useState('BONANZA BILLION')
  const [slotSubtitle, setSlotSubtitle] = useState('SLOTS')
  const [gameControlsTitle, setGameControlsTitle] = useState('GAME CONTROLS')
  const [betText, setBetText] = useState('BET: $10')
  const [balanceText, setBalanceText] = useState('BALANCE: $1,000')
  const [spinButtonText, setSpinButtonText] = useState('SPIN TO WIN')

  const symbols = ['🍑', '🍋', '🔔', '💎', '⭐', '🍀', '💰', '🍇']

  // Preloader effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2500)
    return () => clearTimeout(timer)
  }, [])

  // Check if in edit mode
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const inIframe = window.self !== window.top;
    const editParam = params.get('edit') === '1' || params.get('preview') === '1';
    setIsEditMode(inIframe && editParam);
  }, []);

  // Send changes to parent editor
  const notifyChange = (field: string, value: string) => {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'CONTENT_CHANGE', field, value }, '*');
    }
  };

  // Duplicate headline
  const duplicateHeadline = () => {
    const newText: EditableTextItem = {
      id: `text-${Date.now()}`,
      text: headlineText,
      position: 'center',
      styles: { fontSize: 24, fontWeight: 'bold', fontStyle: 'normal', textDecoration: 'none', textAlign: 'center', color: '#22d3ee' }
    }
    setAdditionalTexts([...additionalTexts, newText])
  }

  // Update additional text
  const updateAdditionalText = (id: string, text: string) => {
    setAdditionalTexts(additionalTexts.map(t => t.id === id ? { ...t, text } : t))
  }

  // Update additional text position
  const updateAdditionalTextPosition = (id: string, position: 'top' | 'center' | 'bottom') => {
    setAdditionalTexts(additionalTexts.map(t => t.id === id ? { ...t, position } : t))
  }

  // Duplicate additional text
  const duplicateAdditionalText = (id: string) => {
    const original = additionalTexts.find(t => t.id === id)
    if (original) {
      const newText: EditableTextItem = {
        id: `text-${Date.now()}`,
        text: original.text,
        position: original.position === 'top' ? 'center' : 'bottom',
        styles: { ...original.styles }
      }
      setAdditionalTexts([...additionalTexts, newText])
    }
  }

  // Delete additional text
  const deleteAdditionalText = (id: string) => {
    setAdditionalTexts(additionalTexts.filter(t => t.id !== id))
  }

  // Get position style
  const getPositionStyle = (position: 'top' | 'center' | 'bottom'): React.CSSProperties => {
    switch (position) {
      case 'top': return { top: '20px' }
      case 'center': return { top: '50%', transform: 'translateX(-50%) translateY(-50%)' }
      case 'bottom': return { bottom: '100px' }
    }
  }

  const spinReels = () => {
    if (spinning) return
    
    setSpinning(true)
    setSpinCount(prev => prev + 1)
    
    // Animate spinning for 3x3 grid
    const interval = setInterval(() => {
      const newReels = []
      for (let i = 0; i < 9; i++) {
        newReels.push(symbols[Math.floor(Math.random() * symbols.length)])
      }
      setReels(newReels)
    }, 100)
    
    setTimeout(() => {
      clearInterval(interval)
      
      // On second spin, guarantee jackpot (all 💰)
      if (spinCount >= 1) {
        setReels(['💰', '💰', '💰', '💰', '💰', '💰', '💰', '💰', '💰'])
        setTimeout(() => {
          setShowJackpot(true)
        }, 500)
      } else {
        // Random result for first spin
        const finalReels = []
        for (let i = 0; i < 9; i++) {
          finalReels.push(symbols[Math.floor(Math.random() * symbols.length)])
        }
        setReels(finalReels)
      }
      
      setSpinning(false)
    }, 2000)
  }

  // Show preloader
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="mb-8">
            {/* Mini Slot Machine Animation */}
            <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl p-4 border-3 border-yellow-400 shadow-2xl mx-auto w-fit">
              <div className="grid grid-cols-3 gap-1 bg-slate-800 p-2 rounded-lg">
                <div className="w-12 h-12 bg-gradient-to-b from-orange-400 to-yellow-500 rounded-lg flex items-center justify-center text-xl animate-spin">
                  🍑
                </div>
                <div className="w-12 h-12 bg-gradient-to-b from-orange-400 to-yellow-500 rounded-lg flex items-center justify-center text-xl animate-spin" style={{ animationDelay: '0.2s' }}>
                  💎
                </div>
                <div className="w-12 h-12 bg-gradient-to-b from-orange-400 to-yellow-500 rounded-lg flex items-center justify-center text-xl animate-spin" style={{ animationDelay: '0.4s' }}>
                  🔔
                </div>
                <div className="w-12 h-12 bg-gradient-to-b from-orange-400 to-yellow-500 rounded-lg flex items-center justify-center text-xl animate-spin" style={{ animationDelay: '0.1s' }}>
                  ⭐
                </div>
                <div className="w-12 h-12 bg-gradient-to-b from-orange-400 to-yellow-500 rounded-lg flex items-center justify-center text-xl animate-spin" style={{ animationDelay: '0.3s' }}>
                  🍀
                </div>
                <div className="w-12 h-12 bg-gradient-to-b from-orange-400 to-yellow-500 rounded-lg flex items-center justify-center text-xl animate-spin" style={{ animationDelay: '0.5s' }}>
                  🍇
                </div>
                <div className="w-12 h-12 bg-gradient-to-b from-orange-400 to-yellow-500 rounded-lg flex items-center justify-center text-xl animate-spin" style={{ animationDelay: '0.6s' }}>
                  💰
                </div>
                <div className="w-12 h-12 bg-gradient-to-b from-orange-400 to-yellow-500 rounded-lg flex items-center justify-center text-xl animate-spin" style={{ animationDelay: '0.4s' }}>
                  🍋
                </div>
                <div className="w-12 h-12 bg-gradient-to-b from-orange-400 to-yellow-500 rounded-lg flex items-center justify-center text-xl animate-spin" style={{ animationDelay: '0.2s' }}>
                  🍑
                </div>
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-black text-yellow-400 mb-4 animate-pulse">
            💎 BONANZA BILLION 💎
          </h1>
          <p className="text-cyan-300 text-xl font-bold">Loading your casino experience...</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen text-white relative overflow-hidden bg-black" 
      style={{
        '--brand-primary': colors.primary, 
        '--brand-secondary': colors.secondary, 
        '--brand-accent': colors.accent,
        backgroundImage: 'url(/images/backgroundbonanza.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      } as React.CSSProperties}
    >
      {/* Neon Text Styles */}
      <style jsx>{`
        .neon-text-yellow {
          text-shadow: 
            0 0 1px #ffd700,
            0 0 2px #ffd700,
            0 1px 0 rgba(0,0,0,0.3);
        }
        
        .neon-text-blue {
          text-shadow: 
            0 0 1px #00bfff,
            0 0 2px #00bfff,
            0 1px 0 rgba(0,0,0,0.3);
        }
        
        .jackpot-bounce {
          animation: jackpotBounce 1s ease-in-out;
        }
        
        @keyframes neonFlicker {
          0%, 100% {
            text-shadow: 
              0 0 1px currentColor,
              0 0 2px currentColor,
              0 1px 0 rgba(0,0,0,0.3);
          }
          50% {
            text-shadow: 
              0 0 1px currentColor,
              0 0 2px currentColor,
              0 1px 0 rgba(0,0,0,0.3);
          }
        }
        
        @keyframes jackpotBounce {
          0%, 20%, 53%, 80%, 100% {
            transform: translateY(0);
          }
          40%, 43% {
            transform: translateY(-30px);
          }
          70% {
            transform: translateY(-15px);
          }
        }
      `}</style>
      {/* Animated Background */}
      <div className="absolute inset-0">
      </div>

      {/* Header */}
      <div className="relative z-10 text-center py-8">
        {/* Casino Brand Logo - Perfect for iGaming Affiliates */}
        {logoUrl && (
          <div className="mb-8">
            <div className="bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-md rounded-3xl p-6 inline-block border-2 border-yellow-400/40 shadow-2xl hover:border-yellow-400/60 transition-all duration-300 hover:scale-105">
              <div className="bg-white/90 rounded-2xl p-4 shadow-inner">
                <img 
                  src={logoUrl} 
                  alt={`${brandName} Casino Logo`}
                  className="h-20 w-auto mx-auto drop-shadow-lg filter brightness-110"
                  style={{ maxWidth: '240px' }}
                />
              </div>
            </div>
            <div className="mt-3">
              <div className="inline-flex items-center px-4 py-1 bg-yellow-400/20 border border-yellow-400/30 rounded-full">
                <span className="text-yellow-300 text-xs font-bold tracking-wide">🎰 OFFICIAL PARTNER</span>
              </div>
            </div>
          </div>
        )}
        
        <h1 className="text-5xl font-black text-yellow-400 flex items-center justify-center gap-3 neon-text-yellow mb-6 drop-shadow-2xl">
          <span className="text-6xl">💎</span>
          <InlineEditableText
            value={brandName || 'BONANZA BILLION'}
            onChange={(val) => { notifyChange('brandName', val); }}
            onPositionChange={setBrandPosition}
            className="font-black text-yellow-400"
            placeholder="Brand name..."
            initialStyles={{ fontSize: 48, fontWeight: 'bold', fontStyle: 'normal', textDecoration: 'none', textAlign: 'center', color: '#facc15' }}
            showDuplicateButton={false}
          />
          <span className="text-6xl">💎</span>
        </h1>
        <div className="text-2xl font-bold text-cyan-300 flex items-center justify-center gap-2 neon-text-blue drop-shadow-lg">
          <span className="text-3xl">⭐</span>
          <InlineEditableText
            value={headlineText}
            onChange={(val) => { setHeadlineText(val); notifyChange('headline', val); }}
            onDuplicate={duplicateHeadline}
            onPositionChange={setHeadlinePosition}
            className="font-bold text-cyan-300"
            placeholder="Enter headline..."
            initialStyles={{ fontSize: 24, fontWeight: 'bold', fontStyle: 'normal', textDecoration: 'none', textAlign: 'center', color: '#22d3ee' }}
          />
          <span className="text-3xl">⭐</span>
        </div>
      </div>

      {/* Additional Texts - Duplicated items */}
      {additionalTexts.map((item) => (
        <div 
          key={item.id}
          className="absolute left-1/2 transform -translate-x-1/2 z-20"
          style={getPositionStyle(item.position)}
        >
          <InlineEditableText
            value={item.text}
            onChange={(val) => updateAdditionalText(item.id, val)}
            onDuplicate={() => duplicateAdditionalText(item.id)}
            onPositionChange={(pos) => updateAdditionalTextPosition(item.id, pos)}
            className="font-bold"
            placeholder="Enter text..."
            initialStyles={item.styles}
          />
        </div>
      ))}

      {/* Main Game Area */}
      <main className="relative z-10 px-4 py-8 flex justify-center gap-8 max-w-6xl mx-auto">
        
        {/* Slot Machine Container */}
        <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-3xl p-6 shadow-2xl" style={{ borderWidth: '4px', borderStyle: 'solid', borderColor: colors.primary || '#fbbf24' }}>
          <div className="text-center mb-6">
            <InlineEditableText
              value={slotTitle}
              onChange={(val) => { setSlotTitle(val); notifyChange('slotTitle', val); }}
              className="text-2xl font-black text-yellow-400 mb-1"
              placeholder="Slot title..."
              initialStyles={{ fontSize: 24, fontWeight: 'bold', fontStyle: 'normal', textDecoration: 'none', textAlign: 'center', color: '#facc15' }}
              showPositionControls={false}
              showDuplicateButton={false}
            />
            <InlineEditableText
              value={slotSubtitle}
              onChange={(val) => { setSlotSubtitle(val); notifyChange('slotSubtitle', val); }}
              className="text-xl font-bold text-yellow-400"
              placeholder="Subtitle..."
              initialStyles={{ fontSize: 20, fontWeight: 'bold', fontStyle: 'normal', textDecoration: 'none', textAlign: 'center', color: '#facc15' }}
              showPositionControls={false}
              showDuplicateButton={false}
            />
          </div>

          {/* 3x3 Slot Grid */}
          <div className="grid grid-cols-3 gap-2 bg-slate-800 p-4 rounded-xl" style={{ borderWidth: '2px', borderStyle: 'solid', borderColor: colors.secondary || '#06b6d4' }}>
            {reels.map((symbol, index) => (
              <div 
                key={index}
                className={`w-20 h-20 bg-gradient-to-b from-orange-400 to-yellow-500 rounded-xl flex items-center justify-center text-3xl shadow-lg transition-all duration-100 ${spinning ? 'animate-pulse' : ''}`}
                style={{ borderWidth: '1px', borderStyle: 'solid', borderColor: colors.accent || '#f59e0b' }}
              >
                {symbol}
              </div>
            ))}
          </div>
        </div>

        {/* Game Controls Panel */}
        <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-3xl p-6 shadow-2xl min-w-[280px]" style={{ borderWidth: '4px', borderStyle: 'solid', borderColor: colors.primary || '#fbbf24' }}>
          <div className="text-center mb-6">
            <InlineEditableText
              value={gameControlsTitle}
              onChange={(val) => { setGameControlsTitle(val); notifyChange('gameControlsTitle', val); }}
              className="text-2xl font-black text-yellow-400"
              placeholder="Controls title..."
              initialStyles={{ fontSize: 24, fontWeight: 'bold', fontStyle: 'normal', textDecoration: 'none', textAlign: 'center', color: '#facc15' }}
              showPositionControls={false}
              showDuplicateButton={false}
            />
          </div>

          {/* Bet Display */}
          <div className="bg-slate-700/80 rounded-xl p-4 mb-4 shadow-lg" style={{ borderWidth: '2px', borderStyle: 'solid', borderColor: colors.secondary || '#06b6d4' }}>
            <InlineEditableText
              value={betText}
              onChange={(val) => { setBetText(val); notifyChange('betText', val); }}
              className="text-yellow-400 font-bold text-center text-lg"
              placeholder="Bet amount..."
              initialStyles={{ fontSize: 18, fontWeight: 'bold', fontStyle: 'normal', textDecoration: 'none', textAlign: 'center', color: '#facc15' }}
              showPositionControls={false}
              showDuplicateButton={false}
            />
          </div>

          {/* Balance Display */}
          <div className="bg-slate-700/80 rounded-xl p-4 mb-6 shadow-lg" style={{ borderWidth: '2px', borderStyle: 'solid', borderColor: colors.secondary || '#06b6d4' }}>
            <InlineEditableText
              value={balanceText}
              onChange={(val) => { setBalanceText(val); notifyChange('balanceText', val); }}
              className="text-yellow-400 font-bold text-center text-lg"
              placeholder="Balance..."
              initialStyles={{ fontSize: 18, fontWeight: 'bold', fontStyle: 'normal', textDecoration: 'none', textAlign: 'center', color: '#facc15' }}
              showPositionControls={false}
              showDuplicateButton={false}
            />
          </div>

          {/* Spin Button */}
          <button 
            className="w-full text-white font-black text-xl py-4 rounded-full shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50"
            style={{ 
              background: `linear-gradient(to right, ${colors.primary || '#f97316'}, ${colors.accent || '#f59e0b'})`,
              borderWidth: '2px',
              borderStyle: 'solid',
              borderColor: colors.secondary || '#06b6d4'
            }}
            onClick={spinReels}
            disabled={spinning}
          >
            {spinning ? '🎰 SPINNING...' : (
              <InlineEditableText
                value={spinButtonText}
                onChange={(val) => { setSpinButtonText(val); notifyChange('spinButtonText', val); }}
                className="text-white font-black"
                placeholder="Button text..."
                initialStyles={{ fontSize: 20, fontWeight: 'bold', fontStyle: 'normal', textDecoration: 'none', textAlign: 'center', color: '#ffffff' }}
                showPositionControls={false}
                showDuplicateButton={false}
              />
            )}
          </button>
        </div>
      </main>

      {/* Bottom Disclaimer Section */}
      <div className="relative z-10 text-center py-8">
        <div className="mx-auto bg-gradient-to-r from-gray-800/90 to-gray-900/90 backdrop-blur-sm rounded-lg px-6 py-3 border border-gray-600/50 shadow-xl max-w-fit">
          <p className="text-yellow-300 text-sm font-semibold tracking-wide flex items-center justify-center gap-2">
            <span className="text-red-400 font-black">18+</span>
            <span className="text-gray-300">•</span>
            <span>Gamble Responsibly</span>
            <span className="text-gray-300">•</span>
            <span>Terms Apply</span>
          </p>
        </div>
      </div>
      {/* Jackpot Modal */}
      {showJackpot && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-8 rounded-2xl text-center shadow-2xl max-w-md mx-4 jackpot-bounce">
            <h2 className="text-3xl font-black text-black mb-4">🎉 JACKPOT! 🎉</h2>
            <p className="text-xl text-black mb-2">Congratulations! You hit the JACKPOT!</p>
            <p className="text-2xl font-bold text-black mb-6">$1,000 BONUS!</p>
            <div 
              className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-8 rounded-lg text-lg shadow-lg transform hover:scale-105 transition-all duration-200 mb-4 cursor-pointer"
            >
              <InlineEditableText
                value={ctaText}
                onChange={(val) => { setCtaText(val); notifyChange('cta', val); }}
                placeholder="Button text..."
                initialStyles={{ fontSize: 18, fontWeight: 'bold', fontStyle: 'normal', textDecoration: 'none', textAlign: 'center' }}
              />
            </div>
            <button 
              className="block mx-auto text-black/70 hover:text-black text-sm underline"
              onClick={() => setShowJackpot(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export function renderTemplate(brand: BrandConfig): { html: string; css: string } {
  const { brandName, logoUrl, colors, copy } = brand
  const { headline, subheadline, cta } = copy

  const css = `
    ${generateCSSVariables(colors)}
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', sans-serif;
      line-height: 1.6;
      color: #ffffff;
      background-image: url('/images/backgroundbonanza.png');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      background-attachment: fixed;
      min-height: 100vh;
      overflow-x: hidden;
    }
    
    .slot-machine {
      background: linear-gradient(to bottom, #d4af37, #b8860b);
      border-radius: 24px;
      padding: 2rem;
      box-shadow: 0 25px 50px rgba(0,0,0,0.5);
      border: 4px solid #ffd700;
      margin-bottom: 2rem;
    }
    
    .reel {
      width: 96px;
      height: 96px;
      background: white;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.5rem;
      border: 4px solid #ffd700;
      margin: 0 1rem;
    }
    
    .spin-btn {
      background: linear-gradient(to right, #dc2626, #b91c1c);
      color: white;
      font-weight: 900;
      font-size: 1.5rem;
      padding: 1rem 3rem;
      border-radius: 9999px;
      border: none;
      cursor: pointer;
      box-shadow: 0 10px 25px rgba(0,0,0,0.3);
      transition: all 0.2s;
    }
    
    .spin-btn:hover {
      transform: scale(1.05);
      background: linear-gradient(to right, #b91c1c, #991b1b);
    }
    
    .jackpot-bounce {
      animation: jackpotBounce 1s ease-in-out;
    }
    
    @keyframes jackpotBounce {
      0%, 20%, 53%, 80%, 100% {
        transform: translateY(0);
      }
      40%, 43% {
        transform: translateY(-30px);
      }
      70% {
        transform: translateY(-15px);
      }
    }
    
    .spin-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
    
    .animate-pulse { animation: pulse 2s infinite; }
  `

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${brandName || 'Bonanza Billion'} - ${headline || 'Spin & Win Big!'}</title>
  <style>${css}</style>
</head>
<body>
  <div style="min-height: 100vh; background: linear-gradient(135deg, #581c87, #312e81, #000000); color: white; position: relative; overflow: hidden;">
    
    <!-- Animated Background -->
    <div style="position: absolute; top: 80px; left: 80px; width: 128px; height: 128px; background: rgba(251, 191, 36, 0.2); border-radius: 50%; animation: pulse 3s infinite;"></div>
    <div style="position: absolute; top: 160px; right: 128px; width: 96px; height: 96px; background: rgba(236, 72, 153, 0.2); border-radius: 50%; animation: pulse 3s infinite; animation-delay: 1s;"></div>
    <div style="position: absolute; bottom: 128px; left: 160px; width: 112px; height: 112px; background: rgba(59, 130, 246, 0.2); border-radius: 50%; animation: pulse 3s infinite; animation-delay: 2s;"></div>
    <div style="position: absolute; bottom: 80px; right: 80px; width: 80px; height: 80px; background: rgba(34, 197, 94, 0.2); border-radius: 50%; animation: pulse 3s infinite; animation-delay: 3s;"></div>

    <!-- Header -->
    <header style="position: relative; z-index: 10; padding: 1.5rem 1rem; text-align: center;">
      <h1 style="font-size: 3rem; font-weight: 900; background: linear-gradient(to right, #fbbf24, #f59e0b, #dc2626); -webkit-background-clip: text; background-clip: text; color: transparent; margin-bottom: 0.5rem;">
        ${brandName || 'BONANZA BILLION'}
      </h1>
      <p style="font-size: 1.25rem; color: #fde047; font-weight: bold;">
        ${headline || 'Spin the Reels & Win Billion Dollar Jackpots!'}
      </p>
    </header>

    <!-- Main Slot Machine -->
    <main style="position: relative; z-index: 10; padding: 2rem 1rem;">
      <div style="max-width: 1024px; margin: 0 auto;">
        
        <!-- Slot Machine Container -->
        <div class="slot-machine">
          <div style="text-align: center; margin-bottom: 1.5rem;">
            <h2 style="font-size: 1.875rem; font-weight: 900; color: black; margin-bottom: 0.5rem;">BONANZA BILLION SLOTS</h2>
            <div style="display: flex; justify-content: center; gap: 0.5rem; font-size: 0.875rem; color: black;">
              <span style="background: #10b981; padding: 0.25rem 0.75rem; border-radius: 9999px; font-weight: bold;">LIVE</span>
              <span style="background: #dc2626; padding: 0.25rem 0.75rem; border-radius: 9999px; font-weight: bold; color: white;">HOT</span>
            </div>
          </div>

          <!-- Slot Reels -->
          <div style="background: black; border-radius: 16px; padding: 1.5rem; margin-bottom: 1.5rem;">
            <div style="display: flex; justify-content: center; gap: 1rem; margin-bottom: 1.5rem;">
              <div class="reel">💎</div>
              <div class="reel">🍒</div>
              <div class="reel">🔔</div>
            </div>

            <!-- Spin Button -->
            <div style="text-align: center;">
              <button class="spin-btn" onclick="spinReels()">
                SPIN TO WIN! 🎰
              </button>
              <p style="color: #fde047; font-size: 0.875rem; margin-top: 0.5rem;">
                First spin is FREE!
              </p>
            </div>
          </div>

          <!-- Game Controls -->
          <div style="text-align: center;">
            <h3 style="font-size: 1.25rem; font-weight: bold; color: black; margin-bottom: 1rem;">GAME CONTROLS</h3>
            <div style="display: flex; justify-content: center; gap: 1rem; color: black; flex-wrap: wrap;">
              <div style="background: #10b981; padding: 0.5rem 1rem; border-radius: 8px; font-weight: bold;">BET: $1</div>
              <div style="background: #3b82f6; padding: 0.5rem 1rem; border-radius: 8px; font-weight: bold; color: white;">LINES: 25</div>
              <div style="background: #8b5cf6; padding: 0.5rem 1rem; border-radius: 8px; font-weight: bold; color: white;">MAX BET</div>
            </div>
          </div>
        </div>

        <!-- Features -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
          <div style="background: linear-gradient(135deg, #d97706, #ea580c); border-radius: 12px; padding: 1.5rem; text-align: center; color: black;">
            <div style="font-size: 1.875rem; margin-bottom: 0.5rem;">💰</div>
            <h3 style="font-weight: 900; font-size: 1.125rem; margin-bottom: 0.5rem;">MEGA JACKPOTS</h3>
            <p style="font-size: 0.875rem;">Win up to $1 Billion!</p>
          </div>
          <div style="background: linear-gradient(135deg, #059669, #047857); border-radius: 12px; padding: 1.5rem; text-align: center; color: white;">
            <div style="font-size: 1.875rem; margin-bottom: 0.5rem;">🎁</div>
            <h3 style="font-weight: 900; font-size: 1.125rem; margin-bottom: 0.5rem;">FREE SPINS</h3>
            <p style="font-size: 0.875rem;">100+ Free Spins Daily</p>
          </div>
          <div style="background: linear-gradient(135deg, #7c3aed, #c026d3); border-radius: 12px; padding: 1.5rem; text-align: center; color: white;">
            <div style="font-size: 1.875rem; margin-bottom: 0.5rem;">⚡</div>
            <h3 style="font-weight: 900; font-size: 1.125rem; margin-bottom: 0.5rem;">INSTANT WIN</h3>
            <p style="font-size: 0.875rem;">Play & Win Instantly</p>
          </div>
        </div>

        <!-- CTA Section -->
        <div style="text-align: center;">
          <button 
            style="background: linear-gradient(to right, #10b981, #047857); color: white; font-weight: 900; font-size: 1.25rem; padding: 1rem 2rem; border-radius: 9999px; border: none; cursor: pointer; box-shadow: 0 10px 25px rgba(0,0,0,0.3); transition: all 0.2s; transform: scale(1);"
            onclick="window.open('${brand.ctaUrl || 'https://example.com'}', '_blank')"
            onmouseover="this.style.transform='scale(1.05)'"
            onmouseout="this.style.transform='scale(1)'"
          >
            ${cta || '🎁 CLAIM $1000 BONUS NOW!'}
          </button>
          <p style="color: #9ca3af; font-size: 0.875rem; margin-top: 1rem;">
            18+ Only. Gamble Responsibly. Terms Apply.
          </p>
        </div>
      </div>
    </main>
  </div>

  <script>
    let spinning = false;
    let spinCount = 0;
    const symbols = ['🍒', '🍋', '🔔', '💎', '⭐', '🍀', '💰', '🎰'];
    
    function spinReels() {
      if (spinning) return;
      
      spinning = true;
      spinCount++;
      
      const reels = document.querySelectorAll('.reel');
      const spinBtn = document.querySelector('.spin-btn');
      
      spinBtn.textContent = 'SPINNING...';
      spinBtn.disabled = true;
      
      // Animate spinning
      const interval = setInterval(() => {
        reels.forEach(reel => {
          reel.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        });
      }, 100);

      setTimeout(() => {
        clearInterval(interval);
        
        // On second spin, guarantee jackpot
        if (spinCount >= 2) {
          reels.forEach(reel => {
            reel.textContent = '💰';
          });
        } else {
          // Random result for first spin
          reels.forEach(reel => {
            reel.textContent = symbols[Math.floor(Math.random() * symbols.length)];
          });
        }
        
        spinning = false;
        spinBtn.textContent = 'SPIN TO WIN! 🎰';
        spinBtn.disabled = false;
        
        // Update spin counter
        const spinText = document.querySelector('.spin-btn + p');
        if (spinCount === 1) {
          spinText.textContent = 'One more spin for JACKPOT!';
        } else {
          spinText.textContent = 'Spins: ' + spinCount;
        }
      }, 2000);
    }
  </script>
</body>
</html>`

  return {
    html,
    css
  }
}
