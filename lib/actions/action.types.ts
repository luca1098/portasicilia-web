import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export type ActionResult<T = void> = {
  success: boolean
  data?: T
  error?: string
}

export async function getAuthHeaders() {
  const session = await getServerSession(authOptions)
  if (!session?.accessToken) {
    throw new Error('Unauthorized')
  }
  return { Authorization: `Bearer ${session.accessToken}` }
}
