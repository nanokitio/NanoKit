'use client'

import React, { useState } from 'react'
import { BrandConfig, TemplateRenderResult } from '@/lib/types'
import { generateCSSVariables } from '@/lib/colors'
import { InlineEditableText } from '@/components/InlineEditableText'

interface Template2Props {
  brand: BrandConfig
}

export function Template2({ brand }: Template2Props) {
  const [headline, setHeadline] = useState(brand.copy.headline);
  const [subheadline, setSubheadline] = useState(brand.copy.subheadline);
  const [ctaText, setCtaText] = useState(brand.copy.cta);

  const notifyChange = (field: string, value: string) => {
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'CONTENT_CHANGE', field, value }, '*');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Modern Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--brand-primary)] via-[var(--brand-primary)] to-[var(--brand-accent)]">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%), 
                             radial-gradient(circle at 75% 75%, rgba(255,255,255,0.05) 0%, transparent 50%)`
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content Side */}
            <div className="text-white">
              {/* Logo & Brand */}
              <div className="flex items-center mb-8">
                {brand.logoUrl && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 mr-4">
                    <img
                      src={brand.logoUrl}
                      alt={brand.brandName}
                      className="h-8 w-auto filter brightness-0 invert"
                    />
                  </div>
                )}
                <span className="text-2xl font-bold tracking-tight">{brand.brandName}</span>
              </div>
              
              {/* Main Content */}
              <div className="mb-6">
                <InlineEditableText
                  value={headline}
                  onChange={(val) => { setHeadline(val); notifyChange('headline', val); }}
                  className="text-6xl lg:text-7xl font-black leading-tight text-white"
                  placeholder="Enter headline..."
                  initialStyles={{ fontSize: 72, fontWeight: 'bold', fontStyle: 'normal', textDecoration: 'none', textAlign: 'left' }}
                  fieldName="headline"
                />
              </div>
              <div className="mb-10">
                <InlineEditableText
                  value={subheadline}
                  onChange={(val) => { setSubheadline(val); notifyChange('subheadline', val); }}
                  className="text-xl lg:text-2xl opacity-90 leading-relaxed max-w-lg text-white"
                  placeholder="Enter subheadline..."
                  initialStyles={{ fontSize: 24, fontWeight: 'normal', fontStyle: 'normal', textDecoration: 'none', textAlign: 'left' }}
                  fieldName="subheadline"
                />
              </div>
              
              {/* CTA Button */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="group bg-white text-[var(--brand-primary)] px-10 py-5 rounded-2xl text-lg font-bold hover:bg-gray-50 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 cursor-pointer">
                  <span className="flex items-center justify-center">
                    <InlineEditableText
                      value={ctaText}
                      onChange={(val) => { setCtaText(val); notifyChange('cta', val); }}
                      placeholder="Button text..."
                      initialStyles={{ fontSize: 18, fontWeight: 'bold', fontStyle: 'normal', textDecoration: 'none', textAlign: 'center' }}
                      fieldName="cta"
                    />
                    <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </span>
                </div>
                <button className="border-2 border-white/30 text-white px-8 py-5 rounded-2xl text-lg font-semibold hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
                  Learn More
                </button>
              </div>
            </div>
            
            {/* Image Side */}
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
                <div className="aspect-[4/3] bg-white/10 rounded-2xl overflow-hidden">
                  {brand.heroImage ? (
                    <img 
                      src={brand.heroImage} 
                      alt="Hero image" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/60">
                      <div className="text-center">
                        <div className="text-6xl mb-4">🎯</div>
                        <p className="text-lg font-semibold">Hero Image</p>
                        <p className="text-sm opacity-75">Upload to customize</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <div className="text-white text-2xl">✨</div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <div className="text-white text-2xl">🚀</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Features Section */}
      {(!brand.sections?.features || brand.sections.features.feature1?.enabled !== false || brand.sections.features.feature2?.enabled !== false) && (
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-20">
              <h2 className="text-5xl font-black text-gray-900 mb-6">Why Choose Us</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover what makes {brand.brandName} the perfect choice for your needs
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12">
              {(!brand.sections?.features?.feature1 || brand.sections.features.feature1.enabled !== false) && (
                <div className="group relative">
                  <div className="bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                    {/* Feature Image */}
                    <div className="mb-8">
                      {brand.featureImage1 ? (
                        <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg">
                          <img src={brand.featureImage1} alt="Feature 1" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--brand-secondary)] to-[var(--brand-primary)] flex items-center justify-center shadow-lg">
                          <span className="text-3xl text-white">⭐</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">
                      {brand.sections?.features?.feature1?.title || 'Premium Quality'}
                    </h3>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      {brand.sections?.features?.feature1?.description || 'Experience the difference with our industry-leading solutions that deliver exceptional results every time.'}
                    </p>
                    
                    {/* Decorative Element */}
                    <div className="absolute top-6 right-6 w-12 h-12 bg-[var(--brand-secondary)]/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <div className="w-6 h-6 bg-[var(--brand-secondary)] rounded-full"></div>
                    </div>
                  </div>
                </div>
              )}
              
              {(!brand.sections?.features?.feature2 || brand.sections.features.feature2.enabled !== false) && (
                <div className="group relative">
                  <div className="bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                    {/* Feature Image */}
                    <div className="mb-8">
                      {brand.featureImage2 ? (
                        <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg">
                          <img src={brand.featureImage2} alt="Feature 2" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--brand-accent)] to-[var(--brand-primary)] flex items-center justify-center shadow-lg">
                          <span className="text-3xl text-white">⚡</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">
                      {brand.sections?.features?.feature2?.title || 'Fast Results'}
                    </h3>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      {brand.sections?.features?.feature2?.description || 'See immediate impact with our proven methodology that accelerates your success.'}
                    </p>
                    
                    {/* Decorative Element */}
                    <div className="absolute top-6 right-6 w-12 h-12 bg-[var(--brand-accent)]/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <div className="w-6 h-6 bg-[var(--brand-accent)] rounded-full"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Modern Pricing Section */}
      {(!brand.sections?.pricing || brand.sections.pricing.enabled !== false) && (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-5xl font-black text-gray-900 mb-6">Simple Pricing</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Choose the perfect plan for your needs. Start free, upgrade when you&apos;re ready.
              </p>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {(!brand.sections?.pricing?.plans?.[0] || brand.sections.pricing.plans[0].enabled !== false) && (
                <div className="group relative bg-white border-2 border-gray-200 rounded-3xl p-8 hover:border-[var(--brand-primary)] transition-all duration-300 hover:shadow-xl">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {brand.sections?.pricing?.plans?.[0]?.name || 'Starter'}
                    </h3>
                    <p className="text-gray-500 mb-8">Perfect for getting started</p>
                    <div className="mb-8">
                      <span className="text-5xl font-black text-gray-900">
                        {brand.sections?.pricing?.plans?.[0]?.price || '$99'}
                      </span>
                      <span className="text-gray-500 text-lg">/month</span>
                    </div>
                    <button className="w-full bg-gray-900 text-white py-4 rounded-2xl font-semibold hover:bg-gray-800 transition-colors group-hover:bg-[var(--brand-primary)]" onClick={() => brand.ctaUrl && window.open(brand.ctaUrl, '_blank')}>
                      {brand.copy.cta}
                    </button>
                  </div>
                </div>
              )}
              
              {(!brand.sections?.pricing?.plans?.[1] || brand.sections.pricing.plans[1].enabled !== false) && (
                <div className="relative bg-[var(--brand-primary)] text-white rounded-3xl p-8 transform scale-105 shadow-2xl">
                  {/* Popular Badge */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-white text-[var(--brand-primary)] px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                      Most Popular
                    </span>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-2">
                      {brand.sections?.pricing?.plans?.[1]?.name || 'Professional'}
                    </h3>
                    <p className="text-white/80 mb-8">Best for growing businesses</p>
                    <div className="mb-8">
                      <span className="text-5xl font-black">
                        {brand.sections?.pricing?.plans?.[1]?.price || '$199'}
                      </span>
                      <span className="text-white/80 text-lg">/month</span>
                    </div>
                    <button className="w-full bg-white text-[var(--brand-primary)] py-4 rounded-2xl font-semibold hover:bg-gray-50 transition-colors shadow-lg">
                      {brand.copy.cta}
                    </button>
                  </div>
                </div>
              )}
              
              {(!brand.sections?.pricing?.plans?.[2] || brand.sections.pricing.plans[2].enabled !== false) && (
                <div className="group relative bg-white border-2 border-gray-200 rounded-3xl p-8 hover:border-[var(--brand-primary)] transition-all duration-300 hover:shadow-xl">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {brand.sections?.pricing?.plans?.[2]?.name || 'Enterprise'}
                    </h3>
                    <p className="text-gray-500 mb-8">For large organizations</p>
                    <div className="mb-8">
                      <span className="text-5xl font-black text-gray-900">
                        {brand.sections?.pricing?.plans?.[2]?.price || '$399'}
                      </span>
                      <span className="text-gray-500 text-lg">/month</span>
                    </div>
                    <button className="w-full bg-gray-900 text-white py-4 rounded-2xl font-semibold hover:bg-gray-800 transition-colors group-hover:bg-[var(--brand-primary)]" onClick={() => brand.ctaUrl && window.open(brand.ctaUrl, '_blank')}>
                      {brand.copy.cta}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Modern FAQ Section */}
      {(!brand.sections?.faq || brand.sections.faq.enabled !== false) && (
        <section className="py-24 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-5xl font-black text-gray-900 mb-6">Got Questions?</h2>
              <p className="text-xl text-gray-600">
                We&apos;ve got answers. Here are some of the most common questions about {brand.brandName}.
              </p>
            </div>
            
            <div className="space-y-6">
              {(!brand.sections?.faq?.questions?.[0] || brand.sections.faq.questions[0].enabled !== false) && (
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {brand.sections?.faq?.questions?.[0]?.question || `How does ${brand.brandName} work?`}
                  </h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {brand.sections?.faq?.questions?.[0]?.answer || `Our platform provides comprehensive solutions tailored to your specific needs in the ${brand.industry?.toLowerCase()} industry.`}
                  </p>
                </div>
              )}
              {(!brand.sections?.faq?.questions?.[1] || brand.sections.faq.questions[1].enabled !== false) && (
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {brand.sections?.faq?.questions?.[1]?.question || 'What makes you different?'}
                  </h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {brand.sections?.faq?.questions?.[1]?.answer || 'We combine cutting-edge technology with personalized service to deliver exceptional results for our clients.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Modern Footer */}
      <footer className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Logo & Brand */}
            <div className="flex items-center justify-center mb-8">
              {brand.logoUrl && (
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 mr-4">
                  <img
                    src={brand.logoUrl}
                    alt={brand.brandName}
                    className="h-8 w-auto filter brightness-0 invert"
                  />
                </div>
              )}
              <span className="text-3xl font-bold">{brand.brandName}</span>
            </div>
            
            {/* Description */}
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              {brand.description || `Transform your business with ${brand.brandName}. Join thousands of satisfied customers who trust us to deliver exceptional results.`}
            </p>
            
            {/* Final CTA */}
            <div className="mb-12">
              <button 
                className="group bg-[var(--brand-primary)] hover:bg-[var(--brand-accent)] text-white font-bold py-6 px-12 rounded-2xl text-xl shadow-2xl transform hover:scale-105 transition-all duration-300"
                onClick={() => brand.ctaUrl && window.open(brand.ctaUrl, '_blank')}
              >
                <span className="flex items-center justify-center">
                  {brand.copy.cta}
                  <svg className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
              </button>
            </div>
            
            {/* Copyright */}
            <div className="border-t border-gray-800 pt-8">
              <p className="text-gray-400">
                © 2024 {brand.brandName}. All rights reserved.
              </p>
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
      <!-- Hero with gradient background -->
      <section style="background: linear-gradient(135deg, ${brand.colors.primary}, ${brand.colors.accent}); color: white; padding: 5rem 1rem;">
        <div style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center;">
          <div>
            <div style="display: flex; align-items: center; margin-bottom: 1.5rem;">
              ${brand.logoUrl ? `<img src="${brand.logoUrl}" alt="${brand.brandName}" style="height: 2.5rem; margin-right: 1rem; filter: brightness(0) invert(1);">` : ''}
              <span style="font-size: 1.5rem; font-weight: bold;">${brand.brandName}</span>
            </div>
            <h1 style="font-size: 3rem; font-weight: bold; margin-bottom: 1.5rem;">${brand.copy.headline}</h1>
            <p style="font-size: 1.25rem; margin-bottom: 2rem; opacity: 0.9;">${brand.copy.subheadline}</p>
            <button style="background: white; color: ${brand.colors.primary}; padding: 1rem 2rem; border: none; border-radius: 0.5rem; font-size: 1.125rem; font-weight: bold; cursor: pointer;">${brand.copy.cta}</button>
          </div>
          <div style="background: rgba(255,255,255,0.1); border-radius: 1rem; padding: 2rem; backdrop-filter: blur(10px);">
            <div style="aspect-ratio: 16/9; background: rgba(255,255,255,0.2); border-radius: 0.5rem; display: flex; align-items: center; justify-content: center;">
              ${brand.heroImage ? `<img src="${brand.heroImage}" alt="Hero image" style="width: 100%; height: 100%; object-fit: cover; border-radius: 0.5rem;">` : `
                <div style="text-align: center; color: rgba(255,255,255,0.7);">
                  <div style="font-size: 2rem; margin-bottom: 0.5rem;">📷</div>
                  <p style="font-size: 0.875rem; margin: 0;">Hero Image Placeholder</p>
                  <p style="font-size: 0.75rem; margin: 0; opacity: 0.75;">Upload an image to replace this</p>
                </div>
              `}
            </div>
          </div>
        </div>
      </section>

      <!-- Features -->
      ${(!brand.sections?.features || brand.sections.features.feature1?.enabled !== false || brand.sections.features.feature2?.enabled !== false) ? `
      <section style="padding: 5rem 1rem;">
        <div style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
          ${(!brand.sections?.features?.feature1 || brand.sections.features.feature1.enabled !== false) ? `
          <div style="background: ${brand.colors.secondary}; color: white; padding: 3rem; border-radius: 1rem; position: relative;">
            ${brand.featureImage1 ? `
              <div style="position: absolute; top: 1rem; right: 1rem; width: 4rem; height: 4rem; border-radius: 0.5rem; overflow: hidden;">
                <img src="${brand.featureImage1}" alt="Feature 1" style="width: 100%; height: 100%; object-fit: cover;">
              </div>
            ` : `
              <div style="position: absolute; top: 1rem; right: 1rem; width: 4rem; height: 4rem; border-radius: 0.5rem; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 1.5rem;">🖼️</span>
              </div>
            `}
            <h3 style="font-size: 1.875rem; font-weight: bold; margin-bottom: 1rem;">${brand.sections?.features?.feature1?.title || 'Premium Quality'}</h3>
            <p style="font-size: 1.125rem; opacity: 0.9;">${brand.sections?.features?.feature1?.description || 'Experience the difference with our industry-leading solutions.'}</p>
          </div>
          ` : ''}
          ${(!brand.sections?.features?.feature2 || brand.sections.features.feature2.enabled !== false) ? `
          <div style="background: ${brand.colors.accent}; color: white; padding: 3rem; border-radius: 1rem; position: relative;">
            ${brand.featureImage2 ? `
              <div style="position: absolute; top: 1rem; right: 1rem; width: 4rem; height: 4rem; border-radius: 0.5rem; overflow: hidden;">
                <img src="${brand.featureImage2}" alt="Feature 2" style="width: 100%; height: 100%; object-fit: cover;">
              </div>
            ` : `
              <div style="position: absolute; top: 1rem; right: 1rem; width: 4rem; height: 4rem; border-radius: 0.5rem; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 1.5rem;">🖼️</span>
              </div>
            `}
            <h3 style="font-size: 1.875rem; font-weight: bold; margin-bottom: 1rem;">${brand.sections?.features?.feature2?.title || 'Fast Results'}</h3>
            <p style="font-size: 1.125rem; opacity: 0.9;">${brand.sections?.features?.feature2?.description || 'See immediate impact with our proven methodology.'}</p>
          </div>
          ` : ''}
        </div>
      </section>
      ` : ''}

      <!-- Pricing -->
      ${(!brand.sections?.pricing || brand.sections.pricing.enabled !== false) ? `
      <section style="padding: 5rem 1rem; background: #f9fafb;">
        <div style="max-width: 1200px; margin: 0 auto; text-align: center;">
          <h2 style="font-size: 2.5rem; font-weight: bold; margin-bottom: 1rem;">Choose Your Plan</h2>
          <p style="font-size: 1.25rem; color: #6b7280; margin-bottom: 4rem;">Get started with ${brand.brandName} today</p>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem;">
            ${(!brand.sections?.pricing?.plans?.[0] || brand.sections.pricing.plans[0].enabled !== false) ? `
            <div style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
              <h3 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">${brand.sections?.pricing?.plans?.[0]?.name || 'Starter'}</h3>
              <div style="font-size: 2.5rem; font-weight: bold; color: ${brand.colors.primary}; margin-bottom: 1.5rem;">${brand.sections?.pricing?.plans?.[0]?.price || '$99'}<span style="font-size: 1rem; color: #6b7280;">/mo</span></div>
              <button style="width: 100%; background: ${brand.colors.primary}; color: white; padding: 0.75rem; border: none; border-radius: 0.5rem; font-weight: 500; cursor: pointer;" onclick="window.open('${brand.ctaUrl || 'https://example.com'}', '_blank')">${brand.copy.cta}</button>
            </div>
            ` : ''}
            ${(!brand.sections?.pricing?.plans?.[1] || brand.sections.pricing.plans[1].enabled !== false) ? `
            <div style="background: ${brand.colors.primary}; color: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 10px 25px rgba(0,0,0,0.1); transform: scale(1.05);">
              <h3 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">${brand.sections?.pricing?.plans?.[1]?.name || 'Professional'}</h3>
              <div style="font-size: 2.5rem; font-weight: bold; margin-bottom: 1.5rem;">${brand.sections?.pricing?.plans?.[1]?.price || '$199'}<span style="font-size: 1rem; opacity: 0.75;">/mo</span></div>
              <button style="width: 100%; background: white; color: ${brand.colors.primary}; padding: 0.75rem; border: none; border-radius: 0.5rem; font-weight: 500; cursor: pointer;" onclick="window.open('${brand.ctaUrl || 'https://example.com'}', '_blank')">${brand.copy.cta}</button>
            </div>
            ` : ''}
            ${(!brand.sections?.pricing?.plans?.[2] || brand.sections.pricing.plans[2].enabled !== false) ? `
            <div style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
              <h3 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">${brand.sections?.pricing?.plans?.[2]?.name || 'Enterprise'}</h3>
              <div style="font-size: 2.5rem; font-weight: bold; color: ${brand.colors.primary}; margin-bottom: 1.5rem;">${brand.sections?.pricing?.plans?.[2]?.price || '$399'}<span style="font-size: 1rem; color: #6b7280;">/mo</span></div>
              <button style="width: 100%; background: ${brand.colors.primary}; color: white; padding: 0.75rem; border: none; border-radius: 0.5rem; font-weight: 500; cursor: pointer;" onclick="window.open('${brand.ctaUrl || 'https://example.com'}', '_blank')">${brand.copy.cta}</button>
            </div>
            ` : ''}
          </div>
        </div>
      </section>
      ` : ''}

      <!-- FAQ -->
      ${(!brand.sections?.faq || brand.sections.faq.enabled !== false) ? `
      <section style="padding: 5rem 1rem;">
        <div style="max-width: 48rem; margin: 0 auto;">
          <h2 style="font-size: 2.5rem; font-weight: bold; text-align: center; margin-bottom: 4rem;">Frequently Asked Questions</h2>
          <div style="space-y: 2rem;">
            ${(!brand.sections?.faq?.questions?.[0] || brand.sections.faq.questions[0].enabled !== false) ? `
            <div style="border-bottom: 1px solid #e5e7eb; padding-bottom: 2rem; margin-bottom: 2rem;">
              <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem;">${brand.sections?.faq?.questions?.[0]?.question || `How does ${brand.brandName} work?`}</h3>
              <p style="color: #6b7280;">${brand.sections?.faq?.questions?.[0]?.answer || `Our platform provides comprehensive solutions tailored to your specific needs in the ${brand.industry?.toLowerCase()} industry.`}</p>
            </div>
            ` : ''}
            ${(!brand.sections?.faq?.questions?.[1] || brand.sections.faq.questions[1].enabled !== false) ? `
            <div style="border-bottom: 1px solid #e5e7eb; padding-bottom: 2rem;">
              <h3 style="font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem;">${brand.sections?.faq?.questions?.[1]?.question || 'What makes you different?'}</h3>
              <p style="color: #6b7280;">${brand.sections?.faq?.questions?.[1]?.answer || 'We combine cutting-edge technology with personalized service to deliver exceptional results for our clients.'}</p>
            </div>
            ` : ''}
          </div>
        </div>
      </section>
      ` : ''}

      <!-- Footer -->
      <footer style="background: #111827; color: white; padding: 4rem 1rem; text-align: center;">
        <div style="max-width: 1200px; margin: 0 auto;">
          <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 2rem;">
            ${brand.logoUrl ? `<img src="${brand.logoUrl}" alt="${brand.brandName}" style="height: 2.5rem; margin-right: 1rem; filter: brightness(0) invert(1);">` : ''}
            <span style="font-size: 1.5rem; font-weight: bold;">${brand.brandName}</span>
          </div>
          <p style="color: #9ca3af; margin-bottom: 2rem; max-width: 32rem; margin-left: auto; margin-right: auto;">${brand.description}</p>
          <button style="background: ${brand.colors.primary}; color: white; padding: 1rem 2rem; border: none; border-radius: 0.5rem; font-size: 1.125rem; font-weight: bold; cursor: pointer;" onclick="window.open('${brand.ctaUrl || 'https://example.com'}', '_blank')">${brand.copy.cta}</button>
        </div>
      </footer>
    </body>
    </html>
  `

  return { html, css }
}
