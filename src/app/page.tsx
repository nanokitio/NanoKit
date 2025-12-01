'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { NanoKitLogo } from '@/components/NanoKitLogo'
import { ProcessAnimation } from '@/components/ProcessAnimation'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Menu, X, ArrowUp, Sparkles, Palette, Rocket } from 'lucide-react'

export default function Home() {
  const [stars, setStars] = useState<Array<{size: number, brightness: number, top: number, left: number, color: string}>>([]);
  const [constellations, setConstellations] = useState<Array<{x1: number, y1: number, x2: number, y2: number}>>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // Vintage color palette for stars
    const vintageColors = [
      'rgba(255, 255, 255, 1)',      // White
      'rgba(173, 216, 230, 1)',      // Light Blue
      'rgba(255, 250, 205, 1)',      // Lemon Chiffon
      'rgba(221, 160, 221, 1)',      // Plum
      'rgba(176, 224, 230, 1)',      // Powder Blue
    ];

    // Generate more stars for a denser field
    const starArray = [...Array(250)].map(() => ({
      size: Math.random() * 3 + 0.5,
      brightness: Math.random() * 0.6 + 0.4,
      top: Math.random() * 100,
      left: Math.random() * 100,
      color: vintageColors[Math.floor(Math.random() * vintageColors.length)]
    }));
    setStars(starArray);

    // Create constellation lines connecting random stars
    const constellationLines: Array<{x1: number, y1: number, x2: number, y2: number}> = [];
    const mainStars = starArray.filter(star => star.size > 2).slice(0, 30); // Use brighter stars
    
    for (let i = 0; i < mainStars.length - 1; i++) {
      // Connect each star to 1-2 nearby stars
      const connections = Math.random() > 0.5 ? 1 : 2;
      for (let j = 0; j < connections && i + j + 1 < mainStars.length; j++) {
        const star1 = mainStars[i];
        const star2 = mainStars[i + j + 1];
        
        // Only connect if stars are reasonably close
        const distance = Math.sqrt(
          Math.pow(star1.left - star2.left, 2) + 
          Math.pow(star1.top - star2.top, 2)
        );
        
        if (distance < 15) { // Max distance threshold
          constellationLines.push({
            x1: star1.left,
            y1: star1.top,
            x2: star2.left,
            y2: star2.top
          });
        }
      }
    }
    setConstellations(constellationLines);

    const handleScroll = () => {
      setScrollY(window.scrollY);
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen text-white overflow-x-hidden relative" style={{ fontFamily: 'Space Grotesk, system-ui, sans-serif' }}>
      {/* Vintage Black Background with Retro Effects */}
      <div className="fixed inset-0" style={{ zIndex: -2 }}>
        {/* Base black background */}
        <div className="absolute inset-0 bg-black" />
        
        {/* Vintage gradient overlay - subtle deep blue and purple tones */}
        <div 
          className="absolute inset-0" 
          style={{
            background: 'radial-gradient(ellipse at center, rgba(25, 25, 60, 0.3) 0%, rgba(0, 0, 0, 0.8) 50%, rgba(0, 0, 0, 1) 100%)',
          }}
        />
        
        {/* Subtle color tint for vintage feel */}
        <div 
          className="absolute inset-0" 
          style={{
            background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.2) 0%, rgba(0, 0, 0, 0) 100%)',
          }}
        />
        
        {/* Vignette effect */}
        <div 
          className="absolute inset-0" 
          style={{
            boxShadow: 'inset 0 0 200px rgba(0, 0, 0, 0.8)',
          }}
        />
        
        {/* Film grain texture overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
          }}
        />
      </div>

      {/* Vintage Starfield background with constellations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        {/* Constellation lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.3 }}>
          {constellations.map((line, i) => (
            <line
              key={i}
              x1={`${line.x1}%`}
              y1={`${line.y1}%`}
              x2={`${line.x2}%`}
              y2={`${line.y2}%`}
              stroke="rgba(173, 216, 230, 0.5)"
              strokeWidth="0.5"
              strokeDasharray="2,3"
              style={{
                filter: 'drop-shadow(0 0 2px rgba(173, 216, 230, 0.3))'
              }}
            />
          ))}
        </svg>

        {/* Stars with vintage colors */}
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: star.size + 'px',
              height: star.size + 'px',
              top: star.top + '%',
              left: star.left + '%',
              backgroundColor: star.color,
              boxShadow: `0 0 ${star.size * 4}px ${star.color.replace('1)', '0.6)')}, 0 0 ${star.size * 2}px ${star.color.replace('1)', '0.8)')}`,
              opacity: star.brightness,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="sticky top-0 z-[100] border-0" style={{ borderBottom: 'none', boxShadow: 'none' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 border-0" style={{ borderBottom: 'none' }}>
            <NanoKitLogo size="header" href="/" />
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" className="text-white hover:text-[#4FC3FF] border border-[#4FC3FF]/30 hover:border-[#4FC3FF] transition-all px-5 py-2 rounded-xl">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="relative overflow-hidden px-6 py-2 rounded-xl font-bold transition-all hover:scale-105 group">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#B94AFF] to-[#4FC3FF]" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#4FC3FF] to-[#B94AFF] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative text-white">Get Started</span>
                </Button>
              </Link>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-white hover:text-[#4FC3FF] transition-colors p-2 hover:bg-white/10 rounded-lg"
                aria-label="Toggle menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Burger Menu Sidebar */}
      <div
        className={`fixed top-0 right-0 h-screen w-80 bg-black/95 border-l border-[#4FC3FF]/30 z-[150] transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          boxShadow: '-10px 0 50px rgba(79, 195, 255, 0.3)'
        }}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-2xl font-black text-white">Menu</h2>
            <button
              onClick={() => setMenuOpen(false)}
              className="text-white hover:text-[#4FC3FF] transition-colors p-2"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="space-y-4">
            {[
              { name: 'Home', href: '#home' },
              { name: 'Video', href: '#video' },
              { name: 'Features', href: '#features' },
              { name: 'Pricing', href: '#pricing' },
            ].map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block text-lg font-semibold text-white/80 hover:text-white hover:translate-x-2 transition-all duration-200 py-3 px-4 rounded-xl hover:bg-[#4FC3FF]/10"
              >
                {item.name}
              </a>
            ))}
          </nav>

          <div className="mt-12 pt-12 border-t border-[#4FC3FF]/30 flex flex-col gap-6">
            <Link href="/login" onClick={() => setMenuOpen(false)}>
              <Button variant="ghost" className="w-full text-white hover:text-[#4FC3FF] border border-[#4FC3FF]/30 hover:border-[#4FC3FF] transition-all px-5 py-3 rounded-xl">
                Sign In
              </Button>
            </Link>
            <Link href="/signup" onClick={() => setMenuOpen(false)}>
              <Button className="w-full relative group overflow-hidden px-6 py-3 rounded-xl text-base font-bold transition-all hover:scale-105 shadow-lg shadow-[#4FC3FF]/30">
                <div className="absolute inset-0 bg-gradient-to-r from-[#B94AFF] to-[#4FC3FF]" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#4FC3FF] to-[#B94AFF] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative text-white font-black">Get Started</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[140]"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Animated Vertical Lines - Decorative edges only */}
      <div className="fixed inset-0 z-[1] overflow-hidden pointer-events-none">
        {/* Hide on small screens where they interfere */}
        <div className="hidden sm:block">
          {/* RIGHT SIDE LINES */}
          {/* Line 1 - Turquoise */}
          <div
            className="absolute top-0 w-1 bg-gradient-to-b from-[#4FC3FF] to-[#4FC3FF]/20"
            style={{
              right: '10px',
              height: '100%',
              animation: 'drawLine 2s ease-out forwards',
              boxShadow: '0 0 20px rgba(79, 195, 255, 0.6), 0 0 40px rgba(79, 195, 255, 0.4)'
            }}
          />
          
          {/* Line 2 - Fuchsia */}
          <div
            className="absolute top-0 w-1 bg-gradient-to-b from-[#FF76FF] to-[#FF76FF]/20"
            style={{
              right: '30px',
              height: '100%',
              animation: 'drawLine 2s ease-out 0.3s forwards',
              animationFillMode: 'both',
              boxShadow: '0 0 20px rgba(255, 118, 255, 0.6), 0 0 40px rgba(255, 118, 255, 0.4)'
            }}
          />
          
          {/* Line 3 - Purple-Turquoise */}
          <div
            className="absolute top-0 w-1 bg-gradient-to-b from-[#B94AFF] to-[#4FC3FF]/20"
            style={{
              right: '50px',
              height: '100%',
              animation: 'drawLine 2s ease-out 0.6s forwards',
              animationFillMode: 'both',
              boxShadow: '0 0 20px rgba(185, 74, 255, 0.6), 0 0 40px rgba(79, 195, 255, 0.4)'
            }}
          />

          {/* LEFT SIDE LINES */}
          {/* Line 4 - Purple-Turquoise */}
          <div
            className="absolute top-0 w-1 bg-gradient-to-b from-[#B94AFF] to-[#4FC3FF]/20"
            style={{
              left: '10px',
              height: '100%',
              animation: 'drawLine 2s ease-out forwards',
              animationFillMode: 'both',
              boxShadow: '0 0 20px rgba(185, 74, 255, 0.6), 0 0 40px rgba(79, 195, 255, 0.4)'
            }}
          />
          
          {/* Line 5 - Fuchsia */}
          <div
            className="absolute top-0 w-1 bg-gradient-to-b from-[#FF76FF] to-[#FF76FF]/20"
            style={{
              left: '30px',
              height: '100%',
              animation: 'drawLine 2s ease-out 0.3s forwards',
              animationFillMode: 'both',
              boxShadow: '0 0 20px rgba(255, 118, 255, 0.6), 0 0 40px rgba(255, 118, 255, 0.4)'
            }}
          />
          
          {/* Line 6 - Turquoise */}
          <div
            className="absolute top-0 w-1 bg-gradient-to-b from-[#4FC3FF] to-[#4FC3FF]/20"
            style={{
              left: '50px',
              height: '100%',
              animation: 'drawLine 2s ease-out 0.6s forwards',
              animationFillMode: 'both',
              boxShadow: '0 0 20px rgba(79, 195, 255, 0.6), 0 0 40px rgba(79, 195, 255, 0.4)'
            }}
          />
        </div>
      </div>

      {/* Hero Section */}
      <section id="home" className="relative z-10 min-h-screen pt-32 pb-32 px-6">
        <div className="relative max-w-6xl mx-auto text-center z-10">
          <h1 className="text-7xl md:text-9xl font-black leading-[0.95] mb-10 animate-fadeInUp" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            <span className="block text-white drop-shadow-[0_0_30px_rgba(139,92,246,0.5)]">
              Where AI-crafted
            </span>
            <span className="block text-white drop-shadow-[0_0_30px_rgba(139,92,246,0.5)]">
              visions
            </span>
            <span className="block text-white drop-shadow-[0_0_30px_rgba(139,92,246,0.5)]">
              go live effortlessly
            </span>
          </h1>

          <p className="text-2xl md:text-3xl text-[#EAF1FF]/80 max-w-4xl mx-auto mb-14 leading-relaxed animate-fadeInUp" style={{ animationDelay: '0.2s', fontFamily: 'Inter, sans-serif' }}>
            From Idea to Live Page in 60 Seconds
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-20 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
            <Link href="/signup">
              <Button className="group relative overflow-hidden px-14 py-7 rounded-2xl text-xl font-black transition-all duration-300 hover:scale-105 hover:-translate-y-1 shadow-[0_0_60px_rgba(185,74,255,0.5)] hover:shadow-[0_0_80px_rgba(79,195,255,0.6)]">
                <div className="absolute inset-0 bg-gradient-to-r from-[#B94AFF] to-[#4FC3FF]" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#4FC3FF] to-[#FF76FF] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative text-white flex items-center gap-3 drop-shadow-lg">
                  Start Creating Free
                  <span className="text-2xl group-hover:translate-x-2 transition-transform duration-300">→</span>
                </span>
              </Button>
            </Link>
          </div>

        </div>
      </section>

      {/* Video Section - From Idea to Live Page in 60 Seconds */}
      <section id="video" className="relative z-10 py-32 px-6 bg-transparent">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-black mb-16 text-center" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            <span className="block bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent" style={{
              filter: 'drop-shadow(0 0 20px rgba(168, 85, 247, 0.5))'
            }}>
              From Idea to Live Page in 60 Seconds
            </span>
          </h2>
          
          {/* Floating Animation - No Container */}
          <div className="relative w-full min-h-[600px] flex items-center justify-center">
            <ProcessAnimation />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-32 px-6 bg-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: <Sparkles className="w-16 h-16" />,
                title: 'Let AI Create It—or Pick a Template',
                desc: 'Your Vision. Get Your Landing Page—Instantly',
                gradient: 'from-[#B94AFF] to-[#B94AFF]/50',
                glow: 'rgba(185,74,255,0.4)',
              },
              {
                icon: <Palette className="w-16 h-16" />,
                title: 'Live Customization',
                desc: 'Design and Edit in Real Time, Exactly How You Want',
                gradient: 'from-[#4FC3FF] to-[#4FC3FF]/50',
                glow: 'rgba(79,195,255,0.4)',
              },
              {
                icon: <Rocket className="w-16 h-16" />,
                title: 'Go Live or Export Code',
                desc: 'Launch Your Page or Export Clean HTML/CSS Code',
                gradient: 'from-[#FF76FF] to-[#FF76FF]/50',
                glow: 'rgba(255,118,255,0.4)',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative p-12 rounded-3xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-[#4FC3FF]/50 transition-all duration-300 hover:-translate-y-3 hover:rotate-1 backdrop-blur-xl cursor-pointer"
                style={{
                  boxShadow: `0 0 40px ${feature.glow}`,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                <div className={`w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-8 shadow-[0_0_40px] group-hover:shadow-[0_0_80px] transition-all duration-300 group-hover:scale-110`} style={{ boxShadow: `0 0 40px ${feature.glow}` }}>
                  {feature.icon}
                </div>
                <h3 className="text-3xl font-black text-[#EAF1FF] mb-5 text-center" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{feature.title}</h3>
                <p className="text-[#EAF1FF]/70 leading-relaxed text-xl text-center" style={{ fontFamily: 'Inter, sans-serif' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 py-32 px-6 bg-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-6xl md:text-7xl font-black mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              <span className="block bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent" style={{
                filter: 'drop-shadow(0 0 20px rgba(168, 85, 247, 0.5))'
              }}>
                Choose Your Package
              </span>
            </h2>
            <p className="text-2xl text-[#EAF1FF]/70 max-w-3xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
              Unlock the right tools for your next launch.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* LiteWave - Free */}
            <div className="relative p-8 rounded-3xl bg-gradient-to-br from-purple-900/30 via-cyan-900/20 to-transparent backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 border border-purple-500/30" style={{
              boxShadow: '0 10px 40px rgba(168, 85, 247, 0.3)'
            }}>
              <div className="text-center">
                <h3 className="text-3xl font-black mb-4 text-white" style={{ 
                  fontFamily: 'Space Grotesk, sans-serif'
                }}>
                  LiteWave - Free
                </h3>
                <p className="text-[#EAF1FF]/60 mb-8">Subtitle:</p>
                <Link href="/signup">
                  <Button className="w-full relative group overflow-hidden py-4 rounded-xl text-lg font-bold transition-all hover:scale-105 mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#B94AFF] to-[#4FC3FF]" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#4FC3FF] to-[#B94AFF] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative text-white">Get Started</span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Turbo Mode */}
            <div className="relative p-8 rounded-3xl bg-gradient-to-br from-pink-600/40 via-purple-600/40 to-cyan-600/40 backdrop-blur-xl transform scale-105 transition-all duration-300 hover:-translate-y-2 border-2 border-pink-500/50" style={{
              boxShadow: '0 15px 60px rgba(247, 37, 133, 0.5)'
            }}>
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-[#B94AFF] to-[#4FC3FF] px-6 py-2 rounded-full text-sm font-bold shadow-lg text-white">
                  Most Popular
                </span>
              </div>
              
              <div className="text-center">
                <h3 className="text-3xl font-black mb-4 text-white" style={{ 
                  fontFamily: 'Space Grotesk, sans-serif'
                }}>
                  Turbo Mode
                </h3>
                <p className="text-white/80 mb-8">Subtitle:</p>
                <Link href="/signup">
                  <Button className="w-full bg-white text-[#B94AFF] py-4 rounded-xl text-lg font-bold hover:bg-gray-100 transition-colors mb-6">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>

            {/* Pixel Pro */}
            <div className="relative p-8 rounded-3xl bg-gradient-to-br from-purple-900/30 via-pink-900/20 to-transparent backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 border border-purple-500/30" style={{
              boxShadow: '0 10px 40px rgba(168, 85, 247, 0.3)'
            }}>
              <div className="text-center">
                <h3 className="text-3xl font-black mb-4 text-white" style={{ 
                  fontFamily: 'Space Grotesk, sans-serif'
                }}>
                  Pixel Pro
                </h3>
                <p className="text-[#EAF1FF]/60 mb-8">Subtitle:</p>
                <Link href="/signup">
                  <Button className="w-full relative group overflow-hidden py-4 rounded-xl text-lg font-bold transition-all hover:scale-105 mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#B94AFF] to-[#4FC3FF]" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#4FC3FF] to-[#B94AFF] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative text-white">Get Started</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-32 px-6 border-t border-white/10 backdrop-blur-2xl bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-white/40 text-sm">
            <p>2025 <a href="https://nanokit.io" className="hover:text-white transition-colors">Nanokit.io</a></p>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-[90] p-4 rounded-full bg-gradient-to-r from-[#B94AFF] to-[#4FC3FF] text-white shadow-2xl shadow-[#4FC3FF]/50 transition-all duration-300 hover:scale-110 hover:shadow-[#4FC3FF]/70 ${
          showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
        aria-label="Back to top"
      >
        <ArrowUp className="w-6 h-6" />
      </button>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes drawLine {
          0% {
            height: 0;
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            height: 100%;
            opacity: 1;
          }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out;
          animation-fill-mode: both;
        }
      `}</style>
    </div>
  )
}
