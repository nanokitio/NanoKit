import { Template19 } from './page'
import { BrandConfig } from '@/lib/types'

export { Template19 }

export function renderTemplate(brand: BrandConfig) {
  // Basic HTML generation for the template
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${brand.copy.headline}</title>
    </head>
    <body>
      <div class="dugem-template">
        <h1>${brand.copy.headline}</h1>
        <h2>${brand.copy.subheadline}</h2>
        <p>${brand.description || 'Join us for an unforgettable night'}</p>
        <a href="${brand.ctaUrl || '#'}">${brand.copy.cta}</a>
      </div>
    </body>
    </html>
  `

  const css = `
    .dugem-template {
      min-height: 100vh;
      background: linear-gradient(135deg, rgba(138, 43, 226, 0.7), rgba(30, 144, 255, 0.7));
      color: white;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: 2rem;
    }
    .dugem-template h1 {
      font-size: 4rem;
      margin-bottom: 1rem;
      background: linear-gradient(45deg, #ff00ff, #00ffff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .dugem-template h2 {
      font-size: 2rem;
      margin-bottom: 1rem;
      color: #e0e0e0;
    }
    .dugem-template p {
      font-size: 1.2rem;
      margin-bottom: 2rem;
      max-width: 600px;
    }
    .dugem-template a {
      display: inline-block;
      padding: 1rem 2rem;
      background: linear-gradient(45deg, #ff00ff, #00ffff);
      color: white;
      text-decoration: none;
      border-radius: 50px;
      font-weight: bold;
      transition: transform 0.3s ease;
    }
    .dugem-template a:hover {
      transform: scale(1.05);
    }
  `

  return { html, css }
}
