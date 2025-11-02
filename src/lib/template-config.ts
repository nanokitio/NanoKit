/**
 * Template Configuration
 * 
 * Define qué campos son editables para cada template.
 * Esto asegura que el sidebar del editor muestre SOLO los campos
 * que el template realmente usa y puede renderizar.
 */

export interface TemplateField {
  id: string
  label: string
  type: 'text' | 'number' | 'url' | 'textarea' | 'color' | 'image'
  placeholder?: string
  description?: string
  required?: boolean
  isPremium?: boolean
}

export interface TemplateConfig {
  id: string
  name: string
  fields: {
    // Basic fields (always available)
    headline?: TemplateField
    subheadline?: TemplateField
    cta?: TemplateField
    ctaUrl?: TemplateField
    
    // Game-specific fields
    gameBalance?: TemplateField
    gameCredit?: TemplateField
    gameTotalBet?: TemplateField
    totalWin?: TemplateField
    wheelValues?: TemplateField
    
    // Customization fields
    customLogo?: TemplateField
    logoUrl?: TemplateField
    
    // Popup/Win modal fields
    popupTitle?: TemplateField
    popupMessage?: TemplateField
    popupPrize?: TemplateField
    
    // Background customization
    backgroundColor?: TemplateField
    backgroundImage?: TemplateField
  }
}

