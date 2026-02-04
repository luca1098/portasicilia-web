'use client'

import { useState } from 'react'

import { useParams } from 'next/navigation'
import { MenuIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/context/translation.context'
import { getMenuItemsByArea } from '@/lib/constants/menu'
import LangSwitch from '@/components/navbar/lang-switch'
import AccountMenu from '@/components/navbar/account-menu'
import MobileMenu from '@/components/navbar/mobile-menu'
import Link from 'next/link'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const params = useParams()
  const lang = params.lang as string
  const t = useTranslation() as Record<string, string>

  const publicItems = getMenuItemsByArea('public')

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="mx-auto flex h-14 max-w-7xl items-center px-4">
          <Link href={`/${lang}/`} className="mr-6 text-lg font-bold">
            PortaSicilia
          </Link>

          <nav className="hidden items-center gap-4 md:flex">
            {publicItems.map(item => (
              <Link
                key={item.key}
                href={`/${lang}${item.href}`}
                className="text-sm font-medium transition-colors hover:text-primary"
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
