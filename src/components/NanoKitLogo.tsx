'use client'

import Link from 'next/link'

interface NanoKitLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'header'
  href?: string
  className?: string
}

export function NanoKitLogo({ size = 'md', href, className = '' }: NanoKitLogoProps) {
  const dimensions = {
    sm: { width: 120, height: 90 },
    md: { width: 150, height: 113 },
    lg: { width: 200, height: 150 },
    header: { width: 180, height: 135 }
  }

  const logoElement = (
    <div className={`flex items-center ${className}`}>
      <img
        src="https://raw.githubusercontent.com/manupor/Prelander_Gen/main/public/images/nano-kit-logo.png"
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
          console.log('✅ Logo PNG loaded from GitHub raw');
        }}
        onError={(e) => {
          console.log('❌ GitHub raw failed, trying local paths');
          const img = e.target as HTMLImageElement;
          img.src = '/logo.png';
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
