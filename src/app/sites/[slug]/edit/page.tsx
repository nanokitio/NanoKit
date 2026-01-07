'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Save, Eye, ArrowLeft, Palette, Type, Image as ImageIcon, Link as LinkIcon, ChevronDown, ChevronUp, Layers, FileText, Scale, Download, Mail, Globe, Monitor, Smartphone, Undo2, Redo2, Edit3, X, ChevronLeft, ChevronRight, Dices, Trophy, TrendingUp, Bitcoin, ShoppingBag, DollarSign, Heart, MoreHorizontal, Users, Settings, Wallet, Gift } from 'lucide-react'
import { NanoKitLogo } from '@/components/NanoKitLogo'
import { EditorTour } from '@/components/EditorTour'
import { getTemplateConfig, templateSupportsField } from '@/lib/template-config'
import ScreenshotProtection from '@/components/ScreenshotProtection'

interface SiteData {
  id: string
  name?: string
  slug: string
  template_id: string
  brand_name: string
  headline: string
  subheadline: string
  cta: string
  primary_color: string
  secondary_color: string
  accent_color: string
  logo_url: string | null
  cta_url: string | null
  generated_html: string
  is_downloaded?: boolean
  is_published?: boolean
  downloaded_at?: string
  published_at?: string
  download_count?: number
}

