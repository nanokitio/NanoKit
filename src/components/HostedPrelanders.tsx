'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Globe, ExternalLink, Copy, Check, Calendar } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Deployment {
  id: string
  hosted_url: string
  created_at: string
  site_id: string
  domain_lock?: string
  sites?: {
    brand_name: string
    slug: string
  } | null
}

export function HostedPrelanders() {
  const [deployments, setDeployments] = useState<Deployment[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    loadDeployments()
  }, [])

  const loadDeployments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('prelander_deployments')
        .select(`
          id,
          hosted_url,
          created_at,
          site_id,
          domain_lock,
          sites!inner (
            brand_name,
            slug
          )
        `)
        .eq('user_id', user.id)
        .eq('package_type', 'aws_hosted')
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) throw error

      // Map the data to handle Supabase's array return for relations
      const mappedData = (data || []).map(d => ({
        ...d,
        sites: Array.isArray(d.sites) ? d.sites[0] : d.sites
      }))

      setDeployments(mappedData as Deployment[])
    } catch (error) {
      console.error('Error loading deployments:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-sm rounded-xl border border-cyan-500/20 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-slate-700/50 rounded w-1/4"></div>
          <div className="h-20 bg-slate-700/50 rounded"></div>
        </div>
      </div>
    )
  }

  if (deployments.length === 0) {
    return (
      <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-sm rounded-xl border border-cyan-500/20 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-cyan-500/10 rounded-lg">
            <Globe className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Hosted Prelanders</h3>
            <p className="text-sm text-gray-400">AWS-hosted prelanders with live URLs</p>
          </div>
        </div>
        <div className="text-center py-8 text-gray-400">
          <Globe className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No hosted prelanders yet</p>
          <p className="text-sm mt-1">Use "Host with Us" to deploy your first prelander</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-sm rounded-xl border border-cyan-500/20 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 rounded-lg">
            <Globe className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Hosted Prelanders</h3>
            <p className="text-sm text-gray-400">{deployments.length} active deployment{deployments.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {deployments.map((deployment) => (
          <div
            key={deployment.id}
            className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 hover:border-cyan-500/30 transition-all group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-semibold mb-1 truncate">
                  {deployment.sites?.brand_name || 'Unnamed Site'}
                </h4>
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(deployment.created_at)}</span>
                  {deployment.domain_lock && (
                    <>
                      <span className="text-gray-600">•</span>
                      <span className="text-yellow-400">🔒 Domain Locked</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2 bg-slate-900/50 rounded px-3 py-2 border border-slate-700/50">
                  <Globe className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <p className="text-sm text-gray-300 truncate font-mono flex-1">
                    {deployment.hosted_url}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => window.open(deployment.hosted_url, '_blank')}
                  className="flex items-center gap-2 px-3 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-lg transition-all border border-cyan-500/30 hover:border-cyan-400/50 text-sm font-medium"
                  title="Open in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="hidden sm:inline">Open</span>
                </button>
                <button
                  onClick={() => copyToClipboard(deployment.hosted_url, deployment.id)}
                  className="flex items-center gap-2 px-3 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-lg transition-all border border-purple-500/30 hover:border-purple-400/50 text-sm font-medium"
                  title="Copy URL"
                >
                  {copiedId === deployment.id ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span className="hidden sm:inline">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span className="hidden sm:inline">Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
