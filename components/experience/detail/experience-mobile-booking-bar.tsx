'use client'

import { useState } from 'react'
import { useTranslation } from '@/lib/context/translation.context'
import { interpolate } from '@/lib/utils/i18n.utils'
import { formatCurrency } from '@/core/utils/currency.utils'
import { Button } from '@/components/ui/button'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer'
import type { Experience } from '@/lib/schemas/entities/experience.entity.schema'
import BookingStepParticipants from './booking-widget/booking-step-participants'
import BookingStepSlots from './booking-widget/booking-step-slots'
import { useBooking } from './booking-widget/use-booking'

type ExperienceMobileBookingBarProps = {
  experience: Experience
}

export default function ExperienceMobileBookingBar({ experience }: ExperienceMobileBookingBarProps) {
  const t = useTranslation()
  const booking = useBooking(experience)
  const [open, setOpen] = useState(false)

  const tiers = experience.priceLists?.[0]?.tiers
  const price = tiers && tiers.length > 0 ? Math.min(...tiers.map(tier => tier.baseAmount)) : 0

  const handleOpen = () => {
    setOpen(true)
  }

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-background px-4 py-3 lg:hidden">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold">
            {interpolate(t.exp_detail_price_per_person, { price: formatCurrency(price) })}
          </p>
          <Button size="default" onClick={handleOpen}>
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
            {booking.step === 1 && (
              <BookingStepParticipants
                isPerAsset={booking.isPerAsset}
                assetLabel={experience.assetLabel}
                maxCapacity={booking.maxCapacity}
                adults={booking.adults}
                children={booking.children}
                infants={booking.infants}
                assetCount={booking.assetCount}
                onAdultsChange={booking.setAdults}
                onChildrenChange={booking.setChildren}
                onInfantsChange={booking.setInfants}
                onAssetCountChange={booking.setAssetCount}
                basePrice={booking.basePrice}
                pricingMode={booking.pricingMode}
                onChooseDate={booking.handleChooseDate}
              />
            )}

            {booking.step === 2 && (
              <BookingStepSlots
                participantSummary={booking.participantSummary}
                loadingSlots={booking.loadingSlots}
                availabilityData={booking.availabilityData}
                selectedDate={booking.selectedDate}
                calendarOpen={booking.calendarOpen}
                daysOfWeek={booking.daysOfWeek}
                pricingMode={booking.pricingMode}
                assetLabel={experience.assetLabel}
                onEditParticipants={booking.handleEditParticipants}
                onDateSelect={booking.handleDateSelect}
                onClearDate={booking.handleClearDate}
                onSlotSelect={booking.handleSlotSelect}
                onCalendarOpenChange={booking.setCalendarOpen}
                disabledCalendarDays={booking.disabledCalendarDays}
              />
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}
