'use client'

import { useState } from 'react'
import { useTranslation } from '@/lib/context/translation.context'
import { interpolate } from '@/lib/utils/i18n.utils'
import { formatCurrency } from '@/core/utils/currency.utils'
import { Button } from '@/components/ui/button'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer'
import type { Experience } from '@/lib/schemas/entities/experience.entity.schema'
import { BookingProvider, useBookingContext } from './booking-widget/booking-context'
import BookingStepParticipants from './booking-widget/booking-step-participants'
import BookingStepSlots from './booking-widget/booking-step-slots'

type ExperienceMobileBookingBarProps = {
  experience: Experience
}

function MobileBookingBarContent({ experience }: { experience: Experience }) {
  const t = useTranslation()
  const { step } = useBookingContext()
  const [open, setOpen] = useState(false)

  const tiers = experience.priceLists?.[0]?.tiers
  const price = tiers && tiers.length > 0 ? Math.min(...tiers.map(tier => tier.baseAmount)) : 0
  const formattedPrice = formatCurrency(price)
  const resolvedAssetLabel = experience.assetLabel || t.exp_booking_default_asset_label
  const priceLabel =
    experience.pricingMode === 'PER_ASSET'
      ? interpolate(t.exp_detail_price_per_asset, { price: formattedPrice, asset: resolvedAssetLabel })
      : experience.pricingMode === 'PER_EXPERIENCE'
        ? interpolate(t.exp_detail_price_per_experience, { price: formattedPrice })
        : interpolate(t.exp_detail_price_per_person, { price: formattedPrice })

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-background px-4 py-3 lg:hidden">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold">{priceLabel}</p>
          <Button size="default" onClick={() => setOpen(true)}>
            {t.exp_mobile_bar_cta}
          </Button>
        </div>
      </div>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="sr-only">
            <DrawerTitle>{experience.name}</DrawerTitle>
            <DrawerDescription>{t.exp_detail_choose_date}</DrawerDescription>
          </DrawerHeader>

          <div className="overflow-y-auto">
            {step === 1 && <BookingStepParticipants />}
            {step === 2 && <BookingStepSlots />}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default function ExperienceMobileBookingBar({ experience }: ExperienceMobileBookingBarProps) {
  return (
    <BookingProvider experience={experience}>
      <MobileBookingBarContent experience={experience} />
    </BookingProvider>
  )
}
