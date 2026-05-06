'use client'

import Image from 'next/image'
import Link from 'next/link'
import { StarIcon } from '@/lib/constants/icons'
import { useTranslation } from '@/lib/context/translation.context'
import { interpolate } from '@/lib/utils/i18n.utils'
import type { FavoriteListingItem } from '@/lib/api/favorite.api'
import { formatCurrency } from '@/core/utils/currency.utils'
import { useParams } from 'next/navigation'

type WishlistItemProps = {
  item: FavoriteListingItem
}

export default function WishlistItem({ item }: WishlistItemProps) {
  const t = useTranslation()
  const { lang } = useParams()

  const { listing } = item

  const href =
    listing.type === 'EXPERIENCE' ? `/${lang}/experiences/${listing.slug}` : `/${lang}/stays/${listing.slug}`

  const minPrice = listing.priceLists?.[0]?.tiers?.[0]?.baseAmount

  const priceLabel = minPrice
    ? listing.type === 'STAY'
      ? interpolate(t.wishlist_per_night, { price: formatCurrency(Number(minPrice)) })
      : interpolate(t.wishlist_per_person, { price: formatCurrency(Number(minPrice)) })
    : null

  const avgRating =
    listing.reviews.length > 0
      ? (listing.reviews.reduce((sum, r) => sum + r.rating, 0) / listing.reviews.length).toFixed(1)
      : null

  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl border bg-background p-3 transition-colors hover:bg-muted/50"
    >
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
        <Image src={listing.cover} alt={listing.name} fill className="object-cover" sizes="56px" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 text-sm font-medium leading-snug">{listing.name}</p>
        <div className="mt-1 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <StarIcon className="size-3 fill-foreground text-foreground" />
            <span className="text-xs">{avgRating ?? '—'}</span>
          </div>
          {priceLabel && <p className="shrink-0 text-xs text-muted-foreground">{priceLabel}</p>}
        </div>
      </div>
    </Link>
  )
}
