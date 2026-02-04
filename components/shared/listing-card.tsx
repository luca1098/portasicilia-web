'use client'
import Image from 'next/image'
import Link from 'next/link'
import { HeartIcon, StarIcon } from 'lucide-react'

export type ListingCardProps = {
  title: string
  image: string
  href: string
  rating: number
  priceLabel: string
  categoryLabel?: string
  duration?: string
}

export default function ListingCard({
  title,
  image,
  href,
  rating,
  priceLabel,
  categoryLabel,
  duration,
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

        <button
          type="button"
          className="absolute right-2 top-2 rounded-full p-1 text-white transition-colors hover:text-red-400"
          onClick={e => e.preventDefault()}
          aria-label="Save"
        >
          <HeartIcon className="size-5" />
        </button>

        {duration && (
          <span className="absolute bottom-2 left-2 rounded-md bg-black/60 px-1.5 py-0.5 text-[11px] font-medium text-white">
            {duration}
          </span>
        )}

        <span className="absolute bottom-2 right-2 flex items-center gap-0.5 rounded-md bg-black/60 px-1.5 py-0.5 text-[11px] font-medium text-white">
          <StarIcon className="size-3 fill-white" />
          {rating}
        </span>
      </div>

      <div className="mt-2">
        <p className="line-clamp-2 text-sm font-medium text-foreground">{title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{priceLabel}</p>
      </div>
    </Link>
  )
}
