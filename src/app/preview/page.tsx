'use client'

import { useSearchParams } from 'next/navigation'
import { Template6 } from '@/templates/t6'
import { Template7 } from '@/templates/t7'
import { Template9 } from '@/templates/t9'
import { Template14 } from '@/templates/t14'
import { Template15 } from '@/templates/t15'
import { Template16 } from '@/templates/t16'
import { Template17 } from '@/templates/t17'
import { Template18 } from '@/templates/t18'
import { BrandConfig } from '@/lib/types'

export default function PreviewPage() {
  const searchParams = useSearchParams()
  
  // Get all parameters from URL
  const templateId = searchParams.get('templateId') || 't6'
  const headline = searchParams.get('headline') || 'YOUR TITLE HERE'
  const subheadline = searchParams.get('subheadline') || ''
  const cta = searchParams.get('cta') || 'PLAY NOW'
  const ctaUrl = searchParams.get('ctaUrl') || '#'
  const primaryColor = searchParams.get('primaryColor') || '#4a90e2'
  const secondaryColor = searchParams.get('secondaryColor') || '#7b68ee'
  const accentColor = searchParams.get('accentColor') || '#ffd700'
  const logoUrl = searchParams.get('logoUrl') || ''
  const popupTitle = searchParams.get('popupTitle') || 'WINNER!'
  const popupMessage = searchParams.get('popupMessage') || "Congratulations! You've won!"
  const popupPrize = searchParams.get('popupPrize') || '$1,000 + 50 FREE SPINS'
  const gameBalance = parseInt(searchParams.get('gameBalance') || '1000')
  const wheelValues = searchParams.get('wheelValues') || '$100, $200, $500, $1000, $2000, $5000, $800, $1500'
  const backgroundColor = searchParams.get('backgroundColor') || '#1a1a2e'
  const backgroundImage = searchParams.get('backgroundImage') || ''
  const editable = searchParams.get('editable') === '1'
  const brandName = searchParams.get('brandName') || 'Demo Casino'
  
  // Build brand config
  const brand: BrandConfig = {
    brandName,
    logoUrl,
    colors: {
      primary: primaryColor,
      secondary: secondaryColor,
      accent: accentColor
    },
    copy: {
      headline,
      subheadline,
      cta
    },
    industry: 'Casino & Gaming',
    description: '',
    ctaUrl,
    popupTitle,
    popupMessage,
    popupPrize,
    gameBalance,
    customLogo: null,
    wheelValues,
    backgroundColor,
    backgroundImage,
    editable  // This enables inline editing
  }
  
  // Render the appropriate template
  const renderTemplate = () => {
    switch(templateId) {
      case 't6':
        return <Template6 brand={brand} />
      case 't7':
        return <Template7 brand={brand} />
      case 't9':
        return <Template9 brand={brand} />
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
        return <Template6 brand={brand} />
    }
  }
  
  return (
    <div className="w-full h-screen overflow-auto">
      {renderTemplate()}
    </div>
  )
}
