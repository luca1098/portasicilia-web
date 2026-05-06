'use client'

import { TagIcon, CalendarCheck2Icon, ShieldCheckIcon } from '@/lib/constants/icons'
import { categoryIconMap } from '@/lib/constants/category-icons'
import { useTranslation } from '@/lib/context/translation.context'
import { interpolate } from '@/lib/utils/i18n.utils'
import type { Stay } from '@/lib/schemas/entities/stay.entity.schema'

type StayHighlightsProps = {
  stay: Stay
}

export default function StayHighlights({ stay }: StayHighlightsProps) {
  const t = useTranslation()

  const firstCategory = stay.categories?.[0]?.category
  const categoryName = firstCategory?.name
  const categoryIcon =
    firstCategory?.icon && categoryIconMap[firstCategory.icon] ? categoryIconMap[firstCategory.icon] : TagIcon

  const highlights = [
    ...(categoryName
      ? [
          {
            icon: categoryIcon,
            title: interpolate(t.stay_detail_highlight_category, { category: categoryName }),
            description: t.stay_detail_highlight_category_desc,
          },
        ]
      : []),
    ...(stay.cancellationTerms.length > 0
      ? [
          {
            icon: CalendarCheck2Icon,
            title: t.stay_detail_highlight_cancellation,
            description: stay.cancellationTerms.join('. '),
          },
        ]
      : []),
    {
      icon: ShieldCheckIcon,
      title: t.stay_detail_lock_with_deposit,
      description: t.stay_detail_lock_with_deposit_desc,
    },
  ]

  return (
    <div className="space-y-5">
      {highlights.map((item, index) => (
        <div key={index} className="flex gap-4">
          <item.icon className="mt-0.5 size-6 shrink-0 text-muted-foreground" />
          <div>
            <p className="text-sm font-semibold">{item.title}</p>
            <p className="text-xs text-muted-foreground">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
