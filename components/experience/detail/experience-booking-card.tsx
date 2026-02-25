'use client'

import type { Experience } from '@/lib/schemas/entities/experience.entity.schema'
import BookingCardHeader from './booking-widget/booking-card-header'
import BookingStepParticipants from './booking-widget/booking-step-participants'
import BookingStepSlots from './booking-widget/booking-step-slots'
import { useBooking } from './booking-widget/use-booking'

type ExperienceBookingCardProps = {
  experience: Experience
}

export default function ExperienceBookingCard({ experience }: ExperienceBookingCardProps) {
  const booking = useBooking(experience)

  return (
    <div className="rounded-2xl border bg-background p-6 shadow-lg">
      <BookingCardHeader
        name={experience.name}
        cover={experience.cover}
        imageUrl={experience.images?.[0]?.url}
        avgRating={booking.avgRating}
      />

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
          minPrice={booking.minPrice}
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
  )
}
