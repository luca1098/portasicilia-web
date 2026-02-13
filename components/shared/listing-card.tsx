'use client'
import Image from 'next/image'
import Link from 'next/link'
import { HeartIcon, StarIcon } from 'lucide-react'
import { Button } from '../ui/button'

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
}: ListingCardProps) {
  return (
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

        <Button
          type="button"
          className="absolute right-2 top-2 rounded-full p-1 text-white transition-colors hover:text-primary"
          onClick={e => e.preventDefault()}
          aria-label="Save"
          size={'icon'}
          variant={'ghost'}
        >
          <HeartIcon className="size-5" />
        </Button>

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
        <p className={`mt-0.5 text-xs ${darkBg ? 'text-white/70' : 'text-muted-foreground'}`}>{priceLabel}</p>
      </div>
    </Link>
  )
}
