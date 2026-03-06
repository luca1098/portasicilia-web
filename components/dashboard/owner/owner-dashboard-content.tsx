import { CalendarCheck2Icon, ClipboardListIcon, DollarSignIcon, UsersIcon } from '@/lib/constants/icons'

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
  },
  {
    key: 'confirmedCount' as const,
    icon: UsersIcon,
    accent: 'text-chart-1',
  },
  {
    key: 'pendingCount' as const,
    icon: ClipboardListIcon,
    accent: 'text-chart-2',
  },
  {
    key: 'totalRevenue' as const,
    icon: DollarSignIcon,
    accent: 'text-chart-4',
  },
]

export default function OwnerDashboardContent({ title, welcome, stats, values }: OwnerDashboardContentProps) {
  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{welcome}</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statsConfig.map(({ key, icon: Icon, accent }) => (
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
            <p className="mt-3 text-2xl font-semibold tabular-nums tracking-tight">{values[key]}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
