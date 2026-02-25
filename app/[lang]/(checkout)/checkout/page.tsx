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
  const { lang } = await params
  const { experienceId, slotId, date, adults, children, infants } = await searchParams

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

  // Find the selected time slot to get start/end times
  const selectedSlot = experience.timeSlots?.find(s => s.id === slotId)
  const startTime = selectedSlot?.startTime ?? ''
  const endTime = selectedSlot?.endTime ?? ''

  // Calculate a rough total price from the first price list tiers
  const tiers = experience.priceLists?.[0]?.tiers ?? []
  let totalPrice: number | null = null

  if (tiers.length > 0) {
    const adultTier = tiers.find(t => t.tierType === 'ADULT')
    const childTier = tiers.find(t => t.tierType === 'CHILD')

    if (adultTier) {
      totalPrice = adultTier.baseAmount * adultsNum
      if (childTier && childrenNum > 0) {
        totalPrice += childTier.baseAmount * childrenNum
      }
    } else {
      // Flat or per-experience pricing: use first tier
      totalPrice = tiers[0].baseAmount
    }
  }

  // Deposit is 30% of total
  const depositAmount = totalPrice !== null ? Math.round(totalPrice * 0.3 * 100) / 100 : null

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
    />
  )
}
