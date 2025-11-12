import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { renderTemplate as renderT6 } from '@/templates/t6/server'
import { renderTemplate as renderT7 } from '@/templates/t7/server'
import { renderTemplate as renderT9 } from '@/templates/t9/server'
import { renderTemplate as renderT14 } from '@/templates/t14/server'
import { renderTemplate as renderT15 } from '@/templates/t15/server'
import { renderTemplate as renderT16 } from '@/templates/t16/server'
import { renderTemplate as renderT17 } from '@/templates/t17/server'
import { renderTemplate as renderT18 } from '@/templates/t18/server'
import { injectProtection, addProtectionStyles, applyFullEncryption, shouldEncrypt } from '@/lib/site-protection'

interface SitePageParams {
  slug: string
}

interface SearchParams {
  templateId?: string
  headline?: string
  subheadline?: string
  cta?: string
  ctaUrl?: string
  primaryColor?: string
  secondaryColor?: string
  accentColor?: string
  logoUrl?: string
  popupTitle?: string
  popupMessage?: string
  popupPrize?: string
  gameBalance?: string
  customLogo?: string
  wheelValues?: string
  backgroundColor?: string
  backgroundImage?: string
  featuredPlayer?: string
  sportDirector?: string
  preview?: string  // Flag to disable protections in editor preview
}

export default async function SitePage({ 
  params,
  searchParams 
}: { 
  params: Promise<SitePageParams>
  searchParams: Promise<SearchParams>
}) {
  const supabase = await createClient()
  const { slug } = await params
  const query = await searchParams

  // Get site by slug (allow draft for preview)
  const { data: site, error } = await supabase
    .from('sites')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !site) {
    notFound()
  }

  // If query params exist, regenerate HTML with new values (for live preview)
  let html = site.generated_html
  let css = site.generated_css

  if (Object.keys(query).length > 0) {
    // Use templateId from query params or fall back to site's template_id
    const activeTemplateId = query.templateId || site.template_id
    
    const brandConfig = {
      brandName: site.brand_name,
      logoUrl: query.logoUrl || site.logo_url || '',
      colors: {
        primary: query.primaryColor || site.primary_color || '#4a90e2',
        secondary: query.secondaryColor || site.secondary_color || '#7b68ee',
        accent: query.accentColor || site.accent_color || '#ffd700'
      },
      copy: {
        headline: query.headline || site.headline || 'YOUR TITLE HERE',
        subheadline: query.subheadline || site.subheadline || '',
        cta: query.cta || site.cta || 'PLAY NOW'
      },
      industry: site.industry || 'Casino & Gaming',
      description: site.description || '',
      ctaUrl: query.ctaUrl || site.cta_url || '#',
      popupTitle: query.popupTitle || site.popup_title || 'WINNER!',
      popupMessage: query.popupMessage || site.popup_message || 'Congratulations! You\'ve won!',
      popupPrize: query.popupPrize || site.popup_prize || '$1,000 + 50 FREE SPINS',
      gameBalance: query.gameBalance ? parseInt(query.gameBalance) : (site.game_balance || 1000),
      customLogo: query.customLogo || site.custom_logo || null,
      wheelValues: query.wheelValues || site.wheel_values || '$100, $200, $500, $1000, $2000, $5000, $800, $1500',
      backgroundColor: query.backgroundColor || site.background_color || '#1a1a2e',
      backgroundImage: query.backgroundImage || site.background_image || '',
      featuredPlayer: query.featuredPlayer || site.featured_player || '',
      sportDirector: query.sportDirector || site.sport_director || ''
    } as any

    // Render based on template ID
    let rendered;
    switch (activeTemplateId) {
      case 't6':
        rendered = renderT6(brandConfig);
        break;
      case 't7':
        rendered = renderT7(brandConfig);
        break;
      case 't9':
      case 't4': // Legacy support for t4 as t9
        rendered = renderT9(brandConfig);
        break;
      case 't14':
        rendered = renderT14(brandConfig);
        break;
      case 't15':
        rendered = renderT15(brandConfig);
        break;
      case 't16':
        rendered = renderT16(brandConfig);
        break;
      case 't17':
        rendered = renderT17(brandConfig);
        break;
      case 't18':
        rendered = renderT18(brandConfig);
        break;
      default:
        // Fallback to site's stored HTML if template not found
        rendered = { html: site.generated_html, css: site.generated_css };
    }
    
    html = rendered.html
    css = rendered.css
  }

  // Check if this is editor preview mode (has query params)
  const isEditorPreview = Object.keys(query).length > 0;
  
  // Record visit (analytics) - only for published sites
  if (site.status === 'published' && !isEditorPreview) {
    await supabase
      .from('visits')
      .insert({
        site_id: site.id,
        source: 'direct',
        user_agent: 'server-side-render'
      })
    
    // Apply FULL ENCRYPTION for published sites (NOT in editor preview)
    if (shouldEncrypt(site.status)) {
      const encryptedHTML = applyFullEncryption(
        html,
        css,
        site.user_id || 'anonymous',
        undefined // No domain lock by default
      );
      
      // Return encrypted self-decrypting HTML
      return (
        <div dangerouslySetInnerHTML={{ __html: encryptedHTML }} suppressHydrationWarning />
      );
    }
  }

  // Apply anti-DevTools protection to ALL sites EXCEPT editor iframe
  // Editor iframe has ?preview=1 flag - no blur/protections for smooth editing
  const isEditorIframe = query.preview === '1'
  
  if (!isEditorIframe) {
    // Full protections for standalone preview/published sites
    html = injectProtection(html)
    css = addProtectionStyles(css)
  }
  // else: NO protections in editor iframe - clear view for editing

  // Si el HTML contiene DOCTYPE, extraer solo el contenido del body y estilos
  let bodyContent = html
  let styles = css
  
  if (html.includes('<!DOCTYPE')) {
    // Extraer estilos del <style> en el <head>
    const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i)
    if (styleMatch) {
      styles = styleMatch[1]
    }
    
    // Extraer contenido del <body> CON los scripts incluidos
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
    if (bodyMatch) {
      bodyContent = bodyMatch[1]
    }
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles || '' }} suppressHydrationWarning />
      <div dangerouslySetInnerHTML={{ __html: bodyContent || '' }} suppressHydrationWarning />
    </>
  )
}

export async function generateMetadata({ params }: { params: Promise<SitePageParams> }) {
  const supabase = await createClient()
  const { slug } = await params

  const { data: site } = await supabase
    .from('sites')
    .select('brand_name, headline, description')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!site) {
    return {
      title: 'Site Not Found'
    }
  }

  return {
    title: `${site.brand_name} - ${site.headline}`,
    description: site.description,
  }
}
