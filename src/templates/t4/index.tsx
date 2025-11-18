'use client'

import React, { useState } from 'react'
import { BrandConfig, TemplateProps } from '../../lib/types'
import { generateCSSVariables } from '@/lib/colors'

export function Template4({ brand }: TemplateProps) {
  const { brandName, logoUrl, colors, copy } = brand
  const { headline, subheadline, cta } = copy
  
  const [spinning, setSpinning] = useState(false)
  const [spinCount, setSpinCount] = useState(0)
  const [showJackpot, setShowJackpot] = useState(false)
  const [reels, setReels] = useState(['🍒', '🍋', '🔔'])

  const symbols = ['🍒', '🍋', '🔔', '💎', '⭐', '🍀', '💰', '🎰']

  const spinReels = () => {
    if (spinning) return
    
    setSpinning(true)
    setSpinCount(prev => prev + 1)
    
    // Animate spinning
    const interval = setInterval(() => {
      setReels([
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)]
      ])
    }, 100)

    setTimeout(() => {
      clearInterval(interval)
      
      // On second spin, guarantee jackpot
      if (spinCount >= 1) {
        setReels(['💰', '💰', '💰'])
        setTimeout(() => {
          setShowJackpot(true)
        }, 500)
      } else {
        // Random result for first spin
        setReels([
          symbols[Math.floor(Math.random() * symbols.length)],
          symbols[Math.floor(Math.random() * symbols.length)],
          symbols[Math.floor(Math.random() * symbols.length)]
        ])
      }
      
      setSpinning(false)
    }, 2000)
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-black text-white relative overflow-hidden"
      style={{
        '--brand-primary': colors.primary,
        '--brand-secondary': colors.secondary,
        '--brand-accent': colors.accent,
      } as React.CSSProperties}
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
      </div>

      {/* Header */}
      <header className="relative z-10 px-4 py-6 text-center">
        <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent mb-2">
          {brandName || 'BONANZA BILLION'}
        </h1>
        <p className="text-xl text-yellow-300 font-bold">
          {headline || 'Spin the Reels & Win Billion Dollar Jackpots!'}
        </p>
      </header>

      {/* Main Slot Machine */}
      <main className="relative z-10 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Slot Machine Container */}
          <div className="bg-gradient-to-b from-yellow-600 to-yellow-800 rounded-3xl p-8 shadow-2xl border-4 border-yellow-400 mb-8">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-black text-black mb-2">BONANZA BILLION SLOTS</h2>
              <div className="flex justify-center gap-2 text-sm text-black">
                <span className="bg-green-500 px-3 py-1 rounded-full font-bold">LIVE</span>
                <span className="bg-red-500 px-3 py-1 rounded-full font-bold text-white">HOT</span>
              </div>
            </div>

            {/* Slot Reels */}
            <div className="bg-black rounded-2xl p-6 mb-6">
              <div className="flex justify-center gap-4 mb-6">
                {reels.map((symbol, index) => (
                  <div 
                    key={index}
                    className={`w-24 h-24 bg-white rounded-lg flex items-center justify-center text-4xl border-4 border-yellow-400 ${spinning ? 'animate-spin' : ''}`}
                  >
                    {symbol}
                  </div>
                ))}
              </div>

              {/* Spin Button */}
              <div className="text-center">
                <button
                  onClick={spinReels}
                  disabled={spinning}
                  className={`bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-black text-2xl px-12 py-4 rounded-full shadow-lg transform transition-all duration-200 ${spinning ? 'animate-pulse' : 'hover:scale-105'}`}
                >
                  {spinning ? 'SPINNING...' : 'SPIN TO WIN! 🎰'}
                </button>
                <p className="text-yellow-300 text-sm mt-2">
                  {spinCount === 0 ? 'First spin is FREE!' : `Spins: ${spinCount}`}
                </p>
              </div>
            </div>

            {/* Game Controls */}
            <div className="text-center">
              <h3 className="text-xl font-bold text-black mb-4">GAME CONTROLS</h3>
              <div className="flex justify-center gap-4 text-black">
                <div className="bg-green-500 px-4 py-2 rounded-lg font-bold">BET: $1</div>
                <div className="bg-blue-500 px-4 py-2 rounded-lg font-bold text-white">LINES: 25</div>
                <div className="bg-purple-500 px-4 py-2 rounded-lg font-bold text-white">MAX BET</div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-yellow-600 to-orange-600 rounded-xl p-6 text-center text-black">
              <div className="text-3xl mb-2">💰</div>
              <h3 className="font-black text-lg mb-2">MEGA JACKPOTS</h3>
              <p className="text-sm">Win up to $1 Billion!</p>
            </div>
            <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl p-6 text-center text-white">
              <div className="text-3xl mb-2">🎁</div>
              <h3 className="font-black text-lg mb-2">FREE SPINS</h3>
              <p className="text-sm">100+ Free Spins Daily</p>
            </div>
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6 text-center text-white">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="font-black text-lg mb-2">INSTANT WIN</h3>
              <p className="text-sm">Play & Win Instantly</p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <button 
              className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-black text-xl px-8 py-4 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
              onClick={() => brand.ctaUrl && window.open(brand.ctaUrl, '_blank')}
            >
              {cta || '🎁 CLAIM $1000 BONUS NOW!'}
            </button>
            <p className="text-gray-400 text-sm mt-4">
              18+ Only. Gamble Responsibly. Terms Apply.
            </p>
          </div>
        </div>
      </main>

      {/* Jackpot Modal */}
      {showJackpot && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-8 rounded-2xl text-center shadow-2xl max-w-md mx-4 animate-bounce">
            <h2 className="text-3xl font-black text-black mb-4">🎉 JACKPOT! 🎉</h2>
            <p className="text-xl text-black mb-2">Congratulations! You hit the JACKPOT!</p>
            <p className="text-2xl font-bold text-black mb-6">$1,000 BONUS!</p>
            <button 
              className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-8 rounded-lg text-lg shadow-lg transform hover:scale-105 transition-all duration-200 mb-4"
              onClick={() => brand.ctaUrl && window.open(brand.ctaUrl, '_blank')}
            >
              🎁 CLAIM $1000 BONUS NOW!
            </button>
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
      background: linear-gradient(135deg, #1a0033 0%, #000000 100%);
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
    
    .spin-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    
    .jackpot-modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    
    .jackpot-content {
      background: linear-gradient(135deg, #fbbf24, #f59e0b);
      padding: 2rem;
      border-radius: 16px;
      text-align: center;
      box-shadow: 0 25px 50px rgba(0,0,0,0.5);
      max-width: 400px;
      margin: 1rem;
      animation: bounce 1s infinite;
    }
    
    @keyframes bounce {
      0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
      40%, 43% { transform: translateY(-10px); }
      70% { transform: translateY(-5px); }
      90% { transform: translateY(-2px); }
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
    
    .animate-pulse { animation: pulse 2s infinite; }
    .animate-bounce { animation: bounce 1s infinite; }
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
              <div class="reel">🍒</div>
              <div class="reel">🍋</div>
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

    <!-- Jackpot Modal (hidden by default) -->
    <div id="jackpotModal" class="jackpot-modal" style="display: none;">
      <div class="jackpot-content">
        <h2 style="font-size: 1.875rem; font-weight: 900; color: black; margin-bottom: 1rem;">🎉 JACKPOT! 🎉</h2>
        <p style="font-size: 1.25rem; color: black; margin-bottom: 0.5rem;">Congratulations! You hit the JACKPOT!</p>
        <p style="font-size: 1.5rem; font-weight: bold; color: black; margin-bottom: 1.5rem;">$1,000 BONUS!</p>
        <button 
          style="background: #16a34a; color: white; font-weight: bold; padding: 0.75rem 2rem; border-radius: 8px; font-size: 1.125rem; border: none; cursor: pointer; box-shadow: 0 10px 25px rgba(0,0,0,0.3); margin-bottom: 1rem; transition: all 0.2s;"
          onclick="window.open('${brand.ctaUrl || 'https://example.com'}', '_blank')"
          onmouseover="this.style.transform='scale(1.05)'"
          onmouseout="this.style.transform='scale(1)'"
        >
          🎁 CLAIM $1000 BONUS NOW!
        </button>
        <button 
          style="display: block; margin: 0 auto; color: rgba(0,0,0,0.7); font-size: 0.875rem; text-decoration: underline; background: none; border: none; cursor: pointer;"
          onclick="document.getElementById('jackpotModal').style.display='none'"
        >
          Close
        </button>
      </div>
    </div>
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
          setTimeout(() => {
            document.getElementById('jackpotModal').style.display = 'flex';
          }, 500);
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
