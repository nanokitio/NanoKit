'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import { NanoKitLogo } from '@/components/NanoKitLogo'
import { Site } from '@/lib/types'
import { CreditCard, FileText, LogOut, Search, BarChart3, Rocket, Download, Archive, Eye, Edit, Trash2, Zap, User, Settings, Gift, HelpCircle, MessageSquare, ChevronRight, ArrowUpDown, Globe, ChevronUp, ChevronDown } from 'lucide-react'

interface SiteWithVisits extends Site {
  visits?: { count: number }[]
  is_downloaded?: boolean
  downloaded_at?: string
  download_count?: number
  deployment_count?: number // Count of AWS hosted deployments
  hosted_url?: string // URL of the most recent AWS deployment
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
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showColumnMenu, setShowColumnMenu] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [sortBy, setSortBy] = useState<'name' | 'template' | 'status' | 'downloads' | 'hosted' | 'creationDate'>('creationDate')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [visibleColumns, setVisibleColumns] = useState({
    template: true,
    status: true,
    downloads: true,
    hosted: true,
    creationDate: true
  })
  const sitesPerPage = 6
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [])
  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [viewMode, showArchived])
  
  // Close column menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (showColumnMenu && !target.closest('.column-menu-container')) {
        setShowColumnMenu(false)
      }
      if (showUserMenu && !target.closest('.user-menu-container')) {
        setShowUserMenu(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showColumnMenu, showUserMenu])

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
      let sitesData: any[] = []
      let sitesError: any = null

      // Strategy 1: Try with user_id column
      console.log('Fetching sites for user_id:', user.id)
      const result1 = await supabase
        .from('sites')
        .select(`
          *,
          visits(count),
          prelander_deployments(hosted_url, created_at)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      console.log('Result1:', { data: result1.data, error: result1.error })

      if (result1.error) {
        console.error('Error fetching by user_id:', result1.error)
        sitesError = result1.error
      } else if (result1.data && result1.data.length > 0) {
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
              visits(count),
              prelander_deployments(hosted_url, created_at)
            `)
            .eq('org_id', org.id)
            .order('created_at', { ascending: false })

          console.log('Result2:', { data: result2.data, error: result2.error })

          if (result2.error) {
            console.error('Error fetching by org_id:', result2.error)
          } else if (result2.data) {
            sitesData = result2.data
            console.log('Sites found by org_id:', sitesData.length)
          }
        }
      }

      console.log('Final sites data:', sitesData?.length || 0, 'sites')

      if (sitesError) {
        console.error('Error fetching sites:', sitesError)
        setSites([])
      } else {
        // Process sites data to extract deployment counts and latest hosted URL
        const processedSites = (sitesData || []).map((site: any) => {
          const deployments = Array.isArray(site.prelander_deployments) ? site.prelander_deployments : []
          // Sort by created_at to get the most recent
          const sortedDeployments = deployments.sort((a: any, b: any) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )
          const latestDeployment = sortedDeployments[0]
          
          return {
            ...site,
            deployment_count: deployments.length, // Count is now just the array length
            hosted_url: latestDeployment?.hosted_url || null
          }
        })
        
        console.log('Setting sites:', processedSites)
        setSites(processedSites)
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
      // Even if there's an error, try to redirect
      router.push('/')
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
    // Start with all sites or filter by archived status
    let filtered = showArchived 
      ? sites.filter(site => site.status === 'draft')
      : sites.filter(site => site.status !== 'draft')
    
    // Apply view mode filter
    switch (viewMode) {
      case 'published':
        // Published = Sites hosted with us (have AWS deployments)
        filtered = filtered.filter(site => (site.deployment_count || 0) > 0)
        break
      case 'downloaded':
        // Downloaded = Sites downloaded as ZIP file
        filtered = filtered.filter(site => site.is_downloaded)
        break
      // 'all' mode shows all non-archived sites (or all archived if showArchived is true)
    }
    
    // Apply search filter - search across multiple fields
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(site => 
        site.name?.toLowerCase().includes(query) ||
        site.brand_name?.toLowerCase().includes(query) ||
        site.slug?.toLowerCase().includes(query) ||
        site.template_id?.toLowerCase().includes(query) ||
        site.status?.toLowerCase().includes(query) ||
        formatDate(site.created_at).toLowerCase().includes(query)
      )
    }
    
    return filtered
  }
  
  const toggleSort = (column: 'name' | 'template' | 'status' | 'downloads' | 'hosted' | 'creationDate') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('desc')
    }
  }

  const getSortedSites = (sitesToSort: SiteWithVisits[]) => {
    return [...sitesToSort].sort((a, b) => {
      let aValue: any
      let bValue: any
      
      switch (sortBy) {
        case 'name':
          aValue = a.name?.toLowerCase() || a.brand_name?.toLowerCase() || ''
          bValue = b.name?.toLowerCase() || b.brand_name?.toLowerCase() || ''
          break
        case 'template':
          aValue = a.template_id || ''
          bValue = b.template_id || ''
          break
        case 'status':
          aValue = a.status || ''
          bValue = b.status || ''
          break
        case 'downloads':
          aValue = a.download_count || 0
          bValue = b.download_count || 0
          break
        case 'hosted':
          aValue = a.deployment_count || 0
          bValue = b.deployment_count || 0
          break
        case 'creationDate':
          aValue = new Date(a.created_at).getTime()
          bValue = new Date(b.created_at).getTime()
          break
        default:
          return 0
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0
      }
    })
  }

  const getPaginatedSites = () => {
    const filtered = getFilteredSites()
    const sorted = getSortedSites(filtered)
    const startIndex = (currentPage - 1) * sitesPerPage
    const endIndex = startIndex + sitesPerPage
    return sorted.slice(startIndex, endIndex)
  }
  
  const getTotalPages = () => {
    return Math.ceil(getFilteredSites().length / sitesPerPage)
  }

  const getViewModeStats = () => {
    const baseSites = showArchived 
      ? sites.filter(site => site.status === 'draft')
      : sites.filter(site => site.status !== 'draft')
    
    return {
      all: baseSites.length,
      published: baseSites.filter(site => (site.deployment_count || 0) > 0).length,
      downloaded: baseSites.filter(site => site.is_downloaded).length
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/30 to-black text-white flex items-center justify-center font-inter relative overflow-hidden">
        {/* Animated grid background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.2) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            animation: 'gridMove 20s linear infinite'
          }}></div>
        </div>
        
        <div className="text-center relative z-10">
          {/* Synth-style icon container */}
          <div className="relative w-32 h-32 mx-auto mb-8">
            {/* Outer rotating ring */}
            <div className="absolute inset-0 rounded-full border-2 border-cyan-400/30" style={{
              animation: 'spin 3s linear infinite'
            }}></div>
            
            {/* Middle pulsing ring */}
            <div className="absolute inset-2 rounded-full border-2 border-purple-500/40" style={{
              animation: 'pulse 2s ease-in-out infinite'
            }}></div>
            
            {/* Inner glowing ring */}
            <div className="absolute inset-4 rounded-full border-2 border-pink-400/50 shadow-[0_0_20px_rgba(236,72,153,0.5)]" style={{
              animation: 'pulse 1.5s ease-in-out infinite reverse'
            }}></div>
            
            {/* Center icon - lightning bolt with synth styling */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-12 h-12" style={{
                filter: 'drop-shadow(0 0 10px rgba(6, 182, 212, 0.8)) drop-shadow(0 0 20px rgba(168, 85, 247, 0.6))',
                animation: 'pulse 1s ease-in-out infinite'
              }}>
                <path 
                  d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" 
                  fill="url(#gradient1)"
                  stroke="url(#gradient2)"
                  strokeWidth="0.5"
                />
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#06b6d4', stopOpacity: 1 }} />
                    <stop offset="50%" style={{ stopColor: '#a855f7', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#ec4899', stopOpacity: 1 }} />
                  </linearGradient>
                  <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#06b6d4', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#ec4899', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            
            {/* Corner accents */}
            <div className="absolute -top-2 -left-2 w-4 h-4 border-l-2 border-t-2 border-cyan-400" style={{
              animation: 'pulse 2s ease-in-out infinite'
            }}></div>
            <div className="absolute -top-2 -right-2 w-4 h-4 border-r-2 border-t-2 border-purple-400" style={{
              animation: 'pulse 2s ease-in-out infinite 0.5s'
            }}></div>
            <div className="absolute -bottom-2 -left-2 w-4 h-4 border-l-2 border-b-2 border-purple-400" style={{
              animation: 'pulse 2s ease-in-out infinite 1s'
            }}></div>
            <div className="absolute -bottom-2 -right-2 w-4 h-4 border-r-2 border-b-2 border-pink-400" style={{
              animation: 'pulse 2s ease-in-out infinite 1.5s'
            }}></div>
          </div>
          
          {/* Loading text with glitch effect */}
          <p className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400" style={{
            animation: 'pulse 2s ease-in-out infinite',
            textShadow: '0 0 20px rgba(6, 182, 212, 0.5), 0 0 40px rgba(168, 85, 247, 0.3)'
          }}>
            Setting Up Your Nano Kit
          </p>
          
          {/* Loading dots animation */}
          <div className="flex justify-center gap-2 mt-4">
            {[0, 1, 2].map((i) => (
              <div 
                key={i}
                className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400"
                style={{
                  animation: `pulse 1.5s ease-in-out infinite ${i * 0.3}s`,
                  boxShadow: '0 0 10px rgba(6, 182, 212, 0.8)'
                }}
              ></div>
            ))}
          </div>
        </div>
        
        {/* Add keyframes for grid animation */}
        <style jsx>{`
          @keyframes gridMove {
            0% {
              transform: translateY(0);
            }
            100% {
              transform: translateY(50px);
            }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neon-accent to-black text-white overflow-hidden relative font-inter">
      {/* Clean Dashboard Background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-slate-950 to-black"></div>
      </div>

      {/* Header */}
      <header className="relative z-50 bg-dark-surface/80 backdrop-blur-xl shadow-neon" style={{ borderBottom: 'none' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-6">
              <NanoKitLogo size="header" href="/dashboard" />
            </div>
            <div className="flex items-center gap-4">
              {/* Welcome text primero */}
              <p className="text-sm text-text-muted font-inter">
                Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 font-semibold">
                  {user?.user_metadata?.preferred_name || user?.email?.split('@')[0] || 'Creator'}
                </span> — Powering Up...
              </p>
              {/* Botón M del User Menu después */}
              <div className="relative user-menu-container">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg hover:scale-110 transition-transform duration-200 shadow-lg shadow-purple-500/30"
                  title="User Menu"
                >
                  {(user?.user_metadata?.preferred_name || user?.email?.split('@')[0] || 'U')[0].toUpperCase()}
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-72 bg-slate-800/95 backdrop-blur-xl border border-cyan-500/30 rounded-xl shadow-2xl shadow-cyan-500/20 z-[9999] overflow-hidden">
                    {/* User Info Header */}
                    <div className="p-4 border-b border-slate-700/50 bg-gradient-to-r from-slate-800 to-slate-700">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {(user?.user_metadata?.preferred_name || user?.email?.split('@')[0] || 'U')[0].toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-white truncate">
                              {user?.user_metadata?.preferred_name || user?.email?.split('@')[0] || 'User'}
                            </p>
                            <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-xs font-medium rounded-full border border-cyan-500/30">
                              Owner
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 truncate mt-0.5">
                            {organization?.name || 'NanoKit Account'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Menu Items */}
                    <div className="py-2">
                      <button
                        onClick={() => {
                          setShowUserMenu(false)
                          router.push('/profile')
                        }}
                        className="w-full px-4 py-2.5 text-left text-sm text-slate-300 hover:bg-slate-700/50 hover:text-cyan-400 transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <User className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300 transition-colors" style={{ filter: 'drop-shadow(0 0 6px rgba(34, 211, 238, 0.5))' }} />
                          <span className="font-medium">Profile</span>
                        </div>
                      </button>
                      
                      <button
                        onClick={() => {
                          setShowUserMenu(false)
                          router.push('/subscription')
                        }}
                        className="w-full px-4 py-2.5 text-left text-sm text-slate-300 hover:bg-slate-700/50 hover:text-purple-400 transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <Settings className="w-5 h-5 text-purple-400 group-hover:text-purple-300 transition-colors" style={{ filter: 'drop-shadow(0 0 6px rgba(168, 85, 247, 0.5))' }} />
                          <span className="font-medium">Account & Subscription</span>
                        </div>
                      </button>
                      
                      <button
                        onClick={() => {
                          setShowUserMenu(false)
                          // router.push('/referral') // Coming soon
                        }}
                        className="w-full px-4 py-2.5 text-left text-sm text-slate-400 hover:bg-slate-700/50 hover:text-green-400 transition-all flex items-center justify-between group opacity-60 cursor-not-allowed"
                        title="Coming Soon"
                      >
                        <div className="flex items-center gap-3">
                          <Gift className="w-5 h-5 text-green-400/60 group-hover:text-green-300 transition-colors" style={{ filter: 'drop-shadow(0 0 6px rgba(34, 197, 94, 0.3))' }} />
                          <div>
                            <span className="font-medium">My Referral</span>
                            <span className="ml-2 text-xs text-slate-500">Coming Soon</span>
                          </div>
                        </div>
                      </button>
                      
                      <button
                        onClick={() => {
                          setShowUserMenu(false)
                          router.push('/support')
                        }}
                        className="w-full px-4 py-2.5 text-left text-sm text-slate-300 hover:bg-slate-700/50 hover:text-cyan-400 transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <HelpCircle className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300 transition-colors" style={{ filter: 'drop-shadow(0 0 6px rgba(34, 211, 238, 0.5))' }} />
                          <span className="font-medium">Support</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                      </button>
                      
                      <button
                        onClick={() => {
                          setShowUserMenu(false)
                          router.push('/feedback')
                        }}
                        className="w-full px-4 py-2.5 text-left text-sm text-slate-300 hover:bg-slate-700/50 hover:text-yellow-400 transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <MessageSquare className="w-5 h-5 text-yellow-400 group-hover:text-yellow-300 transition-colors" style={{ filter: 'drop-shadow(0 0 6px rgba(234, 179, 8, 0.5))' }} />
                          <span className="font-medium">Quick Feedback</span>
                        </div>
                      </button>
                    </div>
                    
                    {/* Log Out */}
                    <div className="border-t border-slate-700/50">
                      <button
                        onClick={() => {
                          setShowUserMenu(false)
                          handleSignOut()
                        }}
                        className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all flex items-center gap-3 group"
                      >
                        <LogOut className="w-5 h-5 text-red-400 group-hover:text-red-300 transition-colors" style={{ filter: 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.6))' }} />
                        <span className="font-medium">Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-12 shadow-2xl shadow-purple-500/10" style={{ border: 'none' }}>
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-400 rounded-2xl flex items-center justify-center mb-6">
                <div className="text-white font-black text-3xl">⚡</div>
              </div>
              <h3 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Welcome to NanoKit</h3>
              <p className="text-lg text-slate-300 mb-8 max-w-md mx-auto">
                Ready to create your first digital experience? Let's build something extraordinary together.
              </p>
              <Button 
                onClick={handleQuickCreate}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white border-0 shadow-lg hover:shadow-xl hover:shadow-purple-500/25 text-lg px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105"
              >
                <span className="flex items-center gap-2">
                  <Zap className="w-5 h-5" style={{ filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.8))' }} />
                  Create Your First Site
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
                  <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Your Launch Center</h2>
                  <p className="mt-2 text-lg text-slate-300">
                    manage your digital assets here
                  </p>
                </div>
                <Button 
                  onClick={handleQuickCreate}
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white border-0 shadow-lg hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 font-semibold px-6 py-4 text-base"
                >
                  <span className="flex items-center gap-2">
                    <Zap className="w-5 h-5" style={{ filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.8))' }} />
                    Create New Site
                  </span>
                </Button>
              </div>
              
              {/* Search Bar */}
              <div className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by site name, brand, template, status, or date..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setCurrentPage(1) // Reset to first page on search
                    }}
                    className="w-full px-4 py-3 pl-12 bg-slate-900/60 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 backdrop-blur-sm transition-all duration-300"
                    style={{ border: 'none' }}
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-400">
                    <Search className="w-5 h-5" style={{ filter: 'drop-shadow(0 0 8px rgba(34, 211, 238, 0.6))' }} />
                  </div>
                  {searchQuery && (
                    <button
                      onClick={() => {
                        setSearchQuery('')
                        setCurrentPage(1)
                      }}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                      title="Clear search"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
              
              {/* Filter Pills - Horizontal Layout */}
              <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl p-6 shadow-xl" style={{ border: 'none' }}>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  {/* View Mode Filters */}
                  <div className="flex items-center space-x-3">
                    {(['all', 'published', 'downloaded'] as const).map((mode) => {
                      const stats = getViewModeStats()
                      const count = stats[mode]
                      const icons = {
                        all: <BarChart3 className="w-5 h-5" style={{ filter: 'drop-shadow(0 0 6px rgba(34, 211, 238, 0.5))' }} />,
                        published: <Rocket className="w-5 h-5" style={{ filter: 'drop-shadow(0 0 6px rgba(168, 85, 247, 0.5))' }} />,
                        downloaded: <Download className="w-5 h-5" style={{ filter: 'drop-shadow(0 0 6px rgba(34, 211, 238, 0.5))' }} />
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
                              ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white shadow-lg shadow-cyan-500/20' 
                              : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
                          }`}
                          style={{ border: 'none' }}
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
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      showArchived
                        ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white shadow-lg shadow-cyan-500/20'
                        : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
                    }`}
                    style={{ border: 'none' }}
                  >
                    <span className="flex items-center space-x-2">
                      {showArchived ? <Archive className="w-5 h-5" style={{ filter: 'drop-shadow(0 0 6px rgba(168, 85, 247, 0.5))' }} /> : <Archive className="w-5 h-5" style={{ filter: 'drop-shadow(0 0 6px rgba(100, 116, 139, 0.5))' }} />}
                      <span>{showArchived ? 'Show Active' : 'Show Archived'}</span>
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 flow-root">
              <div className="relative z-20 bg-slate-900/60 backdrop-blur-xl rounded-2xl shadow-2xl shadow-purple-500/10" style={{ border: 'none' }}>
                {/* Column Menu */}
                <div className="flex justify-end p-4" style={{ border: 'none' }}>
                  <div className="relative column-menu-container">
                    <button
                      onClick={() => setShowColumnMenu(!showColumnMenu)}
                      className="p-2 rounded-xl bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 transition-all duration-300"
                      style={{ border: 'none' }}
                      title="Manage columns"
                    >
                      ⋮
                    </button>
                    
                    {showColumnMenu && (
                      <div className="absolute right-0 mt-2 w-56 bg-slate-800/95 backdrop-blur-xl rounded-xl shadow-2xl z-[100] p-3" style={{ border: 'none' }}>
                        <div className="text-xs font-bold text-cyan-300 uppercase mb-3">SHOW/HIDE COLUMNS</div>
                        {Object.entries({
                          template: 'Template',
                          status: 'Status',
                          downloads: 'Downloads',
                          hosted: 'Hosted',
                          creationDate: 'Creation Date'
                        }).map(([key, label]) => (
                          <label key={key} className="flex items-center gap-2 py-2 px-2 hover:bg-slate-700/50 rounded-lg cursor-pointer transition-colors">
                            <input
                              type="checkbox"
                              checked={visibleColumns[key as keyof typeof visibleColumns]}
                              onChange={(e) => setVisibleColumns(prev => ({ ...prev, [key]: e.target.checked }))}
                              className="w-4 h-4 rounded border-slate-600 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-800"
                            />
                            <span className="text-sm text-slate-300">{label}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gradient-to-r from-slate-800/50 to-slate-700/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-cyan-300 uppercase tracking-wide">
                          <button 
                            onClick={() => toggleSort('name')}
                            className="flex items-center gap-2 hover:text-cyan-200 transition-colors"
                          >
                            Name
                            {sortBy === 'name' ? (
                              sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4 opacity-30" />
                            )}
                          </button>
                        </th>
                        {visibleColumns.template && (
                          <th className="px-6 py-4 text-left text-xs font-medium text-cyan-300 uppercase tracking-wide">
                            <button 
                              onClick={() => toggleSort('template')}
                              className="flex items-center gap-2 hover:text-cyan-200 transition-colors"
                            >
                              Template
                              {sortBy === 'template' ? (
                                sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4 opacity-30" />
                              )}
                            </button>
                          </th>
                        )}
                        {visibleColumns.status && (
                          <th className="px-6 py-4 text-left text-xs font-medium text-cyan-300 uppercase tracking-wide">
                            <button 
                              onClick={() => toggleSort('status')}
                              className="flex items-center gap-2 hover:text-cyan-200 transition-colors"
                            >
                              Status
                              {sortBy === 'status' ? (
                                sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4 opacity-30" />
                              )}
                            </button>
                          </th>
                        )}
                        {visibleColumns.downloads && (
                          <th className="px-6 py-4 text-left text-xs font-medium text-cyan-300 uppercase tracking-wide">
                            <button 
                              onClick={() => toggleSort('downloads')}
                              className="flex items-center gap-2 hover:text-cyan-200 transition-colors"
                            >
                              Downloads
                              {sortBy === 'downloads' ? (
                                sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4 opacity-30" />
                              )}
                            </button>
                          </th>
                        )}
                        {visibleColumns.hosted && (
                          <th className="px-6 py-4 text-left text-xs font-medium text-cyan-300 uppercase tracking-wide">
                            <button 
                              onClick={() => toggleSort('hosted')}
                              className="flex items-center gap-2 hover:text-cyan-200 transition-colors"
                            >
                              Hosted
                              {sortBy === 'hosted' ? (
                                sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4 opacity-30" />
                              )}
                            </button>
                          </th>
                        )}
                        {visibleColumns.creationDate && (
                          <th className="px-6 py-4 text-left text-xs font-medium text-cyan-300 uppercase tracking-wide">
                            <button 
                              onClick={() => toggleSort('creationDate')}
                              className="flex items-center gap-2 hover:text-cyan-200 transition-colors"
                            >
                              Creation Date
                              {sortBy === 'creationDate' ? (
                                sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4 opacity-30" />
                              )}
                            </button>
                          </th>
                        )}
                        <th className="px-6 py-4 text-center text-xs font-medium text-cyan-300 uppercase tracking-wide">
                          Quick Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {getPaginatedSites().map((site) => (
                        <tr key={site.id} className="hover:bg-slate-800/30 transition-colors duration-200">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {site.logo_url && (
                                <img
                                  className="h-10 w-10 rounded-full mr-4"
                                  style={{ border: 'none' }}
                                  src={site.logo_url}
                                  alt=""
                                />
                              )}
                              <div>
                                <div className="text-sm font-semibold text-white">
                                  {site.name || site.brand_name || 'Untitled Site'}
                                </div>
                                <div className="text-sm text-slate-400">
                                  /{site.slug}
                                </div>
                              </div>
                            </div>
                          </td>
                          {visibleColumns.template && (
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-cyan-300" style={{ border: 'none' }}>
                                Template {site.template_id.toUpperCase()}
                              </span>
                            </td>
                          )}
                          {visibleColumns.status && (
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                  site.status === 'published'
                                    ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300'
                                    : 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300'
                                }`}
                                style={{ border: 'none' }}
                              >
                                {site.status}
                              </span>
                            </td>
                          )}
                          {visibleColumns.downloads && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                              {site.is_downloaded ? (
                                <span className="flex items-center gap-2">
                                  <Download className="w-4 h-4 text-cyan-400" style={{ filter: 'drop-shadow(0 0 4px rgba(34, 211, 238, 0.5))' }} />
                                  {site.download_count || 1}
                                </span>
                              ) : (
                                <span className="text-gray-500">-</span>
                              )}
                            </td>
                          )}
                          {visibleColumns.hosted && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                              {site.hosted_url ? (
                                <a 
                                  href={site.hosted_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
                                  title={site.hosted_url}
                                >
                                  <Globe className="w-4 h-4" style={{ filter: 'drop-shadow(0 0 4px rgba(168, 85, 247, 0.5))' }} />
                                  <span className="max-w-[120px] truncate text-xs">
                                    {site.hosted_url.replace(/^https?:\/\/[^\/]+\//, '').split('/').pop()?.substring(0, 15) || 'View'}...
                                  </span>
                                </a>
                              ) : (site.deployment_count || 0) > 0 ? (
                                <span className="flex items-center gap-2">
                                  <Globe className="w-4 h-4 text-purple-400" style={{ filter: 'drop-shadow(0 0 4px rgba(168, 85, 247, 0.5))' }} />
                                  <span className="text-purple-300">{site.deployment_count}</span>
                                </span>
                              ) : (
                                <span className="text-gray-500">-</span>
                              )}
                            </td>
                          )}
                          {visibleColumns.creationDate && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                              {formatDate(site.created_at)}
                            </td>
                          )}
                          <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                            <div className="flex items-center justify-center space-x-3">
                              <Link
                                href={`/sites/${site.slug}`}
                                className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors duration-200"
                                target="_blank"
                              >
                                <span className="flex items-center gap-1.5">
                                  <Eye className="w-4 h-4" style={{ filter: 'drop-shadow(0 0 4px rgba(34, 211, 238, 0.5))' }} />
                                  Preview
                                </span>
                              </Link>
                              <Link
                                href={`/sites/${site.slug}/edit`}
                                className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200"
                              >
                                <span className="flex items-center gap-1.5">
                                  <Edit className="w-4 h-4" style={{ filter: 'drop-shadow(0 0 4px rgba(168, 85, 247, 0.5))' }} />
                                  Edit
                                </span>
                              </Link>
                              <button
                                onClick={() => handleArchiveToggle(site)}
                                disabled={archivingId === site.id}
                                className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {archivingId === site.id ? 'Processing...' : (
                                  <span className="flex items-center gap-1.5">
                                    <Archive className="w-4 h-4" style={{ filter: 'drop-shadow(0 0 4px rgba(234, 179, 8, 0.5))' }} />
                                    {site.status === 'draft' ? 'Activate' : 'Archive'}
                                  </span>
                                )}
                              </button>
                              <button
                                onClick={() => handleDeleteClick(site)}
                                disabled={deletingId === site.id}
                                className="text-red-400 hover:text-red-300 font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {deletingId === site.id ? 'Deleting...' : (
                                  <span className="flex items-center gap-1.5">
                                    <Trash2 className="w-4 h-4" style={{ filter: 'drop-shadow(0 0 4px rgba(239, 68, 68, 0.5))' }} />
                                    Delete
                                  </span>
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Pagination Controls */}
              {getTotalPages() > 1 && (
                <div className="mt-6 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-xl bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{ border: 'none' }}
                  >
                    ← Previous
                  </button>
                  
                  <div className="flex items-center gap-2">
                    {Array.from({ length: getTotalPages() }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-xl font-semibold transition-all duration-300 ${
                          currentPage === page
                            ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white'
                            : 'bg-slate-800/50 text-slate-300'
                        }`}
                        style={{ border: 'none' }}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(getTotalPages(), currentPage + 1))}
                    disabled={currentPage === getTotalPages()}
                    className="px-4 py-2 rounded-xl bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{ border: 'none' }}
                  >
                    Next →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && siteToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl p-8 max-w-md w-full shadow-2xl shadow-red-500/10" style={{ border: 'none' }}>
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-500/20 mb-6" style={{ border: 'none' }}>
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
                  className="flex-1 bg-slate-800/50 text-slate-300 hover:bg-slate-700 hover:text-white"
                  style={{ border: 'none' }}
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
