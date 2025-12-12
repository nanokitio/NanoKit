'use client'

import { Template1 } from '@/templates/t1'
import { Template6 } from '@/templates/t6'
import { Template7 } from '@/templates/t7'
import { Template14 } from '@/templates/t14'
import { Template15 } from '@/templates/t15'
import { Template16 } from '@/templates/t16'
import { Template17 } from '@/templates/t17'
import { Template18 } from '@/templates/t18'

interface SiteClientWrapperProps {
  templateId: string
  brand: any
}

export default function SiteClientWrapper({ templateId, brand }: SiteClientWrapperProps) {
  // Render the React component based on template ID
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
