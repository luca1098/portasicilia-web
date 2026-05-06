import type { ComponentType } from 'react'

type AdminEmptyStateProps = {
  icon: ComponentType<{ className?: string }>
  message: string
}

export default function AdminEmptyState({ icon: Icon, message }: AdminEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/20 px-6 py-14 text-center">
      <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-muted/60">
        <Icon className="size-6 text-muted-foreground/50" />
      </div>
      <p className="max-w-[240px] text-sm leading-relaxed text-muted-foreground/70">{message}</p>
    </div>
  )
}
