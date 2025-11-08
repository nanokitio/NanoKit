import React from 'react'
import { BrandConfig, TemplateRenderResult } from '@/lib/types'
import { generateCSSVariables } from '@/lib/colors'

interface Template1Props {
  brand: BrandConfig
}

export function Template1({ brand }: Template1Props) {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              {brand.logoUrl && (
                <img
                  src={brand.logoUrl}
                  alt={brand.brandName}
                  className="h-8 w-auto mr-3"
                />
              )}
              <span className="text-xl font-bold text-gray-900">
                {brand.brandName}
              </span>
            </div>
            <button
              className="bg-[var(--brand-primary)] text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              {brand.copy.cta}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Content */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            {brand.copy.headline}
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {brand.copy.subheadline}
          </p>
          <div className="cta-section text-center mt-12">
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-xl shadow-lg transform hover:scale-105 transition-all duration-200"
              onClick={() => brand.ctaUrl && window.open(brand.ctaUrl, '_blank')}
            >
              {brand.copy.cta}
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose {brand.brandName}?
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--brand-accent)] rounded-lg mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Reliable</h3>
              <p className="text-lg text-gray-600 mb-8">&ldquo;Transform your business with our cutting-edge solutions&rdquo;</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--brand-accent)] rounded-lg mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Team</h3>
              <p className="text-gray-600">Professional service you can count on</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--brand-accent)] rounded-lg mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Optimized</h3>
              <p className="text-gray-600">Built for performance and results</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial / Team */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <blockquote className="text-2xl font-medium text-gray-900 mb-6">
            &ldquo;{brand.brandName} transformed our business. Highly recommended!&rdquo;
          </blockquote>
          <div className="flex items-center justify-center">
            <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
            <div>
              <p className="font-semibold text-gray-900">Sarah Johnson</p>
              <p className="text-gray-600">CEO, TechCorp</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              {brand.logoUrl && (
                <img
                  src={brand.logoUrl}
                  alt={brand.brandName}
                  className="h-8 w-auto mr-3 filter brightness-0 invert"
                />
              )}
              <span className="text-xl font-bold">{brand.brandName}</span>
            </div>
            <p className="text-gray-400 mb-6">{brand.description}</p>
            <button className="bg-[var(--brand-primary)] text-white px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity">
              {brand.copy.cta}
            </button>
          </div>
        </div>
      </footer>
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
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #111827;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }
    
    .btn-primary {
      background-color: var(--brand-primary);
      color: white;
      padding: 0.75rem 2rem;
      border: none;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    
    .btn-primary:hover {
      opacity: 0.9;
    }
    
    .feature-icon {
      width: 4rem;
      height: 4rem;
      background-color: var(--brand-accent);
      border-radius: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1rem;
    }
  `

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${brand.brandName} - ${brand.copy.headline}</title>
      <style>${css}</style>
    </head>
    <body>
      <div style="min-height: 100vh; background: white;">
        <!-- Header -->
        <header style="background: white; border-bottom: 1px solid #e5e7eb; padding: 1.5rem 0;">
          <div class="container" style="display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center;">
              ${brand.logoUrl ? `<img src="${brand.logoUrl}" alt="${brand.brandName}" style="height: 2rem; margin-right: 0.75rem;">` : ''}
              <span style="font-size: 1.25rem; font-weight: bold;">${brand.brandName}</span>
            </div>
            <button class="btn-primary" onclick="window.open('${brand.ctaUrl || 'https://example.com'}', '_blank')">${brand.copy.cta}</button>
          </div>
        </header>

        <!-- Hero -->
        <section style="padding: 5rem 1rem; text-align: center;">
          <div class="container">
            <h1 style="font-size: 3rem; font-weight: bold; margin-bottom: 1.5rem;">${brand.copy.headline}</h1>
            <p style="font-size: 1.25rem; color: #6b7280; margin-bottom: 2rem; max-width: 32rem; margin-left: auto; margin-right: auto;">${brand.copy.subheadline}</p>
            <button class="btn-primary" style="font-size: 1.125rem; padding: 1rem 2rem;">${brand.copy.cta}</button>
          </div>
        </section>

        <!-- Features -->
        <section style="padding: 4rem 1rem; background: #f9fafb;">
          <div class="container">
            <div style="text-align: center; margin-bottom: 3rem;">
              <h2 style="font-size: 2rem; font-weight: bold; margin-bottom: 1rem;">Why Choose ${brand.brandName}?</h2>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem;">
              <div style="text-align: center;">
                <div class="feature-icon">
                  <svg style="width: 2rem; height: 2rem; color: white;" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </div>
                <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem;">Reliable</h3>
                <p style="color: #6b7280;">Trusted by thousands of customers worldwide</p>
              </div>
              <div style="text-align: center;">
                <div class="feature-icon">
                  <svg style="width: 2rem; height: 2rem; color: white;" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                  </svg>
                </div>
                <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem;">Expert Team</h3>
                <p style="color: #6b7280;">Professional service you can count on</p>
              </div>
              <div style="text-align: center;">
                <div class="feature-icon">
                  <svg style="width: 2rem; height: 2rem; color: white;" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
                  </svg>
                </div>
                <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem;">Optimized</h3>
                <p style="color: #6b7280;">Built for performance and results</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Testimonial -->
        <section style="padding: 4rem 1rem; text-align: center;">
          <div class="container">
            <blockquote style="font-size: 1.5rem; font-weight: 500; margin-bottom: 1.5rem;">"${brand.brandName} transformed our business. Highly recommended!"</blockquote>
            <div style="display: flex; align-items: center; justify-content: center;">
              <div style="width: 3rem; height: 3rem; background: #d1d5db; border-radius: 50%; margin-right: 1rem;"></div>
              <div>
                <p style="font-weight: 600;">Sarah Johnson</p>
                <p style="color: #6b7280;">CEO, TechCorp</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Footer -->
        <footer style="background: #111827; color: white; padding: 3rem 1rem;">
          <div class="container" style="text-align: center;">
            <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;">
              ${brand.logoUrl ? `<img src="${brand.logoUrl}" alt="${brand.brandName}" style="height: 2rem; margin-right: 0.75rem; filter: brightness(0) invert(1);">` : ''}
              <span style="font-size: 1.25rem; font-weight: bold;">${brand.brandName}</span>
            </div>
            <p style="color: #9ca3af; margin-bottom: 1.5rem;">${brand.description}</p>
            <button class="btn-primary" onclick="window.open('${brand.ctaUrl || 'https://example.com'}', '_blank')">${brand.copy.cta}</button>
          </div>
        </footer>
      </div>
    </body>
    </html>
  `

  return { html, css }
}
