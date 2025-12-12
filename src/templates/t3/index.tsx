'use client'

import React, { useState } from 'react'
import { BrandConfig, TemplateRenderResult } from '@/lib/types'
import { generateCSSVariables } from '@/lib/colors'
import { InlineEditableText } from '@/components/InlineEditableText'

interface Template3Props {
  brand: BrandConfig
}

export function Template3({ brand }: Template3Props) {
  const [headline, setHeadline] = useState(brand.copy.headline);
  const [subheadline, setSubheadline] = useState(brand.copy.subheadline);

  const notifyChange = (field: string, value: string) => {
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'CONTENT_CHANGE', field, value }, '*');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero with Form */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-6">
                {brand.logoUrl && (
                  <img
                    src={brand.logoUrl}
                    alt={brand.brandName}
                    className="h-8 w-auto mr-3 filter brightness-0 invert"
                  />
                )}
                <span className="text-xl font-bold">{brand.brandName}</span>
              </div>
              <div className="mb-4">
                <InlineEditableText
                  value={headline}
                  onChange={(val) => { setHeadline(val); notifyChange('headline', val); }}
                  className="text-4xl font-bold text-white"
                  placeholder="Enter headline..."
                  initialStyles={{ fontSize: 36, fontWeight: 'bold', fontStyle: 'normal', textDecoration: 'none', textAlign: 'left' }}
                />
              </div>
              <div className="mb-6">
                <InlineEditableText
                  value={subheadline}
                  onChange={(val) => { setSubheadline(val); notifyChange('subheadline', val); }}
                  className="text-lg opacity-90 text-white"
                  placeholder="Enter subheadline..."
                  initialStyles={{ fontSize: 18, fontWeight: 'normal', fontStyle: 'normal', textDecoration: 'none', textAlign: 'left' }}
                />
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Free consultation
                </span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  No commitment
                </span>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Get Started Today</h3>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent text-gray-900"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent text-gray-900"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent text-gray-900"
                />
                <button
                  type="submit"
                  className="w-full bg-[var(--brand-primary)] text-white py-4 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity"
                >
                  {brand.copy.cta}
                </button>
              </form>
              <p className="text-xs text-gray-500 mt-4 text-center">
                By submitting, you agree to our terms and privacy policy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose {brand.brandName}?</h2>
          <div className="space-y-8">
            <div className="flex items-start">
              <div className="w-8 h-8 bg-[var(--brand-accent)] rounded-full flex items-center justify-center mr-4 mt-1">
                <span className="text-white font-bold">1</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Proven Results</h3>
                <p className="text-gray-600">Our track record speaks for itself with measurable outcomes for every client.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 bg-[var(--brand-accent)] rounded-full flex items-center justify-center mr-4 mt-1">
                <span className="text-white font-bold">2</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Expert Support</h3>
                <p className="text-gray-600">Dedicated professionals guide you through every step of the process.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-8 h-8 bg-[var(--brand-accent)] rounded-full flex items-center justify-center mr-4 mt-1">
                <span className="text-white font-bold">3</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Fast Implementation</h3>
                <p className="text-gray-600">See results quickly with our streamlined approach and proven methodology.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Trusted by Industry Leaders</h2>
            <p className="text-gray-600">Join thousands of satisfied customers</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-3xl font-bold text-[var(--brand-primary)] mb-2">500+</div>
              <p className="text-gray-600">Happy Clients</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-3xl font-bold text-[var(--brand-primary)] mb-2">98%</div>
              <p className="text-gray-600">Success Rate</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-3xl font-bold text-[var(--brand-primary)] mb-2">24/7</div>
              <p className="text-gray-600">Support Available</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[var(--brand-primary)] text-white p-4 shadow-lg z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <p className="font-semibold">Ready to get started?</p>
            <p className="text-sm opacity-90">Join {brand.brandName} today</p>
          </div>
          <div className="cta-section text-center">
            <button 
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg text-xl shadow-lg transform hover:scale-105 transition-all duration-200"
              onClick={() => brand.ctaUrl && window.open(brand.ctaUrl, '_blank')}
            >
              {brand.copy.cta}
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            {brand.logoUrl && (
              <img
                src={brand.logoUrl}
                alt={brand.brandName}
                className="h-8 w-auto mr-3 filter brightness-0 invert"
              />
            )}
            <span className="text-xl font-bold">{brand.brandName}</span>
          </div>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">{brand.description}</p>
          <div className="grid md:grid-cols-3 gap-8 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Contact</h4>
              <p className="text-gray-400">hello@{brand.brandName.toLowerCase().replace(/\s+/g, '')}.com</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Phone</h4>
              <p className="text-gray-400">1-800-{brand.brandName.substring(0,3).toUpperCase()}-HELP</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Hours</h4>
              <p className="text-gray-400">Mon-Fri 9AM-6PM EST</p>
            </div>
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
      padding-bottom: 80px;
    }
    
    .sticky-cta {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: var(--brand-primary);
      color: white;
      padding: 1rem;
      box-shadow: 0 -4px 6px rgba(0,0,0,0.1);
      z-index: 50;
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
      <!-- Hero with Form -->
      <section style="background: linear-gradient(90deg, #111827, #374151); color: white; padding: 5rem 1rem;">
        <div style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center;">
          <div>
            <div style="display: flex; align-items: center; margin-bottom: 1.5rem;">
              ${brand.logoUrl ? `<img src="${brand.logoUrl}" alt="${brand.brandName}" style="height: 2rem; margin-right: 0.75rem; filter: brightness(0) invert(1);">` : ''}
              <span style="font-size: 1.25rem; font-weight: bold;">${brand.brandName}</span>
            </div>
            <h1 style="font-size: 2.5rem; font-weight: bold; margin-bottom: 1rem;">${brand.copy.headline}</h1>
            <p style="font-size: 1.125rem; margin-bottom: 1.5rem; opacity: 0.9;">${brand.copy.subheadline}</p>
            <div style="display: flex; gap: 1rem; font-size: 0.875rem;">
              <span style="display: flex; align-items: center;">
                <span style="color: #10b981; margin-right: 0.5rem;">✓</span>
                Free consultation
              </span>
              <span style="display: flex; align-items: center;">
                <span style="color: #10b981; margin-right: 0.5rem;">✓</span>
                No commitment
              </span>
            </div>
          </div>
          <div style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 25px 50px rgba(0,0,0,0.25);">
            <h3 style="font-size: 1.5rem; font-weight: bold; color: #111827; margin-bottom: 1.5rem;">Get Started Today</h3>
            <form style="display: flex; flex-direction: column; gap: 1rem;">
              <input type="text" placeholder="Your Name" style="width: 100%; padding: 0.75rem 1rem; border: 1px solid #d1d5db; border-radius: 0.5rem; color: #111827;">
              <input type="email" placeholder="Email Address" style="width: 100%; padding: 0.75rem 1rem; border: 1px solid #d1d5db; border-radius: 0.5rem; color: #111827;">
              <input type="tel" placeholder="Phone Number" style="width: 100%; padding: 0.75rem 1rem; border: 1px solid #d1d5db; border-radius: 0.5rem; color: #111827;">
              <button type="submit" style="width: 100%; background: ${brand.colors.primary}; color: white; padding: 1rem; border: none; border-radius: 0.5rem; font-weight: bold; font-size: 1.125rem; cursor: pointer;">${brand.copy.cta}</button>
            </form>
            <p style="font-size: 0.75rem; color: #6b7280; margin-top: 1rem; text-align: center;">
              By submitting, you agree to our terms and privacy policy.
            </p>
          </div>
        </div>
      </section>

      <!-- Benefits -->
      <section style="padding: 5rem 1rem;">
        <div style="max-width: 1000px; margin: 0 auto;">
          <h2 style="font-size: 1.875rem; font-weight: bold; text-align: center; margin-bottom: 3rem;">Why Choose ${brand.brandName}?</h2>
          <div style="display: flex; flex-direction: column; gap: 2rem;">
            <div style="display: flex; align-items: flex-start;">
              <div style="width: 2rem; height: 2rem; background: ${brand.colors.accent}; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 1rem; margin-top: 0.25rem;">
                <span style="color: white; font-weight: bold;">1</span>
              </div>
              <div>
                <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem;">Proven Results</h3>
                <p style="color: #6b7280;">Our track record speaks for itself with measurable outcomes for every client.</p>
              </div>
            </div>
            <div style="display: flex; align-items: flex-start;">
              <div style="width: 2rem; height: 2rem; background: ${brand.colors.accent}; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 1rem; margin-top: 0.25rem;">
                <span style="color: white; font-weight: bold;">2</span>
              </div>
              <div>
                <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem;">Expert Support</h3>
                <p style="color: #6b7280;">Dedicated professionals guide you through every step of the process.</p>
              </div>
            </div>
            <div style="display: flex; align-items: flex-start;">
              <div style="width: 2rem; height: 2rem; background: ${brand.colors.accent}; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 1rem; margin-top: 0.25rem;">
                <span style="color: white; font-weight: bold;">3</span>
              </div>
              <div>
                <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem;">Fast Implementation</h3>
                <p style="color: #6b7280;">See results quickly with our streamlined approach and proven methodology.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Social Proof -->
      <section style="padding: 5rem 1rem; background: #f9fafb;">
        <div style="max-width: 1200px; margin: 0 auto; text-align: center;">
          <h2 style="font-size: 1.875rem; font-weight: bold; margin-bottom: 1rem;">Trusted by Industry Leaders</h2>
          <p style="color: #6b7280; margin-bottom: 3rem;">Join thousands of satisfied customers</p>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem;">
            <div style="background: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <div style="font-size: 1.875rem; font-weight: bold; color: ${brand.colors.primary}; margin-bottom: 0.5rem;">500+</div>
              <p style="color: #6b7280;">Happy Clients</p>
            </div>
            <div style="background: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <div style="font-size: 1.875rem; font-weight: bold; color: ${brand.colors.primary}; margin-bottom: 0.5rem;">98%</div>
              <p style="color: #6b7280;">Success Rate</p>
            </div>
            <div style="background: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <div style="font-size: 1.875rem; font-weight: bold; color: ${brand.colors.primary}; margin-bottom: 0.5rem;">24/7</div>
              <p style="color: #6b7280;">Support Available</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Sticky CTA -->
      <div class="sticky-cta">
        <div style="max-width: 1000px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between;">
          <div>
            <p style="font-weight: 600;">Ready to get started?</p>
            <p style="font-size: 0.875rem; opacity: 0.9;">Join ${brand.brandName} today</p>
          </div>
          <button className="cta-button" onclick="window.open('${brand.ctaUrl || 'https://example.com'}', '_blank')">{brand.copy.cta}</button>
        </div>
      </div>

      <!-- Footer -->
      <footer style="background: #111827; color: white; padding: 4rem 1rem;">
        <div style="max-width: 1200px; margin: 0 auto; text-align: center;">
          <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 1.5rem;">
            ${brand.logoUrl ? `<img src="${brand.logoUrl}" alt="${brand.brandName}" style="height: 2rem; margin-right: 0.75rem; filter: brightness(0) invert(1);">` : ''}
            <span style="font-size: 1.25rem; font-weight: bold;">${brand.brandName}</span>
          </div>
          <p style="color: #9ca3af; margin-bottom: 2rem; max-width: 32rem; margin-left: auto; margin-right: auto;">${brand.description}</p>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; font-size: 0.875rem;">
            <div>
              <h4 style="font-weight: 600; margin-bottom: 0.5rem;">Contact</h4>
              <p style="color: #9ca3af;">hello@${brand.brandName.toLowerCase().replace(/\s+/g, '')}.com</p>
            </div>
            <div>
              <h4 style="font-weight: 600; margin-bottom: 0.5rem;">Phone</h4>
              <p style="color: #9ca3af;">1-800-${brand.brandName.substring(0,3).toUpperCase()}-HELP</p>
            </div>
            <div>
              <h4 style="font-weight: 600; margin-bottom: 0.5rem;">Hours</h4>
              <p style="color: #9ca3af;">Mon-Fri 9AM-6PM EST</p>
            </div>
          </div>
        </div>
      </footer>
    </body>
    </html>
  `

  return { html, css }
}
