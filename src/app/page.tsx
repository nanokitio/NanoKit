'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { NanoKitLogo } from '@/components/NanoKitLogo'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Menu, X, ArrowUp, Sparkles, Palette, Rocket } from 'lucide-react'

export default function Home() {
  const [stars, setStars] = useState<Array<{size: number, brightness: number, top: number, left: number, color: string}>>([]);
  const [constellations, setConstellations] = useState<Array<{x1: number, y1: number, x2: number, y2: number}>>([]);
  const [particles, setParticles] = useState<Array<{top: number, left: number, animationDelay: string, animationDuration: string}>>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [scrolled, setScrolled] = useState(false);

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

    // Generate particles on client-side only
    const particleArray = [...Array(15)].map(() => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${2 + Math.random() * 3}s`
    }));
    setParticles(particleArray);

    const handleScroll = () => {
      setScrollY(window.scrollY);
      setShowBackToTop(window.scrollY > 400);
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen text-white overflow-x-hidden relative" style={{ fontFamily: 'Space Grotesk, system-ui, sans-serif' }}>
      {/* Dugem Nightlife Background - Sin Video */}
      <div className="fixed inset-0" style={{ zIndex: -2 }}>
        {/* Dugem Gradient Overlay - Más Oscuro */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-950/90 via-blue-950/90 to-pink-950/90" />
        
        {/* Glassmorphism Effect */}
        <div className="absolute inset-0 backdrop-blur-[2px]" />
        
        {/* Animated Gradient Overlay */}
        <div 
          className="absolute inset-0 opacity-30" 
          style={{
            background: 'linear-gradient(45deg, rgba(255, 0, 255, 0.3), rgba(0, 255, 255, 0.3), rgba(255, 20, 147, 0.3))',
            animation: 'gradient 4s ease infinite',
            backgroundSize: '400% 400%'
          }}
        />
        
        {/* Vignette effect */}
        <div 
          className="absolute inset-0" 
          style={{
            boxShadow: 'inset 0 0 200px rgba(0, 0, 0, 0.8)',
          }}
        />
        
        {/* Particle Effects */}
        <div className="absolute inset-0 overflow-hidden">
          {particles.map((particle, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                top: `${particle.top}%`,
                left: `${particle.left}%`,
                animationDelay: particle.animationDelay,
                animationDuration: particle.animationDuration,
                boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)'
              }}
            />
          ))}
        </div>
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

      {/* Floating Navigation */}
      <div className={`fixed top-0 left-0 right-0 z-[100] flex justify-between items-center px-6 lg:px-8 h-20 transition-all duration-300 ${
        scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'
      }`}>
        <NanoKitLogo size="header" href="/" />
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" className={`transition-all px-5 py-2 rounded-xl backdrop-blur-sm ${
              scrolled 
                ? 'text-white/80 hover:text-white border border-white/20 hover:border-white/40 hover:bg-white/10' 
                : 'text-white/80 hover:text-white border border-white/20 hover:border-white/40 hover:bg-white/10'
            }`}>
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="relative overflow-hidden px-6 py-2 rounded-xl font-bold transition-all hover:scale-105 group shadow-lg shadow-purple-500/30 hover:shadow-cyan-500/50">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600" />
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative text-white">Get Started</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero Section with Enhanced Dugem Effects - Sin Header */}
      <section id="home" className="relative z-10 pt-32 pb-24 px-6">
        <div className="relative max-w-6xl mx-auto text-center z-10">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight mb-8 animate-fadeInUp" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            <span className="block text-white drop-shadow-[0_0_30px_rgba(255,0,255,0.8)] animate-pulse">
              Where AI-crafted
            </span>
            <span className="block text-white drop-shadow-[0_0_30px_rgba(0,255,255,0.8)] animate-pulse" style={{ animationDelay: '0.2s' }}>
              visions
            </span>
            <span className="block text-white drop-shadow-[0_0_30px_rgba(255,20,147,0.8)] animate-pulse" style={{ animationDelay: '0.4s' }}>
              go live effortlessly
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-[#EAF1FF]/90 max-w-4xl mx-auto mb-10 leading-relaxed animate-fadeInUp backdrop-blur-sm bg-white/5 px-6 py-3 rounded-2xl border border-white/10" style={{ animationDelay: '0.2s', fontFamily: 'Inter, sans-serif' }}>
            From Idea to Live Page in 60 Seconds
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-12 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
            <Link href="/signup">
              <Button className="group relative overflow-hidden px-14 py-7 rounded-2xl text-xl font-black transition-all duration-300 hover:scale-105 hover:-translate-y-1 shadow-[0_0_60px_rgba(255,0,255,0.8)] hover:shadow-[0_0_80px_rgba(0,255,255,0.8)] backdrop-blur-sm border border-white/20">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF00FF] to-[#00FFFF]" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#00FFFF] to-[#FF1493] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
          
          {/* Video - Nanokit-Home.mp4 */}
          <div className="relative w-full flex items-center justify-center">
            <video
              src="https://s3.amazonaws.com/landertag.com/Videos/Nanokit-Home.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:rgb(79,195,255);stop-opacity:0.5' /%3E%3Cstop offset='100%25' style='stop-color:rgb(185,74,255);stop-opacity:0.5' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1920' height='1080' fill='url(%23grad)' /%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='48' fill='white' text-anchor='middle' dy='.3em'%3E🎬 Loading Video...%3C/text%3E%3C/svg%3E"
              className="w-full max-w-4xl rounded-2xl shadow-2xl shadow-[#4FC3FF]/30"
              style={{
                boxShadow: '0 0 60px rgba(79, 195, 255, 0.4), 0 0 120px rgba(185, 74, 255, 0.2)'
              }}
              onError={(e) => {
                console.error('Video failed to load:', e);
                const video = e.currentTarget;
                video.style.display = 'none';
                const fallback = document.createElement('div');
                fallback.className = 'w-full max-w-4xl h-96 bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-2xl shadow-2xl shadow-[#4FC3FF]/30 flex items-center justify-center';
                fallback.innerHTML = '<div class="text-center"><p class="text-white text-xl mb-4">🎬 Video Loading...</p><p class="text-white/60">The Nanokit demo will appear here</p></div>';
                video.parentNode?.insertBefore(fallback, video.nextSibling);
              }}
              onLoadStart={() => console.log('Video loading started')}
              onCanPlay={() => console.log('Video ready to play')}
              onLoadedData={() => {
                const video = document.querySelector('video');
                if (video) {
                  video.playbackRate = 1.0;
                }
              }}
            />
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
      <footer className="relative z-10 py-8 px-6 border-t border-white/10 backdrop-blur-2xl bg-black/20">
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
