import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { BrandConfig, TemplateId } from '@/lib/types'
import { renderTemplate as renderT6 } from '@/templates/t6/server'
import { renderTemplate as renderT7 } from '@/templates/t7/server'
import { renderTemplate as renderT9 } from '@/templates/t9/server'
import { renderTemplate as renderT14 } from '@/templates/t14/server'
import { renderTemplate as renderT15 } from '@/templates/t15/server'
import { renderTemplate as renderT16 } from '@/templates/t16/server'
import { renderTemplate as renderT17 } from '@/templates/t17/server'
import { renderTemplate as renderT18 } from '@/templates/t18/server'
import { renderTemplate as renderT8 } from '@/templates/t8/server'
const templateRenderers = {
  t6: renderT6,
  t7: renderT7,
  t8: renderT8,
  t9: renderT9,
  t14: renderT14,
  t15: renderT15,
  t16: renderT16,
  t17: renderT17,
  t18: renderT18,
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      siteId, 
      templateId, 
      brandName, 
      industry, 
      description, 
      logoUrl,
      currentColors,
      currentContent,
      regenerationType 
    } = body

    // Verify site ownership
    const { data: site, error: siteError } = await supabase
      .from('sites')
      .select(`
        *,
        organizations!inner(owner_user_id)
      `)
      .eq('id', siteId)
      .eq('organizations.owner_user_id', user.id)
      .single()

    if (siteError || !site) {
      return NextResponse.json({ error: 'Site not found or access denied' }, { status: 404 })
    }

    // Create brand configuration for regeneration
    const brand: BrandConfig = {
      brandName: brandName || 'Brand',
      logoUrl: logoUrl || undefined,
      colors: currentColors || {
        primary: '#3B82F6',
        secondary: '#6B7280',
        accent: '#10B981'
      },
      copy: {
        headline: currentContent?.headline || 'Transform Your Business',
        subheadline: currentContent?.subheadline || 'Get started with our amazing service today',
        cta: currentContent?.cta || 'Get Started',
      },
      industry: industry || undefined,
      description: description || undefined,
      ctaUrl: undefined,
    }

    // Choose renderer based on template_id with legacy mapping handling
    const dbTemplateId = site.template_id as string
    let actualTemplateId: TemplateId
    
    // Handle the legacy mapping where T7 templates are stored as T6 in database
    if (dbTemplateId === 't6' && site.generated_html?.includes('BONANZA BILLION')) {
      actualTemplateId = 't7'
    } else {
      actualTemplateId = dbTemplateId as TemplateId
    }
    
    const rendererMap: Record<TemplateId, (brand: BrandConfig) => { html: string; css?: string }> = {
      t6: renderT6,
      t7: renderT7,
      t8: renderT8,
      t9: renderT9,
      t14: renderT14,
      t15: renderT15,
      t16: renderT16,
      t17: renderT17,
      t18: renderT18,
    }

    const renderer = rendererMap[actualTemplateId] ?? renderT7
    
    // Generate layout variant by modifying the brand config
    // This creates variations in the same template structure
    let variantBrand = { ...brand }
    
    if (regenerationType === 'layout_variant') {
      // Create subtle variations for layout regeneration
      // You can expand this logic to create more sophisticated variations
      const variations = [
        { 
          copy: {
            ...brand.copy,
            headline: `🎯 ${brand.copy.headline}`,
            subheadline: `✨ ${brand.copy.subheadline} Experience the difference today!`
          }
        },
        {
          copy: {
            ...brand.copy,
            headline: `🚀 ${brand.copy.headline}`,
            subheadline: `💎 Premium ${brand.copy.subheadline.toLowerCase()}`
          }
        },
        {
          copy: {
            ...brand.copy,
            headline: `⭐ ${brand.copy.headline} ⭐`,
            subheadline: `🎉 ${brand.copy.subheadline} Join thousands of satisfied customers!`
          }
        }
      ]
      
      // Select a random variation
      const randomVariation = variations[Math.floor(Math.random() * variations.length)]
      variantBrand = { ...brand, ...randomVariation }
    }

    let html: string
    let css: string
    
    try {
      const rendered = renderer(variantBrand)
      html = rendered.html
      css = rendered.css || ''
    } catch (e) {
      console.error(`Template render failed for template ${actualTemplateId}:`, e)
      
      // Fallback to original renderer
      try {
        const fallback = renderT7(variantBrand)
        html = fallback.html
        css = fallback.css || ''
      } catch (fallbackError) {
        console.error('Even fallback failed:', fallbackError)
        return NextResponse.json({ error: 'Template rendering failed' }, { status: 500 })
      }
    }

    // Update the site with new HTML/CSS
    const { data: updatedSite, error: updateError } = await supabase
      .from('sites')
      .update({
        generated_html: html,
        generated_css: css,
        updated_at: new Date().toISOString(),
      })
      .eq('id', siteId)
      .select()
      .single()

    if (updateError) {
      console.error('Site update error:', updateError)
      return NextResponse.json({ error: 'Failed to update site' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      data: updatedSite,
      message: 'Layout variant generated successfully'
    })

  } catch (error) {
    console.error('AI regeneration error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
