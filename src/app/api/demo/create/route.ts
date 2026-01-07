import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { renderTemplate as renderT6 } from '@/templates/t6/server'
import { renderTemplate as renderT7 } from '@/templates/t7/server'
import { renderTemplate as renderT8 } from '@/templates/t8/server'
import { renderTemplate as renderT9 } from '@/templates/t9/server'

export async function POST(request: NextRequest) {
  try {
    const { templateId, slug } = await request.json()

    if (!templateId || !slug) {
      return NextResponse.json(
        { error: 'Template ID and slug are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Check if demo site already exists
    const { data: existingSite } = await supabase
      .from('sites')
      .select('slug')
      .eq('slug', slug)
      .single()

    // If exists, return it
    if (existingSite) {
      return NextResponse.json({ slug: existingSite.slug })
    }

    // Default brand config for demo
    const brandConfig = {
      brandName: 'Demo Casino',
      logoUrl: '',
      colors: {
        primary: '#4a90e2',
        secondary: '#7b68ee',
        accent: '#ffd700'
      },
      copy: {
        headline: 'WIN BIG TODAY!',
        subheadline: 'Try your luck with our amazing slots',
        cta: 'PLAY NOW'
      },
      industry: 'Casino & Gaming',
      description: 'Demo landing page',
      ctaUrl: 'https://example.com',
      popupTitle: 'WINNER!',
      popupMessage: 'Congratulations! You\'ve won!',
      popupPrize: '$1,000 + 50 FREE SPINS',
      gameBalance: 1000
    }

    // Render template
    let rendered
    switch (templateId) {
      case 't6':
        rendered = renderT6(brandConfig)
        break
      case 't7':
        rendered = renderT7(brandConfig)
        break
      case 't8':
        rendered = renderT8(brandConfig)
        break
      case 't9':
        rendered = renderT9(brandConfig)
        break
      default:
        return NextResponse.json(
          { error: 'Invalid template ID' },
          { status: 400 }
        )
    }

    // Create demo site in database (without user_id for public access)
    const { data: newSite, error } = await supabase
      .from('sites')
      .insert({
        slug,
        template_id: templateId,
        brand_name: brandConfig.brandName,
        headline: brandConfig.copy.headline,
        subheadline: brandConfig.copy.subheadline,
        cta: brandConfig.copy.cta,
        cta_url: brandConfig.ctaUrl,
        primary_color: brandConfig.colors.primary,
        secondary_color: brandConfig.colors.secondary,
        accent_color: brandConfig.colors.accent,
        logo_url: brandConfig.logoUrl,
        generated_html: rendered.html,
        generated_css: rendered.css,
        status: 'draft',
        industry: brandConfig.industry,
        description: brandConfig.description,
        popup_title: brandConfig.popupTitle,
        popup_message: brandConfig.popupMessage,
        popup_prize: brandConfig.popupPrize,
        game_balance: brandConfig.gameBalance,
        vertical: 'casino',
        is_demo: true // Mark as demo site
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating demo site:', error)
      return NextResponse.json(
        { error: 'Failed to create demo site', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ slug: newSite.slug })

  } catch (error: any) {
    console.error('Demo creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create demo', details: error?.message },
      { status: 500 }
    )
  }
}
