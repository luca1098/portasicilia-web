import type { Metadata } from 'next'
import './globals.css'
import { PropsWithChildren } from 'react'

export const metadata: Metadata = {
  title: 'Porta Sicilia',
  description: 'Porta Sicilia',
  icons: {
    icon: '/logo.png',
  },
}

export default async function RootLayout({ children }: PropsWithChildren) {
  return children
}
