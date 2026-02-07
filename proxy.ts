import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'

const ROLE_PATHS: Record<string, string> = {
  ADMIN: 'admin',
  OWNER: 'owner',
  USER: 'user',
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Extract lang segment (first path segment)
  const segments = pathname.split('/')
  const lang = segments[1] || 'it'

  const token = await getToken({ req })

  // Unauthenticated → redirect to homepage
  if (!token?.user) {
    const url = req.nextUrl.clone()
    url.pathname = `/${lang}`
    return NextResponse.redirect(url)
  }

  const role = token.user.role
  const rolePath = ROLE_PATHS[role] || 'user'

  // Check if the user is at exactly /{lang}/dashboard (no sub-path)
  const dashboardBase = `/${lang}/dashboard`
  if (pathname === dashboardBase || pathname === `${dashboardBase}/`) {
    const url = req.nextUrl.clone()
    url.pathname = `${dashboardBase}/${rolePath}`
    return NextResponse.redirect(url)
  }

  // Check if user is trying to access a different role's dashboard
  const currentRoleSeg = segments[3] // /{lang}/dashboard/{roleSeg}
  const validRolePaths = Object.values(ROLE_PATHS)
  if (currentRoleSeg && validRolePaths.includes(currentRoleSeg) && currentRoleSeg !== rolePath) {
    const url = req.nextUrl.clone()
    url.pathname = `${dashboardBase}/${rolePath}`
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/:lang/dashboard/:path*'],
}
