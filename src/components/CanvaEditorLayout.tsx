'use client'

import React, { useState } from 'react'
import { CanvaEditorSidebar } from './CanvaEditorSidebar'
import { Download, Share2, Undo2, Redo2, Eye, Monitor, Smartphone, Tablet } from 'lucide-react'

interface CanvaEditorLayoutProps {
  siteName: string
  onSave: () => void
  onPreview: () => void
  onDownload: () => void
  onUndo?: () => void
  onRedo?: () => void
  canUndo?: boolean
  canRedo?: boolean
  children: React.ReactNode
  currentTemplate?: string
  onTemplateChange?: (templateId: string) => void
}

export function CanvaEditorLayout({
  siteName,
  onSave,
  onPreview,
  onDownload,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  children,
  currentTemplate,
  onTemplateChange
}: CanvaEditorLayoutProps) {
  const [activeTab, setActiveTab] = useState<'templates' | 'text' | 'colors' | 'images' | 'settings'>('templates')
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      background: '#f9fafb',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Left Sidebar */}
      <CanvaEditorSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onTemplateSelect={onTemplateChange}
        currentTemplate={currentTemplate}
      />

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Top Toolbar */}
        <div style={{
          height: '60px',
          background: 'white',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          gap: '16px'
        }}>
          {/* Left: Site Name */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flex: 1
          }}>
            <input
              type="text"
              value={siteName}
              readOnly
              style={{
                border: 'none',
                fontSize: '16px',
                fontWeight: '600',
                color: '#1f2937',
                background: 'transparent',
                outline: 'none',
                maxWidth: '300px'
              }}
            />
          </div>

          {/* Center: Undo/Redo + View Mode */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            {/* Undo/Redo */}
            <div style={{
              display: 'flex',
              gap: '4px',
              marginRight: '12px'
            }}>
              <button
                onClick={onUndo}
                disabled={!canUndo}
                style={{
                  width: '36px',
                  height: '36px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  background: 'white',
                  cursor: canUndo ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: canUndo ? 1 : 0.5,
                  transition: 'all 0.15s'
                }}
                title="Undo"
              >
                <Undo2 size={16} color="#6b7280" />
              </button>
              <button
                onClick={onRedo}
                disabled={!canRedo}
                style={{
                  width: '36px',
                  height: '36px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  background: 'white',
                  cursor: canRedo ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: canRedo ? 1 : 0.5,
                  transition: 'all 0.15s'
                }}
                title="Redo"
              >
                <Redo2 size={16} color="#6b7280" />
              </button>
            </div>

            {/* View Mode Selector */}
            <div style={{
              display: 'flex',
              gap: '4px',
              background: '#f3f4f6',
              padding: '4px',
              borderRadius: '8px'
            }}>
              <button
                onClick={() => setViewMode('desktop')}
                style={{
                  width: '36px',
                  height: '36px',
                  border: 'none',
                  borderRadius: '6px',
                  background: viewMode === 'desktop' ? 'white' : 'transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s',
                  boxShadow: viewMode === 'desktop' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                }}
                title="Desktop View"
              >
                <Monitor size={16} color={viewMode === 'desktop' ? '#2563eb' : '#6b7280'} />
              </button>
              <button
                onClick={() => setViewMode('tablet')}
                style={{
                  width: '36px',
                  height: '36px',
                  border: 'none',
                  borderRadius: '6px',
                  background: viewMode === 'tablet' ? 'white' : 'transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s',
                  boxShadow: viewMode === 'tablet' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                }}
                title="Tablet View"
              >
                <Tablet size={16} color={viewMode === 'tablet' ? '#2563eb' : '#6b7280'} />
              </button>
              <button
                onClick={() => setViewMode('mobile')}
                style={{
                  width: '36px',
                  height: '36px',
                  border: 'none',
                  borderRadius: '6px',
                  background: viewMode === 'mobile' ? 'white' : 'transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s',
                  boxShadow: viewMode === 'mobile' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                }}
                title="Mobile View"
              >
                <Smartphone size={16} color={viewMode === 'mobile' ? '#2563eb' : '#6b7280'} />
              </button>
            </div>
          </div>

          {/* Right: Actions */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flex: 1,
            justifyContent: 'flex-end'
          }}>
            <button
              onClick={onPreview}
              style={{
                padding: '8px 16px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                background: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.15s'
              }}
            >
              <Eye size={16} />
              Preview
            </button>
            <button
              onClick={onDownload}
              style={{
                padding: '8px 16px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                background: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.15s'
              }}
            >
              <Download size={16} />
              Download
            </button>
            <button
              onClick={onSave}
              style={{
                padding: '8px 20px',
                border: 'none',
                borderRadius: '8px',
                background: '#2563eb',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.15s',
                boxShadow: '0 1px 3px rgba(37, 99, 235, 0.3)'
              }}
            >
              <Share2 size={16} />
              Publish
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          overflow: 'auto'
        }}>
          <div style={{
            width: viewMode === 'desktop' ? '100%' : viewMode === 'tablet' ? '768px' : '375px',
            maxWidth: viewMode === 'desktop' ? '1400px' : undefined,
            height: '100%',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
            transition: 'all 0.3s ease'
          }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
