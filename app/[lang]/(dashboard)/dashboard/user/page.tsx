import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { SupportedLocale } from '@/lib/configs/locales'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { PageParamsProps } from '@/lib/types/page.type'
import { interpolate } from '@/lib/utils/i18n.utils'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export default async function UserDashboardPage({ params }: PageParamsProps) {
  const { lang } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect(`/${lang}`)
  }

  const t = await getTranslations(lang as SupportedLocale)
  const name = session.user.firstName || session.user.email

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-bold">{t.dashboard_user_title}</h1>
      <p className="mt-2 text-muted-foreground">{interpolate(t.dashboard_welcome, { name })}</p>
    </div>
  )
}
