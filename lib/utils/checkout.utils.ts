import { interpolate } from '@/lib/utils/i18n.utils'

export type BookingPriceTier = {
  tierType: string
  baseAmount: number
  quantity: number
  subtotal: number
}

export function getPriceTierLine(
  tier: BookingPriceTier,
  t: Record<string, string>,
  assetLabel?: string | null
): string {
  if (tier.tierType === 'PER_EXPERIENCE') return t.checkout_price_per_experience
  if (tier.tierType === 'PER_ASSET') {
    return interpolate(t.checkout_price_per_asset, {
      price: Math.round(tier.baseAmount),
      quantity: tier.quantity,
      asset: assetLabel ?? '',
    })
  }
  const label = (() => {
    switch (tier.tierType) {
      case 'ADULT':
        return interpolate(tier.quantity === 1 ? t.checkout_adult : t.checkout_adults, {
          count: tier.quantity,
        })
      case 'CHILD':
        return interpolate(tier.quantity === 1 ? t.checkout_child : t.checkout_children, {
          count: tier.quantity,
        })
      case 'INFANT':
        return interpolate(tier.quantity === 1 ? t.checkout_infant : t.checkout_infants, {
          count: tier.quantity,
        })
      default:
        return tier.tierType.toLowerCase()
    }
  })()
  return `\u20AC ${Math.round(tier.baseAmount)} x  ${label}`
}

export function buildParticipantSummary(
  adults: number,
  children: number,
  infants: number,
  t: Record<string, string>,
  separator: string
): string {
  const parts: string[] = []
  if (adults > 0)
    parts.push(interpolate(adults === 1 ? t.checkout_adult : t.checkout_adults, { count: adults }))
  if (children > 0)
    parts.push(interpolate(children === 1 ? t.checkout_child : t.checkout_children, { count: children }))
  if (infants > 0)
    parts.push(interpolate(infants === 1 ? t.checkout_infant : t.checkout_infants, { count: infants }))
  return parts.join(separator)
}

export function computeAvgRating(reviews: Array<{ rating: number }> | null | undefined): number | null {
  if (!reviews || reviews.length === 0) return null
  return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
}
