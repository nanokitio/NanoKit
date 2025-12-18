'use client'

import Link from 'next/link'

interface FooterProps {
  className?: string
}

export function Footer({ className = '' }: FooterProps) {
  return (
    <footer className={`relative z-10 py-6 px-6 border-t border-slate-700/50 backdrop-blur-2xl bg-slate-900/80 ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-slate-400 text-sm">
            <p>© 2025 <a href="https://nanokit.io" className="hover:text-cyan-400 transition-colors">Nanokit.io</a> - All rights reserved</p>
          </div>
          <div className="flex gap-6 text-sm text-slate-400">
            <Link href="/login" className="hover:text-cyan-400 transition-colors">
              Login
            </Link>
            <Link href="/signup" className="hover:text-cyan-400 transition-colors">
              Sign Up
            </Link>
            <a href="mailto:support@nanokit.io" className="hover:text-cyan-400 transition-colors">
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
