'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { NanoKitLogo } from '@/components/NanoKitLogo'
import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function Home() {
  const [scrollY, setScrollY] = useState(0)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0C0A24] via-[#1A0F40] to-[#0C0A24] text-white overflow-x-hidden" style={{ fontFamily: 'Space Grotesk, system-ui, sans-serif' }}>
      
      {/* Animated Star Field with Parallax */}
      {isMounted && (
        <div className="fixed inset-0 z-0 overflow-hidden" style={{ transform: `translateY(${scrollY * 0.3}px)` }}>
          {[...Array(100)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: Math.random() * 2 + 0.5 + 'px',
                height: Math.random() * 2 + 0.5 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                opacity: Math.random() * 0.7 + 0.3,
                animation: `twinkle ${Math.random() * 3 + 2}s infinite ${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-[100] backdrop-blur-2xl bg-black/40 border-b border-[#B94AFF]/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
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
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-20 pt-32 pb-40 px-6">
        <div className="max-w-6xl mx-auto text-center">
          {/* Logo Principal */}
          <div className="mb-10 animate-fadeIn flex justify-center">
            <div style={{
              filter: 'drop-shadow(0 0 40px rgba(79, 195, 255, 0.6)) brightness(1.2)',
            }}>
              <NanoKitLogo size="lg" />
            </div>
          </div>

          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-[#B94AFF]/10 to-[#4FC3FF]/10 border border-[#4FC3FF]/30 mb-10 backdrop-blur-sm animate-fadeIn shadow-[0_0_20px_rgba(79,195,255,0.2)]">
            <div className="w-2 h-2 rounded-full bg-[#4FC3FF] animate-pulse" />
            <span className="text-sm font-bold tracking-wider text-[#EAF1FF]">AI-POWERED LANDING PAGE BUILDER</span>
            <div className="w-2 h-2 rounded-full bg-[#B94AFF] animate-pulse" />
          </div>

          <h1 className="text-7xl md:text-9xl font-black leading-[0.95] mb-10 animate-fadeInUp" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            <span className="block text-[#EAF1FF] drop-shadow-[0_0_40px_rgba(234,241,255,0.4)]">
              Create Any Style
            </span>
            <span className="block bg-gradient-to-r from-[#B94AFF] via-[#4FC3FF] to-[#FF76FF] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient drop-shadow-[0_0_60px_rgba(185,74,255,0.6)]">
              Landing Page
            </span>
            <span className="block text-[#EAF1FF] drop-shadow-[0_0_40px_rgba(234,241,255,0.4)]">
              — Instantly.
            </span>
          </h1>

          <p className="text-2xl md:text-3xl text-[#EAF1FF]/80 max-w-4xl mx-auto mb-14 leading-relaxed animate-fadeInUp" style={{ animationDelay: '0.2s', fontFamily: 'Inter, sans-serif' }}>
            From minimal corporate to bold lifestyle, <span className="text-[#4FC3FF] font-semibold text-shadow-glow">NANO KIT adapts to your aesthetic</span>.{' '}
            <span className="text-[#EAF1FF] font-semibold">No coding. Pure creativity.</span>
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
            <a href="#templates">
              <Button variant="ghost" className="text-[#EAF1FF] hover:text-[#4FC3FF] border-2 border-[#4FC3FF]/30 hover:border-[#4FC3FF] px-12 py-7 rounded-2xl text-xl font-bold transition-all duration-300 backdrop-blur-sm hover:bg-[#4FC3FF]/10">
                Browse Templates
              </Button>
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-sm text-white/50 animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
            {[
              { label: '12+ Template Styles', icon: '✦' },
              { label: 'AI-Powered Generation', icon: '⚡' },
              { label: 'Real-Time Editor', icon: '⟡' },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-2 group hover:text-white transition-colors">
                <span className="text-[#4FC3FF]">{stat.icon}</span>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-32 px-6 bg-gradient-to-b from-transparent via-[#B94AFF]/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-6xl md:text-7xl font-black mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              <span className="bg-gradient-to-r from-[#B94AFF] via-[#4FC3FF] to-[#FF76FF] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(185,74,255,0.4)]">
                Creative Engine
              </span>
            </h2>
            <p className="text-2xl text-[#EAF1FF]/70 max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
              AI that understands design, aesthetics, and conversion
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: (
                  <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="white" fillOpacity="0.2"/>
                  </svg>
                ),
                title: 'AI Generate',
                desc: 'Describe your idea and get a full landing page instantly.',
                gradient: 'from-[#B94AFF] to-[#B94AFF]/50',
                glow: 'rgba(185,74,255,0.4)',
              },
              {
                icon: (
                  <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 20H21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16.5 3.50001C16.8978 3.10219 17.4374 2.87869 18 2.87869C18.2786 2.87869 18.5544 2.93356 18.8118 3.04017C19.0692 3.14678 19.303 3.30303 19.5 3.50001C19.697 3.69698 19.8532 3.93083 19.9598 4.18819C20.0665 4.44556 20.1213 4.72141 20.1213 5.00001C20.1213 5.27861 20.0665 5.55446 19.9598 5.81183C19.8532 6.06919 19.697 6.30304 19.5 6.50001L7 19L3 20L4 16L16.5 3.50001Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="white" fillOpacity="0.1"/>
                  </svg>
                ),
                title: 'Live Edit',
                desc: 'See every change in real time. Edit anything, anywhere.',
                gradient: 'from-[#4FC3FF] to-[#4FC3FF]/50',
                glow: 'rgba(79,195,255,0.4)',
              },
              {
                icon: (
                  <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="3" width="20" height="14" rx="2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 21H16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 17V21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 10L10 13L7 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 13H17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
                title: 'Export Clean Code',
                desc: 'Download production-ready HTML/CSS. Zero dependencies.',
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

      {/* How It Works */}
      <section id="how-it-works" className="relative z-10 py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-6xl md:text-7xl font-black mb-6" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              <span className="bg-gradient-to-r from-[#4FC3FF] via-[#B94AFF] to-[#FF76FF] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(79,195,255,0.4)]">
                From Idea to Live Page
              </span>
            </h2>
            <p className="text-2xl text-[#EAF1FF]/70" style={{ fontFamily: 'Inter, sans-serif' }}>In minutes, not hours</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-28 left-1/3 right-1/3 h-1 bg-gradient-to-r from-[#4FC3FF] via-[#B94AFF] to-[#4FC3FF] opacity-30" />
            
            {[
              { step: '1', title: 'Create', desc: 'Create with AI or choose a template', icon: '◆', color: '#B94AFF' },
              { step: '2', title: 'Edit', desc: 'Customize in real-time visual editor', icon: '▲', color: '#4FC3FF' },
              { step: '3', title: 'Export', desc: 'Download or host your page', icon: '●', color: '#B94AFF' },
            ].map((item, i) => (
              <div key={i} className="text-center relative group">
                <div 
                  className="w-32 h-32 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-[#B94AFF] to-[#4FC3FF] flex items-center justify-center text-5xl font-black text-white shadow-[0_0_60px_rgba(185,74,255,0.4)] hover:scale-110 transition-transform duration-300 cursor-pointer"
                  style={{ boxShadow: `0 0 80px ${item.color}80` }}
                >
                  {item.icon}
                </div>
                <div className="inline-block px-4 py-1 rounded-full bg-white/10 text-white/50 text-sm font-bold mb-3">
                  STEP {item.step}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-white/60 text-lg">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Host With Us */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="relative p-20 rounded-3xl bg-gradient-to-br from-[#4FC3FF]/20 via-[#B94AFF]/20 to-[#4FC3FF]/20 border border-[#4FC3FF]/30 backdrop-blur-2xl overflow-hidden shadow-[0_0_80px_rgba(79,195,255,0.3)]">
            <div className="absolute inset-0">
              <div className="absolute top-1/3 left-1/3 w-40 h-40 bg-[#4FC3FF]/20 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-[#B94AFF]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="relative grid md:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-block px-5 py-2 rounded-full bg-[#4FC3FF]/20 border border-[#4FC3FF]/50 text-[#4FC3FF] text-sm font-black mb-8 shadow-[0_0_20px_rgba(79,195,255,0.3)]">
                  ⚡ INSTANT HOSTING
                </div>
                <h2 className="text-5xl md:text-6xl font-black mb-8" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  <span className="bg-gradient-to-r from-[#4FC3FF] via-[#B94AFF] to-[#FF76FF] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(79,195,255,0.5)]">
                    Instant Hosting.<br/>Global Reach.
                  </span>
                </h2>
                <p className="text-2xl text-[#EAF1FF]/80 mb-10 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Host your page instantly with our global CDN. <span className="text-[#EAF1FF] font-bold">No setup. Just one click.</span>
                </p>
                <div className="space-y-4">
                  {[
                    { icon: '🚀', text: 'One-click deployment to AWS S3' },
                    { icon: '⚡', text: 'Global CDN for instant loading' },
                    { icon: '🔒', text: 'SSL certificate included' },
                    { icon: '📊', text: 'Built-in analytics dashboard' },
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 text-white/80">
                      <span className="text-2xl">{feature.icon}</span>
                      <span className="text-lg">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/20">
                  <div className="text-center mb-6">
                    <div className="text-6xl font-black bg-gradient-to-r from-[#B94AFF] to-[#4FC3FF] bg-clip-text text-transparent mb-2">
                      FREE
                    </div>
                    <div className="text-white/60">Forever hosting included</div>
                  </div>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-white/70">
                      <span>Bandwidth</span>
                      <span className="font-bold text-white">Unlimited</span>
                    </div>
                    <div className="flex justify-between text-white/70">
                      <span>SSL Certificate</span>
                      <span className="font-bold text-white">✓ Included</span>
                    </div>
                    <div className="flex justify-between text-white/70">
                      <span>Custom Domain</span>
                      <span className="font-bold text-white">✓ Supported</span>
                    </div>
                    <div className="flex justify-between text-white/70">
                      <span>Uptime</span>
                      <span className="font-bold text-[#4FC3FF]">99.9%</span>
                    </div>
                  </div>
                  <Link href="/try-editor">
                    <Button className="w-full relative group overflow-hidden py-4 rounded-xl text-lg font-bold transition-all hover:scale-105">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#B94AFF] to-[#4FC3FF]" />
                      <div className="absolute inset-0 bg-gradient-to-r from-[#4FC3FF] to-[#B94AFF] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="relative text-white">Try Editor Free →</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="relative p-16 rounded-3xl bg-gradient-to-br from-[#B94AFF]/20 via-[#4FC3FF]/20 to-[#B94AFF]/20 border border-[#4FC3FF]/30 backdrop-blur-2xl overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-[#B94AFF]/20 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-[#4FC3FF]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
            
            <div className="relative text-center">
              <h2 className="text-5xl md:text-6xl font-black mb-6">
                <span className="bg-gradient-to-r from-[#B94AFF] to-[#4FC3FF] bg-clip-text text-transparent">
                  Start Creating Today
                </span>
              </h2>
              <p className="text-2xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
                From minimal to maximal. Corporate to creative. Your style, powered by AI.
              </p>
              <Link href="/signup">
                <Button className="relative group overflow-hidden px-16 py-8 rounded-2xl text-xl font-black transition-all hover:scale-105 shadow-[0_0_80px_rgba(185,74,255,0.5)]">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#B94AFF] to-[#4FC3FF]" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#4FC3FF] to-[#B94AFF] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative text-white flex items-center gap-3">
                    CREATE YOUR FIRST PAGE
                    <span className="text-3xl group-hover:translate-x-2 transition-transform">→</span>
                  </span>
                </Button>
              </Link>
              <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-white/50">
                <span>✓ No Credit Card Required</span>
                <span>✓ 12+ Template Styles</span>
                <span>✓ AI-Powered Generation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-16 px-6 border-t border-white/10 backdrop-blur-2xl bg-black/40">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col items-center md:items-start gap-4">
              <NanoKitLogo size="sm" />
              <p className="text-white/40 text-sm text-center md:text-left max-w-xs">
                AI-powered landing page builder for every style and industry
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
              <div>
                <h4 className="font-bold text-white mb-3">Product</h4>
                <div className="flex flex-col gap-2 text-white/50">
                  <a href="#features" className="hover:text-white transition-colors">Features</a>
                  <a href="#templates" className="hover:text-white transition-colors">Templates</a>
                  <a href="#" className="hover:text-white transition-colors">Pricing</a>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-white mb-3">Company</h4>
                <div className="flex flex-col gap-2 text-white/50">
                  <a href="#" className="hover:text-white transition-colors">About</a>
                  <a href="#" className="hover:text-white transition-colors">Blog</a>
                  <a href="#" className="hover:text-white transition-colors">Careers</a>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-white mb-3">Resources</h4>
                <div className="flex flex-col gap-2 text-white/50">
                  <a href="#" className="hover:text-white transition-colors">Help Center</a>
                  <a href="#" className="hover:text-white transition-colors">Community</a>
                  <a href="#" className="hover:text-white transition-colors">Status</a>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-white mb-3">Legal</h4>
                <div className="flex flex-col gap-2 text-white/50">
                  <a href="#" className="hover:text-white transition-colors">Privacy</a>
                  <a href="#" className="hover:text-white transition-colors">Terms</a>
                  <a href="#" className="hover:text-white transition-colors">Security</a>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/10 text-center text-white/40 text-sm">
            <p>© 2025 Nano Kit. Built with passion for creators worldwide.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
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
