import React, { useEffect, useState, useRef } from 'react'
import { X, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TemplateId } from '@/lib/types'
import { Template6 } from '@/templates/t6'
import { Template7 } from '@/templates/t7'
import { Template8 } from '@/templates/t8'
import { Template9 } from '@/templates/t9'
import { Template14 } from '@/templates/t14'
import { Template15 } from '@/templates/t15'
import { Template16 } from '@/templates/t16'
import { Template17 } from '@/templates/t17'
import { Template18 } from '@/templates/t18'

interface TemplatePreviewModalProps {
  templateId: TemplateId | null
  isOpen: boolean
  onClose: () => void
  onSelect?: (templateId: TemplateId) => void
}

const getSampleBrandConfig = (templateId: TemplateId) => {
  // Scratch Card template (t18)
  if (templateId === 't18') {
    return {
      brandName: 'Big Cash Casino',
      logoUrl: 'https://via.placeholder.com/150x60/FFD700/000000?text=CASINO',
      colors: {
        primary: '#ff0000',
        secondary: '#ffcc00',
        accent: '#ff6600'
      },
      copy: {
        headline: 'BIG CASH',
        subheadline: 'WIN UP TO $100,000!',
        cta: 'CLAIM NOW'
      },
      industry: 'Casino & Gaming',
      description: 'Interactive scratch card game',
      ctaUrl: 'https://example.com'
    }
  }
  
  // Fortune Wheel templates (t14-t17)
  if (templateId === 't14' || templateId === 't15' || templateId === 't16' || templateId === 't17') {
    return {
      brandName: 'Fortune Casino',
      logoUrl: 'https://via.placeholder.com/150x60/FFD700/000000?text=CASINO',
      colors: {
        primary: '#ffd700',
        secondary: '#ff6b6b',
        accent: '#4ecdc4'
      },
      copy: {
        headline: 'SPIN THE WHEEL TO WIN!',
        subheadline: 'Try your luck and win amazing prizes',
        cta: 'CLAIM BONUS'
      },
      industry: 'Casino & Gaming',
      description: 'Interactive wheel of fortune game',
      ctaUrl: 'https://example.com'
    }
  }
  
  // Fisherman Slot specific config (t9)
  if (templateId === 't9') {
    return {
      brandName: 'Ocean Casino',
      logoUrl: 'https://via.placeholder.com/150x60/4F46E5/FFFFFF?text=CASINO',
      colors: {
        primary: '#4a90e2',
        secondary: '#7b68ee',
        accent: '#ffd700'
      },
      copy: {
        headline: 'WIN BIG WITH FISHERMAN SLOT!',
        subheadline: 'Cast your line and reel in massive prizes',
        cta: 'CLAIM BONUS NOW!'
      },
      industry: 'Casino & Gaming',
      description: 'Exciting fishing-themed slot game',
      ctaUrl: 'https://example.com',
      // T10 specific
      primaryColor: '#1db954',
      accentColor: '#f5c400',
      bgColor: '#07131f',
      ctaText: 'Claim Bonus',
      winTitle: '🎉 You\'ve won a bonus!',
      winMessage: 'Spin completed. Unlock your reward now.'
    }
  }
  
  // Default config for other templates
  return {
    brandName: 'Sample Brand',
    logoUrl: 'https://via.placeholder.com/150x60/4F46E5/FFFFFF?text=LOGO',
    colors: {
      primary: '#00ffff',
      secondary: '#ff1493',
      accent: '#ffff00'
    },
    copy: {
      headline: 'Welcome to Our Amazing Platform',
      subheadline: 'Experience the future of digital innovation with our cutting-edge solutions',
      cta: 'Get Started Now'
    },
    industry: 'Technology',
    description: 'A sample brand for preview purposes',
    ctaUrl: 'https://example.com'
  }
}

const templateComponents = {
  t6: Template6,
  t7: Template7,
  t8: Template8,
  t9: Template9,
  t14: Template14,
  t15: Template15,
  t16: Template16,
  t17: Template17,
  t18: Template18,
}

