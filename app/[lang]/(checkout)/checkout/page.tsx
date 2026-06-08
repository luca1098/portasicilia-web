import { notFound, redirect } from 'next/navigation'
import { getExperienceById } from '@/lib/api/experiences'
import { getStayById } from '@/lib/api/stays'
import { calculatePrice, type CalculatePriceInput } from '@/lib/api/pricing'
import CheckoutContent from '@/components/checkout/checkout-content'

type CheckoutPageProps = {
  searchParams: Promise<{
    listingId?: string
    slotId?: string
    date?: string
    dateTo?: string
    type?: string
    adults?: string
    children?: string
    infants?: string
    assetCount?: string
    payment_error?: string
  }>
  params: Promise<{ lang: string }>
}

export default async function CheckoutPage({ searchParams, params }: CheckoutPageProps) {
  const [{ lang }, sp] = await Promise.all([params, searchParams])
  const { listingId, slotId, date, dateTo, type, adults, children, infants, assetCount, payment_error } = sp

  const isStay = type === 'stay'

  if (!listingId || !date) {
    redirect(`/${lang}`)
  }

  // For experiences, slotId is required
  if (!isStay && !slotId) {
    redirect(`/${lang}`)
  }

  const adultsNum = Math.max(1, Math.floor(Number(adults) || 1))
  const childrenNum = Math.max(0, Math.floor(Number(children) || 0))
  const infantsNum = Math.max(0, Math.floor(Number(infants) || 0))
  const assetCountNum = Math.max(1, Math.floor(Number(assetCount) || 1))

  const priceTiers: {
    tierType: string
    baseAmount: number
    quantity: number
    subtotal: number
    label?: string
  }[] = []
  let totalPrice: number | null = null

  if (isStay) {
    // ==================== STAY CHECKOUT ====================
    if (!dateTo) redirect(`/${lang}`)

    let stay
    try {
      stay = await getStayById(listingId)
    } catch {
      notFound()
    }

    const tiers = stay.priceLists?.[0]?.tiers ?? []
    const dateFrom = new Date(date)
    const dateToVal = new Date(dateTo)
    const nights = Math.round((dateToVal.getTime() - dateFrom.getTime()) / (1000 * 60 * 60 * 24))

    if (nights < 1) redirect(`/${lang}`)

    let depositAmount: number | null = stay.depositValue ?? null

    try {
      // Resolve the price through the engine so per-night overrides (recurring
      // weekend rates, etc.) are reflected, instead of multiplying the base
      // nightly rate by the number of nights.
      const breakdown = await calculatePrice({ listingId, date, numberOfNights: nights })

      totalPrice = Number(breakdown.total)
      // Actual deposit charged is the commission on the full stay total (mirrors
      // booking.service.ts), so it reflects the per-night/weekend pricing.
      depositAmount = Number(breakdown.commissionAmount)

      for (const li of breakdown.lineItems) {
        priceTiers.push({
          tierType: li.tierType,
          baseAmount: Number(li.effectiveUnitPrice),
          quantity: li.quantity,
          subtotal: Number(li.subtotal),
          ...(li.label ? { label: li.label } : {}),
        })
      }
    } catch {
      // Fallback: backend pricing unavailable — degrade to base nightly rate ×
      // nights so the page still renders (this does not reflect overrides).
      const nightlyTier = tiers.find(t => t.tierType === 'NIGHTLY')
      if (nightlyTier) {
        const subtotal = nightlyTier.baseAmount * nights
        priceTiers.push({
          tierType: 'NIGHTLY',
          baseAmount: nightlyTier.baseAmount,
          quantity: nights,
          subtotal,
        })
        totalPrice = subtotal
      }
      for (const tier of tiers) {
        if (tier.tierType === 'NIGHTLY') continue
        const quantity = tier.tierType === 'CLEANING_FEE' ? 1 : nights
        const subtotal = tier.baseAmount * quantity
        priceTiers.push({
          tierType: tier.tierType,
          baseAmount: tier.baseAmount,
          quantity,
          subtotal,
          label: tier.label ?? tier.tierType.toLowerCase(),
        })
        totalPrice = (totalPrice ?? 0) + subtotal
      }
    }

    return (
      <CheckoutContent
        listingType="STAY"
        stay={stay}
        experience={null as never}
        date={date}
        dateTo={dateTo}
        nights={nights}
        startTime=""
        endTime=""
        adults={adultsNum}
        children={childrenNum}
        infants={infantsNum}
        totalPrice={totalPrice}
        depositAmount={depositAmount}
        priceTiers={priceTiers}
        listingId={listingId}
        slotId=""
        assetCount={assetCountNum}
        pricingMode="PER_NIGHT"
        assetTierType="DEFAULT"
        paymentError={payment_error === '1'}
      />
    )
  }

  // ==================== EXPERIENCE CHECKOUT ====================
  let experience
  try {
    experience = await getExperienceById(listingId)
  } catch {
    notFound()
  }

  const pricingMode = experience.pricingMode ?? experience.priceLists?.[0]?.pricingMode ?? 'PER_PERSON'

  const selectedSlot = experience.timeSlots?.find(s => s.id === slotId)
  const startTime = selectedSlot?.startTime ?? ''
  const endTime = selectedSlot?.endTime ?? ''

  const tiers = experience.priceLists?.[0]?.tiers ?? []
  const assetTierType = tiers[0]?.tierType ?? 'DEFAULT'

  let depositAmount: number | null = experience.depositValue ?? null

  if (tiers.length > 0) {
    const totalPax = adultsNum + childrenNum + infantsNum

    const calcInput: CalculatePriceInput = {
      listingId,
      date,
      // Mirror booking.service.ts: passes timeSlotId so display matches actual charge
      ...(slotId && { timeSlot: slotId }),
    }

    if (pricingMode === 'PER_PERSON') {
      const participants: { type: string; quantity: number }[] = []
      if (adultsNum > 0) participants.push({ type: 'ADULT', quantity: adultsNum })
      if (childrenNum > 0) participants.push({ type: 'CHILD', quantity: childrenNum })
      if (infantsNum > 0) participants.push({ type: 'INFANT', quantity: infantsNum })
      calcInput.participants = participants
    } else if (pricingMode === 'PER_EXPERIENCE') {
      calcInput.totalParticipants = totalPax > 0 ? totalPax : 1
    } else if (pricingMode === 'PER_ASSET') {
      calcInput.assets = [{ type: assetTierType, quantity: assetCountNum }]
    }

    try {
      const breakdown = await calculatePrice(calcInput)

      totalPrice = Number(breakdown.total)
      // Mirror booking.service.ts:379 — actual deposit charged is the
      // commission on the full booking total, not the per-unit estimate
      // exposed via experience.depositValue.
      depositAmount = Number(breakdown.commissionAmount)

      for (const li of breakdown.lineItems) {
        const displayTierType =
          pricingMode === 'PER_EXPERIENCE'
            ? 'PER_EXPERIENCE'
            : pricingMode === 'PER_ASSET'
              ? 'PER_ASSET'
              : li.tierType
        priceTiers.push({
          tierType: displayTierType,
          baseAmount: Number(li.effectiveUnitPrice),
          quantity: li.quantity,
          subtotal: Number(li.subtotal),
          ...(li.label ? { label: li.label } : {}),
        })
      }
    } catch {
      // Pricing calculation failed: leave totalPrice null and priceTiers empty so
      // CheckoutContent can degrade gracefully (it already handles null totals).
    }
  }

  return (
    <CheckoutContent
      listingType="EXPERIENCE"
      experience={experience}
      date={date}
      startTime={startTime}
      endTime={endTime}
      adults={adultsNum}
      children={childrenNum}
      infants={infantsNum}
      totalPrice={totalPrice}
      depositAmount={depositAmount}
      priceTiers={priceTiers}
      listingId={listingId}
      slotId={slotId ?? ''}
      assetCount={assetCountNum}
      pricingMode={pricingMode}
      assetTierType={assetTierType}
      paymentError={payment_error === '1'}
    />
  )
}
