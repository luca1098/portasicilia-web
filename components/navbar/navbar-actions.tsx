'use client'

import { type ReactNode } from 'react'
import AccountMenu from '@/components/navbar/account-menu'
import LangSwitch from '@/components/navbar/lang-switch'
import WishlistDrawer from '@/components/wishlist/wishlist-drawer'

interface NavbarActionsProps {
  children?: ReactNode
  isTransparent?: boolean
}

export default function NavbarActions({ children, isTransparent }: NavbarActionsProps) {
  return (
    <div className="flex items-center gap-0.5">
      <WishlistDrawer isTransparent={isTransparent} />
      <AccountMenu isTransparent={isTransparent} />
      <LangSwitch isTransparent={isTransparent} />
      {children}
    </div>
  )
}
