import { authOptions } from '@/lib/auth/auth-options'
import { SupportedLocale } from '@/lib/configs/locales'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { getServerSession } from 'next-auth'
import { redirect, notFound } from 'next/navigation'
import { getAdminOwnerById } from '@/lib/api/owners'
import { EditOwnerForm } from '@/components/dashboard/owners/owner-form'
import { OwnerStatusBadge } from '@/components/dashboard/owners/owner-status-badge'
import { DashboardFormPage } from '@/components/dashboard/dashboard-page'
import Link from 'next/link'
import { ArrowLeft } from '@/lib/constants/icons'
import { formatDate } from '@/lib/utils/format.utils'

type EditAdminOwnerPageProps = {
  params: Promise<{ lang: string; id: string }>
}

export default async function EditAdminOwnerPage({ params }: EditAdminOwnerPageProps) {
  const { lang, id } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user || !session.accessToken) {
    redirect(`/${lang}`)
  }

  const t = await getTranslations(lang as SupportedLocale)
  const headers = { Authorization: `Bearer ${session.accessToken}` }

  let owner
  try {
    owner = await getAdminOwnerById(id, headers)
  } catch {
    notFound()
  }

  return (
    <DashboardFormPage>
      <div className="flex items-center gap-4">
        <Link
          href={`/${lang}/dashboard/admin/owners`}
          className="flex size-9 items-center justify-center rounded-lg border border-border transition-colors hover:bg-accent"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div className="flex flex-1 items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight">
            {owner.firstName} {owner.lastName}
          </h1>
          <OwnerStatusBadge
            claimedAt={owner.claimedAt}
            manualLabel={t.admin_owners_badge_manual}
            claimedLabel={t.admin_owners_badge_claimed}
          />
        </div>
      </div>

      {(owner.experienceCount !== undefined ||
        owner.stayCount !== undefined ||
        owner.productCount !== undefined) && (
        <div className="flex gap-6 rounded-xl border border-border bg-card p-4">
          {owner.experienceCount !== undefined && (
            <div className="text-center">
              <p className="text-2xl font-bold">{owner.experienceCount}</p>
              <p className="text-xs text-muted-foreground">{t.admin_owners_detail_experiences}</p>
            </div>
          )}
          {owner.stayCount !== undefined && (
            <div className="text-center">
              <p className="text-2xl font-bold">{owner.stayCount}</p>
              <p className="text-xs text-muted-foreground">{t.admin_owners_detail_stays}</p>
            </div>
          )}
          {owner.productCount !== undefined && (
            <div className="text-center">
              <p className="text-2xl font-bold">{owner.productCount}</p>
              <p className="text-xs text-muted-foreground">{t.admin_owners_detail_products}</p>
            </div>
          )}
        </div>
      )}

      <EditOwnerForm owner={owner} />

      <div className="rounded-xl border border-border bg-card p-6 space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          {t.admin_owners_section_audit}
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">{t.admin_owners_audit_created}</p>
            <p className="font-medium">{formatDate(owner.createdAt)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t.admin_owners_audit_claimed}</p>
            <p className="font-medium">
              {owner.claimedAt ? formatDate(owner.claimedAt) : t.admin_owners_audit_not_claimed}
            </p>
          </div>
        </div>
      </div>
    </DashboardFormPage>
  )
}
