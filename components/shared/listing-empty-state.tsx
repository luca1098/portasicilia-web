import Link from 'next/link'
import { PropsWithChildren } from 'react'
import { Compass } from '@/lib/constants/icons'
import { Button } from '@/components/ui/button'

type ListingEmptyStateProps = PropsWithChildren<{
  title: string
  subtitle: string
  ctaHref?: string
  ctaLabel?: string
  suggestionsHeading?: string
}>

export default function ListingEmptyState({
  title,
  subtitle,
  ctaHref,
  ctaLabel,
  suggestionsHeading,
  children,
}: ListingEmptyStateProps) {
  return (
    <section>
      <div className="rounded-2xl border border-dashed bg-zinc-50/60 px-6 py-12 text-center">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Compass className="size-7" />
        </div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{subtitle}</p>
        {ctaHref && ctaLabel && (
          <Button asChild className="mt-5">
            <Link href={ctaHref}>{ctaLabel}</Link>
          </Button>
        )}
      </div>

      {children && (
        <div className="mt-10">
          {suggestionsHeading && <h3 className="mb-4 text-lg font-semibold">{suggestionsHeading}</h3>}
          {children}
        </div>
      )}
    </section>
  )
}
