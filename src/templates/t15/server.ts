import { BrandConfig } from '../../lib/types'

export function renderTemplate(config: BrandConfig): { html: string; css?: string } {
  const headline = config.copy?.headline || 'SPIN THE WHEEL'
  const cta = config.copy?.cta || 'CLAIM BONUS'
  const ctaUrl = config.ctaUrl || '#'
  const logoUrl = config.logoUrl || ''
  const popupTitle = (config as any).popupTitle || 'WINNER!'
  const popupMessage = (config as any).popupMessage || 'Congratulations! You won'
  const popupPrize = (config as any).popupPrize || '$800'
  const wheelValues = (config as any).wheelValues || '$100, $200, $500, $1000, $2000, $5000, $800, $1500'
  const backgroundColor = (config as any).backgroundColor || '#0a0e27'
  const backgroundImage = (config as any).backgroundImage || ''

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>${headline}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body, html {
      width: 100%;
      height: 100vh;
      overflow: hidden;
      background: ${backgroundImage ? `url('${backgroundImage}') center/cover no-repeat, ${backgroundColor}` : backgroundColor};
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
    
    #gameFrame {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: none;
      display: block;
    }

    .game-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1000;
    }

    .game-title {
      position: absolute;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 2.5rem;
      font-weight: bold;
      color: #FFD700;
      text-shadow: 0 0 20px rgba(255, 0, 0, 0.8),
                   0 0 40px rgba(255, 215, 0, 0.5),
                   2px 2px 4px rgba(0, 0, 0, 0.8);
      text-align: center;
      font-family: 'Arial Black', sans-serif;
      letter-spacing: 2px;
      z-index: 1001;
      padding: 0 20px;
      max-width: 90%;
    }

    @media (max-width: 768px) {
      .game-title {
        font-size: 1.8rem;
        top: 10px;
      }
    }
  </style>
</head>
<body>
  <!-- Game Overlay -->
  <div class="game-overlay">
    <div class="game-title">${headline}</div>
  </div>

  <!-- Game iframe -->
  <iframe 
    id="gameFrame"
    src="/templates/game/game.html?theme=china&url=${encodeURIComponent(ctaUrl || '#')}&popupTitle=${encodeURIComponent(popupTitle)}&popupMessage=${encodeURIComponent(popupMessage)}&popupPrize=${encodeURIComponent(popupPrize)}&wheelValues=${encodeURIComponent(wheelValues)}&logoUrl=${encodeURIComponent(logoUrl)}"
    allowfullscreen
  ></iframe>

  <script>
    // Listen for win events from the game
    window.addEventListener('message', function(event) {
      if (event.data.type === 'gameWin') {
        console.log('Player won:', event.data.prize);
      }
    });
    
    // Ensure full height on mobile
    function setFullHeight() {
      document.documentElement.style.height = window.innerHeight + 'px';
    }
    window.addEventListener('resize', setFullHeight);
    setFullHeight();
  </script>
</body>
</html>
  `

  return { html }
}
