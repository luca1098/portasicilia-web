import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils/shadcn.utils'

const statusStyles: Record<string, string> = {
  DRAFT: 'bg-muted text-muted-foreground',
  PUBLISHED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  ARCHIVED: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
}

type ArticleStatusBadgeProps = {
  status: string
  label: string
}

export default function ArticleStatusBadge({ status, label }: ArticleStatusBadgeProps) {
  return (
    <Badge variant="outline" className={cn('text-[11px] font-medium', statusStyles[status])}>
      {label}
    </Badge>
  )
}
