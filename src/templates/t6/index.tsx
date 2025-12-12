'use client'

import React from 'react'
import { BrandConfig } from '@/lib/types'
import { EditableText } from '@/components/EditableText'
import { useInlineEdit } from '@/hooks/useInlineEdit'

interface Template6Props {
  brand: BrandConfig
}

export function Template6({ brand }: Template6Props) {
  const { isEditMode, notifyChange } = useInlineEdit()
  const [spinCount, setSpinCount] = React.useState(0);
  const [showWinModal, setShowWinModal] = React.useState(false);
  const [isSpinning, setIsSpinning] = React.useState(false);
  const [headline, setHeadline] = React.useState(brand.copy.headline || `${brand.brandName.toUpperCase()} CYBER WINS`);
  const [subheadline, setSubheadline] = React.useState(brand.copy.subheadline || 'Enter the neon grid where digital fortunes await');
  const [ctaText, setCtaText] = React.useState(brand.copy.cta || 'ENTER THE GRID');

  const symbols = ['◆', '▲', '●', '★', '◇', '▼'];

  const handleSpin = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setSpinCount(prev => prev + 1);
    
    // Animate the spin for 2 seconds
    setTimeout(() => {
      setIsSpinning(false);
      
      // Show win modal on second attempt
      if (spinCount + 1 === 2) {
        setTimeout(() => {
          setShowWinModal(true);
        }, 500);
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black font-mono relative overflow-hidden synth-container">
      {/* Synth 90s Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-black to-cyan-900/90"></div>
      
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="synth-grid"></div>
      </div>
      
      {/* Neon Scan Lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="scan-lines"></div>
      </div>

      {/* Main Container */}
      <div className="container relative z-10 min-h-screen flex flex-col justify-center items-center px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8 retro-header">
          {/* Casino Brand Logo - Perfect for iGaming Affiliates */}
          {brand.logoUrl && (
            <div className="mb-8 animate-float-logo">
              <div className="bg-gradient-to-br from-cyan-500/20 via-purple-500/15 to-pink-500/20 backdrop-blur-md rounded-3xl p-6 inline-block border-2 border-cyan-400/50 shadow-2xl hover:border-cyan-400/80 transition-all duration-300 hover:scale-105 synth-logo-container">
                <div className="bg-white/95 rounded-2xl p-4 shadow-inner">
                  <img 
                    src={brand.logoUrl} 
                    alt={`${brand.brandName} Casino Logo`}
                    className="h-20 w-auto mx-auto drop-shadow-lg filter brightness-110 max-w-[280px]"
                  />
                </div>
              </div>
              <div className="mt-3">
                <div className="inline-flex items-center px-4 py-1 bg-gradient-to-r from-cyan-500/20 to-pink-500/20 border border-cyan-400/40 rounded-full backdrop-blur-sm">
                  <span className="text-cyan-300 text-xs font-bold tracking-wide font-mono">🎰 OFFICIAL CYBER PARTNER</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="synth-title-container mb-6">
            <EditableText
              value={headline}
              onChange={(val: string) => {
                setHeadline(val)
                notifyChange('headline', val)
              }}
              as="h1"
              className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-400 to-yellow-400 mb-4 synth-glow animate-text-shimmer tracking-wider"
              placeholder="YOUR TITLE HERE"
            />
            <div className="synth-underline"></div>
          </div>
          <EditableText
            value={subheadline}
            onChange={(val: string) => {
              setSubheadline(val)
              notifyChange('subheadline', val)
            }}
            as="p"
            className="text-lg md:text-xl text-cyan-100 mb-6 font-light tracking-wide retro-text"
            placeholder="Enter your subtitle..."
          />
          
          {/* Retro Timer */}
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-500/20 to-cyan-500/20 backdrop-blur-sm border border-pink-400/50 text-pink-300 px-6 py-3 rounded-lg font-mono text-sm synth-border animate-border-pulse">
            <span className="text-yellow-400 animate-pulse">▲</span>
            <span className="tracking-widest">BONUS EXPIRES: 05:55</span>
            <span className="text-yellow-400 animate-pulse">▲</span>
          </div>
        </header>

        {/* Synth Slot Machine Container */}
        <div className="slot-machine bg-gradient-to-br from-purple-900/30 to-cyan-900/30 backdrop-blur-sm border-2 border-cyan-400/50 rounded-2xl p-8 mb-8 shadow-2xl relative synth-machine">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-pink-400/5 rounded-2xl animate-pulse-slow"></div>
          <div className="absolute inset-0 synth-border-glow rounded-2xl"></div>
          
          {/* Retro Prize Display */}
          <div className="prize-display flex justify-center gap-6 mb-8">
            <div className="prize-item bg-gradient-to-br from-green-400/20 to-cyan-400/20 border border-green-400/60 rounded-lg p-4 text-center backdrop-blur-sm synth-prize animate-prize-glow-1">
              <div className="text-2xl mb-2 text-green-400">◆</div>
              <div className="text-green-300 font-mono text-sm tracking-wider">MAX WIN<br />$5,000</div>
            </div>
            <div className="prize-item bg-gradient-to-br from-purple-400/20 to-pink-400/20 border border-purple-400/60 rounded-lg p-4 text-center backdrop-blur-sm synth-prize animate-prize-glow-2">
              <div className="text-2xl mb-2 text-purple-400">★</div>
              <div className="text-purple-300 font-mono text-sm tracking-wider">MIN WIN<br />$1,000</div>
            </div>
          </div>

          {/* Retro Slot Game */}
          <div className="slot-game bg-black/80 backdrop-blur-sm rounded-xl p-6 border border-cyan-400/30">
            {/* Synth Slot Machine Lines */}
            <div className="slot-lines space-y-3 mb-6">
              {[0, 1, 2].map((lineIndex) => (
                <div key={lineIndex} className="rollover-line flex justify-center gap-3 p-3 bg-gradient-to-r from-purple-900/20 to-cyan-900/20 rounded-lg border border-pink-400/30">
                  {[0, 1, 2].map((symbolIndex) => {
                    const currentSymbol = spinCount >= 2 ? '★' : symbols[Math.floor(Math.random() * symbols.length)];
                    return (
                      <div
                        key={symbolIndex}
                        className={`rollover-symbol w-20 h-20 bg-gradient-to-br from-cyan-900/50 to-purple-900/50 border-2 border-cyan-400/60 rounded-lg flex items-center justify-center backdrop-blur-sm transition-all duration-300 synth-symbol ${
                          isSpinning ? 'animate-synth-spin' : 'animate-symbol-glow'
                        }`}
                      >
                        <div className="rollover-icon text-2xl text-cyan-300 font-bold">
                          {isSpinning ? symbols[Math.floor(Math.random() * symbols.length)] : currentSymbol}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Synth Spin Button */}
            <button 
              onClick={handleSpin}
              disabled={isSpinning}
              className={`spin-button w-full bg-gradient-to-r from-pink-500/80 to-cyan-500/80 hover:from-pink-400/90 hover:to-cyan-400/90 text-white font-mono font-black text-xl py-4 px-8 rounded-lg border-2 border-pink-400/60 shadow-lg backdrop-blur-sm transform hover:scale-105 transition-all duration-300 synth-button ${
                isSpinning ? 'opacity-50 cursor-not-allowed animate-pulse-fast' : 'animate-button-glow'
              }`}
            >
              <span className="tracking-widest">
                {isSpinning ? '◆ PROCESSING ◆' : '▲ EXECUTE SPIN ▲'}
              </span>
            </button>
          </div>
        </div>

        {/* Synth Features Section */}
        <div className="features flex flex-wrap justify-center gap-6 mb-8">
          <div className="feature-item bg-gradient-to-br from-cyan-900/30 to-purple-900/30 backdrop-blur-sm border border-cyan-400/50 rounded-lg p-4 text-center min-w-[140px] synth-feature animate-feature-glow-1">
            <div className="text-2xl mb-2 text-cyan-400">◆</div>
            <div className="text-cyan-300 font-mono text-sm tracking-wide">INSTANT<br />PAYOUTS</div>
          </div>
          <div className="feature-item bg-gradient-to-br from-pink-900/30 to-purple-900/30 backdrop-blur-sm border border-pink-400/50 rounded-lg p-4 text-center min-w-[140px] synth-feature animate-feature-glow-2">
            <div className="text-2xl mb-2 text-pink-400">▲</div>
            <div className="text-pink-300 font-mono text-sm tracking-wide">WELCOME<br />BONUS</div>
          </div>
          <div className="feature-item bg-gradient-to-br from-yellow-900/30 to-orange-900/30 backdrop-blur-sm border border-yellow-400/50 rounded-lg p-4 text-center min-w-[140px] synth-feature animate-feature-glow-3">
            <div className="text-2xl mb-2 text-yellow-400">●</div>
            <div className="text-yellow-300 font-mono text-sm tracking-wide">24/7<br />SUPPORT</div>
          </div>
        </div>

        {/* Synth Call to Action */}
        <div className="cta-section text-center">
          <button 
            id="playNowBtn"
            className="cta-button bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:from-pink-400 hover:via-purple-400 hover:to-cyan-400 text-white font-mono font-black text-xl md:text-2xl py-6 px-12 rounded-lg shadow-2xl backdrop-blur-sm border-2 border-pink-400/60 transform hover:scale-110 transition-all duration-300 synth-cta animate-cta-glow"
            onClick={() => !isEditMode && brand.ctaUrl && window.open(brand.ctaUrl, '_blank')}
          >
            <EditableText
              value={ctaText}
              onChange={(val: string) => {
                setCtaText(val)
                notifyChange('cta', val)
              }}
              as="span"
              className="tracking-widest"
              placeholder="BUTTON TEXT"
              style={{ color: 'inherit', fontWeight: 'inherit' }}
            />
          </button>
          <p className="text-cyan-200/60 text-sm mt-6 font-mono tracking-wide">18+ ONLY • DIGITAL RESPONSIBILITY • TERMS APPLY</p>
        </div>
      </div>

      {/* Synth Win Modal */}
      {showWinModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="win-content bg-gradient-to-br from-cyan-900/80 to-purple-900/80 backdrop-blur-xl border-2 border-pink-400/60 p-8 rounded-2xl text-center shadow-2xl max-w-md mx-4 synth-modal animate-modal-glow">
            <h2 className="text-3xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400 mb-4 tracking-wider">◆ JACKPOT ACHIEVED ◆</h2>
            <p className="text-xl text-cyan-300 mb-2 font-mono">CREDIT TRANSFER: <span className="font-bold text-2xl text-green-400 animate-pulse">$1,000</span></p>
            <p className="text-pink-300 mb-6 font-mono tracking-wide">★ BONUS: 50 FREE EXECUTIONS ★</p>
            <button 
              className="bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-400 hover:to-cyan-400 text-white font-mono font-bold py-4 px-8 rounded-lg text-lg shadow-lg backdrop-blur-sm border border-green-400/50 transform hover:scale-105 transition-all duration-300 mb-3 w-full animate-claim-glow tracking-widest"
              onClick={() => brand.ctaUrl && window.open(brand.ctaUrl, '_blank')}
            >
              ▲ CLAIM REWARDS ▲
            </button>
            <button 
              className="block mx-auto text-cyan-300/70 hover:text-cyan-300 text-sm font-mono tracking-wide"
              onClick={() => setShowWinModal(false)}
            >
              [ CLOSE TERMINAL ]
            </button>
          </div>
        </div>
      )}

      {/* Synth 90's CSS Styles */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
        
        .synth-container {
          font-family: 'Orbitron', monospace;
        }
        
        .synth-grid {
          background-image: 
            linear-gradient(cyan 1px, transparent 1px),
            linear-gradient(90deg, cyan 1px, transparent 1px);
          background-size: 50px 50px;
          animation: grid-move 20s linear infinite;
        }
        
        .scan-lines {
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 255, 255, 0.03) 2px,
            rgba(0, 255, 255, 0.03) 4px
          );
          animation: scan 2s linear infinite;
        }
        
        .synth-underline {
          height: 3px;
          background: linear-gradient(90deg, transparent, cyan, pink, yellow, transparent);
          animation: underline-glow 3s ease-in-out infinite;
        }
        
        /* Neon Glow Effects */
        .neon-glow-cyan { text-shadow: 0 0 10px cyan, 0 0 20px cyan, 0 0 30px cyan; }
        .neon-glow-pink { text-shadow: 0 0 10px #ff1493, 0 0 20px #ff1493, 0 0 30px #ff1493; }
        .neon-glow-yellow { text-shadow: 0 0 10px yellow, 0 0 20px yellow, 0 0 30px yellow; }
        .neon-glow-green { text-shadow: 0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00; }
        .neon-glow-purple { text-shadow: 0 0 10px #8a2be2, 0 0 20px #8a2be2, 0 0 30px #8a2be2; }
        .neon-glow-orange { text-shadow: 0 0 10px #ff4500, 0 0 20px #ff4500, 0 0 30px #ff4500; }
        
        /* Synth Animations */
        .animate-text-shimmer { animation: text-shimmer 3s ease-in-out infinite; }
        .animate-border-pulse { animation: border-pulse 2s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        .animate-pulse-fast { animation: pulse-fast 0.5s ease-in-out infinite; }
        .animate-synth-spin { animation: synth-spin 0.1s linear infinite; }
        .animate-symbol-glow { animation: symbol-glow 2s ease-in-out infinite; }
        .animate-button-glow { animation: button-glow 2s ease-in-out infinite; }
        .animate-prize-glow-1 { animation: prize-glow-1 3s ease-in-out infinite; }
        .animate-prize-glow-2 { animation: prize-glow-2 3s ease-in-out infinite 0.5s; }
        .animate-feature-glow-1 { animation: feature-glow-1 4s ease-in-out infinite; }
        .animate-feature-glow-2 { animation: feature-glow-2 4s ease-in-out infinite 0.7s; }
        .animate-feature-glow-3 { animation: feature-glow-3 4s ease-in-out infinite 1.4s; }
        .animate-cta-glow { animation: cta-glow 2s ease-in-out infinite; }
        .animate-modal-glow { animation: modal-glow 3s ease-in-out infinite; }
        .animate-claim-glow { animation: claim-glow 1.5s ease-in-out infinite; }
        
        /* Synth Border Effects */
        .synth-border-glow {
          box-shadow: 
            inset 0 0 20px rgba(0, 255, 255, 0.1),
            0 0 20px rgba(0, 255, 255, 0.2),
            0 0 40px rgba(255, 20, 147, 0.1);
        }
        
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        
        @keyframes underline-glow {
          0%, 100% { opacity: 0.5; transform: scaleX(0.8); }
          50% { opacity: 1; transform: scaleX(1.2); }
        }
        
        @keyframes text-shimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes border-pulse {
          0%, 100% { border-color: rgba(255, 20, 147, 0.5); box-shadow: 0 0 10px rgba(255, 20, 147, 0.3); }
          50% { border-color: rgba(0, 255, 255, 0.8); box-shadow: 0 0 20px rgba(0, 255, 255, 0.5); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
        
        @keyframes pulse-fast {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        
        @keyframes synth-spin {
          0% { transform: rotateY(0deg) scale(1); }
          25% { transform: rotateY(90deg) scale(1.1); }
          50% { transform: rotateY(180deg) scale(1); }
          75% { transform: rotateY(270deg) scale(1.1); }
          100% { transform: rotateY(360deg) scale(1); }
        }
        
        @keyframes symbol-glow {
          0%, 100% { 
            box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
            border-color: rgba(0, 255, 255, 0.6);
          }
          50% { 
            box-shadow: 0 0 20px rgba(255, 20, 147, 0.5);
            border-color: rgba(255, 20, 147, 0.8);
          }
        }
        
        @keyframes button-glow {
          0%, 100% { 
            box-shadow: 0 0 15px rgba(255, 20, 147, 0.4);
            border-color: rgba(255, 20, 147, 0.6);
          }
          50% { 
            box-shadow: 0 0 25px rgba(0, 255, 255, 0.6);
            border-color: rgba(0, 255, 255, 0.8);
          }
        }
        
        @keyframes prize-glow-1 {
          0%, 100% { box-shadow: 0 0 15px rgba(0, 255, 0, 0.3); }
          50% { box-shadow: 0 0 25px rgba(0, 255, 255, 0.5); }
        }
        
        @keyframes prize-glow-2 {
          0%, 100% { box-shadow: 0 0 15px rgba(138, 43, 226, 0.3); }
          50% { box-shadow: 0 0 25px rgba(255, 20, 147, 0.5); }
        }
        
        @keyframes feature-glow-1 {
          0%, 100% { box-shadow: 0 0 10px rgba(0, 255, 255, 0.2); }
          50% { box-shadow: 0 0 20px rgba(0, 255, 255, 0.4); }
        }
        
        @keyframes feature-glow-2 {
          0%, 100% { box-shadow: 0 0 10px rgba(255, 20, 147, 0.2); }
          50% { box-shadow: 0 0 20px rgba(255, 20, 147, 0.4); }
        }
        
        @keyframes feature-glow-3 {
          0%, 100% { box-shadow: 0 0 10px rgba(255, 255, 0, 0.2); }
          50% { box-shadow: 0 0 20px rgba(255, 255, 0, 0.4); }
        }
        
        @keyframes cta-glow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(255, 20, 147, 0.4), 0 0 40px rgba(0, 255, 255, 0.2);
            transform: scale(1);
          }
          50% { 
            box-shadow: 0 0 30px rgba(255, 20, 147, 0.6), 0 0 60px rgba(0, 255, 255, 0.4);
            transform: scale(1.02);
          }
        }
        
        @keyframes modal-glow {
          0%, 100% { box-shadow: 0 0 30px rgba(255, 20, 147, 0.3), 0 0 60px rgba(0, 255, 255, 0.2); }
          50% { box-shadow: 0 0 50px rgba(255, 20, 147, 0.5), 0 0 100px rgba(0, 255, 255, 0.3); }
        }
        
        @keyframes claim-glow {
          0%, 100% { box-shadow: 0 0 15px rgba(0, 255, 0, 0.4); }
          50% { box-shadow: 0 0 25px rgba(0, 255, 255, 0.6); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}

export function renderTemplate(brand: BrandConfig): { html: string; css: string } {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${brand.brandName} - Win Big!</title>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet">
    <style>
        :root {
            --brand-primary: ${brand.colors.primary};
            --brand-secondary: ${brand.colors.secondary};
            --brand-accent: ${brand.colors.accent};
        }
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body { 
            font-family: 'Orbitron', monospace; 
            background: linear-gradient(145deg, #1A0F08, #2C1810); 
            color: white; 
            min-height: 100vh; 
            overflow-x: hidden; 
        }
        
        .container { 
            min-height: 100vh; 
            display: flex; 
            flex-direction: column; 
            justify-content: center; 
            align-items: center; 
            padding: 20px; 
            max-width: 1200px; 
            margin: 0 auto; 
            position: relative; 
        }
        
        .header { 
            text-align: center; 
            margin-bottom: 40px; 
        }
        
        .main-title { 
            font-size: 2.5rem; 
            font-weight: 900; 
            color: var(--brand-primary); 
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8); 
            margin-bottom: 20px; 
            animation: pulse 2s infinite; 
        }
        
        .subtitle { 
            font-size: 1.2rem; 
            color: white; 
            margin-bottom: 20px; 
        }
        
        .bonus-timer { 
            background: linear-gradient(45deg, var(--brand-secondary), var(--brand-accent)); 
            color: white; 
            padding: 10px 20px; 
            border-radius: 25px; 
            font-weight: bold; 
            display: inline-block; 
            box-shadow: 0 4px 15px rgba(255, 107, 53, 0.4); 
            animation: pulse 2s infinite; 
        }
        
        .slot-machine { 
            background: linear-gradient(145deg, #1A0F08, #2C1810); 
            border: 6px solid var(--brand-primary); 
            border-radius: 25px; 
            padding: 40px; 
            box-shadow: 0 0 50px rgba(255, 215, 0, 0.6); 
            margin-bottom: 40px; 
        }
        
        .prize-display { 
            display: flex; 
            justify-content: center; 
            gap: 30px; 
            margin-bottom: 30px; 
        }
        
        .prize-item { 
            padding: 15px; 
            border-radius: 15px; 
            text-align: center; 
            border: 3px solid; 
            min-width: 100px; 
            font-weight: bold; 
        }
        
        .prize-item.green { 
            background: #22c55e; 
            border-color: #16a34a; 
        }
        
        .prize-item.purple { 
            background: #8b5cf6; 
            border-color: #7c3aed; 
        }
        
        .slot-game { 
            background: rgba(0, 0, 0, 0.6); 
            border-radius: 20px; 
            padding: 30px; 
        }
        
        .rollover-line { 
            display: flex; 
            gap: 20px; 
            justify-content: center; 
            margin-bottom: 15px; 
            padding: 15px; 
            background: linear-gradient(145deg, #0a0a0a, #1a1a1a); 
            border: 3px solid var(--brand-primary); 
            border-radius: 15px; 
        }
        
        .rollover-symbol { 
            width: 80px; 
            height: 80px; 
            background: linear-gradient(145deg, var(--brand-secondary), var(--brand-primary)); 
            border: 2px solid var(--brand-accent); 
            border-radius: 12px; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            font-size: 2rem; 
            transition: all 0.3s ease;
        }
        
        .spin-button { 
            width: 100%; 
            background: linear-gradient(45deg, var(--brand-secondary), var(--brand-accent)); 
            color: white; 
            border: 3px solid var(--brand-primary); 
            border-radius: 15px; 
            padding: 20px; 
            font-size: 1.5rem; 
            font-weight: 900; 
            cursor: pointer; 
            margin-top: 20px; 
            animation: pulse 2s infinite; 
            transition: all 0.3s ease;
        }
        
        .spin-button:hover {
            transform: scale(1.05);
            opacity: 0.9;
        }
        
        .features { 
            display: flex; 
            gap: 30px; 
            margin-bottom: 40px; 
            flex-wrap: wrap; 
            justify-content: center; 
        }
        
        .feature-item { 
            background: rgba(0, 0, 0, 0.7); 
            border: 2px solid var(--brand-primary); 
            border-radius: 15px; 
            padding: 20px; 
            text-align: center; 
            min-width: 150px; 
            color: var(--brand-primary); 
            font-weight: bold; 
        }
        
        .cta-section { 
            text-align: center; 
        }
        
        .cta-button { 
            background: linear-gradient(45deg, var(--brand-primary), var(--brand-accent)); 
            color: #000; 
            border: 3px solid var(--brand-primary); 
            border-radius: 15px; 
            padding: 20px 40px; 
            font-size: 1.5rem; 
            font-weight: 900; 
            cursor: pointer; 
            box-shadow: 0 0 30px rgba(255, 215, 0, 0.6); 
            animation: pulse 2s infinite; 
            transition: all 0.3s ease;
        }
        
        .cta-button:hover {
            transform: scale(1.05);
            opacity: 0.9;
        }
        
        .disclaimer { 
            color: #888; 
            font-size: 0.8rem; 
            margin-top: 20px; 
        }
        
        @keyframes pulse { 
            0%, 100% { transform: scale(1); } 
            50% { transform: scale(1.05); } 
        }
        
        @keyframes spin {
            0% { transform: rotateY(0deg); }
            25% { transform: rotateY(90deg); }
            50% { transform: rotateY(180deg); }
            75% { transform: rotateY(270deg); }
            100% { transform: rotateY(360deg); }
        }
        
        .spinning {
            animation: spin 0.1s linear infinite;
        }
        
        /* Modal Styles */
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }
        
        .modal.show {
            display: flex;
        }
        
        .win-content {
            background: linear-gradient(135deg, var(--brand-primary), var(--brand-accent));
            padding: 40px;
            border-radius: 20px;
            text-align: center;
            box-shadow: 0 0 50px rgba(0, 0, 0, 0.5);
            max-width: 500px;
            margin: 20px;
        }
        
        .win-content h2 {
            font-size: 2.5rem;
            font-weight: 900;
            color: #000;
            margin-bottom: 20px;
        }
        
        .win-content p {
            font-size: 1.2rem;
            color: #000;
            margin-bottom: 10px;
        }
        
        .claim-btn {
            background: #22c55e;
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 10px;
            font-size: 1.2rem;
            font-weight: bold;
            cursor: pointer;
            margin: 20px 0;
            width: 100%;
            transition: all 0.3s ease;
        }
        
        .claim-btn:hover {
            background: #16a34a;
            transform: scale(1.05);
        }
        
        .close-btn {
            background: none;
            border: none;
            color: rgba(0, 0, 0, 0.7);
            cursor: pointer;
            text-decoration: underline;
            font-size: 0.9rem;
        }
        
        .close-btn:hover {
            color: #000;
        }
        
        @media (max-width: 768px) { 
            .main-title { font-size: 2rem; } 
            .rollover-symbol { width: 60px; height: 60px; font-size: 1.5rem; } 
            .features { gap: 15px; } 
            .feature-item { min-width: 120px; padding: 15px; } 
        }
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            ${brand.logoUrl ? `
            <div style="margin-bottom: 20px;">
                <img src="${brand.logoUrl}" alt="${brand.brandName}" style="height: 60px; width: auto; max-width: 200px; object-fit: contain;" onerror="this.style.display='none';" />
            </div>
            ` : ''}
            <h1 class="main-title">🏆 ${brand.copy.headline || `${brand.brandName.toUpperCase()} WINS AWAIT!`} 🏆</h1>
            <p class="subtitle">${brand.copy.subheadline || 'Join thousands of winners playing the hottest slots of 2025!'}</p>
            <div class="bonus-timer">⏰ Bonus expires: 5:55</div>
        </header>
        <div class="slot-machine">
            <div class="prize-display">
                <div class="prize-item green">🎁<br>WIN $5,000</div>
                <div class="prize-item purple">💎<br>MIN $1,000</div>
            </div>
            <div class="slot-game">
                <div class="rollover-line">
                    <div class="rollover-symbol" id="slot0">💎</div>
                    <div class="rollover-symbol" id="slot1">🎰</div>
                    <div class="rollover-symbol" id="slot2">🍒</div>
                </div>
                <div class="rollover-line">
                    <div class="rollover-symbol" id="slot3">🏆</div>
                    <div class="rollover-symbol" id="slot4">💰</div>
                    <div class="rollover-symbol" id="slot5">⭐</div>
                </div>
                <div class="rollover-line">
                    <div class="rollover-symbol" id="slot6">💎</div>
                    <div class="rollover-symbol" id="slot7">🎰</div>
                    <div class="rollover-symbol" id="slot8">🍒</div>
                </div>
                <button class="spin-button" id="spinButton">ROLL TO WIN!</button>
            </div>
        </div>
        <div class="features">
            <div class="feature-item">💎<br>Instant Payouts</div>
            <div class="feature-item">🎁<br>Welcome Bonus</div>
            <div class="feature-item">🏆<br>24/7 Support</div>
        </div>
        <div class="cta-section">
            <button class="cta-button" id="playNowBtn">🏆 ${brand.copy.cta || 'PLAY NOW & WIN BIG!'} 🏆</button>
            <p class="disclaimer">18+ only. Gamble Responsibly. Terms & Conditions Apply.</p>
        </div>
    </div>

    <!-- Win Modal -->
    <div id="winModal" class="modal">
        <div class="win-content">
            <h2>🎉 CONGRATULATIONS! 🎉</h2>
            <p>You won <span style="font-weight: bold; font-size: 1.5em; color: #22c55e;">$1,000</span>!</p>
            <p>🎁 Plus 50 FREE SPINS!</p>
            <button class="claim-btn" id="claimBtn">CLAIM YOUR PRIZE NOW!</button>
            <button class="close-btn" id="closeModal">Close</button>
        </div>
    </div>

    <script>
        // Slot machine functionality
        let spinCount = 0;
        let isSpinning = false;
        const symbols = ['💎', '🎰', '🍒', '🏆', '💰', '⭐'];
        
        function updateSlotSymbols() {
            for (let i = 0; i < 9; i++) {
                const slot = document.getElementById('slot' + i);
                if (slot) {
                    if (spinCount >= 2) {
                        // Show winning combination
                        slot.textContent = '🏆';
                    } else {
                        // Show random symbols
                        slot.textContent = symbols[Math.floor(Math.random() * symbols.length)];
                    }
                }
            }
        }
        
        function showWinModal() {
            const modal = document.getElementById('winModal');
            modal.classList.add('show');
        }
        
        // Spin button functionality
        document.getElementById('spinButton').addEventListener('click', function() {
            if (isSpinning) return;
            
            isSpinning = true;
            spinCount++;
            
            const button = this;
            button.textContent = 'SPINNING...';
            button.style.opacity = '0.5';
            button.style.cursor = 'not-allowed';
            
            // Add spinning animation to all symbols
            const slotSymbols = document.querySelectorAll('.rollover-symbol');
            slotSymbols.forEach(symbol => {
                symbol.classList.add('spinning');
            });
            
            // Rapidly change symbols during spin
            const spinInterval = setInterval(() => {
                for (let i = 0; i < 9; i++) {
                    const slot = document.getElementById('slot' + i);
                    if (slot) {
                        slot.textContent = symbols[Math.floor(Math.random() * symbols.length)];
                    }
                }
            }, 100);
            
            // Stop spinning after 2 seconds
            setTimeout(() => {
                clearInterval(spinInterval);
                
                // Remove spin animation
                slotSymbols.forEach(symbol => {
                    symbol.classList.remove('spinning');
                });
                
                // Update final symbols
                updateSlotSymbols();
                
                // Reset button
                button.textContent = 'ROLL TO WIN!';
                button.style.opacity = '1';
                button.style.cursor = 'pointer';
                isSpinning = false;
                
                // Show win modal on second attempt
                if (spinCount === 2) {
                    setTimeout(() => {
                        showWinModal();
                    }, 500);
                }
            }, 2000);
        });

        // Close win modal
        document.getElementById('closeModal').addEventListener('click', function() {
            const modal = document.getElementById('winModal');
            modal.classList.remove('show');
        });

        // CTA buttons
        const ctaUrl = '${brand.ctaUrl || 'https://example.com'}';
        
        document.getElementById('claimBtn').addEventListener('click', function() {
            if (ctaUrl && ctaUrl !== 'https://example.com') {
                window.open(ctaUrl, '_blank');
            }
        });
        
        document.getElementById('playNowBtn').addEventListener('click', function() {
            if (ctaUrl && ctaUrl !== 'https://example.com') {
                window.open(ctaUrl, '_blank');
            }
        });
    </script>
</body>
</html>`;

  const css = `* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Orbitron', monospace; background: linear-gradient(145deg, #1A0F08, #2C1810); color: white; min-height: 100vh; overflow-x: hidden; }
.container { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 20px; max-width: 1200px; margin: 0 auto; position: relative; }
.header { text-align: center; margin-bottom: 40px; }
.main-title { font-size: 2.5rem; font-weight: 900; color: #FFD700; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8); margin-bottom: 20px; animation: pulse 2s infinite; }
.subtitle { font-size: 1.2rem; color: white; margin-bottom: 20px; }
.bonus-timer { background: linear-gradient(45deg, #FF6B35, #FF8C42); color: white; padding: 10px 20px; border-radius: 25px; font-weight: bold; display: inline-block; box-shadow: 0 4px 15px rgba(255, 107, 53, 0.4); animation: pulse 2s infinite; }
.slot-machine { background: linear-gradient(145deg, #1A0F08, #2C1810); border: 6px solid #FFD700; border-radius: 25px; padding: 40px; box-shadow: 0 0 50px rgba(255, 215, 0, 0.6); margin-bottom: 40px; }
.prize-display { display: flex; justify-content: center; gap: 30px; margin-bottom: 30px; }
.prize-item { padding: 15px; border-radius: 15px; text-align: center; border: 3px solid; min-width: 100px; font-weight: bold; }
.prize-item.green { background: #22c55e; border-color: #16a34a; }
.prize-item.purple { background: #8b5cf6; border-color: #7c3aed; }
.slot-game { background: rgba(0, 0, 0, 0.6); border-radius: 20px; padding: 30px; }
.rollover-line { display: flex; gap: 20px; justify-content: center; margin-bottom: 15px; padding: 15px; background: linear-gradient(145deg, #0a0a0a, #1a1a1a); border: 3px solid #FFD700; border-radius: 15px; }
.rollover-symbol { width: 80px; height: 80px; background: linear-gradient(145deg, #2a2a2a, #1a1a1a); border: 2px solid #FFD700; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 2rem; }
.spin-button { width: 100%; background: linear-gradient(45deg, #dc2626, #ef4444); color: white; border: 3px solid #FFD700; border-radius: 15px; padding: 20px; font-size: 1.5rem; font-weight: 900; cursor: pointer; margin-top: 20px; animation: pulse 2s infinite; }
.features { display: flex; gap: 30px; margin-bottom: 40px; flex-wrap: wrap; justify-content: center; }
.feature-item { background: rgba(0, 0, 0, 0.7); border: 2px solid #FFD700; border-radius: 15px; padding: 20px; text-align: center; min-width: 150px; color: #FFD700; font-weight: bold; }
.cta-section { text-align: center; }
.cta-button { background: linear-gradient(45deg, #FFD700, #FFA500); color: #000; border: 3px solid #FFD700; border-radius: 15px; padding: 20px 40px; font-size: 1.5rem; font-weight: 900; cursor: pointer; box-shadow: 0 0 30px rgba(255, 215, 0, 0.6); animation: pulse 2s infinite; }
.disclaimer { color: #888; font-size: 0.8rem; margin-top: 20px; }
@keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
@media (max-width: 768px) { .main-title { font-size: 2rem; } .rollover-symbol { width: 60px; height: 60px; font-size: 1.5rem; } .features { gap: 15px; } .feature-item { min-width: 120px; padding: 15px; } }`;

  return { html, css }
}
