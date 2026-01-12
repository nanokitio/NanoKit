import Link from 'next/link'
import Image from 'next/image'

interface NanoKitLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'header'
  href?: string
  className?: string
}

export function NanoKitLogo({ size = 'md', href, className = '' }: NanoKitLogoProps) {
  const dimensions = {
    sm: { width: 80, height: 32 },
    md: { width: 120, height: 48 },
    lg: { width: 180, height: 72 },
    header: { width: 420, height: 126 }
  }

  const logoElement = (
    <div className={`flex items-center ${className}`}>
      <Image
        src="/NANOKIT.webp"
        alt="NanoKit Logo"
        width={dimensions[size].width}
        height={dimensions[size].height}
        className="object-contain"
        style={{
          maxWidth: dimensions[size].width + 'px',
          maxHeight: dimensions[size].height + 'px',
          width: 'auto',
          height: 'auto'
        }}
        priority={size === 'header'}
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
