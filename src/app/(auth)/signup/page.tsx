import Link from 'next/link'
import { NanoKitLogo } from '@/components/NanoKitLogo'
import { Footer } from '@/components/Footer'
import { SignupForm } from './SignupForm'

export default function SignupPage() {


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
          <SignupForm />
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}