// Template configurations
export const TEMPLATE_CONFIGS: Record<string, TemplateConfig> = {
  t6: {
    id: 't6',
    name: 'Classic Overlay',
    fields: {
      headline: {
        id: 'headline',
        label: 'Game Title',
        type: 'text',
        placeholder: 'YOUR TITLE HERE',
        description: 'Main headline displayed above the game',
        required: true
      },
      subheadline: {
        id: 'subheadline',
        label: 'Subtitle',
        type: 'text',
        placeholder: 'Join thousands of winners...',
        description: 'Secondary text below the title'
      },
      cta: {
        id: 'cta',
        label: 'Button Text',
        type: 'text',
        placeholder: 'PLAY NOW',
        description: 'Call-to-action button text',
        required: true
      },
      ctaUrl: {
        id: 'ctaUrl',
        label: 'Destination URL',
        type: 'url',
        placeholder: 'https://your-casino.com/signup',
        description: 'Where users go when they click the button',
        required: true
      }
    }
  },

  t7: {
    id: 't7',
    name: 'Sweet Bonanza',
    fields: {
      headline: {
        id: 'headline',
        label: 'Game Title',
        type: 'text',
        placeholder: 'WIN BIG WITH BONANZA BILLION SLOTS!',
        description: 'Main headline displayed at the top',
        required: true
      },
      subheadline: {
        id: 'subheadline',
        label: 'Subtitle',
        type: 'text',
        placeholder: 'Premium 3x3 slot machine with life-changing prizes',
        description: 'Secondary text below the title'
      },
      cta: {
        id: 'cta',
        label: 'Button Text',
        type: 'text',
        placeholder: 'SPIN TO WIN',
        description: 'Main action button text',
        required: true
      },
      ctaUrl: {
        id: 'ctaUrl',
        label: 'Destination URL',
        type: 'url',
        placeholder: 'https://your-casino.com/signup',
        description: 'Where users go when they click',
        required: true
      }
    }
  },

  t9: {
    id: 't9',
    name: 'FisherMan Slot',
    fields: {
      headline: {
        id: 'headline',
        label: 'Game Title',
        type: 'text',
        placeholder: 'FISHERMAN SLOT',
        description: 'Main game title',
        required: true
      },
      gameBalance: {
        id: 'gameBalance',
        label: '💰 Game Balance',
        type: 'number',
        placeholder: '1000',
        description: 'Starting balance shown in the game',
        required: false
      },
      ctaUrl: {
        id: 'ctaUrl',
        label: 'Destination URL',
        type: 'url',
        placeholder: 'https://your-casino.com/signup',
        description: 'Where users go after winning',
        required: true
      },
      popupTitle: {
        id: 'popupTitle',
        label: 'Win Popup Title',
        type: 'text',
        placeholder: 'WINNER!',
        description: 'Title shown in the win popup',
        required: false
      },
      popupMessage: {
        id: 'popupMessage',
        label: 'Win Popup Message',
        type: 'textarea',
        placeholder: 'Congratulations! You\'ve won!',
        description: 'Message shown in the win popup',
        required: false
      },
      popupPrize: {
        id: 'popupPrize',
        label: 'Prize Display',
        type: 'text',
        placeholder: '$1,000 + 50 FREE SPINS',
        description: 'Prize amount shown in popup',
        required: false
      }
    }
  },

  t10: {
    id: 't10',
    name: 'FisherMan Slot 2',
    fields: {
      headline: {
        id: 'headline',
        label: 'Game Title',
        type: 'text',
        placeholder: 'FISHERMAN SLOT',
        description: 'Main game title',
        required: true
      },
      gameBalance: {
        id: 'gameBalance',
        label: '💰 Game Balance',
        type: 'number',
        placeholder: '1000',
        description: 'Starting balance shown in the game',
        required: false
      },
      ctaUrl: {
        id: 'ctaUrl',
        label: 'Destination URL',
        type: 'url',
        placeholder: 'https://your-casino.com/signup',
        description: 'Where users go after winning',
        required: true
      },
      popupTitle: {
        id: 'popupTitle',
        label: 'Win Popup Title',
        type: 'text',
        placeholder: 'WINNER!',
        description: 'Title shown in the win popup',
        required: false
      },
      popupMessage: {
        id: 'popupMessage',
        label: 'Win Popup Message',
        type: 'textarea',
        placeholder: 'Congratulations! You\'ve won!',
        description: 'Message shown in the win popup',
        required: false
      },
      popupPrize: {
        id: 'popupPrize',
        label: 'Prize Display',
        type: 'text',
        placeholder: '$1,000 + 50 FREE SPINS',
        description: 'Prize amount shown in popup',
        required: false
      }
    }
  },

  t14: {
    id: 't14',
    name: 'Fortune Wheel - Underwater',
    fields: {
      headline: {
        id: 'headline',
        label: 'Game Title',
        type: 'text',
        placeholder: 'SPIN THE WHEEL',
        description: 'Title displayed above the wheel game',
        required: true
      },
      logoUrl: {
        id: 'logoUrl',
        label: '🎨 Custom Logo URL',
        type: 'url',
        placeholder: 'https://your-site.com/logo.png',
        description: 'Logo displayed in bottom-left corner (replaces Nano Kit logo)',
        required: false
      },
      ctaUrl: {
        id: 'ctaUrl',
        label: 'Claim Bonus URL',
        type: 'url',
        placeholder: 'https://your-casino.com/claim',
        description: 'Where users go after winning',
        required: true
      },
      wheelValues: {
        id: 'wheelValues',
        label: '🎰 Wheel Prize Values',
        type: 'textarea',
        placeholder: '$100, $200, $500, $1000, $2000, $5000, $800, $1500',
        description: 'Comma-separated prize values (8 values for the wheel)',
        required: false
      },
      popupTitle: {
        id: 'popupTitle',
        label: '🏆 Win Modal Title',
        type: 'text',
        placeholder: 'WINNER!',
        description: 'Title in the win popup',
        required: false
      },
      popupMessage: {
        id: 'popupMessage',
        label: '💬 Win Message',
        type: 'text',
        placeholder: 'Congratulations! You won',
        description: 'Message in the win popup',
        required: false
      },
      popupPrize: {
        id: 'popupPrize',
        label: '💰 Prize Display',
        type: 'text',
        placeholder: '$800',
        description: 'Prize shown in popup (overrides wheel value)',
        required: false
      }
    }
  },

  t15: {
    id: 't15',
    name: 'Fortune Wheel - China',
    fields: {
      headline: {
        id: 'headline',
        label: 'Game Title',
        type: 'text',
        placeholder: 'SPIN THE WHEEL',
        description: 'Title displayed above the wheel game',
        required: true
      },
      logoUrl: {
        id: 'logoUrl',
        label: '🎨 Custom Logo URL',
        type: 'url',
        placeholder: 'https://your-site.com/logo.png',
        description: 'Logo displayed in bottom-left corner (replaces Nano Kit logo)',
        required: false
      },
      ctaUrl: {
        id: 'ctaUrl',
        label: 'Claim Bonus URL',
        type: 'url',
        placeholder: 'https://your-casino.com/claim',
        description: 'Where users go after winning',
        required: true
      },
      wheelValues: {
        id: 'wheelValues',
        label: '🎰 Wheel Prize Values',
        type: 'textarea',
        placeholder: '$100, $200, $500, $1000, $2000, $5000, $800, $1500',
        description: 'Comma-separated prize values (8 values for the wheel)',
        required: false
      },
      popupTitle: {
        id: 'popupTitle',
        label: '🏆 Win Modal Title',
        type: 'text',
        placeholder: 'WINNER!',
        description: 'Title in the win popup',
        required: false
      },
      popupMessage: {
        id: 'popupMessage',
        label: '💬 Win Message',
        type: 'text',
        placeholder: 'Congratulations! You won',
        description: 'Message in the win popup',
        required: false
      },
      popupPrize: {
        id: 'popupPrize',
        label: '💰 Prize Display',
        type: 'text',
        placeholder: '$800',
        description: 'Prize shown in popup (overrides wheel value)',
        required: false
      }
    }
  },

  t16: {
    id: 't16',
    name: 'Fortune Wheel - Christmas',
    fields: {
      headline: {
        id: 'headline',
        label: 'Game Title',
        type: 'text',
        placeholder: 'SPIN THE WHEEL',
        description: 'Title displayed above the wheel game',
        required: true
      },
      logoUrl: {
        id: 'logoUrl',
        label: '🎨 Custom Logo URL',
        type: 'url',
        placeholder: 'https://your-site.com/logo.png',
        description: 'Logo displayed in bottom-left corner (replaces Nano Kit logo)',
        required: false
      },
      ctaUrl: {
        id: 'ctaUrl',
        label: 'Claim Bonus URL',
        type: 'url',
        placeholder: 'https://your-casino.com/claim',
        description: 'Where users go after winning',
        required: true
      },
      wheelValues: {
        id: 'wheelValues',
        label: '🎰 Wheel Prize Values',
        type: 'textarea',
        placeholder: '$100, $200, $500, $1000, $2000, $5000, $800, $1500',
        description: 'Comma-separated prize values (8 values for the wheel)',
        required: false
      },
      popupTitle: {
        id: 'popupTitle',
        label: '🏆 Win Modal Title',
        type: 'text',
        placeholder: 'WINNER!',
        description: 'Title in the win popup',
        required: false
      },
      popupMessage: {
        id: 'popupMessage',
        label: '💬 Win Message',
        type: 'text',
        placeholder: 'Congratulations! You won',
        description: 'Message in the win popup',
        required: false
      },
      popupPrize: {
        id: 'popupPrize',
        label: '💰 Prize Display',
        type: 'text',
        placeholder: '$800',
        description: 'Prize shown in popup (overrides wheel value)',
        required: false
      }
    }
  },

  t17: {
    id: 't17',
    name: 'Fortune Wheel - Pirates',
    fields: {
      headline: {
        id: 'headline',
        label: 'Game Title',
        type: 'text',
        placeholder: 'SPIN THE WHEEL',
        description: 'Title displayed above the wheel game',
        required: true
      },
      logoUrl: {
        id: 'logoUrl',
        label: '🎨 Custom Logo URL',
        type: 'url',
        placeholder: 'https://your-site.com/logo.png',
        description: 'Logo displayed in bottom-left corner (replaces Nano Kit logo)',
        required: false
      },
      ctaUrl: {
        id: 'ctaUrl',
        label: 'Claim Bonus URL',
        type: 'url',
        placeholder: 'https://your-casino.com/claim',
        description: 'Where users go after winning',
        required: true
      },
      wheelValues: {
        id: 'wheelValues',
        label: '🎰 Wheel Prize Values',
        type: 'textarea',
        placeholder: '$100, $200, $500, $1000, $2000, $5000, $800, $1500',
        description: 'Comma-separated prize values (8 values for the wheel)',
        required: false
      },
      popupTitle: {
        id: 'popupTitle',
        label: '🏆 Win Modal Title',
        type: 'text',
        placeholder: 'WINNER!',
        description: 'Title in the win popup',
        required: false
      },
      popupMessage: {
        id: 'popupMessage',
        label: '💬 Win Message',
        type: 'text',
        placeholder: 'Congratulations! You won',
        description: 'Message in the win popup',
        required: false
      },
      popupPrize: {
        id: 'popupPrize',
        label: '💰 Prize Display',
        type: 'text',
        placeholder: '$800',
        description: 'Prize shown in popup (overrides wheel value)',
        required: false
      }
    }
  },

  t18: {
    id: 't18',
    name: 'Big Cash Scratch Card',
    fields: {
      headline: {
        id: 'headline',
        label: 'Main Title',
        type: 'text',
        placeholder: 'BIG CASH',
        description: 'Main game title displayed at the top',
        required: true
      },
      subheadline: {
        id: 'subheadline',
        label: 'Prize Text',
        type: 'text',
        placeholder: 'WIN UP TO $100,000!',
        description: 'Prize amount text shown below the title',
        required: true
      },
      cta: {
        id: 'cta',
        label: 'Claim Button Text',
        type: 'text',
        placeholder: 'CLAIM NOW',
        description: 'Button text in the win modal',
        required: true
      },
      ctaUrl: {
        id: 'ctaUrl',
        label: 'Destination URL',
        type: 'url',
        placeholder: 'https://your-casino.com/claim',
        description: 'Where users go when they win and claim',
        required: true
      },
      backgroundColor: {
        id: 'backgroundColor',
        label: '🎨 Background Color',
        type: 'color',
        placeholder: '#1a1a2e',
        description: 'Solid background color (hex code)',
        required: false,
        isPremium: false // Testing phase - will be true later
      },
      backgroundImage: {
        id: 'backgroundImage',
        label: '🖼️ Background Image URL',
        type: 'url',
        placeholder: 'https://example.com/background.jpg',
        description: 'Custom background image (overrides color if set)',
        required: false,
        isPremium: false // Testing phase - will be true later
      }
    }
  }

}

/**
 * Get the configuration for a specific template
 */
export function getTemplateConfig(templateId: string): TemplateConfig | null {
  return TEMPLATE_CONFIGS[templateId] || null
}

/**
 * Get all editable field IDs for a template
 */
export function getTemplateEditableFields(templateId: string): string[] {
  const config = getTemplateConfig(templateId)
  if (!config) return []
  return Object.keys(config.fields)
}

/**
 * Check if a template supports a specific field
 */
export function templateSupportsField(templateId: string, fieldId: string): boolean {
  const config = getTemplateConfig(templateId)
  if (!config) return false
  return fieldId in config.fields
}
