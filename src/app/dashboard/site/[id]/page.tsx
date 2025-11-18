'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Site } from '@/lib/types'
import { LogoUploader } from '@/components/LogoUploader'
import { ImageUploader } from '@/components/ImageUploader'


export default function SiteDetailPage() {
  const [site, setSite] = useState<Site | null>(null)
  const [loading, setLoading] = useState(true)
  const [publishing, setPublishing] = useState(false)
  const [regenerating, setRegenerating] = useState(false)
  const [previewKey, setPreviewKey] = useState(0)
  const [aiChangesApplying, setAiChangesApplying] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [previousVersion, setPreviousVersion] = useState<{html: string, css: string} | null>(null)
  const [headline, setHeadline] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [brandName, setBrandName] = useState('')
  const [saving, setSaving] = useState(false)
  
  // T2 Template specific states
  const [heroImage, setHeroImage] = useState('')
  const [featureImage1, setFeatureImage1] = useState('')
  const [featureImage2, setFeatureImage2] = useState('')
  const [feature1Title, setFeature1Title] = useState('')
  const [feature1Description, setFeature1Description] = useState('')
  const [feature2Title, setFeature2Title] = useState('')
  const [feature2Description, setFeature2Description] = useState('')
  const [showFeatures, setShowFeatures] = useState(true)
  const [showPricing, setShowPricing] = useState(true)
  const [showFaq, setShowFaq] = useState(true)
  const router = useRouter()
  const routeParams = useParams<{ id: string }>()
  const id = routeParams?.id as string | undefined

  useEffect(() => {
    if (id) fetchSite(id)
  }, [id])

  const fetchSite = async (siteId: string) => {
    try {
      const response = await fetch(`/api/sites/${siteId}`)
      if (response.ok) {
        const result = await response.json()
        setSite(result.data)
        setHeadline(result.data.headline || '')
        setLogoUrl(result.data.logo_url || '')
        setBrandName(result.data.brand_name || '')
        
        // Initialize T2 template specific data if available
        if (result.data.template_id === 't2' as any) {
          const sections = result.data.sections || {}
          setHeroImage(result.data.hero_image || '')
          setFeatureImage1(result.data.feature_image1 || '')
          setFeatureImage2(result.data.feature_image2 || '')
          setFeature1Title(sections.features?.feature1?.title || '')
          setFeature1Description(sections.features?.feature1?.description || '')
          setFeature2Title(sections.features?.feature2?.title || '')
          setFeature2Description(sections.features?.feature2?.description || '')
          setShowFeatures(sections.features?.enabled !== false)
          setShowPricing(sections.pricing?.enabled !== false)
          setShowFaq(sections.faq?.enabled !== false)
        }
      } else {
        console.error('Failed to fetch site')
      }
    } catch (error) {
      console.error('Error fetching site:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePublish = async () => {
    if (!site) return

    setPublishing(true)
    try {
      const response = await fetch('/api/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ siteId: site.id }),
      })

      if (response.ok) {
        setSite({ ...site, status: 'published' })
      } else {
        alert('Failed to publish site')
      }
    } catch (error) {
      alert('Failed to publish site')
    } finally {
      setPublishing(false)
    }
  }

  const handleDownload = async () => {
    if (!site) return

    try {
      const response = await fetch(`/api/export?siteId=${site.id}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${site.brand_name}-landing-page.zip`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        alert('Failed to download package')
      }
    } catch (error) {
      alert('Failed to download package')
    }
  }

  const handleRegenerate = async () => {
    if (!site) return

    // Save current version before regenerating
    if (site.generated_html && site.generated_css) {
      setPreviousVersion({
        html: site.generated_html,
        css: site.generated_css
      })
    }

    setRegenerating(true)
    try {
      const response = await fetch('/api/ai-regenerate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          siteId: site.id,
          templateId: site.template_id,
          brandName: site.brand_name,
          industry: site.industry,
          description: site.description,
          logoUrl: site.logo_url,
          currentColors: {
            primary: site.primary_color,
            secondary: site.secondary_color,
            accent: site.accent_color
          },
          currentContent: {
            headline: site.headline,
            subheadline: site.subheadline,
            cta: site.cta
          },
          regenerationType: 'layout_variant' // Request a layout variation
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setSite(result.data)
        setPreviewKey(prev => prev + 1)
        
        // Show success message
        setSuccessMessage('✨ New layout variant generated! You can rollback if needed.')
        setTimeout(() => setSuccessMessage(''), 4000)
      } else {
        const errorData = await response.json().catch(() => ({}))
        alert(`Failed to regenerate site: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Regeneration error:', error)
      alert('Failed to regenerate site')
    } finally {
      setRegenerating(false)
    }
  }

  const handleRollback = async () => {
    if (!site || !previousVersion) return

    try {
      const response = await fetch(`/api/sites/${site.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          generated_html: previousVersion.html,
          generated_css: previousVersion.css,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setSite(result.data)
        setPreviousVersion(null) // Clear previous version after rollback
        setPreviewKey(prev => prev + 1)
        
        // Show success message
        setSuccessMessage('↩️ Rolled back to previous version successfully!')
        setTimeout(() => setSuccessMessage(''), 3000)
      } else {
        const errorData = await response.json().catch(() => ({}))
        alert(`Failed to rollback: ${errorData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Rollback error:', error)
      alert('Failed to rollback to previous version')
    }
  }

  const handleSave = async () => {
    if (!site) return
    setSaving(true)
    try {
      const response = await fetch(`/api/sites/${site.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          headline,
          logo_url: logoUrl || undefined,
          brand_name: brandName,
          // T2 template specific data
          ...(site?.template_id === 't2' as any && {
            hero_image: heroImage || undefined,
            feature_image1: featureImage1 || undefined,
            feature_image2: featureImage2 || undefined,
            sections: {
              features: {
                feature1: {
                  title: feature1Title || undefined,
                  description: feature1Description || undefined,
                  enabled: showFeatures
                },
                feature2: {
                  title: feature2Title || undefined,
                  description: feature2Description || undefined,
                  enabled: showFeatures
                },
                enabled: showFeatures
              },
              pricing: {
                enabled: showPricing
              },
              faq: {
                enabled: showFaq
              }
            }
          })
        }),
      })
      if (response.ok) {
        const result = await response.json()
        setSite(result.data)
        setHeadline(result.data.headline || headline)
        setLogoUrl(result.data.logo_url || logoUrl)
        setBrandName(result.data.brand_name || brandName)
        setPreviewKey(prev => prev + 1)
        
        // Show success message
        setSuccessMessage('✅ Changes saved successfully!')
        setTimeout(() => setSuccessMessage(''), 3000)
      } else {
        const err = await response.json().catch(() => ({}))
        console.error('Save error:', err)
        alert(`Failed to save changes: ${err.error || 'Unknown error'}`)
      }
    } catch {
      alert('Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!site) {
    return (
      <div className="min-h-screen bg-black dark:bg-black light:bg-gray-50 text-white dark:text-white light:text-gray-900 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="bg-gradient-to-br from-purple-900/30 to-cyan-900/30 dark:from-purple-900/30 dark:to-cyan-900/30 light:from-white light:to-gray-50 backdrop-blur-xl border border-purple-500/30 dark:border-purple-500/30 light:border-gray-200 rounded-3xl p-12">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">Site not found</h2>
            <Button onClick={() => router.push('/dashboard')} className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white border-0 shadow-lg shadow-purple-500/25">
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black dark:bg-black light:bg-gray-50 text-white dark:text-white light:text-gray-900 transition-colors duration-300">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 dark:block light:hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-black/50 dark:bg-black/50 light:bg-white backdrop-blur-xl border-b border-white/10 dark:border-white/10 light:border-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="flex items-center space-x-5">
                <img 
                  src="/images/olavivo mobile logo.png" 
                  alt="Olavivo Logo" 
                  className="w-40 h-40 object-contain"
                />
                <div>
                  <h1 className="text-4xl font-bold text-orange-500">
                    {site.brand_name}
                  </h1>
                  <p className="text-sm text-gray-400 dark:text-gray-400 light:text-gray-600">/{site.slug}</p>
                </div>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => router.push('/dashboard')} className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:border-white backdrop-blur-sm font-semibold shadow-lg dark:border-white/40 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 light:border-gray-300 light:bg-white light:text-gray-900 light:hover:bg-gray-100">
                ← Dashboard
              </Button>
              {site.status === 'published' && (
                <Button variant="outline" onClick={() => window.open(`/sites/${site.slug}`, '_blank')} className="border-cyan-400/40 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 backdrop-blur-sm font-semibold shadow-lg">
                  🌐 View Live
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left column: Site Info & Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Site Info */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 shadow-2xl">
              <h3 className="text-lg font-semibold mb-4 text-orange-400">Site Information</h3>
              <div className="space-y-4">
                <div>
                  <span className="text-sm font-semibold text-orange-400">Brand:</span>
                  <p className="text-white font-medium">{site.brand_name}</p>
                </div>
                <div>
                  <span className="text-sm font-semibold text-blue-400">Industry:</span>
                  <p className="text-gray-300">{site.industry}</p>
                </div>
                <div>
                  <span className="text-sm font-semibold text-blue-400">Template:</span>
                  <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-cyan-300 border border-cyan-500/30">Template {site.template_id.toUpperCase()}</span>
                </div>
                <div>
                  <span className="text-sm font-semibold text-blue-400">Status:</span>
                  <span className={`ml-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                    site.status === 'published'
                      ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-500/30'
                      : 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border-yellow-500/30'
                  }`}>
                    {site.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Edit Content */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 shadow-2xl">
              <h3 className="text-lg font-semibold mb-4 text-purple-400">Edit Content</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-purple-400 mb-2">Brand Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-2xl placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 backdrop-blur-sm transition-all duration-300" 
                    value={brandName} 
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="Enter your brand name..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-purple-400 mb-2">Headline</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-2xl placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 backdrop-blur-sm transition-all duration-300" 
                    value={headline} 
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="Enter your headline..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-purple-400 mb-2">Logo</label>
                  <LogoUploader onUpload={setLogoUrl} currentUrl={logoUrl} />
                </div>
                <div className="pt-2">
                  <Button onClick={handleSave} disabled={saving} className="w-full bg-purple-500 hover:bg-purple-600 text-white border-0 shadow-lg shadow-purple-500/25 py-3 rounded-2xl font-semibold">
                    {saving ? 'Saving...' : '💾 Save Changes'}
                  </Button>
                </div>
              </div>
            </div>

            {/* T2 Template Specific Editing */}
            {site?.template_id === 't2' as any && (
              <>
                {/* Images Section */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 shadow-2xl">
                  <h3 className="text-lg font-semibold mb-6 text-cyan-400">Template Images</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-cyan-400 mb-3">Hero Image</label>
                      <ImageUploader 
                        onUpload={setHeroImage} 
                        currentUrl={heroImage}
                        label="Hero Image"
                        placeholder="Upload hero image for main section"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-cyan-400 mb-3">Feature 1 Image</label>
                      <ImageUploader 
                        onUpload={setFeatureImage1} 
                        currentUrl={featureImage1}
                        label="Feature 1 Image"
                        placeholder="Upload image for first feature"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-cyan-400 mb-3">Feature 2 Image</label>
                      <ImageUploader 
                        onUpload={setFeatureImage2} 
                        currentUrl={featureImage2}
                        label="Feature 2 Image"
                        placeholder="Upload image for second feature"
                      />
                    </div>
                  </div>
                </div>

                {/* Features Content */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 shadow-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-green-400">Features Section</h3>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={showFeatures}
                        onChange={(e) => setShowFeatures(e.target.checked)}
                        className="rounded border-slate-600 bg-slate-900/50 text-green-500 focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-300">Show Section</span>
                    </label>
                  </div>
                  {showFeatures && (
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-green-400 mb-2">Feature 1 Title</label>
                          <input
                            type="text"
                            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-2xl placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 backdrop-blur-sm transition-all duration-300"
                            value={feature1Title}
                            onChange={(e) => setFeature1Title(e.target.value)}
                            placeholder="Premium Quality"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-green-400 mb-2">Feature 2 Title</label>
                          <input
                            type="text"
                            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-2xl placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 backdrop-blur-sm transition-all duration-300"
                            value={feature2Title}
                            onChange={(e) => setFeature2Title(e.target.value)}
                            placeholder="Fast Results"
                          />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-green-400 mb-2">Feature 1 Description</label>
                          <textarea
                            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-2xl placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 backdrop-blur-sm transition-all duration-300 resize-none"
                            rows={3}
                            value={feature1Description}
                            onChange={(e) => setFeature1Description(e.target.value)}
                            placeholder="Experience the difference with our industry-leading solutions."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-green-400 mb-2">Feature 2 Description</label>
                          <textarea
                            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-2xl placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 backdrop-blur-sm transition-all duration-300 resize-none"
                            rows={3}
                            value={feature2Description}
                            onChange={(e) => setFeature2Description(e.target.value)}
                            placeholder="See immediate impact with our proven methodology."
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Section Toggles */}
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 shadow-2xl">
                  <h3 className="text-lg font-semibold mb-4 text-yellow-400">Section Visibility</h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl">
                      <span className="text-white font-medium">Pricing Section</span>
                      <input
                        type="checkbox"
                        checked={showPricing}
                        onChange={(e) => setShowPricing(e.target.checked)}
                        className="rounded border-slate-600 bg-slate-900/50 text-yellow-500 focus:ring-yellow-500"
                      />
                    </label>
                    <label className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl">
                      <span className="text-white font-medium">FAQ Section</span>
                      <input
                        type="checkbox"
                        checked={showFaq}
                        onChange={(e) => setShowFaq(e.target.checked)}
                        className="rounded border-slate-600 bg-slate-900/50 text-yellow-500 focus:ring-yellow-500"
                      />
                    </label>
                  </div>
                </div>
              </>
            )}

            {/* Actions */}
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 shadow-2xl">
              <h3 className="text-lg font-semibold mb-4 text-green-400">Actions</h3>
              <div className="space-y-3">
                <Button variant="outline" onClick={handleRegenerate} disabled={regenerating} className="w-full border-blue-400/40 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 hover:border-blue-400 backdrop-blur-sm font-semibold shadow-lg py-3 rounded-2xl">
                  {regenerating ? 'Regenerating...' : '🔄 Regenerate with AI'}
                </Button>
                {previousVersion && (
                  <Button variant="outline" onClick={handleRollback} className="w-full border-orange-400/40 bg-orange-500/10 text-orange-300 hover:bg-orange-500/20 hover:border-orange-400 backdrop-blur-sm font-semibold shadow-lg py-3 rounded-2xl">
                    ↩️ Rollback to Previous
                  </Button>
                )}
                {site.status === 'draft' && (
                  <Button onClick={handlePublish} disabled={publishing} className="w-full bg-green-500 hover:bg-green-600 text-white border-0 shadow-lg shadow-green-500/25 py-3 rounded-2xl font-semibold">
                    {publishing ? 'Publishing...' : '🚀 Publish Site'}
                  </Button>
                )}
                <Button variant="outline" onClick={handleDownload} className="w-full border-green-400/40 bg-green-500/10 text-green-300 hover:bg-green-500/20 hover:border-green-400 backdrop-blur-sm font-semibold shadow-lg py-3 rounded-2xl">
                  📦 Download Package
                </Button>
              </div>
            </div>
          </div>

          {/* Right column: Live Preview */}
          <div className="lg:col-span-3">
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl overflow-hidden shadow-2xl">
              <div className="bg-slate-700/50 px-6 py-4 border-b border-slate-600">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-green-400">Live Preview</h3>
                  {aiChangesApplying && (
                    <div className="flex items-center space-x-2 text-blue-400">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                      <span className="text-sm">Applying AI changes...</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="h-96 lg:h-[600px] relative">
                {site.generated_html && site.generated_css ? (
                  <iframe
                    key={`preview-${site.id}-${previewKey}-${brandName}-${headline}-${logoUrl}-${site?.template_id === 't2' as any ? `${heroImage}-${featureImage1}-${featureImage2}-${feature1Title}-${feature2Title}-${showFeatures}-${showPricing}-${showFaq}` : ''}`}
                    className="w-full h-full border-0 rounded-b-3xl"
                    title="Live preview"
                    srcDoc={(() => {
                      // For T2 template, we need to re-render with current editing values
                      if (site?.template_id === 't2' as any) {
                        const brandConfig = {
                          brandName: brandName || site?.brand_name || 'Brand',
                          logoUrl: logoUrl || site?.logo_url,
                          colors: {
                            primary: site?.primary_color || '#3B82F6',
                            secondary: site?.secondary_color || '#6B7280',
                            accent: site?.accent_color || '#10B981'
                          },
                          copy: {
                            headline: headline || site?.headline || 'Your Headline',
                            subheadline: site?.subheadline || 'Your subheadline',
                            cta: site?.cta || 'Get Started'
                          },
                          heroImage: heroImage,
                          featureImage1: featureImage1,
                          featureImage2: featureImage2,
                          sections: {
                            features: {
                              feature1: {
                                title: feature1Title || 'Premium Quality',
                                description: feature1Description || 'Experience the difference with our industry-leading solutions.',
                                enabled: showFeatures
                              },
                              feature2: {
                                title: feature2Title || 'Fast Results',
                                description: feature2Description || 'See immediate impact with our proven methodology.',
                                enabled: showFeatures
                              },
                              enabled: showFeatures
                            },
                            pricing: { enabled: showPricing },
                            faq: { enabled: showFaq }
                          }
                        };
                        
                        // Generate CSS variables
                        const cssVars = `
                          :root {
                            --brand-primary: ${brandConfig.colors.primary};
                            --brand-secondary: ${brandConfig.colors.secondary};
                            --brand-accent: ${brandConfig.colors.accent};
                          }
                        `;
                        
                        return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>${cssVars}</style>
</head>
<body>
  <div id="preview-root"></div>
  <script>
    // This is a simplified preview - in production, the server renders the full template
    document.getElementById('preview-root').innerHTML = \`
      <div class="min-h-screen bg-white">
        <section class="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-600 to-green-500">
          <div class="relative max-w-7xl mx-auto px-4 py-24">
            <div class="grid lg:grid-cols-2 gap-16 items-center">
              <div class="text-white">
                <div class="flex items-center mb-8">
                  ${brandConfig.logoUrl ? `<div class="bg-white/10 backdrop-blur-sm rounded-2xl p-3 mr-4"><img src="${brandConfig.logoUrl}" alt="${brandConfig.brandName}" class="h-8 w-auto filter brightness-0 invert"></div>` : ''}
                  <span class="text-2xl font-bold">${brandConfig.brandName}</span>
                </div>
                <h1 class="text-6xl lg:text-7xl font-black mb-6 leading-tight">${brandConfig.copy.headline}</h1>
                <p class="text-xl lg:text-2xl mb-10 opacity-90 leading-relaxed max-w-lg">${brandConfig.copy.subheadline}</p>
                <button class="bg-white text-blue-600 px-10 py-5 rounded-2xl text-lg font-bold hover:bg-gray-50 transition-all duration-300 shadow-2xl">${brandConfig.copy.cta}</button>
              </div>
              <div class="relative">
                <div class="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
                  <div class="aspect-[4/3] bg-white/10 rounded-2xl overflow-hidden">
                    ${brandConfig.heroImage ? `<img src="${brandConfig.heroImage}" alt="Hero image" class="w-full h-full object-cover">` : `
                      <div class="w-full h-full flex items-center justify-center text-white/60">
                        <div class="text-center">
                          <div class="text-6xl mb-4">🎯</div>
                          <p class="text-lg font-semibold">Hero Image</p>
                          <p class="text-sm opacity-75">Upload to customize</p>
                        </div>
                      </div>
                    `}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        ${brandConfig.sections.features.enabled ? `
        <section class="py-24 bg-gray-50">
          <div class="max-w-7xl mx-auto px-4">
            <div class="text-center mb-20">
              <h2 class="text-5xl font-black text-gray-900 mb-6">Why Choose Us</h2>
            </div>
            <div class="grid lg:grid-cols-2 gap-12">
              <div class="bg-white rounded-3xl p-10 shadow-xl">
                <div class="mb-8">
                  ${brandConfig.featureImage1 ? `<div class="w-20 h-20 rounded-2xl overflow-hidden shadow-lg"><img src="${brandConfig.featureImage1}" class="w-full h-full object-cover"></div>` : `<div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-400 to-blue-600 flex items-center justify-center shadow-lg"><span class="text-3xl text-white">⭐</span></div>`}
                </div>
                <h3 class="text-3xl font-bold text-gray-900 mb-4">${brandConfig.sections.features.feature1.title}</h3>
                <p class="text-lg text-gray-600">${brandConfig.sections.features.feature1.description}</p>
              </div>
              <div class="bg-white rounded-3xl p-10 shadow-xl">
                <div class="mb-8">
                  ${brandConfig.featureImage2 ? `<div class="w-20 h-20 rounded-2xl overflow-hidden shadow-lg"><img src="${brandConfig.featureImage2}" class="w-full h-full object-cover"></div>` : `<div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center shadow-lg"><span class="text-3xl text-white">⚡</span></div>`}
                </div>
                <h3 class="text-3xl font-bold text-gray-900 mb-4">${brandConfig.sections.features.feature2.title}</h3>
                <p class="text-lg text-gray-600">${brandConfig.sections.features.feature2.description}</p>
              </div>
            </div>
          </div>
        </section>
        ` : ''}
        ${brandConfig.sections.pricing.enabled ? `
        <section class="py-24 bg-white">
          <div class="max-w-7xl mx-auto px-4 text-center">
            <h2 class="text-5xl font-black text-gray-900 mb-6">Simple Pricing</h2>
            <div class="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto mt-20">
              <div class="bg-white border-2 border-gray-200 rounded-3xl p-8">
                <h3 class="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
                <div class="text-5xl font-black text-gray-900 mb-8">$99<span class="text-gray-500 text-lg">/month</span></div>
                <button class="w-full bg-gray-900 text-white py-4 rounded-2xl font-semibold">${brandConfig.copy.cta}</button>
              </div>
              <div class="bg-blue-600 text-white rounded-3xl p-8 transform scale-105 shadow-2xl">
                <div class="absolute -top-4 left-1/2 transform -translate-x-1/2"><span class="bg-white text-blue-600 px-6 py-2 rounded-full text-sm font-bold shadow-lg">Most Popular</span></div>
                <h3 class="text-2xl font-bold mb-2">Professional</h3>
                <div class="text-5xl font-black mb-8">$199<span class="text-white/80 text-lg">/month</span></div>
                <button class="w-full bg-white text-blue-600 py-4 rounded-2xl font-semibold">${brandConfig.copy.cta}</button>
              </div>
              <div class="bg-white border-2 border-gray-200 rounded-3xl p-8">
                <h3 class="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
                <div class="text-5xl font-black text-gray-900 mb-8">$399<span class="text-gray-500 text-lg">/month</span></div>
                <button class="w-full bg-gray-900 text-white py-4 rounded-2xl font-semibold">${brandConfig.copy.cta}</button>
              </div>
            </div>
          </div>
        </section>
        ` : ''}
      </div>
    \`;
  </script>
</body>
</html>`;
                      } else {
                        // For other templates, use the existing logic
                        return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <style>${site.generated_css}</style>
</head>
<body>
  ${site.generated_html
    .replace(/\$\{brand\.copy\.headline[^}]*\}/g, headline || site.headline || 'Your Headline')
    .replace(/\$\{brand\.brandName\.toUpperCase\(\)\}/g, (brandName || site.brand_name || 'Brand').toUpperCase())
    .replace(/\$\{brand\.brandName\}/g, brandName || site.brand_name || 'Brand')
    .replace(/\$\{brand\.logoUrl\s*\?\s*`[^`]*`\s*:\s*''\}/g, logoUrl ? `
            <div style="margin-bottom: 20px;">
                <img src="${logoUrl}" alt="${site.brand_name}" style="height: 60px; width: auto; max-width: 200px; object-fit: contain;" onerror="this.style.display='none';" />
            </div>
            ` : '')
    .replace(/<img[^>]*src="[^"]*"[^>]*>/gi, logoUrl ? `<img src="${logoUrl}" alt="${site.brand_name}" style="height: 60px; width: auto; max-width: 200px; object-fit: contain;" onerror="this.style.display='none';" />` : '')
  }
</body>
</html>`;
                      }
                    })()}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-b-3xl">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading preview...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
    </div>
  )
}
