'use client'

import { useCallback } from 'react'

type ParticipantCounterProps = {
  label: string
  ageRange: string
  count: number
  min?: number
  max?: number
  onChange: (count: number) => void
}

export default function ParticipantCounter({
  label,
  ageRange,
  count,
  min = 0,
  max = 10,
  onChange,
}: ParticipantCounterProps) {
  const decrement = useCallback(() => onChange(count - 1), [onChange, count])
  const increment = useCallback(() => onChange(count + 1), [onChange, count])

  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-semibold">{label}</p>
        {ageRange ? <p className="text-xs text-muted-foreground">{ageRange}</p> : null}
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="text-lg font-medium text-muted-foreground transition-colors disabled:opacity-30"
          disabled={count <= min}
          onClick={decrement}
        >
          -
        </button>
        <span className="w-4 text-center text-sm font-medium">{count}</span>
        <button
          type="button"
          className="text-lg font-medium text-muted-foreground transition-colors disabled:opacity-30"
          disabled={count >= max}
          onClick={increment}
        >
          +
        </button>
      </div>
    </div>
  )
}
