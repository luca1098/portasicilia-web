import { getServerSession, type Session } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { defaultLocale } from '@/lib/configs/locales'
import type { UserRole } from '@/lib/schemas/entities/user.entity.schema'

const ROLE_PATHS: Record<UserRole, string> = {
  ADMIN: 'admin',
  OWNER: 'owner',
  USER: 'user',
}

export const dashboardPathForRole = (lang: string | undefined, role: UserRole) =>
  `/${lang || defaultLocale}/dashboard/${ROLE_PATHS[role]}`

export async function requireRole(lang: string | undefined, allowedRoles: UserRole[]): Promise<Session> {
  const session = await getServerSession(authOptions)

  if (!session?.user || !session.accessToken) {
    redirect(`/${lang || defaultLocale}`)
  }

  if (!allowedRoles.includes(session.user.role)) {
    redirect(dashboardPathForRole(lang, session.user.role))
  }

  return session
}
