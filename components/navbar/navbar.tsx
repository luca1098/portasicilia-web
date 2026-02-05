'use client'

import { useState, useEffect } from 'react'

import { useParams, usePathname } from 'next/navigation'
import { MenuIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/context/translation.context'
import { getMenuItemsByArea } from '@/lib/constants/menu'
import LangSwitch from '@/components/navbar/lang-switch'
import AccountMenu from '@/components/navbar/account-menu'
import MobileMenu from '@/components/navbar/mobile-menu'
import Link from 'next/link'
import { cn } from '@/lib/utils/shadcn.utils'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const params = useParams()
  const pathname = usePathname()
  const lang = params.lang as string
  const t = useTranslation() as Record<string, string>

  const publicItems = getMenuItemsByArea('public')

  // Check if we're on the home page
  const isHomePage = pathname === `/${lang}` || pathname === `/${lang}/`

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    // Set initial state
    handleScroll()

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Determine if navbar should be transparent
  const isTransparent = isHomePage && !scrolled

  return (
    <>
      <header
        className={cn(
          'fixed top-0 z-40 w-full transition-colors duration-300',
          isTransparent ? 'bg-transparent' : 'border-b bg-background'
        )}
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center px-4">
          <Link href={`/${lang}/`} className="mr-6 text-lg font-bold">
            PortaSicilia
          </Link>

          <nav className="hidden items-center gap-10 md:flex">
            {publicItems.map(item => (
              <Link
                key={item.key}
                href={`/${lang}${item.href}`}
                className="text-md font-medium transition-colors hover:text-primary"
              >
                {t[item.key] ?? item.key}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1">
            <AccountMenu />
            <LangSwitch />
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <MenuIcon />
            </Button>
          </div>
        </div>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} items={publicItems} />
    </>
  )
}
