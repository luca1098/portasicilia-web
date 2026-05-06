import { PageParamsProps } from '@/lib/types/page.type'
import { PropsWithChildren } from 'react'
import Providers from '@/lib/providers'

type RootLayoutProps = PageParamsProps & PropsWithChildren

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { lang } = await params
  return (
    <html lang={lang}>
      <body className={`antialiased`}>
        <Providers params={params}>{children}</Providers>
      </body>
    </html>
  )
}
