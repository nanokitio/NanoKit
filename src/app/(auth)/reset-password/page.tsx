'use client'
// Reset password page - Force rebuild for Vercel deployment

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { NanoKitLogo } from '@/components/NanoKitLogo'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [validToken, setValidToken] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Check if we have a valid session (came from email link)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setValidToken(true)
      } else {
        setError('Invalid or expired reset link. Please request a new one.')
      }
    })
  }, [supabase.auth])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validations
    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-white overflow-hidden relative">
      {/* Futuristic Synthwave Background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/30 to-black"></div>
        
        {/* Floating geometric shapes */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
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
              {i % 4 === 0 && <div className="w-6 h-6 border border-cyan-400/30 rotate-45"></div>}
              {i % 4 === 1 && <div className="w-4 h-4 border border-pink-400/30 rounded-full"></div>}
              {i % 4 === 2 && <div className="w-8 h-1 bg-gradient-to-r from-cyan-400/20 to-pink-400/20"></div>}
              {i % 4 === 3 && <div className="w-2 h-6 bg-gradient-to-b from-purple-400/20 to-transparent"></div>}
            </div>
          ))}
        </div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
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
              ← Back to Login
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col justify-center py-12 sm:px-6 lg:px-8 min-h-[calc(100vh-88px)]">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-sm border border-cyan-400/30 rounded-full mb-8 hover:border-cyan-400/50 transition-all duration-300 group">
              <span className="w-3 h-3 bg-cyan-400 rounded-full mr-3 animate-pulse group-hover:animate-ping"></span>
              <span className="text-sm font-medium text-cyan-300 tracking-wide">Create New Password</span>
              <span className="w-3 h-3 bg-purple-400 rounded-full ml-3 animate-pulse group-hover:animate-ping"></span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 hover:from-cyan-400 hover:to-white transition-all duration-500">
                Reset Password
              </span>
            </h2>
            
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Enter your new <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 font-semibold">secure password</span>
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl shadow-purple-500/10">
            {!validToken && !success ? (
              <div className="text-center">
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full border border-red-400/30 mb-4">
                    <span className="text-4xl">⚠️</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Invalid Reset Link</h3>
                <p className="text-slate-300 mb-6">
                  This password reset link is invalid or has expired.
                </p>
                <p className="text-sm text-slate-400 mb-8">
                  Reset links expire after 1 hour for security reasons.
                </p>
                <Link
                  href="/forgot-password"
                  className="inline-block w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
                >
                  Request New Link
                </Link>
              </div>
            ) : success ? (
              <div className="text-center">
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500/20 to-cyan-500/20 rounded-full border border-green-400/30 mb-4">
                    <span className="text-4xl">✓</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Password Reset Successful!</h3>
                <p className="text-slate-300 mb-6">
                  Your password has been updated successfully.
                </p>
                <p className="text-sm text-slate-400 mb-8">
                  Redirecting to login page...
                </p>
                <div className="flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin"></div>
                </div>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleResetPassword}>
                {error && (
                  <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-2xl text-sm backdrop-blur-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-cyan-300 mb-3">
                    New Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-4 bg-slate-800/50 border border-slate-600 rounded-xl placeholder-slate-400 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 backdrop-blur-sm transition-all duration-300 hover:border-slate-500"
                    placeholder="Enter new password (min. 6 characters)"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-cyan-300 mb-3">
                    Confirm New Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-4 bg-slate-800/50 border border-slate-600 rounded-xl placeholder-slate-400 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 backdrop-blur-sm transition-all duration-300 hover:border-slate-500"
                    placeholder="Confirm your new password"
                  />
                </div>

                {/* Password strength indicator */}
                {password && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <div className={`w-2 h-2 rounded-full ${password.length >= 6 ? 'bg-green-400' : 'bg-gray-600'}`}></div>
                      <span className={password.length >= 6 ? 'text-green-400' : 'text-gray-400'}>
                        At least 6 characters
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className={`w-2 h-2 rounded-full ${password === confirmPassword && password ? 'bg-green-400' : 'bg-gray-600'}`}></div>
                      <span className={password === confirmPassword && password ? 'text-green-400' : 'text-gray-400'}>
                        Passwords match
                      </span>
                    </div>
                  </div>
                )}

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        Updating password...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <span className="mr-2">🔒</span>
                        Reset Password
                      </span>
                    )}
                  </button>
                </div>
              </form>
            )}
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
