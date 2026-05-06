'use client'

import type { Experience } from '@/lib/schemas/entities/experience.entity.schema'
import { BookingProvider, useBookingContext } from './booking-widget/booking-context'
import BookingCardHeader from './booking-widget/booking-card-header'
import BookingStepParticipants from './booking-widget/booking-step-participants'
import BookingStepSlots from './booking-widget/booking-step-slots'

type ExperienceBookingCardProps = {
  experience: Experience
}

function BookingCardContent({ experience }: { experience: Experience }) {
  const { step, avgRating } = useBookingContext()

  return (
    <div className="rounded-xl border bg-background shadow-sm">
      <BookingCardHeader
        name={experience.name}
        cover={experience.cover}
        imageUrl={experience.images?.[0]?.url}
        avgRating={avgRating}
      />
      {step === 1 && <BookingStepParticipants />}
      {step === 2 && <BookingStepSlots />}
    </div>
  )
}

export default function ExperienceBookingCard({ experience }: ExperienceBookingCardProps) {
  return (
    <BookingProvider experience={experience}>
      <BookingCardContent experience={experience} />
    </BookingProvider>
  )
}
