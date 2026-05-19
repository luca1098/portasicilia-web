'use client'

import { useTranslation } from '@/lib/context/translation.context'
import type { PartnerApplicationStatus } from '@/lib/types/partner-application.type'

const STATUS_BADGE_CLASS: Record<PartnerApplicationStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-800',
  IN_REVIEW: 'bg-blue-100 text-blue-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
}

const STATUS_LABEL_KEY: Record<PartnerApplicationStatus, string> = {
  PENDING: 'partner_admin_status_pending',
  IN_REVIEW: 'partner_admin_status_in_review',
  APPROVED: 'partner_admin_status_approved',
  REJECTED: 'partner_admin_status_rejected',
}

export function PartnerApplicationStatusBadge({ status }: { status: PartnerApplicationStatus }) {
  const t = useTranslation() as Record<string, string>
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_BADGE_CLASS[status]}`}>
      {t[STATUS_LABEL_KEY[status]]}
    </span>
  )
}
