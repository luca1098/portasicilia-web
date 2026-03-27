'use client'

import { useState } from 'react'
import { StarIcon } from '@/lib/constants/icons'
import { cn } from '@/lib/utils/shadcn.utils'

type StarRatingInputProps = {
  value: number
  onChange: (rating: number) => void
  disabled?: boolean
}

const STAR_VALUES = [1, 2, 3, 4, 5]

export default function StarRatingInput({ value, onChange, disabled = false }: StarRatingInputProps) {
  const [hovered, setHovered] = useState(0)

  const active = hovered > 0 ? hovered : value

  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Rating" onMouseLeave={() => setHovered(0)}>
      {STAR_VALUES.map(star => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
          disabled={disabled}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          className={cn(
            'rounded transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            !disabled && 'cursor-pointer hover:scale-110',
            disabled && 'cursor-not-allowed opacity-50'
          )}
        >
          <StarIcon
            className={cn(
              'size-8 transition-colors',
              star <= active ? 'fill-yellow-400 text-yellow-400' : 'fill-muted text-muted-foreground'
            )}
          />
        </button>
      ))}
    </div>
  )
}
