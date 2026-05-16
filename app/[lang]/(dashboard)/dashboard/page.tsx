import { authOptions } from '@/lib/auth/auth-options'
import { defaultLocale } from '@/lib/configs/locales'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { PageParamsProps } from '@/lib/types/page.type'
import { dashboardPathForRole } from '@/lib/utils/auth.utils'

export default async function DashboardPage({ params }: PageParamsProps) {
  const { lang } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect(`/${lang || defaultLocale}`)
  }

  redirect(dashboardPathForRole(lang, session.user.role))
}
