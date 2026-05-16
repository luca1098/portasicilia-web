import { apiServer } from '@/lib/api/fetch-client'
import { generateAppleClientSecret } from '@/lib/auth/apple-client-secret'
import { supportedLocales, defaultLocale, type SupportedLocale } from '@/lib/configs/locales'
import { AuthResponse } from '@/lib/schemas/auth.schemas'
import { cookies, headers } from 'next/headers'
import { NextAuthOptions } from 'next-auth'
import AppleProvider from 'next-auth/providers/apple'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import type { Provider } from 'next-auth/providers/index'

if (!process.env.NEXTAUTH_URL && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
  process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
}

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

function buildAppleProvider(): Provider | null {
  const { APPLE_TEAM_ID, APPLE_CLIENT_ID, APPLE_KEY_ID, APPLE_PRIVATE_KEY } = process.env
  if (!APPLE_TEAM_ID || !APPLE_CLIENT_ID || !APPLE_KEY_ID || !APPLE_PRIVATE_KEY) {
    return null
  }

  let clientSecret: string
  try {
    clientSecret = generateAppleClientSecret()
  } catch (err) {
    console.error('[auth] Apple provider disabled — failed to build client secret:', err)
    return null
  }

  return AppleProvider({
    clientId: APPLE_CLIENT_ID,
    clientSecret,
    authorization: {
      params: {
        scope: 'name email',
        response_mode: 'form_post',
      },
    },
  })
}

function buildProviders(): Provider[] {
  const providers: Provider[] = [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      httpOptions: { timeout: 40000 },
    }),
    CredentialsProvider({
      id: 'magic-link',
      name: 'Magic Link',
      credentials: {
        token: { label: 'Token', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.token) return null
        const lang = (await resolveRequestLocale()).toUpperCase()
        const res = await apiServer.post<AuthResponse>(`/auth/magic-link/verify`, {
          token: credentials.token,
          lang,
        })
        return {
          id: res.user.id,
          email: res.user.email,
          accessToken: res.accessToken,
          user: res.user,
        } as unknown as { id: string; email: string }
      },
    }),
  ]

  const apple = buildAppleProvider()
  if (apple) providers.push(apple)

  return providers
}

export const authOptions: NextAuthOptions = {
  session: {
    maxAge: 6 * 24 * 60 * 60,
  },
  providers: buildProviders(),
  callbacks: {
    async jwt({ token, account, user, profile }) {
      if (account?.provider === 'google') {
        const lang = (await resolveRequestLocale()).toUpperCase()
        const res = await apiServer.post<AuthResponse>(`/auth/google`, {
          idToken: account?.id_token,
          lang,
        })
        token.accessToken = res.accessToken
        token.user = res.user
      } else if (account?.provider === 'apple') {
        const lang = (await resolveRequestLocale()).toUpperCase()
        const appleProfile = profile as { name?: { firstName?: string; lastName?: string } } | undefined
        const res = await apiServer.post<AuthResponse>(`/auth/apple`, {
          idToken: account?.id_token,
          firstName: appleProfile?.name?.firstName,
          lastName: appleProfile?.name?.lastName,
          lang,
        })
        token.accessToken = res.accessToken
        token.user = res.user
      } else if (account?.provider === 'magic-link' && user) {
        const credentialsUser = user as unknown as {
          accessToken: string
          user: AuthResponse['user']
        }
        token.accessToken = credentialsUser.accessToken
        token.user = credentialsUser.user
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
