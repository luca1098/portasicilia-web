'use client'

import { HeartIcon } from '@/lib/constants/icons'
import { useTranslation } from '@/lib/context/translation.context'
import useFavoriteStore from '@/core/store/favorite.store'
import { ScrollArea } from '@/components/ui/scroll-area'
import WishlistItem from './wishlist-item'
import type { FavoriteItem } from '@/lib/api/favorite.api'

export default function WishlistContent() {
  const t = useTranslation()
  const items = useFavoriteStore(state => state.items)

  const stays = items.filter((item: FavoriteItem) => item.listing.type === 'STAY')
  const experiences = items.filter((item: FavoriteItem) => item.listing.type === 'EXPERIENCE')

  if (items.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-12 text-center">
        <HeartIcon className="size-10 text-muted-foreground/40" />
        <p className="text-sm font-medium">{t.wishlist_empty}</p>
        <p className="text-xs text-muted-foreground">{t.wishlist_empty_description}</p>
      </div>
    )
  }

  return (
    <ScrollArea className="flex-1">
      <div className="px-4 pb-6">
        {stays.length > 0 && (
          <section className="mb-2">
            <h3 className="py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t.wishlist_stays}
            </h3>
            <div className="flex flex-col gap-2">
              {stays.map((item: FavoriteItem) => (
                <WishlistItem key={item.id} item={item} />
              ))}
            </div>
          </section>
        )}

        {experiences.length > 0 && (
          <section>
            <h3 className="py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t.wishlist_experiences}
            </h3>
            <div className="flex flex-col gap-2">
              {experiences.map((item: FavoriteItem) => (
                <WishlistItem key={item.id} item={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </ScrollArea>
  )
}
