'use client'

import { useState, useEffect, useRef } from 'react'
import { X, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react'

interface TourStep {
  target: string
  title: string
  content: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  icon?: string
}

// Default tour steps for the editor
export const DEFAULT_TOUR_STEPS: TourStep[] = [
  {
    target: '[data-editable="true"]',
    title: '✏️ Textos Editables',
    content: 'Los textos con borde punteado son editables. Haz clic en cualquiera para cambiar el texto, color, fuente y más.',
    position: 'bottom',
    icon: '✏️'
  },
  {
    target: '.editable-text',
    title: '🎨 Personaliza Todo',
    content: 'Al hacer clic en un texto, aparecerá una barra con opciones: fuente, tamaño, negrita, color y alineación.',
    position: 'bottom',
    icon: '🎨'
  },
  {
    target: 'iframe',
    title: '👀 Vista Previa en Vivo',
    content: 'Aquí ves tu template en tiempo real. Todos los cambios se reflejan instantáneamente.',
    position: 'left',
    icon: '👀'
  }
]

interface EditorTourProps {
  steps?: TourStep[]
  onComplete: () => void
  onSkip: () => void
}

export function EditorTour({ steps = DEFAULT_TOUR_STEPS, onComplete, onSkip }: EditorTourProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const [highlightPosition, setHighlightPosition] = useState({ top: 0, left: 0, width: 0, height: 0 })
  const tooltipRef = useRef<HTMLDivElement>(null)
  const tourSteps = steps || DEFAULT_TOUR_STEPS
  const step = tourSteps[currentStep]

  useEffect(() => {
    updatePositions()
    window.addEventListener('resize', updatePositions)
    window.addEventListener('scroll', updatePositions)
    return () => {
      window.removeEventListener('resize', updatePositions)
      window.removeEventListener('scroll', updatePositions)
    }
  }, [currentStep])

  const updatePositions = () => {
    const targetElement = document.querySelector(step.target)
    if (!targetElement) return

    const rect = targetElement.getBoundingClientRect()
    const padding = 8

    // Posición del highlight
    setHighlightPosition({
      top: rect.top + window.scrollY - padding,
      left: rect.left + window.scrollX - padding,
      width: rect.width + padding * 2,
      height: rect.height + padding * 2
    })

    // Posición del tooltip
    const tooltipHeight = 200
    const tooltipWidth = 350
    let top = 0
    let left = 0

    switch (step.position || 'bottom') {
      case 'top':
        top = rect.top + window.scrollY - tooltipHeight - 20
        left = rect.left + window.scrollX + (rect.width / 2) - (tooltipWidth / 2)
        break
      case 'bottom':
        top = rect.bottom + window.scrollY + 20
        left = rect.left + window.scrollX + (rect.width / 2) - (tooltipWidth / 2)
        break
      case 'left':
        top = rect.top + window.scrollY + (rect.height / 2) - (tooltipHeight / 2)
        left = rect.left + window.scrollX - tooltipWidth - 20
        break
      case 'right':
        top = rect.top + window.scrollY + (rect.height / 2) - (tooltipHeight / 2)
        left = rect.right + window.scrollX + 20
        break
    }

    // Asegurar que el tooltip esté dentro de la ventana
    if (left < 10) left = 10
    if (left + tooltipWidth > window.innerWidth - 10) left = window.innerWidth - tooltipWidth - 10
    if (top < 10) top = 10

    setTooltipPosition({ top, left })

    // Scroll al elemento
    targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <>
      {/* Overlay oscuro */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          zIndex: 9998,
          pointerEvents: 'none'
        }}
      />

      {/* Highlight del elemento */}
      <div
        style={{
          position: 'absolute',
          top: highlightPosition.top,
          left: highlightPosition.left,
          width: highlightPosition.width,
          height: highlightPosition.height,
          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.75), 0 0 20px rgba(59, 130, 246, 0.5)',
          borderRadius: '8px',
          zIndex: 9999,
          pointerEvents: 'none',
          transition: 'all 0.3s ease',
          border: '3px solid #3b82f6'
        }}
      />

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        style={{
          position: 'absolute',
          top: tooltipPosition.top,
          left: tooltipPosition.left,
          width: '350px',
          backgroundColor: '#1f2937',
          color: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
          zIndex: 10000,
          transition: 'all 0.3s ease',
          border: '2px solid #3b82f6'
        }}
      >
        <button
          onClick={onSkip}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'transparent',
            border: 'none',
            color: '#9ca3af',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          <X className="w-5 h-5" />
        </button>

        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: 700, 
            marginBottom: '8px',
            color: '#60a5fa'
          }}>
            {step.title}
          </h3>
          <p style={{ 
            fontSize: '14px', 
            lineHeight: '1.6',
            color: '#d1d5db'
          }}>
            {step.content}
          </p>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '20px'
        }}>
          <div style={{ 
            fontSize: '12px', 
            color: '#9ca3af',
            fontWeight: 600
          }}>
            {currentStep + 1} / {tourSteps.length}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {currentStep > 0 && (
              <button
                onClick={handlePrevious}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  backgroundColor: '#374151',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 600
                }}
              >
                <ArrowLeft className="w-4 h-4" />
                Anterior
              </button>
            )}
            
            <button
              onClick={handleNext}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 600
              }}
            >
              {currentStep === tourSteps.length - 1 ? '¡Entendido!' : 'Siguiente'}
              {currentStep < tourSteps.length - 1 && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
