'use client'

import { useState } from 'react'
import { useTranslation } from '@/lib/context/translation.context'

type ProductDescriptionProps = {
  description: string
}

const MAX_LENGTH = 280

export default function ProductDescription({ description }: ProductDescriptionProps) {
  const t = useTranslation()
  const isLong = description.length > MAX_LENGTH
  const [expanded, setExpanded] = useState(false)

  const displayed = isLong && !expanded ? `${description.slice(0, MAX_LENGTH)}…` : description

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-gray-900">{t.shop_product_description}</h2>
      <p className="max-w-3xl whitespace-pre-wrap text-base leading-relaxed text-gray-600">{displayed}</p>
      {isLong && (
        <button
          onClick={() => setExpanded(e => !e)}
          className="mt-3 text-sm font-medium text-primary underline-offset-2 hover:underline"
        >
          {expanded ? t.shop_product_show_less : t.shop_product_show_more}
        </button>
      )}
    </div>
  )
}
