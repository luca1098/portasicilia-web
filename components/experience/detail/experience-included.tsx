'use client'

import { useTranslation } from '@/lib/context/translation.context'
import { CheckIcon, XIcon } from '@/lib/constants/icons'

type ExperienceIncludedProps = {
  included: string[]
  notIncluded: string[]
}

export default function ExperienceIncluded({ included, notIncluded }: ExperienceIncludedProps) {
  const t = useTranslation()

  const includedItems = included.map(item => t[item as keyof typeof t] ?? item)
  const notIncludedItems = notIncluded.map(item => t[item as keyof typeof t] ?? item)

  if (includedItems.length === 0 && notIncludedItems.length === 0) return null

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold">{t.exp_detail_whats_included}</h2>
      <div className="grid grid-cols-1 gap-x-12 gap-y-3 sm:grid-cols-2">
        <div className="flex flex-col gap-3">
          {includedItems.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-green-100">
                <CheckIcon className="size-3 text-green-600" />
              </span>
              <span className="text-sm">{item}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          {notIncludedItems.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-red-100">
                <XIcon className="size-3 text-red-600" />
              </span>
              <span className="text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
