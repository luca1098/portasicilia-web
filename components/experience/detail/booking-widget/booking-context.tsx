'use client'

import { createContext, use } from 'react'
import { useBooking } from './use-booking'
import type { Experience } from '@/lib/schemas/entities/experience.entity.schema'

type BookingContextValue = ReturnType<typeof useBooking> & {
  experience: Experience
}

const BookingContext = createContext<BookingContextValue | null>(null)

export function useBookingContext() {
  const ctx = use(BookingContext)
  if (!ctx) throw new Error('Booking components must be used within BookingProvider')
  return ctx
}

export function BookingProvider({
  experience,
  children,
}: {
  experience: Experience
  children: React.ReactNode
}) {
  const booking = useBooking(experience)
  return <BookingContext value={{ ...booking, experience }}>{children}</BookingContext>
}
