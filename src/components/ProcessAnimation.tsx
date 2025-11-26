'use client'

import { useEffect, useState } from 'react'
import { Sparkles, Palette, Zap, Rocket, User, Mail, Lock, Check } from 'lucide-react'

export function ProcessAnimation() {
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % 5)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const steps = [
    { 
      number: '01', 
      title: 'Select Vertical', 
      desc: 'Choose industry', 
      Icon: Sparkles, 
      color: '#4FC3FF',
      rotate: 0,
    },
    { 
      number: '02', 
      title: 'Pick Template', 
      desc: 'Select design', 
      Icon: Palette, 
      color: '#A855F7',
      rotate: 15,
    },
    { 
      number: '03', 
      title: 'Customize Content', 
      desc: 'Edit your copy', 
      Icon: Zap, 
      color: '#FF76FF',
      rotate: -15,
    },
    { 
      number: '04', 
      title: 'Preview', 
      desc: 'See live changes', 
      Icon: Palette, 
      color: '#FF6B6B',
      rotate: 10,
    },
    { 
      number: '05', 
      title: 'Launch', 
      desc: 'Go live', 
      Icon: Rocket, 
      color: '#10B981',
      rotate: 45,
    },
  ]

  // Render mockup based on current step
  const renderMockup = () => {
    const step = steps[currentStep]
    
    switch(currentStep) {
      case 0: // Select Vertical - Real Editor UI
        return (
          <div className="w-full max-w-4xl">
            <div className="text-center space-y-3 mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 mb-2" style={{ animation: 'button-pop 0.5s ease-out 0.2s forwards', opacity: 0 }}>
                <Sparkles className="w-8 h-8 text-cyan-400" style={{ filter: `drop-shadow(0 0 8px ${step.color})` }} />
              </div>
              <h3 className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent" style={{ animation: 'text-pop 0.5s ease-out 0.4s forwards', opacity: 0 }}>
                Select Your Vertical
              </h3>
              <p className="text-slate-400" style={{ animation: 'text-pop 0.5s ease-out 0.5s forwards', opacity: 0 }}>
                Choose your industry
              </p>
            </div>
            
            {/* Editor Interface Mockup */}
            <div className="relative bg-[#0F172A] rounded-2xl border border-slate-700/50 overflow-hidden shadow-2xl" style={{ boxShadow: `0 0 60px ${step.color}20, 0 8px 32px rgba(0,0,0,0.4)`, animation: 'card-pop 0.6s ease-out 0.6s forwards', opacity: 0 }}>
              {/* Top Bar */}
              <div className="bg-[#1E293B] border-b border-slate-700/50 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 font-black text-lg">NANO KIT</div>
                  <div className="text-white/60 text-sm">My New Site</div>
                </div>
                <div className="flex gap-2">
                  <div className="px-3 py-1.5 bg-cyan-500/10 text-cyan-400 text-sm rounded-lg border border-cyan-400/20">Preview</div>
                  <div className="px-4 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm rounded-lg font-bold">Save & Exit</div>
                </div>
              </div>
              
              <div className="flex h-[400px]">
                {/* Left Sidebar */}
                <div className="w-64 bg-[#0F172A] border-r border-slate-700/50 p-4 space-y-2">
                  {/* Vertical Dropdown - OPEN */}
                  <div className="relative" style={{ animation: 'dropdown-open 0.4s ease-out 0.8s forwards', opacity: 0 }}>
                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 rounded-lg border border-cyan-400/50 cursor-pointer" style={{ boxShadow: `0 0 20px ${step.color}30` }}>
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      <span className="text-white text-sm font-semibold">Vertical</span>
                      <div className="ml-auto text-cyan-400">▼</div>
                    </div>
                    {/* Dropdown Menu */}
                    <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700/50 rounded-lg overflow-hidden z-20" style={{ animation: 'dropdown-slide 0.3s ease-out 1s forwards', opacity: 0 }}>
                      <div className="px-3 py-2 hover:bg-slate-700/50 text-slate-400 text-sm cursor-pointer transition-colors">E-commerce</div>
                      <div className="px-3 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-l-2 border-cyan-400 text-white text-sm font-semibold cursor-pointer" style={{ animation: 'highlight-pulse 0.5s ease-out 1.3s forwards' }}>🎰 Casino</div>
                      <div className="px-3 py-2 hover:bg-slate-700/50 text-slate-400 text-sm cursor-pointer transition-colors">Finance</div>
                      <div className="px-3 py-2 hover:bg-slate-700/50 text-slate-400 text-sm cursor-pointer transition-colors">Health</div>
                    </div>
                  </div>
                  
                  {/* Other Menu Items - Disabled State */}
                  <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/30 rounded-lg border border-slate-700/30 opacity-50">
                    <Palette className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-500 text-sm">Template</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/30 rounded-lg border border-slate-700/30 opacity-50">
                    <span className="text-slate-500 text-sm">🖼 Logo</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/30 rounded-lg border border-slate-700/30 opacity-50">
                    <Zap className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-500 text-sm">Content</span>
                  </div>
                </div>
                
                {/* Preview Area */}
                <div className="flex-1 bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="text-slate-500 text-sm mb-2">Select a vertical to continue</div>
                    <div className="text-slate-700 text-xs">Preview will appear here</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      
      case 1: // Pick Template - Real Template Selector with ACTUAL casino template preview
        return (
          <div className="w-full max-w-4xl">
            <div className="text-center space-y-3 mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30 mb-2" style={{ animation: 'button-pop 0.5s ease-out 0.2s forwards', opacity: 0 }}>
                <Palette className="w-8 h-8 text-purple-400" style={{ filter: `drop-shadow(0 0 8px ${step.color})` }} />
              </div>
              <h3 className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent" style={{ animation: 'text-pop 0.5s ease-out 0.4s forwards', opacity: 0 }}>
                Pick Template
              </h3>
              <p className="text-slate-400" style={{ animation: 'text-pop 0.5s ease-out 0.5s forwards', opacity: 0 }}>
                Click on Cyber Casino template
              </p>
            </div>
            
            {/* Editor Interface with Template Tab */}
            <div className="relative bg-[#0F172A] rounded-2xl border border-slate-700/50 overflow-hidden shadow-2xl" style={{ boxShadow: `0 0 60px ${step.color}20, 0 8px 32px rgba(0,0,0,0.4)`, animation: 'card-pop 0.6s ease-out 0.6s forwards', opacity: 0 }}>
              {/* Top Bar */}
              <div className="bg-[#1E293B] border-b border-slate-700/50 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 font-black text-lg">NANO KIT</div>
                  <div className="text-white/60 text-sm">My New Site</div>
                </div>
              </div>
              
              <div className="flex h-[450px]">
                {/* Left Sidebar - Template Tab Active */}
                <div className="w-64 bg-[#0F172A] border-r border-slate-700/50 p-4 space-y-2">
                  <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/30 rounded-lg border border-slate-700/30 opacity-50">
                    <Sparkles className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-500 text-sm">Vertical</span>
                  </div>
                  {/* Template Tab - ACTIVE */}
                  <div className="flex items-center gap-2 px-3 py-2 bg-purple-500/20 rounded-lg border border-purple-400/50 cursor-pointer" style={{ boxShadow: `0 0 20px ${step.color}30`, animation: 'dropdown-open 0.4s ease-out 0.8s forwards', opacity: 0 }}>
                    <Palette className="w-4 h-4 text-purple-400" />
                    <span className="text-white text-sm font-semibold">Template</span>
                  </div>
                </div>
                
                {/* Template Grid Area */}
                <div className="flex-1 bg-gradient-to-br from-slate-900 to-slate-800 p-6 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Cyber Casino Template - WITH REAL PREVIEW */}
                    <div className="relative group cursor-pointer" style={{ animation: 'card-pop 0.6s ease-out 1s forwards', opacity: 0 }}>
                      <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gradient-to-br from-purple-900/40 via-slate-900 to-slate-800 border-2 border-purple-400/60 transition-all" style={{ boxShadow: `0 0 40px ${step.color}50` }}>
                        {/* REAL Template Preview */}
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-pink-600/30 p-4 flex flex-col items-center justify-center">
                          <div className="text-center space-y-3">
                            <div className="text-2xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                              Win Big Today! 💎
                            </div>
                            <div className="text-xs text-slate-300">Join thousands of winners...</div>
                            <div className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg text-white text-xs font-bold">
                              🎁 BONUS: 05:49
                            </div>
                            {/* Mini slot machine visual */}
                            <div className="flex gap-2 justify-center mt-2">
                              <div className="w-12 h-12 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded border border-green-400/40 flex items-center justify-center">
                                <div className="text-lg">💵</div>
                              </div>
                              <div className="w-12 h-12 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded border border-purple-400/40 flex items-center justify-center">
                                <div className="text-lg">🎖</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Click Indicator */}
                        <div className="absolute inset-0 flex items-center justify-center" style={{ animation: 'click-pulse 1s ease-out 1.5s infinite' }}>
                          <div className="w-16 h-16 rounded-full border-4 border-purple-400 bg-purple-500/20" style={{ animation: 'ping-slow 1.5s ease-out 1.5s infinite' }} />
                        </div>
                      </div>
                      
                      {/* Selected Check */}
                      <div className="absolute top-2 right-2 z-20" style={{ animation: 'check-bounce 0.5s ease-out 1.7s forwards', opacity: 0 }}>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg" style={{ boxShadow: `0 0 20px ${step.color}90` }}>
                          <Check className="w-6 h-6 text-white" strokeWidth={3} />
                        </div>
                      </div>
                      
                      {/* Template Name */}
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="bg-slate-900/95 backdrop-blur-sm rounded-lg px-3 py-2 border border-purple-400/50">
                          <p className="text-sm font-bold text-white">🎰 Cyber Casino</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Other Templates - Smaller */}
                    {['Fortune Wheel', 'Scratch Card'].map((name, i) => (
                      <div key={i} className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 opacity-60" style={{ animation: `card-pop 0.4s ease-out ${1.2 + i * 0.1}s forwards`, opacity: 0 }}>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-3xl">{i === 0 ? '🎡' : '🎫'}</div>
                        </div>
                        <div className="absolute bottom-2 left-2 right-2">
                          <div className="bg-slate-900/80 rounded px-2 py-1 border border-slate-700/50">
                            <p className="text-xs font-semibold text-slate-400 truncate">{name}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      
      case 2: // Customize Content - Real Content Editor
        return (
          <div className="w-full max-w-4xl">
            <div className="text-center space-y-3 mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-pink-400/30 mb-2" style={{ animation: 'button-pop 0.5s ease-out 0.2s forwards', opacity: 0 }}>
                <Zap className="w-8 h-8 text-pink-400" style={{ filter: `drop-shadow(0 0 8px ${step.color})` }} />
              </div>
              <h3 className="text-3xl font-black bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent" style={{ animation: 'text-pop 0.5s ease-out 0.4s forwards', opacity: 0 }}>
                Edit Content
              </h3>
              <p className="text-slate-400" style={{ animation: 'text-pop 0.5s ease-out 0.5s forwards', opacity: 0 }}>
                Change heading to "Win Big Today!"
              </p>
            </div>
            
            {/* Editor Interface - Real UI */}
            <div className="relative bg-[#0F172A] rounded-2xl border border-slate-700/50 overflow-hidden shadow-2xl" style={{ boxShadow: `0 0 60px ${step.color}20, 0 8px 32px rgba(0,0,0,0.4)`, animation: 'card-pop 0.6s ease-out 0.6s forwards', opacity: 0 }}>
              {/* Top Bar */}
              <div className="bg-[#1E293B] border-b border-slate-700/50 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 font-black text-lg">NANO KIT</div>
                  <div className="text-white/60 text-sm">My New Site</div>
                </div>
                <div className="flex gap-2">
                  <div className="px-3 py-1.5 bg-cyan-500/10 text-cyan-400 text-sm rounded-lg border border-cyan-400/20">Preview</div>
                  <div className="px-4 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm rounded-lg font-bold">Download / Host</div>
                </div>
              </div>
              
              <div className="flex h-[420px]">
                {/* Left Sidebar - Content Tab Active */}
                <div className="w-64 bg-[#0F172A] border-r border-slate-700/50 p-4 space-y-2">
                  <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/30 rounded-lg border border-slate-700/30 opacity-50">
                    <Sparkles className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-500 text-sm">Vertical</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/30 rounded-lg border border-slate-700/30 opacity-50">
                    <Palette className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-500 text-sm">Template</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/30 rounded-lg border border-slate-700/30 opacity-50">
                    <span className="text-slate-500 text-sm">🖼 Logo</span>
                  </div>
                  {/* Content Tab - ACTIVE */}
                  <div className="flex items-center gap-2 px-3 py-2 bg-pink-500/20 rounded-lg border border-pink-400/50 cursor-pointer" style={{ boxShadow: `0 0 20px ${step.color}30`, animation: 'dropdown-open 0.4s ease-out 0.8s forwards', opacity: 0 }}>
                    <Zap className="w-4 h-4 text-pink-400" />
                    <span className="text-white text-sm font-semibold">Content</span>
                  </div>
                  
                  {/* Content Editor Panel */}
                  <div className="mt-4 space-y-3" style={{ animation: 'dropdown-slide 0.3s ease-out 1s forwards', opacity: 0 }}>
                    <div className="space-y-2">
                      <div className="text-xs text-slate-400 font-semibold">Heading Text</div>
                      <input 
                        className="w-full bg-slate-800/50 border border-pink-400/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-400/50" 
                        value="My New Site"
                        readOnly
                        style={{ animation: 'text-change 0.6s ease-out 1.3s forwards' }}
                      />
                      <div className="text-xs text-pink-400 font-mono" style={{ animation: 'text-pop 0.4s ease-out 1.6s forwards', opacity: 0 }}>
                        → Win Big Today!
                      </div>
                    </div>
                    
                    <div className="space-y-2 opacity-50">
                      <div className="text-xs text-slate-500 font-semibold">Subtitle</div>
                      <input 
                        className="w-full bg-slate-800/30 border border-slate-700/30 rounded-lg px-3 py-2 text-slate-500 text-sm" 
                        value="Join thousands..."
                        readOnly
                      />
                    </div>
                  </div>
                </div>
                
                {/* Preview Area - Real Cyber Casino Template */}
                <div className="flex-1 bg-gradient-to-br from-purple-900/20 via-slate-900 to-slate-800 flex items-center justify-center p-6">
                  <div className="relative w-full max-w-md bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl border border-purple-500/30 p-8 text-center" style={{ boxShadow: '0 0 50px rgba(168,85,247,0.4)' }}>
                    {/* Grid background effect */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.1)_1px,transparent_1px)] bg-[size:20px_20px] opacity-30 rounded-2xl" />
                    
                    {/* Content */}
                    <div className="relative z-10">
                      {/* Animated Title Change */}
                      <div className="mb-6">
                        <div className="text-3xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight" style={{ animation: 'title-morph 0.8s ease-out 1.4s forwards', filter: 'drop-shadow(0 0 20px rgba(168,85,247,0.6))' }}>
                          My New Site - Win Big Today! 💎
                        </div>
                      </div>
                      <div className="text-slate-300 text-sm mb-8 px-4">Join thousands of winners at the hottest casino of 2025</div>
                      
                      {/* Bonus Timer */}
                      <div className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl text-white font-bold shadow-lg mb-6" style={{ boxShadow: '0 0 30px rgba(236,72,153,0.5)' }}>
                        <span>🎁 BONUS EXPIRES: 05:49 ⏰</span>
                      </div>
                      
                      {/* Win boxes */}
                      <div className="grid grid-cols-2 gap-3 mt-6">
                        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl border border-green-400/40 p-4">
                          <div className="text-green-400 font-bold text-xs mb-1">MAX WIN</div>
                          <div className="text-white font-black text-lg">$5,000</div>
                          <div className="text-2xl mt-1">💵</div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-400/40 p-4">
                          <div className="text-purple-400 font-bold text-xs mb-1">MIN WIN</div>
                          <div className="text-white font-black text-lg">$1,050</div>
                          <div className="text-2xl mt-1">🎖</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      
      case 3: // Preview - Live Preview Mode
        return (
          <div className="w-full max-w-5xl">
            <div className="text-center space-y-3 mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-400/30 mb-2" style={{ animation: 'button-pop 0.5s ease-out 0.2s forwards', opacity: 0 }}>
                <Palette className="w-8 h-8 text-red-400" style={{ filter: `drop-shadow(0 0 8px ${step.color})` }} />
              </div>
              <h3 className="text-3xl font-black bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent" style={{ animation: 'text-pop 0.5s ease-out 0.4s forwards', opacity: 0 }}>
                Preview Site
              </h3>
              <p className="text-slate-400" style={{ animation: 'text-pop 0.5s ease-out 0.5s forwards', opacity: 0 }}>
                Click "Preview" to see it live
              </p>
            </div>
            
            {/* Full Screen Preview */}
            <div className="relative bg-[#0F172A] rounded-2xl border border-slate-700/50 overflow-hidden shadow-2xl" style={{ boxShadow: `0 0 60px ${step.color}20, 0 8px 32px rgba(0,0,0,0.4)`, animation: 'card-pop 0.6s ease-out 0.6s forwards', opacity: 0 }}>
              {/* Top Bar with Preview Button Active */}
              <div className="bg-[#1E293B] border-b border-slate-700/50 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 font-black text-lg">NANO KIT</div>
                  <div className="text-white/60 text-sm">My New Site</div>
                </div>
                <div className="flex gap-2">
                  {/* Preview Button - ACTIVE with Click Indicator */}
                  <div className="relative">
                    <div className="px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm rounded-lg font-bold cursor-pointer" style={{ boxShadow: `0 0 20px ${step.color}50`, animation: 'button-pulse 0.6s ease-out 0.8s forwards', opacity: 0 }}>
                      ▶ Preview
                    </div>
                    {/* Click indicator */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ animation: 'click-pulse 1s ease-out 1.2s infinite' }}>
                      <div className="w-full h-full rounded-lg border-2 border-cyan-400 bg-cyan-500/10" style={{ animation: 'ping-slow 1.5s ease-out 1.2s infinite' }} />
                    </div>
                  </div>
                  <div className="px-4 py-1.5 bg-slate-800/50 text-slate-400 text-sm rounded-lg border border-slate-700/50">Download / Host</div>
                </div>
              </div>
              
              {/* Full Preview Content */}
              <div className="bg-gradient-to-br from-purple-900/30 via-slate-900 to-slate-800 p-12 flex items-center justify-center min-h-[400px]">
                <div className="w-full max-w-2xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl border border-purple-500/30 p-12 text-center" style={{ boxShadow: '0 0 60px rgba(168,85,247,0.4)', animation: 'scale-up 0.6s ease-out 1s forwards', opacity: 0 }}>
                  <div className="text-5xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
                    My New Site - Win Big Today! 💎
                  </div>
                  <div className="text-slate-300 text-lg mb-8">Join thousands of winners at the hottest casino of 2025</div>
                  <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl text-white font-bold text-lg shadow-lg" style={{ boxShadow: '0 0 30px rgba(236,72,153,0.6)' }}>
                    <span>🎁 BONUS EXPIRES: 05:49</span>
                  </div>
                  <div className="mt-8 flex justify-center gap-4">
                    <div className="px-6 py-3 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl border border-green-400/30 text-green-400 font-bold">💵 MAX WIN $5,000</div>
                    <div className="px-6 py-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-400/30 text-purple-400 font-bold">🎖 MIN WIN $1,050</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      
      case 4: // Launch - Ready to Host
        return (
          <div className="w-full max-w-4xl">
            <div className="text-center space-y-3 mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-400/30 mb-2" style={{ animation: 'button-pop 0.5s ease-out 0.2s forwards', opacity: 0 }}>
                <Rocket className="w-8 h-8 text-emerald-400" style={{ filter: `drop-shadow(0 0 8px ${step.color})` }} />
              </div>
              <h3 className="text-3xl font-black bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent" style={{ animation: 'text-pop 0.5s ease-out 0.4s forwards', opacity: 0 }}>
                Launch Site
              </h3>
              <p className="text-slate-400" style={{ animation: 'text-pop 0.5s ease-out 0.5s forwards', opacity: 0 }}>
                Click "Download / Host" to go live
              </p>
            </div>
            
            {/* Launch Interface */}
            <div className="relative bg-[#0F172A] rounded-2xl border border-slate-700/50 overflow-hidden shadow-2xl" style={{ boxShadow: `0 0 60px ${step.color}30, 0 8px 32px rgba(0,0,0,0.4)`, animation: 'card-pop 0.6s ease-out 0.6s forwards', opacity: 0 }}>
              {/* Top Bar with Host Button Active */}
              <div className="bg-[#1E293B] border-b border-slate-700/50 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 font-black text-lg">NANO KIT</div>
                  <div className="text-white/60 text-sm">My New Site</div>
                </div>
                <div className="flex gap-2">
                  <div className="px-3 py-1.5 bg-cyan-500/10 text-cyan-400 text-sm rounded-lg border border-cyan-400/20">Preview</div>
                  {/* Download/Host Button - ACTIVE with Click Indicator */}
                  <div className="relative">
                    <div className="px-6 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm rounded-lg font-bold relative overflow-hidden cursor-pointer" style={{ boxShadow: `0 0 30px ${step.color}60`, animation: 'button-pulse 0.6s ease-out 0.8s forwards', opacity: 0 }}>
                      <span className="relative z-10">🚀 Download / Host</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                    </div>
                    {/* Click indicator */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ animation: 'click-pulse 1s ease-out 1.2s infinite' }}>
                      <div className="w-full h-full rounded-lg border-2 border-emerald-400 bg-emerald-500/10" style={{ animation: 'ping-slow 1.5s ease-out 1.2s infinite' }} />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Success State */}
              <div className="bg-gradient-to-br from-emerald-900/20 via-slate-900 to-slate-800 p-16 flex items-center justify-center min-h-[380px]">
                <div className="text-center" style={{ animation: 'scale-up 0.6s ease-out 1s forwards', opacity: 0 }}>
                  {/* Success Icon */}
                  <div className="relative inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500/20 to-green-500/20 border-4 border-emerald-400/30 mb-6" style={{ animation: 'rocket-launch 1.2s ease-out 1.2s forwards' }}>
                    <Rocket className="w-16 h-16 text-emerald-400" style={{ filter: 'drop-shadow(0 0 20px rgba(16,185,129,0.8))' }} />
                    <div className="absolute inset-0 rounded-full border-4 border-emerald-400/50 animate-ping" />
                  </div>
                  
                  <h4 className="text-4xl font-black bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent mb-4" style={{ animation: 'text-pop 0.5s ease-out 1.5s forwards', opacity: 0 }}>
                    Ready to Launch! 🎉
                  </h4>
                  <p className="text-slate-400 text-lg mb-8" style={{ animation: 'text-pop 0.5s ease-out 1.7s forwards', opacity: 0 }}>
                    Your site is ready to go live on AWS
                  </p>
                  
                  {/* Options */}
                  <div className="flex gap-4 justify-center" style={{ animation: 'button-pop 0.5s ease-out 1.9s forwards', opacity: 0 }}>
                    <div className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl text-white font-bold text-lg shadow-lg" style={{ boxShadow: '0 0 40px rgba(16,185,129,0.5)' }}>
                      ☁️ Host on AWS
                    </div>
                    <div className="px-8 py-4 bg-slate-800/80 border border-slate-700/50 rounded-xl text-white font-bold text-lg hover:border-emerald-400/50 transition-all">
                      💾 Download Files
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="relative w-full min-h-[600px] flex flex-col items-center justify-center py-12">
      {/* Ambient Glow */}
      <div 
        className="absolute w-[600px] h-[600px] rounded-full blur-3xl transition-all duration-1000"
        style={{
          background: `radial-gradient(circle, ${steps[currentStep].color}40, transparent)`,
        }}
      />

      {/* Main Mockup Display */}
      <div className="relative z-10 w-full px-4 flex items-center justify-center mb-16">
        {renderMockup()}
      </div>

      {/* Bottom Progress Bar */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-10">
        <div className="h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
          <div 
            className="h-full transition-all duration-700 rounded-full"
            style={{
              width: `${((currentStep + 1) / 5) * 100}%`,
              background: `linear-gradient(90deg, ${steps[0].color}, ${steps[currentStep].color})`,
              boxShadow: `0 0 20px ${steps[currentStep].color}`,
            }}
          />
        </div>
        <div className="text-center mt-3 text-sm text-white/60 font-medium">
          Step {currentStep + 1} of 5 • From idea to launch in seconds
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes neon-flicker {
          0%, 100% { opacity: 1; }
          10%, 30%, 50%, 70%, 90% { opacity: 0.95; }
          20%, 40%, 60%, 80% { opacity: 1; }
        }
        
        @keyframes input-fill {
          from {
            transform: translateX(-10px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes button-pop {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes card-pop {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes check-bounce {
          0% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes code-line {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes progress-fill {
          from { width: 0%; }
          to { width: 100%; }
        }
        
        @keyframes rocket-launch {
          0% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(-10deg);
          }
          100% {
            transform: translateY(0) rotate(0deg);
          }
        }
        
        @keyframes text-pop {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes dropdown-open {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes dropdown-slide {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes highlight-pulse {
          0%, 100% {
            box-shadow: 0 0 0 rgba(79, 195, 255, 0);
          }
          50% {
            box-shadow: 0 0 20px rgba(79, 195, 255, 0.6);
          }
        }
        
        @keyframes text-change {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            opacity: 1;
          }
        }
        
        @keyframes title-morph {
          0% {
            opacity: 0.8;
            transform: scale(0.98);
          }
          50% {
            opacity: 1;
            transform: scale(1.02);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes scale-up {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes button-pulse {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        @keyframes click-pulse {
          0%, 100% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
        }
        
        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.1);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
