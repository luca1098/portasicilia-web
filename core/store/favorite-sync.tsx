'use client'

import { useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useFavoriteActions } from './favorite.store'

export default function FavoriteSync() {
  const { data: session, status } = useSession()
  const { fetchIds, clear } = useFavoriteActions()
  const synced = useRef(false)

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'authenticated' && session?.accessToken && !synced.current) {
      synced.current = true
      fetchIds(session.accessToken).catch(() => {})
    }

    if (status === 'unauthenticated') {
      synced.current = false
      clear()
    }
  }, [status, session?.accessToken, fetchIds, clear])

  return null
}
