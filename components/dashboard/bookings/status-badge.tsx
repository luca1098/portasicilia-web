'use client'

import { useTranslation } from '@/lib/context/translation.context'
import {
  ClockIcon,
  CheckIcon,
  XIcon,
  RotateCcwIcon,
  CheckCheckIcon,
  BanIcon,
  HelpCircleIcon,
} from '@/lib/constants/icons'
import { cn } from '@/lib/utils/shadcn.utils'

export type BadgeVariant = 'amber' | 'green' | 'red' | 'orange' | 'gray' | 'blue'

const VARIANT_STYLES: Record<BadgeVariant, { pill: string; dot: string }> = {
  amber: { pill: 'bg-amber-50 text-amber-700', dot: 'bg-amber-500' },
  green: { pill: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
  red: { pill: 'bg-red-50 text-red-600', dot: 'bg-red-500' },
  orange: { pill: 'bg-orange-50 text-orange-700', dot: 'bg-orange-500' },
  gray: { pill: 'bg-gray-100 text-gray-700', dot: 'bg-gray-400' },
  blue: { pill: 'bg-blue-50 text-blue-700', dot: 'bg-blue-500' },
}

export function BadgePill({
  variant,
  icon: Icon,
  children,
}: {
  variant: BadgeVariant
  icon: React.ElementType
  children: React.ReactNode
}) {
  const styles = VARIANT_STYLES[variant]
  return (
    <span
      className={cn(
        'inline-flex w-fit items-center gap-1.5 rounded-full py-0.5 pr-2.5 pl-0.5 text-xs font-semibold',
        styles.pill
      )}
    >
      <span
        className={cn('flex size-[18px] items-center justify-center rounded-full text-white', styles.dot)}
      >
        <Icon className="size-3" strokeWidth={3} />
      </span>
      {children}
    </span>
  )
}

const STATUS_CONFIG: Record<string, { variant: BadgeVariant; icon: React.ElementType }> = {
  PENDING_APPROVAL: { variant: 'amber', icon: ClockIcon },
  CONFIRMED: { variant: 'green', icon: CheckIcon },
  REJECTED: { variant: 'red', icon: XIcon },
  COUNTER_PROPOSED: { variant: 'orange', icon: RotateCcwIcon },
  CANCELLED: { variant: 'gray', icon: BanIcon },
  COMPLETED: { variant: 'blue', icon: CheckCheckIcon },
  NO_SHOW: { variant: 'gray', icon: HelpCircleIcon },
}

export function StatusBadge({ status }: { status: string }) {
  const t = useTranslation() as Record<string, string>
  const config = STATUS_CONFIG[status] ?? { variant: 'gray' as const, icon: HelpCircleIcon }
  return (
    <BadgePill variant={config.variant} icon={config.icon}>
      {t[`admin_booking_status_${status.toLowerCase()}`] || status}
    </BadgePill>
  )
}

export function PaymentBadge({ status }: { status: string }) {
  const t = useTranslation() as Record<string, string>
  if (status !== 'REFUNDED') return null
  return (
    <BadgePill variant="blue" icon={RotateCcwIcon}>
      {t.admin_booking_payment_refunded}
    </BadgePill>
  )
}
