'use client'

import { MinusIcon, PlusIcon } from '@/lib/constants/icons'
import { Button } from '@/components/ui/button'

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
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{ageRange}</p>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon-sm"
          className="rounded-full"
          disabled={count <= min}
          onClick={() => onChange(count - 1)}
        >
          <MinusIcon className="size-4" />
        </Button>
        <span className="w-5 text-center text-sm font-medium">{count}</span>
        <Button
          variant="outline"
          size="icon-sm"
          className="rounded-full"
          disabled={count >= max}
          onClick={() => onChange(count + 1)}
        >
          <PlusIcon className="size-4" />
        </Button>
      </div>
    </div>
  )
}
