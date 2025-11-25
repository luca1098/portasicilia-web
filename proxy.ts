import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { NextRequest, NextResponse } from 'next/server'
import { defaultLocale, supportedLocales } from './lib/configs/locales'

function getLocale(request: NextRequest) {
  const languages = new Negotiator({
    headers: { 'accept-language': request.headers.get('accept-language') || '' },
  }).languages()

  return match(languages, supportedLocales, defaultLocale)
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const pathnameHasLocale = supportedLocales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next).*)',
  ],
}
