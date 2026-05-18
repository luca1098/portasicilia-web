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
