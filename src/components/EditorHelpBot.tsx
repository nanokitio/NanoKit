'use client'

import { useState } from 'react'
import { HelpCircle, X, MessageCircle, ChevronRight, Send } from 'lucide-react'

interface FAQ {
  question: string
  answer: string
  category: 'editing' | 'templates' | 'colors' | 'general'
}

const FAQS: FAQ[] = [
  // Editing
  {
    question: 'How do I edit text?',
    answer: 'Click directly on any text with a dashed border. An editor will open with font, size, color, and more options.',
    category: 'editing'
  },
  {
    question: 'How do I change text color?',
    answer: 'When editing text, click on the palette icon 🎨 in the toolbar. You can choose preset colors or select any color from the spectrum.',
    category: 'editing'
  },
  {
    question: 'How do I change the font?',
    answer: 'In the editing bar, click on the font name (e.g., "Default") to see all available fonts. Select the one you like best.',
    category: 'editing'
  },
  {
    question: 'How do I change text size?',
    answer: 'In the editing bar, click on the size number (e.g., "48") to see all available sizes.',
    category: 'editing'
  },
  {
    question: 'How do I save my changes?',
    answer: 'Changes are saved automatically. You can also click ✓ (green check) or press Enter to confirm.',
    category: 'editing'
  },
  {
    question: 'How do I cancel an edit?',
    answer: 'Click ✗ (red X) or press Escape to cancel and return to the original text.',
    category: 'editing'
  },
  // Templates
  {
    question: 'How do I change templates?',
    answer: 'In the left panel, find the "Template" section and select the design you prefer from the list.',
    category: 'templates'
  },
  {
    question: 'What is the Fortune Wheel?',
    answer: 'It\'s an interactive wheel of fortune game. Users can spin the wheel and win prizes. Ideal for lead capture.',
    category: 'templates'
  },
  {
    question: 'What is the Scratch Card?',
    answer: 'It\'s a scratch and win game. Users scratch the boxes to discover if they won a prize. Very effective for conversions.',
    category: 'templates'
  },
  // Colors
  {
    question: 'How do I change template colors?',
    answer: 'In the left panel, find the "Colors" section. You can change the primary, secondary, and accent colors of the entire template.',
    category: 'colors'
  },
  {
    question: 'Can I use my brand colors?',
    answer: 'Yes, use the color picker to enter your brand\'s exact hexadecimal code (e.g., #FF5500).',
    category: 'colors'
  },
  // General
  {
    question: 'How do I upload my logo?',
    answer: 'In the left panel, find the logo section and click to upload an image. We recommend PNG format with transparent background.',
    category: 'general'
  },
  {
    question: 'How do I publish my site?',
    answer: 'Once satisfied with your design, click the "Publish" button at the top. Your site will be available immediately.',
    category: 'general'
  },
  {
    question: 'Can I preview on mobile?',
    answer: 'Yes, use the view buttons (desktop/mobile) at the top of the editor to see how it will look on different devices.',
    category: 'general'
  },
]

const CATEGORIES = [
  { id: 'all', label: 'All', icon: '📚' },
  { id: 'editing', label: 'Text Editing', icon: '✏️' },
  { id: 'templates', label: 'Templates', icon: '🎨' },
  { id: 'colors', label: 'Colors', icon: '🌈' },
  { id: 'general', label: 'General', icon: '⚙️' },
]

export function EditorHelpBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredFaqs = FAQS.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <>
      {/* Help Button - Fixed position, moved up on mobile to avoid overlap */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-[9999] w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 md:hover:scale-110 flex items-center justify-center"
        title="Need help?"
      >
        <HelpCircle className="w-6 h-6 md:w-7 md:h-7 text-white" />
        <span className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-green-400 rounded-full animate-pulse" />
      </button>

      {/* Help Panel - Full screen on mobile */}
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-end md:items-center justify-center md:p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panel - Full width on mobile, slides up from bottom */}
          <div className="relative bg-slate-900 md:rounded-2xl rounded-t-2xl shadow-2xl w-full md:max-w-lg max-h-[90vh] md:max-h-[80vh] overflow-hidden border-t md:border border-slate-700">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-lg">Help Center</h2>
                    <p className="text-white/70 text-sm">How can I help you?</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-slate-700">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-800 text-white rounded-lg px-4 py-3 pl-10 outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
                />
                <Send className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>

            {/* Categories */}
            <div className="p-3 border-b border-slate-700 overflow-x-auto">
              <div className="flex gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* FAQ List */}
            <div className="overflow-y-auto max-h-[40vh] p-4 space-y-2">
              {filteredFaqs.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <p>No results found for your search.</p>
                  <p className="text-sm mt-2">Try different keywords.</p>
                </div>
              ) : (
                filteredFaqs.map((faq, index) => (
                  <div
                    key={index}
                    className="bg-slate-800 rounded-lg overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-700/50 transition-colors"
                    >
                      <span className="text-white font-medium pr-4">{faq.question}</span>
                      <ChevronRight 
                        className={`w-5 h-5 text-slate-400 transition-transform flex-shrink-0 ${
                          expandedFaq === index ? 'rotate-90' : ''
                        }`}
                      />
                    </button>
                    {expandedFaq === index && (
                      <div className="px-4 pb-4 pt-0">
                        <div className="bg-slate-900/50 rounded-lg p-3 text-slate-300 text-sm leading-relaxed">
                          {faq.answer}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-700 bg-slate-800/50">
              <p className="text-slate-400 text-xs text-center">
                💡 Tip: Text with a <span className="text-cyan-400">dashed border</span> is editable. Just click!
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
