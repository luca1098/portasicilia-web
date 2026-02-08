'use client'

import { useTranslation } from '@/lib/context/translation.context'
import { interpolate } from '@/lib/utils/i18n.utils'
import { formatCurrency } from '@/core/utils/currency.utils'
import { Button } from '@/components/ui/button'

type ExperienceMobileBookingBarProps = {
  price: number
}

export default function ExperienceMobileBookingBar({ price }: ExperienceMobileBookingBarProps) {
  const t = useTranslation()

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-background px-4 py-3 lg:hidden">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold">
          {interpolate(t.exp_detail_price_per_person, { price: formatCurrency(price) })}
        </p>
        <Button className="bg-teal-600 hover:bg-teal-700" size="default">
          {t.exp_detail_choose_date}
        </Button>
      </div>
    </div>
  )
}
