import { Template6, renderTemplate as renderT6 } from './t6'
import { Template7, renderTemplate as renderT7 } from './t7'
import { Template9, renderTemplate as renderT9 } from './t9'
import { Template14 } from './t14'
import { Template15 } from './t15'
import { Template16 } from './t16'
import { Template17 } from './t17'
import { Template18 } from './t18'
import { renderTemplate as renderT14 } from './t14/server'
import { renderTemplate as renderT15 } from './t15/server'
import { renderTemplate as renderT16 } from './t16/server'
import { renderTemplate as renderT17 } from './t17/server'
import { renderTemplate as renderT18 } from './t18/server'
import { TemplateDefinition } from '@/lib/types'

export const templates: Record<'t6' | 't7' | 't9' | 't14' | 't15' | 't16' | 't17' | 't18', TemplateDefinition> = {
  t6: {
    id: 't6',
    name: 'Cyber Casino',
    description: 'Futuristic neon-themed casino with cyberpunk aesthetics and digital grid design',
    preview: '/templates/t6-preview.png',
    component: Template6,
    renderTemplate: renderT6,
  },
  t7: {
    id: 't7',
    name: 'Bonanza Billion',
    description: 'Premium 3x3 slot machine with jackpot features and animated bonanza theme',
    preview: '/templates/t7-preview.svg',
    component: Template7,
    renderTemplate: renderT7,
  },
  t9: {
    id: 't9',
    name: 'Fisherman Slot',
    description: 'Ocean-themed slot machine with fishing adventure and interactive reels',
    preview: '/templates/t9-preview.png',
    component: Template9,
    renderTemplate: renderT9,
  },
  t14: {
    id: 't14',
    name: 'Fortune Wheel - Underwater',
    description: 'Interactive spinning wheel game with underwater ocean theme and prize rewards',
    preview: '/templates/t14-preview.png',
    component: Template14,
    renderTemplate: renderT14,
  },
  t15: {
    id: 't15',
    name: 'Fortune Wheel - China',
    description: 'Traditional Chinese themed fortune wheel with lucky prizes and festive design',
    preview: '/templates/t15-preview.png',
    component: Template15,
    renderTemplate: renderT15,
  },
  t16: {
    id: 't16',
    name: 'Fortune Wheel - Christmas',
    description: 'Holiday themed spinning wheel with Christmas decorations and festive prizes',
    preview: '/templates/t16-preview.png',
    component: Template16,
    renderTemplate: renderT16,
  },
  t17: {
    id: 't17',
    name: 'Fortune Wheel - Pirates',
    description: 'Pirate treasure themed fortune wheel with golden prizes and adventure spirit',
    preview: '/templates/t17-preview.png',
    component: Template17,
    renderTemplate: renderT17,
  },
  t18: {
    id: 't18',
    name: 'Big Cash Scratch Card',
    description: 'Interactive scratch card game with 12 chances to win up to $100,000',
    preview: '/templates/t18-preview.png',
    component: Template18,
    renderTemplate: renderT18,
  },
}

export { 
  Template6,
  Template7, 
  Template9,
  Template14,
  Template15,
  Template16,
  Template17,
  Template18,
  renderT6,
  renderT7,
  renderT9,
  renderT14,
  renderT15,
  renderT16,
  renderT17,
  renderT18
}
