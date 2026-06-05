import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
    optimizePackageImports: ['lucide-react'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'portasicilia.s3.eu-west-2.amazonaws.com',
      },
    ],
    // Larghezze "grandi" ridotte da 8 a 4: eliminate 750, 1200, 2048 e 3840 (4K),
    // le più costose in transformations e non necessarie per i layout (card + hero full-bleed).
    deviceSizes: [640, 828, 1080, 1920],
    // Larghezze "piccole" ridotte da 8 a 4, per thumbnail/avatar referenziati via sizes.
    imageSizes: [64, 128, 256, 384],
    // Una sola qualità ammessa: nessuna variante di quality che moltiplichi le transformations.
    qualities: [75],
    // Solo WebP: evita che AVIF aggiunga una seconda variante di formato per ogni larghezza.
    formats: ['image/webp'],
    // 31 giorni: massimizza il riuso della cache e riduce le ri-trasformazioni ri-conteggiate.
    minimumCacheTTL: 2678400,
  },
  async rewrites() {
    return [
      { source: '/uc-cmp/:path*', destination: 'https://web.cmp.usercentrics.eu/:path*' },
      { source: '/uc-app/:path*', destination: 'https://app.usercentrics.eu/:path*' },
      { source: '/uc-api/:path*', destination: 'https://api.usercentrics.eu/:path*' },
      { source: '/uc-config/:path*', destination: 'https://config.eu.usercentrics.eu/:path*' },
      {
        source: '/uc-consent/:path*',
        destination: 'https://consent-api.service.consent.usercentrics.eu/:path*',
      },
      {
        source: '/uc-aggregator/:path*',
        destination: 'https://aggregator.service.consent.usercentrics.eu/:path*',
      },
      { source: '/uc-privacy/:path*', destination: 'https://privacy-proxy.usercentrics.eu/:path*' },
    ]
  },
}

export default nextConfig
