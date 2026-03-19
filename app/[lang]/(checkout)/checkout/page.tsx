import { notFound, redirect } from 'next/navigation'
import { getExperienceById } from '@/lib/api/experiences'
import { getStayById } from '@/lib/api/stays'
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

    // Build nightly price tier
    const nightlyTier = tiers.find(t => t.tierType === 'NIGHTLY')
    if (nightlyTier) {
      const subtotal = nightlyTier.baseAmount * nights
      priceTiers.push({ tierType: 'NIGHTLY', baseAmount: nightlyTier.baseAmount, quantity: nights, subtotal })
      totalPrice = subtotal
    }

    // Build extra tiers (e.g., breakfast, cleaning fee)
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

    const depositAmount = stay.depositValue ?? null

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

  if (tiers.length > 0) {
    if (pricingMode === 'PER_PERSON') {
      const adultTier = tiers.find(t => t.tierType === 'ADULT')
      const childTier = tiers.find(t => t.tierType === 'CHILD')
      const infantTier = tiers.find(t => t.tierType === 'INFANT')

      if (adultTier) {
        totalPrice = 0

        if (adultsNum > 0) {
          const subtotal = adultTier.baseAmount * adultsNum
          priceTiers.push({
            tierType: 'ADULT',
            baseAmount: adultTier.baseAmount,
            quantity: adultsNum,
            subtotal,
          })
          totalPrice += subtotal
        }

        if (childTier && childrenNum > 0) {
          const subtotal = childTier.baseAmount * childrenNum
          priceTiers.push({
            tierType: 'CHILD',
            baseAmount: childTier.baseAmount,
            quantity: childrenNum,
            subtotal,
          })
          totalPrice += subtotal
        }

        if (infantTier && infantsNum > 0) {
          const subtotal = infantTier.baseAmount * infantsNum
          priceTiers.push({
            tierType: 'INFANT',
            baseAmount: infantTier.baseAmount,
            quantity: infantsNum,
            subtotal,
          })
          totalPrice += subtotal
        }
      }
    } else if (pricingMode === 'PER_EXPERIENCE') {
      totalPrice = tiers[0].baseAmount
      priceTiers.push({
        tierType: 'PER_EXPERIENCE',
        baseAmount: tiers[0].baseAmount,
        quantity: 1,
        subtotal: tiers[0].baseAmount,
      })
    } else if (pricingMode === 'PER_ASSET') {
      const subtotal = tiers[0].baseAmount * assetCountNum
      totalPrice = subtotal
      priceTiers.push({
        tierType: 'PER_ASSET',
        baseAmount: tiers[0].baseAmount,
        quantity: assetCountNum,
        subtotal,
      })
    }
  }

  const depositAmount = experience.depositValue ?? null

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
      assetTierType={tiers[0]?.tierType ?? 'DEFAULT'}
      paymentError={payment_error === '1'}
    />
  )
}
