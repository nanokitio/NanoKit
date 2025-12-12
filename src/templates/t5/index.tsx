'use client'

import React, { useState } from 'react'
import { BrandConfig, TemplateRenderResult } from '@/lib/types'
import { generateCSSVariables } from '@/lib/colors'
import { InlineEditableText } from '@/components/InlineEditableText'

interface Template5Props {
  brand: BrandConfig
}

export function Template5({ brand }: Template5Props) {
  const [headline, setHeadline] = useState(brand.copy.headline);
  const [subheadline, setSubheadline] = useState(brand.copy.subheadline);

  const notifyChange = (field: string, value: string) => {
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'CONTENT_CHANGE', field, value }, '*');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black relative overflow-hidden">
      {/* Header */}
      <header className="relative z-10 text-center py-8 px-4">
        <div className="flex items-center justify-center mb-4">
          {brand.logoUrl && (
            <img
              src={brand.logoUrl}
              alt={brand.brandName}
              className="h-12 w-auto mr-4 filter drop-shadow-lg"
            />
          )}
          <h1 className="text-4xl font-bold text-yellow-400 font-mono tracking-wider">
            🏆 {brand.brandName} 🏆
          </h1>
        </div>
        <div className="text-2xl font-bold text-white mb-2 font-mono">
          <InlineEditableText
            value={headline}
            onChange={(val) => { setHeadline(val); notifyChange('headline', val); }}
            className="text-white"
            placeholder="Enter headline..."
            initialStyles={{ fontSize: 24, fontWeight: 'bold', fontStyle: 'normal', textDecoration: 'none', textAlign: 'center' }}
          />
        </div>
        <div className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
          <InlineEditableText
            value={subheadline}
            onChange={(val) => { setSubheadline(val); notifyChange('subheadline', val); }}
            className="text-gray-300"
            placeholder="Enter subheadline..."
            initialStyles={{ fontSize: 18, fontWeight: 'normal', fontStyle: 'normal', textDecoration: 'none', textAlign: 'center' }}
          />
        </div>
        
        {/* Bonus Timer */}
        <div className="inline-flex items-center bg-red-600 text-white px-4 py-2 rounded-full font-bold animate-pulse">
          <span className="mr-2">⏰</span>
          <span>Bonus expires: 5:55</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Slot Machine */}
        <div className="bg-gradient-to-b from-yellow-600 to-yellow-800 rounded-3xl p-8 mb-8 shadow-2xl border-4 border-yellow-400">
          {/* Prize Display */}
          <div className="flex justify-center space-x-8 mb-6">
            <div className="text-center bg-green-600 rounded-lg p-4 border-2 border-green-400">
              <div className="text-2xl mb-2">🎁</div>
              <div className="text-white font-bold">
                WIN<br />$5,000
              </div>
            </div>
            <div className="text-center bg-purple-600 rounded-lg p-4 border-2 border-purple-400">
              <div className="text-2xl mb-2">💎</div>
              <div className="text-white font-bold">
                MIN<br />$1,000
              </div>
            </div>
          </div>

          {/* Slot Game */}
          <div className="bg-black rounded-2xl p-6 mb-6">
            {/* Slot Lines */}
            <div className="space-y-4 mb-6">
              {[1, 2, 3].map((line) => (
                <div key={line} className="flex justify-center space-x-4">
                  {[1, 2, 3].map((symbol) => (
                    <div
                      key={symbol}
                      className="w-16 h-16 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center border-2 border-yellow-300 shadow-lg"
                    >
                      <div className="text-2xl">
                        {symbol === 1 ? '🍒' : symbol === 2 ? '💎' : '🎰'}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Spin Button */}
            <div className="cta-section text-center">
              <button 
                className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-black text-xl py-4 px-8 rounded-xl border-2 border-yellow-400 shadow-lg transform hover:scale-105 transition-all duration-200"
                onClick={() => brand.ctaUrl && window.open(brand.ctaUrl, '_blank')}
              >
                {brand.copy.cta}
              </button>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="text-center bg-black bg-opacity-50 rounded-lg p-6 border border-yellow-400">
            <div className="text-3xl mb-2">💎</div>
            <div className="text-yellow-400 font-bold">Instant Payouts</div>
          </div>
          <div className="text-center bg-black bg-opacity-50 rounded-lg p-6 border border-yellow-400">
            <div className="text-3xl mb-2">🎁</div>
            <div className="text-yellow-400 font-bold">Welcome Bonus</div>
          </div>
          <div className="text-center bg-black bg-opacity-50 rounded-lg p-6 border border-yellow-400">
            <div className="text-3xl mb-2">🏆</div>
            <div className="text-yellow-400 font-bold">24/7 Support</div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <button className="bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-accent)] hover:opacity-90 text-white font-bold py-6 px-12 rounded-full text-2xl shadow-2xl transform hover:scale-105 transition-all duration-200 border-4 border-yellow-400 mb-4">
            🏆 {brand.copy.cta} 🏆
          </button>
          <p className="text-gray-400 text-sm">
            18+ only. Gamble Responsibly. Terms & Conditions Apply.
          </p>
        </div>
      </main>
    </div>
  )
}

export function renderTemplate(brand: BrandConfig): TemplateRenderResult {
  const css = `
    ${generateCSSVariables(brand.colors)}
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Orbitron', 'Courier New', monospace;
      line-height: 1.6;
      color: #ffffff;
      background: linear-gradient(145deg, #1a0f08, #2c1810);
      min-height: 100vh;
      overflow-x: hidden;
    }
    
    .casino-container {
      min-height: 100vh;
      background: linear-gradient(145deg, #1a0f08, #2c1810);
      position: relative;
      overflow: hidden;
    }
    
    .casino-header {
      text-align: center;
      padding: 2rem 1rem;
      position: relative;
      z-index: 10;
    }
    
    .casino-title {
      font-size: 3rem;
      font-weight: 900;
      color: #ffd700;
      text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.8);
      margin-bottom: 1rem;
      animation: glow 2s ease-in-out infinite alternate;
    }
    
    @keyframes glow {
      from { text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.8), 0 0 20px #ffd700; }
      to { text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.8), 0 0 30px #ffd700, 0 0 40px #ffd700; }
    }
    
    .casino-subtitle {
      font-size: 1.2rem;
      color: #ffffff;
      margin-bottom: 1.5rem;
    }
    
    .bonus-timer {
      display: inline-flex;
      align-items: center;
      background: linear-gradient(45deg, #ff4444, #cc0000);
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 25px;
      font-weight: bold;
      animation: pulse 1.5s infinite;
      border: 2px solid #ffd700;
    }
    
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
    
    .slot-machine {
      max-width: 600px;
      margin: 2rem auto;
      background: linear-gradient(145deg, #ffd700, #ffb347);
      border-radius: 20px;
      padding: 2rem;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      border: 4px solid #ffd700;
      position: relative;
      z-index: 10;
    }
    
    .prize-display {
      display: flex;
      justify-content: center;
      gap: 2rem;
      margin-bottom: 2rem;
    }
    
    .prize-item {
      background: linear-gradient(45deg, #4ade80, #16a34a);
      border-radius: 10px;
      padding: 1rem;
      text-align: center;
      color: white;
      font-weight: bold;
      border: 2px solid #22c55e;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    }
    
    .slot-game {
      background: #000000;
      border-radius: 15px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }
    
    .rollover-line {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    
    .rollover-symbol {
      width: 60px;
      height: 60px;
      background: linear-gradient(145deg, #ffd700, #ffb347);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid #ffd700;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
      font-size: 1.5rem;
    }
    
    .spin-button {
      background: linear-gradient(45deg, #ef4444, #dc2626);
      color: white;
      border: none;
      padding: 1rem 2rem;
      border-radius: 25px;
      font-size: 1.2rem;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 3px solid #ffd700;
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
      display: block;
      margin: 0 auto;
    }
    
    .spin-button:hover {
      transform: scale(1.05);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
    }
    
    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin: 2rem auto;
      max-width: 800px;
      padding: 0 1rem;
    }
    
    .feature-item {
      background: rgba(0, 0, 0, 0.7);
      border: 2px solid #ffd700;
      border-radius: 10px;
      padding: 1.5rem;
      text-align: center;
      color: #ffd700;
      font-weight: bold;
    }
    
    .feature-icon {
      font-size: 2rem;
      display: block;
      margin-bottom: 0.5rem;
    }
    
    .cta-section {
      text-align: center;
      padding: 2rem 1rem;
      position: relative;
      z-index: 10;
    }
    
    .cta-button {
      background: linear-gradient(45deg, var(--brand-primary), var(--brand-accent));
      color: white;
      border: none;
      padding: 1.5rem 3rem;
      border-radius: 30px;
      font-size: 1.5rem;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 4px solid #ffd700;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
      margin-bottom: 1rem;
      display: block;
      margin-left: auto;
      margin-right: auto;
    }
    
    .cta-button:hover {
      transform: scale(1.05);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4);
    }
    
    .disclaimer {
      color: #888;
      font-size: 0.9rem;
      margin-top: 1rem;
    }
    
    @media (max-width: 768px) {
      .casino-title {
        font-size: 2rem;
      }
      
      .slot-machine {
        margin: 1rem;
        padding: 1rem;
      }
      
      .prize-display {
        flex-direction: column;
        gap: 1rem;
      }
      
      .rollover-symbol {
        width: 50px;
        height: 50px;
        font-size: 1.2rem;
      }
      
      .features {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
    }
  `

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${brand.brandName} - ${brand.copy.headline}</title>
      <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet">
      <style>${css}</style>
    </head>
    <body>
      <div class="casino-container">
        <!-- Header -->
        <header class="casino-header">
          <h1 class="casino-title">
            🏆 ${brand.brandName} 🏆
          </h1>
          <h2 style="font-size: 1.8rem; color: white; margin-bottom: 1rem;">${brand.copy.headline}</h2>
          <p class="casino-subtitle">${brand.copy.subheadline}</p>
          
          <!-- Bonus Timer -->
          <div class="bonus-timer">
            <span style="margin-right: 0.5rem;">⏰</span>
            <span>Bonus expires: 5:55</span>
          </div>
        </header>

        <!-- Slot Machine Container -->
        <div class="slot-machine">
          <!-- Prize Display -->
          <div class="prize-display">
            <div class="prize-item">
              <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">🎁</div>
              <div>WIN<br>$5,000</div>
            </div>
            <div class="prize-item">
              <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">💎</div>
              <div>MIN<br>$1,000</div>
            </div>
          </div>

          <!-- Slot Game -->
          <div class="slot-game">
            <!-- Line 1 -->
            <div class="rollover-line">
              <div class="rollover-symbol">🍒</div>
              <div class="rollover-symbol">💎</div>
              <div class="rollover-symbol">🎰</div>
            </div>

            <!-- Line 2 -->
            <div class="rollover-line">
              <div class="rollover-symbol">🎰</div>
              <div class="rollover-symbol">🍒</div>
              <div class="rollover-symbol">💎</div>
            </div>

            <!-- Line 3 -->
            <div class="rollover-line">
              <div class="rollover-symbol">💎</div>
              <div class="rollover-symbol">🎰</div>
              <div class="rollover-symbol">🍒</div>
            </div>

            <!-- Spin Button -->
            <div class="cta-section text-center">
              <button 
                className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-black text-xl py-4 px-8 rounded-xl border-2 border-yellow-400 shadow-lg transform hover:scale-105 transition-all duration-200"
                onclick="window.open('${brand.ctaUrl || 'https://example.com'}', '_blank')"
              >
                {brand.copy.cta}
              </button>
            </div>
          </div>
        </div>

        <!-- Features Section -->
        <div class="features">
          <div class="feature-item">
            <span class="feature-icon">💎</span>
            <span>Instant Payouts</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">🎁</span>
            <span>Welcome Bonus</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">🏆</span>
            <span>24/7 Support</span>
          </div>
        </div>

        <!-- Call to Action -->
        <div class="cta-section">
          <button className="cta-button" onclick="window.open('${brand.ctaUrl || 'https://example.com'}', '_blank')">{brand.copy.cta}</button>
          <p class="disclaimer">18+ only. Gamble Responsibly. Terms & Conditions Apply.</p>
        </div>
      </div>
    </body>
  </html>
  `

  return { html, css }
}
