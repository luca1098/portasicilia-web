'use client'

import { useTranslation } from '@/lib/context/translation.context'
import { useTranslationToggle } from '@/lib/context/translation-toggle.context'
import { interpolate } from '@/lib/utils/i18n.utils'
import type { Stay } from '@/lib/schemas/entities/stay.entity.schema'
import TranslationBadge from '@/components/ui/translation-badge'

type StayHouseRulesProps = {
  stay: Stay
}

export default function StayHouseRules({ stay }: StayHouseRulesProps) {
  const t = useTranslation()
  const { showingOriginal, isTranslated } = useTranslationToggle()

  const detail = stay.stayDetail
  const originals = stay._originals ?? {}
  const houseRules =
    showingOriginal && isTranslated && originals['houseRules']
      ? (originals['houseRules'] as string[])
      : (detail?.houseRules ?? stay.houseRules ?? [])
  const checkInTime = detail?.checkInTime ?? stay.checkInTime
  const checkOutTime = detail?.checkOutTime ?? stay.checkOutTime
  const maxPeople = detail?.maxPeople ?? stay.maxPeople

  const rules: string[] = []

  if (checkInTime) {
    rules.push(interpolate(t.stay_detail_check_in_rule, { time: checkInTime }))
  }
  if (checkOutTime) {
    rules.push(interpolate(t.stay_detail_check_out_rule, { time: checkOutTime }))
  }
  if (maxPeople) {
    rules.push(interpolate(t.stay_detail_max_guests_rule, { count: String(maxPeople) }))
  }

  houseRules.forEach(rule => {
    rules.push(rule)
  })

  if (rules.length === 0) return null

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h2 className="text-xl font-bold">{t.stay_detail_house_rules}</h2>
        <TranslationBadge />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {rules.map((rule, index) => (
          <div key={index} className="flex items-start gap-2">
            <span className="mt-1 text-xs text-muted-foreground">•</span>
            <span className="text-sm">{rule}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
