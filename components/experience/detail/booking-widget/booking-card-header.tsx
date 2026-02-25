import { StarIcon } from '@/lib/constants/icons'
import Image from 'next/image'

type BookingCardHeaderProps = {
  name: string
  cover: string | null
  imageUrl?: string
  avgRating: number
}

export default function BookingCardHeader({ name, cover, imageUrl, avgRating }: BookingCardHeaderProps) {
  const src = cover ?? imageUrl

  return (
    <>
      <div className="mb-4 flex items-start gap-3">
        {src ? (
          <Image
            src={src}
            alt={name}
            width={40}
            height={40}
            className="size-10 shrink-0 rounded-lg object-cover"
          />
        ) : (
          <div className="size-10 shrink-0 rounded-lg bg-muted" />
        )}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-snug">{name}</p>
        </div>
        {avgRating > 0 && (
          <div className="flex shrink-0 items-center gap-1">
            <StarIcon className="size-3.5 fill-foreground stroke-foreground" />
            <span className="text-xs font-semibold">{avgRating.toFixed(1)}</span>
          </div>
        )}
      </div>
      <hr className="mb-4 border-border" />
    </>
  )
}
