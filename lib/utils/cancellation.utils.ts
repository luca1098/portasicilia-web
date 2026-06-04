import { interpolate } from './i18n.utils'
import type { CancellationPolicy } from '@/lib/schemas/entities/experience.entity.schema'

type CancellationLike = {
  cancellationPolicy: CancellationPolicy
  cancellationRefundPercent: number | null
  cancellationCustomText: string | null
}

/**
 * Resolve a single, localized line describing the listing's cancellation
 * policy. Falls back to the owner-authored CUSTOM text when present.
 * Returns `null` only when the policy is CUSTOM with no text yet.
 */
export function formatCancellationPolicy(source: CancellationLike, t: Record<string, string>): string | null {
  switch (source.cancellationPolicy) {
    case 'FREE_24H':
      return t.admin_cancellation_preset_24h
    case 'FREE_48H':
      return t.admin_cancellation_preset_48h
    case 'NON_REFUNDABLE':
      return t.admin_cancellation_preset_non_refundable
    case 'PARTIAL_REFUND':
      if (source.cancellationRefundPercent == null) {
        return t.admin_cancellation_preset_partial_refund_label
      }
      return interpolate(t.admin_cancellation_preset_partial_refund, {
        percentage: String(source.cancellationRefundPercent),
      })
    case 'CUSTOM':
      return source.cancellationCustomText?.trim() || null
    default:
      return null
  }
}
