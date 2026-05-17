'use client'

import { useState, useEffect } from 'react'

import { useParams, usePathname } from 'next/navigation'
import { MenuIcon } from '@/lib/constants/icons'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/context/translation.context'
import { getMenuItemsByArea } from '@/lib/constants/menu'
import NavbarActions from '@/components/navbar/navbar-actions'
import MobileMenu from '@/components/navbar/mobile-menu'
import InspirationMenu from '@/components/navbar/inspiration-menu'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils/shadcn.utils'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const params = useParams()
  const pathname = usePathname()
  const lang = params.lang as string
  const t = useTranslation() as Record<string, string>

  const publicItems = getMenuItemsByArea('public')

  const isHomePage = pathname === `/${lang}` || pathname === `/${lang}/`

  const isActiveLink = (href: string) => {
    const fullHref = `/${lang}${href}`
    return pathname === fullHref || pathname.startsWith(`${fullHref}/`)
  }

  useEffect(() => {
    let lastScrollY = window.scrollY

    const handleScroll = () => {
      const currentY = window.scrollY
      setScrolled(currentY > 100)
      setHidden(currentY > 100 && currentY > lastScrollY)
      lastScrollY = currentY
    }

    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isOnTopOfHomePage = isHomePage && !scrolled

  return (
    <>
      <header
        className={cn(
          'fixed top-0 z-40 w-full transition-all duration-500 ease-out',
          hidden ? '-translate-y-full' : 'translate-y-0',
          isOnTopOfHomePage
            ? 'bg-linear-to-b from-black/50 to-transparent'
            : 'bg-background backdrop-saturate-150'
        )}
      >
        <div className="relative mx-auto flex max-w-7xl items-center px-4 py-2 md:px-6">
          <Link href={`/${lang}/`} className="mr-8 shrink-0 transition-opacity duration-200 hover:opacity-80">
            <Image
              src={isOnTopOfHomePage ? '/logo-full-white.png' : '/logo.png'}
              alt="Porta Sicilia"
              width={isOnTopOfHomePage ? 148 : 50}
              height={isOnTopOfHomePage ? 80 : 50}
              className="transition-all duration-500"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-1 md:absolute md:left-1/2 md:flex md:-translate-x-1/2">
            {publicItems.map(item => (
              <Link
                key={item.key}
                href={`/${lang}${item.href}`}
                className={cn(
                  'group relative px-3 py-2 text-sm font-medium tracking-wide transition-colors duration-200',
                  isOnTopOfHomePage
                    ? 'text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)] hover:text-white'
                    : isActiveLink(item.href)
                      ? 'text-primary'
                      : 'text-foreground/70 hover:text-foreground'
                )}
              >
                {t[item.key] ?? item.key}
                <span
                  className={cn(
                    'absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-primary transition-transform duration-300 origin-left',
                    isActiveLink(item.href) && !isOnTopOfHomePage
                      ? 'scale-x-100'
                      : 'scale-x-0 group-hover:scale-x-100'
                  )}
                />
              </Link>
            ))}
            <InspirationMenu isTransparent={isOnTopOfHomePage} />
          </nav>

          <div className="ml-auto">
            <NavbarActions isTransparent={isOnTopOfHomePage}>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'md:hidden',
                  isOnTopOfHomePage && 'text-white hover:bg-white/10 hover:text-white'
                )}
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <MenuIcon />
              </Button>
            </NavbarActions>
          </div>
        </div>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} items={publicItems} />
    </>
  )
}
