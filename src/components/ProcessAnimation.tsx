'use client'

import { useEffect, useState } from 'react'
import { Sparkles, Palette, Zap, Rocket, User, Mail, Lock, Check } from 'lucide-react'

export function ProcessAnimation() {
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % 4)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const steps = [
    { 
      number: '01', 
      title: 'Create Account', 
      desc: 'Sign up instantly', 
      Icon: Sparkles, 
      color: '#4FC3FF',
      rotate: 0,
    },
    { 
      number: '02', 
      title: 'Choose Template', 
      desc: 'Pick your design', 
      Icon: Palette, 
      color: '#A855F7',
      rotate: 15,
    },
    { 
      number: '03', 
      title: 'Customize', 
      desc: 'Make it yours', 
      Icon: Palette, 
      color: '#FF76FF',
      rotate: -15,
    },
    { 
      number: '04', 
      title: 'Launch', 
      desc: 'Go live now', 
      Icon: Rocket, 
      color: '#10B981',
      rotate: 45,
    },
  ]

  // Render mockup based on current step
  const renderMockup = () => {
    const step = steps[currentStep]
    
    switch(currentStep) {
      case 0: // Create Account - Real NanoKit Signup
        return (
          <div className="w-full max-w-md relative">
            {/* NanoKit styled card */}
            <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8 shadow-2xl" style={{ boxShadow: `0 0 60px ${step.color}20, 0 8px 32px rgba(0,0,0,0.4)` }}>
              {/* Floating geometric accents */}
              <div className="absolute -top-3 -right-3 w-6 h-6 border border-cyan-400/30 rotate-45 animate-pulse" />
              <div className="absolute -bottom-2 -left-2 w-4 h-4 border border-pink-400/30 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
              
              <div className="text-center space-y-3 mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 mb-3" style={{ animation: 'button-pop 0.5s ease-out 0.2s forwards', opacity: 0 }}>
                  <Sparkles className="w-8 h-8 text-cyan-400" style={{ filter: `drop-shadow(0 0 8px ${step.color})` }} />
                </div>
                <h3 className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent" style={{ animation: 'text-pop 0.5s ease-out 0.4s forwards', opacity: 0 }}>
                  Create Account
                </h3>
                <p className="text-slate-400 text-sm" style={{ animation: 'text-pop 0.5s ease-out 0.5s forwards', opacity: 0 }}>
                  Start building your landing pages
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="relative" style={{ animation: 'input-fill 0.6s ease-out 0.6s forwards', opacity: 0 }}>
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input 
                    className="w-full bg-slate-950/50 border border-slate-700/50 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-slate-500 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all" 
                    placeholder="Email address"
                    value="creator@example.com"
                    readOnly
                  />
                </div>
                
                <div className="relative" style={{ animation: 'input-fill 0.6s ease-out 0.8s forwards', opacity: 0 }}>
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input 
                    type="password" 
                    className="w-full bg-slate-950/50 border border-slate-700/50 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-slate-500 focus:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all" 
                    placeholder="Password"
                    value="••••••••"
                    readOnly
                  />
                </div>
                
                <button 
                  className="w-full py-3.5 rounded-xl font-bold text-white relative overflow-hidden group"
                  style={{ 
                    background: `linear-gradient(135deg, ${step.color}, #8B5CF6)`, 
                    boxShadow: `0 0 30px ${step.color}40, 0 8px 16px rgba(0,0,0,0.2)`,
                    animation: 'button-pop 0.6s ease-out 1s forwards',
                    opacity: 0
                  }}
                >
                  <span className="relative z-10">Start Creating Free →</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                </button>
                
                <p className="text-center text-slate-500 text-xs" style={{ animation: 'text-pop 0.5s ease-out 1.2s forwards', opacity: 0 }}>
                  No credit card required • Cancel anytime
                </p>
              </div>
            </div>
          </div>
        )
      
      case 1: // Choose Template - NanoKit Dashboard Style
        return (
          <div className="w-full max-w-3xl">
            <div className="text-center space-y-3 mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30 mb-2" style={{ animation: 'button-pop 0.5s ease-out 0.2s forwards', opacity: 0 }}>
                <Palette className="w-8 h-8 text-purple-400" style={{ filter: `drop-shadow(0 0 8px ${step.color})` }} />
              </div>
              <h3 className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent" style={{ animation: 'text-pop 0.5s ease-out 0.4s forwards', opacity: 0 }}>
                Choose Template
              </h3>
              <p className="text-slate-400" style={{ animation: 'text-pop 0.5s ease-out 0.5s forwards', opacity: 0 }}>
                Select your starting design
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {['Cyber Casino', 'Fortune Wheel', 'Scratch Card'].map((name, i) => (
                <div 
                  key={i} 
                  className="relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer group transition-all" 
                  style={{ 
                    animation: `card-pop 0.6s ease-out ${0.6 + i * 0.15}s forwards`, 
                    opacity: 0 
                  }}
                >
                  {/* NanoKit styled card */}
                  <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 p-3 transition-all group-hover:border-purple-400/50" style={{ boxShadow: i === 1 ? `0 0 40px ${step.color}30` : 'none' }}>
                    {/* Thumbnail */}
                    <div className="relative h-full rounded-lg overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/30">
                      {/* Header mockup */}
                      <div className="absolute top-0 left-0 right-0 h-8 bg-slate-800/60 backdrop-blur-sm border-b border-slate-700/30 flex items-center px-2 gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-400/60" />
                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/60" />
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400/60" />
                      </div>
                      
                      {/* Content mockup */}
                      <div className="absolute top-12 left-2 right-2 space-y-2">
                        <div className="h-3 bg-gradient-to-r from-cyan-400/30 to-purple-400/30 rounded w-3/4" />
                        <div className="h-2 bg-slate-700/40 rounded w-1/2" />
                        <div className="h-2 bg-slate-700/40 rounded w-2/3" />
                        <div className="mt-4 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded border border-purple-400/20" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Selected indicator */}
                  {i === 1 && (
                    <div className="absolute top-2 right-2 z-10" style={{ animation: 'check-bounce 0.5s ease-out 1.2s forwards', opacity: 0 }}>
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg" style={{ boxShadow: `0 0 20px ${step.color}60` }}>
                        <Check className="w-4 h-4 text-white" strokeWidth={3} />
                      </div>
                    </div>
                  )}
                  
                  {/* Template name */}
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="bg-slate-900/90 backdrop-blur-sm rounded-lg px-2 py-1.5 border border-slate-700/50">
                      <p className="text-xs font-bold text-white truncate">{name}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      
      case 2: // Customize - Template Editor Interface
        return (
          <div className="w-full max-w-3xl">
            <div className="text-center space-y-3 mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-pink-400/30 mb-2" style={{ animation: 'button-pop 0.5s ease-out 0.2s forwards', opacity: 0 }}>
                <Palette className="w-8 h-8 text-pink-400" style={{ filter: `drop-shadow(0 0 8px ${step.color})` }} />
              </div>
              <h3 className="text-3xl font-black bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent" style={{ animation: 'text-pop 0.5s ease-out 0.4s forwards', opacity: 0 }}>
                Customize Your Template
              </h3>
              <p className="text-slate-400" style={{ animation: 'text-pop 0.5s ease-out 0.5s forwards', opacity: 0 }}>
                Edit colors, text, and images
              </p>
            </div>
            
            {/* Editor Interface */}
            <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden shadow-2xl" style={{ boxShadow: `0 0 60px ${step.color}20, 0 8px 32px rgba(0,0,0,0.4)` }}>
              <div className="flex">
                {/* Left Panel - Controls */}
                <div className="w-1/3 bg-slate-950/50 border-r border-slate-700/50 p-4 space-y-4" style={{ animation: 'text-pop 0.5s ease-out 0.6s forwards', opacity: 0 }}>
                  <div className="space-y-2">
                    <div className="text-xs text-slate-400 font-semibold">Colors</div>
                    <div className="flex gap-2">
                      {['#4FC3FF', '#A855F7', '#FF76FF'].map((color, i) => (
                        <div key={i} className="w-8 h-8 rounded-lg border-2 border-white/20 cursor-pointer transition-all hover:scale-110" style={{ background: color, animation: `button-pop 0.3s ease-out ${0.8 + i * 0.1}s forwards`, opacity: 0 }} />
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-xs text-slate-400 font-semibold">Typography</div>
                    <div className="space-y-1.5">
                      {['Heading', 'Body'].map((label, i) => (
                        <div key={i} className="h-6 bg-slate-800/50 rounded border border-slate-700/30 px-2 flex items-center text-xs text-slate-400" style={{ animation: `input-fill 0.3s ease-out ${1 + i * 0.1}s forwards`, opacity: 0 }}>
                          {label}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-xs text-slate-400 font-semibold">Images</div>
                    <div className="h-16 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded border border-pink-400/20 flex items-center justify-center cursor-pointer" style={{ animation: 'button-pop 0.3s ease-out 1.2s forwards', opacity: 0 }}>
                      <span className="text-xs text-pink-400">Upload</span>
                    </div>
                  </div>
                </div>
                
                {/* Right Panel - Preview */}
                <div className="flex-1 p-6 space-y-3" style={{ animation: 'text-pop 0.5s ease-out 0.7s forwards', opacity: 0 }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-xs text-slate-500">Live Preview</div>
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      <div className="text-xs text-slate-500">Auto-save</div>
                    </div>
                  </div>
                  
                  {/* Mini website preview */}
                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-4 border border-slate-700/30 space-y-2">
                    <div className="h-6 bg-gradient-to-r from-pink-400/30 to-purple-400/30 rounded w-3/4 transition-all" style={{ animation: 'card-pop 0.4s ease-out 0.9s forwards', opacity: 0 }} />
                    <div className="h-3 bg-slate-700/40 rounded w-1/2" style={{ animation: 'card-pop 0.4s ease-out 1s forwards', opacity: 0 }} />
                    <div className="h-3 bg-slate-700/40 rounded w-2/3" style={{ animation: 'card-pop 0.4s ease-out 1.1s forwards', opacity: 0 }} />
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <div className="h-12 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded border border-pink-400/20" style={{ animation: 'card-pop 0.4s ease-out 1.2s forwards', opacity: 0 }} />
                      <div className="h-12 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded border border-cyan-400/20" style={{ animation: 'card-pop 0.4s ease-out 1.3s forwards', opacity: 0 }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      
      case 3: // Launch - Success with NanoKit Style
        return (
          <div className="w-full max-w-lg">
            <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-10 text-center shadow-2xl" style={{ boxShadow: `0 0 60px ${step.color}20, 0 8px 32px rgba(0,0,0,0.4)` }}>
              {/* Floating accents */}
              <div className="absolute -top-2 -left-2 w-4 h-4 border border-emerald-400/30 rotate-45 animate-pulse" />
              <div className="absolute -bottom-3 -right-3 w-6 h-6 border border-emerald-400/30 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
              <div className="absolute top-1/2 -left-4 w-2 h-8 bg-gradient-to-b from-emerald-400/20 to-transparent" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
              
              {/* Rocket with celebration */}
              <div className="relative mb-8">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-400/30" style={{ animation: 'rocket-launch 1s ease-out forwards' }}>
                  <Rocket className="w-12 h-12 text-emerald-400" style={{ filter: `drop-shadow(0 0 12px ${step.color})` }} />
                </div>
                {/* Ripple effect */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full border-2 border-emerald-400/30 animate-ping" />
                  <div className="absolute w-40 h-40 rounded-full border-2 border-emerald-400/20 animate-ping" style={{ animationDelay: '0.5s' }} />
                </div>
              </div>
              
              <h3 className="text-4xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-3" style={{ animation: 'text-pop 0.5s ease-out 0.5s forwards', opacity: 0 }}>
                You're Live! 🎉
              </h3>
              <p className="text-slate-400 mb-8" style={{ animation: 'text-pop 0.5s ease-out 0.7s forwards', opacity: 0 }}>
                Your landing page is published and ready
              </p>
              
              {/* URL Display */}
              <div className="relative bg-slate-950/50 rounded-xl p-4 border border-slate-700/50 mb-6" style={{ animation: 'text-pop 0.5s ease-out 0.9s forwards', opacity: 0, boxShadow: `0 0 20px ${step.color}10` }}>
                <div className="text-xs text-slate-500 mb-2">Your Live URL</div>
                <div className="font-mono text-lg font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">your-site.nanokit.io</div>
                <div className="absolute -right-1 -top-1 w-3 h-3 rounded-full bg-emerald-400 animate-pulse" style={{ boxShadow: `0 0 10px ${step.color}` }} />
              </div>
              
              {/* CTA Buttons */}
              <div className="flex gap-3" style={{ animation: 'button-pop 0.5s ease-out 1.1s forwards', opacity: 0 }}>
                <button className="flex-1 py-3.5 rounded-xl font-bold text-white relative overflow-hidden group" style={{ background: `linear-gradient(135deg, ${step.color}, #0D9488)`, boxShadow: `0 0 30px ${step.color}40, 0 4px 12px rgba(0,0,0,0.2)` }}>
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Rocket className="w-4 h-4" />
                    View Site
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                </button>
                <button className="px-6 py-3.5 rounded-xl font-bold border border-slate-700/50 hover:border-emerald-400/50 transition-all bg-slate-800/50 text-white">
                  Share
                </button>
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
              width: `${((currentStep + 1) / 4) * 100}%`,
              background: `linear-gradient(90deg, ${steps[0].color}, ${steps[currentStep].color})`,
              boxShadow: `0 0 20px ${steps[currentStep].color}`,
            }}
          />
        </div>
        <div className="text-center mt-3 text-sm text-white/60 font-medium">
          Step {currentStep + 1} of 4 • 60 seconds total
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
      `}</style>
    </div>
  )
}
