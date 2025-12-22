'use client'

import Link from 'next/link'

interface NanoKitLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'header'
  href?: string
  className?: string
}

export function NanoKitLogo({ size = 'md', href, className = '' }: NanoKitLogoProps) {
  const dimensions = {
    sm: { width: 180, height: 135 },
    md: { width: 240, height: 180 },
    lg: { width: 320, height: 240 },
    header: { width: 280, height: 210 }
  }

  const logoElement = (
    <div className={`flex items-center ${className}`}>
      <img
        src="/images/NANO-KIT-LOGO.png"
        alt="Nano Kit Logo"
        width={dimensions[size].width}
        height={dimensions[size].height}
        className="object-contain"
        style={{
          maxWidth: dimensions[size].width + 'px',
          maxHeight: dimensions[size].height + 'px',
          width: 'auto',
          height: 'auto'
        }}
        onLoad={() => {
          console.log('✅ New NANO-KIT-LOGO.png loaded successfully');
        }}
        onError={(e) => {
          console.log('❌ New logo failed, trying fallback');
          const img = e.target as HTMLImageElement;
          img.src = '/images/nano-kit-logo.png';
        }}
      />
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="cursor-pointer hover:opacity-80 transition-opacity">
        {logoElement}
      </Link>
    )
  }

  return logoElement
}
