'use client'

import { useTranslation } from '@/lib/context/translation.context'
import {
  CalendarCheck2Icon,
  ClipboardListIcon,
  DollarSignIcon,
  UsersIcon,
  ArrowRight,
  PackageIcon,
} from '@/lib/constants/icons'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { cn } from '@/lib/utils/shadcn.utils'
import { DashboardListPage } from '@/components/dashboard/dashboard-page'

type OwnerStatsValues = {
  totalBookings: string
  confirmedCount: string
  pendingCount: string
  totalRevenue: string
}

type OwnerStatsLabels = {
  totalBookings: string
  confirmedCount: string
  pendingCount: string
  totalRevenue: string
}

type OwnerDashboardContentProps = {
  title: string
  welcome: string
  stats: OwnerStatsLabels
  values: OwnerStatsValues
}

const statsConfig = [
  {
    key: 'totalBookings' as const,
    icon: CalendarCheck2Icon,
    accent: 'text-primary',
    bgAccent: 'bg-primary/8',
  },
  {
    key: 'confirmedCount' as const,
    icon: UsersIcon,
    accent: 'text-chart-1',
    bgAccent: 'bg-chart-1/8',
  },
  {
    key: 'pendingCount' as const,
    icon: ClipboardListIcon,
    accent: 'text-chart-2',
    bgAccent: 'bg-chart-2/8',
  },
  {
    key: 'totalRevenue' as const,
    icon: DollarSignIcon,
    accent: 'text-chart-4',
    bgAccent: 'bg-chart-4/8',
  },
]

const quickLinks = [
  {
    key: 'requests' as const,
    labelKey: 'owner_sidebar_requests',
    href: '/requests',
    icon: ClipboardListIcon,
  },
  {
    key: 'bookings' as const,
    labelKey: 'owner_sidebar_bookings',
    href: '/bookings',
    icon: CalendarCheck2Icon,
  },
  {
    key: 'orders' as const,
    labelKey: 'owner_sidebar_orders',
    href: '/orders',
    icon: PackageIcon,
  },
]

export default function OwnerDashboardContent({ title, welcome, stats, values }: OwnerDashboardContentProps) {
  const t = useTranslation() as Record<string, string>
  const params = useParams()
  const lang = params.lang as string
  const basePath = `/${lang}/dashboard/owner`

  return (
    <DashboardListPage>
      {/* Welcome */}
      <div className="rounded-2xl bg-gradient-to-br from-primary/8 via-primary/5 to-transparent p-6 sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">{welcome}</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statsConfig.map(({ key, icon: Icon, accent, bgAccent }) => (
          <div
            key={key}
            className="group rounded-2xl border border-border/60 bg-card p-5 transition-all duration-200 hover:border-border hover:shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className={cn('flex size-9 items-center justify-center rounded-xl', bgAccent)}>
                <Icon className={cn('size-[18px]', accent)} />
              </div>
            </div>
            <p className="mt-4 text-2xl font-semibold tabular-nums tracking-tight">{values[key]}</p>
            <span className="mt-1 block text-xs font-medium text-muted-foreground">{stats[key]}</span>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {quickLinks.map(({ key, labelKey, href, icon: Icon }) => (
          <Link
            key={key}
            href={`${basePath}${href}`}
            className="group flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-5 transition-all duration-200 hover:border-border hover:shadow-sm"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/8">
              <Icon className="size-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">{t[labelKey]}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{t[`owner_quick_${key}_desc`]}</p>
            </div>
            <ArrowRight className="size-4 text-muted-foreground/40 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-muted-foreground" />
          </Link>
        ))}
      </div>
    </DashboardListPage>
  )
}
