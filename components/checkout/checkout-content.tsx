'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft } from '@/lib/constants/icons'
import { useTranslation } from '@/lib/context/translation.context'
import { useCheckoutActions } from '@/core/store/checkout.store'
import CheckoutSteps from '@/components/checkout/checkout-steps'
import BookingRecap from '@/components/checkout/booking-recap'
import type { Experience } from '@/lib/schemas/entities/experience.entity.schema'
import type { PriceTier } from '@/core/store/checkout.store'

type CheckoutContentProps = {
  experience: Experience
  date: string
  startTime: string
  endTime: string
  adults: number
  children: number
  infants: number
  totalPrice: number | null
  depositAmount: number | null
  priceTiers: PriceTier[]
  listingId: string
  slotId: string
  assetCount: number
  pricingMode: string
  assetTierType: string
  paymentError?: boolean
}

export default function CheckoutContent({
  experience,
  date,
  startTime,
  endTime,
  adults,
  children,
  infants,
  totalPrice,
  depositAmount,
  priceTiers,
  listingId,
  slotId,
  assetCount,
  pricingMode,
  assetTierType,
  paymentError,
}: CheckoutContentProps) {
  const t = useTranslation()
  const { lang } = useParams<{ lang: string }>()
  const { setBookingContext } = useCheckoutActions()

  useEffect(() => {
    setBookingContext({
      experience,
      date,
      startTime,
      endTime,
      adults,
      children,
      infants,
      totalPrice: totalPrice ?? 0,
      depositAmount,
      priceTiers,
      listingId,
      slotId,
      assetCount,
      pricingMode,
      assetTierType,
      paymentError: paymentError ?? false,
    })
  }, [
    experience,
    date,
    startTime,
    endTime,
    adults,
    children,
    infants,
    totalPrice,
    depositAmount,
    priceTiers,
    listingId,
    slotId,
    assetCount,
    pricingMode,
    assetTierType,
    paymentError,
    setBookingContext,
  ])

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Back link + title */}
      <div className="flex items-center gap-3">
        <Link
          href={`/${lang}/experiences/${experience.slug}`}
          className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label={t.checkout_back}
        >
          <ArrowLeft className="size-5" />
        </Link>
        <h1 className="text-xl font-bold">{t.checkout_title}</h1>
      </div>

      {/* Two-column layout */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Left: steps */}
        <div className="order-2 lg:order-1">
          <CheckoutSteps />
        </div>

        {/* Right: recap */}
        <div className="order-1 lg:sticky lg:top-24 lg:order-2 lg:self-start">
          <BookingRecap />
        </div>
      </div>
    </div>
  )
}
