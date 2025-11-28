'use client'

import { useEffect, useState } from 'react'

export function ProcessAnimation() {
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % 4)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const steps = [
    { number: '01', title: 'Create', desc: 'Sign up in seconds', icon: '✨', color: '#4FC3FF' },
    { number: '02', title: 'Design', desc: 'Choose your style', icon: '🎨', color: '#A855F7' },
    { number: '03', title: 'Build', desc: 'AI does the magic', icon: '⚡', color: '#FF76FF' },
    { number: '04', title: 'Launch', desc: 'Go live instantly', icon: '🚀', color: '#10B981' },
  ]

  return (
    <div className="relative w-full min-h-[500px] flex items-center justify-center">
      {/* Ambient Glow */}
      <div 
        className="absolute w-[500px] h-[500px] rounded-full blur-3xl transition-all duration-1000"
        style={{
          background: `radial-gradient(circle, ${steps[currentStep].color}40, transparent)`,
        }}
      />

      {/* Main Content - Horizontal Timeline */}
      <div className="relative flex items-center gap-4 md:gap-8 max-w-6xl px-4">
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

                {/* Icon */}
                <div 
                  className="text-4xl md:text-5xl transition-all duration-500"
                  style={{
                    filter: isActive ? 'drop-shadow(0 0 10px rgba(255,255,255,0.8))' : 'none',
                    transform: isActive ? 'scale(1.1)' : 'scale(1)',
                  }}
                >
                  {step.icon}
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

      {/* Bottom Progress Bar */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md px-4">
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
    </div>
  )
}
