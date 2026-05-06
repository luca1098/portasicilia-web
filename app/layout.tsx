import type { Metadata } from 'next'
import './globals.css'
import { PropsWithChildren } from 'react'
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from '@/lib/seo/constants'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Porta Sicilia — Esperienze, Alloggi e Vacanze in Sicilia',
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'Scopri la Sicilia autentica: prenota esperienze uniche, alloggi e attività. Cosa fare in Sicilia, dove dormire, itinerari e guide per le tue vacanze.',
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'it_IT',
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
  },
  icons: {
    icon: '/logo.png',
  },
}

export default async function RootLayout({ children }: PropsWithChildren) {
  return children
}
