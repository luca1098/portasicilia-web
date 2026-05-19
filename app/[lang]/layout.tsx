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
          src="/uc-cmp/ui/loader.js"
          data-settings-id="5kW_lfUnkcT6Kp"
          strategy="beforeInteractive"
          async
        />
        <Script
          id="gtag-src"
          src="https://www.googletagmanager.com/gtag/js?id=G-Q4R0BMBRQY"
          strategy="afterInteractive"
          async
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-Q4R0BMBRQY');
          `}
        </Script>
      </head>
      <body className={`antialiased`}>
        <Providers params={params}>{children}</Providers>
      </body>
    </html>
  )
}
