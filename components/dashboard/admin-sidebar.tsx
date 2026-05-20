'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams, usePathname } from 'next/navigation'
import { useTranslation } from '@/lib/context/translation.context'
import { cn } from '@/lib/utils/shadcn.utils'
import {
  LayoutDashboardIcon,
  MapPinnedIcon,
  Compass,
  HomeIcon,
  ChevronLeftIcon,
  ChevronDownIcon,
  ExternalLinkIcon,
  PanelLeftIcon,
  XIcon,
  ClipboardListIcon,
  CalendarCheck2Icon,
  LayersIcon,
  NewspaperIcon,
  UsersIcon,
  StarIcon,
  PlayCircleIcon,
  ShoppingBagIcon,
  PackageIcon,
  ReceiptIcon,
  StoreIcon,
  HandshakeIcon,
} from '@/lib/constants/icons'
import { Button } from '@/components/ui/button'

type SidebarItem = {
  key: string
  icon: React.ElementType
  href: string
}

type SidebarSection = {
  labelKey: string
  items: SidebarItem[]
}

const sidebarSections: SidebarSection[] = [
  {
    labelKey: 'admin_sidebar_section_bookings',
    items: [
      { key: 'admin_sidebar_requests', icon: ClipboardListIcon, href: '/requests' },
      { key: 'admin_sidebar_bookings', icon: CalendarCheck2Icon, href: '/bookings' },
      { key: 'admin_sidebar_reviews', icon: StarIcon, href: '/reviews' },
    ],
  },
  {
    labelKey: 'admin_sidebar_section_management',
    items: [
      { key: 'admin_sidebar_dashboard', icon: LayoutDashboardIcon, href: '' },
      { key: 'admin_sidebar_locations', icon: MapPinnedIcon, href: '/locations' },
      { key: 'admin_sidebar_categories', icon: LayersIcon, href: '/categories' },
      { key: 'admin_sidebar_experiences', icon: Compass, href: '/experiences' },
      { key: 'admin_sidebar_stays', icon: HomeIcon, href: '/stays' },
      { key: 'admin_sidebar_owners', icon: StoreIcon, href: '/owners' },
      { key: 'admin_sidebar_partner_applications', icon: HandshakeIcon, href: '/partner-applications' },
    ],
  },
  {
    labelKey: 'admin_sidebar_section_content',
    items: [
      { key: 'admin_sidebar_articles', icon: NewspaperIcon, href: '/blog' },
      { key: 'admin_sidebar_authors', icon: UsersIcon, href: '/blog/authors' },
      { key: 'admin_sidebar_social_videos', icon: PlayCircleIcon, href: '/social-videos' },
    ],
  },
  {
    labelKey: 'admin_sidebar_section_shop',
    items: [
      { key: 'admin_sidebar_products', icon: PackageIcon, href: '/products' },
      { key: 'admin_sidebar_orders', icon: ReceiptIcon, href: '/orders' },
      { key: 'admin_sidebar_shop_categories', icon: ShoppingBagIcon, href: '/shop-categories' },
      { key: 'admin_sidebar_shop_reviews', icon: StarIcon, href: '/shop-reviews' },
    ],
  },
]

