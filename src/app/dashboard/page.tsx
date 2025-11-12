'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import { NanoKitLogo } from '@/components/NanoKitLogo'
import { Site } from '@/lib/types'

interface SiteWithVisits extends Site {
  visits?: { count: number }[]
  is_downloaded?: boolean
  is_published?: boolean
  downloaded_at?: string
  published_at?: string
  download_count?: number
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [organization, setOrganization] = useState<any>(null)
  const [sites, setSites] = useState<SiteWithVisits[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [archivingId, setArchivingId] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [siteToDelete, setSiteToDelete] = useState<SiteWithVisits | null>(null)
  const [showArchived, setShowArchived] = useState(false)
  const [viewMode, setViewMode] = useState<'all' | 'published' | 'downloaded'>('all')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        console.log('Auth error or no user:', authError)
        router.push('/login')
        return
      }

      setUser(user)

      // Try to get user's organization (optional)
      const { data: org } = await supabase
        .from('organizations')
        .select('*')
        .eq('owner_user_id', user.id)
        .maybeSingle()

      if (org) {
        console.log('Organization found:', org)
        setOrganization(org)
      } else {
        console.log('No organization found, will query sites by user_id only')
      }

      // Get user's sites - try multiple strategies
      let sitesData = null
      const sitesError = null

