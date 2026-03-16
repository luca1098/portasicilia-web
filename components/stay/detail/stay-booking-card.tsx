'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { StarIcon, XIcon } from '@/lib/constants/icons'
import { useTranslation } from '@/lib/context/translation.context'
import { interpolate } from '@/lib/utils/i18n.utils'
import { formatCurrency } from '@/core/utils/currency.utils'
import useLocaleStore from '@/core/store/locale.store'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/lib/api/fetch-client'
import { it, enUS } from 'date-fns/locale'
import { addDays, differenceInCalendarDays, format, isBefore } from 'date-fns'
import { parseDate, today as getToday } from '@/lib/utils/date.utils'
import type { DateRange } from 'react-day-picker'
import type { Stay } from '@/lib/schemas/entities/stay.entity.schema'
import type { StayAvailabilityResponse } from '@/lib/api/stays'

type StayBookingCardProps = {
  stay: Stay
}

export default function StayBookingCard({ stay }: StayBookingCardProps) {
  const t = useTranslation()
  const lang = useLocaleStore(s => s.lang)
  const dateLocale = lang === 'it' ? it : enUS

  const reviews = stay.reviews ?? []
  const avgRating =
    reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : null

  const tiers = stay.priceLists?.[0]?.tiers
  const nightlyPrice = tiers && tiers.length > 0 ? Math.min(...tiers.map(tier => tier.baseAmount)) : 0

  const coverUrl = stay.images?.[0]?.url ?? stay.cover

  const [blockedRanges, setBlockedRanges] = useState<Array<{ from: Date; to: Date }>>([])
  const [loadingAvailability, setLoadingAvailability] = useState(true)
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [open, setOpen] = useState(false)
  const [activeField, setActiveField] = useState<'from' | 'to'>('from')

  useEffect(() => {
    api
      .get<StayAvailabilityResponse>(`/stays/${stay.id}/availability`)
      .then(data => {
        const blocked = data.availability
          .filter(a => !a.available)
          .map(a => ({
            from: parseDate(a.dateFrom),
            to: parseDate(a.dateTo),
          }))
        setBlockedRanges(blocked)
      })
      .catch(() => {})
      .finally(() => setLoadingAvailability(false))
  }, [stay.id])

  const nights = dateRange?.from && dateRange?.to ? differenceInCalendarDays(dateRange.to, dateRange.from) : 0

  const formatDate = useCallback(
    (date: Date) => format(date, 'd/M/yyyy', { locale: dateLocale }),
    [dateLocale]
  )

  const handleSelect = (range: DateRange | undefined) => {
    if (activeField === 'from') {
      // When selecting check-in, reset the range
      setDateRange({ from: range?.from, to: undefined })
      if (range?.from) setActiveField('to')
    } else {
      // When selecting check-out
      if (range?.from && range?.to && isBefore(range.to, range.from)) {
        setDateRange({ from: range.to, to: undefined })
        setActiveField('to')
      } else {
        setDateRange(range)
        if (range?.to) setOpen(false)
      }
    }
  }

  const handleClear = () => {
    setDateRange(undefined)
    setActiveField('from')
  }

  const handleOpenCheckin = () => {
    setActiveField('from')
    setOpen(true)
  }

  const handleOpenCheckout = () => {
    setActiveField('to')
    setOpen(true)
  }

  const today = getToday()

  const disabledRanges =
    activeField === 'to'
      ? blockedRanges.map(r => ({ from: addDays(r.from, 1), to: r.to })).filter(r => r.from <= r.to)
      : blockedRanges

  return (
    <div className="rounded-2xl border bg-background p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-start gap-3">
        {coverUrl && (
          <div className="relative size-12 shrink-0 overflow-hidden rounded-lg">
            <Image src={coverUrl} alt={stay.name} fill className="object-cover" sizes="48px" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-snug">{stay.name}</p>
        </div>
        {avgRating && (
          <div className="flex shrink-0 items-center gap-1 text-sm">
            <StarIcon className="size-3.5 fill-foreground" />
            <span className="font-semibold">{avgRating}</span>
          </div>
        )}
      </div>

      {/* Date picker trigger */}
      <Popover open={open} onOpenChange={setOpen}>
        <div className="mt-5 grid grid-cols-2">
          {/* Check-in */}
          {/* Check-in */}
          <PopoverTrigger asChild>
            <div
              role="button"
              tabIndex={0}
              onClick={handleOpenCheckin}
              className={`flex h-14 cursor-pointer items-center justify-between rounded-l-xl border border-input bg-background px-3 text-left shadow-xs transition-[color,box-shadow] ${
                open && activeField === 'from' ? 'border-ring ring-ring/50 ring-[3px]' : ''
              }`}
            >
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{t.stay_detail_check_in}</p>
                <p className={`text-sm ${dateRange?.from ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {dateRange?.from ? formatDate(dateRange.from) : t.stay_detail_select_dates}
                </p>
              </div>
              {dateRange?.from && (
                <span
                  role="button"
                  tabIndex={0}
                  className="ml-2 shrink-0 cursor-pointer rounded-full p-0.5 hover:bg-muted"
                  onClick={e => {
                    e.stopPropagation()
                    handleClear()
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.stopPropagation()
                      handleClear()
                    }
                  }}
                >
                  <XIcon className="size-3.5" />
                </span>
              )}
            </div>
          </PopoverTrigger>

          {/* Check-out */}
          <PopoverTrigger asChild>
            <div
              role="button"
              tabIndex={0}
              onClick={handleOpenCheckout}
              className={`flex h-14 cursor-pointer items-center justify-between rounded-r-xl border border-l-0 border-input bg-background px-3 text-left shadow-xs transition-[color,box-shadow] ${
                open && activeField === 'to' ? 'border-ring ring-ring/50 ring-[3px]' : ''
              }`}
            >
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{t.stay_detail_check_out}</p>
                <p className={`text-sm ${dateRange?.to ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {dateRange?.to ? formatDate(dateRange.to) : t.stay_detail_select_dates}
                </p>
              </div>
              {dateRange?.to && (
                <span
                  role="button"
                  tabIndex={0}
                  className="ml-2 shrink-0 cursor-pointer rounded-full p-0.5 hover:bg-muted"
                  onClick={e => {
                    e.stopPropagation()
                    setDateRange(prev => ({ from: prev?.from, to: undefined }))
                    setActiveField('to')
                    setOpen(true)
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.stopPropagation()
                      setDateRange(prev => ({ from: prev?.from, to: undefined }))
                      setActiveField('to')
                      setOpen(true)
                    }
                  }}
                >
                  <XIcon className="size-3.5" />
                </span>
              )}
            </div>
          </PopoverTrigger>

          <PopoverContent
            align="center"
            side="bottom"
            className="w-auto p-0"
            onOpenAutoFocus={e => e.preventDefault()}
          >
            {loadingAvailability ? (
              <div className="p-4">
                <Skeleton className="mb-4 h-7 w-48" />
                <div className="flex gap-4">
                  {[0, 1].map(m => (
                    <div key={m} className="flex flex-col gap-2">
                      <Skeleton className="mx-auto h-5 w-28" />
                      <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: 42 }).map((_, i) => (
                          <Skeleton key={i} className="size-8 rounded-md" />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4">
                {/* Header summary */}
                {nights > 0 && dateRange?.from && dateRange?.to ? (
                  <div className="mb-4">
                    <p className="text-lg font-bold">
                      {interpolate(nights === 1 ? t.stay_detail_night_count : t.stay_detail_nights_count, {
                        count: nights.toString(),
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(dateRange.from, 'MMM d, yyyy', { locale: dateLocale })} -{' '}
                      {format(dateRange.to, 'MMM d, yyyy', { locale: dateLocale })}
                    </p>
                  </div>
                ) : (
                  <div className="mb-4">
                    <p className="text-lg font-bold">{t.stay_detail_select_dates}</p>
                  </div>
                )}

                {/* Calendar */}
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={handleSelect}
                  numberOfMonths={2}
                  disabled={[{ before: today }, ...disabledRanges]}
                  locale={dateLocale}
                  defaultMonth={dateRange?.from ?? today}
                />
                <p className="text-center text-xs text-muted-foreground">{t.checkout_timezone}</p>

                {/* Footer */}
                <div className="mt-2 flex items-center justify-end gap-2 border-t pt-3">
                  <Button variant="ghost" size="sm" onClick={handleClear}>
                    {t.stay_detail_clear_dates}
                  </Button>
                  <Button size="sm" onClick={() => setOpen(false)}>
                    {t.stay_detail_close}
                  </Button>
                </div>
              </div>
            )}
          </PopoverContent>
        </div>
      </Popover>

      {/* Guests input */}
      <div className="mt-2">
        <div className="group/field relative" data-has-value>
          <input
            type="number"
            min={1}
            max={stay.stayDetail?.maxPeople ?? stay.maxPeople ?? 10}
            defaultValue={1}
            className="border-input h-14 w-full rounded-xl border bg-background px-3 pt-5 pb-1 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
          />
          <label className="pointer-events-none absolute left-3 top-1.5 select-none text-xs text-muted-foreground">
            {t.stay_detail_guests}
          </label>
        </div>
      </div>

      {/* Price + Book */}
      <div className="mt-5 flex items-center justify-between">
        <div>
          <p className="text-base font-bold">
            {interpolate(t.stay_detail_price_per_night, { price: formatCurrency(nightlyPrice) })}
          </p>
          <p className="text-xs font-semibold text-primary">{t.stay_detail_free_cancellation}</p>
        </div>
        <Button size="lg" className="rounded-xl px-8">
          {t.stay_detail_book}
        </Button>
      </div>
    </div>
  )
}
