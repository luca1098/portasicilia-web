'use client'

import { useState } from 'react'
import { useTranslation } from '@/lib/context/translation.context'

type ExperienceExpandableTextProps = {
  text: string
}

export default function ExperienceExpandableText({ text }: ExperienceExpandableTextProps) {
  const t = useTranslation()
  const [expanded, setExpanded] = useState(false)

  return (
    <div>
      <p className={`text-sm leading-relaxed text-muted-foreground ${expanded ? '' : 'line-clamp-4'}`}>
        {text}
      </p>
      <button
        type="button"
        className="mt-2 text-sm font-semibold underline"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? t.exp_detail_show_less : t.exp_detail_show_more}
      </button>
    </div>
  )
}
