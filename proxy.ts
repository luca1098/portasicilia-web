import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'
import { defaultLocale, supportedLocales } from '@/lib/configs/locales'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const hasLocale = supportedLocales.some(
    locale => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  )

  if (!hasLocale) {
    const url = request.nextUrl.clone()
    url.pathname = `/${defaultLocale}${pathname}`
    return NextResponse.redirect(url)
  }

  const segment = pathname.split('/')[1]
  const lang = (supportedLocales as readonly string[]).includes(segment) ? segment : defaultLocale
  const isDashboard = pathname.startsWith(`/${lang}/dashboard`)

  if (isDashboard) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    if (!token) {
      const url = request.nextUrl.clone()
      url.pathname = `/${lang}`
      url.search = ''
      return NextResponse.redirect(url)
    }
  }
}

export const config = {
  matcher: [
    '/((?!api|_next|uc-cmp|uc-app|uc-api|uc-config|uc-consent|uc-aggregator|uc-privacy|favicon\\.ico|.*\\..*).*)',
  ],
}
