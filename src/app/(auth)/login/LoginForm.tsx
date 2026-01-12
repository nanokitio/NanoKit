'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { ConfigurationNotice } from '@/components/ConfigurationNotice'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co' ||
      !process.env.NEXT_PUBLIC_SUPABASE_URL
    ) {
      setError('Authentication service is not configured. Please contact support.')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } catch {
      setError(
        'Network error: Unable to connect to authentication service. Please check your internet connection and try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl shadow-purple-500/10">
      <ConfigurationNotice />
      <form className="space-y-6" onSubmit={handleLogin}>
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-2xl text-sm backdrop-blur-sm">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-cyan-300 mb-3">
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
            className="w-full px-4 py-4 bg-slate-800/50 border border-slate-600 rounded-xl placeholder-slate-400 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 backdrop-blur-sm transition-all duration-300 hover:border-slate-500"
            placeholder="Enter your email address"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label htmlFor="password" className="block text-sm font-semibold text-cyan-300">
              Password
            </label>
            <a
              className="text-xs text-slate-400 hover:text-cyan-400 transition-colors duration-300 cursor-pointer relative z-10"
              href="/forgot-password"
            >
              Forgot password?
            </a>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-4 bg-slate-800/50 border border-slate-600 rounded-xl placeholder-slate-400 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 backdrop-blur-sm transition-all duration-300 hover:border-slate-500"
            placeholder="Enter your password"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                Signing in...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <span className="mr-2">⚡</span>
                Log In to Nanokit
              </span>
            )}
          </button>
        </div>
      </form>

      <p className="text-sm text-slate-400 text-center mt-6">
        No account yet?{' '}
        <a
          href="/signup"
          className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 hover:from-pink-400 hover:to-cyan-400 transition-all duration-300"
        >
          Let&apos;s set you up.
        </a>
      </p>
    </div>
  )
}
