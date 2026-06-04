import { Badge } from '@/components/ui/badge'

type OwnerStatusBadgeProps = {
  claimedAt?: string | null
  fromPartnerApplication?: boolean
  manualLabel: string
  claimedLabel: string
  partnerApplicationLabel: string
}

export function OwnerStatusBadge({
  claimedAt,
  fromPartnerApplication,
  manualLabel,
  claimedLabel,
  partnerApplicationLabel,
}: OwnerStatusBadgeProps) {
  if (claimedAt) {
    return (
      <Badge variant="secondary" className="bg-green-500/10 text-green-700 border-green-200">
        {claimedLabel}
      </Badge>
    )
  }
  if (fromPartnerApplication) {
    return (
      <Badge variant="secondary" className="bg-blue-500/10 text-blue-700 border-blue-200">
        {partnerApplicationLabel}
      </Badge>
    )
  }
  return <Badge variant="outline">{manualLabel}</Badge>
}