export function TemplatePreviewModal({ templateId, isOpen, onClose, onSelect }: TemplatePreviewModalProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [showScrollButtons, setShowScrollButtons] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && templateId) {
      setIsLoading(true)
      // Reduce loading time to minimize blinking
      const timer = setTimeout(() => setIsLoading(false), 100)
      return () => clearTimeout(timer)
    }
  }, [isOpen, templateId])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  // Check if content is scrollable and show scroll buttons
  useEffect(() => {
    const checkScrollable = () => {
      if (contentRef.current) {
        const { scrollHeight, clientHeight } = contentRef.current
        setShowScrollButtons(scrollHeight > clientHeight)
      }
    }

    if (!isLoading && isOpen) {
      // Check after a short delay to ensure content is rendered
      const timer = setTimeout(checkScrollable, 100)
      return () => clearTimeout(timer)
    }
  }, [isLoading, isOpen])

  const scrollToTop = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const scrollToBottom = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: contentRef.current.scrollHeight, behavior: 'smooth' })
    }
  }

  if (!isOpen || !templateId) return null

  const TemplateComponent = templateComponents[templateId]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] mx-4 flex flex-col overflow-hidden">
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-50 p-2 bg-gray-900/80 hover:bg-gray-900 text-white rounded-full transition-all duration-200 shadow-lg backdrop-blur-sm"
          title="Close Preview"
        >
          <X size={18} />
        </button>
        
        {/* Minimal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-medium text-gray-700">Template Preview</h2>
          </div>
          {onSelect && (
            <Button
              onClick={() => {
                onSelect(templateId)
                onClose()
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Use This Template
            </Button>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 relative bg-gray-50">
          <style jsx>{`
            .preview-scrollbar {
              scrollbar-width: auto !important;
              scrollbar-color: #3b82f6 #e5e7eb !important;
              overflow-y: scroll !important;
            }
            .preview-scrollbar::-webkit-scrollbar {
              width: 12px !important;
              display: block !important;
            }
            .preview-scrollbar::-webkit-scrollbar-track {
              background: #e5e7eb !important;
              border-radius: 6px !important;
            }
            .preview-scrollbar::-webkit-scrollbar-thumb {
              background: #3b82f6 !important;
              border-radius: 6px !important;
              border: 2px solid #e5e7eb !important;
              min-height: 30px !important;
            }
            .preview-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #2563eb !important;
            }
            .template-container {
              transform-origin: top center;
              transform: scale(0.8);
              width: 125%;
              margin-left: -12.5%;
              transition: none;
            }
          `}</style>
          
          <div 
            ref={contentRef} 
            className="w-full h-full preview-scrollbar"
            style={{ 
              scrollBehavior: 'smooth',
              overflowY: 'scroll'
            }}
          >
            <div className="template-container">
              {isLoading ? (
                <div className="flex items-center justify-center h-96">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <TemplateComponent brand={getSampleBrandConfig(templateId)} />
              )}
            </div>
          </div>
          
          {/* Elegant Scroll Indicator */}
          {showScrollButtons && !isLoading && (
            <div className="absolute bottom-6 right-6 flex flex-col gap-2">
              <button
                onClick={scrollToTop}
                className="p-2 bg-white/90 hover:bg-white text-gray-700 rounded-lg shadow-lg transition-all duration-200 backdrop-blur-sm border border-gray-200"
                title="Scroll to Top"
              >
                <ChevronUp size={16} />
              </button>
              <button
                onClick={scrollToBottom}
                className="p-2 bg-white/90 hover:bg-white text-gray-700 rounded-lg shadow-lg transition-all duration-200 backdrop-blur-sm border border-gray-200"
                title="Scroll to Bottom"
              >
                <ChevronDown size={16} />
              </button>
            </div>
          )}
          
          {/* Subtle Scroll Hint */}
          {showScrollButtons && !isLoading && (
            <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm text-gray-600 px-3 py-1 rounded-lg text-xs border border-gray-200 shadow-sm">
              Scroll to explore
            </div>
          )}
        </div>

        {/* Clean Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-white/95 backdrop-blur-sm">
          <p className="text-xs text-gray-500 text-center">
            Preview with sample content • Your brand details will be applied when generating
          </p>
        </div>
      </div>
    </div>
  )
}
