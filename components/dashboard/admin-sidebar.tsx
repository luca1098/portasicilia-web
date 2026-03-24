'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { useTranslation } from '@/lib/context/translation.context'
import { cn } from '@/lib/utils/shadcn.utils'
import {
  LayoutDashboardIcon,
  MapPinnedIcon,
  Compass,
  HomeIcon,
  ChevronLeftIcon,
  ExternalLinkIcon,
  PanelLeftIcon,
  XIcon,
  ClipboardListIcon,
  CalendarCheck2Icon,
  LayersIcon,
  NewspaperIcon,
  UsersIcon,
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
    labelKey: 'admin_sidebar_section_management',
    items: [
      { key: 'admin_sidebar_dashboard', icon: LayoutDashboardIcon, href: '' },
      { key: 'admin_sidebar_locations', icon: MapPinnedIcon, href: '/locations' },
      { key: 'admin_sidebar_categories', icon: LayersIcon, href: '/categories' },
      { key: 'admin_sidebar_experiences', icon: Compass, href: '/experiences' },
      { key: 'admin_sidebar_stays', icon: HomeIcon, href: '/stays' },
    ],
  },
  {
    labelKey: 'admin_sidebar_section_bookings',
    items: [
      { key: 'admin_sidebar_requests', icon: ClipboardListIcon, href: '/requests' },
      { key: 'admin_sidebar_bookings', icon: CalendarCheck2Icon, href: '/bookings' },
    ],
  },
  {
    labelKey: 'admin_sidebar_section_content',
    items: [
      { key: 'admin_sidebar_articles', icon: NewspaperIcon, href: '/blog' },
      { key: 'admin_sidebar_authors', icon: UsersIcon, href: '/blog/authors' },
    ],
  },
]

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
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
            'flex h-16 shrink-0 items-center border-b border-sidebar-border px-4',
            collapsed ? 'justify-center' : 'justify-between'
          )}
        >
          {!collapsed && (
            <Link
              href={`/${lang}/dashboard/admin`}
              className="text-base font-bold tracking-tight text-sidebar-foreground"
            >
              PortaSicilia
            </Link>
          )}

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
        <nav className={cn('flex-1 overflow-y-auto px-3', collapsed && 'pt-4')}>
          {sidebarSections.map(section => (
            <div key={section.labelKey}>
              {!collapsed && (
                <div className="px-1 pt-6 pb-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-sidebar-foreground/40">
                    {t[section.labelKey]}
                  </span>
                </div>
              )}
              {collapsed && section !== sidebarSections[0] && (
                <div className="mx-2 my-3 border-t border-sidebar-border" />
              )}
              <div className="space-y-1">{section.items.map(renderItem)}</div>
            </div>
          ))}
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
