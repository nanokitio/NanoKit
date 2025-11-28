'use client'

import { BrandConfig } from '@/lib/types'

interface Template18Props {
  brand: BrandConfig
}

export function Template18({ brand }: Template18Props) {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-red-700 via-red-600 to-red-700 flex items-center justify-center relative overflow-hidden">
      {/* Radial burst background effect */}
      <div className="absolute inset-0 opacity-30" style={{
        background: 'repeating-conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 3deg, rgba(139, 0, 0, 0.5) 3deg, rgba(139, 0, 0, 0.5) 6deg)'
      }} />
      
      <div className="text-center text-white p-8 relative z-10">
        <div className="bg-gradient-to-b from-yellow-500 via-yellow-400 to-yellow-500 rounded-2xl p-8 border-4 border-orange-500 shadow-2xl max-w-md mx-auto">
          <div className="bg-gradient-to-b from-red-700 via-red-600 to-red-700 rounded-xl p-6 border-2 border-yellow-400">
            <h1 className="text-5xl font-black mb-2 text-yellow-400" style={{
              textShadow: '3px 3px 0px #ff6600, 5px 5px 10px rgba(0, 0, 0, 0.5)',
              letterSpacing: '3px'
            }}>
              {brand.copy?.headline || 'BIG CASH'}
            </h1>
            <p className="text-xl font-bold mb-4 text-yellow-400" style={{
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)'
            }}>
              {brand.copy?.subheadline || 'WIN UP TO $100,000!'}
            </p>
            
            <div className="bg-red-800/30 rounded-lg p-4 mb-4">
              <p className="text-white font-bold mb-2 text-sm">YOUR NUMBERS</p>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="aspect-square bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-md flex items-center justify-center text-2xl font-bold text-red-700 shadow-lg">
                    ?
                  </div>
                ))}
              </div>
            </div>
            
            <p className="text-white font-bold mb-2 text-sm">WINNING NUMBERS</p>
            <div className="flex justify-center gap-3 mb-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-xl font-bold text-red-700 border-2 border-white shadow-lg">
                  ?
                </div>
              ))}
            </div>
            
            <div className="bg-black/30 rounded-lg p-2">
              <p className="text-white font-bold text-sm">12 CHANCES TO WIN</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-4 max-w-md mx-auto">
          <p className="text-sm opacity-90">
            🎰 Interactive Scratch Card Game
            <br />
            Preview it in the editor to play the full scratch experience!
          </p>
        </div>
      </div>
    </div>
  )
}
