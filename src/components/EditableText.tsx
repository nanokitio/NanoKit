'use client'

import { useState, useRef, useEffect } from 'react'
import { Edit3, Check, X } from 'lucide-react'

interface EditableTextProps {
  value: string
  onChange: (value: string) => void
  className?: string
  multiline?: boolean
  placeholder?: string
  disabled?: boolean
  children?: React.ReactNode
}

export function EditableText({ 
  value, 
  onChange, 
  className = '', 
  multiline = false,
  placeholder = 'Click to edit',
  disabled = false,
  children 
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const [isHovered, setIsHovered] = useState(false)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  useEffect(() => {
    setEditValue(value)
  }, [value])

  const handleSave = () => {
    onChange(editValue)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditValue(value)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !multiline) {
      e.preventDefault()
      handleSave()
    }
    if (e.key === 'Escape') {
      handleCancel()
    }
  }

  if (disabled) {
    return children ? <>{children}</> : <span className={className}>{value}</span>
  }

  if (isEditing) {
    return (
      <div className="relative inline-flex items-center gap-2">
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`${className} bg-white/10 border-2 border-cyan-400 rounded px-2 py-1 text-current resize-none`}
            rows={3}
            placeholder={placeholder}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`${className} bg-white/10 border-2 border-cyan-400 rounded px-2 py-1 text-current`}
            placeholder={placeholder}
          />
        )}
        <button
          onClick={handleSave}
          className="p-1.5 bg-green-500 hover:bg-green-600 rounded text-white transition-colors"
          title="Save (Enter)"
        >
          <Check className="w-4 h-4" />
        </button>
        <button
          onClick={handleCancel}
          className="p-1.5 bg-red-500 hover:bg-red-600 rounded text-white transition-colors"
          title="Cancel (Esc)"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    )
  }

  return (
    <div 
      className="relative inline-block group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* The actual content */}
      {children ? children : <span className={className}>{value || placeholder}</span>}
      
      {/* Edit button - appears on hover */}
      {isHovered && (
        <button
          onClick={() => setIsEditing(true)}
          className="absolute -top-6 -right-6 p-1.5 bg-cyan-500 hover:bg-cyan-600 rounded-full text-white shadow-lg transition-all hover:scale-110 z-50 animate-fade-in"
          title="Click to edit"
          style={{
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <Edit3 className="w-3.5 h-3.5" />
        </button>
      )}
      
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  )
}
