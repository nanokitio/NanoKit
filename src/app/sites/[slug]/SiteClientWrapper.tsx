'use client'

import { useState, useEffect } from 'react'
import { Template1 } from '@/templates/t1'
import { Template6 } from '@/templates/t6'
import { Template7 } from '@/templates/t7'
import { Template14 } from '@/templates/t14'
import { Template15 } from '@/templates/t15'
import { Template16 } from '@/templates/t16'
import { Template17 } from '@/templates/t17'
import { Template18 } from '@/templates/t18'
import { EditorHelpBot } from '@/components/EditorHelpBot'
import { EditorTour, DEFAULT_TOUR_STEPS } from '@/components/EditorTour'

interface SiteClientWrapperProps {
  templateId: string
  brand: any
}

export default function SiteClientWrapper({ templateId, brand }: SiteClientWrapperProps) {
  const [showTour, setShowTour] = useState(false)
  
  // Show tour only once per user
  useEffect(() => {
    const hasSeenTour = localStorage.getItem('nanokit_editor_tour_seen')
    if (!hasSeenTour) {
      // Small delay to let template render first
      setTimeout(() => setShowTour(true), 1500)
    }
  }, [])

  const handleTourComplete = () => {
    localStorage.setItem('nanokit_editor_tour_seen', 'true')
    setShowTour(false)
  }

  const handleTourSkip = () => {
    localStorage.setItem('nanokit_editor_tour_seen', 'true')
    setShowTour(false)
  }

  // Render the React component based on template ID
  const renderTemplate = () => {
    switch (templateId) {
      case 't1':
        return <Template1 brand={brand} />
      case 't6':
        return <Template6 brand={brand} />
      case 't7':
        return <Template7 brand={brand} />
      case 't14':
        return <Template14 brand={brand} />
      case 't15':
        return <Template15 brand={brand} />
      case 't16':
        return <Template16 brand={brand} />
      case 't17':
        return <Template17 brand={brand} />
      case 't18':
        return <Template18 brand={brand} />
      default:
        return <div>Template not found: {templateId}</div>
    }
  }

  return (
    <>
      {renderTemplate()}
      
      {/* Help Bot - Always visible */}
      <EditorHelpBot />
      
      {/* Tour - Only shown once */}
      {showTour && (
        <EditorTour 
          steps={DEFAULT_TOUR_STEPS}
          onComplete={handleTourComplete}
          onSkip={handleTourSkip}
        />
      )}
    </>
  )
}
