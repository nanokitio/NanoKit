import { BrandConfig } from '../../lib/types'

export function renderTemplate(brand: BrandConfig): { html: string; css: string } {
  const brandName = brand.brandName || 'Cyber Casino'
  const logoUrl = brand.logoUrl || ''
  const colors = {
    primary: brand.colors?.primary || '#00ffff',
    secondary: brand.colors?.secondary || '#ff1493', 
    accent: brand.colors?.accent || '#ffff00'
  }
  const headline = brand.copy?.headline || `${brandName.toUpperCase()} CYBER WINS`
  const subheadline = brand.copy?.subheadline || 'Enter the neon grid where digital fortunes await'
  const cta = brand.copy?.cta || 'ENTER THE GRID'
  const ctaUrl = brand.ctaUrl || 'https://your-casino-url.com'
  const backgroundColor = brand.backgroundColor || '#000000'
  const backgroundImage = brand.backgroundImage || ''

  const css = `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body { 
      font-family: 'Orbitron', monospace; 
      background: ${backgroundColor};
      color: white; 
      min-height: 100vh; 
      overflow-x: hidden; 
    }
    
    .synth-container {
      font-family: 'Orbitron', monospace;
      min-height: 100vh;
      background: ${backgroundImage ? `url('${backgroundImage}') center/cover no-repeat` : backgroundColor};
      position: relative;
      overflow: hidden;
    }
    
    .synth-container::before {
      content: '';
      position: absolute;
      inset: 0;
      background: ${backgroundImage ? 'linear-gradient(135deg, rgba(138, 43, 226, 0.5), rgba(0, 0, 0, 0.7), rgba(0, 139, 139, 0.5))' : 'linear-gradient(135deg, rgba(138, 43, 226, 0.9), rgba(0, 0, 0, 1), rgba(0, 139, 139, 0.9))'};
      z-index: 0;
    }
    
    .synth-grid {
      position: absolute;
      inset: 0;
      opacity: 0.2;
      background-image: 
        linear-gradient(cyan 1px, transparent 1px),
        linear-gradient(90deg, cyan 1px, transparent 1px);
      background-size: 50px 50px;
      animation: grid-move 20s linear infinite;
      z-index: 1;
    }
    
    .scan-lines {
      position: absolute;
      inset: 0;
      pointer-events: none;
      background: repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(0, 255, 255, 0.03) 2px,
        rgba(0, 255, 255, 0.03) 4px
      );
      animation: scan 2s linear infinite;
      z-index: 2;
    }
    
    
    .container {
      position: relative;
      z-index: 10;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 2rem 1rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .header {
      text-align: center;
      margin-bottom: 2rem;
    }
    
    .synth-title-container {
      margin-bottom: 1.5rem;
    }
    
    .main-title {
      font-size: 2.5rem;
      font-weight: 900;
      background: linear-gradient(90deg, cyan, #ff1493, yellow);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 1rem;
      letter-spacing: 0.1em;
      text-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
      animation: text-shimmer 3s ease-in-out infinite;
    }
    
    .synth-underline {
      height: 3px;
      background: linear-gradient(90deg, transparent, cyan, #ff1493, yellow, transparent);
      animation: underline-glow 3s ease-in-out infinite;
    }
    
    .subtitle {
      font-size: 1.125rem;
      color: rgba(0, 255, 255, 0.9);
      margin-bottom: 1.5rem;
      font-weight: 300;
      letter-spacing: 0.05em;
    }
    
    .bonus-timer {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      background: linear-gradient(90deg, rgba(255, 20, 147, 0.2), rgba(0, 255, 255, 0.2));
      backdrop-filter: blur(4px);
      border: 1px solid rgba(255, 20, 147, 0.5);
      color: rgba(255, 20, 147, 0.9);
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-family: monospace;
      font-size: 0.875rem;
      animation: border-pulse 2s ease-in-out infinite;
    }
    
    .timer-icon {
      color: yellow;
      animation: pulse 2s ease-in-out infinite;
    }
    
    .timer-text {
      letter-spacing: 0.1em;
    }
    
    .slot-machine {
      background: linear-gradient(135deg, rgba(138, 43, 226, 0.3), rgba(0, 139, 139, 0.3));
      backdrop-filter: blur(4px);
      border: 2px solid rgba(0, 255, 255, 0.5);
      border-radius: 1rem;
      padding: 2rem;
      margin-bottom: 2rem;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      position: relative;
    }
    
    .slot-machine::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(0, 255, 255, 0.05), rgba(255, 20, 147, 0.05));
      border-radius: 1rem;
      animation: pulse-slow 4s ease-in-out infinite;
    }
    
    .synth-border-glow {
      position: absolute;
      inset: 0;
      border-radius: 1rem;
      box-shadow: 
        inset 0 0 20px rgba(0, 255, 255, 0.1),
        0 0 20px rgba(0, 255, 255, 0.2),
        0 0 40px rgba(255, 20, 147, 0.1);
    }
    
    .prize-display {
      display: flex;
      justify-content: center;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .prize-item {
      background: linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(0, 255, 255, 0.2));
      border: 1px solid rgba(34, 197, 94, 0.6);
      border-radius: 0.5rem;
      padding: 1rem;
      text-align: center;
      backdrop-filter: blur(4px);
      animation: prize-glow-1 3s ease-in-out infinite;
    }
    
    .prize-item:nth-child(2) {
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(255, 20, 147, 0.2));
      border-color: rgba(139, 92, 246, 0.6);
      animation: prize-glow-2 3s ease-in-out infinite 0.5s;
    }
    
    .prize-icon {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }
    
    .prize-item:nth-child(1) .prize-icon { color: #22c55e; }
    .prize-item:nth-child(2) .prize-icon { color: #a855f7; }
    
    .prize-text {
      color: #22c55e;
      font-family: monospace;
      font-size: 0.875rem;
      letter-spacing: 0.05em;
    }
    
    .prize-item:nth-child(2) .prize-text { color: #c084fc; }
    
    .slot-game {
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(4px);
      border-radius: 0.75rem;
      padding: 1.5rem;
      border: 1px solid rgba(0, 255, 255, 0.3);
    }
    
    .slot-lines {
      margin-bottom: 1.5rem;
    }
    
    .rollover-line {
      display: flex;
      justify-content: center;
      gap: 0.75rem;
      padding: 0.75rem;
      background: linear-gradient(90deg, rgba(138, 43, 226, 0.2), rgba(0, 139, 139, 0.2));
      border-radius: 0.5rem;
      border: 1px solid rgba(255, 20, 147, 0.3);
      margin-bottom: 0.75rem;
    }
    
    .rollover-symbol {
      width: 5rem;
      height: 5rem;
      background: linear-gradient(135deg, rgba(0, 139, 139, 0.5), rgba(138, 43, 226, 0.5));
      border: 2px solid rgba(0, 255, 255, 0.6);
      border-radius: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(4px);
      transition: all 0.3s;
      animation: symbol-glow 2s ease-in-out infinite;
    }
    
    .rollover-icon {
      font-size: 1.5rem;
      color: rgba(0, 255, 255, 0.9);
      font-weight: bold;
    }
    
    .rollover-symbol.spinning {
      animation: synth-spin 0.1s linear infinite;
    }
    
    .spin-button {
      width: 100%;
      background: linear-gradient(90deg, rgba(255, 20, 147, 0.8), rgba(0, 255, 255, 0.8));
      color: white;
      font-family: 'Orbitron', monospace;
      font-weight: 900;
      font-size: 1.25rem;
      padding: 1rem 2rem;
      border-radius: 0.5rem;
      border: 2px solid rgba(255, 20, 147, 0.6);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(4px);
      cursor: pointer;
      transition: all 0.3s;
      animation: button-glow 2s ease-in-out infinite;
      letter-spacing: 0.1em;
    }
    
    .spin-button:hover {
      transform: scale(1.05);
      background: linear-gradient(90deg, rgba(255, 20, 147, 0.9), rgba(0, 255, 255, 0.9));
    }
    
    .spin-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      animation: pulse-fast 0.5s ease-in-out infinite;
    }
    
    .features {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .feature-item {
      background: linear-gradient(135deg, rgba(0, 139, 139, 0.3), rgba(138, 43, 226, 0.3));
      backdrop-filter: blur(4px);
      border: 1px solid rgba(0, 255, 255, 0.5);
      border-radius: 0.5rem;
      padding: 1rem;
      text-align: center;
      min-width: 140px;
    }
    
    .feature-item:nth-child(1) { animation: feature-glow-1 4s ease-in-out infinite; }
    .feature-item:nth-child(2) { animation: feature-glow-2 4s ease-in-out infinite 0.7s; border-color: rgba(255, 20, 147, 0.5); background: linear-gradient(135deg, rgba(255, 20, 147, 0.3), rgba(138, 43, 226, 0.3)); }
    .feature-item:nth-child(3) { animation: feature-glow-3 4s ease-in-out infinite 1.4s; border-color: rgba(255, 255, 0, 0.5); background: linear-gradient(135deg, rgba(255, 255, 0, 0.3), rgba(255, 140, 0, 0.3)); }
    
    .feature-icon {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }
    
    .feature-item:nth-child(1) .feature-icon { color: cyan; }
    .feature-item:nth-child(2) .feature-icon { color: #ff1493; }
    .feature-item:nth-child(3) .feature-icon { color: yellow; }
    
    .feature-text {
      font-family: monospace;
      font-size: 0.875rem;
      letter-spacing: 0.05em;
    }
    
    .feature-item:nth-child(1) .feature-text { color: rgba(0, 255, 255, 0.9); }
    .feature-item:nth-child(2) .feature-text { color: rgba(255, 20, 147, 0.9); }
    .feature-item:nth-child(3) .feature-text { color: rgba(255, 255, 0, 0.9); }
    
    .cta-section {
      text-align: center;
    }
    
    .cta-button {
      background: linear-gradient(90deg, #ff1493, #8a2be2, #00ffff);
      color: white;
      font-family: 'Orbitron', monospace;
      font-weight: 900;
      font-size: 1.5rem;
      padding: 1.5rem 3rem;
      border-radius: 0.5rem;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      backdrop-filter: blur(4px);
      border: 2px solid rgba(255, 20, 147, 0.6);
      cursor: pointer;
      transition: all 0.3s;
      animation: cta-glow 2s ease-in-out infinite;
      letter-spacing: 0.1em;
      text-decoration: none;
      display: inline-block;
    }
    
    .cta-button:hover {
      transform: scale(1.1);
      background: linear-gradient(90deg, #ff1493, #8a2be2, #00ffff);
    }
    
    .disclaimer {
      color: rgba(0, 255, 255, 0.4);
      font-size: 0.875rem;
      margin-top: 1.5rem;
      font-family: monospace;
      letter-spacing: 0.05em;
    }
    
    .modal {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.9);
      backdrop-filter: blur(4px);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 50;
      animation: fadeIn 0.3s ease-out;
    }
    
    .modal.show {
      display: flex;
    }
    
    .win-content {
      background: linear-gradient(135deg, rgba(0, 139, 139, 0.8), rgba(138, 43, 226, 0.8));
      backdrop-filter: blur(24px);
      border: 2px solid rgba(255, 20, 147, 0.6);
      padding: 2rem;
      border-radius: 1rem;
      text-align: center;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      max-width: 28rem;
      margin: 1rem;
      animation: modal-glow 3s ease-in-out infinite;
    }
    
    .win-title {
      font-size: 1.875rem;
      font-family: 'Orbitron', monospace;
      font-weight: 900;
      background: linear-gradient(90deg, #ff1493, #00ffff);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 1rem;
      letter-spacing: 0.05em;
    }
    
    .win-amount {
      font-size: 1.25rem;
      color: rgba(0, 255, 255, 0.9);
      margin-bottom: 0.5rem;
      font-family: monospace;
    }
    
    .win-amount-value {
      font-weight: bold;
      font-size: 1.5rem;
      color: #22c55e;
      animation: pulse 2s ease-in-out infinite;
    }
    
    .win-bonus {
      color: rgba(255, 20, 147, 0.9);
      margin-bottom: 1.5rem;
      font-family: monospace;
      letter-spacing: 0.05em;
    }
    
    .claim-btn {
      background: linear-gradient(90deg, #22c55e, #00ffff);
      color: white;
      font-family: 'Orbitron', monospace;
      font-weight: bold;
      padding: 1rem 2rem;
      border-radius: 0.5rem;
      font-size: 1.125rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(4px);
      border: 1px solid rgba(34, 197, 94, 0.5);
      cursor: pointer;
      transition: all 0.3s;
      margin-bottom: 0.75rem;
      width: 100%;
      animation: claim-glow 1.5s ease-in-out infinite;
      letter-spacing: 0.1em;
      text-decoration: none;
      display: inline-block;
    }
    
    .claim-btn:hover {
      transform: scale(1.05);
      background: linear-gradient(90deg, #16a34a, #00ffff);
    }
    
    .close-btn {
      background: none;
      border: none;
      color: rgba(0, 255, 255, 0.7);
      cursor: pointer;
      font-size: 0.875rem;
      font-family: monospace;
      letter-spacing: 0.05em;
    }
    
    .close-btn:hover {
      color: rgba(0, 255, 255, 1);
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
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
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
    
    /* Responsive Design for All Devices */
    @media (max-width: 1024px) {
      .main-title { font-size: 2.5rem; }
      .container { padding: 1.5rem; }
    }
    
    @media (max-width: 768px) {
      .main-title { font-size: 2rem; }
      .rollover-symbol { width: 3.75rem; height: 3.75rem; }
      .rollover-icon { font-size: 1.125rem; }
      .features { gap: 0.75rem; flex-wrap: wrap; }
      .feature-item { min-width: 120px; padding: 0.75rem; }
      .container { padding: 1rem; }
    }
    
    @media (max-width: 600px) {
      .main-title { font-size: 1.8rem; }
      .rollover-symbol { width: 3.5rem; height: 3.5rem; }
      .rollover-icon { font-size: 1rem; }
      .features { justify-content: center; }
      .feature-item { min-width: 100px; padding: 0.5rem; font-size: 0.8rem; }
    }
    
    @media (max-width: 480px) {
      .main-title { font-size: 1.5rem; line-height: 1.2; }
      .rollover-symbol { width: 3rem; height: 3rem; }
      .rollover-icon { font-size: 0.9rem; }
      .container { padding: 0.75rem; }
      .features { gap: 0.5rem; }
      .feature-item { min-width: 80px; padding: 0.4rem; font-size: 0.7rem; }
    }
    
    @media (max-width: 360px) {
      .main-title { font-size: 1.3rem; }
      .rollover-symbol { width: 2.5rem; height: 2.5rem; }
      .rollover-icon { font-size: 0.8rem; }
      .container { padding: 0.5rem; }
    }
  `

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${brandName} - Win Big!</title>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet">
    <style>${css}</style>
</head>
<body>
    <div class="synth-container">
        <div class="synth-grid"></div>
        <div class="scan-lines"></div>
        <div class="container">
            <header class="header">
                ${logoUrl ? `
                <!-- Casino Brand Logo - Perfect for iGaming Affiliates -->
                <div style="margin-bottom: 2rem;">
                    <div style="background: linear-gradient(135deg, rgba(0,255,255,0.2) 0%, rgba(128,0,128,0.15) 50%, rgba(255,20,147,0.2) 100%); backdrop-filter: blur(12px); border-radius: 1.5rem; padding: 1.5rem; display: inline-block; border: 2px solid rgba(0,255,255,0.5); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); transition: all 0.3s ease;">
                        <div style="background: rgba(255,255,255,0.95); border-radius: 1rem; padding: 1rem; box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);">
                            <img 
                                src="${logoUrl}" 
                                alt="${brandName} Casino Logo"
                                style="height: 5rem; width: auto; max-width: 17.5rem; object-fit: contain; margin: 0 auto; display: block; filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2)) brightness(1.1);"
                                onerror="this.parentElement.parentElement.parentElement.style.display='none';"
                            />
                        </div>
                    </div>
                    <div style="margin-top: 0.75rem;">
                        <div style="display: inline-flex; align-items: center; padding: 0.25rem 1rem; background: linear-gradient(90deg, rgba(0,255,255,0.2), rgba(255,20,147,0.2)); border: 1px solid rgba(0,255,255,0.4); border-radius: 9999px; backdrop-filter: blur(4px);">
                            <span style="color: #00ffff; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.05em; font-family: 'Orbitron', monospace;">🎰 OFFICIAL CYBER PARTNER</span>
                        </div>
                    </div>
                </div>
                ` : ''}
                <div class="synth-title-container">
                    <h1 class="main-title">◆ ${headline} ◆</h1>
                    <div class="synth-underline"></div>
                </div>
                <p class="subtitle">${subheadline}</p>
                <div class="bonus-timer">
                    <span class="timer-icon">▲</span>
                    <span class="timer-text">BONUS EXPIRES: <span id="countdown">05:55</span></span>
                    <span class="timer-icon">▲</span>
                </div>
            </header>
            <div class="slot-machine">
                <div class="synth-border-glow"></div>
                <div class="prize-display">
                    <div class="prize-item">
                        <div class="prize-icon">◆</div>
                        <div class="prize-text">MAX WIN<br>$5,000</div>
                    </div>
                    <div class="prize-item">
                        <div class="prize-icon">★</div>
                        <div class="prize-text">MIN WIN<br>$1,000</div>
                    </div>
                </div>
                <div class="slot-game">
                    <div class="slot-lines">
                        <div class="rollover-line">
                            <div class="rollover-symbol" id="slot0"><div class="rollover-icon">💎</div></div>
                            <div class="rollover-symbol" id="slot1"><div class="rollover-icon">▲</div></div>
                            <div class="rollover-symbol" id="slot2"><div class="rollover-icon">●</div></div>
                        </div>
                        <div class="rollover-line">
                            <div class="rollover-symbol" id="slot3"><div class="rollover-icon">★</div></div>
                            <div class="rollover-symbol" id="slot4"><div class="rollover-icon">◆</div></div>
                            <div class="rollover-symbol" id="slot5"><div class="rollover-icon">◇</div></div>
                        </div>
                        <div class="rollover-line">
                            <div class="rollover-symbol" id="slot6"><div class="rollover-icon">▼</div></div>
                            <div class="rollover-symbol" id="slot7"><div class="rollover-icon">💎</div></div>
                            <div class="rollover-symbol" id="slot8"><div class="rollover-icon">★</div></div>
                        </div>
                    </div>
                    <button class="spin-button" id="spinButton"><span>▲ EXECUTE SPIN ▲</span></button>
                </div>
            </div>
            <div class="features">
                <div class="feature-item">
                    <div class="feature-icon">◆</div>
                    <div class="feature-text">INSTANT<br>PAYOUTS</div>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">▲</div>
                    <div class="feature-text">WELCOME<br>BONUS</div>
                </div>
                <div class="feature-item">
                    <div class="feature-icon">●</div>
                    <div class="feature-text">24/7<br>SUPPORT</div>
                </div>
            </div>
            <div class="cta-section">
                <a href="${ctaUrl}" target="_blank" class="cta-button" id="playNowBtn"><span>★ ${cta} ★</span></a>
                <p class="disclaimer">18+ ONLY • DIGITAL RESPONSIBILITY • TERMS APPLY</p>
            </div>
        </div>
        <div id="winModal" class="modal">
            <div class="win-content">
                <h2 class="win-title">◆ JACKPOT ACHIEVED ◆</h2>
                <p class="win-amount">CREDIT TRANSFER: <span class="win-amount-value">$1,000</span></p>
                <p class="win-bonus">★ BONUS: 50 FREE EXECUTIONS ★</p>
                <a href="${ctaUrl}" target="_blank" class="claim-btn" id="claimBtn">▲ CLAIM REWARDS ▲</a>
                <button class="close-btn" id="closeModal">[ CLOSE TERMINAL ]</button>
            </div>
        </div>
    </div>
    <script>
        // Countdown Timer - Starts at 5:55 and counts down
        let timeRemaining = 5 * 60 + 55; // 5 minutes 55 seconds
        const countdownElement = document.getElementById('countdown');
        
        function updateCountdown() {
            const minutes = Math.floor(timeRemaining / 60);
            const seconds = timeRemaining % 60;
            countdownElement.textContent = \`\${minutes.toString().padStart(2, '0')}:\${seconds.toString().padStart(2, '0')}\`;
            
            if (timeRemaining > 0) {
                timeRemaining--;
            } else {
                // Timer expired - reset to 5:55
                timeRemaining = 5 * 60 + 55;
            }
        }
        
        // Update countdown every second
        setInterval(updateCountdown, 1000);
        updateCountdown(); // Initial call
        
        let spinCount = 0;
        let isSpinning = false;
        const symbols = ['◆', '▲', '●', '★', '◇', '▼'];
        
        function updateSlotSymbols() {
            for (let i = 0; i < 9; i++) {
                const slot = document.getElementById('slot' + i);
                if (slot) {
                    const icon = slot.querySelector('.rollover-icon');
                    if (icon) {
                        if (spinCount >= 2) {
                            icon.textContent = '★';
                        } else {
                            icon.textContent = symbols[Math.floor(Math.random() * symbols.length)];
                        }
                    }
                }
            }
        }
        
        function showWinModal() {
            const modal = document.getElementById('winModal');
            modal.classList.add('show');
        }
        
        document.getElementById('spinButton').addEventListener('click', function() {
            if (isSpinning) return;
            
            isSpinning = true;
            spinCount++;
            
            const button = this;
            const buttonText = button.querySelector('span');
            buttonText.textContent = '◆ PROCESSING ◆';
            button.disabled = true;
            
            const slotSymbols = document.querySelectorAll('.rollover-symbol');
            slotSymbols.forEach(symbol => {
                symbol.classList.add('spinning');
            });
            
            const spinInterval = setInterval(() => {
                for (let i = 0; i < 9; i++) {
                    const slot = document.getElementById('slot' + i);
                    if (slot) {
                        const icon = slot.querySelector('.rollover-icon');
                        if (icon) {
                            icon.textContent = symbols[Math.floor(Math.random() * symbols.length)];
                        }
                    }
                }
            }, 100);
            
            setTimeout(() => {
                clearInterval(spinInterval);
                
                slotSymbols.forEach(symbol => {
                    symbol.classList.remove('spinning');
                });
                
                updateSlotSymbols();
                
                buttonText.textContent = '▲ EXECUTE SPIN ▲';
                button.disabled = false;
                isSpinning = false;
                
                if (spinCount === 2) {
                    setTimeout(() => {
                        showWinModal();
                    }, 500);
                }
            }, 2000);
        });

        document.getElementById('closeModal').addEventListener('click', function() {
            const modal = document.getElementById('winModal');
            modal.classList.remove('show');
        });
    </script>
</body>
</html>`

  return { html, css }
}
