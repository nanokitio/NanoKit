'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export function SynthIntro() {
  const [isVisible, setIsVisible] = useState(true)
  const [phase, setPhase] = useState(0) // 0: black, 1: grid, 2: logo, 3: fade out

  useEffect(() => {
    // Black screen → Grid
    const blackTimer = setTimeout(() => setPhase(1), 300)
    
    // Grid → Logo appear
    const gridTimer = setTimeout(() => setPhase(2), 1200)
    
    // Logo hold → Fade out
    const logoTimer = setTimeout(() => setPhase(3), 3000)
    
    // Hide completely
    const hideTimer = setTimeout(() => {
      setIsVisible(false)
      document.body.style.overflow = 'auto'
    }, 3800)

    document.body.style.overflow = 'hidden'

    return () => {
      clearTimeout(blackTimer)
      clearTimeout(gridTimer)
      clearTimeout(logoTimer)
      clearTimeout(hideTimer)
      document.body.style.overflow = 'auto'
    }
  }, [])

  if (!isVisible) return null

  return (
    <div 
      className={`fixed inset-0 z-[9999] ${
        phase === 3 ? 'animate-fadeOut' : ''
      }`}
      style={{
        animation: phase === 3 ? 'fadeOut 0.8s ease-out forwards' : 'none'
      }}
    >
      {/* Deep black background with gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, #0a0014 0%, #000000 100%)'
        }}
      />

      {/* Retro Grid Floor - Enhanced */}
      <div 
        className={`absolute inset-0 transition-opacity duration-700 ${
          phase >= 1 ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ perspective: '1200px' }}
      >
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(138,0,138,0.15) 40%, rgba(0,0,51,0.2) 100%)',
            transform: 'rotateX(65deg) translateY(40%)',
            transformOrigin: 'center bottom',
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Main horizontal grid lines with better contrast */}
          {[...Array(15)].map((_, i) => (
            <div
              key={`h-${i}`}
              className="absolute left-0 right-0"
              style={{
                top: `${i * 6.66}%`,
                height: i % 3 === 0 ? '3px' : '2px',
                background: i % 3 === 0 
                  ? `linear-gradient(90deg, transparent 0%, #FF00FF 20%, #00FFFF 50%, #FF00FF 80%, transparent 100%)`
                  : `linear-gradient(90deg, transparent 0%, rgba(0,255,255,0.4) 50%, transparent 100%)`,
                boxShadow: i % 3 === 0 
                  ? '0 0 20px rgba(255,0,255,0.8), 0 0 40px rgba(0,255,255,0.6)'
                  : '0 0 10px rgba(0,255,255,0.3)',
                opacity: 0.5 + (i * 0.03),
                animation: `pulseGridEnhanced ${2.5 + i * 0.15}s ease-in-out infinite`,
                animationDelay: `${i * 0.08}s`,
                filter: 'blur(0.5px)'
              }}
            />
          ))}

          {/* Vertical perspective lines */}
          {[...Array(24)].map((_, i) => (
            <div
              key={`v-${i}`}
              className="absolute top-0 bottom-0"
              style={{
                left: `${i * 4.16}%`,
                width: i % 4 === 0 ? '3px' : '2px',
                background: i % 4 === 0
                  ? `linear-gradient(180deg, transparent 0%, #FF00FF 30%, #00FFFF 70%, transparent 100%)`
                  : `linear-gradient(180deg, transparent 0%, rgba(255,0,255,0.3) 50%, transparent 100%)`,
                boxShadow: i % 4 === 0 
                  ? '0 0 15px rgba(255,0,255,0.6)'
                  : '0 0 8px rgba(255,0,255,0.2)',
                opacity: 0.3 + (Math.abs(12 - i) * 0.025),
                animation: `pulseVertical ${2 + (i % 6) * 0.3}s ease-in-out infinite`,
                animationDelay: `${(i % 6) * 0.12}s`,
                filter: 'blur(0.5px)'
              }}
            />
          ))}
        </div>
      </div>

      {/* Synth Sun - Enhanced depth */}
      <div 
        className={`absolute left-1/2 transform -translate-x-1/2 transition-all duration-1000 ${
          phase >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
        }`}
        style={{
          top: '15%',
          width: '400px',
          height: '400px',
          background: `
            radial-gradient(circle at 40% 40%, 
              rgba(255,0,255,0.9) 0%, 
              rgba(255,0,150,0.7) 25%,
              rgba(200,0,255,0.4) 50%,
              transparent 70%
            )
          `,
          boxShadow: `
            0 0 80px rgba(255,0,255,1),
            0 0 160px rgba(255,0,150,0.8),
            0 0 240px rgba(255,0,255,0.6),
            inset -20px -20px 80px rgba(0,0,0,0.3),
            inset 20px 20px 80px rgba(255,0,255,0.2)
          `,
          animation: 'sunPulseEnhanced 5s ease-in-out infinite',
          borderRadius: '50%',
          filter: 'blur(1px)'
        }}
      >
        {/* Sun scan lines for depth */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`sunline-${i}`}
            className="absolute left-0 right-0"
            style={{
              top: `${i * 12.5}%`,
              height: '2px',
              background: 'rgba(0,0,0,0.3)',
              opacity: 0.6
            }}
          />
        ))}
      </div>

      {/* Scan lines effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, rgba(0, 255, 255, 0.03) 0px, transparent 2px, transparent 4px)',
          animation: 'scanlines 8s linear infinite'
        }}
      />

      {/* Logo Container - Professional hierarchy */}
      <div 
        className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${
          phase >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
        }`}
      >
        <div className="relative">
          {/* Multi-layer glow for depth */}
          <div className="absolute inset-0 -z-10">
            {/* Inner glow */}
            <div 
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(255,0,255,0.4) 0%, transparent 60%)',
                transform: 'scale(1.5)',
                animation: 'pulseGlow 3s ease-in-out infinite',
                filter: 'blur(60px)'
              }}
            />
            {/* Mid glow */}
            <div 
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(0,255,255,0.3) 0%, transparent 70%)',
                transform: 'scale(2)',
                animation: 'pulseGlow 3s ease-in-out infinite 0.5s',
                filter: 'blur(80px)'
              }}
            />
            {/* Outer glow */}
            <div 
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(255,0,255,0.2) 0%, transparent 80%)',
                transform: 'scale(2.5)',
                animation: 'pulseGlow 3s ease-in-out infinite 1s',
                filter: 'blur(100px)'
              }}
            />
          </div>
          
          {/* Logo with enhanced contrast */}
          <div className="relative z-10">
            <Image
              src="/NANOKIT.png"
              alt="NanoKit"
              width={700}
              height={525}
              className="object-contain"
              style={{
                filter: `
                  drop-shadow(0 0 40px rgba(255, 0, 255, 1))
                  drop-shadow(0 0 80px rgba(0, 255, 255, 0.8))
                  drop-shadow(0 10px 40px rgba(0, 0, 0, 0.8))
                  contrast(1.1)
                  brightness(1.05)
                `,
              }}
              priority
            />
          </div>

          {/* Subtitle with better typography */}
          <div 
            className="text-center mt-10 font-mono uppercase tracking-[0.6em] text-sm relative"
            style={{
              color: '#00FFFF',
              textShadow: `
                0 0 20px rgba(0,255,255,1),
                0 0 40px rgba(0,255,255,0.6),
                0 2px 0 rgba(0,0,0,0.5)
              `,
              animation: 'glitchText 0.3s ease-in-out infinite alternate',
              letterSpacing: '0.8em'
            }}
          >
            L A N D I N G &nbsp; P A G E &nbsp; B U I L D E R
          </div>

          {/* Enhanced loading bar with better design */}
          <div className="mt-8 w-80 mx-auto">
            <div className="relative h-2 bg-black/70 border-2 border-cyan-400/40 rounded-sm overflow-hidden backdrop-blur-sm">
              {/* Loading fill */}
              <div 
                className="absolute inset-0 bg-gradient-to-r from-purple-500 via-cyan-400 to-purple-500"
                style={{
                  animation: 'loadingBarEnhanced 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                  boxShadow: '0 0 20px rgba(0,255,255,0.8)',
                  backgroundSize: '200% 100%'
                }}
              />
              {/* Shine effect */}
              <div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                style={{
                  animation: 'shine 2s ease-in-out infinite',
                  backgroundSize: '200% 100%'
                }}
              />
            </div>
            {/* Loading percentage */}
            <div 
              className="text-center mt-3 font-mono text-xs text-cyan-400/80"
              style={{
                textShadow: '0 0 10px rgba(0,255,255,0.5)',
                letterSpacing: '0.2em'
              }}
            >
              I N I T I A L I Z I N G . . .
            </div>
          </div>
        </div>
      </div>

      {/* Particle effects */}
      {[...Array(30)].map((_, i) => (
        <div
          key={`particle-${i}`}
          className="absolute w-1 h-1 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: i % 2 === 0 ? '#FF00FF' : '#00FFFF',
            boxShadow: `0 0 ${5 + Math.random() * 10}px ${i % 2 === 0 ? '#FF00FF' : '#00FFFF'}`,
            animation: `twinkle ${1 + Math.random() * 2}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`,
            opacity: Math.random() * 0.5 + 0.3
          }}
        />
      ))}

      {/* Enhanced CSS Animations */}
      <style jsx>{`
        @keyframes fadeOut {
          from { 
            opacity: 1; 
            transform: scale(1);
          }
          to { 
            opacity: 0; 
            transform: scale(1.05);
          }
        }

        @keyframes pulseGridEnhanced {
          0%, 100% { 
            opacity: 0.5; 
            filter: blur(0.5px);
          }
          50% { 
            opacity: 1; 
            filter: blur(0px);
          }
        }

        @keyframes pulseVertical {
          0%, 100% { 
            opacity: 0.3; 
            transform: scaleY(1);
          }
          50% { 
            opacity: 0.7; 
            transform: scaleY(1.02);
          }
        }

        @keyframes sunPulseEnhanced {
          0%, 100% { 
            transform: scale(1) translateX(-50%); 
            opacity: 0.9;
            filter: blur(1px);
          }
          50% { 
            transform: scale(1.08) translateX(-50%); 
            opacity: 1;
            filter: blur(0.5px);
          }
        }

        @keyframes pulseGlow {
          0%, 100% { 
            opacity: 0.6; 
            transform: scale(1.5);
          }
          50% { 
            opacity: 1; 
            transform: scale(1.8);
          }
        }

        @keyframes glitchText {
          0% { 
            text-shadow: 
              0 0 20px rgba(0,255,255,1),
              0 0 40px rgba(0,255,255,0.6),
              0 2px 0 rgba(0,0,0,0.5);
          }
          50% { 
            text-shadow: 
              0 0 25px rgba(0,255,255,1),
              0 0 50px rgba(0,255,255,0.8),
              1px 0 0 rgba(255,0,255,0.3),
              -1px 0 0 rgba(0,255,255,0.3);
          }
          100% { 
            text-shadow: 
              0 0 20px rgba(0,255,255,1),
              0 0 40px rgba(0,255,255,0.6),
              0 2px 0 rgba(0,0,0,0.5);
          }
        }

        @keyframes loadingBarEnhanced {
          0% { 
            width: 0%; 
            background-position: 0% center;
          }
          100% { 
            width: 100%; 
            background-position: 200% center;
          }
        }

        @keyframes shine {
          0% { 
            background-position: -200% center; 
            opacity: 0;
          }
          50% { 
            opacity: 1; 
          }
          100% { 
            background-position: 200% center; 
            opacity: 0;
          }
        }

        @keyframes scanlines {
          0% { transform: translateY(0); }
          100% { transform: translateY(4px); }
        }

        @keyframes twinkle {
          0%, 100% { 
            opacity: 0.3; 
            transform: scale(1); 
          }
          50% { 
            opacity: 1; 
            transform: scale(1.5); 
          }
        }
      `}</style>
    </div>
  )
}
