'use client'

import type { ComponentType, ReactNode, SVGProps } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LoaderIcon } from '@/lib/constants/icons'
import { useTranslation } from '@/lib/context/translation.context'

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>

export function BookingsEmpty({ icon: Icon, children }: { icon: IconComponent; children: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/20 px-6 py-14 text-center">
      <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-muted/60">
        <Icon className="size-6 text-muted-foreground/50" />
      </div>
      <p className="max-w-[240px] text-sm leading-relaxed text-muted-foreground/70">{children}</p>
    </div>
  )
}

export function BookingsLoadMore({ onClick, loading }: { onClick: () => void; loading: boolean }) {
  const t = useTranslation() as Record<string, string>
  return (
    <div className="flex justify-center">
      <Button variant="outline" onClick={onClick} disabled={loading}>
        {loading && <LoaderIcon className="size-4 animate-spin" />}
        {t.admin_load_more}
      </Button>
    </div>
  )
}

export type StatusFilter = { key: string; labelKey: string }

export function StatusFilterPills({
  activeStatus,
  filters,
}: {
  activeStatus: string
  filters: StatusFilter[]
}) {
  const t = useTranslation() as Record<string, string>
  const router = useRouter()
  const pathname = usePathname()

  function handleFilter(key: string) {
    if (key === 'ALL') {
      router.replace(pathname)
    } else {
      router.replace(`${pathname}?status=${key}`)
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map(filter => {
        const isActive = activeStatus === filter.key
        return (
          <button
            key={filter.key}
            onClick={() => handleFilter(filter.key)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
              isActive
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            {t[filter.labelKey] || filter.key}
          </button>
        )
      })}
    </div>
  )
}
