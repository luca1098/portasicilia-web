'use client'

import { useState } from 'react'
import { useTranslation } from '@/lib/context/translation.context'
import { interpolate } from '@/lib/utils/i18n.utils'
import { formatCurrency } from '@/core/utils/currency.utils'
import { Button } from '@/components/ui/button'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import type { Stay } from '@/lib/schemas/entities/stay.entity.schema'

type StayMobileBookingBarProps = {
  stay: Stay
}

export default function StayMobileBookingBar({ stay }: StayMobileBookingBarProps) {
  const t = useTranslation()
  const [open, setOpen] = useState(false)

  const tiers = stay.priceLists?.[0]?.tiers
  const nightlyPrice = tiers && tiers.length > 0 ? Math.min(...tiers.map(tier => tier.baseAmount)) : 0

  const handleOpen = () => {
    setOpen(true)
  }

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-background px-4 py-3 lg:hidden">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold">
            {interpolate(t.stay_detail_price_per_night, { price: formatCurrency(nightlyPrice) })}
          </p>
          <Button size="default" onClick={handleOpen}>
            {t.stay_detail_book}
          </Button>
        </div>
      </div>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="sr-only">
            <DrawerTitle>{stay.name}</DrawerTitle>
            <DrawerDescription>{t.stay_detail_book}</DrawerDescription>
          </DrawerHeader>

          <div className="overflow-y-auto p-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">{t.stay_detail_check_in}</label>
                  <Input type="date" className="h-10 text-sm" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">
                    {t.stay_detail_check_out}
                  </label>
                  <Input type="date" className="h-10 text-sm" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">{t.stay_detail_guests}</label>
                <Input
                  type="number"
                  min={1}
                  max={stay.stayDetail?.maxPeople ?? stay.maxPeople ?? 10}
                  defaultValue={1}
                  className="h-10 text-sm"
                />
              </div>
              <Button className="w-full" size="lg" onClick={() => setOpen(false)}>
                {t.stay_detail_book}
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}
