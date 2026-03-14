'use client'

import { useState } from 'react'
import { useTranslation } from '@/lib/context/translation.context'

type StayExpandableTextProps = {
  text: string
}

export default function StayExpandableText({ text }: StayExpandableTextProps) {
  const t = useTranslation()
  const [expanded, setExpanded] = useState(false)

  return (
    <div>
      <p className={`text-sm leading-relaxed text-muted-foreground ${expanded ? '' : 'line-clamp-4'}`}>
        {text}
      </p>
      <button
        type="button"
        className="mt-2 text-sm font-semibold text-primary underline"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? t.stay_detail_show_less : t.stay_detail_show_more}
      </button>
    </div>
  )
}
