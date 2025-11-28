'use client'

import { BrandConfig } from '@/lib/types'

interface Template17Props {
  brand: BrandConfig
}

export function Template17({ brand }: Template17Props) {
  return (
    <div className="w-full h-screen bg-gradient-to-b from-gray-900 to-yellow-700 flex items-center justify-center">
      <div className="text-center text-white p-8">
        <h1 className="text-4xl font-bold mb-4">{brand.copy?.headline || 'SPIN THE WHEEL'}</h1>
        <p className="text-xl mb-6">Fortune Wheel - Pirates Theme 🏴‍☠️</p>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto">
          <p className="text-sm opacity-90">
            This template uses an interactive Phaser game engine.
            <br />
            Preview it in the editor to see the full wheel game experience!
          </p>
        </div>
      </div>
    </div>
  )
}
