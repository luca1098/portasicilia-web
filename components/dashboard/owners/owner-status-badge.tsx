import { Badge } from '@/components/ui/badge'

type OwnerStatusBadgeProps = {
  claimedAt?: string | null
  manualLabel: string
  claimedLabel: string
}

export function OwnerStatusBadge({ claimedAt, manualLabel, claimedLabel }: OwnerStatusBadgeProps) {
  if (claimedAt) {
    return (
      <Badge variant="secondary" className="bg-green-500/10 text-green-700 border-green-200">
        {claimedLabel}
      </Badge>
    )
  }
  return <Badge variant="outline">{manualLabel}</Badge>
}
