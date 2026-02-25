import { notFound, redirect } from 'next/navigation'
import { getExperienceById } from '@/lib/api/experiences'
import CheckoutContent from '@/components/checkout/checkout-content'

type CheckoutPageProps = {
  searchParams: Promise<{
    experienceId?: string
    slotId?: string
    date?: string
    adults?: string
    children?: string
    infants?: string
    assetCount?: string
  }>
  params: Promise<{ lang: string }>
}

export default async function CheckoutPage({ searchParams, params }: CheckoutPageProps) {
  const [{ lang }, { experienceId, slotId, date, adults, children, infants, assetCount }] = await Promise.all(
    [params, searchParams]
  )

  if (!experienceId || !slotId || !date) {
    redirect(`/${lang}`)
  }

  let experience
  try {
    experience = await getExperienceById(experienceId)
  } catch {
    notFound()
  }

  const adultsNum = Math.max(1, Math.floor(Number(adults) || 1))
  const childrenNum = Math.max(0, Math.floor(Number(children) || 0))
  const infantsNum = Math.max(0, Math.floor(Number(infants) || 0))
  const assetCountNum = Math.max(1, Math.floor(Number(assetCount) || 1))

  const pricingMode = experience.pricingMode ?? experience.priceLists?.[0]?.pricingMode ?? 'PER_PERSON'

  // Find the selected time slot to get start/end times
  const selectedSlot = experience.timeSlots?.find(s => s.id === slotId)
  const startTime = selectedSlot?.startTime ?? ''
  const endTime = selectedSlot?.endTime ?? ''

  // Calculate price tiers breakdown and total price from the first price list tiers
  const tiers = experience.priceLists?.[0]?.tiers ?? []
  let totalPrice: number | null = null
  const priceTiers: { tierType: string; baseAmount: number; quantity: number; subtotal: number }[] = []

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

  // Use the computed deposit value from the API (commission-based)
  const depositAmount = experience.depositValue ?? null

  return (
    <CheckoutContent
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
    />
  )
}
