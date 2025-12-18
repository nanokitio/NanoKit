'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ConfigurationNotice } from '@/components/ConfigurationNotice'
import { Button } from '@/components/ui/button'
import { NanoKitLogo } from '@/components/NanoKitLogo'
import { Footer } from '@/components/Footer'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [preferredName, setPreferredName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [userCountry, setUserCountry] = useState('Costa Rica')
  // const router = useRouter()
  const supabase = createClient()

  // Detect user country based on IP (optional)
  useEffect(() => {
    const fetchUserCountry = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/')
        const data = await response.json()
        if (data.country_name) {
          setUserCountry(data.country_name)
        }
      } catch (error) {
        console.log('Could not detect country, using default')
        // Keep default Costa Rica
      }
    }
    
    fetchUserCountry()
  }, [])

  const handleOAuthSignup = async (provider: 'google' | 'facebook' | 'apple') => {
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        setError(error.message)
        setLoading(false)
      }
    } catch {
      setError('Authentication service is temporarily unavailable. Please try again later.')
      setLoading(false)
    }
  }

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
              <Link href="/">
                <NanoKitLogo size="header" />
              </Link>
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
                    Account Created!
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
                    Go to Dashboard
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
            <Link href="/">
              <NanoKitLogo size="header" />
            </Link>
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
            <h2 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 hover:from-purple-400 hover:to-white transition-all duration-500">
                Ready to Join? Let&apos;s Do This
              </span>
            </h2>
            
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Power up your creativity and build extraordinary digital experiences with advanced AI
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl shadow-purple-500/10">
            <ConfigurationNotice />
            
            {!showEmailForm ? (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-center text-white mb-6">Choose your sign up method</h3>
                
                {/* Use phone or email button */}
                <button
                  onClick={() => setShowEmailForm(true)}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-600 rounded-xl text-white transition-all duration-300 hover:scale-105 hover:border-slate-500"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                  </svg>
                  <span className="font-semibold">Use phone or email</span>
                </button>

                {/* TikTok OAuth */}
                <button
                  onClick={() => alert('TikTok OAuth integration - Contact your developer to complete setup')}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-600 rounded-xl text-white transition-all duration-300 hover:scale-105 hover:border-slate-500 disabled:opacity-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                  <span className="font-semibold">Continue with TikTok</span>
                </button>

                {/* Facebook OAuth */}
                <button
                  onClick={() => handleOAuthSignup('facebook')}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-600 rounded-xl text-white transition-all duration-300 hover:scale-105 hover:border-slate-500 disabled:opacity-50"
                >
                  <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span className="font-semibold">Continue with Facebook</span>
                </button>

                {/* Google OAuth */}
                <button
                  onClick={() => handleOAuthSignup('google')}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-600 rounded-xl text-white transition-all duration-300 hover:scale-105 hover:border-slate-500 disabled:opacity-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="font-semibold">Continue with Google</span>
                </button>

                {/* Apple OAuth */}
                <button
                  onClick={() => handleOAuthSignup('apple')}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-600 rounded-xl text-white transition-all duration-300 hover:scale-105 hover:border-slate-500 disabled:opacity-50"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  <span className="font-semibold">Continue with Apple</span>
                </button>

                <p className="text-xs text-slate-400 text-center mt-6">
                  By continuing with an account located in <span className="font-semibold text-slate-300">{userCountry}</span>, you agree to our{' '}
                  <a href="/terms" className="text-cyan-400 hover:text-cyan-300 underline">
                    Terms of Service
                  </a>{' '}
                  and acknowledge that you have read our{' '}
                  <a href="/privacy" className="text-cyan-400 hover:text-cyan-300 underline">
                    Privacy Policy
                  </a>.
                </p>
                
                <p className="text-xs text-slate-500 text-center mt-2">
                  Already have an account?{' '}
                  <Link href="/login" className="text-pink-400 hover:text-pink-300 font-semibold">
                    Log in
                  </Link>
                </p>
              </div>
            ) : (
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
                      Activating...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <span className="mr-2">⚡</span>
                      Activate Your Kit
                    </span>
                  )}
                </button>
              </div>
              
              <p className="text-xs text-slate-400 text-center mt-4">
                By continuing with an account, you agree to our{' '}
                <a href="/terms" className="text-cyan-400 hover:text-cyan-300 underline">
                  Terms & Conditions
                </a>{' '}
                and acknowledge that you have read our{' '}
                <a href="/privacy" className="text-cyan-400 hover:text-cyan-300 underline">
                  Privacy Policy
                </a>.
              </p>
              
              <button
                type="button"
                onClick={() => setShowEmailForm(false)}
                className="w-full text-center text-sm text-slate-400 hover:text-cyan-400 transition-colors mt-4"
              >
                ← Back to sign up options
              </button>
            </form>
            )}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
      
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
