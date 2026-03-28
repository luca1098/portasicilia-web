import { NextRequest, NextResponse } from 'next/server'
import { defaultLocale, supportedLocales } from '@/lib/configs/locales'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const hasLocale = supportedLocales.some(
    locale => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  )

  if (!hasLocale) {
    const url = request.nextUrl.clone()
    url.pathname = `/${defaultLocale}${pathname}`
    return NextResponse.redirect(url)
  }
}

export const config = {
  matcher: ['/((?!api|_next|favicon\\.ico|.*\\..*).*)'],
}
