'use client'

import { useTranslation } from '@/lib/context/translation.context'
import { interpolate } from '@/lib/utils/i18n.utils'
import { CalendarCheck2Icon, ClipboardListIcon, InboxIcon, PackageIcon } from '@/lib/constants/icons'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils/shadcn.utils'
import { DashboardWidePage } from '@/components/dashboard/dashboard-page'
import { useUserBookings } from './user-bookings-provider'
import UserBookingCard from './user-booking-card'
import UserOrderCard, { UserOrdersEmptyState } from './user-order-card'

const REQUEST_FILTERS = [
  { key: 'ALL', labelKey: 'user_filter_all' },
  { key: 'PENDING_APPROVAL', labelKey: 'admin_booking_status_pending_approval' },
  { key: 'COUNTER_PROPOSED', labelKey: 'admin_booking_status_counter_proposed' },
  { key: 'REJECTED', labelKey: 'admin_booking_status_rejected' },
]

function StatusFilterPills() {
  const t = useTranslation() as Record<string, string>
  const { state, actions } = useUserBookings()

  return (
    <div className="flex flex-wrap gap-2">
      {REQUEST_FILTERS.map(filter => {
        const isActive = state.requestFilter === filter.key
        const showBadge = filter.key === 'COUNTER_PROPOSED' && state.counterProposedCount > 0
        return (
          <button
            key={filter.key}
            onClick={() => actions.setRequestFilter(filter.key)}
            className={cn(
              'relative rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200',
              isActive
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            {t[filter.labelKey] || filter.key}
            {showBadge && (
              <span className="ml-1.5 inline-flex size-4 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
                {state.counterProposedCount}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

function EmptyState({ message, icon: Icon }: { message: string; icon?: React.ElementType }) {
  const IconComponent = Icon || InboxIcon
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/20 px-6 py-14 text-center">
      <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-muted/60">
        <IconComponent className="size-6 text-muted-foreground/50" />
      </div>
      <p className="max-w-[240px] text-sm leading-relaxed text-muted-foreground/70">{message}</p>
    </div>
  )
}

function RequestsTab() {
  const t = useTranslation() as Record<string, string>
  const { state } = useUserBookings()

  return (
    <TabsContent value="requests" className="mt-0 space-y-5">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-lg font-semibold tracking-tight">{t.user_section_requests}</h2>
          {state.counterProposedCount > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/10 px-2.5 py-0.5 text-xs font-semibold text-orange-600 dark:text-orange-400">
              <span className="size-1.5 rounded-full bg-orange-500" />
              {interpolate(t.user_counter_proposals_badge, { count: state.counterProposedCount })}
            </span>
          )}
        </div>
        <StatusFilterPills />
      </div>

      {state.filteredRequests.length === 0 ? (
        <EmptyState
          icon={ClipboardListIcon}
          message={
            state.requestFilter === 'ALL'
              ? t.user_requests_empty_all
              : t[`user_requests_empty_${state.requestFilter.toLowerCase()}`] || t.user_requests_empty_all
          }
        />
      ) : (
        <div className="space-y-3">
          {state.filteredRequests.map(booking => (
            <UserBookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      )}
    </TabsContent>
  )
}

function BookingsTab() {
  const t = useTranslation() as Record<string, string>
  const { state } = useUserBookings()

  return (
    <TabsContent value="bookings" className="mt-0 space-y-5">
      <h2 className="text-lg font-semibold tracking-tight">{t.user_section_bookings}</h2>
      {state.confirmedBookings.length === 0 ? (
        <EmptyState icon={CalendarCheck2Icon} message={t.user_bookings_empty} />
      ) : (
        <div className="space-y-3">
          {state.confirmedBookings.map(booking => (
            <UserBookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      )}
    </TabsContent>
  )
}

function OrdersTab() {
  const t = useTranslation() as Record<string, string>
  const { state, actions } = useUserBookings()

  return (
    <TabsContent value="orders" className="mt-0 space-y-5">
      <h2 className="text-lg font-semibold tracking-tight">{t.user_section_orders}</h2>
      {state.orders.length === 0 ? (
        <UserOrdersEmptyState />
      ) : (
        <div className="space-y-3">
          {state.orders.map(order => (
            <UserOrderCard key={order.id} order={order} onUpdated={actions.updateOrder} />
          ))}
        </div>
      )}
    </TabsContent>
  )
}

const TAB_TRIGGER_CLASS = cn(
  'group relative h-auto justify-start gap-3 rounded-xl px-4 py-3 text-sm font-medium',
  'transition-all duration-200 data-[state=active]:bg-primary/8 data-[state=active]:shadow-none',
  'data-[state=active]:text-primary data-[state=inactive]:text-muted-foreground',
  'hover:bg-accent/50'
)

export default function UserDashboardContent({ title, welcome }: { title: string; welcome: string }) {
  const t = useTranslation() as Record<string, string>
  const { state } = useUserBookings()

  return (
    <DashboardWidePage>
      {/* Welcome */}
      <div className="rounded-2xl bg-gradient-to-br from-primary/8 via-primary/5 to-transparent p-6 sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">{welcome}</p>
      </div>

      {/* Tabbed content */}
      <Tabs defaultValue="requests" className="flex flex-col gap-6 md:flex-row md:gap-0">
        {/* Side navigation */}
        <TabsList
          className={cn(
            'h-auto w-full shrink-0 justify-start rounded-none bg-transparent p-0',
            'flex flex-row gap-1 border-b border-border pb-3',
            'md:w-56 md:flex-col md:items-stretch md:gap-1.5 md:border-b-0 md:border-r md:pb-0 md:pr-6'
          )}
        >
          <TabsTrigger value="requests" className={TAB_TRIGGER_CLASS}>
            <ClipboardListIcon className="size-[18px] shrink-0" />
            <span className="hidden sm:inline">{t.user_section_requests}</span>
            <span
              className={cn(
                'ml-auto inline-flex size-5 items-center justify-center rounded-full text-[11px] font-semibold tabular-nums',
                state.requests.length > 0 ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground/60'
              )}
            >
              {state.requests.length}
            </span>
            {state.counterProposedCount > 0 && (
              <span className="absolute -top-1 right-1 flex size-2.5 md:-right-1 md:top-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-orange-400 opacity-75" />
                <span className="relative inline-flex size-2.5 rounded-full bg-orange-500" />
              </span>
            )}
          </TabsTrigger>

          <TabsTrigger value="bookings" className={TAB_TRIGGER_CLASS}>
            <CalendarCheck2Icon className="size-[18px] shrink-0" />
            <span className="hidden sm:inline">{t.user_section_bookings}</span>
            <span
              className={cn(
                'ml-auto inline-flex size-5 items-center justify-center rounded-full text-[11px] font-semibold tabular-nums',
                state.confirmedBookings.length > 0
                  ? 'bg-primary/15 text-primary'
                  : 'bg-muted text-muted-foreground/60'
              )}
            >
              {state.confirmedBookings.length}
            </span>
          </TabsTrigger>

          <TabsTrigger value="orders" className={TAB_TRIGGER_CLASS}>
            <PackageIcon className="size-[18px] shrink-0" />
            <span className="hidden sm:inline">{t.user_section_orders}</span>
            <span
              className={cn(
                'ml-auto inline-flex size-5 items-center justify-center rounded-full text-[11px] font-semibold tabular-nums',
                state.orders.length > 0 ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground/60'
              )}
            >
              {state.orders.length}
            </span>
          </TabsTrigger>
        </TabsList>

        {/* Content area */}
        <div className="min-w-0 flex-1 md:pl-6">
          <RequestsTab />
          <BookingsTab />
          <OrdersTab />
        </div>
      </Tabs>
    </DashboardWidePage>
  )
}
