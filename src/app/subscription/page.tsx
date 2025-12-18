'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, CreditCard, Check, X, Zap, Crown, Star, Users, Globe, Headphones } from 'lucide-react'

export default function SubscriptionPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error || !user) {
        router.push('/login')
        return
      }
      setUser(user)
    } catch (error) {
      console.error('Error loading user:', error)
    } finally {
      setLoading(false)
    }
  }

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      description: 'Perfect for trying out NanoKit',
      icon: Star,
      color: 'from-slate-500 to-slate-600',
      features: [
        '3 Landing Pages',
        'Basic Templates',
        'Community Support',
        'NanoKit Branding',
        'Basic Analytics'
      ],
      limitations: [
        'No custom domains',
        'No priority support',
        'Limited exports'
      ],
      popular: false
    },
    {
      id: 'pro',
      name: 'Pro',
      price: { monthly: 29, yearly: 290 },
      description: 'For professionals and growing businesses',
      icon: Zap,
      color: 'from-cyan-500 to-purple-500',
      features: [
        'Unlimited Landing Pages',
        'All Templates',
        'Priority Support',
        'Remove NanoKit Branding',
        'Advanced Analytics',
        'Custom Domains',
        'Export to HTML/CSS',
        'A/B Testing'
      ],
      limitations: [],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: { monthly: 99, yearly: 990 },
      description: 'For teams and large organizations',
      icon: Crown,
      color: 'from-yellow-500 to-orange-500',
      features: [
        'Everything in Pro',
        'Team Collaboration',
        'White-label Option',
        'Dedicated Support',
        'Custom Integrations',
        'API Access',
        'Advanced Security',
        'Custom Templates'
      ],
      limitations: [],
      popular: false
    }
  ]

  const faqs = [
    {
      question: "Can I change plans anytime?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, debit cards, and PayPal for annual subscriptions."
    },
    {
      question: "Is there a free trial?",
      answer: "The Free plan is always available with no time limit. You can upgrade to Pro or Enterprise whenever you're ready."
    },
    {
      question: "Can I cancel my subscription?",
      answer: "Yes, you can cancel your subscription at any time. Your access will continue until the end of the billing period."
    },
    {
      question: "Do you offer refunds?",
      answer: "We offer a 30-day money-back guarantee for all paid plans if you're not satisfied."
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    )
  }

  const currentPlan = 'free' // This would come from your backend

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black text-white">
      {/* Header */}
      <header className="relative z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.push('/dashboard')}
                className="text-slate-300 hover:text-cyan-400"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                Account & Subscription
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Current Status */}
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 mb-8 border border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Current Plan</h2>
              <p className="text-slate-400">
                You are currently on the <span className="text-cyan-400 font-semibold capitalize">{currentPlan}</span> plan
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-400">Member since</p>
              <p className="text-white font-medium">
                {new Date(user?.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Billing Toggle */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-slate-800/50 rounded-lg p-1 border border-slate-700">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-md transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-md transition-all relative ${
                billingCycle === 'yearly'
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Yearly
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => {
            const Icon = plan.icon
            const price = plan.price[billingCycle]
            const isCurrent = currentPlan === plan.id
            
            return (
              <div
                key={plan.id}
                className={`relative bg-slate-900/60 backdrop-blur-xl rounded-2xl p-8 border ${
                  plan.popular
                    ? 'border-cyan-500/50 shadow-2xl shadow-cyan-500/20'
                    : 'border-slate-800'
                } ${isCurrent ? 'ring-2 ring-cyan-500' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                {isCurrent && (
                  <div className="absolute top-6 right-6">
                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium border border-green-500/30">
                      Current Plan
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className={`w-16 h-16 bg-gradient-to-br ${plan.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-slate-400 text-sm mb-6">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-white">
                      ${price}
                    </span>
                    <span className="text-slate-400 ml-2">
                      /{billingCycle === 'monthly' ? 'month' : 'year'}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300 text-sm">{feature}</span>
                    </div>
                  ))}
                  {plan.limitations.map((limitation, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <X className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-500 text-sm">{limitation}</span>
                    </div>
                  ))}
                </div>

                <Button
                  className={`w-full ${
                    isCurrent
                      ? 'bg-slate-700 text-slate-300 cursor-not-allowed'
                      : plan.popular
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400'
                      : 'bg-slate-800 hover:bg-slate-700 text-white'
                  }`}
                  disabled={isCurrent}
                >
                  {isCurrent ? 'Current Plan' : plan.id === 'free' ? 'Downgrade' : 'Upgrade'}
                </Button>
              </div>
            )
          })}
        </div>

        {/* Features Comparison */}
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-8 mb-16 border border-slate-800">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Feature Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-4 px-4 text-slate-300">Feature</th>
                  <th className="text-center py-4 px-4 text-slate-300">Free</th>
                  <th className="text-center py-4 px-4 text-cyan-400">Pro</th>
                  <th className="text-center py-4 px-4 text-yellow-400">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-800">
                  <td className="py-4 px-4 text-white">Landing Pages</td>
                  <td className="text-center py-4 px-4 text-slate-300">3</td>
                  <td className="text-center py-4 px-4 text-cyan-400">Unlimited</td>
                  <td className="text-center py-4 px-4 text-yellow-400">Unlimited</td>
                </tr>
                <tr className="border-b border-slate-800">
                  <td className="py-4 px-4 text-white">Templates</td>
                  <td className="text-center py-4 px-4 text-slate-300">Basic</td>
                  <td className="text-center py-4 px-4 text-cyan-400">All</td>
                  <td className="text-center py-4 px-4 text-yellow-400">All + Custom</td>
                </tr>
                <tr className="border-b border-slate-800">
                  <td className="py-4 px-4 text-white">Support</td>
                  <td className="text-center py-4 px-4 text-slate-300">Community</td>
                  <td className="text-center py-4 px-4 text-cyan-400">Priority</td>
                  <td className="text-center py-4 px-4 text-yellow-400">Dedicated</td>
                </tr>
                <tr className="border-b border-slate-800">
                  <td className="py-4 px-4 text-white">Custom Domains</td>
                  <td className="text-center py-4 px-4"><X className="w-5 h-5 text-slate-500 mx-auto" /></td>
                  <td className="text-center py-4 px-4"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                  <td className="text-center py-4 px-4"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-white">Team Access</td>
                  <td className="text-center py-4 px-4"><X className="w-5 h-5 text-slate-500 mx-auto" /></td>
                  <td className="text-center py-4 px-4"><X className="w-5 h-5 text-slate-500 mx-auto" /></td>
                  <td className="text-center py-4 px-4"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-8 border border-slate-800">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-3">{faq.question}</h3>
                <p className="text-slate-400 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
