'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, MessageSquare, Send, Star, ThumbsUp, ThumbsDown, Lightbulb, Bug } from 'lucide-react'

export default function FeedbackPage() {
  const [feedbackType, setFeedbackType] = useState<'general' | 'bug' | 'feature' | 'rating'>('general')
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [formData, setFormData] = useState({
    email: '',
    subject: '',
    message: '',
    category: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const router = useRouter()

  const feedbackCategories = {
    general: [
      { id: 'general', label: 'General Feedback', icon: MessageSquare },
      { id: 'suggestion', label: 'Suggestion', icon: Lightbulb },
      { id: 'compliment', label: 'Compliment', icon: ThumbsUp }
    ],
    bug: [
      { id: 'ui_bug', label: 'UI Bug', icon: Bug },
      { id: 'functionality', label: 'Functionality Issue', icon: Bug },
      { id: 'performance', label: 'Performance Issue', icon: Bug }
    ],
    feature: [
      { id: 'new_feature', label: 'New Feature Request', icon: Lightbulb },
      { id: 'improvement', label: 'Improvement', icon: ThumbsUp },
      { id: 'integration', label: 'Integration', icon: MessageSquare }
    ]
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // Here you would normally send to your backend
      // For now, we'll simulate a submission
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      console.log('Feedback submitted:', {
        type: feedbackType,
        rating,
        ...formData
      })
      
      setSubmitted(true)
    } catch (error) {
      console.error('Error submitting feedback:', error)
      alert('Error submitting feedback. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleReset = () => {
    setFeedbackType('general')
    setRating(0)
    setFormData({ email: '', subject: '', message: '', category: '' })
    setSubmitted(false)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black text-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <ThumbsUp className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Thank You!</h2>
          <p className="text-slate-300 mb-8">
            Your feedback has been received. We appreciate your input and will use it to improve NanoKit.
          </p>
          <div className="space-y-4">
            <Button
              onClick={handleReset}
              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 w-full"
            >
              Send Another Feedback
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard')}
              className="w-full border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black text-white">
      {/* Header */}
      <header className="relative z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
                Quick Feedback
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-8 shadow-2xl shadow-purple-500/10 border border-slate-800">
          {/* Feedback Type Selection */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">What type of feedback do you have?</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => setFeedbackType('general')}
                className={`p-4 rounded-lg border transition-all ${
                  feedbackType === 'general'
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                    : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <MessageSquare className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm">General</span>
              </button>
              <button
                onClick={() => setFeedbackType('bug')}
                className={`p-4 rounded-lg border transition-all ${
                  feedbackType === 'bug'
                    ? 'bg-red-500/20 border-red-500 text-red-400'
                    : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Bug className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm">Bug Report</span>
              </button>
              <button
                onClick={() => setFeedbackType('feature')}
                className={`p-4 rounded-lg border transition-all ${
                  feedbackType === 'feature'
                    ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                    : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Lightbulb className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm">Feature</span>
              </button>
              <button
                onClick={() => setFeedbackType('rating')}
                className={`p-4 rounded-lg border transition-all ${
                  feedbackType === 'rating'
                    ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400'
                    : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Star className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm">Rating</span>
              </button>
            </div>
          </div>

          {/* Rating Section */}
          {feedbackType === 'rating' && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">How would you rate NanoKit?</h3>
              <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-all"
                  >
                    <Star
                      className={`w-10 h-10 ${
                        star <= (hoveredRating || rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-slate-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-center mt-2 text-slate-400">
                  {rating === 5 && "Excellent! We're thrilled you love it!"}
                  {rating === 4 && "Great! We appreciate your feedback."}
                  {rating === 3 && "Good! We'll keep working to improve."}
                  {rating === 2 && "Thanks! We'd love to know how we can do better."}
                  {rating === 1 && "We're sorry to hear that. Please tell us more."}
                </p>
              )}
            </div>
          )}

          {/* Category Selection */}
          {feedbackType !== 'rating' && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Select a category</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {feedbackCategories[feedbackType].map((category) => {
                  const Icon = category.icon
                  return (
                    <button
                      key={category.id}
                      onClick={() => setFormData({ ...formData, category: category.id })}
                      className={`p-4 rounded-lg border transition-all flex items-center gap-3 ${
                        formData.category === category.id
                          ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                          : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm">{category.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email (optional)
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Subject
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="Brief description of your feedback"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Message
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={6}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                placeholder="Please provide detailed feedback..."
              />
            </div>

            <Button
              type="submit"
              disabled={submitting || (feedbackType === 'rating' && rating === 0)}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4 mr-2" />
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}
