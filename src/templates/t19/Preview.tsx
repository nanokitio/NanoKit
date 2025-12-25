'use client'

import React from 'react'
import { BrandConfig } from '@/lib/types'

interface Template19PreviewProps {
  brand: BrandConfig
}

export function Template19Preview({ brand }: Template19PreviewProps) {
  const headline = brand.copy.headline || 'Global Fridays Glow Up 4.20'
  const subheadline = brand.copy.subheadline || '26 SEPTEMBER 2021'
  const ctaText = brand.copy.cta || 'GET TICKETS'
  const backgroundColor = brand.customization?.backgroundColor || '#0f0f23'
  const backgroundImage = brand.customization?.backgroundImage

  return (
    <div className="w-full h-96 relative overflow-hidden rounded-lg shadow-xl">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-pink-900"
        style={{ backgroundColor }}
      >
        {backgroundImage && (
          <img 
            src={backgroundImage} 
            alt="Background" 
            className="w-full h-full object-cover opacity-50"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-center items-center text-center p-6">
        <div className="mb-4">
          <h3 className="text-2xl font-bold text-white mb-2 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            {headline}
          </h3>
          <p className="text-sm text-gray-300 mb-3">
            {subheadline}
          </p>
        </div>

        <div className="flex space-x-2 mb-4">
          <div className="bg-black/50 backdrop-blur-sm border border-white/20 rounded px-3 py-1">
            <div className="text-xs font-bold text-cyan-400">15</div>
            <div className="text-xs text-gray-400">DAYS</div>
          </div>
          <div className="bg-black/50 backdrop-blur-sm border border-white/20 rounded px-3 py-1">
            <div className="text-xs font-bold text-purple-400">08</div>
            <div className="text-xs text-gray-400">HRS</div>
          </div>
          <div className="bg-black/50 backdrop-blur-sm border border-white/20 rounded px-3 py-1">
            <div className="text-xs font-bold text-pink-400">32</div>
            <div className="text-xs text-gray-400">MIN</div>
          </div>
        </div>

        <button className="px-6 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-sm rounded-full transform transition-all duration-300 hover:scale-105 shadow-lg">
          {ctaText}
        </button>
      </div>

      {/* Overlay Effects */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-4 left-4 w-20 h-20 bg-pink-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-4 right-4 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>
    </div>
  )
}
