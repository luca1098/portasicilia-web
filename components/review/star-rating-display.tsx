import { StarIcon } from '@/lib/constants/icons'
import { cn } from '@/lib/utils/shadcn.utils'

type StarRatingDisplayProps = {
  rating: number
  size?: string
}

const STAR_INDICES = [0, 1, 2, 3, 4]

export default function StarRatingDisplay({ rating, size = 'size-3' }: StarRatingDisplayProps) {
  return (
    <div className="flex gap-0.5">
      {STAR_INDICES.map(i => (
        <StarIcon
          key={i}
          className={cn(size, i < rating ? 'fill-foreground text-foreground' : 'fill-muted text-muted')}
        />
      ))}
    </div>
  )
}
