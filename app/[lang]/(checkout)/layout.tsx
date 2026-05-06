import Link from 'next/link'
import Image from 'next/image'
import { PageParamsProps } from '@/lib/types/page.type'
import { PropsWithChildren } from 'react'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { SupportedLocale } from '@/lib/configs/locales'

type CheckoutLayoutProps = PageParamsProps & PropsWithChildren

export default async function CheckoutLayout({ children, params }: CheckoutLayoutProps) {
  const { lang } = await params
  const t = await getTranslations(lang as SupportedLocale)

  return (
    <>
      <header className="border-b">
        <div className="mx-auto flex h-14 max-w-7xl items-center px-4">
          <Link href={`/${lang}/`} aria-label={t.checkout_back_home}>
            <Image src="/logo.png" alt="PortaSicilia" width={32} height={32} />
          </Link>
        </div>
      </header>

      <main className="min-h-[calc(100vh-8rem)]">{children}</main>

      <footer className="border-t bg-[#0a1628]">
        <nav
          className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-6 text-sm text-gray-400"
          aria-label={t.checkout_footer_nav}
        >
          <Link href={`/${lang}/privacy-policy`} className="hover:underline hover:text-white">
            {t.footer_privacy_policy}
          </Link>
          <span aria-hidden="true">|</span>
          <Link href={`/${lang}/terms`} className="hover:underline hover:text-white">
            {t.footer_terms}
          </Link>
        </nav>
      </footer>
    </>
  )
}
