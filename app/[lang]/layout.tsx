import { PageParamsProps } from '@/lib/types/page.type'
import { PropsWithChildren } from 'react'
import Script from 'next/script'
import Providers from '@/lib/providers'

type RootLayoutProps = PageParamsProps & PropsWithChildren

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { lang } = await params
  return (
    <html lang={lang}>
      <head>
        <Script
          id="usercentrics-cmp"
          src="https://web.cmp.usercentrics.eu/ui/loader.js"
          data-settings-id="5kW_lfUnkcT6Kp"
          strategy="beforeInteractive"
          async
        />
      </head>
      <body className={`antialiased`}>
        <Providers params={params}>{children}</Providers>
      </body>
    </html>
  )
}
