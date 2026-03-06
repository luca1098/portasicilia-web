import Link from 'next/link'
import { SupportedLocale } from '@/lib/configs/locales'
import { getTranslations } from '@/lib/configs/locales/i18n'
import DashboardHeader from '@/components/dashboard/dashboard-header'
import { HomeIcon } from '@/lib/constants/icons'
import type { PageParamsProps } from '@/lib/types/page.type'

export default async function UserDashboardLayout({
  children,
  params,
}: PageParamsProps & { children: React.ReactNode }) {
  const { lang } = await params
  const t = await getTranslations(lang as SupportedLocale)

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <DashboardHeader>
        <Link
          href={`/${lang}`}
          className="flex items-center gap-2 text-sm font-semibold transition-colors hover:text-primary"
        >
          <HomeIcon className="size-4" />
          <span className="hidden sm:inline">PortaSicilia</span>
        </Link>
      </DashboardHeader>
      <main className="flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-10">{children}</main>
      <footer className="flex shrink-0 items-center justify-between border-t border-border bg-background px-6 py-3 text-xs text-muted-foreground lg:px-10">
        <Link href={`/${lang}`} className="transition-colors hover:text-foreground">
          {t.owner_sidebar_go_to_portasicilia}
        </Link>
        <span>{t.footer_copyright}</span>
      </footer>
    </div>
  )
}
