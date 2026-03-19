'use client'

import { createContext, useContext, useCallback } from 'react'
import Image from 'next/image'
import { StarIcon, XIcon, LoaderIcon } from '@/lib/constants/icons'
import { useTranslation } from '@/lib/context/translation.context'
import { interpolate } from '@/lib/utils/i18n.utils'
import { formatCurrency } from '@/core/utils/currency.utils'
import useLocaleStore from '@/core/store/locale.store'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar, CalendarDayButton } from '@/components/ui/calendar'
import { Skeleton } from '@/components/ui/skeleton'
import { it, enUS } from 'date-fns/locale'
import { format } from 'date-fns'
import { today as getToday } from '@/lib/utils/date.utils'
import { useStayBooking } from './use-stay-booking'
import type { DayButton } from 'react-day-picker'
import type { Stay } from '@/lib/schemas/entities/stay.entity.schema'

const DailyRatesContext = createContext<Record<string, string>>({})

function PriceDayButton(props: React.ComponentProps<typeof DayButton>) {
  const rates = useContext(DailyRatesContext)
  const dateKey = format(props.day.date, 'yyyy-MM-dd')
  const rate = rates[dateKey]
  const isHidden = props.modifiers.disabled || props.modifiers.outside

  return (
    <CalendarDayButton {...props}>
      {props.children}
      {rate && !isHidden && <span className="text-9px! leading-none!">{`€${Math.round(Number(rate))}`}</span>}
    </CalendarDayButton>
  )
}

type StayBookingCardProps = {
  stay: Stay
}

export default function StayBookingCard({ stay }: StayBookingCardProps) {
  const t = useTranslation()
  const lang = useLocaleStore(s => s.lang)
  const booking = useStayBooking(stay)

  const dateLocale = lang === 'it' ? it : enUS
  const reviews = stay.reviews ?? []
  const avgRating =
    reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : null
  const coverUrl = stay.images?.[0]?.url ?? stay.cover
  const today = getToday()

  const formatDateDisplay = useCallback(
    (date: Date) => format(date, 'd/M/yyyy', { locale: dateLocale }),
    [dateLocale]
  )

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
      <Popover open={booking.open} onOpenChange={booking.setOpen}>
        <div className="mt-5 grid grid-cols-2">
          {/* Check-in */}
          <PopoverTrigger asChild>
            <div
              role="button"
              tabIndex={0}
              onClick={booking.handleOpenCheckin}
              className={`flex h-14 cursor-pointer items-center justify-between rounded-l-xl border border-input bg-background px-3 text-left shadow-xs transition-[color,box-shadow] ${booking.open && booking.activeField === 'from' ? 'border-ring ring-ring/50 ring-[3px]' : ''}`}
            >
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{t.stay_detail_check_in}</p>
                <p
                  className={`text-sm ${booking.dateRange?.from ? 'text-foreground' : 'text-muted-foreground'}`}
                >
                  {booking.dateRange?.from
                    ? formatDateDisplay(booking.dateRange.from)
                    : t.stay_detail_select_dates}
                </p>
              </div>
              {booking.dateRange?.from && (
                <span
                  role="button"
                  tabIndex={0}
                  className="ml-2 shrink-0 cursor-pointer rounded-full p-0.5 hover:bg-muted"
                  onClick={e => {
                    e.stopPropagation()
                    booking.handleClear()
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.stopPropagation()
                      booking.handleClear()
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
              onClick={booking.handleOpenCheckout}
              className={`flex h-14 cursor-pointer items-center justify-between rounded-r-xl border border-l-0 border-input bg-background px-3 text-left shadow-xs transition-[color,box-shadow] ${booking.open && booking.activeField === 'to' ? 'border-ring ring-ring/50 ring-[3px]' : ''}`}
            >
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{t.stay_detail_check_out}</p>
                <p
                  className={`text-sm ${booking.dateRange?.to ? 'text-foreground' : 'text-muted-foreground'}`}
                >
                  {booking.dateRange?.to
                    ? formatDateDisplay(booking.dateRange.to)
                    : t.stay_detail_select_dates}
                </p>
              </div>
              {booking.dateRange?.to && (
                <span
                  role="button"
                  tabIndex={0}
                  className="ml-2 shrink-0 cursor-pointer rounded-full p-0.5 hover:bg-muted"
                  onClick={e => {
                    e.stopPropagation()
                    booking.handleClearCheckout()
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.stopPropagation()
                      booking.handleClearCheckout()
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
            {booking.loadingAvailability ? (
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
                {booking.nights > 0 && booking.dateRange?.from && booking.dateRange?.to ? (
                  <div className="mb-4">
                    <p className="text-lg font-bold">
                      {interpolate(
                        booking.nights === 1 ? t.stay_detail_night_count : t.stay_detail_nights_count,
                        { count: booking.nights.toString() }
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(booking.dateRange.from, 'MMM d, yyyy', { locale: dateLocale })} -{' '}
                      {format(booking.dateRange.to, 'MMM d, yyyy', { locale: dateLocale })}
                    </p>
                  </div>
                ) : (
                  <div className="mb-4">
                    <p className="text-lg font-bold">{t.stay_detail_select_dates}</p>
                  </div>
                )}

                {/* Calendar */}
                <DailyRatesContext.Provider value={booking.dailyRates}>
                  <Calendar
                    mode="range"
                    selected={booking.dateRange}
                    onSelect={booking.handleSelect}
                    numberOfMonths={2}
                    disabled={[{ before: today }, ...booking.disabledRanges]}
                    locale={dateLocale}
                    defaultMonth={booking.dateRange?.from ?? today}
                    onMonthChange={booking.handleMonthChange}
                    className="[--cell-size:--spacing(10)]"
                    components={{ DayButton: PriceDayButton }}
                  />
                </DailyRatesContext.Provider>
                <p className="text-center text-xs text-muted-foreground">{t.checkout_timezone}</p>

                {/* Footer */}
                <div className="mt-2 flex items-center justify-end gap-2 border-t pt-3">
                  <Button variant="ghost" size="sm" onClick={booking.handleClear}>
                    {t.stay_detail_clear_dates}
                  </Button>
                  <Button size="sm" onClick={() => booking.setOpen(false)}>
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

      {/* Deposit + Book */}
      <div className="mt-5 flex items-center justify-between">
        <div>
          {booking.nights <= 0 ? (
            <p className="text-base font-bold">
              {interpolate(t.stay_detail_price_per_night, { price: formatCurrency(booking.nightlyPrice) })}
            </p>
          ) : booking.loadingPrice ? (
            <Skeleton className="h-5 w-32" />
          ) : (
            <p className="text-base font-bold">
              {interpolate(t.stay_detail_total, { price: formatCurrency(booking.totalPrice) })}
            </p>
          )}
          {stay.cancellationTerms.length > 0 && (
            <p className="text-xs font-semibold text-primary">{stay.cancellationTerms[0]}</p>
          )}
        </div>
        <Button size="lg" className="rounded-xl px-8" disabled={booking.loadingPrice}>
          {booking.loadingPrice && <LoaderIcon className="size-4 animate-spin" />}
          {booking.nights > 0
            ? interpolate(t.stay_detail_block_with, { price: formatCurrency(booking.deposit) })
            : t.stay_detail_book}
        </Button>
      </div>
    </div>
  )
}
