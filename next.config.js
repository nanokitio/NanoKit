/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static file serving from public directory
  async headers() {
    return [
      {
        // Apply headers to all CastleSlot game files
        source: '/CastleSlot/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          // Cache static game assets
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Specific headers for JavaScript modules
        source: '/CastleSlot/:path*.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
        ],
      },
      {
        // Specific headers for JSON files
        source: '/CastleSlot/:path*.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/json; charset=utf-8',
          },
        ],
      },
      {
        // Specific headers for WASM files
        source: '/CastleSlot/:path*.wasm',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/wasm',
          },
        ],
      },
      {
        // Headers for the main game HTML file
        source: '/CastleSlot/index.html',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/html; charset=utf-8',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
      {
        // Security headers for all routes (except game embeds)
        source: '/((?!CastleSlot|FisherMan Slot|templates/game).*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
  
  // Ensure proper static file handling
  async rewrites() {
    return [
      {
        source: '/CastleSlot/:path*',
        destination: '/CastleSlot/:path*',
      },
    ];
  },
  
  // Optimize for production
  compress: true,
  poweredByHeader: false,
  
  // Enable experimental features that might help with game loading
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

module.exports = nextConfig;
