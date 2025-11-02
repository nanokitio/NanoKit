import { BrandConfig } from '../../lib/types'

export function renderTemplate(config: BrandConfig): { html: string; css?: string } {
  const headline = config.copy?.headline || 'BIG CASH'
  const subheadline = config.copy?.subheadline || 'WIN UP TO $100,000!'
  const cta = config.copy?.cta || 'CLAIM NOW'
  const ctaUrl = config.ctaUrl || '#'
  const backgroundColor = config.backgroundColor || '#b30000'
  const backgroundImage = config.backgroundImage || ''

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
      min-height: 100vh;
      overflow-x: hidden;
      background: ${backgroundImage 
        ? `url('${backgroundImage}') center/cover no-repeat, linear-gradient(135deg, ${backgroundColor} 0%, #ff0000 50%, ${backgroundColor} 100%)` 
        : `linear-gradient(135deg, ${backgroundColor} 0%, #ff0000 50%, ${backgroundColor} 100%)`};
      position: relative;
      font-family: 'Impact', 'Arial Black', sans-serif;
    }

    /* Radial burst background */
    body::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: 
        repeating-conic-gradient(
          from 0deg at 50% 50%,
          transparent 0deg,
          transparent 3deg,
          rgba(139, 0, 0, 0.3) 3deg,
          rgba(139, 0, 0, 0.3) 6deg
        );
      z-index: 0;
      pointer-events: none;
    }
    
    .game-container {
      position: relative;
      max-width: 500px;
      margin: 20px auto;
      padding: 20px;
      background: linear-gradient(to bottom, #cc9900 0%, #ffcc00 50%, #cc9900 100%);
      border: 8px solid #ff6600;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5),
                  inset 0 2px 5px rgba(255, 255, 255, 0.3);
      z-index: 1;
    }

    .price-tag {
      position: absolute;
      top: -10px;
      left: 20px;
      background: #ff0000;
      color: white;
      padding: 8px 16px;
      font-size: 1.8rem;
      font-weight: bold;
      border: 3px solid white;
      border-radius: 8px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
      transform: rotate(-5deg);
      z-index: 10;
    }

    .game-content {
      background: linear-gradient(to bottom, #cc0000 0%, #ff0000 50%, #cc0000 100%);
      border: 4px solid #ffcc00;
      border-radius: 15px;
      padding: 20px;
      position: relative;
    }

    .game-title {
      text-align: center;
      color: #ffcc00;
      text-shadow: 
        3px 3px 0px #ff6600,
        5px 5px 10px rgba(0, 0, 0, 0.5);
      margin-bottom: 5px;
      letter-spacing: 3px;
    }

    .game-title h1 {
      font-size: 3.5rem;
      line-height: 1;
      margin: 0;
    }

    .subtitle {
      text-align: center;
      color: #ffcc00;
      font-size: 1.5rem;
      font-weight: bold;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
      margin-bottom: 15px;
    }

    .section-label {
      text-align: center;
      color: white;
      font-size: 1.3rem;
      font-weight: bold;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
      margin: 15px 0 10px 0;
      letter-spacing: 1px;
    }

    .scratch-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      margin-bottom: 20px;
    }

    .scratch-card {
      position: relative;
      aspect-ratio: 1;
      cursor: pointer;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    }

    .scratch-card canvas {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      touch-action: none;
    }

    .scratch-number {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #ffcc00 0%, #ff9900 100%);
      color: #cc0000;
      font-size: 3rem;
      font-weight: bold;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    }

    .winning-numbers {
      display: flex;
      justify-content: center;
      gap: 15px;
      margin-top: 20px;
      flex-wrap: wrap;
    }

    .winning-circle {
      width: 70px;
      height: 70px;
      background: linear-gradient(135deg, #ffcc00 0%, #ff9900 100%);
      border: 4px solid white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      font-weight: bold;
      color: #cc0000;
      text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
      position: relative;
      transition: all 0.3s ease;
    }

    .winning-circle.revealed {
      animation: revealWin 0.5s ease;
    }

    @keyframes revealWin {
      0% { transform: scale(0.5) rotate(0deg); opacity: 0; }
      50% { transform: scale(1.2) rotate(180deg); }
      100% { transform: scale(1) rotate(360deg); opacity: 1; }
    }

    .chances-label {
      text-align: center;
      color: white;
      font-size: 1.5rem;
      font-weight: bold;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
      margin-top: 15px;
      letter-spacing: 2px;
      background: rgba(0, 0, 0, 0.3);
      padding: 10px;
      border-radius: 10px;
    }

    /* Win Modal */
    .win-modal {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.85);
      z-index: 1000;
      justify-content: center;
      align-items: center;
    }

    .win-modal.active {
      display: flex;
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .win-content {
      background: linear-gradient(135deg, #ffcc00 0%, #ff9900 100%);
      padding: 40px;
      border-radius: 20px;
      text-align: center;
      border: 6px solid white;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
      max-width: 90%;
      animation: scaleIn 0.4s ease;
    }

    @keyframes scaleIn {
      from { transform: scale(0.7); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }

    .win-content h2 {
      color: #cc0000;
      font-size: 3rem;
      margin-bottom: 20px;
      text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.3);
    }

    .win-content p {
      color: #cc0000;
      font-size: 1.5rem;
      margin-bottom: 30px;
      font-weight: bold;
    }

    .claim-button {
      background: linear-gradient(135deg, #cc0000 0%, #ff0000 100%);
      color: white;
      border: none;
      padding: 18px 50px;
      font-size: 1.8rem;
      font-weight: bold;
      border-radius: 50px;
      cursor: pointer;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
      transition: all 0.3s ease;
      border: 3px solid white;
      text-transform: uppercase;
      letter-spacing: 2px;
    }

    .claim-button:hover {
      transform: scale(1.05);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.6);
    }

    .claim-button:active {
      transform: scale(0.98);
    }

    @media (max-width: 600px) {
      .game-container {
        margin: 10px;
        padding: 15px;
      }

      .price-tag {
        font-size: 1.4rem;
        padding: 6px 12px;
      }

      .game-title h1 {
        font-size: 2.5rem;
      }

      .subtitle {
        font-size: 1.1rem;
      }

      .section-label {
        font-size: 1.1rem;
      }

      .scratch-number {
        font-size: 2rem;
      }

      .winning-circle {
        width: 60px;
        height: 60px;
        font-size: 1.6rem;
      }

      .chances-label {
        font-size: 1.2rem;
      }

      .win-content h2 {
        font-size: 2rem;
      }

      .win-content p {
        font-size: 1.2rem;
      }

      .claim-button {
        padding: 14px 35px;
        font-size: 1.4rem;
      }
    }
  </style>
</head>
<body>
  <div class="game-container">
    <div class="price-tag">$5</div>
    
    <div class="game-content">
      <div class="game-title">
        <h1>${headline}</h1>
      </div>
      
      <div class="subtitle">${subheadline}</div>
      
      <div class="section-label">YOUR NUMBERS</div>
      
      <div class="scratch-grid" id="scratchGrid">
        <!-- 12 scratch cards will be generated by JavaScript -->
      </div>
      
      <div class="section-label">WINNING NUMBERS</div>
      
      <div class="winning-numbers" id="winningNumbers">
        <div class="winning-circle">?</div>
        <div class="winning-circle">?</div>
        <div class="winning-circle">?</div>
        <div class="winning-circle">?</div>
      </div>
      
      <div class="chances-label">12 CHANCES TO WIN</div>
    </div>
  </div>

  <!-- Win Modal -->
  <div class="win-modal" id="winModal">
    <div class="win-content">
      <h2>🎉 WINNER! 🎉</h2>
      <p>You matched <span id="matchCount">0</span> winning numbers!</p>
      <p style="font-size: 2.5rem; margin: 20px 0;">💰 $100,000 💰</p>
      <button class="claim-button" onclick="window.location.href='${ctaUrl}'">${cta}</button>
    </div>
  </div>

  <script>
    // Generate random numbers for the game
    const possibleNumbers = [1, 2, 3, 5, 7, 10, 15, 20, 25, 50, 75, 100];
    const scratchNumbers = [];
    const winningNumbers = [];
    
    // Generate 12 random scratch numbers
    for (let i = 0; i < 12; i++) {
      const num = possibleNumbers[Math.floor(Math.random() * possibleNumbers.length)];
      scratchNumbers.push(num);
    }
    
    // Select 4 random winning numbers from scratch numbers
    const shuffled = [...scratchNumbers].sort(() => 0.5 - Math.random());
    for (let i = 0; i < 4; i++) {
      winningNumbers.push(shuffled[i]);
    }
    
    let revealedCount = 0;
    const winningCircles = document.querySelectorAll('.winning-circle');
    
    // Create scratch cards
    const scratchGrid = document.getElementById('scratchGrid');
    scratchNumbers.forEach((number, index) => {
      const card = document.createElement('div');
      card.className = 'scratch-card';
      
      // Background number
      const numberDiv = document.createElement('div');
      numberDiv.className = 'scratch-number';
      numberDiv.textContent = number;
      
      // Canvas for scratching
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      card.appendChild(numberDiv);
      card.appendChild(canvas);
      scratchGrid.appendChild(card);
      
      // Initialize canvas
      function initCanvas() {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * 2; // High DPI
        canvas.height = rect.height * 2;
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        ctx.scale(2, 2);
        
        // Draw golden scratch surface with realistic texture
        const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
        gradient.addColorStop(0, '#ffcc00');
        gradient.addColorStop(0.3, '#ffdd44');
        gradient.addColorStop(0.6, '#ffd700');
        gradient.addColorStop(1, '#ffaa00');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, rect.width, rect.height);
        
        // Add metallic texture with noise
        for (let i = 0; i < 200; i++) {
          ctx.fillStyle = \`rgba(255, 255, 255, \${Math.random() * 0.15})\`;
          ctx.fillRect(
            Math.random() * rect.width,
            Math.random() * rect.height,
            Math.random() * 3,
            Math.random() * 3
          );
        }
        
        // Add multiple shine effects for metallic look
        const radialGradient = ctx.createRadialGradient(
          rect.width * 0.3, rect.height * 0.3, 0,
          rect.width * 0.3, rect.height * 0.3, rect.width * 0.5
        );
        radialGradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
        radialGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
        radialGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = radialGradient;
        ctx.fillRect(0, 0, rect.width, rect.height);
      }
      
      initCanvas();
      window.addEventListener('resize', initCanvas);
      
      let isScratching = false;
      let scratchedPixels = 0;
      const totalPixels = canvas.width * canvas.height;
      let lastX = null;
      let lastY = null;
      
      function scratch(x, y) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        ctx.globalCompositeOperation = 'destination-out';
        
        // Larger, more realistic brush size
        const baseRadius = 35;
        const radiusVariation = Math.random() * 15;
        const currentRadius = baseRadius + radiusVariation;
        
        // Draw main brush stroke
        ctx.beginPath();
        ctx.arc(x * scaleX / 2, y * scaleY / 2, currentRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Add feathered edges for more realistic effect
        for (let i = 0; i < 3; i++) {
          const offset = (Math.random() - 0.5) * 10;
          const smallRadius = currentRadius * (0.6 - i * 0.15);
          ctx.beginPath();
          ctx.arc(
            (x + offset) * scaleX / 2,
            (y + offset) * scaleY / 2,
            smallRadius,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
        
        // Connect strokes for smooth scratching
        if (lastX !== null && lastY !== null) {
          ctx.lineWidth = currentRadius * 2;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.beginPath();
          ctx.moveTo(lastX * scaleX / 2, lastY * scaleY / 2);
          ctx.lineTo(x * scaleX / 2, y * scaleY / 2);
          ctx.stroke();
        }
        
        lastX = x;
        lastY = y;
        
        scratchedPixels += 1500; // Approximate (larger brush)
        
        // Check if scratched enough
        if (scratchedPixels > totalPixels * 0.4 && revealedCount < 4) {
          canvas.style.display = 'none';
          revealNumber(number);
        }
      }
      
      function revealNumber(num) {
        if (winningNumbers.includes(num) && revealedCount < 4) {
          const circle = winningCircles[revealedCount];
          circle.textContent = num;
          circle.classList.add('revealed');
          revealedCount++;
          
          // Check if all winning numbers revealed
          if (revealedCount >= 4) {
            setTimeout(() => showWinModal(), 1000);
          }
        }
      }
      
      // Mouse events
      canvas.addEventListener('mousedown', (e) => {
        isScratching = true;
        lastX = null;
        lastY = null;
        const rect = canvas.getBoundingClientRect();
        scratch(e.clientX - rect.left, e.clientY - rect.top);
      });
      
      canvas.addEventListener('mousemove', (e) => {
        if (isScratching) {
          const rect = canvas.getBoundingClientRect();
          scratch(e.clientX - rect.left, e.clientY - rect.top);
        }
      });
      
      canvas.addEventListener('mouseup', () => {
        isScratching = false;
        lastX = null;
        lastY = null;
      });
      
      canvas.addEventListener('mouseleave', () => {
        isScratching = false;
        lastX = null;
        lastY = null;
      });
      
      // Touch events
      canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        isScratching = true;
        lastX = null;
        lastY = null;
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        scratch(touch.clientX - rect.left, touch.clientY - rect.top);
      });
      
      canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (isScratching) {
          const rect = canvas.getBoundingClientRect();
          const touch = e.touches[0];
          scratch(touch.clientX - rect.left, touch.clientY - rect.top);
        }
      });
      
      canvas.addEventListener('touchend', () => {
        isScratching = false;
        lastX = null;
        lastY = null;
      });
    });
    
    function showWinModal() {
      document.getElementById('matchCount').textContent = revealedCount;
      document.getElementById('winModal').classList.add('active');
    }
    
    // Prevent right-click and long-press
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('selectstart', e => e.preventDefault());
  </script>
</body>
</html>
  `

  return { html }
}
