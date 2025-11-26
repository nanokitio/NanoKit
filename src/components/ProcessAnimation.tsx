'use client'

import { useEffect, useState } from 'react'

export function ProcessAnimation() {
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % 4)
    }, 3000) // Change step every 3 seconds

    return () => clearInterval(interval)
  }, [])

  const steps = [
    {
      title: '1. Create Account',
      icon: (
        <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
        </svg>
      ),
      color: 'from-cyan-400 to-blue-500',
      glow: 'rgba(79, 195, 255, 0.6)',
    },
    {
      title: '2. Pick Template',
      icon: (
        <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      ),
      color: 'from-purple-400 to-pink-500',
      glow: 'rgba(168, 85, 247, 0.6)',
    },
    {
      title: '3. Customize',
      icon: (
        <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      ),
      color: 'from-pink-400 to-rose-500',
      glow: 'rgba(255, 118, 255, 0.6)',
    },
    {
      title: '4. Publish',
      icon: (
        <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      ),
      color: 'from-emerald-400 to-teal-500',
      glow: 'rgba(16, 185, 129, 0.6)',
    },
  ]

  return (
    <div className="relative w-full h-full flex items-center justify-center p-12">
      {/* Connection Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(79, 195, 255, 0.3)" />
            <stop offset="50%" stopColor="rgba(168, 85, 247, 0.3)" />
            <stop offset="100%" stopColor="rgba(255, 118, 255, 0.3)" />
          </linearGradient>
        </defs>
        
        {/* Horizontal connecting line */}
        <line
          x1="20%"
          y1="50%"
          x2="80%"
          y2="50%"
          stroke="url(#lineGradient)"
          strokeWidth="2"
          strokeDasharray="5,5"
          className="animate-pulse"
        />
      </svg>

      {/* Steps Container */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6 w-full max-w-5xl relative" style={{ zIndex: 2 }}>
        {steps.map((step, index) => {
          const isActive = currentStep === index
          const isPast = currentStep > index || (currentStep === 0 && index === 3)

          return (
            <div
              key={index}
              className="flex flex-col items-center gap-4 transition-all duration-700"
              style={{
                opacity: isActive ? 1 : isPast ? 0.5 : 0.3,
                transform: isActive ? 'scale(1.1)' : 'scale(1)',
              }}
            >
              {/* Icon Circle */}
              <div
                className="relative rounded-full p-6 backdrop-blur-xl border-2 transition-all duration-700"
                style={{
                  background: isActive
                    ? `linear-gradient(135deg, ${step.color})`
                    : 'rgba(255, 255, 255, 0.05)',
                  borderColor: isActive ? step.glow : 'rgba(255, 255, 255, 0.1)',
                  boxShadow: isActive ? `0 0 40px ${step.glow}, 0 0 80px ${step.glow}` : 'none',
                }}
              >
                {/* Pulse ring */}
                {isActive && (
                  <div
                    className="absolute inset-0 rounded-full animate-ping"
                    style={{
                      background: `linear-gradient(135deg, ${step.color})`,
                      opacity: 0.3,
                    }}
                  />
                )}

                {/* Icon */}
                <div className="relative text-white">{step.icon}</div>
              </div>

              {/* Step Title */}
              <div className="text-center">
                <h3
                  className="text-sm md:text-base font-bold transition-all duration-700"
                  style={{
                    color: isActive ? '#fff' : 'rgba(255, 255, 255, 0.6)',
                    textShadow: isActive ? `0 0 20px ${step.glow}` : 'none',
                  }}
                >
                  {step.title}
                </h3>
              </div>

              {/* Progress Indicator */}
              {isActive && (
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${step.color})`,
                      animation: 'progressBar 3s linear',
                    }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Center connecting dots */}
      <div className="absolute top-1/2 left-0 right-0 flex justify-center items-center gap-4 pointer-events-none hidden md:flex">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full animate-pulse"
            style={{
              background: 'rgba(79, 195, 255, 0.5)',
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes progressBar {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}
