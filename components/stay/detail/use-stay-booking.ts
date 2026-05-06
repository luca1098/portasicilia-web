'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { api } from '@/lib/api/fetch-client'
import {
  addDays,
  addMonths,
  differenceInCalendarDays,
  endOfMonth,
  format,
  isBefore,
  startOfMonth,
} from 'date-fns'
import { parseDate, today as getToday } from '@/lib/utils/date.utils'
import type { DateRange } from 'react-day-picker'
import type { Stay } from '@/lib/schemas/entities/stay.entity.schema'
import type { StayAvailabilityResponse } from '@/lib/api/stays'

export type PriceBreakdown = {
  total: string
  netPrice: string
  subtotalBeforeModifiers: string
  modifiersTotal: string
  commissionAmount: string
  lineItems: Array<{
    tierType: string
    label: string | null
    quantity: number
    effectiveUnitPrice: string
    subtotal: string
  }>
  modifiersApplied: Array<{ name: string; adjustment: string }>
}

export type UseStayBookingReturn = {
  dateRange: DateRange | undefined
  open: boolean
  setOpen: (open: boolean) => void
  activeField: 'from' | 'to'
  loadingAvailability: boolean
  loadingPrice: boolean
  nights: number
  totalPrice: number
  deposit: number
  dailyRates: Record<string, string>
  calendarMonth: Date
  disabledRanges: Array<{ from: Date; to: Date }>
  breakdown: PriceBreakdown | null
  nightlyPrice: number
  handleSelect: (range: DateRange | undefined) => void
  handleClear: () => void
  handleOpenCheckin: () => void
  handleOpenCheckout: () => void
  handleMonthChange: (month: Date) => void
  handleClearCheckout: () => void
}

export function useStayBooking(stay: Stay): UseStayBookingReturn {
  const tiers = stay.priceLists?.[0]?.tiers ?? []
  const nightlyPrice = tiers.find(t => t.tierType === 'NIGHTLY')?.baseAmount ?? 0

  const today = getToday()

  const [blockedRanges, setBlockedRanges] = useState<Array<{ from: Date; to: Date }>>([])
  const [loadingAvailability, setLoadingAvailability] = useState(true)
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [open, setOpen] = useState(false)
  const [activeField, setActiveField] = useState<'from' | 'to'>('from')
  const [breakdown, setBreakdown] = useState<PriceBreakdown | null>(null)
  const [loadingPrice, setLoadingPrice] = useState(false)
  const [dailyRates, setDailyRates] = useState<Record<string, string>>({})
  const [calendarMonth, setCalendarMonth] = useState<Date>(dateRange?.from ?? today)

  const abortRef = useRef<AbortController | null>(null)
  const ratesAbortRef = useRef<AbortController | null>(null)

  const nights = dateRange?.from && dateRange?.to ? differenceInCalendarDays(dateRange.to, dateRange.from) : 0

  const checkinTime = dateRange?.from?.getTime()
  const checkoutTime = dateRange?.to?.getTime()
  const hasValidRange = !!checkinTime && !!checkoutTime && nights > 0

  const totalPrice = hasValidRange && breakdown ? Number(breakdown.total) : nightlyPrice * nights
  const deposit = hasValidRange && breakdown ? Number(breakdown.commissionAmount) : (stay.depositValue ?? 0)

  const disabledRanges = (() => {
    if (activeField === 'to' && dateRange?.from) {
      const checkinDate = dateRange.from
      const firstBlockedAfterCheckin = blockedRanges
        .filter(r => r.from >= checkinDate)
        .sort((a, b) => a.from.getTime() - b.from.getTime())[0]

      if (firstBlockedAfterCheckin) {
        return [
          ...blockedRanges
            .filter(r => r.from < checkinDate)
            .map(r => ({ from: addDays(r.from, 1), to: r.to }))
            .filter(r => r.from <= r.to),
          { from: addDays(firstBlockedAfterCheckin.from, 1), to: new Date(9999, 11, 31) },
        ]
      }

      return blockedRanges.map(r => ({ from: addDays(r.from, 1), to: r.to })).filter(r => r.from <= r.to)
    }
    return blockedRanges
  })()

  const fetchBreakdown = useCallback(
    async (checkIn: Date, numNights: number) => {
      if (abortRef.current) abortRef.current.abort()
      const controller = new AbortController()
      abortRef.current = controller
      setLoadingPrice(true)

      try {
        const data = await api.post<PriceBreakdown>('/pricing/calculate', {
          listingId: stay.id,
          date: format(checkIn, 'yyyy-MM-dd'),
          numberOfNights: numNights,
        })
        if (!controller.signal.aborted) setBreakdown(data)
      } catch {
        if (!controller.signal.aborted) setBreakdown(null)
      } finally {
        if (!controller.signal.aborted) setLoadingPrice(false)
      }

      return () => controller.abort()
    },
    [stay.id]
  )

  const fetchDailyRates = useCallback(
    (month: Date) => {
      if (ratesAbortRef.current) ratesAbortRef.current.abort()
      const controller = new AbortController()
      ratesAbortRef.current = controller

      const from = format(startOfMonth(month), 'yyyy-MM-dd')
      const to = format(endOfMonth(addMonths(month, 1)), 'yyyy-MM-dd')

      api
        .get<{ rates: Record<string, string> }>(`/pricing/daily-rates/${stay.id}?from=${from}&to=${to}`)
        .then(data => {
          if (!controller.signal.aborted) {
            setDailyRates(prev => ({ ...prev, ...data.rates }))
          }
        })
        .catch(() => {})
    },
    [stay.id]
  )

  const handleSelect = (range: DateRange | undefined) => {
    if (activeField === 'from') {
      setDateRange({ from: range?.from, to: undefined })
      if (range?.from) setActiveField('to')
    } else {
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
    setBreakdown(null)
  }

  const handleClearCheckout = () => {
    setDateRange(prev => ({ from: prev?.from, to: undefined }))
    setActiveField('to')
    setOpen(true)
  }

  const handleOpenCheckin = () => {
    setActiveField('from')
    setOpen(true)
  }

  const handleOpenCheckout = () => {
    setActiveField('to')
    setOpen(true)
  }

  const handleMonthChange = useCallback((month: Date) => {
    setCalendarMonth(month)
  }, [])

  const fetchAvailability = useCallback(() => {
    setLoadingAvailability(true)
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

  useEffect(() => {
    fetchAvailability()
  }, [fetchAvailability])

  useEffect(() => {
    if (!hasValidRange || !dateRange?.from) {
      return
    }
    const cleanup = fetchBreakdown(dateRange.from, nights)
    return () => {
      cleanup.then(fn => fn?.())
    }
  }, [hasValidRange, checkinTime, nights, fetchBreakdown, dateRange?.from])

  useEffect(() => {
    if (open) {
      fetchAvailability()
      fetchDailyRates(calendarMonth)
    }
  }, [open, calendarMonth, fetchDailyRates, fetchAvailability])

  return {
    dateRange,
    open,
    setOpen,
    activeField,
    loadingAvailability,
    loadingPrice,
    nights,
    totalPrice,
    deposit,
    dailyRates,
    calendarMonth,
    disabledRanges,
    breakdown,
    nightlyPrice,
    handleSelect,
    handleClear,
    handleOpenCheckin,
    handleOpenCheckout,
    handleMonthChange,
    handleClearCheckout,
  }
}