      // Strategy 1: Try with user_id column
      const result1 = await supabase
        .from('sites')
        .select(`
          *,
          visits(count)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (!result1.error && result1.data && result1.data.length > 0) {
        sitesData = result1.data
        console.log('Sites found by user_id:', sitesData.length)
      } else {
        console.log('No sites found by user_id, trying org_id...')
        
        // Strategy 2: Try with org_id if organization exists
        if (org) {
          const result2 = await supabase
            .from('sites')
            .select(`
              *,
              visits(count)
            `)
            .eq('org_id', org.id)
            .order('created_at', { ascending: false })

          if (!result2.error && result2.data) {
            sitesData = result2.data
            console.log('Sites found by org_id:', sitesData.length)
          }
        }
      }

      console.log('Final sites data:', sitesData)

      if (sitesError) {
        console.error('Error fetching sites:', sitesError)
        setSites([])
      } else {
        console.log('Setting sites:', sitesData)
        setSites(sitesData || [])
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (site: SiteWithVisits) => {
    setSiteToDelete(site)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!siteToDelete) return
    
    setDeletingId(siteToDelete.id)
    
    try {
      // First delete related visits (if any)
      await supabase
        .from('visits')
        .delete()
        .eq('site_id', siteToDelete.id)

      // Then delete the site
      const { error } = await supabase
        .from('sites')
        .delete()
        .eq('id', siteToDelete.id)

      if (error) {
        console.error('Error deleting site:', error)
        alert('Error deleting site. Please try again.')
      } else {
        // Remove from local state
        setSites(sites.filter(site => site.id !== siteToDelete.id))
        setShowDeleteModal(false)
        setSiteToDelete(null)
        
        // Show success message
        const successDiv = document.createElement('div')
        successDiv.className = 'fixed top-4 right-4 z-50 bg-green-500/20 border border-green-500/30 text-green-300 px-4 py-3 rounded-xl backdrop-blur-sm'
        successDiv.textContent = `"${siteToDelete.brand_name}" has been deleted successfully`
        document.body.appendChild(successDiv)
        
        setTimeout(() => {
          document.body.removeChild(successDiv)
        }, 3000)
      }
    } catch (error) {
      console.error('Error deleting site:', error)
      alert('Error deleting site. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteModal(false)
    setSiteToDelete(null)
  }

  const handleArchiveToggle = async (site: SiteWithVisits) => {
    setArchivingId(site.id)
    
    try {
      // Use status field: 'draft' = archived, 'published' = active
      const newStatus = site.status === 'published' ? 'draft' : 'published'
      
      const { error } = await supabase
        .from('sites')
        .update({ status: newStatus })
        .eq('id', site.id)

      if (error) {
        console.error('Error archiving site:', error)
        console.error('Full error:', JSON.stringify(error, null, 2))
        alert(`Error updating site: ${error.message}`)
      } else {
        // Update local state
        setSites(sites.map(s => 
          s.id === site.id ? { ...s, status: newStatus } : s
        ))
        
        // Show success message
        const successDiv = document.createElement('div')
        successDiv.className = 'fixed top-4 right-4 z-50 bg-green-500/20 border border-green-500/30 text-green-300 px-4 py-3 rounded-xl backdrop-blur-sm'
        successDiv.textContent = `"${site.brand_name}" has been ${newStatus === 'published' ? 'activated' : 'archived'} successfully`
        document.body.appendChild(successDiv)
        
        setTimeout(() => {
          document.body.removeChild(successDiv)
        }, 3000)
      }
    } catch (error: any) {
      console.error('Error updating site:', error)
      alert(`Error updating site: ${error?.message || 'Unknown error'}`)
    } finally {
      setArchivingId(null)
    }
  }

  const handleQuickCreate = async () => {
    try {
      setLoading(true)
      
      // Call the generate API to create the site with rendered HTML/CSS
      // The API will handle organization creation if needed
      console.log('About to call API with templateId: t6')
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId: 't6',
          brandName: 'My New Site',
          industry: 'Casino & Gaming',
          description: 'A new gaming site',
          ctaUrl: 'https://example.com',
          preferredColors: {
            primary: '#FFD700',
            secondary: '#FFA500',
            accent: '#22c55e'
          }
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        console.error('API Error:', errorData)
        throw new Error(errorData.error || 'Failed to generate site')
      }

      const result = await response.json()
      console.log('API Result:', result)

      if (!result.success) {
        throw new Error('Site generation failed')
      }

      // Redirect to editor
      router.push(`/sites/${result.data.slug}/edit`)
    } catch (error: any) {
      console.error('Error creating site:', error)
      alert(`Error creating site: ${error?.message || 'Unknown error'}\n\nCheck console for details.`)
    } finally {
      setLoading(false)
    }
  }

  const getFilteredSites = () => {
    const filtered = sites.filter(site => showArchived ? site.status === 'draft' : site.status === 'published')
    
    switch (viewMode) {
      case 'published':
        // Consider a site published if status is 'published' OR is_published is true
        return filtered.filter(site => site.status === 'published' || site.is_published)
      case 'downloaded':
        return filtered.filter(site => site.is_downloaded)
      default:
        return filtered
    }
  }

  const getViewModeStats = () => {
    const allSites = sites.filter(site => showArchived ? site.status === 'draft' : site.status === 'published')
    return {
      all: allSites.length,
      published: allSites.filter(site => site.status === 'published' || site.is_published).length,
      downloaded: allSites.filter(site => site.is_downloaded).length
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-neon-accent to-black text-white flex items-center justify-center font-inter">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-neon-primary via-neon-secondary to-neon-primary rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-neon animate-glow">
            <div className="text-black font-black text-2xl">⚡</div>
          </div>
          <p className="text-text-muted font-inter">Loading your forge...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neon-accent to-black text-white overflow-hidden relative font-inter">
      {/* NetFusion Neon Dashboard Background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-neon-accent/30 to-black"></div>
        
        {/* Floating geometric shapes with neon colors */}
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${4 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            >
              {i % 3 === 0 && <div className="w-8 h-8 border border-neon-primary/30 rotate-45"></div>}
              {i % 3 === 1 && <div className="w-6 h-6 border border-neon-secondary/30 rounded-full"></div>}
              {i % 3 === 2 && <div className="w-12 h-2 bg-gradient-to-r from-neon-primary/20 to-neon-secondary/20"></div>}
            </div>
          ))}
        </div>
        
        {/* Subtle grid pattern with neon colors */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(2, 193, 115, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(2, 193, 115, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-dark-surface/80 backdrop-blur-xl border-b border-neon-primary/20 shadow-neon">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-6">
              <NanoKitLogo size="header" href="/" />
              <div className="border-l border-neon-primary/30 pl-6">
                <h2 className="text-2xl font-bold text-white font-inter">
                  Dashboard
                </h2>
                <div className="flex items-center gap-4">
                  <p className="text-sm text-text-muted font-inter">
                    Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 font-semibold">
                      {user?.user_metadata?.preferred_name || user?.email?.split('@')[0] || 'Creator'}
                    </span>! 👋
                  </p>
                  {organization?.user_code && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-neon-primary/20 border border-neon-primary/40 rounded-lg backdrop-blur-sm">
                      <span className="text-xs text-neon-primary font-medium">User Code:</span>
                      <span className="text-sm font-bold text-neon-primary font-mono">{organization.user_code}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <form action="/auth/signout" method="post">
                <Button variant="outline" type="submit" className="border-neon-primary/50 bg-dark-surface/50 text-neon-primary hover:bg-neon-primary hover:text-black hover:border-neon-primary backdrop-blur-sm transition-all duration-300 font-inter">
                  Sign Out
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Debug info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-4 p-4 bg-gray-800 rounded-lg text-white text-sm">
            <p>Debug: Sites length: {sites?.length || 0}</p>
            <p>Debug: Organization: {organization?.id || 'none'}</p>
            <p>Debug: User: {user?.id || 'none'}</p>
          </div>
        )}
        
        {!sites || sites.length === 0 ? (
          // Empty State
          <div className="text-center py-12">
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-12 shadow-2xl shadow-purple-500/10">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-400 rounded-2xl flex items-center justify-center mb-6">
                <div className="text-white font-black text-3xl">⚡</div>
              </div>
              <h3 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Your Forge Awaits</h3>
              <p className="text-lg text-slate-300 mb-8 max-w-md mx-auto">
                Ready to forge your first digital experience? Let's create something extraordinary together.
              </p>
              <Button 
                onClick={handleQuickCreate}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white border-0 shadow-lg hover:shadow-xl hover:shadow-purple-500/25 text-lg px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105"
              >
                <span className="flex items-center">
                  <span className="mr-2">⚡</span>
                  Forge Your First Site
                </span>
              </Button>
            </div>
          </div>
        ) : (
          // Sites Table
          <div>
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Your Forge</h2>
                  <p className="mt-2 text-lg text-slate-300">
                    Manage your forged digital experiences
                  </p>
                </div>
                <Button 
                  onClick={handleQuickCreate}
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white border-0 shadow-lg hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 font-semibold px-8 py-6 text-lg"
                >
                  <span className="flex items-center">
                    <span className="mr-2 text-xl">⚡</span>
                    Create New Site
                  </span>
                </Button>
              </div>
              
              {/* Filter Pills - Horizontal Layout */}
              <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  {/* View Mode Filters */}
                  <div className="flex items-center space-x-3">
                    {(['all', 'published', 'downloaded'] as const).map((mode) => {
                      const stats = getViewModeStats()
                      const count = stats[mode]
                      const icons = {
                        all: '📊',
                        published: '🚀',
                        downloaded: '📥'
                      }
                      const labels = {
                        all: 'All Sites',
                        published: 'Published',
                        downloaded: 'Downloaded'
                      }
                      const isActive = viewMode === mode
                      
                      return (
                        <button
                          key={mode}
                          onClick={() => setViewMode(mode)}
                          className={`group relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                            isActive 
                              ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-2 border-cyan-400/50 text-white shadow-lg shadow-cyan-500/20' 
                              : 'bg-slate-800/50 border-2 border-slate-700/50 text-slate-300 hover:border-slate-600 hover:bg-slate-700/50'
                          }`}
                        >
                          <span className="flex items-center space-x-2">
                            <span className="text-lg">{icons[mode]}</span>
                            <span>{labels[mode]}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                              isActive 
                                ? 'bg-cyan-400/30 text-cyan-300' 
                                : 'bg-slate-700 text-slate-400'
                            }`}>
                              {count}
                            </span>
                          </span>
                        </button>
                      )
                    })}
                  </div>
                  
                  {/* Archive Toggle */}
                  <button
                    onClick={() => setShowArchived(!showArchived)}
                    className="px-6 py-3 rounded-xl font-semibold bg-slate-800/50 border-2 border-slate-700/50 text-slate-300 hover:border-slate-600 hover:bg-slate-700/50 transition-all duration-300"
                  >
                    <span className="flex items-center space-x-2">
                      <span className="text-lg">{showArchived ? '📂' : '🗄️'}</span>
                      <span>{showArchived ? 'Show Active' : 'Show Archived'}</span>
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 flow-root">
              <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl shadow-purple-500/10">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-700/50">
                    <thead className="bg-gradient-to-r from-slate-800/50 to-slate-700/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-cyan-300 uppercase tracking-wide">
                          Site
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-cyan-300 uppercase tracking-wide">
                          Template
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-cyan-300 uppercase tracking-wide">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-cyan-300 uppercase tracking-wide">
                          Published
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-cyan-300 uppercase tracking-wide">
                          Downloads
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-cyan-300 uppercase tracking-wide">
                          Visits
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-cyan-300 uppercase tracking-wide">
                          Created
                        </th>
                        <th className="relative px-6 py-4">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/30">
                      {getFilteredSites().map((site) => (
                        <tr key={site.id} className="hover:bg-slate-800/30 transition-colors duration-200">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {site.logo_url && (
                                <img
                                  className="h-10 w-10 rounded-full mr-4 border-2 border-cyan-400/30"
                                  src={site.logo_url}
                                  alt=""
                                />
                              )}
                              <div>
                                <div className="text-sm font-semibold text-white">
                                  {site.brand_name}
                                </div>
                                <div className="text-sm text-slate-400">
                                  /{site.slug}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                              Template {site.template_id.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                                site.status === 'published'
                                  ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-500/30'
                                  : 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border-yellow-500/30'
                              }`}
                            >
                              {site.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {site.is_published ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border border-green-500/30">
                                🚀 Yes
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-300 border border-gray-500/30">
                                📝 Draft
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                            {site.is_downloaded ? (
                              <span className="flex items-center gap-1">
                                📥 {site.download_count || 1}
                              </span>
                            ) : (
                              <span className="text-gray-500">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                            {site.visits?.[0]?.count || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                            {formatDate(site.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-3">
                              <Link
                                href={`/sites/${site.slug}`}
                                className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors duration-200"
                                target="_blank"
                              >
                                👁️ Preview
                              </Link>
                              <Link
                                href={`/sites/${site.slug}/edit`}
                                className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200"
                              >
                                ✏️ Edit
                              </Link>
                              <button
                                onClick={() => handleArchiveToggle(site)}
                                disabled={archivingId === site.id}
                                className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {archivingId === site.id ? 'Processing...' : (site.status === 'draft' ? '📂 Activate' : '🗄️ Archive')}
                              </button>
                              {site.status === 'draft' && (
                                <button
                                  onClick={() => handleDeleteClick(site)}
                                  disabled={deletingId === site.id}
                                  className="text-red-400 hover:text-red-300 font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {deletingId === site.id ? 'Deleting...' : '🗑️ Delete'}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && siteToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 max-w-md w-full shadow-2xl shadow-red-500/10">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-500/20 border border-red-500/30 mb-6">
                <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold mb-4 text-white">
                Delete Site?
              </h3>
              
              <p className="text-slate-300 mb-2">
                Are you sure you want to delete <span className="font-semibold text-white">"{siteToDelete.brand_name}"</span>?
              </p>
              
              <p className="text-sm text-slate-400 mb-8">
                This action cannot be undone. All data associated with this site will be permanently removed.
              </p>
              
              <div className="flex space-x-4">
                <Button
                  onClick={handleDeleteCancel}
                  variant="outline"
                  className="flex-1 border-slate-600 bg-slate-800/50 text-slate-300 hover:bg-slate-700 hover:text-white hover:border-slate-500"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDeleteConfirm}
                  disabled={deletingId === siteToDelete.id}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white border-0 shadow-lg hover:shadow-xl hover:shadow-red-500/25 transition-all duration-300"
                >
                  {deletingId === siteToDelete.id ? (
                    <span className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Deleting...
                    </span>
                  ) : (
                    'Delete Site'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg);
            opacity: 0.7;
          }
          50% { 
            transform: translateY(-8px) rotate(180deg);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
