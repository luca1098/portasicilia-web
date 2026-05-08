import { apiServer } from '@/lib/api/fetch-client'
import { supportedLocales, defaultLocale, type SupportedLocale } from '@/lib/configs/locales'
import { AuthResponse } from '@/lib/schemas/auth.schemas'
import { cookies, headers } from 'next/headers'
import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const LOCALE_COOKIE = 'ps-lang'

const isSupported = (value: string | null | undefined): value is SupportedLocale =>
  !!value && (supportedLocales as readonly string[]).includes(value)

async function resolveRequestLocale(): Promise<SupportedLocale> {
  const cookieStore = await cookies()
  const fromCookie = cookieStore.get(LOCALE_COOKIE)?.value?.toLowerCase()
  if (isSupported(fromCookie)) return fromCookie

  const headerList = await headers()
  const acceptLanguage = headerList.get('accept-language') ?? ''
  for (const part of acceptLanguage.split(',')) {
    const tag = part.split(';')[0]?.trim().slice(0, 2).toLowerCase()
    if (isSupported(tag)) return tag
  }

  return defaultLocale
}

export const authOptions: NextAuthOptions = {
  session: {
    maxAge: 6 * 24 * 60 * 60, // 6 giorni
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      httpOptions: {
        timeout: 40000,
      },
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        const lang = (await resolveRequestLocale()).toUpperCase()
        const res = await apiServer.post<AuthResponse>(`/auth/google`, {
          idToken: account?.id_token,
          lang,
        })
        token.accessToken = res.accessToken
        token.user = res.user
      }

      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      session.user = token.user
      return session
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
