'use client'

import { Template6 } from '@/templates/t6'
import { Template1 } from '@/templates/t1'
import { Template7 } from '@/templates/t7'
import { useState } from 'react'

// Test page - NO AUTH REQUIRED
// Access at: /test-inline

export default function TestInlinePage() {
  const [activeTemplate, setActiveTemplate] = useState<'t1' | 't6' | 't7'>('t6')
  
  const mockBrand = {
    brandName: 'Test Casino',
    logoUrl: '',
    ctaUrl: 'https://example.com',
    colors: {
      primary: '#8B5CF6',
      secondary: '#06B6D4', 
      accent: '#F59E0B'
    },
    copy: {
      headline: 'CLICK ME TO EDIT THIS TEXT!',
      subheadline: 'Click any text to edit it directly - try it now!',
      cta: 'PLAY NOW'
    }
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Template Selector */}
      <div className="fixed top-4 left-4 z-[9999] bg-slate-800 rounded-lg p-4 shadow-xl border border-cyan-500/30">
        <h3 className="text-white font-bold mb-3 text-sm">Test Inline Editing</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTemplate('t1')}
            className={`px-3 py-2 rounded text-sm font-medium ${
              activeTemplate === 't1' 
                ? 'bg-cyan-500 text-white' 
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            T1 - Clean
          </button>
          <button
            onClick={() => setActiveTemplate('t6')}
            className={`px-3 py-2 rounded text-sm font-medium ${
              activeTemplate === 't6' 
                ? 'bg-cyan-500 text-white' 
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            T6 - Cyber
          </button>
          <button
            onClick={() => setActiveTemplate('t7')}
            className={`px-3 py-2 rounded text-sm font-medium ${
              activeTemplate === 't7' 
                ? 'bg-cyan-500 text-white' 
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            T7 - Slots
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-3">
          👆 Click any text in the template below to edit!
        </p>
      </div>

      {/* Template Preview */}
      <div className="w-full">
        {activeTemplate === 't1' && <Template1 brand={mockBrand} />}
        {activeTemplate === 't6' && <Template6 brand={mockBrand} />}
        {activeTemplate === 't7' && <Template7 brand={mockBrand} />}
      </div>
    </div>
  )
}
