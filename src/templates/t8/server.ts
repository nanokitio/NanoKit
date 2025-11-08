import { BrandConfig } from '../../lib/types'

export function renderTemplate(brand: BrandConfig): { html: string; css: string } {
  // Safely extract brand data with fallbacks
  const brandName = brand.brandName || 'Your Brand'
  const logoUrl = brand.logoUrl || ''
  const colors = {
    primary: brand.colors?.primary || '#FFD700',
    secondary: brand.colors?.secondary || '#FF6B35', 
    accent: brand.colors?.accent || '#4ECDC4'
  }
  const headline = brand.copy?.headline || 'SPIN the lucky wheel to get the bonuses'
  const subheadline = brand.copy?.subheadline || 'Win amazing prizes and free spins!'
  const cta = brand.copy?.cta || 'Get the bonus'
  const ctaUrl = brand.ctaUrl || '#'
  const backgroundColor = (brand as any).backgroundColor || '#0a0a2e'
  const backgroundImage = (brand as any).backgroundImage || ''

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
      font-family: 'Montserrat', sans-serif;
      line-height: 1.6;
      color: #ffffff;
      background: ${backgroundImage ? `url('${backgroundImage}') center/cover no-repeat, ${backgroundColor}` : `linear-gradient(135deg, ${backgroundColor} 0%, #16213e 50%, #0f3460 100%)`};
      min-height: 100vh;
      overflow-x: hidden;
    }
    
    .gates-olympus-wrapper {
      min-height: 100vh;
      position: relative;
    }
    
    .shadow {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      pointer-events: none;
    }
    
    .shadow img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .mobile-shadow {
      display: none;
    }
    
    .container {
      position: relative;
      z-index: 2;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .header {
      display: flex;
      justify-content: center;
      padding: 20px 0;
    }
    
    .logo img {
      height: 60px;
      width: auto;
      cursor: pointer;
      transition: transform 0.3s ease;
    }
    
    .logo img:hover {
      transform: scale(1.05);
    }
    
    .content {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    
    .zeus-character {
      position: absolute;
      top: -50px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 3;
    }
    
    .zeus img {
      height: 200px;
      width: auto;
    }
    
    .mobile-zeus {
      display: none;
    }
    
    .wheel-section {
      margin: 100px 0 50px 0;
    }
    
    .wheel-wrapper {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .wheel-arrow {
      width: 0;
      height: 0;
      border-left: 15px solid transparent;
      border-right: 15px solid transparent;
      border-bottom: 30px solid var(--brand-accent);
      position: absolute;
      top: -15px;
      z-index: 5;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
    }
    
    .wheel-spinner {
      width: 300px;
      height: 300px;
      border-radius: 50%;
      position: relative;
      background: conic-gradient(
        from 0deg,
        var(--brand-primary) 0deg 90deg,
        var(--brand-secondary) 90deg 180deg,
        var(--brand-accent) 180deg 270deg,
        #4ecdc4 270deg 360deg
      );
      border: 8px solid var(--brand-accent);
      box-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
      transition: transform 3s cubic-bezier(0.23, 1, 0.32, 1);
    }
    
    .wheel-spinner.spinning {
      transform: rotate(1440deg);
    }
    
    .wheel-button {
      margin-top: 30px;
      background: linear-gradient(45deg, var(--brand-primary), var(--brand-secondary));
      border: none;
      border-radius: 50px;
      padding: 15px 40px;
      font-size: 18px;
      font-weight: 900;
      color: white;
      cursor: pointer;
      text-transform: uppercase;
      letter-spacing: 2px;
      box-shadow: 0 8px 25px rgba(255, 107, 53, 0.4);
      transition: all 0.3s ease;
    }
    
    .wheel-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 35px rgba(255, 107, 53, 0.6);
    }
    
    .wheel-button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    
    .title-section {
      text-align: center;
      max-width: 600px;
      margin: 0 auto;
    }
    
    .main-title {
      font-size: 2.5rem;
      font-weight: 900;
      color: var(--brand-accent);
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
      margin-bottom: 20px;
      line-height: 1.2;
    }
    
    .main-title .orange {
      color: var(--brand-secondary);
    }
    
    .subtitle {
      font-size: 1.2rem;
      color: #ffffff;
      margin-bottom: 30px;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.6);
    }
    
    .cta-button {
      background: linear-gradient(45deg, var(--brand-primary), var(--brand-accent));
      border: none;
      border-radius: 50px;
      padding: 20px 50px;
      font-size: 20px;
      font-weight: 900;
      color: white;
      cursor: pointer;
      text-transform: uppercase;
      letter-spacing: 2px;
      box-shadow: 0 8px 25px rgba(255, 107, 53, 0.4);
      transition: all 0.3s ease;
      margin-top: 30px;
    }
    
    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 35px rgba(255, 107, 53, 0.6);
    }
    
    .footer {
      margin-top: auto;
      padding: 20px 0;
      text-align: center;
      color: #ffffff;
      font-size: 12px;
    }
    
    .footer-links {
      margin-top: 10px;
    }
    
    .footer-links a {
      color: #ffffff;
      text-decoration: none;
      margin: 0 5px;
    }
    
    .footer-links a:hover {
      text-decoration: underline;
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
    
    .modal-content {
      background: linear-gradient(135deg, var(--brand-accent), var(--brand-primary));
      border-radius: 20px;
      padding: 40px;
      text-align: center;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
      max-width: 400px;
      margin: 20px;
    }
    
    .modal h2 {
      font-size: 2rem;
      font-weight: 900;
      color: #0a0a2e;
      margin-bottom: 20px;
    }
    
    .modal h3 {
      font-size: 1.5rem;
      font-weight: 800;
      color: #0a0a2e;
      margin-bottom: 20px;
    }
    
    .modal .prize-amount {
      font-size: 3rem;
      font-weight: 900;
      color: #0a0a2e;
      margin-bottom: 20px;
    }
    
    .claim-btn {
      background: linear-gradient(45deg, #4ecdc4, #44a08d);
      border: none;
      border-radius: 50px;
      padding: 15px 40px;
      font-size: 18px;
      font-weight: 900;
      color: white;
      cursor: pointer;
      text-transform: uppercase;
      width: 100%;
      transition: all 0.3s ease;
    }
    
    .claim-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 35px rgba(68, 160, 141, 0.6);
    }
    
    /* Mobile Responsive */
    @media (max-width: 768px) {
      .desktop-shadow {
        display: none;
      }
      
      .mobile-shadow {
        display: block;
      }
      
      .desktop-zeus {
        display: none;
      }
      
      .mobile-zeus {
        display: block;
      }
      
      .zeus img {
        height: 150px;
      }
      
      .wheel-spinner {
        width: 250px;
        height: 250px;
      }
      
      .main-title {
        font-size: 2rem;
      }
      
      .subtitle {
        font-size: 1rem;
      }
      
      .modal-content {
        margin: 10px;
        padding: 30px;
      }
    }
    
    @media (max-width: 480px) {
      .wheel-spinner {
        width: 200px;
        height: 200px;
      }
      
      .main-title {
        font-size: 1.5rem;
      }
      
      .wheel-button {
        padding: 12px 30px;
        font-size: 16px;
      }
    }
  `;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${brandName}</title>
    <link rel="stylesheet" href="/css/gates-olympus-original.css">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>${css}</style>
</head>
<body>
    <div class="gates-olympus-wrapper">
        <div class="container">
            <header class="header">
                ${logoUrl ? `
                <div class="logo">
                    <img src="${logoUrl}" alt="${brandName}" onclick="window.open('${ctaUrl}', '_blank')" />
                </div>
                ` : ''}
            </header>
            
            <div class="content">
                <div class="zeus-character">
                    <div class="zeus desktop-zeus">
                        <img src="/images/gates-olympus/zeus-desktop.png" alt="Zeus" />
                    </div>
                    <div class="zeus mobile-zeus">
                        <img src="/images/gates-olympus/zeus-mobile.png" alt="Zeus" />
                    </div>
                </div>
                
                <div class="wheel-section">
                    <div class="wheel-wrapper">
                        <div class="wheel-arrow"></div>
                        <div class="wheel-spinner" id="wheelSpinner">
                            <!-- Wheel segments styled with CSS -->
                        </div>
                        <button class="wheel-button" id="spinButton">SPIN</button>
                    </div>
                </div>
                
                <div class="title-section">
                    <h1 class="main-title">${headline}</h1>
                    <p class="subtitle">${subheadline}</p>
                    <button class="cta-button" onclick="window.open('${ctaUrl}', '_blank')">
                        ${cta}
                    </button>
                </div>
            </div>
            
            <footer class="footer">
                <p>© 2024 All rights reserved</p>
                <div class="footer-links">
                    <a href="#" target="_blank">Privacy Policy</a> |
                    <a href="#" target="_blank">Terms & Conditions</a>
                </div>
            </footer>
        </div>

        <!-- Win Modal -->
        <div id="winModal" class="modal">
            <div class="modal-content">
                <h2>🎉 Congratulations! 🎉</h2>
                <h3>YOU WON</h3>
                <div class="prize-amount">$1,500</div>
                <p><span style="color: #0a0a2e; font-weight: bold;">+200 FS</span></p>
                <button class="claim-btn" onclick="window.open('${ctaUrl}', '_blank')">
                    ${cta}
                </button>
            </div>
        </div>

        <script>
            let isSpinning = false;
            
            document.getElementById('spinButton').addEventListener('click', function() {
                if (isSpinning) return;
                
                isSpinning = true;
                const spinner = document.getElementById('wheelSpinner');
                const button = this;
                
                button.textContent = 'SPINNING...';
                button.disabled = true;
                spinner.classList.add('spinning');
                
                setTimeout(() => {
                    isSpinning = false;
                    button.textContent = 'SPIN';
                    button.disabled = false;
                    spinner.classList.remove('spinning');
                    
                    // Show win modal
                    document.getElementById('winModal').classList.add('show');
                }, 3000);
            });
            
            // Close modal when clicking outside
            document.getElementById('winModal').addEventListener('click', function(e) {
                if (e.target === this) {
                    this.classList.remove('show');
                }
            });
        </script>
    </div>
</body>
</html>`;

  return { html, css };
}
