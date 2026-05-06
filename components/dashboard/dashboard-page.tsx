import type { PropsWithChildren } from 'react'
import { cn } from '@/lib/utils/shadcn.utils'

type DashboardPageProps = PropsWithChildren<{
  className?: string
}>

function DashboardPageFrame({ className, children }: DashboardPageProps) {
  return <div className={cn('mx-auto w-full space-y-8', className)}>{children}</div>
}

export function DashboardListPage({ className, children }: DashboardPageProps) {
  return <DashboardPageFrame className={cn('max-w-6xl', className)}>{children}</DashboardPageFrame>
}

export function DashboardFormPage({ className, children }: DashboardPageProps) {
  return <DashboardPageFrame className={cn('max-w-2xl', className)}>{children}</DashboardPageFrame>
}

export function DashboardWidePage({ className, children }: DashboardPageProps) {
  return <DashboardPageFrame className={cn('max-w-5xl', className)}>{children}</DashboardPageFrame>
}
