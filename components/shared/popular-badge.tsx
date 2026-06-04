'use client'

import { useTranslation } from '@/lib/context/translation.context'
import { cn } from '@/lib/utils/shadcn.utils'

type PopularBadgeProps = {
  className?: string
}

export default function PopularBadge({ className }: PopularBadgeProps) {
  const t = useTranslation()

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-white/70 px-2 py-1 text-[10px] font-semibold text-foreground shadow-sm ring-1 ring-black/5 backdrop-blur-md sm:text-[11px]',
        className
      )}
    >
      <span aria-hidden="true">🔥</span>
      {t.listing_popular_badge}
    </span>
  )
}