export default function SiteEditorPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  
  const [showArchived, setShowArchived] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const supabase = createClient()
  
  const [site, setSite] = useState<SiteData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    vertical: false,
    template: false,
    logo: false,
    content: false,
    colors: false,
    legal: false,
    siteSettings: true
  })
  
  // Editable fields
  const [headline, setHeadline] = useState('')
  const [subheadline, setSubheadline] = useState('')
  const [cta, setCta] = useState('')
  const [ctaUrl, setCtaUrl] = useState('')
  const [primaryColor, setPrimaryColor] = useState('#4a90e2')
  const [secondaryColor, setSecondaryColor] = useState('#7b68ee')
  const [accentColor, setAccentColor] = useState('#ffd700')
  const [logoUrl, setLogoUrl] = useState('')
  const [popupTitle, setPopupTitle] = useState('')
  const [popupMessage, setPopupMessage] = useState('')
  const [popupPrize, setPopupPrize] = useState('')
  const [wheelValues, setWheelValues] = useState('')
  const [gameBalance, setGameBalance] = useState(1000)
  const [gameLogo, setGameLogo] = useState('')
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [showWinPopupEditor, setShowWinPopupEditor] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadingBackground, setUploadingBackground] = useState(false)
  const [vertical, setVertical] = useState('casino')
  const [backgroundColor, setBackgroundColor] = useState('#1a1a2e')
  const [backgroundImage, setBackgroundImage] = useState('')
  const [templateId, setTemplateId] = useState('t6')
  const [termsUrl, setTermsUrl] = useState('')
  const [privacyUrl, setPrivacyUrl] = useState('')
  const [responsibleGamingUrl, setResponsibleGamingUrl] = useState('')
  const [previewMode, setPreviewMode] = useState<'live' | 'template'>('live')
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop')
  const [showTour, setShowTour] = useState(false)
  const [showDownloadModal, setShowDownloadModal] = useState(false)
  const [downloadEmail, setDownloadEmail] = useState('')
  const [downloading, setDownloading] = useState(false)
  const [affiliateCode, setAffiliateCode] = useState('')
  const [domainLock, setDomainLock] = useState('')
  const [featuredPlayer, setFeaturedPlayer] = useState('')
  const [sportDirector, setSportDirector] = useState('')
  const [brandName, setBrandName] = useState('')
  const [siteName, setSiteName] = useState('')
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [history, setHistory] = useState<any[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [customStyles, setCustomStyles] = useState<Record<string, any>>({})

  // Listen for content AND style changes from iframe (inline editing)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Handle text content changes
      if (event.data?.type === 'CONTENT_CHANGE') {
        const { field, value } = event.data;
        switch (field) {
          case 'headline':
            setHeadline(value);
            break;
          case 'subheadline':
            setSubheadline(value);
            break;
          case 'cta':
            setCta(value);
            break;
        }
      }
      
      // Handle style changes for persistence
      if (event.data?.type === 'STYLE_CHANGE') {
        const { field, value, styles } = event.data;
        console.log('Style change received:', field, styles);
        
        // Update the text value
        switch (field) {
          case 'headline':
            setHeadline(value);
            break;
          case 'subheadline':
            setSubheadline(value);
            break;
          case 'cta':
            setCta(value);
            break;
        }
        
        // Save styles for persistence
        setCustomStyles(prev => ({
          ...prev,
          [field]: { value, styles }
        }));
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Save state to history whenever key fields change
  useEffect(() => {
    const currentState = {
      headline,
      subheadline,
      cta,
      ctaUrl,
      primaryColor,
      secondaryColor,
      accentColor,
      logoUrl,
      backgroundColor,
      backgroundImage
    }

    // Don't save to history if we're navigating through history
    if (historyIndex >= 0 && historyIndex < history.length - 1) {
      return
    }

    // Only add to history if something actually changed
    const lastState = history[history.length - 1]
    if (lastState && JSON.stringify(lastState) === JSON.stringify(currentState)) {
      return
    }

    // Add to history (limit to 50 states)
    setHistory(prev => [...prev.slice(-49), currentState])
    setHistoryIndex(prev => prev + 1)
  }, [headline, subheadline, cta, ctaUrl, primaryColor, secondaryColor, accentColor, logoUrl, backgroundColor, backgroundImage])

  const toggleSection = (section: 'vertical' | 'template' | 'logo' | 'content' | 'colors' | 'legal' | 'siteSettings') => {
    const isExpanding = !expandedSections[section]
    
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
    
    // Switch to template preview mode when template section is expanded
    if (section === 'template' && isExpanding) {
      setPreviewMode('template')
    }
    
    // Switch back to live preview when other sections are expanded
    if (section !== 'template' && isExpanding && previewMode === 'template') {
      setPreviewMode('live')
    }
  }

  const collapseAll = () => {
    setExpandedSections({
      vertical: false,
      template: false,
      logo: false,
      content: false,
      colors: false,
      legal: false,
      siteSettings: false
    })
  }

  const expandAll = () => {
    setExpandedSections({
      vertical: true,
      template: true,
      logo: true,
      content: true,
      colors: true,
      legal: true,
      siteSettings: true
    })
  }

  const areAllExpanded = Object.values(expandedSections).every(val => val === true)
  const areAllCollapsed = Object.values(expandedSections).every(val => val === false)

  useEffect(() => {
    loadSite()
    
    // Verificar si es la primera vez que el usuario ve el editor
    const hasSeenTour = localStorage.getItem('hasSeenEditorTour')
    if (!hasSeenTour) {
      // Esperar a que se cargue la página antes de mostrar el tour
      setTimeout(() => setShowTour(true), 1000)
    }
  }, [slug])

  const handleTourComplete = () => {
    localStorage.setItem('hasSeenEditorTour', 'true')
    setShowTour(false)
  }

  const handleTourSkip = () => {
    localStorage.setItem('hasSeenEditorTour', 'true')
    setShowTour(false)
  }

  const tourSteps = [
    {
      target: '[data-tour="quick-actions"]',
      title: 'Quick Actions Panel',
      content: 'Here you can expand or collapse all editor sections with a single click.',
      position: 'right' as const
    },
    {
      target: '[data-tour="template-section"]',
      title: 'Template Selection',
      content: 'Choose from different pre-designed templates for your landing page. Each template has a unique style.',
      position: 'right' as const
    },
    {
      target: '[data-tour="logo-section"]',
      title: 'Brand Logo',
      content: 'Upload your brand logo to personalize it. Accepted formats are PNG, JPG and SVG.',
      position: 'right' as const
    },
    {
      target: '[data-tour="content-section"]',
      title: 'Content & Text',
      content: 'Customize the main texts: headline, subheadline, and the call-to-action button text (CTA).',
      position: 'right' as const
    },
    {
      target: '[data-tour="colors-section"]',
      title: 'Brand Colors',
      content: 'Customize the primary, secondary and accent colors to match your brand.',
      position: 'right' as const
    },
    {
      target: '[data-tour="preview"]',
      title: 'Live Preview',
      content: 'All your changes are reflected here instantly. You can see exactly how your page will look.',
      position: 'left' as const
    },
    {
      target: '[data-tour="save-btn"]',
      title: 'Save Changes',
      content: 'Don\'t forget to save! Click here when you\'re satisfied with your design.',
      position: 'bottom' as const
    },
    {
      target: '[data-tour="preview-btn"]',
      title: 'External Preview',
      content: 'Open your page in a new tab to see it exactly as your visitors will.',
      position: 'bottom' as const
    }
  ]

  // Listen for messages from iframe (popup close and inline edits)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data === 'closePopup') {
        setIsPopupOpen(false)
      }
      
      // Handle inline content changes
      if (event.data.type === 'CONTENT_CHANGE') {
        const { field, value } = event.data
        console.log('Inline edit received:', field, value)
        
        switch (field) {
          case 'headline':
            setHeadline(value)
            break
          case 'subheadline':
            setSubheadline(value)
            break
          case 'cta':
            setCta(value)
            break
          default:
            console.warn('Unknown field:', field)
        }
      }
    }
    
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  // Reopen popup after iframe reloads if it was open
  useEffect(() => {
    if (isPopupOpen) {
      const timer = setTimeout(() => {
        const iframe = document.querySelector('iframe') as HTMLIFrameElement
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage('showPopup', '*')
        }
      }, 800) // Increased wait time for iframe to fully load
      
      return () => clearTimeout(timer)
    }
  }, [headline, cta, ctaUrl, primaryColor, secondaryColor, accentColor, logoUrl, popupTitle, popupMessage, popupPrize, isPopupOpen])

  // Send custom styles to iframe when loaded
  useEffect(() => {
    if (Object.keys(customStyles).length > 0) {
      const timer = setTimeout(() => {
        const iframe = document.querySelector('iframe') as HTMLIFrameElement
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage({
            type: 'APPLY_STYLES',
            customStyles
          }, '*')
        }
      }, 1000) // Wait for iframe to load
      
      return () => clearTimeout(timer)
    }
  }, [customStyles, templateId])

  const loadSite = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('sites')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error) throw error

      setSite(data)
      setHeadline(data.headline || 'YOUR TITLE HERE')
      setSubheadline(data.subheadline || '')
      setCta(data.cta || 'PLAY NOW')
      setCtaUrl(data.cta_url || 'https://example.com')
      setPrimaryColor(data.primary_color || '#4a90e2')
      setSecondaryColor(data.secondary_color || '#7b68ee')
      setAccentColor(data.accent_color || '#ffd700')
      setLogoUrl(data.logo_url || '')
      setPopupTitle(data.popup_title || '')
      setPopupMessage(data.popup_message || '')
      setPopupPrize(data.popup_prize || '')
      // Load wheel values from database
      setWheelValues(data.wheel_values || '$100, $200, $500, $1000, $2000, $5000, $800, $1500')
      setGameBalance(data.game_balance || 1000)
      setVertical(data.vertical || 'casino')
      setTemplateId(data.template_id || 't6')
      setTermsUrl(data.terms_url || '')
      setPrivacyUrl(data.privacy_url || '')
      setResponsibleGamingUrl(data.responsible_gaming_url || '')
      setBackgroundColor(data.background_color || '#1a1a2e')
      setBackgroundImage(data.background_image || '')
      setFeaturedPlayer(data.featured_player || '')
      setSportDirector(data.sport_director || '')
      setBrandName(data.brand_name || 'My New Asset')
      console.log('Loading site - data.name:', data.name, 'data.brand_name:', data.brand_name, 'data.industry:', data.industry)
      
      // Force site name to be empty if it's the auto-generated one
      const initialSiteName = data.name && !data.name.includes(`${data.brand_name} - ${data.industry} Site`) 
        ? data.name 
        : ''
      setSiteName(initialSiteName)
      console.log('Set siteName to:', initialSiteName)
      
      // Load custom styles from sections JSONB
      if (data.sections?.customStyles) {
        setCustomStyles(data.sections.customStyles)
      }
    } catch (error) {
      console.error('Error loading site:', error)
      alert('Failed to load site')
    } finally {
      setLoading(false)
    }
  }

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Image size must be less than 2MB')
      return
    }

    setUploadingLogo(true)
    try {
      const supabase = createClient()
      
      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${slug}-logo-${Date.now()}.${fileExt}`
      const filePath = `logos/${fileName}`

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('site-assets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (error) throw error

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('site-assets')
        .getPublicUrl(filePath)

      setLogoUrl(publicUrl)
      alert('Logo uploaded successfully!')
    } catch (error: any) {
      console.error('Upload error:', error)
      alert(`Failed to upload logo: ${error.message}`)
    } finally {
      setUploadingLogo(false)
    }
  }

  const handleBackgroundUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }

    // Validate file size (max 5MB for backgrounds)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB')
      return
    }

    setUploadingBackground(true)
    try {
      const supabase = createClient()
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('You must be logged in to upload files')
      }
      
      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${slug}-background-${Date.now()}.${fileExt}`
      const filePath = `${user.id}/${fileName}`

      // Upload to Supabase Storage - using 'backgrounds' bucket
      const { data, error } = await supabase.storage
        .from('backgrounds')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (error) throw error

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('backgrounds')
        .getPublicUrl(filePath)

      setBackgroundImage(publicUrl)
      alert('Background image uploaded successfully!')
    } catch (error: any) {
      console.error('Upload error:', error)
      alert(`Failed to upload background: ${error.message}`)
    } finally {
      setUploadingBackground(false)
    }
  }

  const handleAIChanges = (changes: any) => {
    if (changes.headline) setHeadline(changes.headline)
    if (changes.subheadline) setSubheadline(changes.subheadline)
    if (changes.cta) setCta(changes.cta)
    if (changes.ctaUrl) setCtaUrl(changes.ctaUrl)
    if (changes.primaryColor) setPrimaryColor(changes.primaryColor)
    if (changes.secondaryColor) setSecondaryColor(changes.secondaryColor)
    if (changes.accentColor) setAccentColor(changes.accentColor)
    if (changes.logoUrl) setLogoUrl(changes.logoUrl)
    if (changes.popupTitle) setPopupTitle(changes.popupTitle)
    if (changes.popupMessage) setPopupMessage(changes.popupMessage)
    if (changes.popupPrize) setPopupPrize(changes.popupPrize)
    if (changes.gameBalance) setGameBalance(changes.gameBalance)
    if (changes.templateId) setTemplateId(changes.templateId)
  }

  const getCurrentSiteData = () => ({
    headline,
    subheadline,
    cta,
    ctaUrl,
    primaryColor,
    secondaryColor,
    accentColor,
    logoUrl,
    popupTitle,
    popupMessage,
    popupPrize,
    gameBalance,
    templateId,
    vertical
  })

  const handleSave = async () => {
    setSaving(true)
    try {
      const supabase = createClient()
      
      // Prepare update data
      const updateData: any = {
        name: siteName,
        brand_name: brandName,
        headline,
        subheadline,
        cta,
        cta_url: ctaUrl,
        primary_color: primaryColor,
        secondary_color: secondaryColor,
        accent_color: accentColor,
        logo_url: logoUrl || null,
        template_id: templateId  // Always save template_id
      }
      
      console.log('Saving site with data:', { siteName, brandName, updateData })
      
      // Add logging for the update operation
      console.log('About to update site with ID:', site?.id)
      
      // Try to add optional fields that might not exist in all database schemas
      try {
        updateData.popup_title = popupTitle
        updateData.popup_message = popupMessage
        updateData.popup_prize = popupPrize
        updateData.game_balance = gameBalance
        
        // Save wheel values for Fortune Wheel templates
        if (wheelValues && wheelValues.trim() !== '') {
          updateData.wheel_values = wheelValues
        }
        
        // Save background customization
        updateData.background_color = backgroundColor
        updateData.background_image = backgroundImage || null
        
        // Save team member names
        updateData.featured_player = featuredPlayer || null
        updateData.sport_director = sportDirector || null
        
        // Save custom styles from inline editing (using sections JSONB field)
        if (Object.keys(customStyles).length > 0) {
          updateData.sections = { customStyles }
        }
      } catch (e) {
        console.warn('Some optional fields not available in schema:', e)
      }
      
      const { error } = await supabase
        .from('sites')
        .update(updateData)
        .eq('slug', slug)

      console.log('Update result:', { error, updateData })

      if (!error) {
        console.log('✅ Site saved successfully!')
        // Show success message
        alert('Site saved successfully!')
      } else {
        // If error is about missing column, try without optional fields
        if (error.message?.includes('wheel_values') || error.message?.includes('schema cache')) {
          console.warn('wheel_values column not in schema, saving without it')
          // Remove only optional fields, keep critical fields like template_id
          const basicUpdate = {
            brand_name: updateData.brand_name,
            headline: updateData.headline,
            subheadline: updateData.subheadline,
            cta: updateData.cta,
            cta_url: updateData.cta_url,
            primary_color: updateData.primary_color,
            secondary_color: updateData.secondary_color,
            accent_color: updateData.accent_color,
            logo_url: updateData.logo_url,
            template_id: updateData.template_id  // CRITICAL: Always include template_id
          }
          
          const { error: retryError } = await supabase
            .from('sites')
            .update(basicUpdate)
            .eq('slug', slug)
          
          if (retryError) {
            console.error('Retry save error:', retryError)
            throw retryError
          }
        } else {
          console.error('Save error:', error)
          throw error
        }
      }

      // Regenerate HTML with new values
      const regenerateResponse = await fetch('/api/regenerate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ slug }),
      })

      if (!regenerateResponse.ok) {
        console.warn('Failed to regenerate HTML, but data was saved')
      }

      // Auto-generate and send protected prelander to email
      try {
        const autoSendResponse = await fetch('/api/auto-send-prelander', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ slug }),
        })

        if (autoSendResponse.ok) {
          const result = await autoSendResponse.json()
          alert(`✅ Changes Saved Successfully!\n\n📧 Protected prelander sent to: ${result.email}\n\n🔒 Your secure prelander has been automatically generated and sent to your email with maximum protection:\n• Anti-screenshot\n• Code obfuscation\n• DevTools blocking\n• Anti-clone protection\n\n✨ Check your email for the download link!\n\nYour landing page is now live and ready!`)
        } else {
          alert('✅ Changes Saved Successfully!\n\n🎉 Your template has been updated.\n\n⚠️ Note: Could not send prelander automatically. You can download it manually from the download button.')
          setShowDownloadModal(true)
        }
      } catch (emailError) {
        console.error('Auto-send error:', emailError)
        alert('✅ Changes Saved Successfully!\n\n🎉 Your template has been updated.\n\n⚠️ Note: Could not send prelander automatically. You can download it manually from the download button.')
        setShowDownloadModal(true)
      }
      
      await loadSite() // Reload to get updated HTML
      setLastSaved(new Date()) // Update last saved timestamp
    } catch (error: any) {
      console.error('Error saving:', error)
      alert(`Failed to save changes: ${error.message || 'Unknown error'}`)
    } finally {
      setSaving(false)
    }
  }

  const handleSaveAndExit = async () => {
    await handleSave()
    router.push('/dashboard')
  }

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      const prevState = history[newIndex]
      if (prevState) {
        setHeadline(prevState.headline || '')
        setSubheadline(prevState.subheadline || '')
        setCta(prevState.cta || '')
        setCtaUrl(prevState.ctaUrl || '')
        setPrimaryColor(prevState.primaryColor || '#4a90e2')
        setSecondaryColor(prevState.secondaryColor || '#7b68ee')
        setAccentColor(prevState.accentColor || '#ffd700')
        setLogoUrl(prevState.logoUrl || '')
        setBackgroundColor(prevState.backgroundColor || '#1a1a2e')
        setBackgroundImage(prevState.backgroundImage || '')
      }
    }
  }

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      const nextState = history[newIndex]
      if (nextState) {
        setHeadline(nextState.headline || '')
        setSubheadline(nextState.subheadline || '')
        setCta(nextState.cta || '')
        setCtaUrl(nextState.ctaUrl || '')
        setPrimaryColor(nextState.primaryColor || '#4a90e2')
        setSecondaryColor(nextState.secondaryColor || '#7b68ee')
        setAccentColor(nextState.accentColor || '#ffd700')
        setLogoUrl(nextState.logoUrl || '')
        setBackgroundColor(nextState.backgroundColor || '#1a1a2e')
        setBackgroundImage(nextState.backgroundImage || '')
      }
    }
  }

  // Simple protected download with FALLBACK
  const handleSimpleDownload = async () => {
    setDownloading(true)
    try {
      // Try token-based download first
      console.log('[DOWNLOAD] Attempting token-based download...')
      const tokenResponse = await fetch('/api/generate-download-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug }),
      })

      let response

      if (tokenResponse.ok) {
        // Token system works - use it
        const { downloadUrl } = await tokenResponse.json()
        console.log('[DOWNLOAD] Token generated, downloading from:', downloadUrl)
        response = await fetch(downloadUrl, { method: 'GET' })
      } else {
        // Token system failed - fallback to direct download
        console.log('[DOWNLOAD] Token system unavailable, using direct download fallback...')
        response = await fetch('/api/download-simple-protected', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ slug }),
        })
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.details || errorData.error || 'Failed to download'
        throw new Error(errorMessage)
      }

      const filename = 'download.zip'
      
      console.log('[DOWNLOAD] Slug:', slug)
      console.log('[DOWNLOAD] Final filename:', filename)

      // Create blob and download
      const blob = await response.blob()
      console.log('[DOWNLOAD] Blob size:', blob.size, 'bytes')
      console.log('[DOWNLOAD] Blob type:', blob.type)
      
      // Check if blob type suggests an error
      if (blob.type.includes('text') || blob.type.includes('html') || blob.type.includes('json')) {
        console.error('[DOWNLOAD] ❌ Blob type suggests error page:', blob.type)
        const text = await blob.text()
        console.error('[DOWNLOAD] Response content:', text.substring(0, 500))
        throw new Error(`Server error: ${text.substring(0, 200)}`)
      }
      
      // Check minimum size
      if (blob.size < 100) {
        console.error('[DOWNLOAD] ❌ Blob too small to be valid ZIP:', blob.size, 'bytes')
        throw new Error('Server returned invalid ZIP file (too small).')
      }
      
      // ULTRA DETAILED ERROR TRACKING
      console.log('[DOWNLOAD] ===== STARTING DOWNLOAD PROCESS =====')
      console.log('[DOWNLOAD] Filename to use:', filename)
      console.log('[DOWNLOAD] Filename length:', filename.length)
      console.log('[DOWNLOAD] Filename chars:', filename.split('').map((c, i) => `${i}:${c}(${c.charCodeAt(0)})`).join(' '))
      
      // Verify blob is valid ZIP
      const arrayBuffer = await blob.arrayBuffer()
      const bytes = new Uint8Array(arrayBuffer)
      console.log('[DOWNLOAD] First 4 bytes (should be ZIP signature):', Array.from(bytes.slice(0, 4)).map(b => b.toString(16)).join(' '))
      console.log('[DOWNLOAD] Expected ZIP signature: 50 4b 03 04')
      
      // Recreate blob from arrayBuffer (blob was consumed)
      const downloadBlob = new Blob([arrayBuffer], { type: 'application/zip' })
      
      // Method 1: Try blob URL with error capture
      try {
        console.log('[DOWNLOAD] Creating Blob URL...')
        const url = window.URL.createObjectURL(downloadBlob)
        console.log('[DOWNLOAD] Blob URL created successfully:', url)
        
        const a = document.createElement('a')
        console.log('[DOWNLOAD] Created anchor element')
        
        a.href = url
        console.log('[DOWNLOAD] Set href to:', a.href)
        
        a.download = filename
        console.log('[DOWNLOAD] Set download attribute to:', a.download)
        
        a.style.display = 'none'
        document.body.appendChild(a)
        console.log('[DOWNLOAD] Appended to DOM')
        
        console.log('[DOWNLOAD] About to trigger click...')
        a.click()
        console.log('[DOWNLOAD] Click triggered')
        
        // Clean up after a delay
        setTimeout(() => {
          window.URL.revokeObjectURL(url)
          document.body.removeChild(a)
          console.log('[DOWNLOAD] Cleanup complete')
        }, 100)
      } catch (blobError: any) {
        console.error('[DOWNLOAD] ❌ Blob URL method FAILED')
        console.error('[DOWNLOAD] Error name:', blobError?.name)
        console.error('[DOWNLOAD] Error message:', blobError?.message)
        console.error('[DOWNLOAD] Error stack:', blobError?.stack)
        console.error('[DOWNLOAD] Full error object:', blobError)
        
        // Show error to user with details
        throw new Error(`Download failed at blob creation: ${blobError?.message || 'Unknown error'}. Please screenshot this and contact support.`)
      }

      setShowDownloadModal(false)
      
      // Mark site as downloaded (with fallback if columns don't exist)
      try {
        await supabase
          .from('sites')
          .update({ 
            is_downloaded: true, 
            downloaded_at: new Date().toISOString(),
            download_count: site?.download_count ? site.download_count + 1 : 1
          })
          .eq('slug', slug)
      } catch (columnError: any) {
        // If the new columns don't exist, skip the tracking for now
        if (columnError.message?.includes('is_downloaded') || columnError.message?.includes('column')) {
          console.log('Download tracking columns not available, skipping tracking')
        } else {
          throw columnError
        }
      }

      // Show success message
      alert('✅ Download Successful!\n\n🔒 Your prelander has been downloaded with maximum security protection:\n• Anti-screenshot blocking\n• DevTools protection\n• Code obfuscation\n• Anti-clone measures\n\nYou can download again anytime from this page.')
      
    } catch (error: any) {
      console.error('Download error:', error)
      alert(`❌ Download Failed\n\n${error.message || 'Unknown error'}\n\nPlease try again or contact support.`)
    } finally {
      setDownloading(false)
    }
  }

  const handlePublish = async () => {
    if (!site) return
    
    setPublishing(true)
    
    try {
      // First save any pending changes
      await handleSave()
      
      // Try to mark site as published with new columns, fallback to just status if columns don't exist
      try {
        const { error } = await supabase
          .from('sites')
          .update({ 
            is_published: true, 
            published_at: new Date().toISOString(),
            status: 'published' 
          })
          .eq('slug', slug)

        if (error) {
          throw error
        }
      } catch (columnError: any) {
        // If the new columns don't exist, just update the status
        if (columnError.message?.includes('is_published') || columnError.message?.includes('column')) {
          console.log('New columns not available, updating status only')
          const { error } = await supabase
            .from('sites')
            .update({ status: 'published' })
            .eq('slug', slug)

          if (error) {
            throw error
          }
        } else {
          throw columnError
        }
      }

      // Auto-generate and send protected prelander to email on publish
      try {
        const autoSendResponse = await fetch('/api/auto-send-prelander', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ slug }),
        })

        if (autoSendResponse.ok) {
          const result = await autoSendResponse.json()
          alert(`🚀 Site Published Successfully!\n\n📧 Protected prelander sent to: ${result.email}\n\n🔒 Your fully secured prelander has been automatically sent to your email with:\n• Maximum encryption\n• Anti-clone protection\n• Code obfuscation\n• DevTools blocking\n\n✨ Check your email for the download link!\n\n🌐 Your site is now live and ready for the world!`)
        } else {
          alert('🚀 Site Published Successfully!\n\n✅ Your site is now live and accessible.\n\n⚠️ Note: Could not send prelander automatically. You can download it manually.')
        }
      } catch (emailError) {
        console.error('Auto-send on publish error:', emailError)
        alert('🚀 Site Published Successfully!\n\n✅ Your site is now live and accessible.')
      }
      
      // Reload site data
      await loadSite()
      
    } catch (error: any) {
      console.error('Error publishing site:', error)
      alert(`Failed to publish site: ${error.message || 'Unknown error'}`)
    } finally {
      setPublishing(false)
    }
  }

  const handleDownload = async () => {
    if (!downloadEmail) {
      alert('Please enter your email address')
      return
    }

    setDownloading(true)
    try {
      const response = await fetch('/api/download-encrypted', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug,
          userEmail: downloadEmail
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.details || errorData.error || 'Failed to generate download'
        throw new Error(errorMessage)
      }

      // EMERGENCY: Use completely hardcoded simple name
      const filename = 'standard.zip'  // HARDCODED
      
      console.log('[STANDARD] Final filename:', filename)

      // Create blob and download with fallback
      const blob = await response.blob()
      try {
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        a.style.display = 'none'
        document.body.appendChild(a)
        a.click()
        setTimeout(() => {
          window.URL.revokeObjectURL(url)
          document.body.removeChild(a)
        }, 100)
      } catch (err) {
        // Fallback method
        const reader = new FileReader()
        reader.onload = () => {
          const a = document.createElement('a')
          a.href = reader.result as string
          a.download = filename
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
        }
        reader.readAsDataURL(blob)
      }

      // Get password from header (development only)
      const password = response.headers.get('X-Download-Password')
      
      setShowDownloadModal(false)
      setDownloadEmail('')
      
      alert(`🔐 Encrypted Package Downloaded!\n\n${password ? `ZIP Password: ${password}` : 'Check your email for the ZIP password.'}\n\nThe encrypted ZIP contains:\n• 📄 index.html - Your complete landing page\n• ⚙️ config.json - Site configuration\n• 📋 README.md - Deployment instructions\n\nTO USE:\n1. Extract the ZIP file using the password\n2. Upload index.html to your web hosting service\n3. Test your landing page\n\n🔒 Your files are now properly encrypted!\nPassword sent to your email for security.`)
      
    } catch (error: any) {
      console.error('Download error:', error)
      alert(`Failed to download: ${error.message}`)
    } finally {
      setDownloading(false)
    }
  }

  const handleSecureDownload = async () => {
    if (!downloadEmail) {
      alert('Please enter your email address')
      return
    }

    if (!affiliateCode) {
      alert('Please enter an affiliate code')
      return
    }

    setDownloading(true)
    try {
      const response = await fetch('/api/generate-secure-package', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug,
          userEmail: downloadEmail,
          affiliateCode,
          allowedDomain: domainLock || undefined
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.details || errorData.error || 'Failed to generate secure package'
        throw new Error(errorMessage)
      }

      // EMERGENCY: Use completely hardcoded simple name
      const filename = 'secure.zip'  // HARDCODED
      
      console.log('[SECURE] Final filename:', filename)

      // Create blob and download with fallback
      const blob = await response.blob()
      try {
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        a.style.display = 'none'
        document.body.appendChild(a)
        a.click()
        setTimeout(() => {
          window.URL.revokeObjectURL(url)
          document.body.removeChild(a)
        }, 100)
      } catch (err) {
        // Fallback method
        const reader = new FileReader()
        reader.onload = () => {
          const a = document.createElement('a')
          a.href = reader.result as string
          a.download = filename
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
        }
        reader.readAsDataURL(blob)
      }

      // Get password from header (development only)
      const password = response.headers.get('X-Download-Password')
      
      setShowDownloadModal(false)
      setDownloadEmail('')
      setAffiliateCode('')
      setDomainLock('')
      
      alert(`🛡️ SECURE Package Downloaded!\n\n🔑 PACKAGE PASSWORD: ${password || 'Check README.md file'}\n\nThe SECURE ZIP contains:\n• 📄 index.html - Protected shell page\n• 🔒 script.js - Obfuscated JavaScript with encrypted content\n• 🎨 style.css - Responsive styling\n• 📋 README.md - Security guide WITH PASSWORD\n\nSECURITY FEATURES:\n✅ JavaScript obfuscation & encryption\n✅ Anti-debugging protection\n✅ Domain locking${domainLock ? ` (${domainLock})` : ' (disabled)'}\n✅ Hidden affiliate tracking (${affiliateCode})\n✅ File:// protocol blocking\n✅ Right-click protection\n\nDEPLOYMENT:\n1. Extract ZIP (no password needed)\n2. Check README.md for package password\n3. Upload ALL files to web hosting\n4. Access via your domain (not locally)\n5. Do NOT modify files\n\n🛡️ Maximum security protection active!\n📧 Password also in README.md file for reference.`)
      
    } catch (error: any) {
      console.error('Secure download error:', error)
      alert(`Failed to generate secure package: ${error.message}`)
    } finally {
      setDownloading(false)
    }
  }

  // AWS Hosting - Deploy directly to S3
  const handleAWSHosting = async () => {
    if (!downloadEmail) {
      alert('Please enter your email address')
      return
    }

    setDownloading(true)
    try {
      // Send current editor state to generate fresh HTML
      const response = await fetch('/api/host-to-aws', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug,
          email: downloadEmail,
          domainLock: domainLock || undefined,
          // Send current editor values
          currentData: {
            templateId,
            headline,
            subheadline,
            cta,
            ctaUrl,
            primaryColor,
            secondaryColor,
            accentColor,
            logoUrl,
            brandName: site?.brand_name,
            popupTitle,
            popupMessage,
            popupPrize,
            wheelValues,
            backgroundColor,
            backgroundImage,
            gameBalance
          }
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.details || errorData.error || 'Failed to host prelander'
        throw new Error(errorMessage)
      }

      const data = await response.json()
      
      setShowDownloadModal(false)
      setDownloadEmail('')
      setDomainLock('')
      
      // Show success message
      alert(`🚀 Prelander Hosted Successfully!\n\n✅ Your prelander is now live on AWS S3\n📧 Confirmation email sent to ${downloadEmail}\n\n🌐 Opening your live prelander in a new tab...`)
      
      // Open the hosted URL in a new tab
      window.open(data.hostedUrl, '_blank')
      
    } catch (error: any) {
      console.error('AWS hosting error:', error)
      alert(`Failed to host prelander: ${error.message}`)
    } finally {
      setDownloading(false)
    }
  }

  const getPreviewUrl = () => {
    if (!site) return ''
    
    // Build preview URL with current values
    const params = new URLSearchParams({
      templateId,
      headline,
      subheadline: subheadline || '',
      cta,
      ctaUrl,
      primaryColor,
      secondaryColor,
      accentColor,
      logoUrl: logoUrl || '',  // Logo for all templates
      popupTitle,
      popupMessage,
      popupPrize,
      gameBalance: gameBalance.toString(),
      wheelValues: wheelValues || '',  // Wheel values for Fortune Wheel templates
      backgroundColor,  // Background customization
      backgroundImage: backgroundImage || '',
      featuredPlayer: featuredPlayer || '',  // Team member names
      sportDirector: sportDirector || '',
      preview: '1',  // Flag to disable blur in editor iframe
      edit: '1',  // Enable inline editing mode
    })
    
    return `/sites/${slug}?${params.toString()}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (!site) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Site not found</h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="text-blue-400 hover:text-blue-300"
          >
            Go back to dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex flex-col font-inter">
        {/* Enhanced Top Bar */}
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-cyan-500/30 px-6 py-4 flex items-center justify-between shadow-lg shadow-cyan-500/10 relative">
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="cursor-pointer" onClick={async () => { await handleSave(); router.push('/dashboard'); }}>
              <NanoKitLogo size="header" href="/dashboard" />
            </div>
            <div className="border-l border-cyan-500/30 pl-4">
              {isEditingTitle ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    onBlur={() => setIsEditingTitle(false)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') setIsEditingTitle(false)
                      if (e.key === 'Escape') {
                        setBrandName(site?.brand_name || 'My New Asset')
                        setIsEditingTitle(false)
                      }
                    }}
                    className="bg-slate-800 text-white px-3 py-1 rounded border border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 font-bold text-lg"
                    autoFocus
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setIsEditingTitle(true)}>
                  <h1 className="text-white font-bold font-inter text-lg tracking-wide">{brandName}</h1>
                  <Edit3 size={16} className="text-slate-400 group-hover:text-cyan-400 transition-colors opacity-0 group-hover:opacity-100" />
                </div>
              )}
              <p className="text-sm text-cyan-400/80 font-inter font-medium">Template Editor</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 relative z-10">
            <div className="flex items-center gap-1 border border-slate-700/50 rounded-lg p-1 bg-slate-900/50">
              <button
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                title="Undo"
              >
                <Undo2 size={18} />
              </button>
              <button
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                title="Redo"
              >
                <Redo2 size={18} />
              </button>
            </div>

            <button
              data-tour="preview-btn"
              onClick={() => window.open(getPreviewUrl(), '_blank')}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800/70 hover:bg-cyan-500/10 text-cyan-400 hover:text-white rounded-lg transition-all duration-300 border border-cyan-500/30 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20 backdrop-blur-sm font-medium"
            >
              <Eye size={18} />
              <span className="hidden sm:inline">Preview</span>
            </button>
            
            <button
              data-tour="save-btn"
              onClick={handleSaveAndExit}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800/70 hover:bg-cyan-500/10 text-cyan-400 hover:text-white rounded-lg transition-all duration-300 border border-cyan-500/30 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20 backdrop-blur-sm font-medium disabled:opacity-50"
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              <span className="hidden sm:inline">{saving ? 'Saving...' : 'Save & Exit'}</span>
            </button>
            
            <button
              onClick={() => setShowDownloadModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg transition-all duration-300 shadow-lg shadow-purple-500/30 font-medium"
            >
              <Download size={18} />
              <span className="hidden sm:inline">Download / Host</span>
            </button>
          </div>
        </div>

      {/* Classic Editor */}
      <div className="flex-1 flex relative">
        {/* Sidebar Toggle Button */}
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-50 bg-slate-800 border border-cyan-500/30 rounded-r-lg p-2 hover:bg-slate-700 transition-all"
          style={{ left: isSidebarCollapsed ? '0' : '320px' }}
        >
          {isSidebarCollapsed ? <ChevronRight size={16} className="text-cyan-400" /> : <ChevronLeft size={16} className="text-cyan-400" />}
        </button>

        {/* NetFusion Neon Left Panel - Enhanced */}
        <div className={`${isSidebarCollapsed ? 'w-0' : 'w-80'} bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border-r border-cyan-500/30 overflow-y-auto shadow-xl shadow-cyan-500/10 relative transition-all duration-300`}>
          <div className={`${isSidebarCollapsed ? 'hidden' : 'block'} p-6 space-y-4`}>
            
            {/* Quick Tutorial */}
            {showTour && (
              <div data-tour="quick-actions" className="bg-slate-900/60 rounded-lg p-4 border border-cyan-500/30 relative">
                <button
                  onClick={handleTourSkip}
                  className="absolute top-2 right-2 text-slate-400 hover:text-red-400 transition-colors"
                >
                  <X size={18} />
                </button>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-semibold text-cyan-400 font-inter">Quick Tutorial</span>
                </div>
                <button
                  onClick={() => setShowTour(true)}
                  className="w-full px-4 py-2 text-sm bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-500 hover:to-red-500 transition-all font-medium"
                >
                  🎯 Start Tutorial
                </button>
              </div>
            )}

            {/* Site Settings */}
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('siteSettings')}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-800 hover:bg-gray-750 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Settings size={18} className="text-green-400" />
                  <h3 className="text-sm font-semibold text-white">Site Settings</h3>
                </div>
                {expandedSections.siteSettings ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
              </button>
              
              {expandedSections.siteSettings && (
                <div className="p-4 space-y-4 border-t border-gray-700">
                  <div className="bg-slate-900/60 rounded-lg p-3 border border-cyan-500/20">
                    <p className="text-sm text-slate-300 font-medium">
                      Configure your site name and basic settings
                    </p>
                  </div>

                  {/* Site Name */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Site Name
                    </label>
                    <input
                      type="text"
                      value={siteName}
                      onChange={(e) => {
                        console.log('Site name input changed from:', siteName, 'to:', e.target.value)
                        setSiteName(e.target.value)
                      }}
                      placeholder="Enter a name for your site"
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 transition-all"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      This name will appear in your dashboard for easy identification
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Win Popup Editor for Fortune Wheel templates */}
            {(templateId === 't14' || templateId === 't15' || templateId === 't16' || templateId === 't17') && (
              <button
                onClick={() => setShowWinPopupEditor(!showWinPopupEditor)}
                className="w-full px-4 py-2 text-sm bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all flex items-center justify-center gap-2 font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                {showWinPopupEditor ? 'Hide' : 'Edit'} Win Popup
              </button>
            )}
            
            {/* Vertical Section */}
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('vertical')}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-800 hover:bg-gray-750 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Layers size={18} className="text-orange-400" style={{ filter: 'drop-shadow(0 0 6px rgba(251, 146, 60, 0.6))' }} />
                  <h3 className="text-sm font-semibold text-white">Vertical</h3>
                </div>
                {expandedSections.vertical ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
              </button>
              
              {expandedSections.vertical && (
                <div className="p-4 space-y-4 border-t border-gray-700">
                  <div className="bg-slate-900/60 rounded-lg p-3 border border-cyan-500/20">
                    <p className="text-sm text-slate-300 font-medium">
                      Choose Your Vertical
                    </p>
                  </div>

                  <div className="space-y-2">
                    {[
                      { value: 'casino', label: 'Casino & Gaming', icon: Dices, color: 'text-orange-400' },
                      { value: 'sports', label: 'Sports Betting', icon: Trophy, color: 'text-blue-400' },
                      { value: 'forex', label: 'Forex & Trading', icon: TrendingUp, color: 'text-green-400' },
                      { value: 'crypto', label: 'Cryptocurrency', icon: Bitcoin, color: 'text-yellow-400' },
                      { value: 'ecommerce', label: 'E-commerce', icon: ShoppingBag, color: 'text-pink-400' },
                      { value: 'finance', label: 'Finance', icon: DollarSign, color: 'text-emerald-400' },
                      { value: 'health', label: 'Health & Wellness', icon: Heart, color: 'text-red-400' },
                      { value: 'other', label: 'Other', icon: MoreHorizontal, color: 'text-slate-400' },
                    ].map((option) => {
                      const Icon = option.icon
                      const isSelected = vertical === option.value
                      return (
                        <button
                          key={option.value}
                          onClick={() => setVertical(option.value)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                            isSelected
                              ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-2 border-cyan-400/50 shadow-lg shadow-cyan-500/20'
                              : 'bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 hover:bg-slate-700/50'
                          }`}
                        >
                          <Icon 
                            size={20} 
                            className={`${option.color} ${isSelected ? 'animate-pulse' : ''}`}
                            style={{ filter: 'drop-shadow(0 0 8px currentColor)' }}
                          />
                          <span className={`font-medium ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                            {option.label}
                          </span>
                          {isSelected && (
                            <div className="ml-auto w-2 h-2 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50" />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Template Section */}
            <div data-tour="template-section" className="bg-gray-800 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('template')}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-800 hover:bg-gray-750 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FileText size={18} className="text-pink-400" />
                  <h3 className="text-sm font-semibold text-white">Template</h3>
                </div>
                {expandedSections.template ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
              </button>
              
              {expandedSections.template && (
                <div className="p-4 space-y-4 border-t border-gray-700">
                  <div className="bg-slate-900/60 rounded-lg p-3 border border-cyan-500/20">
                    <p className="text-sm text-slate-300 font-medium">
                      Select a template for your lander / asset
                    </p>
                  </div>

                  <div className="space-y-2">
                    {/* Template Options - Compact List */}
                    {[
                      { id: 't6', name: 'Classic Overlay', desc: 'Traditional popup overlay', preview: '/templates/t6-preview.svg' },
                      { id: 't7', name: 'Sweet Bonanza', desc: 'Colorful slot theme', preview: '/templates/t7-preview.svg' },
                      { id: 't9', name: 'Pirate Slots', desc: 'Adventure pirate theme', preview: '/templates/t9-preview.png' },
                      { id: 't14', name: 'Fortune Wheel - Underwater', desc: 'Ocean theme wheel game', preview: '/templates/t14-preview.png' },
                      { id: 't15', name: 'Fortune Wheel - China', desc: 'Chinese theme wheel game', preview: '/templates/t15-preview.png' },
                      { id: 't16', name: 'Fortune Wheel - Christmas', desc: 'Holiday theme wheel game', preview: '/templates/t16-preview.png' },
                      { id: 't17', name: 'Fortune Wheel - Pirates', desc: 'Pirate theme wheel game', preview: '/templates/t17-preview.png' },
                      { id: 't18', name: 'Big Cash Scratch Card', desc: 'Interactive scratch game', preview: '/templates/t18-preview.png' },
                    ].map((template) => (
                      <button
                        key={template.id}
                        onClick={() => {
                          setTemplateId(template.id)
                          setPreviewMode('template')
                        }}
                        className={`w-full text-left p-2 rounded-lg border transition-all ${
                          templateId === template.id
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-gray-700 bg-gray-900 hover:border-gray-600'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {/* Small Thumbnail - Left */}
                          <div className="relative w-16 h-12 bg-gray-950 rounded overflow-hidden flex-shrink-0">
                            <img
                              src={template.preview}
                              alt={template.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.currentTarget as HTMLImageElement
                                target.style.display = 'none'
                                const parent = target.parentElement
                                if (parent) {
                                  parent.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900"><span class="text-white font-bold text-xs">${template.id.toUpperCase()}</span></div>`
                                }
                              }}
                            />
                          </div>
                          
                          {/* Template Info - Right */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-semibold text-white truncate">{template.name}</h4>
                              {templateId === template.id && (
                                <span className="text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded flex-shrink-0">✓</span>
                              )}
                            </div>
                            <p className="text-xs text-gray-400 truncate">{template.desc}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Preview Mode Toggle */}
                  <div className="pt-4 border-t border-gray-700">
                    <div className="bg-gray-900 rounded-lg p-3">
                      <p className="text-xs text-gray-400 mb-2">
                        <strong className="text-white">Preview:</strong> See the selected template in the right panel
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setPreviewMode('template')}
                          className={`flex-1 px-3 py-2 text-xs rounded transition-all ${
                            previewMode === 'template'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                          }`}
                        >
                          📋 Template Preview
                        </button>
                        <button
                          onClick={() => setPreviewMode('live')}
                          className={`flex-1 px-3 py-2 text-xs rounded transition-all ${
                            previewMode === 'live'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                          }`}
                        >
                          👁️ Live Preview
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-3">
                    <p className="text-xs text-blue-300">
                      💡 <strong>Note:</strong> Changing the template will require regenerating the page
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Logo Section */}
            <div data-tour="logo-section" className="bg-gray-800 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('logo')}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-800 hover:bg-gray-750 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <ImageIcon size={18} className="text-blue-400" />
                  <h3 className="text-sm font-semibold text-white">Logo</h3>
                </div>
                {expandedSections.logo ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
              </button>
              
              {expandedSections.logo && (
                <div className="p-4 space-y-4 border-t border-gray-700">
                  <div className="bg-slate-900/60 rounded-lg p-3 border border-cyan-500/20">
                    <p className="text-sm text-slate-300 font-medium">
                      Upload your brand logo
                    </p>
                  </div>

                  {/* Upload from Computer */}
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-2">
                      Upload Logo
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        disabled={uploadingLogo}
                        className="hidden"
                        id="logo-upload"
                      />
                      <label
                        htmlFor="logo-upload"
                        className={`flex items-center justify-center gap-2 w-full px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm rounded-lg cursor-pointer transition-all ${
                          uploadingLogo ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {uploadingLogo ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <ImageIcon size={14} />
                            Choose File
                          </>
                        )}
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Max 2MB • PNG, JPG, GIF
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="px-2 bg-gray-800 text-gray-500">OR</span>
                    </div>
                  </div>
                  
                  {/* URL Input */}
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-2">
                      Logo Image URL
                    </label>
                    <input
                      type="url"
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                  
                  {logoUrl && (
                    <div className="pt-2">
                      <p className="text-xs text-gray-400 mb-2">Preview:</p>
                      <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-lg p-4 flex items-center justify-center min-h-[80px]">
                        <img
                          src={logoUrl}
                          alt="Logo preview"
                          className="max-h-12 max-w-[140px] object-contain"
                          onError={(e) => {
                            const parent = e.currentTarget.parentElement
                            if (parent) {
                              parent.innerHTML = '<div class="text-center"><p class="text-red-400 text-xs">❌ Failed to load</p></div>'
                            }
                          }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {!logoUrl && (
                    <div className="pt-2">
                      <div className="bg-gray-900 rounded-lg p-4 text-center">
                        <ImageIcon size={24} className="mx-auto text-gray-600 mb-1" />
                        <p className="text-xs text-gray-500">No logo set</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Content Section */}
            <div data-tour="content-section" className="bg-gray-800 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('content')}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-800 hover:bg-gray-750 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Type size={18} className="text-green-400" />
                  <h3 className="text-sm font-semibold text-white">Content</h3>
                </div>
                {expandedSections.content ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
              </button>
              
              {expandedSections.content && (() => {
                const templateConfig = getTemplateConfig(templateId)
                if (!templateConfig) {
                  return (
                    <div className="p-4 text-center text-gray-400 text-sm">
                      No editable fields for this template
                    </div>
                  )
                }

                const fields = templateConfig.fields
                const hasPopupFields = fields.popupTitle || fields.popupMessage || fields.popupPrize

                return (
                  <div className="p-4 space-y-6 border-t border-gray-700">
                    {/* Template-specific info */}
                    <div className="bg-gradient-to-r from-cyan-900/30 to-purple-900/30 border border-cyan-500/40 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="text-sm text-cyan-300 font-bold">
                          {templateConfig.name}
                        </p>
                      </div>
                      <p className="text-xs text-gray-400">
                        Showing {Object.keys(fields).length} editable field{Object.keys(fields).length !== 1 ? 's' : ''} for this template
                      </p>
                    </div>

                    {/* Inline Editing Instructions */}
                    <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border border-blue-500/40 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Type size={18} className="text-blue-400" />
                        <p className="text-sm text-blue-300 font-bold">
                          Edit Text Directly
                        </p>
                      </div>
                      <p className="text-xs text-gray-400 mb-3">
                        Click on any text in the preview to edit it directly. A toolbar will appear with formatting options.
                      </p>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="px-2 py-1 bg-slate-800 rounded text-slate-300">✏️ Click to edit</span>
                        <span className="px-2 py-1 bg-slate-800 rounded text-slate-300">📏 Change size</span>
                        <span className="px-2 py-1 bg-slate-800 rounded text-slate-300">B I U</span>
                      </div>
                    </div>

                    {/* CTA URL - Keep this in sidebar */}
                    <div className="space-y-4">
                      {fields.ctaUrl && (
                        <div>
                          <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                            <LinkIcon size={14} className="text-cyan-400" />
                            {fields.ctaUrl.label}
                            {fields.ctaUrl.required && <span className="text-red-400 ml-1">*</span>}
                          </label>
                          <input
                            type="url"
                            value={ctaUrl}
                            onChange={(e) => setCtaUrl(e.target.value)}
                            className="w-full px-4 py-3 text-sm bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                            placeholder={fields.ctaUrl.placeholder}
                            required={fields.ctaUrl.required}
                          />
                          {fields.ctaUrl.description && (
                            <p className="text-xs text-gray-500 mt-1.5">{fields.ctaUrl.description}</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Custom Logo for Fortune Wheel */}
                    {fields.logoUrl && (
                      <div className="border-t border-gray-700 pt-6">
                        <div className="flex items-center gap-2 mb-4">
                          <Palette size={20} className="text-purple-400" style={{ filter: 'drop-shadow(0 0 6px rgba(192, 132, 252, 0.6))' }} />
                          <h4 className="text-sm font-bold text-white">Custom Branding</h4>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                            <ImageIcon size={14} className="text-cyan-400" />
                            {fields.logoUrl.label}
                            {fields.logoUrl.required && <span className="text-red-400 ml-1">*</span>}
                          </label>
                          <input
                            type="url"
                            value={logoUrl}
                            onChange={(e) => setLogoUrl(e.target.value)}
                            className="w-full px-4 py-3 text-sm bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                            placeholder={fields.logoUrl.placeholder}
                          />
                          {fields.logoUrl.description && (
                            <p className="text-xs text-gray-500 mt-1.5">{fields.logoUrl.description}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Fortune Wheel Specific Section */}
                    {fields.wheelValues && (
                      <div className="border-t border-gray-700 pt-6">
                        <div className="flex items-center gap-2 mb-4">
                          <Settings size={20} className="text-cyan-400" style={{ filter: 'drop-shadow(0 0 6px rgba(34, 211, 238, 0.6))' }} />
                          <h4 className="text-sm font-bold text-white">Wheel Configuration</h4>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-white mb-2">
                            {fields.wheelValues.label}
                            {fields.wheelValues.required && <span className="text-red-400 ml-1">*</span>}
                          </label>
                          <textarea
                            value={wheelValues}
                            onChange={(e) => setWheelValues(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 text-sm bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono"
                            placeholder={fields.wheelValues.placeholder}
                          />
                          {fields.wheelValues.description && (
                            <p className="text-xs text-gray-500 mt-1.5">{fields.wheelValues.description}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Game Balance */}
                    {fields.gameBalance && (
                      <div className="border-t border-gray-700 pt-6">
                        <div className="flex items-center gap-2 mb-4">
                          <Wallet size={20} className="text-yellow-400" style={{ filter: 'drop-shadow(0 0 6px rgba(250, 204, 21, 0.6))' }} />
                          <h4 className="text-sm font-bold text-white">Game Balance</h4>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-white mb-2">
                            {fields.gameBalance.label}
                            {fields.gameBalance.required && <span className="text-red-400 ml-1">*</span>}
                          </label>
                          <input
                            type="number"
                            value={gameBalance}
                            onChange={(e) => setGameBalance(parseInt(e.target.value) || 1000)}
                            min="0"
                            step="100"
                            className="w-full px-4 py-3 text-sm bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                            placeholder={fields.gameBalance.placeholder}
                          />
                          {fields.gameBalance.description && (
                            <p className="text-xs text-gray-500 mt-1.5">{fields.gameBalance.description}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Win Popup Section (if template supports it) */}
                    {hasPopupFields && (
                      <div className="border-t border-gray-700 pt-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Gift size={20} className="text-pink-400" style={{ filter: 'drop-shadow(0 0 6px rgba(244, 114, 182, 0.6))' }} />
                            <h4 className="text-sm font-bold text-white">Win Popup</h4>
                          </div>
                          <button
                            onClick={() => {
                              setIsPopupOpen(true)
                              const iframe = document.querySelector('iframe') as HTMLIFrameElement
                              if (iframe && iframe.contentWindow) {
                                iframe.contentWindow.postMessage('showPopup', '*')
                              }
                            }}
                            className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs rounded-lg transition-colors font-medium flex items-center gap-1"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Preview
                          </button>
                        </div>
                        <p className="text-xs text-gray-400 mb-4 bg-purple-900/20 border border-purple-700/30 rounded-lg p-2">
                          💡 This popup appears after user interaction with the game
                        </p>
                        
                        <div className="space-y-4">
                          {/* Popup Title */}
                          {fields.popupTitle && (
                            <div>
                              <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                                <span>🏆</span>
                                {fields.popupTitle.label}
                              </label>
                              <input
                                type="text"
                                value={popupTitle}
                                onChange={(e) => setPopupTitle(e.target.value)}
                                className="w-full px-4 py-3 text-sm bg-gray-900 border border-gray-700 rounded-lg text-white font-bold focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                placeholder={fields.popupTitle.placeholder}
                              />
                              {fields.popupTitle.description && (
                                <p className="text-xs text-gray-500 mt-1.5">{fields.popupTitle.description}</p>
                              )}
                            </div>
                          )}

                          {/* Popup Message */}
                          {fields.popupMessage && (
                            <div>
                              <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                                <span>💬</span>
                                {fields.popupMessage.label}
                              </label>
                              {fields.popupMessage.type === 'textarea' ? (
                                <textarea
                                  value={popupMessage}
                                  onChange={(e) => setPopupMessage(e.target.value)}
                                  className="w-full px-4 py-3 text-sm bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                  placeholder={fields.popupMessage.placeholder}
                                  rows={2}
                                />
                              ) : (
                                <input
                                  type="text"
                                  value={popupMessage}
                                  onChange={(e) => setPopupMessage(e.target.value)}
                                  className="w-full px-4 py-3 text-sm bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                  placeholder={fields.popupMessage.placeholder}
                                />
                              )}
                              {fields.popupMessage.description && (
                                <p className="text-xs text-gray-500 mt-1.5">{fields.popupMessage.description}</p>
                              )}
                            </div>
                          )}

                          {/* Popup Prize */}
                          {fields.popupPrize && (
                            <div>
                              <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                                <span>💰</span>
                                {fields.popupPrize.label}
                              </label>
                              <input
                                type="text"
                                value={popupPrize}
                                onChange={(e) => setPopupPrize(e.target.value)}
                                className="w-full px-4 py-3 text-sm bg-gray-900 border border-gray-700 rounded-lg text-white font-bold focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                placeholder={fields.popupPrize.placeholder}
                              />
                              {fields.popupPrize.description && (
                                <p className="text-xs text-gray-500 mt-1.5">{fields.popupPrize.description}</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Background Customization Section */}
                    {(fields.backgroundColor || fields.backgroundImage) && (
                      <div className="border-t border-gray-700 pt-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Palette size={20} className="text-purple-400" style={{ filter: 'drop-shadow(0 0 6px rgba(192, 132, 252, 0.6))' }} />
                            <h4 className="text-sm font-bold text-white">Background</h4>
                          </div>
                          {fields.backgroundColor?.isPremium && (
                            <span className="px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs rounded-full font-bold">
                              PREMIUM
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-300 font-medium mb-4 bg-slate-900/60 border border-cyan-500/20 rounded-lg p-3">
                          Upload Your Custom Background Image
                        </p>
                        
                        <div className="space-y-4">
                          {/* Background Color */}
                          {fields.backgroundColor && (
                            <div>
                              <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                                {fields.backgroundColor.label}
                              </label>
                              <div className="flex gap-2">
                                <input
                                  type="color"
                                  value={backgroundColor}
                                  onChange={(e) => setBackgroundColor(e.target.value)}
                                  className="w-16 h-12 rounded cursor-pointer border-2 border-gray-700"
                                />
                                <input
                                  type="text"
                                  value={backgroundColor}
                                  onChange={(e) => setBackgroundColor(e.target.value)}
                                  className="flex-1 px-4 py-3 text-sm bg-gray-900 border border-gray-700 rounded-lg text-white font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                  placeholder={fields.backgroundColor.placeholder}
                                />
                              </div>
                              {fields.backgroundColor.description && (
                                <p className="text-xs text-gray-500 mt-1.5">{fields.backgroundColor.description}</p>
                              )}
                            </div>
                          )}

                          {/* Background Image */}
                          {fields.backgroundImage && (
                            <div>
                              <label className="block text-sm font-medium text-white mb-2 flex items-center gap-2">
                                {fields.backgroundImage.label}
                              </label>
                              
                              {/* Upload Button */}
                              <div className="mb-3">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleBackgroundUpload}
                                  className="hidden"
                                  id="background-upload"
                                  disabled={uploadingBackground}
                                />
                                <label
                                  htmlFor="background-upload"
                                  className={`flex items-center justify-center gap-2 w-full px-4 py-3 text-sm border border-gray-700 rounded-lg cursor-pointer transition-colors ${
                                    uploadingBackground
                                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                      : 'bg-gray-900 text-white hover:bg-gray-800 hover:border-blue-500'
                                  }`}
                                >
                                  {uploadingBackground ? (
                                    <>
                                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                      </svg>
                                      <span>Uploading...</span>
                                    </>
                                  ) : (
                                    <>
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                      </svg>
                                      <span>Upload Background Image</span>
                                    </>
                                  )}
                                </label>
                                <p className="text-xs text-gray-500 mt-1">Or paste URL below (max 5MB)</p>
                              </div>

                              {/* URL Input */}
                              <input
                                type="url"
                                value={backgroundImage}
                                onChange={(e) => setBackgroundImage(e.target.value)}
                                className="w-full px-4 py-3 text-sm bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                placeholder={fields.backgroundImage.placeholder}
                              />
                              {fields.backgroundImage.description && (
                                <p className="text-xs text-gray-500 mt-1.5">{fields.backgroundImage.description}</p>
                              )}
                              {backgroundImage && (
                                <div className="mt-2 p-2 bg-gray-900 border border-gray-700 rounded-lg">
                                  <p className="text-xs text-gray-400 mb-2">Preview:</p>
                                  <div 
                                    className="w-full h-24 rounded bg-cover bg-center border border-gray-600"
                                    style={{ backgroundImage: `url(${backgroundImage})` }}
                                  />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })()}
            </div>

            {/* Colors Section */}
            <div data-tour="colors-section" className="bg-gray-800 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('colors')}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-800 hover:bg-gray-750 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Palette size={18} className="text-purple-400" />
                  <h3 className="text-sm font-semibold text-white">Colors</h3>
                </div>
                {expandedSections.colors ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
              </button>
              
              {expandedSections.colors && (
              <div className="p-4 space-y-4 border-t border-gray-700">
                <div className="bg-gray-900 rounded-lg p-3">
                  <p className="text-xs text-gray-400">
                    Customize the color scheme of your game title bar
                  </p>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-2">
                    Primary Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-12 h-10 rounded cursor-pointer border-2 border-gray-700"
                    />
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="flex-1 px-3 py-2 text-sm bg-gray-900 border border-gray-700 rounded-lg text-white font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Left side of title gradient</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-2">
                    Secondary Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-12 h-10 rounded cursor-pointer border-2 border-gray-700"
                    />
                    <input
                      type="text"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="flex-1 px-3 py-2 text-sm bg-gray-900 border border-gray-700 rounded-lg text-white font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Right side of title gradient</p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-2">
                    Accent Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-12 h-10 rounded cursor-pointer border-2 border-gray-700"
                    />
                    <input
                      type="text"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="flex-1 px-3 py-2 text-sm bg-gray-900 border border-gray-700 rounded-lg text-white font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Game border & popup highlights</p>
                </div>

                <div>
                  <div className="bg-gray-900 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-2">Preview:</p>
                    <div 
                      className="h-10 rounded"
                      style={{
                        background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
                        border: `2px solid ${accentColor}`
                      }}
                    />
                  </div>
                </div>
              </div>
              )}
            </div>

            {/* Legal Content Section */}
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('legal')}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-800 hover:bg-gray-750 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Scale size={18} className="text-yellow-400" />
                  <h3 className="text-sm font-semibold text-white">Legal Content</h3>
                </div>
                {expandedSections.legal ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
              </button>
              
              {expandedSections.legal && (
                <div className="p-4 space-y-4 border-t border-gray-700">
                  <div className="bg-gray-900 rounded-lg p-3">
                    <p className="text-xs text-gray-400">
                      Add links to your legal pages (optional but recommended)
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-2">
                      Terms & Conditions URL
                    </label>
                    <input
                      type="url"
                      value={termsUrl}
                      onChange={(e) => setTermsUrl(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      placeholder="https://example.com/terms"
                    />
                    <p className="text-xs text-gray-500 mt-1">Link to your terms and conditions</p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-2">
                      Privacy Policy URL
                    </label>
                    <input
                      type="url"
                      value={privacyUrl}
                      onChange={(e) => setPrivacyUrl(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      placeholder="https://example.com/privacy"
                    />
                    <p className="text-xs text-gray-500 mt-1">Link to your privacy policy</p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-2">
                      Responsible Gaming URL
                    </label>
                    <input
                      type="url"
                      value={responsibleGamingUrl}
                      onChange={(e) => setResponsibleGamingUrl(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      placeholder="https://example.com/responsible-gaming"
                    />
                    <p className="text-xs text-gray-500 mt-1">Link to responsible gaming information</p>
                  </div>

                  <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-3">
                    <p className="text-xs text-yellow-300">
                      ⚠️ <strong>Important:</strong> Legal pages help build trust and may be required by regulations
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div data-tour="preview" className="flex-1 bg-gray-950 p-3 overflow-auto">
          <div className="max-w-full mx-auto">

            {/* View Mode Toggle */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <button
                onClick={() => setViewMode('desktop')}
                className={`p-3 rounded-lg transition-all ${
                  viewMode === 'desktop'
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
                title="Desktop View"
              >
                <Monitor size={20} />
              </button>
              <button
                onClick={() => setViewMode('mobile')}
                className={`p-3 rounded-lg transition-all ${
                  viewMode === 'mobile'
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
                title="Mobile View"
              >
                <Smartphone size={20} />
              </button>
            </div>

            {previewMode === 'live' ? (
              // Live Preview with iframe - Protection disabled for inline editing
              <ScreenshotProtection disabled={true}>
                <div 
                  className={`bg-white rounded-lg shadow-2xl overflow-hidden mx-auto transition-all ${
                    viewMode === 'mobile' ? 'max-w-[375px]' : 'max-w-full'
                  }`} 
                  style={{ height: '90vh' }}
                >
                  <iframe
                    key={`live-${templateId}-${viewMode}-${wheelValues}-${logoUrl}`}
                    src={getPreviewUrl()}
                    className="w-full h-full border-0"
                    title="Live Preview"
                  />
                </div>
              </ScreenshotProtection>
            ) : (
              // Template Preview Mode
              <div className="space-y-4">
                {/* Large Template Preview - Live with customizations */}
                <ScreenshotProtection disabled={true}>
                  <div className="bg-gray-900 rounded-lg p-3 border border-gray-700">
                    <div 
                      className={`relative bg-white rounded-lg overflow-hidden shadow-2xl mx-auto transition-all ${
                        viewMode === 'mobile' ? 'max-w-[375px]' : 'max-w-full'
                      }`} 
                      style={{ height: '82vh' }}
                    >
                      <iframe
                        key={`template-${templateId}-${viewMode}-${wheelValues}-${logoUrl}`}
                        src={getPreviewUrl()}
                        className="w-full h-full border-0"
                        title="Template Preview"
                      />
                    </div>
                  </div>
                </ScreenshotProtection>
              </div>
            )}
          </div>
        </div>
        
        {/* Tour Guide */}
        {showTour && (
          <EditorTour 
            steps={tourSteps} 
            onComplete={handleTourComplete}
            onSkip={handleTourSkip}
          />
        )}

        {/* Enhanced Download Modal */}
        {showDownloadModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300 p-4">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl max-w-3xl w-full max-h-[90vh] border-2 border-neon-primary/30 shadow-2xl shadow-neon-primary/20 relative overflow-hidden flex flex-col">
            
            {/* Fixed Header */}
            <div className="relative z-10 p-4 pb-3 border-b border-neon-primary/20 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-neon-primary/20 to-neon-secondary/20 rounded-lg border border-neon-primary/30">
                    <Download className="w-5 h-5 text-neon-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Download Prelander</h3>
                    <p className="text-xs text-neon-primary/80">Choose your security level</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDownloadModal(false)}
                  className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-gray-400 hover:text-white"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="relative z-10 p-4 overflow-y-auto flex-1">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Option 1: Download ZIP */}
                <div className="bg-gradient-to-r from-blue-800/50 to-cyan-700/50 rounded-lg p-4 border border-cyan-500/40 backdrop-blur-sm hover:border-cyan-400/60 transition-all">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-cyan-500/20 rounded-lg flex-shrink-0">
                      <Download className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-base text-white font-bold mb-1.5">Download ZIP</p>
                      <p className="text-sm text-gray-200 leading-relaxed mb-2">
                        Secure, protected prelander ready to deploy on any hosting platform.
                      </p>
                      <ul className="text-xs text-cyan-200/80 space-y-1">
                        <li>🔒 Code obfuscation & anti-clone protection</li>
                        <li>📦 Works on any hosting service</li>
                        <li>⚡ No setup required - upload and go</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Option 2: Host with Us */}
                <div className="bg-gradient-to-r from-purple-800/50 to-indigo-700/50 rounded-lg p-4 border border-purple-500/40 backdrop-blur-sm hover:border-purple-400/60 transition-all">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg flex-shrink-0">
                      <Globe className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-base text-white font-bold mb-1.5">Host with Us</p>
                      <p className="text-sm text-gray-200 leading-relaxed mb-2">
                        We host your prelander on AWS with global CDN for instant worldwide access.
                      </p>
                      <ul className="text-xs text-purple-200/80 space-y-1">
                        <li>🌐 Instant live URL in seconds</li>
                        <li>⚡ Fast global CDN delivery</li>
                        <li>🔐 Automatic security & protection</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={downloadEmail}
                  onChange={(e) => setDownloadEmail(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-darker-surface border border-neon-primary/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-primary focus:border-transparent"
                  placeholder="your@email.com"
                  disabled={downloading}
                />
                <p className="text-xs text-gray-400 mt-1.5">
                  We'll send your download link or hosted URL to this email
                </p>
              </div>
            </div>

            {/* Fixed Footer with Buttons */}
            <div className="relative z-10 p-4 pt-3 border-t border-neon-primary/20 flex-shrink-0 bg-gray-900/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Download ZIP Button */}
                <button
                  onClick={handleSimpleDownload}
                  disabled={downloading}
                  className="px-5 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg transition-all duration-300 disabled:opacity-50 font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30"
                >
                  {downloading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      Download ZIP
                    </>
                  )}
                </button>

                {/* Host with Us Button */}
                <button
                  onClick={handleAWSHosting}
                  disabled={downloading || !downloadEmail}
                  className="px-5 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg transition-all duration-300 disabled:opacity-50 font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30"
                >
                  {downloading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Hosting...
                    </>
                  ) : (
                    <>
                      <Globe className="w-5 h-5" />
                      Host with Us
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>

    </div>
  )
}
