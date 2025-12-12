'use client'

import React, { useState } from 'react'
import { Layout, Type, Palette, Image, Settings, Layers, Sparkles } from 'lucide-react'

interface CanvaEditorSidebarProps {
  activeTab: 'templates' | 'text' | 'colors' | 'images' | 'settings'
  onTabChange: (tab: 'templates' | 'text' | 'colors' | 'images' | 'settings') => void
  onTemplateSelect?: (templateId: string) => void
  currentTemplate?: string
}

const TEMPLATES = [
  { id: 't1', name: 'Classic Overlay', thumb: '/templates/t1-thumb.jpg', category: 'Casino' },
  { id: 't6', name: 'Cyber Wins', thumb: '/templates/t6-thumb.jpg', category: 'Casino' },
  { id: 't7', name: 'Sweet Bonanza', thumb: '/templates/t7-thumb.jpg', category: 'Slots' },
  { id: 't9', name: 'Pirate Slots', thumb: '/templates/t9-thumb.jpg', category: 'Slots' },
  { id: 't14', name: 'Fortune Wheel - Underwater', thumb: '/templates/t14-thumb.jpg', category: 'Wheel' },
  { id: 't15', name: 'Fortune Wheel - China', thumb: '/templates/t15-thumb.jpg', category: 'Wheel' },
  { id: 't16', name: 'Fortune Wheel - Christmas', thumb: '/templates/t16-thumb.jpg', category: 'Wheel' },
  { id: 't17', name: 'Fortune Wheel - Pirates', thumb: '/templates/t17-thumb.jpg', category: 'Wheel' },
  { id: 't18', name: 'Big Cash Scratch', thumb: '/templates/t18-thumb.jpg', category: 'Scratch' }
]

export function CanvaEditorSidebar({ activeTab, onTabChange, onTemplateSelect, currentTemplate }: CanvaEditorSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const tabs = [
    { id: 'templates' as const, icon: Layout, label: 'Templates' },
    { id: 'text' as const, icon: Type, label: 'Text' },
    { id: 'colors' as const, icon: Palette, label: 'Colors' },
    { id: 'images' as const, icon: Image, label: 'Images' },
    { id: 'settings' as const, icon: Settings, label: 'Settings' }
  ]

  const filteredTemplates = TEMPLATES.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div style={{
      width: '280px',
      height: '100vh',
      background: 'white',
      borderRight: '1px solid #e5e7eb',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Sidebar Tabs */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        padding: '12px 8px',
        borderBottom: '1px solid #e5e7eb'
      }}>
        {tabs.map(tab => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                border: 'none',
                borderRadius: '8px',
                background: isActive ? '#eff6ff' : 'transparent',
                color: isActive ? '#2563eb' : '#6b7280',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: isActive ? '600' : '500',
                transition: 'all 0.15s',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = '#f9fafb'
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = 'transparent'
              }}
            >
              <Icon size={18} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Content Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px'
      }}>
        {activeTab === 'templates' && (
          <div>
            <div style={{
              marginBottom: '16px'
            }}>
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {filteredTemplates.map(template => (
                <div
                  key={template.id}
                  onClick={() => onTemplateSelect?.(template.id)}
                  style={{
                    border: currentTemplate === template.id ? '2px solid #2563eb' : '1px solid #e5e7eb',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: currentTemplate === template.id ? '#eff6ff' : 'white'
                  }}
                  onMouseEnter={(e) => {
                    if (currentTemplate !== template.id) {
                      e.currentTarget.style.borderColor = '#cbd5e1'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentTemplate !== template.id) {
                      e.currentTarget.style.borderColor = '#e5e7eb'
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'none'
                    }
                  }}
                >
                  <div style={{
                    width: '100%',
                    height: '140px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {template.id.toUpperCase()}
                  </div>
                  <div style={{
                    padding: '12px'
                  }}>
                    <div style={{
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#1f2937',
                      marginBottom: '4px'
                    }}>
                      {template.name}
                    </div>
                    <div style={{
                      fontSize: '11px',
                      color: '#6b7280'
                    }}>
                      {template.category}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'text' && (
          <div>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '16px'
            }}>
              Text Elements
            </h3>
            <p style={{
              fontSize: '13px',
              color: '#6b7280',
              lineHeight: '1.6'
            }}>
              Click on any text in the preview to edit it with the floating toolbar.
              You can change font, size, style, alignment, and color.
            </p>
          </div>
        )}

        {activeTab === 'colors' && (
          <div>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '16px'
            }}>
              Color Palette
            </h3>
            <p style={{
              fontSize: '13px',
              color: '#6b7280',
              lineHeight: '1.6',
              marginBottom: '16px'
            }}>
              Select text and use the color picker in the floating toolbar to change colors.
            </p>
          </div>
        )}

        {activeTab === 'images' && (
          <div>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '16px'
            }}>
              Images & Logo
            </h3>
            <p style={{
              fontSize: '13px',
              color: '#6b7280',
              lineHeight: '1.6'
            }}>
              Upload your logo and customize images in the template.
            </p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '16px'
            }}>
              Template Settings
            </h3>
            <p style={{
              fontSize: '13px',
              color: '#6b7280',
              lineHeight: '1.6'
            }}>
              Configure template-specific settings and options.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
