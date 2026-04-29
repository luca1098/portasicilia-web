'use client'

import { useEffect, useState } from 'react'
import CartDrawer from '@/components/cart/cart-drawer'
import { cn } from '@/lib/utils/shadcn.utils'

export default function ShopSubbar() {
  const [navbarHidden, setNavbarHidden] = useState(false)

  useEffect(() => {
    let lastScrollY = window.scrollY

    const handleScroll = () => {
      const currentY = window.scrollY
      setNavbarHidden(currentY > 100 && currentY > lastScrollY)
      lastScrollY = currentY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className={cn(
        'sticky top-0 left-0 right-0 z-30 border-b border-sky-100 transition-all duration-500 ease-out py-1',
        navbarHidden ? 'top-0' : 'top-[60px]'
      )}
      style={{ backgroundColor: '#EBFDFF' }}
    >
      <div className="mx-auto flex h-11 max-w-7xl items-center px-4 md:px-6">
        <div className="ml-auto">
          <CartDrawer />
        </div>
      </div>
    </div>
  )
}
