import { useCallback, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import { useTranslation } from '@/lib/context/translation.context'
import { interpolate } from '@/lib/utils/i18n.utils'
import { useAction } from '@/lib/hooks/use-action'
import { getAvailabilityAction } from '@/lib/actions/experiences.actions'
import type { AvailableDateSlots } from '@/lib/api/experiences'
import type { Experience } from '@/lib/schemas/entities/experience.entity.schema'
import type { PricingMode } from '@/lib/schemas/entities/pricing.entity.schema'
import { DAY_MAP } from './booking.utils'

export function useBooking(experience: Experience) {
  const t = useTranslation()
  const router = useRouter()
  const { lang } = useParams<{ lang: string }>()

  // --- State ---
  const [step, setStep] = useState<1 | 2>(1)
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)
  const [infants, setInfants] = useState(0)
  const [assetCount, setAssetCount] = useState(1)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [availabilityData, setAvailabilityData] = useState<AvailableDateSlots[] | null>(null)

  // --- Derived ---
  const isPerAsset = experience.capacityMode === 'PER_ASSET'
  const maxCapacity = experience.maxCapacity || 10
  const daysOfWeek = useMemo(() => experience.daysOfWeek ?? [], [experience.daysOfWeek])
  const pricingMode: PricingMode =
    experience.pricingMode ?? experience.priceLists?.[0]?.pricingMode ?? 'PER_PERSON'
  const totalParticipants = isPerAsset ? assetCount : adults + children + infants

  const basePrice = useMemo(() => {
    const tiers = experience.priceLists?.[0]?.tiers
    if (!tiers || tiers.length === 0) return 0
    if (pricingMode === 'PER_PERSON') {
      const adultTier = tiers.find(tier => tier.tierType === 'ADULT')
      return adultTier?.baseAmount ?? 0
    }
    return Math.min(...tiers.map(tier => tier.baseAmount))
  }, [experience.priceLists, pricingMode])

  const avgRating = useMemo(() => {
    if (!experience.reviews || experience.reviews.length === 0) return 0
    return experience.reviews.reduce((sum, r) => sum + r.rating, 0) / experience.reviews.length
  }, [experience.reviews])

  const allowedDayNumbers = useMemo(
    () => (daysOfWeek.length > 0 ? new Set(daysOfWeek.map(d => DAY_MAP[d])) : null),
    [daysOfWeek]
  )

  const participantSummary = useMemo(() => {
    if (isPerAsset) {
      return interpolate(t.exp_booking_participants_summary_assets, {
        count: String(assetCount),
        asset: experience.assetLabel ?? '',
      })
    }
    const parts: string[] = []
    if (adults > 0) {
      parts.push(
        interpolate(
          adults === 1 ? t.exp_booking_participants_summary_adult : t.exp_booking_participants_summary_adults,
          { count: String(adults) }
        )
      )
    }
    if (children > 0) {
      parts.push(
        interpolate(
          children === 1
            ? t.exp_booking_participants_summary_child
            : t.exp_booking_participants_summary_children,
          { count: String(children) }
        )
      )
    }
    if (infants > 0) {
      parts.push(
        interpolate(
          infants === 1
            ? t.exp_booking_participants_summary_infant
            : t.exp_booking_participants_summary_infants,
          { count: String(infants) }
        )
      )
    }
    return parts.join(', ')
  }, [isPerAsset, adults, children, infants, assetCount, experience.assetLabel, t])

  // --- Availability fetching ---
  const { loading: loadingSlots, execute: executeAvailability } = useAction<AvailableDateSlots[]>({
    onSuccess: data => setAvailabilityData(data ?? []),
    onError: () => setAvailabilityData([]),
  })

  const fetchAvailability = useCallback(
    (date?: string) => {
      setAvailabilityData(null)
      executeAvailability(() =>
        getAvailabilityAction(experience.id, {
          totalPax: totalParticipants,
          ...(date && { date }),
        })
      )
    },
    [executeAvailability, experience.id, totalParticipants]
  )

  // --- Handlers ---
  const handleChooseDate = useCallback(() => {
    setStep(2)
    setSelectedDate(undefined)
    fetchAvailability()
  }, [fetchAvailability])

  const handleEditParticipants = useCallback(() => {
    setStep(1)
    setAvailabilityData(null)
    setSelectedDate(undefined)
  }, [])

  const handleDateSelect = useCallback(
    (date: Date | undefined) => {
      if (date) {
        setSelectedDate(date)
        setCalendarOpen(false)
        const dateStr = date.toISOString().split('T')[0]
        fetchAvailability(dateStr)
      }
    },
    [fetchAvailability]
  )

  const handleClearDate = useCallback(() => {
    setSelectedDate(undefined)
    fetchAvailability()
  }, [fetchAvailability])

  const handleSlotSelect = useCallback(
    (slotId: string, date: string) => {
      const params = new URLSearchParams({
        experienceId: experience.id,
        slotId,
        date,
        adults: String(adults),
        children: String(children),
        infants: String(infants),
        assetCount: String(isPerAsset ? assetCount : 0),
      })
      router.push(`/${lang}/checkout?${params.toString()}`)
    },
    [experience.id, adults, children, infants, isPerAsset, assetCount, lang, router]
  )

  const disabledCalendarDays = useCallback(
    (date: Date) => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (date <= today) return true
      if (!allowedDayNumbers) return false
      return !allowedDayNumbers.has(date.getDay())
    },
    [allowedDayNumbers]
  )

  return {
    // State
    step,
    adults,
    setAdults,
    children,
    setChildren,
    infants,
    setInfants,
    assetCount,
    setAssetCount,
    selectedDate,
    calendarOpen,
    setCalendarOpen,
    availabilityData,
    loadingSlots,

    // Derived
    isPerAsset,
    maxCapacity,
    daysOfWeek,
    pricingMode,
    basePrice,
    avgRating,
    participantSummary,

    // Handlers
    handleChooseDate,
    handleEditParticipants,
    handleDateSelect,
    handleClearDate,
    handleSlotSelect,
    disabledCalendarDays,
  }
}
