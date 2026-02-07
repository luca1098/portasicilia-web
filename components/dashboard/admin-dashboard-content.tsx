'use client'

import { MapPinnedIcon, Compass, StarIcon, UsersIcon } from '@/lib/constants/icons'

type StatsLabels = {
  locations: string
  experiences: string
  stays: string
  users: string
}

type AdminDashboardContentProps = {
  title: string
  welcome: string
  stats: StatsLabels
}

const statsConfig = [
  { key: 'locations' as const, icon: MapPinnedIcon, value: '—', accent: 'text-primary' },
  { key: 'experiences' as const, icon: Compass, value: '—', accent: 'text-chart-1' },
  { key: 'stays' as const, icon: StarIcon, value: '—', accent: 'text-chart-2' },
  { key: 'users' as const, icon: UsersIcon, value: '—', accent: 'text-chart-4' },
]

export default function AdminDashboardContent({ title, welcome, stats }: AdminDashboardContentProps) {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{welcome}</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statsConfig.map(({ key, icon: Icon, value, accent }) => (
          <div
            key={key}
            className="group rounded-xl border border-border bg-card p-5 transition-colors hover:border-border/80 hover:bg-accent/30"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {stats[key]}
              </span>
              <Icon className={`size-4 ${accent} opacity-60`} />
            </div>
            <p className="mt-3 text-2xl font-semibold tabular-nums tracking-tight">{value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
