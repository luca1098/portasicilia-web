import type { ReactNode } from 'react'

type AdminListHeaderProps = {
  title: string
  subtitle?: string
  children?: ReactNode
}

export default function AdminListHeader({ title, subtitle, children }: AdminListHeaderProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-gradient-to-br from-primary/8 via-primary/5 to-transparent p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1.5 text-sm text-muted-foreground sm:text-base">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}
