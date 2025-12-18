'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { NanoKitLogo } from '@/components/NanoKitLogo'
import { MessageCircle, Mail, FileText, Search, ExternalLink } from 'lucide-react'

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState<'help' | 'contact' | 'docs'>('help')
  const router = useRouter()

  const commonIssues = [
    {
      title: "How do I create my first site?",
      description: "Learn how to create and customize your first landing page",
      category: "Getting Started"
    },
    {
      title: "Template not working in preview",
      description: "Troubleshooting steps when templates don't render correctly",
      category: "Technical Issues"
    },
    {
      title: "How to host my site on AWS",
      description: "Step-by-step guide to deploy your landing page",
      category: "Hosting"
    },
    {
      title: "Custom domain setup",
      description: "Configure your custom domain with NanoKit",
      category: "DNS & Domains"
    },
    {
      title: "Export and download options",
      description: "Different ways to export your landing page",
      category: "Export"
    },
    {
      title: "Account billing questions",
      description: "Understanding your subscription and billing",
      category: "Account"
    }
  ]

  const quickActions = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with our support team",
      action: "Start Chat",
      available: false
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Get help via email",
      action: "Send Email",
      available: true
    },
    {
      icon: FileText,
      title: "Documentation",
      description: "Browse our help docs",
      action: "View Docs",
      available: true
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black text-white">
      {/* Header */}
      <header className="relative z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center gap-6">
              <NanoKitLogo size="header" href="/" />
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                Support Center
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <div
                key={index}
                className={`bg-slate-900/60 backdrop-blur-xl rounded-xl p-6 border border-slate-800 ${
                  !action.available ? 'opacity-50' : 'hover:border-cyan-500/50 transition-all'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${
                    action.available 
                      ? 'bg-gradient-to-br from-cyan-500/20 to-purple-500/20' 
                      : 'bg-slate-800'
                  }`}>
                    <Icon className={`w-6 h-6 ${
                      action.available ? 'text-cyan-400' : 'text-slate-500'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">{action.title}</h3>
                    <p className="text-slate-400 text-sm mb-4">{action.description}</p>
                    {action.available ? (
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400"
                        onClick={() => {
                          if (action.title === "Email Support") {
                            window.location.href = "mailto:support@nanokit.io"
                          } else if (action.title === "Documentation") {
                            window.open("https://docs.nanokit.io", "_blank")
                          }
                        }}
                      >
                        {action.action}
                        {action.title === "Documentation" && <ExternalLink className="w-3 h-3 ml-2" />}
                      </Button>
                    ) : (
                      <Button size="sm" disabled className="bg-slate-700 text-slate-500">
                        {action.action} - Coming Soon
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Tabs */}
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl shadow-2xl shadow-purple-500/10 border border-slate-800 overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex border-b border-slate-700">
            <button
              onClick={() => setActiveTab('help')}
              className={`flex-1 px-6 py-4 text-left transition-colors ${
                activeTab === 'help'
                  ? 'bg-slate-800 text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-slate-300 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Search className="w-5 h-5" />
                <span className="font-medium">Help Articles</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`flex-1 px-6 py-4 text-left transition-colors ${
                activeTab === 'contact'
                  ? 'bg-slate-800 text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-slate-300 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5" />
                <span className="font-medium">Contact Us</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('docs')}
              className={`flex-1 px-6 py-4 text-left transition-colors ${
                activeTab === 'docs'
                  ? 'bg-slate-800 text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-slate-300 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5" />
                <span className="font-medium">Documentation</span>
              </div>
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'help' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {commonIssues.map((issue, index) => (
                    <div
                      key={index}
                      className="bg-slate-800/50 rounded-lg p-6 hover:bg-slate-800/70 transition-colors cursor-pointer border border-slate-700"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300">
                              {issue.category}
                            </span>
                            <h3 className="text-lg font-semibold text-white">{issue.title}</h3>
                          </div>
                          <p className="text-slate-400 text-sm">{issue.description}</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-slate-500 mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Get in Touch</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Email Support</h3>
                    <p className="text-slate-400 mb-4">
                      Send us an email and we'll get back to you within 24 hours.
                    </p>
                    <Button
                      onClick={() => window.location.href = "mailto:support@nanokit.io"}
                      className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Email Support
                    </Button>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Response Times</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-400">General inquiries</span>
                        <span className="text-cyan-400">24 hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Technical issues</span>
                        <span className="text-cyan-400">12-48 hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Billing questions</span>
                        <span className="text-cyan-400">24 hours</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'docs' && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Documentation</h2>
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Comprehensive Documentation</h3>
                  <p className="text-slate-400 mb-6 max-w-md mx-auto">
                    Browse our detailed documentation for guides, API references, and best practices.
                  </p>
                  <Button
                    onClick={() => window.open("https://docs.nanokit.io", "_blank")}
                    className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visit Documentation
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
