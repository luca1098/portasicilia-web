import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { defaultLocale } from '@/lib/configs/locales'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { PageParamsProps } from '@/lib/types/page.type'

const ROLE_PATHS: Record<string, string> = {
  ADMIN: 'admin',
  OWNER: 'owner',
  USER: 'user',
}

export default async function DashboardPage({ params }: PageParamsProps) {
  const { lang } = await params
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect(`/${lang || defaultLocale}`)
  }

  const rolePath = ROLE_PATHS[session.user.role] || 'user'
  redirect(`/${lang}/dashboard/${rolePath}`)
}
