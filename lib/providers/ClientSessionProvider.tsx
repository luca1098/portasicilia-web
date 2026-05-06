'use client'
import { SessionProvider } from 'next-auth/react'
import { PropsWithChildren } from 'react'

type ClientSessionProviderProps = PropsWithChildren

const ClientSessionProvider = ({ children }: ClientSessionProviderProps) => {
  return <SessionProvider>{children}</SessionProvider>
}

export default ClientSessionProvider
