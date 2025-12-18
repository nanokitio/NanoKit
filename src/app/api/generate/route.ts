import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { CreateSiteSchema, TemplateId, BrandConfig } from '@/lib/types'
import { generateMarketingCopy } from '@/lib/openai'
import { extractColorsFromImage } from '@/lib/colors'
import { generateSlug } from '@/lib/utils'
import { renderTemplate as renderT6 } from '@/templates/t6/server'
import { renderTemplate as renderT7 } from '@/templates/t7/server'
import { renderTemplate as renderT9 } from '@/templates/t9/server'
import { renderTemplate as renderT14 } from '@/templates/t14/server'
import { renderTemplate as renderT15 } from '@/templates/t15/server'
import { renderTemplate as renderT16 } from '@/templates/t16/server'
import { renderTemplate as renderT17 } from '@/templates/t17/server'
import { renderTemplate as renderT18 } from '@/templates/t18/server'
const templateRenderers: Record<TemplateId, (brand: BrandConfig) => { html: string; css?: string }> = {
  t6: renderT6,
  t7: renderT7,
  t9: renderT9,
  t14: renderT14,
  t15: renderT15,
  t16: renderT16,
  t17: renderT17,
  t18: renderT18,
}

export async function POST(request: NextRequest) {
  console.log('API /api/generate called')
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    console.log('Auth check - User:', user?.id, 'Error:', authError)
    if (authError || !user) {
      console.log('Authentication failed')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    console.log('Request body:', body)
    const validatedData = CreateSiteSchema.parse(body)
    console.log('Validated data:', validatedData)

    // Extract colors from logo if provided
    let colors = {
      primary: '#3B82F6',
      secondary: '#6B7280',
      accent: '#10B981'
    }

    if (validatedData.logoUrl) {
      try {
        colors = await extractColorsFromImage(validatedData.logoUrl)
      } catch (error) {
        console.warn('Color extraction failed, using defaults:', error)
      }
    }

    // Override with preferred colors if provided
    if (validatedData.preferredColors) {
      colors = {
        ...colors,
        ...validatedData.preferredColors
      }
    }

    // Generate marketing copy with OpenAI
    const copy = await generateMarketingCopy({
      brandName: validatedData.brandName,
      industry: validatedData.industry,
      description: validatedData.description
    })

    // Create brand configuration
    const brandConfig = {
      brandName: validatedData.brandName,
      logoUrl: validatedData.logoUrl || undefined,
      colors,
      copy: {
        headline: copy.headline,
        subheadline: copy.subheadline,
        cta: copy.cta
      },
      industry: validatedData.industry,
      description: validatedData.description,
      ctaUrl: validatedData.ctaUrl || 'https://example.com/signup',
    }

    // Render template based on selected templateId
    const renderer = templateRenderers[validatedData.templateId]
    let html: string
    let css: string
    try {
      const rendered = renderer(brandConfig)
      html = rendered.html
      css = rendered.css || ''
    } catch (e) {
      console.error('Template render failed, using fallback:', e)
      css = `:root{--brand-primary:${colors.primary};--brand-secondary:${colors.secondary};--brand-accent:${colors.accent};}body{font-family:ui-sans-serif,system-ui;line-height:1.6;color:#111827;margin:0;padding:2rem}.btn{background:var(--brand-primary);color:#fff;padding:.75rem 1.25rem;border-radius:.5rem;border:0;font-weight:600}`
      html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><title>${brandConfig.brandName}</title><style>${css}</style></head><body><header style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2rem"><div style="display:flex;align-items:center;gap:.5rem">${brandConfig.logoUrl ? `<img src="${brandConfig.logoUrl}" alt="${brandConfig.brandName}" style="height:32px"/>` : ''}<strong>${brandConfig.brandName}</strong></div><button class="btn" onclick="window.open('${brandConfig.ctaUrl || '#'}','_blank')">${brandConfig.copy.cta}</button></header><main style="max-width:720px;margin:0 auto;text-align:center"><h1 style="font-size:2rem;font-weight:800;margin-bottom:.75rem">${brandConfig.copy.headline}</h1><p style="color:#6b7280;margin-bottom:1.5rem">${brandConfig.copy.subheadline}</p><button class="btn">${brandConfig.copy.cta}</button></main></body></html>`
    }

    // Generate unique slug
    const slug = generateSlug(validatedData.brandName)

    // Ensure user has an organization
    let orgId: string | null = null
    const { data: existingOrg } = await supabase
      .from('organizations')
      .select('id')
      .eq('owner_user_id', user.id)
      .single()

    if (existingOrg) {
      orgId = existingOrg.id
    } else {
      // Create organization for user
      const { data: newOrg, error: orgError } = await supabase
        .from('organizations')
        .insert({
          owner_user_id: user.id,
          name: 'My Organization'
        })
        .select('id')
        .single()

      if (orgError) {
        console.error('Failed to create organization:', orgError)
        console.error('Org error details:', JSON.stringify(orgError, null, 2))
        // Continue without org_id - some databases might not require it
      } else if (newOrg) {
        orgId = newOrg.id
        console.log('Created new organization:', orgId)
      }
    }

    // Map templates to database - store actual template ID
    // The database should accept any template ID as text
    const dbTemplateId = validatedData.templateId
    
    // Generate automatic name if not provided
    const siteName = validatedData.name || `${validatedData.brandName} - ${validatedData.industry} Site`
    
    // Build insert data conditionally
    const insertData: any = {
      name: siteName,
      slug,
      template_id: dbTemplateId,
      logo_url: validatedData.logoUrl,
      primary_color: colors.primary,
      secondary_color: colors.secondary,
      accent_color: colors.accent,
      brand_name: validatedData.brandName,
      industry: validatedData.industry,
      description: validatedData.description,
      headline: copy.headline,
      subheadline: copy.subheadline,
      cta: copy.cta,
      cta_url: validatedData.ctaUrl || 'https://example.com/signup',
      generated_html: html,
      generated_css: css,
      status: 'published' // Set as published by default
    }
    
    // Add user_id and org_id if available
    if (user.id) insertData.user_id = user.id
    if (orgId) insertData.org_id = orgId
    
    console.log('Inserting site with data:', insertData)
    
    const { data: site, error: siteError} = await supabase
      .from('sites')
      .insert(insertData)
      .select()
      .single()

    if (siteError) {
      console.error('Site creation error:', siteError)
      console.error('Site creation error details:', JSON.stringify(siteError, null, 2))
      console.error('Insert data was:', JSON.stringify(insertData, null, 2))
      return NextResponse.json({ 
        error: 'Failed to create site', 
        details: siteError.message,
        code: siteError.code,
        hint: siteError.hint
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: {
        site,
        slug
      }
    })

  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
