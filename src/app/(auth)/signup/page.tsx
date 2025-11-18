'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ConfigurationNotice } from '@/components/ConfigurationNotice'
import { Button } from '@/components/ui/button'
import { NanoKitLogo } from '@/components/NanoKitLogo'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [preferredName, setPreferredName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  // const router = useRouter()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Check if Supabase is properly configured
    if (process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co' || 
        !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      setError('Authentication service is not configured. Please contact support.')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            preferred_name: preferredName || email.split('@')[0]
          }
        }
      })

      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
      }
    } catch {
      setError('Authentication service is temporarily unavailable. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-white overflow-hidden relative">
        {/* Futuristic Success Background */}
        <div className="fixed inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-green-950/30 to-black"></div>
          <div className="absolute inset-0">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute opacity-30"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              >
                <div className="w-4 h-4 border border-green-400/40 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Header */}
        <header className="relative z-10 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <NanoKitLogo size="header" />
            </div>
          </div>
        </header>

        <div className="relative z-10 flex flex-col justify-center py-12 sm:px-6 lg:px-8 min-h-[calc(100vh-88px)]">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-slate-900/60 backdrop-blur-xl border border-green-500/30 rounded-2xl p-8 shadow-2xl shadow-green-500/10">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 mb-6">
                  <svg className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-4xl font-black mb-6">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                    Forge Activated!
                  </span>
                </h2>
                <p className="text-lg text-slate-300 mb-2">
                  We&apos;ve sent an activation link to
                </p>
                <p className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 font-semibold mb-8 text-lg">{email}</p>
                <Link
                  href="/login"
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl hover:shadow-green-500/25 transition-all duration-300 hover:scale-105 inline-block"
                >
                  <span className="flex items-center justify-center">
                    <span className="mr-2">⚡</span>
                    Access Your Forge
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-white overflow-hidden relative">
      {/* Futuristic Synthwave Background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/30 to-black"></div>
        
        {/* Floating geometric shapes */}
        <div className="absolute inset-0">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            >
              {i % 4 === 0 && <div className="w-6 h-6 border border-purple-400/30 rotate-45"></div>}
              {i % 4 === 1 && <div className="w-4 h-4 border border-cyan-400/30 rounded-full"></div>}
              {i % 4 === 2 && <div className="w-8 h-1 bg-gradient-to-r from-purple-400/20 to-cyan-400/20"></div>}
              {i % 4 === 3 && <div className="w-2 h-6 bg-gradient-to-b from-pink-400/20 to-transparent"></div>}
            </div>
          ))}
        </div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(138, 43, 226, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(138, 43, 226, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <NanoKitLogo size="header" />
            <Link href="/login" className="text-sm text-slate-400 hover:text-cyan-400 transition-colors duration-300">
              Already have an account? →
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col justify-center py-12 sm:px-6 lg:px-8 min-h-[calc(100vh-88px)]">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 backdrop-blur-sm border border-purple-400/30 rounded-full mb-8 hover:border-purple-400/50 transition-all duration-300 group">
              <span className="text-sm font-medium text-purple-300 tracking-wide">Join the Digital Revolution</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 hover:from-purple-400 hover:to-white transition-all duration-500">
                Join the Forge
              </span>
            </h2>
            
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Start forging <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 font-semibold">extraordinary digital experiences</span> with 
              cutting-edge AI technology
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl shadow-purple-500/10">
            <ConfigurationNotice />
            <form className="space-y-6" onSubmit={handleSignup}>
              {error && (
                <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 text-red-300 dark:text-red-300 light:text-red-600 px-4 py-3 rounded-2xl text-sm backdrop-blur-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="preferredName" className="block text-sm font-semibold text-purple-300 mb-3">
                  Preferred Name
                </label>
                <input
                  id="preferredName"
                  name="preferredName"
                  type="text"
                  autoComplete="given-name"
                  value={preferredName}
                  onChange={(e) => setPreferredName(e.target.value)}
                  className="w-full px-4 py-4 bg-slate-800/50 border border-slate-600 rounded-xl placeholder-slate-400 text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 backdrop-blur-sm transition-all duration-300 hover:border-slate-500"
                  placeholder="How should we call you?"
                />
                <p className="mt-2 text-xs text-slate-400">Optional - We'll use this to personalize your experience</p>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-purple-300 mb-3">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-4 bg-slate-800/50 border border-slate-600 rounded-xl placeholder-slate-400 text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 backdrop-blur-sm transition-all duration-300 hover:border-slate-500"
                  placeholder="Enter your email address"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-purple-300 mb-3">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-4 bg-slate-800/50 border border-slate-600 rounded-xl placeholder-slate-400 text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 backdrop-blur-sm transition-all duration-300 hover:border-slate-500"
                  placeholder="Create a secure password (min 6 characters)"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-purple-300 mb-3">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-4 bg-slate-800/50 border border-slate-600 rounded-xl placeholder-slate-400 text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 backdrop-blur-sm transition-all duration-300 hover:border-slate-500"
                  placeholder="Confirm your password"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Initializing forge...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <span className="mr-2">⚡</span>
                      Initialize Your Forge
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg);
            opacity: 0.7;
          }
          50% { 
            transform: translateY(-10px) rotate(180deg);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
