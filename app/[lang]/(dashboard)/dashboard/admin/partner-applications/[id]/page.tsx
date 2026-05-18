import { authOptions } from '@/lib/auth/auth-options'
import { SupportedLocale } from '@/lib/configs/locales'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { getServerSession } from 'next-auth'
import { redirect, notFound } from 'next/navigation'
import { apiServer } from '@/lib/api/fetch-client'
import AdminApplicationDetail from '@/components/partner/admin-application-detail'
import { DashboardWidePage } from '@/components/dashboard/dashboard-page'
import Link from 'next/link'
import { ArrowLeft } from '@/lib/constants/icons'
import type { PartnerApplicationDetail as TDetail } from '@/lib/types/partner-application.type'

type Props = { params: Promise<{ lang: string; id: string }> }

export default async function AdminPartnerApplicationDetailPage({ params }: Props) {
  const { lang, id } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user || !session.accessToken) {
    redirect(`/${lang}`)
  }

  const t = await getTranslations(lang as SupportedLocale)

  let detail: TDetail | undefined
  try {
    detail = await apiServer.get<TDetail>(`/admin/partner-applications/${id}`)
  } catch {
    notFound()
  }

  if (!detail) notFound()

  return (
    <DashboardWidePage>
      <div className="flex items-center gap-4">
        <Link
          href={`/${lang}/dashboard/admin/partner-applications`}
          className="flex size-9 items-center justify-center rounded-lg border border-border transition-colors hover:bg-accent"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">{detail.businessName}</h1>
        <span className="rounded bg-muted px-2 py-1 text-xs">{detail.status}</span>
      </div>

      <AdminApplicationDetail application={detail} lang={lang} t={t} />
    </DashboardWidePage>
  )
}
