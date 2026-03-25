'use client'

import { type ReactNode } from 'react'
import AccountMenu from '@/components/navbar/account-menu'
import LangSwitch from '@/components/navbar/lang-switch'
import WishlistDrawer from '@/components/wishlist/wishlist-drawer'

interface NavbarActionsProps {
  children?: ReactNode
}

export default function NavbarActions({ children }: NavbarActionsProps) {
  return (
    <div className="flex items-center gap-1">
      {children}
      <WishlistDrawer />
      <AccountMenu />
      <LangSwitch />
    </div>
  )
}
