'use client'

import { useTranslation } from '@/lib/context/translation.context'
import {
  MapPinnedIcon,
  Compass,
  StarIcon,
  UsersIcon,
  ArrowRight,
  ClipboardListIcon,
  CalendarCheck2Icon,
  StoreIcon,
} from '@/lib/constants/icons'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { cn } from '@/lib/utils/shadcn.utils'
import { DashboardListPage } from '@/components/dashboard/dashboard-page'

type StatsLabels = {
  locations: string
  experiences: string
  stays: string
  users: string
  owners: string
}

type StatsValues = {
  locations: string
  experiences: string
  stays: string
  users: string
  owners: string
}

type AdminDashboardContentProps = {
  title: string
  welcome: string
  stats: StatsLabels
  values: StatsValues
}

const statsConfig = [
  {
    key: 'locations' as const,
    icon: MapPinnedIcon,
    accent: 'text-primary',
    bgAccent: 'bg-primary/8',
  },
  {
    key: 'experiences' as const,
    icon: Compass,
    accent: 'text-chart-1',
    bgAccent: 'bg-chart-1/8',
  },
  {
    key: 'stays' as const,
    icon: StarIcon,
    accent: 'text-chart-2',
    bgAccent: 'bg-chart-2/8',
  },
  {
    key: 'users' as const,
    icon: UsersIcon,
    accent: 'text-chart-4',
    bgAccent: 'bg-chart-4/8',
  },
  {
    key: 'owners' as const,
    icon: StoreIcon,
    accent: 'text-chart-5',
    bgAccent: 'bg-chart-5/8',
  },
]

const quickLinks = [
  {
    key: 'locations' as const,
    labelKey: 'admin_sidebar_locations',
    href: '/locations',
    icon: MapPinnedIcon,
    descKey: 'admin_quick_locations_desc',
  },
  {
    key: 'experiences' as const,
    labelKey: 'admin_sidebar_experiences',
    href: '/experiences',
    icon: Compass,
    descKey: 'admin_quick_experiences_desc',
  },
  {
    key: 'requests' as const,
    labelKey: 'admin_sidebar_requests',
    href: '/requests',
    icon: ClipboardListIcon,
    descKey: 'admin_quick_requests_desc',
  },
  {
    key: 'bookings' as const,
    labelKey: 'admin_sidebar_bookings',
    href: '/bookings',
    icon: CalendarCheck2Icon,
    descKey: 'admin_quick_bookings_desc',
  },
]

export default function AdminDashboardContent({ title, welcome, stats, values }: AdminDashboardContentProps) {
  const t = useTranslation() as Record<string, string>
  const params = useParams()
  const lang = params.lang as string
  const basePath = `/${lang}/dashboard/admin`

  return (
    <DashboardListPage>
      {/* Welcome */}
      <div className="rounded-2xl bg-gradient-to-br from-primary/8 via-primary/5 to-transparent p-6 sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">{welcome}</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
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
        {quickLinks.map(({ key, labelKey, href, icon: Icon, descKey }) => (
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
              <p className="mt-0.5 text-xs text-muted-foreground">{t[descKey]}</p>
            </div>
            <ArrowRight className="size-4 text-muted-foreground/40 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-muted-foreground" />
          </Link>
        ))}
      </div>
    </DashboardListPage>
  )
}
