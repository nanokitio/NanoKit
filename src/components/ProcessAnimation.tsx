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
      title: 'Build', 
      desc: 'AI creates your site', 
      Icon: Zap, 
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
              {['Tech Startup', 'SaaS Product', 'App Launch'].map((name, i) => (
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
      
      case 2: // Build - AI Processing with NanoKit Style
        return (
          <div className="w-full max-w-2xl">
            <div className="text-center space-y-3 mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-pink-500/20 to-orange-500/20 border border-pink-400/30 mb-2" style={{ animation: 'button-pop 0.5s ease-out 0.2s forwards', opacity: 0 }}>
                <Zap className="w-8 h-8 text-pink-400 animate-pulse" style={{ filter: `drop-shadow(0 0 8px ${step.color})` }} />
              </div>
              <h3 className="text-3xl font-black bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent" style={{ animation: 'text-pop 0.5s ease-out 0.4s forwards', opacity: 0 }}>
                AI Building Site
              </h3>
              <p className="text-slate-400" style={{ animation: 'text-pop 0.5s ease-out 0.5s forwards', opacity: 0 }}>
                Creating your perfect landing page
              </p>
            </div>
            
            <div className="relative aspect-video bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden p-6 shadow-2xl" style={{ boxShadow: `0 0 60px ${step.color}20, 0 8px 32px rgba(0,0,0,0.4)` }}>
              {/* Terminal-style output */}
              <div className="space-y-3 font-mono text-sm">
                {[
                  { text: '$ Analyzing requirements...', delay: 0.5, icon: '⚡' },
                  { text: '$ Generating layout structure...', delay: 0.7, icon: '🎨' },
                  { text: '$ Applying brand colors & fonts...', delay: 0.9, icon: '✨' },
                  { text: '$ Optimizing for performance...', delay: 1.1, icon: '🚀' },
                  { text: '✓ Your site is ready!', delay: 1.3, success: true, icon: '✓' },
                ].map((line, i) => (
                  <div key={i} className="flex items-center gap-3" style={{ animation: `code-line 0.4s ease-out ${line.delay}s forwards`, opacity: 0 }}>
                    <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-gradient-to-br flex items-center justify-center text-xs" style={{ background: line.success ? 'linear-gradient(135deg, #10B981, #059669)' : `linear-gradient(135deg, ${step.color}, #EC4899)` }}>
                      {line.icon}
                    </div>
                    <span className="text-slate-300">{line.text}</span>
                    {!line.success && (
                      <div className="ml-auto flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" style={{ animationDelay: '0s' }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" style={{ animationDelay: '0.2s' }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" style={{ animationDelay: '0.4s' }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Progress bar with gradient */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex justify-between text-xs text-slate-500 mb-2">
                  <span>Building...</span>
                  <span className="font-mono">~30s</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
                  <div className="h-full rounded-full relative" style={{ background: `linear-gradient(90deg, ${step.color}, #10B981)`, animation: 'progress-fill 2s ease-out forwards', width: '0%', boxShadow: `0 0 10px ${step.color}60` }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                  </div>
                </div>
              </div>
              
              {/* Floating particles */}
              <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-pink-400 animate-ping" />
              <div className="absolute top-8 right-12 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" style={{ animationDelay: '0.5s' }} />
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

      {/* Step Indicators */}
      <div className="relative flex items-center gap-4 mb-12 z-10">
        {steps.map((step, index) => {
          const isActive = index === currentStep
          const isPast = index < currentStep
          
          return (
            <div key={index} className="flex flex-col items-center relative">
              {/* Step Circle */}
              <div
                className="relative w-24 h-24 md:w-32 md:h-32 rounded-full flex flex-col items-center justify-center transition-all duration-700 cursor-pointer group"
                style={{
                  background: isActive 
                    ? `linear-gradient(135deg, ${step.color}, ${step.color}DD)` 
                    : isPast 
                    ? `${step.color}40` 
                    : 'rgba(255,255,255,0.05)',
                  border: `3px solid ${isActive ? step.color : isPast ? `${step.color}60` : 'rgba(255,255,255,0.1)'}`,
                  boxShadow: isActive 
                    ? `0 0 60px ${step.color}80, 0 0 100px ${step.color}40, inset 0 0 20px rgba(255,255,255,0.2)` 
                    : isPast
                    ? `0 0 20px ${step.color}40`
                    : 'none',
                  transform: isActive ? 'scale(1.15)' : 'scale(1)',
                }}
              >
                {/* Pulse Ring */}
                {isActive && (
                  <>
                    <div 
                      className="absolute inset-0 rounded-full border-2 animate-ping"
                      style={{
                        borderColor: step.color,
                        opacity: 0.6,
                      }}
                    />
                    <div 
                      className="absolute inset-0 rounded-full border-2 animate-ping"
                      style={{
                        borderColor: step.color,
                        opacity: 0.4,
                        animationDelay: '0.5s',
                      }}
                    />
                  </>
                )}

                {/* Icon with Neon Effect */}
                <div 
                  className="transition-all duration-500 relative"
                  style={{
                    transform: isActive 
                      ? `scale(1.1) rotate(${step.rotate}deg)` 
                      : isPast 
                      ? `scale(0.95) rotate(${step.rotate * 0.5}deg)` 
                      : 'scale(0.9) rotate(0deg)',
                  }}
                >
                  <step.Icon
                    size={48}
                    strokeWidth={2.5}
                    className="transition-all duration-700"
                    style={{
                      color: isActive ? step.color : isPast ? `${step.color}AA` : 'rgba(255,255,255,0.3)',
                      filter: isActive 
                        ? `drop-shadow(0 0 8px ${step.color}) drop-shadow(0 0 16px ${step.color}) drop-shadow(0 0 24px ${step.color})` 
                        : isPast
                        ? `drop-shadow(0 0 4px ${step.color})`
                        : 'none',
                      animation: isActive ? 'neon-flicker 2s ease-in-out infinite' : 'none',
                    }}
                  />
                  
                  {/* Extra glow layer for active state */}
                  {isActive && (
                    <div 
                      className="absolute inset-0 blur-xl opacity-60 transition-opacity duration-700"
                      style={{
                        background: step.color,
                      }}
                    />
                  )}
                </div>

                {/* Number Badge */}
                <div 
                  className="absolute -top-2 -right-2 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs md:text-sm font-black transition-all duration-500"
                  style={{
                    background: isActive ? step.color : isPast ? `${step.color}60` : 'rgba(255,255,255,0.1)',
                    color: '#fff',
                    boxShadow: isActive ? `0 0 20px ${step.color}` : 'none',
                  }}
                >
                  {step.number}
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              </div>

              {/* Label */}
              <div className="mt-4 text-center space-y-1">
                <h4 
                  className="text-lg md:text-2xl font-black transition-all duration-500"
                  style={{
                    color: isActive ? step.color : isPast ? `${step.color}CC` : 'rgba(255,255,255,0.4)',
                    textShadow: isActive ? `0 0 30px ${step.color}` : 'none',
                  }}
                >
                  {step.title}
                </h4>
                <p 
                  className="text-xs md:text-sm transition-opacity duration-500"
                  style={{
                    color: 'rgba(255,255,255,0.6)',
                    opacity: isActive ? 1 : 0.5,
                  }}
                >
                  {step.desc}
                </p>
              </div>

              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div 
                  className="absolute top-12 md:top-16 left-[calc(50%+48px)] md:left-[calc(50%+64px)] w-4 md:w-8 h-1 transition-all duration-700"
                  style={{
                    background: isPast || (index === currentStep) 
                      ? `linear-gradient(90deg, ${step.color}, ${steps[index + 1].color})` 
                      : 'rgba(255,255,255,0.1)',
                    boxShadow: isPast || (index === currentStep) ? `0 0 10px ${step.color}` : 'none',
                  }}
                />
              )}
            </div>
          )
        })}
      </div>

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
