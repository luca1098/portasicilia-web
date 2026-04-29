import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowLeft } from '@/lib/constants/icons'

type AdminDetailHeaderProps = {
  backHref: string
  title: string
  children?: ReactNode
}

export default function AdminDetailHeader({ backHref, title, children }: AdminDetailHeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <Link
        href={backHref}
        className="flex size-9 items-center justify-center rounded-lg border border-border transition-colors hover:bg-accent"
      >
        <ArrowLeft className="size-4" />
      </Link>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {children}
      </div>
    </div>
  )
}
