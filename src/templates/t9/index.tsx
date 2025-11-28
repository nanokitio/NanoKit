'use client'

import React, { useState, useEffect } from 'react'
import { BrandConfig } from '@/lib/types'

interface Template9Props {
  brand: BrandConfig
}

function Template9({ brand }: Template9Props) {
  const [showWinModal, setShowWinModal] = useState(false)

  const handleClaimBonus = () => {
    if (brand.ctaUrl) {
      window.open(brand.ctaUrl, '_blank')
    }
  }

  useEffect(() => {
    let clickCount = 0
    let lastFocusTime = 0
    let isFirstFocus = true
    
    // Listen for messages from the iframe game
    const handleMessage = (event: MessageEvent) => {
      if (event.data === 'gameWin' || (event.data.type === 'spin' && event.data.count >= 2)) {
        setShowWinModal(true)
      }
      
      // Count clicks/interactions
      if (event.data.type === 'click' || event.data.type === 'spin') {
        clickCount++
        console.log('Message interaction count:', clickCount)
        if (clickCount >= 2) {
          setShowWinModal(true)
        }
      }
    }

    window.addEventListener('message', handleMessage)
    
    // Detect user interaction with iframe (clicks)
    const detectInteraction = () => {
      const iframe = document.querySelector('.game-iframe') as HTMLIFrameElement
      if (iframe) {
        let wasFocused = false
        
        // Track when iframe gains focus (user clicked inside)
        const checkFocus = setInterval(() => {
          const isFocused = document.activeElement === iframe
          
          if (isFocused && !wasFocused) {
            // Iframe just gained focus (new click detected)
            const now = Date.now()
            
            // Skip the very first focus (initial load)
            if (isFirstFocus) {
              isFirstFocus = false
              console.log('First focus (initial load) - not counting')
            } else if (now - lastFocusTime > 500) {
              // Only count if enough time has passed since last focus
              clickCount++
              console.log('Click detected! Count:', clickCount)
              
              // Show modal ONLY after exactly 2 clicks
              if (clickCount === 2) {
                setShowWinModal(true)
                clearInterval(checkFocus)
              }
            }
            
            lastFocusTime = now
            wasFocused = true
            
            // Blur after a moment to detect next click
            setTimeout(() => {
              if (document.activeElement === iframe) {
                iframe.blur()
                wasFocused = false
              }
            }, 200)
          } else if (!isFocused) {
            wasFocused = false
          }
        }, 100)
        
        return () => clearInterval(checkFocus)
      }
    }
    
    const cleanup = detectInteraction()

    return () => {
      window.removeEventListener('message', handleMessage)
      if (cleanup) cleanup()
    }
  }, [])

  return (
    <div className="fisherman-game-wrapper">
      {/* Editable Title */}
      <div className="game-title">
        <h1>{brand.copy?.headline || 'YOUR TITLE HERE'}</h1>
      </div>

      {/* Casino Brand Logo - Perfect for iGaming Affiliates */}
      {brand.logoUrl && (
        <div className="affiliate-logo-container" onClick={handleClaimBonus}>
          <div className="affiliate-logo-wrapper">
            <div className="affiliate-logo-inner">
              <img src={brand.logoUrl} alt={`${brand.brandName} Casino Logo`} />
            </div>
          </div>
          <div className="affiliate-badge">
            <span>🎰 OFFICIAL PARTNER</span>
          </div>
        </div>
      )}
      
      {/* Game iframe */}
      <div className="game-container">
        <iframe 
          src="/FisherMan Slot/index.html"
          title="Fisherman Slot Game"
          className="game-iframe"
          frameBorder="0"
          allowFullScreen
        />
      </div>
      
      {/* Footer */}
      <div className="footer">
        <div className="footer-content">
          <p>18+ | Play Responsibly | <a href="#" onClick={(e) => { e.preventDefault(); alert('Terms and Conditions'); }}>Terms & Conditions</a> | <a href="#" onClick={(e) => { e.preventDefault(); alert('Privacy Policy'); }}>Privacy Policy</a></p>
        </div>
      </div>
      
      {/* Win Modal Overlay */}
      {showWinModal && (
        <div className="win-modal-overlay" onClick={(e) => {
          if (e.target === e.currentTarget) {
            // Don't close on backdrop click - force user to claim
          }
        }}>
          <div className="win-modal-content">
            <div className="nail nail-tl"></div>
            <div className="nail nail-tr"></div>
            <div className="nail nail-bl"></div>
            <div className="nail nail-br"></div>
            <div className="win-icon">🎉</div>
            <h2 className="win-title">WINNER!</h2>
            <p className="win-message">Congratulations! You've won!</p>
            <div className="win-prize">
              <span className="prize-label">YOUR BONUS:</span>
              <span className="prize-amount">$1,000 + 50 FREE SPINS</span>
            </div>
            <button className="claim-bonus-btn" onClick={handleClaimBonus}>
              🎁 {brand.copy?.cta || 'CLAIM BONUS NOW!'}
            </button>
          </div>
        </div>
      )}
      

      <style jsx>{`
        .fisherman-game-wrapper {
          width: 100%;
          height: 100vh;
          background: 
            repeating-linear-gradient(90deg, 
              #8B5A2B 0px, 
              #654321 2px, 
              #8B5A2B 4px, 
              #654321 6px
            ),
            #4a3219;
          background-size: 6px 100%, 100%;
          position: relative;
          font-family: 'Arial', sans-serif;
          display: flex;
          flex-direction: column;
          padding: 0;
          gap: 0;
          overflow: hidden;
        }
        
        .fisherman-game-wrapper::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            repeating-linear-gradient(0deg,
              transparent 0px,
              rgba(0, 0, 0, 0.03) 1px,
              transparent 2px,
              transparent 4px
            );
          pointer-events: none;
          z-index: 0;
        }
        
        .game-title {
          text-align: center;
          padding: 8px 16px;
          background: linear-gradient(90deg, ${brand.colors?.primary || '#4a90e2'}, ${brand.colors?.secondary || '#7b68ee'});
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          flex-shrink: 0;
          min-height: 45px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .game-title h1 {
          margin: 0;
          font-size: 1.4rem;
          font-weight: 900;
          color: white;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
          line-height: 1.2;
        }
        
        .affiliate-logo-container {
          position: absolute;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1000;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
        }
        
        .affiliate-logo-wrapper {
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 100%);
          backdrop-filter: blur(12px);
          border-radius: 1.5rem;
          padding: 1rem;
          border: 2px solid rgba(255,215,0,0.4);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          transition: all 0.3s ease;
        }
        
        .affiliate-logo-container:hover .affiliate-logo-wrapper {
          border-color: rgba(255,215,0,0.6);
          transform: scale(1.05);
        }
        
        .affiliate-logo-inner {
          background: rgba(255,255,255,0.95);
          border-radius: 1rem;
          padding: 0.75rem;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .affiliate-logo-inner img {
          height: 3rem;
          width: auto;
          max-width: 12rem;
          object-fit: contain;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2)) brightness(1.1);
        }
        
        .affiliate-badge {
          margin-top: 0.5rem;
          display: inline-flex;
          align-items: center;
          padding: 0.25rem 0.75rem;
          background: rgba(255,215,0,0.2);
          border: 1px solid rgba(255,215,0,0.3);
          border-radius: 9999px;
          backdrop-filter: blur(4px);
        }
        
        .affiliate-badge span {
          color: #FFD700;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.05em;
        }
        
        .game-container {
          flex: 1;
          background: 
            repeating-linear-gradient(90deg, 
              #8B5A2B 0px, 
              #654321 2px, 
              #8B5A2B 4px, 
              #654321 6px
            ),
            #4a3219;
          background-size: 6px 100%, 100%;
          border-radius: 0;
          overflow: hidden;
          box-shadow: none;
          border: none;
          position: relative;
          min-height: 0;
        }
        
        .footer {
          width: 100%;
          padding: 12px 20px;
          background: 
            linear-gradient(90deg, rgba(139, 90, 43, 0.95), rgba(101, 67, 33, 0.95)),
            repeating-linear-gradient(90deg, 
              #8B5A2B 0px, 
              #654321 2px, 
              #8B5A2B 4px, 
              #654321 6px
            );
          background-size: 100%, 6px 100%;
          box-shadow: 
            inset 0 2px 4px rgba(255, 255, 255, 0.1),
            inset 0 -2px 4px rgba(0, 0, 0, 0.3);
          border-top: 4px solid #4a3219;
          flex-shrink: 0;
          position: relative;
          z-index: 1000;
          text-align: center;
        }
        
        .footer-content {
          position: relative;
          z-index: 1;
        }
        
        .footer-content p {
          margin: 0;
          font-size: 0.75rem;
          color: rgba(255, 215, 0, 0.9);
          line-height: 1.4;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
        }
        
        .footer-content a {
          color: #FFD700;
          text-decoration: none;
          font-weight: bold;
          transition: color 0.3s ease;
        }
        
        .footer-content a:hover {
          color: #FFF;
          text-decoration: underline;
        }
        
        /* Win Modal Styles */
        .win-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.95);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          animation: fadeIn 0.3s ease-out;
        }
        
        .win-modal-content {
          background: 
            repeating-linear-gradient(90deg, 
              #8B5A2B 0px, 
              #654321 2px, 
              #8B5A2B 4px, 
              #654321 6px
            ),
            #5a3a1a;
          background-size: 6px 100%, 100%;
          border: 8px solid #3d2914;
          border-radius: 15px;
          padding: 50px 40px;
          text-align: center;
          max-width: 520px;
          width: 90%;
          box-shadow: 
            inset 0 0 0 3px #8B5A2B,
            inset 0 0 0 5px #654321,
            0 20px 60px rgba(0, 0, 0, 0.9),
            0 0 0 2px #2d1810;
          animation: modalBounce 0.5s ease-out;
          position: relative;
          overflow: visible;
        }
        
        .win-modal-content::before {
          content: '';
          position: absolute;
          top: 15px;
          left: 15px;
          right: 15px;
          bottom: 15px;
          border: 2px solid rgba(139, 90, 43, 0.6);
          border-radius: 8px;
          pointer-events: none;
          z-index: 0;
        }
        
        .win-modal-content .nail {
          position: absolute;
          width: 20px;
          height: 20px;
          background: radial-gradient(circle at 35% 35%, #999, #222);
          border-radius: 50%;
          border: 2px solid #1a1a1a;
          box-shadow: 
            inset 0 2px 3px rgba(255, 255, 255, 0.4),
            inset 0 -2px 3px rgba(0, 0, 0, 0.6),
            0 3px 6px rgba(0, 0, 0, 0.7);
          z-index: 10;
        }
        
        .win-modal-content .nail::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 4px;
          height: 4px;
          background: #444;
          border-radius: 50%;
        }
        
        .win-modal-content .nail-tl { top: 12px; left: 12px; }
        .win-modal-content .nail-tr { top: 12px; right: 12px; }
        .win-modal-content .nail-bl { bottom: 12px; left: 12px; }
        .win-modal-content .nail-br { bottom: 12px; right: 12px; }
        
        .win-icon {
          font-size: 5rem;
          margin-bottom: 20px;
          animation: bounce 1s infinite;
          position: relative;
          z-index: 1;
        }
        
        .win-title {
          font-size: 3.5rem;
          font-weight: 900;
          color: #FFD700;
          text-transform: uppercase;
          letter-spacing: 4px;
          margin: 0 0 15px 0;
          text-shadow: 
            0 2px 0 #654321,
            0 4px 0 #4a3219,
            0 6px 10px rgba(0, 0, 0, 0.8),
            0 0 30px rgba(255, 215, 0, 0.6);
          font-family: 'Arial Black', sans-serif;
          position: relative;
          z-index: 1;
        }
        
        .win-message {
          font-size: 1.3rem;
          color: white;
          margin-bottom: 30px;
          position: relative;
          z-index: 1;
        }
        
        .win-prize {
          background: #2d1810;
          border: 4px solid #654321;
          border-radius: 10px;
          padding: 25px;
          margin: 30px 0;
          box-shadow: 
            inset 0 0 0 2px #8B5A2B,
            0 8px 20px rgba(0, 0, 0, 0.7);
          position: relative;
          z-index: 1;
        }
        
        .prize-label {
          display: block;
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 10px;
          letter-spacing: 2px;
        }
        
        .prize-amount {
          display: block;
          font-size: 2.2rem;
          font-weight: 900;
          color: ${brand.colors?.accent || '#ffd700'};
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
          animation: pulse 1.5s ease-in-out infinite;
        }
        
        .claim-bonus-btn {
          width: 100%;
          background: #d4af37;
          color: #2d1810;
          border: 4px solid #8B5A2B;
          border-radius: 10px;
          padding: 20px 40px;
          font-size: 1.5rem;
          font-weight: 900;
          text-transform: uppercase;
          cursor: pointer;
          margin-bottom: 15px;
          box-shadow: 
            inset 0 0 0 2px #ffd700,
            0 8px 20px rgba(0, 0, 0, 0.6);
          transition: all 0.3s ease;
          letter-spacing: 3px;
          position: relative;
          z-index: 1;
          font-family: 'Arial Black', sans-serif;
          text-shadow: 0 1px 2px rgba(255, 255, 255, 0.3);
        }
        
        .claim-bonus-btn:hover {
          transform: translateY(-3px);
          background: #ffd700;
          box-shadow: 
            inset 0 0 0 2px #d4af37,
            0 12px 25px rgba(0, 0, 0, 0.7);
        }
        
        /* Animations */
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes modalBounce {
          0% {
            transform: scale(0.3) translateY(-100px);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        @keyframes glow {
          0%, 100% {
            text-shadow: 0 0 20px rgba(255, 215, 0, 0.8), 0 0 40px rgba(255, 215, 0, 0.5);
          }
          50% {
            text-shadow: 0 0 30px rgba(255, 215, 0, 1), 0 0 60px rgba(255, 215, 0, 0.8);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
        
        @keyframes buttonPulse {
          0%, 100% {
            box-shadow: 0 10px 30px rgba(34, 197, 94, 0.5);
          }
          50% {
            box-shadow: 0 10px 40px rgba(34, 197, 94, 0.8), 0 0 50px rgba(255, 215, 0, 0.3);
          }
        }
        
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        /* Responsive */
        @media (max-width: 768px) {
          .game-title {
            padding: 6px 12px;
            min-height: 38px;
          }
          
          .game-title h1 {
            font-size: 1rem;
            letter-spacing: 1px;
          }
          
          .fisherman-game-wrapper {
            padding: 0;
            gap: 0;
          }
          
          .brand-logo {
            top: 8px;
            left: 8px;
            padding: 4px 8px;
          }
          
          .brand-logo img {
            max-height: 28px;
            max-width: 120px;
          }
          
          .game-container {
            border-radius: 8px;
            border-width: 2px;
          }
          
          .footer {
            padding: 10px 16px;
          }
          
          .footer-content p {
            font-size: 0.7rem;
          }
          
          .win-modal-content {
            padding: 30px 20px;
          }
          
          .win-icon {
            font-size: 3.5rem;
          }
          
          .win-title {
            font-size: 2rem;
          }
          
          .win-message {
            font-size: 1.1rem;
          }
          
          .prize-amount {
            font-size: 1.8rem;
          }
          
          .claim-bonus-btn {
            font-size: 1.1rem;
            padding: 16px 32px;
          }
        }
        
        @media (max-width: 480px) {
          .game-title {
            padding: 5px 10px;
            min-height: 32px;
          }
          
          .game-title h1 {
            font-size: 0.85rem;
            letter-spacing: 0.5px;
          }
          
          .fisherman-game-wrapper {
            padding: 0;
            gap: 0;
          }
          
          .footer {
            padding: 8px 12px;
          }
          
          .footer-content p {
            font-size: 0.65rem;
            line-height: 1.3;
          }
        }
      `}</style>
    </div>
  )
}

export { Template9 }
export { renderTemplate } from './server'
