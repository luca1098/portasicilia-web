'use client'

import { useMemo, useState } from 'react'
import { StarIcon, CheckIcon, CalendarIcon } from '@/lib/constants/icons'
import { useTranslation } from '@/lib/context/translation.context'
import { interpolate } from '@/lib/utils/i18n.utils'
import { formatCurrency } from '@/core/utils/currency.utils'
import Image from 'next/image'
import { cn } from '@/lib/utils/shadcn.utils'
import type { Experience } from '@/lib/schemas/entities/experience.entity.schema'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import ParticipantCounter from '@/components/experience/detail/participant-counter'
import BookingTimeSlotCard from '@/components/experience/detail/booking-time-slot-card'

type ExperienceBookingCardProps = {
  experience: Experience
}

const DAY_MAP: Record<string, number> = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function formatMonthYear(date: Date): string {
  return capitalizeFirst(date.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' }))
}

function formatDayHeader(date: Date): string {
  return capitalizeFirst(date.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' }))
}

function getAvailableDates(daysOfWeek: string[], count: number): Date[] {
  const allowedDays = new Set(daysOfWeek.map(d => DAY_MAP[d]))
  const dates: Date[] = []
  const cursor = new Date()
  cursor.setHours(0, 0, 0, 0)
  cursor.setDate(cursor.getDate() + 1)

  let safety = 0
  while (dates.length < count && safety < 365) {
    if (allowedDays.has(cursor.getDay())) {
      dates.push(new Date(cursor))
    }
    cursor.setDate(cursor.getDate() + 1)
    safety++
  }
  return dates
}

export default function ExperienceBookingCard({ experience }: ExperienceBookingCardProps) {
  const t = useTranslation()

  // --- State ---
  const [step, setStep] = useState<1 | 2>(1)
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)
  const [infants, setInfants] = useState(0)
  const [assetCount, setAssetCount] = useState(1)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set())

  // --- Derived ---
  const isPerAsset = experience.capacityMode === 'PER_ASSET'
  const maxCapacity = experience.maxCapacity || 10
  const timeSlots = experience.timeSlots ?? []
  const daysOfWeek = useMemo(() => experience.daysOfWeek ?? [], [experience.daysOfWeek])
  const pricingMode = experience.pricingMode ?? experience.priceLists?.[0]?.pricingMode ?? 'PER_PERSON'
  const totalParticipants = isPerAsset ? assetCount : adults + children + infants
  const availableSpots = Math.max(0, maxCapacity - totalParticipants)

  const minPrice = useMemo(() => {
    const tiers = experience.priceLists?.[0]?.tiers
    if (!tiers || tiers.length === 0) return 0
    return Math.min(...tiers.map(tier => tier.baseAmount))
  }, [experience.priceLists])

  const avgRating = useMemo(() => {
    if (!experience.reviews || experience.reviews.length === 0) return 0
    return experience.reviews.reduce((sum, r) => sum + r.rating, 0) / experience.reviews.length
  }, [experience.reviews])

  const allowedDayNumbers = useMemo(
    () => (daysOfWeek.length > 0 ? new Set(daysOfWeek.map(d => DAY_MAP[d])) : null),
    [daysOfWeek]
  )

  const upcomingDates = useMemo(
    () => (daysOfWeek.length > 0 ? getAvailableDates(daysOfWeek, 14) : []),
    [daysOfWeek]
  )

  const activeDates = useMemo(() => {
    if (selectedDate) return [selectedDate]
    return upcomingDates.slice(0, 5)
  }, [selectedDate, upcomingDates])

  const datesByMonth = useMemo(() => {
    const grouped = new Map<string, Date[]>()
    for (const date of activeDates) {
      const key = `${date.getFullYear()}-${date.getMonth()}`
      const existing = grouped.get(key) ?? []
      existing.push(date)
      grouped.set(key, existing)
    }
    return grouped
  }, [activeDates])

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

  // --- Handlers ---
  const handleChooseDate = () => {
    setStep(2)
    setSelectedDate(undefined)
    setExpandedDays(new Set())
  }

  const handleEditParticipants = () => {
    setStep(1)
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date)
      setCalendarOpen(false)
      setExpandedDays(new Set())
    }
  }

  const handleClearDate = () => {
    setSelectedDate(undefined)
    setExpandedDays(new Set())
  }

  const handleToggleExpandDay = (dayKey: string) => {
    setExpandedDays(prev => {
      const next = new Set(prev)
      if (next.has(dayKey)) next.delete(dayKey)
      else next.add(dayKey)
      return next
    })
  }

  const handleSlotSelect = (_slotId: string) => {
    // Placeholder for checkout navigation
  }

  const disabledCalendarDays = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (date <= today) return true
    if (!allowedDayNumbers) return false
    return !allowedDayNumbers.has(date.getDay())
  }

  // --- Shared header ---
  const cardHeader = (
    <>
      <div className="mb-4 flex items-start gap-3">
        {experience.cover || experience.images?.[0]?.url ? (
          <Image
            src={experience.cover ?? experience.images?.[0]?.url ?? ''}
            alt={experience.name}
            width={40}
            height={40}
            className="size-10 shrink-0 rounded-lg object-cover"
          />
        ) : (
          <div className="size-10 shrink-0 rounded-lg bg-muted" />
        )}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-snug">{experience.name}</p>
        </div>
        {avgRating > 0 && (
          <div className="flex shrink-0 items-center gap-1">
            <StarIcon className="size-3.5 fill-foreground stroke-foreground" />
            <span className="text-xs font-semibold">{avgRating.toFixed(1)}</span>
          </div>
        )}
      </div>
      <hr className="mb-4 border-border" />
    </>
  )

  // --- Render ---
  return (
    <div className="rounded-2xl border bg-background p-6 shadow-lg">
      {cardHeader}

      {/* ===== STEP 1: Participant Selection ===== */}
      {step === 1 && (
        <>
          <h3 className="mb-1 text-base font-semibold">{t.exp_detail_participants}</h3>

          {isPerAsset ? (
            <div className="divide-y divide-border">
              <ParticipantCounter
                label={experience.assetLabel ?? 'Asset'}
                ageRange=""
                count={assetCount}
                min={1}
                max={maxCapacity}
                onChange={setAssetCount}
              />
            </div>
          ) : (
            <div className="divide-y divide-border">
              <ParticipantCounter
                label={t.exp_detail_adults}
                ageRange={t.exp_detail_adults_age}
                count={adults}
                min={1}
                max={Math.max(1, maxCapacity - children - infants)}
                onChange={setAdults}
              />
              <ParticipantCounter
                label={t.exp_detail_children}
                ageRange={t.exp_detail_children_age}
                count={children}
                max={Math.max(0, maxCapacity - adults - infants)}
                onChange={setChildren}
              />
              <ParticipantCounter
                label={t.exp_detail_infants}
                ageRange={t.exp_detail_infants_age}
                count={infants}
                max={Math.max(0, maxCapacity - adults - children)}
                onChange={setInfants}
              />
            </div>
          )}

          {/* Price + cancellation */}
          {minPrice > 0 && (
            <div className="mt-5">
              <p className="text-lg font-bold">
                {pricingMode === 'PER_ASSET'
                  ? interpolate(t.exp_booking_per_asset, {
                      price: formatCurrency(minPrice, undefined, {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }),
                      asset: experience.assetLabel ?? '',
                    })
                  : pricingMode === 'PER_EXPERIENCE'
                    ? interpolate(t.exp_booking_per_experience, {
                        price: formatCurrency(minPrice, undefined, {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }),
                      })
                    : interpolate(t.exp_detail_price_per_person, {
                        price: formatCurrency(minPrice, undefined, {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }),
                      })}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-teal-600">
                <CheckIcon className="size-3.5" />
                {t.exp_detail_free_cancellation}
              </p>
            </div>
          )}

          {/* CTA */}
          <Button className="mt-5 h-12 w-full text-base font-semibold" size="lg" onClick={handleChooseDate}>
            {t.exp_detail_choose_date}
          </Button>
        </>
      )}

      {/* ===== STEP 2: Time Slot Selection ===== */}
      {step === 2 && (
        <>
          {/* Participant summary row */}
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">{t.exp_detail_participants}</p>
              <p className="text-sm font-medium">{participantSummary}</p>
            </div>
            <Button variant="outline" size="xs" className="rounded-full" onClick={handleEditParticipants}>
              {t.admin_common_edit}
            </Button>
          </div>

          <hr className="mb-5 border-border" />

          {/* Slots grouped by month, then day */}
          {Array.from(datesByMonth.entries()).map(([monthKey, dates]) => (
            <div key={monthKey} className="mb-4">
              <h3 className="text-base font-bold">{formatMonthYear(dates[0])}</h3>
              <p className="mb-4 text-xs text-muted-foreground">{t.exp_booking_timezone}</p>

              {dates.map(date => {
                const dayKey = date.toISOString().split('T')[0]
                const isExpanded = expandedDays.has(dayKey)
                const visibleSlots = isExpanded ? timeSlots : timeSlots.slice(0, 3)
                const hasMore = timeSlots.length > 3 && !isExpanded

                return (
                  <div key={dayKey} className="mb-5">
                    <h4 className="mb-2.5 text-sm font-semibold">{formatDayHeader(date)}</h4>
                    <div className="space-y-2">
                      {visibleSlots.map(slot => (
                        <BookingTimeSlotCard
                          key={slot.id}
                          slot={slot}
                          price={minPrice}
                          pricingMode={pricingMode}
                          assetLabel={experience.assetLabel}
                          availableSpots={availableSpots}
                          onSelect={handleSlotSelect}
                        />
                      ))}
                    </div>
                    {hasMore && (
                      <button
                        type="button"
                        onClick={() => handleToggleExpandDay(dayKey)}
                        className={cn(
                          'mt-2 text-xs font-medium text-muted-foreground',
                          'underline underline-offset-2 hover:text-foreground'
                        )}
                      >
                        {t.exp_booking_show_all_slots}
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          ))}

          {/* Clear selected date */}
          {selectedDate && (
            <button
              type="button"
              onClick={handleClearDate}
              className={cn(
                'mb-4 w-full text-center text-xs font-medium text-muted-foreground',
                'underline underline-offset-2 hover:text-foreground'
              )}
            >
              {t.exp_booking_show_all_slots}
            </button>
          )}

          {/* Date picker button */}
          {daysOfWeek.length > 0 && (
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-12 w-full rounded-xl text-sm font-semibold">
                  <CalendarIcon className="size-4" />
                  {t.exp_booking_select_date}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={disabledCalendarDays}
                />
              </PopoverContent>
            </Popover>
          )}
        </>
      )}
    </div>
  )
}
