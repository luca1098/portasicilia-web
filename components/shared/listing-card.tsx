'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { HeartIcon, StarIcon } from '@/lib/constants/icons'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils/shadcn.utils'
import useFavoriteStore, { useFavoriteActions } from '@/core/store/favorite.store'
import LoginPopup from '@/components/auth/login-popup'

export type ListingCardProps = {
  title: string
  image: string
  href: string
  rating: number
  reviewCount?: number
  priceLabel: string
  categoryLabel?: string
  duration?: string
  darkBg?: boolean
  listingId?: string
}

export default function ListingCard({
  title,
  image,
  href,
  rating,
  reviewCount,
  priceLabel,
  categoryLabel,
  duration,
  darkBg,
  listingId,
}: ListingCardProps) {
  const [loginOpen, setLoginOpen] = useState(false)
  const { data: session } = useSession()
  const isFavorited = useFavoriteStore(state => (listingId ? state.listingIds.includes(listingId) : false))
  const { toggleListing } = useFavoriteActions()

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!listingId) return
    if (!session?.user) {
      setLoginOpen(true)
      return
    }
    toggleListing(listingId, session.accessToken)
  }

  return (
    <>
      <Link href={href} className="group w-full shrink-0">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 208px"
          />

          {categoryLabel && (
            <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold">
              {categoryLabel}
            </span>
          )}

          {listingId && (
            <Button
              type="button"
              className="absolute right-2 top-2 rounded-full p-1 text-white transition-colors hover:text-primary"
              onClick={handleFavoriteClick}
              aria-label="Save"
              size={'icon'}
              variant={'ghost'}
            >
              <HeartIcon className={cn('size-5', isFavorited && 'fill-red-500 text-red-500')} />
            </Button>
          )}

          {duration && (
            <span className="absolute bottom-2 left-2 rounded-md bg-black/60 px-1.5 py-0.5 text-[11px] font-medium text-white">
              {duration}
            </span>
          )}

          <span className="absolute bottom-2 right-2 flex items-center gap-0.5 rounded-md bg-black/60 px-1.5 py-0.5 text-[11px] font-medium text-white">
            <StarIcon className="size-3 fill-white" />
            {rating}
            {reviewCount !== undefined && ` (${reviewCount})`}
          </span>
        </div>

        <div className="mt-2">
          <p className={`line-clamp-2 text-sm font-medium ${darkBg ? 'text-white' : 'text-foreground'}`}>
            {title}
          </p>
          <p className={`mt-0.5 text-xs ${darkBg ? 'text-white/70' : 'text-muted-foreground'}`}>
            {priceLabel}
          </p>
        </div>
      </Link>

      {loginOpen && <LoginPopup onClose={() => setLoginOpen(false)} />}
    </>
  )
}
