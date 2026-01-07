import { renderTemplate as renderT6 } from '@/templates/t6/server'
import { renderTemplate as renderT7 } from '@/templates/t7/server'
import { renderTemplate as renderT9 } from '@/templates/t9/server'
import { renderTemplate as renderT14 } from '@/templates/t14/server'
import { renderTemplate as renderT15 } from '@/templates/t15/server'
import { renderTemplate as renderT16 } from '@/templates/t16/server'
import { renderTemplate as renderT17 } from '@/templates/t17/server'
import { renderTemplate as renderT18 } from '@/templates/t18/server'
import { renderTemplate as renderT8 } from '@/templates/t8/server'
import { TemplateId, BrandConfig } from '@/lib/types'
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

const templateRenderers: Record<TemplateId, (brand: BrandConfig) => { html: string; css?: string }> = {
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get site with ownership verification
    const { data: site, error } = await supabase
      .from('sites')
      .select(`
        *,
        organizations!inner(owner_user_id)
      `)
      .eq('id', id)
      .eq('organizations.owner_user_id', user.id)
      .single()

    if (error || !site) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: site })

  } catch (error) {
    console.error('Site fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params

    // Auth
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch existing site with ownership verification
    const { data: existing, error: fetchError } = await supabase
      .from('sites')
      .select(`
        *,
        organizations!inner(owner_user_id)
      `)
      .eq('id', id)
      .eq('organizations.owner_user_id', user.id)
      .single()

    if (fetchError || !existing) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 })
    }

    const body = await request.json()

    // Extract updatable fields
    const update: Record<string, unknown> = {}
    if (typeof body.brand_name === 'string') update.brand_name = body.brand_name
    if (typeof body.description === 'string') update.description = body.description
    if (typeof body.headline === 'string') update.headline = body.headline
    if (typeof body.subheadline === 'string') update.subheadline = body.subheadline
    if (typeof body.cta === 'string') update.cta = body.cta
    // Note: ctaUrl passed to renderer but not persisted (no cta_url column yet)
    if (typeof body.logo_url === 'string') update.logo_url = body.logo_url
    
    // Allow direct HTML/CSS updates for rollback functionality
    if (typeof body.generated_html === 'string') update.generated_html = body.generated_html
    if (typeof body.generated_css === 'string') update.generated_css = body.generated_css
    
    // T2 Template specific fields
    if (typeof body.hero_image === 'string') update.hero_image = body.hero_image
    if (typeof body.feature_image1 === 'string') update.feature_image1 = body.feature_image1
    if (typeof body.feature_image2 === 'string') update.feature_image2 = body.feature_image2
    if (body.sections && typeof body.sections === 'object') update.sections = body.sections as Record<string, unknown>

    if (body.colors) {
      if (typeof body.colors.primary === 'string') update.primary_color = body.colors.primary
      if (typeof body.colors.secondary === 'string') update.secondary_color = body.colors.secondary
      if (typeof body.colors.accent === 'string') update.accent_color = body.colors.accent
    }

    // Validate hex colors; if invalid, discard updates and use existing
    const hexRe = /^#[0-9A-F]{6}$/i
    if (update.primary_color && !hexRe.test(update.primary_color as string)) delete update.primary_color
    if (update.secondary_color && !hexRe.test(update.secondary_color as string)) delete update.secondary_color
    if (update.accent_color && !hexRe.test(update.accent_color as string)) delete update.accent_color

    let html: string
    let css: string

    // Check if this is a direct HTML/CSS update (rollback) or needs re-rendering
    if (update.generated_html && update.generated_css) {
      // Direct update - use provided HTML/CSS (rollback scenario)
      html = update.generated_html as string
      css = update.generated_css as string
      console.log('Using direct HTML/CSS update (rollback)')
    } else {
      // Re-render template with updated brand config
      const colors = {
        primary: update.primary_color ?? existing.primary_color ?? '#3B82F6',
        secondary: update.secondary_color ?? existing.secondary_color ?? '#6B7280',
        accent: update.accent_color ?? existing.accent_color ?? '#10B981',
      }

      const brand: BrandConfig = {
        brandName: update.brand_name ?? existing.brand_name ?? 'Brand',
        logoUrl: update.logo_url ?? existing.logo_url ?? undefined,
        colors,
        copy: {
          headline: update.headline ?? existing.headline ?? 'Transform Your Business',
          subheadline: update.subheadline ?? existing.subheadline ?? 'Get started with our amazing service today',
          cta: update.cta ?? existing.cta ?? 'Get Started',
        },
        industry: existing.industry ?? undefined,
        description: update.description ?? existing.description ?? undefined,
        ctaUrl: (typeof body.ctaUrl === 'string' ? body.ctaUrl : undefined) ?? undefined,
        // T2 Template specific fields
        heroImage: update.hero_image ?? existing.hero_image ?? undefined,
        featureImage1: update.feature_image1 ?? existing.feature_image1 ?? undefined,
        featureImage2: update.feature_image2 ?? existing.feature_image2 ?? undefined,
        sections: update.sections ?? existing.sections ?? undefined,
      }
      
      console.log('Built brand config for rendering:', JSON.stringify(brand, null, 2))

      // Choose renderer based on template_id
      // Handle the legacy mapping where T7 templates are stored as T6 in database
      const dbTemplateId = existing.template_id as string
      let actualTemplateId: TemplateId
      
      // Check if this is actually a T7 template stored as T6
      // We can detect this by checking if the generated_html contains T7-specific content
      if (dbTemplateId === 't6' && (
        existing.generated_html?.includes('BONANZA BILLION') ||
        existing.generated_html?.includes('3x3 slot machine') ||
        existing.generated_html?.includes('slotGrid') ||
        existing.generated_html?.includes('slot-grid')
      )) {
        actualTemplateId = 't7'
      } else {
        actualTemplateId = dbTemplateId as TemplateId
      }
      
      console.log(`Database template_id: ${dbTemplateId}, Actual template: ${actualTemplateId}`)
      
      const renderers: Record<TemplateId, (brand: BrandConfig) => { html: string; css?: string }> = {
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

      const renderer = renderers[actualTemplateId] ?? renderT7
      
      try {
        const rendered = renderer(brand)
        html = rendered.html
        css = rendered.css || ''
      } catch (e) {
        console.error(`Template render (PUT) failed for template ${actualTemplateId}:`, e)
        console.error('Brand config that caused error:', JSON.stringify(brand, null, 2))
        
        // Use the original template renderer as fallback instead of generic HTML
        try {
          console.log(`Attempting fallback with renderT6 for template ${actualTemplateId}`)
          const fallback = renderT7(brand)
          html = fallback.html
          css = fallback.css || ''
        } catch (fallbackError) {
          console.error('Even fallback failed:', fallbackError)
          // Last resort: generic HTML
          css = `:root{--brand-primary:${colors.primary};--brand-secondary:${colors.secondary};--brand-accent:${colors.accent};}body{font-family:ui-sans-serif,system-ui;line-height:1.6;color:#111827;margin:0;padding:2rem}.btn{background:var(--brand-primary);color:#fff;padding:.75rem 1.25rem;border-radius:.5rem;border:0;font-weight:600}`
          html = `<!DOCTYPE html><html><head><meta charset=\"utf-8\"/><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"/><title>${brand.brandName}</title><style>${css}</style></head><body><header style=\"display:flex;align-items:center;justify-content:space-between;margin-bottom:2rem\"><div style=\"display:flex;align-items:center;gap:.5rem\">${brand.logoUrl ? `<img src=\"${brand.logoUrl}\" alt=\"${brand.brandName}\" style=\"height:32px\"/>` : ''}<strong>${brand.brandName}</strong></div><button class=\"btn\" onclick=\"window.open('${brand.ctaUrl || '#'}','_blank')\">${brand.copy.cta}</button></header><main style=\"max-width:720px;margin:0 auto;text-align:center\"><h1 style=\"font-size:2rem;font-weight:800;margin-bottom:.75rem\">${brand.copy.headline}</h1><p style=\"color:#6b7280;margin-bottom:1.5rem\">${brand.copy.subheadline}</p><button class=\"btn\">${brand.copy.cta}</button></main></body></html>`
        }
      }
    }

    // Persist updates
    const { data: updated, error: updateError } = await supabase
      .from('sites')
      .update({
        ...update,
        generated_html: html,
        generated_css: css,
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      console.error('Site update error:', updateError)
      return NextResponse.json({ error: 'Failed to update site' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: updated })

  } catch (error) {
    console.error('Site update failure:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
