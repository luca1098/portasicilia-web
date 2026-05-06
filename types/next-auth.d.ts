import { AuthResponse } from '@/lib/schemas/auth.schemas'
import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    accessToken: string
    user: AuthResponse['user']
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string
    user: AuthResponse['user']
  }
}