export default function AdminSidebar() {
  const params = useParams()
  const pathname = usePathname()
  const lang = params.lang as string
  const t = useTranslation() as Record<string, string>

  const basePath = `/${lang}/dashboard/admin`

  const isActive = (href: string) => {
    const fullPath = `${basePath}${href}`
    if (href === '') {
      return pathname === fullPath || pathname === `${fullPath}/`
    }
    return pathname.startsWith(fullPath)
  }

  const activeSectionKey = useMemo(() => {
    const match = sidebarSections.find(section => section.items.some(item => isActive(item.href)))
    return match?.labelKey ?? sidebarSections[0].labelKey
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, lang])

  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => ({
    admin_sidebar_section_bookings: true,
    [activeSectionKey]: true,
  }))

  const toggleSection = (labelKey: string) => {
    setOpenSections(prev => ({ ...prev, [labelKey]: !prev[labelKey] }))
  }

  const renderItem = (item: SidebarItem) => {
    const active = isActive(item.href)
    return (
      <Link
        key={item.key}
        href={`${basePath}${item.href}`}
        onClick={() => setMobileOpen(false)}
        className={cn(
          'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
          active
            ? 'bg-primary/10 text-sidebar-accent-foreground shadow-sm'
            : 'text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
          collapsed && 'lg:justify-center lg:px-0'
        )}
      >
        <item.icon
          className={cn(
            'size-[18px] shrink-0 transition-colors duration-200',
            active ? 'text-primary' : 'text-sidebar-foreground/40 group-hover:text-sidebar-foreground/70'
          )}
        />
        <span className={cn('transition-opacity duration-200', collapsed && 'lg:hidden')}>{t[item.key]}</span>
      </Link>
    )
  }

  useEffect(() => {
    setOpenSections(prev => (prev[activeSectionKey] ? prev : { ...prev, [activeSectionKey]: true }))
  }, [activeSectionKey])

  return (
    <>
      {/* Mobile toggle button */}
      <Button
        variant="ghost"
        size="icon-sm"
        className="fixed top-4 left-4 z-30 lg:hidden"
        onClick={() => setMobileOpen(true)}
        aria-label="Open sidebar"
      >
        <PanelLeftIcon className="size-5" />
      </Button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 ease-in-out',
          'lg:relative lg:z-auto',
          collapsed ? 'lg:w-[68px]' : 'lg:w-[260px]',
          mobileOpen ? 'w-[280px] translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Sidebar header — brand */}
        <div
          className={cn(
            'shrink-0 border-b border-sidebar-border px-4',
            collapsed
              ? 'flex flex-col-reverse items-center gap-1 py-3'
              : 'flex h-16 items-center justify-between'
          )}
        >
          <Link href={`/${lang}/dashboard/admin`}>
            <Image src="/logo.png" alt="PortaSicilia" width={32} height={32} className="shrink-0" />
          </Link>

          {/* Collapse toggle — desktop only */}
          <Button
            variant="ghost"
            size="icon-sm"
            className="hidden text-sidebar-foreground/50 hover:text-sidebar-foreground lg:flex"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronLeftIcon
              className={cn('size-4 transition-transform duration-300', collapsed && 'rotate-180')}
            />
          </Button>

          {/* Close button — mobile only */}
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-sidebar-foreground/50 hover:text-sidebar-foreground lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Close sidebar"
          >
            <XIcon className="size-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className={cn('flex-1 overflow-y-auto px-3 pb-4', collapsed && 'pt-4')}>
          {sidebarSections.map((section, index) => {
            const isOpen = collapsed ? true : (openSections[section.labelKey] ?? false)
            const sectionHasActive = section.items.some(item => isActive(item.href))
            return (
              <div key={section.labelKey}>
                {!collapsed && (
                  <button
                    type="button"
                    onClick={() => toggleSection(section.labelKey)}
                    className={cn(
                      'group/header mt-4 flex w-full items-center justify-between rounded-md px-1 py-2 transition-colors',
                      'hover:text-sidebar-foreground/70'
                    )}
                    aria-expanded={isOpen}
                  >
                    <span
                      className={cn(
                        'text-[11px] font-semibold uppercase tracking-[0.15em] transition-colors',
                        sectionHasActive ? 'text-sidebar-foreground/70' : 'text-sidebar-foreground/40',
                        'group-hover/header:text-sidebar-foreground/70'
                      )}
                    >
                      {t[section.labelKey]}
                    </span>
                    <ChevronDownIcon
                      className={cn(
                        'size-3.5 text-sidebar-foreground/40 transition-transform duration-200 group-hover/header:text-sidebar-foreground/70',
                        !isOpen && '-rotate-90'
                      )}
                    />
                  </button>
                )}
                {collapsed && index !== 0 && <div className="mx-2 my-3 border-t border-sidebar-border" />}
                <div
                  className={cn(
                    'grid transition-[grid-template-rows] duration-200 ease-out',
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  )}
                >
                  <div className="overflow-hidden">
                    <div className={cn('space-y-1', !collapsed && 'pt-1')}>
                      {section.items.map(renderItem)}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="shrink-0 border-t border-sidebar-border p-3">
          <Button
            variant="ghost"
            className={cn(
              'w-full justify-start gap-3 text-sm font-medium text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
              collapsed && 'lg:justify-center lg:px-0'
            )}
            asChild
          >
            <Link href={`/${lang}`} onClick={() => setMobileOpen(false)}>
              <ExternalLinkIcon className="size-[18px] shrink-0 text-sidebar-foreground/40" />
              <span className={cn('transition-opacity duration-200', collapsed && 'lg:hidden')}>
                {t.admin_sidebar_go_to_portasicilia}
              </span>
            </Link>
          </Button>
        </div>
      </aside>
    </>
  )
}
