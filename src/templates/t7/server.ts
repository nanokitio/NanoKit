import { BrandConfig } from '../../lib/types'
import { generateCSSVariables } from '@/lib/colors'

export function renderTemplate(brand: BrandConfig): { html: string; css: string } {
  // Safely extract brand data with fallbacks
  const brandName = brand.brandName || 'Bonanza Casino'
  const logoUrl = brand.logoUrl || ''
  // Sweet Bonanza Premium Colors - Diseño profesional inspirado en dulces y frutas
  const colors = {
    primary: brand.colors?.primary || '#FF1493',     // Hot Pink / Magenta vibrante
    secondary: brand.colors?.secondary || '#9333EA',  // Purple 600 / Morado profundo
    accent: brand.colors?.accent || '#FBBF24'         // Amber 400 / Dorado brillante
  }
  const headline = brand.copy?.headline || 'WIN BIG WITH BONANZA BILLION SLOTS!'
  const subheadline = brand.copy?.subheadline || 'Premium 3x3 slot machine with life-changing prizes'
  const cta = brand.copy?.cta || 'SPIN TO WIN'
  const backgroundColor = brand.backgroundColor || '#1e1b4b'
  const backgroundImage = brand.backgroundImage || ''

  const css = `
    :root {
      --brand-primary: ${colors.primary};
      --brand-secondary: ${colors.secondary};
      --brand-accent: ${colors.accent};
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', sans-serif;
      line-height: 1.6;
      color: #ffffff;
      background: ${backgroundImage 
        ? `url('${backgroundImage}') center/cover no-repeat fixed, linear-gradient(135deg, ${backgroundColor} 0%, #312e81 25%, #4c1d95 50%, #581c87 75%, ${backgroundColor} 100%)` 
        : `linear-gradient(135deg, ${backgroundColor} 0%, #312e81 25%, #4c1d95 50%, #581c87 75%, ${backgroundColor} 100%)`};
      background-attachment: fixed;
      min-height: 100vh;
      overflow-x: hidden;
      position: relative;
    }
    
    body::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: ${backgroundImage 
        ? 'radial-gradient(circle at 20% 50%, rgba(236, 72, 153, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(147, 51, 234, 0.08) 0%, transparent 50%), radial-gradient(circle at 40% 20%, rgba(251, 191, 36, 0.05) 0%, transparent 50%)' 
        : 'radial-gradient(circle at 20% 50%, rgba(236, 72, 153, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(147, 51, 234, 0.15) 0%, transparent 50%), radial-gradient(circle at 40% 20%, rgba(251, 191, 36, 0.1) 0%, transparent 50%)'};
      pointer-events: none;
      z-index: 1;
    }
    
    /* Logo container styles */
    .logo-container {
      min-height: 5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.5rem;
    }
    
    .logo-container img {
      height: 4rem;
      width: auto;
      max-width: 200px;
      object-fit: contain;
      filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5)) brightness(1.2) contrast(1.1);
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }
    
    .slot-machine {
      background: linear-gradient(135deg, 
        rgba(147, 51, 234, 0.95) 0%,   /* Purple */
        rgba(192, 38, 211, 0.95) 35%,  /* Fuchsia */
        rgba(236, 72, 153, 0.95) 70%,  /* Pink */
        rgba(251, 113, 133, 0.95) 100% /* Rose */
      );
      border: 5px solid var(--brand-accent);
      border-radius: 2rem;
      padding: 2rem;
      box-shadow: 
        0 30px 60px -15px rgba(0, 0, 0, 0.5),
        0 0 0 1px rgba(255, 255, 255, 0.1) inset,
        0 0 40px rgba(251, 191, 36, 0.3);
      position: relative;
      overflow: hidden;
    }
    
    .slot-machine::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, 
        transparent 0%, 
        rgba(255, 255, 255, 0.05) 50%, 
        transparent 100%
      );
      pointer-events: none;
    }
    
    .slot-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.75rem;
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
      padding: 1.5rem;
      border-radius: 1.25rem;
      box-shadow: 
        inset 0 4px 6px rgba(0, 0, 0, 0.5),
        inset 0 0 20px rgba(0, 0, 0, 0.3),
        0 0 30px rgba(251, 191, 36, 0.2) inset;
      border: 3px solid rgba(251, 191, 36, 0.3);
      position: relative;
    }
    
    .slot-grid::before {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      background: linear-gradient(45deg, 
        var(--brand-accent) 0%, 
        var(--brand-primary) 50%, 
        var(--brand-accent) 100%
      );
      border-radius: 1.25rem;
      z-index: -1;
      opacity: 0.3;
      filter: blur(8px);
    }
    
    .slot-square {
      width: 5rem;
      height: 5rem;
      background: linear-gradient(135deg, 
        #fbbf24 0%,   /* Amber 400 */
        #f59e0b 25%,  /* Amber 500 */
        #fb923c 50%,  /* Orange 400 */
        #f97316 75%,  /* Orange 500 */
        #ea580c 100%  /* Orange 600 */
      );
      border-radius: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.25rem;
      box-shadow: 
        0 10px 25px -5px rgba(0, 0, 0, 0.4),
        0 0 0 2px rgba(255, 255, 255, 0.2) inset,
        0 4px 6px rgba(251, 191, 36, 0.5);
      overflow: hidden;
      position: relative;
      transition: transform 0.2s ease;
    }
    
    .slot-square:hover {
      transform: scale(1.05);
      box-shadow: 
        0 15px 30px -8px rgba(0, 0, 0, 0.5),
        0 0 0 3px rgba(255, 255, 255, 0.3) inset,
        0 0 20px rgba(251, 191, 36, 0.8);
    }
    
    .slot-square::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 15%;
      background: linear-gradient(to bottom, rgba(0,0,0,0.3), transparent);
      pointer-events: none;
      z-index: 1;
    }
    
    .slot-square::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 15%;
      background: linear-gradient(to top, rgba(0,0,0,0.3), transparent);
      pointer-events: none;
      z-index: 1;
    }
    
    .game-controls {
      background: linear-gradient(135deg, 
        rgba(147, 51, 234, 0.95) 0%,
        rgba(168, 85, 247, 0.95) 50%,
        rgba(192, 38, 211, 0.95) 100%
      );
      border: 5px solid var(--brand-accent);
      border-radius: 2rem;
      padding: 2rem;
      box-shadow: 
        0 30px 60px -15px rgba(0, 0, 0, 0.5),
        0 0 0 1px rgba(255, 255, 255, 0.1) inset,
        0 0 40px rgba(251, 191, 36, 0.3);
      min-width: 300px;
      position: relative;
      overflow: hidden;
    }
    
    .game-controls::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, 
        transparent 0%, 
        rgba(255, 255, 255, 0.05) 50%, 
        transparent 100%
      );
      pointer-events: none;
    }
    
    .control-display {
      background: linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(7, 12, 23, 0.98) 100%);
      border: 3px solid #fbbf24;
      border-radius: 1rem;
      padding: 1.25rem;
      margin-bottom: 1.25rem;
      box-shadow: 
        0 10px 20px -5px rgba(0, 0, 0, 0.5),
        inset 0 0 30px rgba(251, 191, 36, 0.15),
        inset 0 2px 4px rgba(255, 255, 255, 0.1);
      position: relative;
    }
    
    .control-display::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 50%;
      background: linear-gradient(to bottom, 
        rgba(255, 255, 255, 0.05) 0%, 
        transparent 100%
      );
      border-radius: 1rem 1rem 0 0;
      pointer-events: none;
    }
    
    .spin-button {
      width: 100%;
      background: linear-gradient(135deg, 
        #fbbf24 0%,   /* Amber 400 */
        #f59e0b 25%,  /* Amber 500 */
        #fb923c 50%,  /* Orange 400 */
        #f97316 100%  /* Orange 500 */
      );
      color: #ffffff;
      font-weight: 900;
      font-size: 1.5rem;
      padding: 1.25rem 2rem;
      border-radius: 9999px;
      border: 4px solid rgba(255, 255, 255, 0.4);
      cursor: pointer;
      box-shadow: 
        0 20px 40px -10px rgba(251, 146, 60, 0.6),
        0 0 0 1px rgba(255, 255, 255, 0.2) inset,
        0 10px 20px rgba(0, 0, 0, 0.3);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      text-shadow: 
        0 2px 4px rgba(0, 0, 0, 0.6),
        0 0 10px rgba(0, 0, 0, 0.3);
      position: relative;
      overflow: hidden;
    }
    
    .spin-button::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, 
        transparent 0%, 
        rgba(255, 255, 255, 0.3) 50%, 
        transparent 100%
      );
      transition: left 0.5s;
    }
    
    .spin-button:hover {
      transform: scale(1.08) translateY(-2px);
      box-shadow: 
        0 25px 50px -10px rgba(251, 146, 60, 0.8),
        0 0 0 2px rgba(255, 255, 255, 0.4) inset,
        0 15px 30px rgba(0, 0, 0, 0.4),
        0 0 40px rgba(251, 191, 36, 0.6);
    }
    
    .spin-button:hover::before {
      left: 100%;
    }
    
    .spin-button:active {
      transform: scale(1.02) translateY(0);
      box-shadow: 
        0 10px 20px -5px rgba(251, 146, 60, 0.6),
        0 0 0 1px rgba(255, 255, 255, 0.2) inset;
    }
    
    .disclaimer {
      background: linear-gradient(135deg, 
        rgba(30, 27, 75, 0.95) 0%, 
        rgba(49, 46, 129, 0.95) 50%, 
        rgba(30, 27, 75, 0.95) 100%
      );
      backdrop-filter: blur(8px);
      border: 3px solid rgba(251, 191, 36, 0.4);
      border-radius: 1rem;
      padding: 1rem 2rem;
      box-shadow: 
        0 25px 50px -12px rgba(0, 0, 0, 0.6),
        0 0 0 1px rgba(255, 255, 255, 0.1) inset,
        0 0 30px rgba(147, 51, 234, 0.3);
      display: inline-block;
      margin: 0 auto;
      position: relative;
      overflow: hidden;
    }
    
    .disclaimer::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, 
        transparent 0%, 
        rgba(251, 191, 36, 0.05) 50%, 
        transparent 100%
      );
      pointer-events: none;
    }
    
    /* Comprehensive Responsive Design */
    @media (max-width: 1024px) {
      .container {
        padding: 1.5rem;
      }
      
      .game-controls {
        min-width: 280px;
        padding: 1.5rem;
      }
    }
    
    @media (max-width: 768px) {
      .container {
        padding: 1rem;
      }
      
      .game-controls {
        min-width: 250px;
        padding: 1.25rem;
      }
      
      .control-display {
        padding: 1rem;
        margin-bottom: 1rem;
      }
      
      .balance-display {
        font-size: 1.5rem;
      }
      
      .spin-button {
        padding: 0.75rem 2rem;
        font-size: 1rem;
      }
    }
    
    @media (max-width: 600px) {
      .container {
        padding: 0.75rem;
      }
      
      .game-controls {
        min-width: 220px;
        padding: 1rem;
        border-radius: 1.5rem;
      }
      
      .control-display {
        padding: 0.75rem;
        border-radius: 0.75rem;
      }
      
      .balance-display {
        font-size: 1.25rem;
      }
      
      .spin-button {
        padding: 0.6rem 1.5rem;
        font-size: 0.9rem;
      }
    }
    
    @media (max-width: 480px) {
      .container {
        padding: 0.5rem;
      }
      
      .game-controls {
        min-width: 200px;
        padding: 0.75rem;
        border-radius: 1rem;
      }
      
      .control-display {
        padding: 0.5rem;
        margin-bottom: 0.75rem;
      }
      
      .balance-display {
        font-size: 1rem;
      }
      
      .spin-button {
        padding: 0.5rem 1.25rem;
        font-size: 0.8rem;
      }
    }
    
    @media (max-width: 360px) {
      .game-controls {
        min-width: 180px;
        padding: 0.5rem;
      }
      
      .balance-display {
        font-size: 0.9rem;
      }
      
      .spin-button {
        padding: 0.4rem 1rem;
        font-size: 0.75rem;
      }
    }
  `

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${brandName} - ${headline || 'Premium Casino Experience'}</title>
      <style>${css}</style>
    </head>
    <body>
      <!-- Preloader -->
      <div id="preloader" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(135deg, #1e1b4b 0%, #4c1d95 50%, #581c87 100%); z-index: 9999; display: flex; align-items: center; justify-content: center;">
        <div style="text-align: center;">
          <div style="margin-bottom: 2rem;">
            <!-- Mini Slot Machine Animation -->
            <div style="background: linear-gradient(135deg, rgba(147, 51, 234, 0.8), rgba(236, 72, 153, 0.8)); border-radius: 2rem; padding: 1.5rem; border: 4px solid #fbbf24; box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.5), 0 0 40px rgba(251, 191, 36, 0.4); margin: 0 auto; width: fit-content; position: relative;">
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; background: linear-gradient(135deg, #1e293b, #0f172a); padding: 1rem; border-radius: 1rem; box-shadow: inset 0 4px 6px rgba(0, 0, 0, 0.5); border: 3px solid rgba(251, 191, 36, 0.3);">
                <div style="width: 3.5rem; height: 3.5rem; background: linear-gradient(135deg, #fbbf24, #f97316); border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; font-size: 1.75rem; animation: spin 0.5s linear infinite; box-shadow: 0 4px 6px rgba(251, 191, 36, 0.5); border: 2px solid rgba(255, 255, 255, 0.2);">🍑</div>
                <div style="width: 3.5rem; height: 3.5rem; background: linear-gradient(135deg, #fbbf24, #f97316); border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; font-size: 1.75rem; animation: spin 0.5s linear infinite; animation-delay: 0.1s; box-shadow: 0 4px 6px rgba(251, 191, 36, 0.5); border: 2px solid rgba(255, 255, 255, 0.2);">💎</div>
                <div style="width: 3.5rem; height: 3.5rem; background: linear-gradient(135deg, #fbbf24, #f97316); border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; font-size: 1.75rem; animation: spin 0.5s linear infinite; animation-delay: 0.2s; box-shadow: 0 4px 6px rgba(251, 191, 36, 0.5); border: 2px solid rgba(255, 255, 255, 0.2);">🔔</div>
                <div style="width: 3.5rem; height: 3.5rem; background: linear-gradient(135deg, #fbbf24, #f97316); border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; font-size: 1.75rem; animation: spin 0.5s linear infinite; animation-delay: 0.05s; box-shadow: 0 4px 6px rgba(251, 191, 36, 0.5); border: 2px solid rgba(255, 255, 255, 0.2);">⭐</div>
                <div style="width: 3.5rem; height: 3.5rem; background: linear-gradient(135deg, #fbbf24, #f97316); border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; font-size: 1.75rem; animation: spin 0.5s linear infinite; animation-delay: 0.15s; box-shadow: 0 4px 6px rgba(251, 191, 36, 0.5); border: 2px solid rgba(255, 255, 255, 0.2);">🍀</div>
                <div style="width: 3.5rem; height: 3.5rem; background: linear-gradient(135deg, #fbbf24, #f97316); border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; font-size: 1.75rem; animation: spin 0.5s linear infinite; animation-delay: 0.25s; box-shadow: 0 4px 6px rgba(251, 191, 36, 0.5); border: 2px solid rgba(255, 255, 255, 0.2);">🍇</div>
                <div style="width: 3.5rem; height: 3.5rem; background: linear-gradient(135deg, #fbbf24, #f97316); border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; font-size: 1.75rem; animation: spin 0.5s linear infinite; animation-delay: 0.3s; box-shadow: 0 4px 6px rgba(251, 191, 36, 0.5); border: 2px solid rgba(255, 255, 255, 0.2);">💰</div>
                <div style="width: 3.5rem; height: 3.5rem; background: linear-gradient(135deg, #fbbf24, #f97316); border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; font-size: 1.75rem; animation: spin 0.5s linear infinite; animation-delay: 0.2s; box-shadow: 0 4px 6px rgba(251, 191, 36, 0.5); border: 2px solid rgba(255, 255, 255, 0.2);">🍋</div>
                <div style="width: 3.5rem; height: 3.5rem; background: linear-gradient(135deg, #fbbf24, #f97316); border-radius: 0.75rem; display: flex; align-items: center; justify-content: center; font-size: 1.75rem; animation: spin 0.5s linear infinite; animation-delay: 0.1s; box-shadow: 0 4px 6px rgba(251, 191, 36, 0.5); border: 2px solid rgba(255, 255, 255, 0.2);">🍑</div>
              </div>
            </div>
          </div>
          <h1 style="font-size: 3rem; font-weight: 900; background: linear-gradient(135deg, #fbbf24, #fb923c, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 1rem; animation: pulse 2s infinite; filter: drop-shadow(0 4px 8px rgba(251, 191, 36, 0.6)) drop-shadow(0 0 20px rgba(236, 72, 153, 0.4));">
            💎 BONANZA BILLION 💎
          </h1>
          <p style="color: #fbbf24; font-size: 1.5rem; font-weight: 900; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8), 0 0 20px rgba(251, 191, 36, 0.6); letter-spacing: 0.05em;">Loading your casino experience...</p>
        </div>
      </div>
      <div style="min-height: 100vh; position: relative; overflow: hidden;">
        <!-- Animated Background Orbs -->
        <div style="position: absolute; inset: 0;">
          <div style="position: absolute; top: 5rem; left: 5rem; width: 10rem; height: 10rem; background: radial-gradient(circle, rgba(251, 191, 36, 0.25) 0%, transparent 70%); border-radius: 50%; animation: pulse 3s infinite; filter: blur(40px);"></div>
          <div style="position: absolute; top: 15rem; right: 8rem; width: 12rem; height: 12rem; background: radial-gradient(circle, rgba(236, 72, 153, 0.25) 0%, transparent 70%); border-radius: 50%; animation: pulse 4s infinite; filter: blur(40px); animation-delay: 0.5s;"></div>
          <div style="position: absolute; bottom: 10rem; left: 12rem; width: 14rem; height: 14rem; background: radial-gradient(circle, rgba(147, 51, 234, 0.25) 0%, transparent 70%); border-radius: 50%; animation: pulse 3.5s infinite; filter: blur(40px); animation-delay: 1s;"></div>
          <div style="position: absolute; bottom: 5rem; right: 5rem; width: 8rem; height: 8rem; background: radial-gradient(circle, rgba(255, 20, 147, 0.25) 0%, transparent 70%); border-radius: 50%; animation: pulse 4.5s infinite; filter: blur(40px); animation-delay: 1.5s;"></div>
          <div style="position: absolute; top: 50%; left: 50%; width: 16rem; height: 16rem; background: radial-gradient(circle, rgba(192, 38, 211, 0.15) 0%, transparent 70%); border-radius: 50%; animation: pulse 5s infinite; filter: blur(50px); transform: translate(-50%, -50%); animation-delay: 2s;"></div>
        </div>

        <!-- Header -->
        <div style="position: relative; z-index: 10; text-align: center; padding: 2rem 0;">
          <!-- Casino Brand Logo - Perfect for iGaming Affiliates -->
          ${logoUrl ? `
          <div style="margin-bottom: 2rem;">
            <div style="background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 100%); backdrop-filter: blur(12px); border-radius: 1.5rem; padding: 1.5rem; display: inline-block; border: 2px solid rgba(251, 191, 36, 0.4); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); transition: all 0.3s ease;">
              <div style="background: rgba(255,255,255,0.9); border-radius: 1rem; padding: 1rem; box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);">
                <img 
                  src="${logoUrl}" 
                  alt="${brandName} Casino Logo"
                  style="height: 5rem; width: auto; max-width: 15rem; object-fit: contain; margin: 0 auto; display: block; filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2)) brightness(1.1);"
                  onerror="this.parentElement.parentElement.parentElement.style.display='none';"
                />
              </div>
            </div>
            <div style="margin-top: 0.75rem;">
              <div style="display: inline-flex; align-items: center; padding: 0.25rem 1rem; background: rgba(251, 191, 36, 0.2); border: 1px solid rgba(251, 191, 36, 0.3); border-radius: 9999px;">
                <span style="color: #fbbf24; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.05em;">🎰 OFFICIAL PARTNER</span>
              </div>
            </div>
          </div>
          ` : ''}
          <h1 style="font-size: 3.5rem; font-weight: 900; background: linear-gradient(135deg, #fbbf24 0%, #fb923c 30%, #ec4899 60%, #c026d3 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 1.5rem; filter: drop-shadow(0 4px 10px rgba(251, 191, 36, 0.8)) drop-shadow(0 0 30px rgba(236, 72, 153, 0.5)) drop-shadow(0 6px 12px rgba(0, 0, 0, 0.6)); letter-spacing: 0.02em;">
            💎 ${brandName.toUpperCase()} 💎
          </h1>
          <p style="font-size: 1.75rem; font-weight: 900; color: #ffffff; text-shadow: 0 3px 6px rgba(0, 0, 0, 0.9), 0 0 25px rgba(251, 191, 36, 0.7), 0 0 40px rgba(236, 72, 153, 0.4); background: linear-gradient(135deg, rgba(147, 51, 234, 0.4) 0%, rgba(192, 38, 211, 0.5) 50%, rgba(147, 51, 234, 0.4) 100%); padding: 1rem 2.5rem; border-radius: 1rem; display: inline-block; margin-top: 1rem; border: 3px solid rgba(251, 191, 36, 0.5); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 40px rgba(251, 191, 36, 0.3) inset; backdrop-filter: blur(8px); letter-spacing: 0.03em;">
            ⭐ ${headline || 'WIN BIG WITH BONANZA BILLION SLOTS!'} ⭐
          </p>
        </div>

        <!-- Main Game Area -->
        <main style="position: relative; z-index: 10; padding: 0 1rem 2rem; display: flex; justify-content: center; gap: 2rem; max-width: 1200px; margin: 0 auto; flex-wrap: wrap;">
          
          <!-- Slot Machine Container -->
          <div class="slot-machine">
            <div style="text-align: center; margin-bottom: 1.5rem;">
              <h2 style="font-size: 1.75rem; font-weight: 900; background: linear-gradient(135deg, #fbbf24 0%, #fb923c 50%, #f97316 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 0.25rem; filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.8)) drop-shadow(0 0 15px rgba(251, 191, 36, 0.6)); letter-spacing: 0.05em;">${brandName.toUpperCase()}</h2>
              <h3 style="font-size: 1.5rem; font-weight: 900; color: #ffffff; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8), 0 0 20px rgba(251, 191, 36, 0.8), 0 0 30px rgba(236, 72, 153, 0.4); letter-spacing: 0.1em;">💎 SLOTS 💎</h3>
            </div>

            <!-- 3x3 Slot Grid -->
            <div class="slot-grid" id="slotGrid">
              <div class="slot-square" id="slot0"><span style="position: relative; z-index: 2;">🍑</span></div>
              <div class="slot-square" id="slot1"><span style="position: relative; z-index: 2;">💎</span></div>
              <div class="slot-square" id="slot2"><span style="position: relative; z-index: 2;">🔔</span></div>
              <div class="slot-square" id="slot3"><span style="position: relative; z-index: 2;">⭐</span></div>
              <div class="slot-square" id="slot4"><span style="position: relative; z-index: 2;">🍀</span></div>
              <div class="slot-square" id="slot5"><span style="position: relative; z-index: 2;">🍇</span></div>
              <div class="slot-square" id="slot6"><span style="position: relative; z-index: 2;">💰</span></div>
              <div class="slot-square" id="slot7"><span style="position: relative; z-index: 2;">🍋</span></div>
              <div class="slot-square" id="slot8"><span style="position: relative; z-index: 2;">🍑</span></div>
            </div>
          </div>

          <!-- Game Controls Panel -->
          <div class="game-controls">
            <div style="text-align: center; margin-bottom: 1.5rem;">
              <h2 style="font-size: 1.75rem; font-weight: 900; background: linear-gradient(135deg, #fbbf24 0%, #fb923c 50%, #f97316 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.8)) drop-shadow(0 0 15px rgba(251, 191, 36, 0.6)); letter-spacing: 0.05em;">🎮 GAME CONTROLS 🎮</h2>
            </div>

            <!-- Bet Display -->
            <div class="control-display">
              <div style="background: linear-gradient(135deg, #fbbf24 0%, #fb923c 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-weight: 900; text-align: center; font-size: 1.5rem; filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8)) drop-shadow(0 0 15px rgba(251, 191, 36, 0.8)); letter-spacing: 0.05em;">💰 BET: $10</div>
            </div>

            <!-- Balance Display -->
            <div class="control-display">
              <div style="background: linear-gradient(135deg, #10b981 0%, #22c55e 50%, #84cc16 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-weight: 900; text-align: center; font-size: 1.5rem; filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8)) drop-shadow(0 0 15px rgba(34, 197, 94, 0.8)); letter-spacing: 0.05em;">💵 BALANCE: $1,000</div>
            </div>

            <!-- Spin Button -->
            <button class="spin-button" onclick="spinSlots()">
              🎰 ${cta || 'SPIN TO WIN'}
            </button>
          </div>
        </main>

        <!-- Bottom Disclaimer Section -->
        <div style="position: relative; z-index: 10; text-align: center; padding: 2rem 0;">
          <div class="disclaimer">
            <p style="color: #fbbf24; font-size: 0.875rem; font-weight: 700; letter-spacing: 0.025em; display: flex; align-items: center; justify-content: center; gap: 0.5rem; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);">
              <span style="color: #fca5a5; font-weight: 900; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);">18+</span>
              <span style="color: #ffffff;">•</span>
              <span>Gamble Responsibly</span>
              <span style="color: #ffffff;">•</span>
              <span>Terms Apply</span>
            </p>
          </div>
        </div>
      </div>

      <style>
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes spin {
          0% { transform: rotateY(0deg); }
          50% { transform: rotateY(180deg); }
          100% { transform: rotateY(360deg); }
        }
        
        @keyframes slotRoll {
          0% { 
            transform: translateY(0%) scale(1);
            filter: blur(0px);
            opacity: 1;
          }
          10% {
            transform: translateY(-10%) scale(0.95);
            filter: blur(2px);
            opacity: 0.8;
          }
          50% { 
            transform: translateY(-100%) scale(0.9);
            filter: blur(4px);
            opacity: 0.6;
          }
          51% {
            transform: translateY(100%) scale(0.9);
            filter: blur(4px);
            opacity: 0.6;
          }
          90% {
            transform: translateY(10%) scale(0.95);
            filter: blur(2px);
            opacity: 0.8;
          }
          100% { 
            transform: translateY(0%) scale(1);
            filter: blur(0px);
            opacity: 1;
          }
        }
        
        .spinning {
          animation: slotRoll 0.15s ease-in-out infinite;
          position: relative;
        }
      </style>
      
      <script>
        // Slot Game Class - Exact replica of reference template
        class SlotGame {
            constructor() {
                this.symbols = ['💎', '🍒', '🔔', '🍋', '⭐', '🍊', '🍇'];
                this.reels = [];
                this.balance = 1000;
                this.bet = 10;
                this.isSpinning = false;
                this.spinCount = 0;
                
                this.initializeReels();
                this.setupEventListeners();
                this.updateDisplay();
            }

            initializeReels() {
                // Convert 3x3 grid to 3 reels for compatibility
                for (let i = 0; i < 3; i++) {
                    const reel = {
                        slots: [
                            document.getElementById('slot' + (i * 3)),
                            document.getElementById('slot' + (i * 3 + 1)), 
                            document.getElementById('slot' + (i * 3 + 2))
                        ]
                    };
                    this.reels.push(reel);
                    this.randomizeReel(reel);
                }
            }
            
            randomizeReel(reel) {
                reel.slots.forEach(slot => {
                    const randomSymbol = this.symbols[Math.floor(Math.random() * this.symbols.length)];
                    slot.innerHTML = '<span style="position: relative; z-index: 2;">' + randomSymbol + '</span>';
                });
            }

            setupEventListeners() {
                document.querySelector('.spin-button').addEventListener('click', () => this.spin());
            }

            spin() {
                if (this.isSpinning) return;
                
                if (this.balance < this.bet) {
                    alert('Insufficient balance!');
                    return;
                }
                
                this.isSpinning = true;
                this.balance -= this.bet;
                this.spinCount++;
                this.updateDisplay();
                
                const button = document.querySelector('.spin-button');
                button.style.opacity = '0.7';
                button.style.transform = 'scale(0.95)';
                
                // Start spinning animation and rapid symbol change
                const symbolChangeIntervals = [];
                this.reels.forEach(reel => {
                    reel.slots.forEach(slot => {
                        slot.classList.add('spinning');
                        
                        // Rapidly change symbols during spin
                        const interval = setInterval(() => {
                            const randomSymbol = this.symbols[Math.floor(Math.random() * this.symbols.length)];
                            slot.innerHTML = '<span style="position: relative; z-index: 2;">' + randomSymbol + '</span>';
                        }, 80);
                        symbolChangeIntervals.push(interval);
                    });
                });

                // Spin for 1.2 seconds (faster)
                setTimeout(() => {
                    // Clear all symbol change intervals
                    symbolChangeIntervals.forEach(interval => clearInterval(interval));
                    this.stopSpin();
                }, 1200);
            }

            stopSpin() {
                // Stop reels with staggered timing
                this.reels.forEach((reel, index) => {
                    setTimeout(() => {
                        reel.slots.forEach(slot => {
                            slot.classList.remove('spinning');
                        });
                        
                        // Set final symbols
                        this.randomizeReel(reel);
                        
                        // Check if all reels have stopped
                        if (index === this.reels.length - 1) {
                            setTimeout(() => {
                                this.isSpinning = false;
                                const button = document.querySelector('.spin-button');
                                button.style.opacity = '1';
                                button.style.transform = 'scale(1)';
                                
                                // Force win on 2nd attempt exactly like reference
                                if (this.spinCount === 2) {
                                    this.forceWinWithDelay();
                                } else {
                                    this.checkWin();
                                }
                            }, 150);
                        }
                    }, index * 200);
                });
            }

            checkWin() {
                const slots = [];
                for (let i = 0; i < 9; i++) {
                    slots.push(document.getElementById('slot' + i).textContent);
                }
                
                // Check for winning combinations
                const winPatterns = [
                    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
                    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
                    [0, 4, 8], [2, 4, 6] // diagonals
                ];
                
                let hasWin = false;
                winPatterns.forEach(pattern => {
                    if (slots[pattern[0]] === slots[pattern[1]] && slots[pattern[1]] === slots[pattern[2]]) {
                        hasWin = true;
                        // Highlight winning pattern
                        pattern.forEach(index => {
                            document.getElementById('slot' + index).style.background = 'linear-gradient(to bottom, #fbbf24, #f59e0b)';
                            document.getElementById('slot' + index).style.transform = 'scale(1.1)';
                        });
                    }
                });
                
                if (hasWin) {
                    const winAmount = this.getWinAmount(slots[0]);
                    this.balance += winAmount;
                    this.updateDisplay();
                    
                    setTimeout(() => {
                        this.showBonusModal();
                        // Reset highlighting after celebration
                        for (let i = 0; i < 9; i++) {
                            const slot = document.getElementById('slot' + i);
                            slot.style.background = 'linear-gradient(to bottom, #fb923c, #eab308)';
                            slot.style.transform = 'scale(1)';
                        }
                    }, 1200);
                }
            }

            forceWinWithDelay() {
                // Force a jackpot win with diamonds - exactly like reference
                for (let i = 0; i < 9; i++) {
                    document.getElementById('slot' + i).textContent = '💎';
                    document.getElementById('slot' + i).style.background = 'linear-gradient(to bottom, #fbbf24, #f59e0b)';
                    document.getElementById('slot' + i).style.transform = 'scale(1.1)';
                    document.getElementById('slot' + i).style.boxShadow = '0 0 30px rgba(255, 215, 0, 1)';
                }
                
                const winAmount = 10000;
                this.balance += winAmount;
                this.updateDisplay();
                
                // Wait 1.2 seconds then show bonus modal (faster)
                setTimeout(() => {
                    this.showBonusModal();
                    // Reset highlighting
                    for (let i = 0; i < 9; i++) {
                        const slot = document.getElementById('slot' + i);
                        slot.style.background = 'linear-gradient(to bottom, #fb923c, #eab308)';
                        slot.style.transform = 'scale(1)';
                        slot.style.boxShadow = 'none';
                    }
                }, 1200);
            }

            getWinAmount(symbol) {
                const payouts = {
                    '💎': 10000,
                    '🔔': 5000,
                    '⭐': 3000,
                    '🍒': 2000,
                    '🍋': 1500,
                    '🍊': 1000,
                    '🍇': 500
                };
                return payouts[symbol] || 0;
            }

            updateDisplay() {
                // Update balance display if it exists
                const balanceEl = document.querySelector('.control-display:nth-child(2) div');
                if (balanceEl) {
                    balanceEl.textContent = \`BALANCE: $\${this.balance.toLocaleString()}\`;
                }
            }
            
            showBonusModal() {
                // Create and show modal exactly like reference
                const modal = document.createElement('div');
                modal.style.cssText = \`
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                \`;
                
                const content = document.createElement('div');
                content.style.cssText = \`
                    background: linear-gradient(135deg, #1e3a5f, #2c5282, #3182ce);
                    padding: 50px;
                    border-radius: 25px;
                    text-align: center;
                    border: 4px solid #FFD700;
                    box-shadow: 0 0 80px rgba(255, 215, 0, 0.6);
                    max-width: 600px;
                    width: 90%;
                \`;
                
                content.innerHTML = \`
                    <h2 style="font-size: 2.5rem; margin-bottom: 20px; background: linear-gradient(45deg, #FFD700, #FFA500, #FF6B6B); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">🎉 JACKPOT!</h2>
                    <p style="font-size: 1.2rem; margin-bottom: 30px; color: white;">🎁 <strong>JACKPOT BONUS UNLOCKED!</strong><br><br>You've unlocked your $1000 Welcome Bonus + 100 Free Spins<br><br>Claim your bonus now and keep winning!</p>
                    <a href="https://your-casino-affiliate-link.com" target="_blank" style="background: linear-gradient(135deg, #00ff88 0%, #32cd32 50%, #228b22 100%); color: #000; font-size: 1.6rem; font-weight: 800; padding: 20px 50px; border: 3px solid #fff; border-radius: 60px; text-decoration: none; display: inline-block; text-transform: uppercase; letter-spacing: 2px; box-shadow: 0 15px 40px rgba(0, 255, 136, 0.4);">🎁 CLAIM $1000 BONUS NOW!</a>
                    <div style="position: absolute; top: 15px; right: 25px; color: #aaa; font-size: 28px; font-weight: bold; cursor: pointer;" onclick="this.parentElement.parentElement.remove();">&times;</div>
                \`;
                
                modal.appendChild(content);
                document.body.appendChild(modal);
                
                // Close on background click
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        modal.remove();
                    }
                });
            }
        }

        // Hide preloader after 1.5 seconds (faster)
        setTimeout(() => {
          const preloader = document.getElementById('preloader');
          if (preloader) {
            preloader.style.opacity = '0';
            preloader.style.transition = 'opacity 0.3s ease-out';
            setTimeout(() => {
              preloader.style.display = 'none';
            }, 300);
          }
        }, 1500);

        // Initialize the game when page loads
        document.addEventListener('DOMContentLoaded', () => {
            new SlotGame();
        });
        
        // Add initial pulse animation
        window.addEventListener('load', () => {
          setTimeout(() => {
            for (let i = 0; i < 9; i++) {
              const slot = document.getElementById('slot' + i);
              if (slot) {
                slot.style.animation = 'pulse 2s infinite';
                slot.style.animationDelay = (i * 0.1) + 's';
              }
            }
          }, 3000); // Start after preloader is gone
        });
      </script>
    </body>
    </html>
  `

  return {
    html,
    css
  }
}
