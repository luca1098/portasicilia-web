import { CalendarIcon } from '@/lib/constants/icons'
import { useTranslation } from '@/lib/context/translation.context'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import BookingDaySlotGroup from './booking-day-slot-group'
import BookingSlotsSkeleton from './booking-slots-skeleton'
import { formatMonthYear } from './booking.utils'
import type { AvailableDateSlots } from '@/lib/api/experiences'
import type { PricingMode } from '@/lib/schemas/entities/pricing.entity.schema'

type BookingStepSlotsProps = {
  participantSummary: string
  loadingSlots: boolean
  availabilityData: AvailableDateSlots[] | null
  selectedDate: Date | undefined
  calendarOpen: boolean
  daysOfWeek: string[]
  pricingMode: PricingMode
  assetLabel?: string | null
  onEditParticipants: () => void
  onDateSelect: (date: Date | undefined) => void
  onClearDate: () => void
  onSlotSelect: (slotId: string, slotDate: string) => void
  onCalendarOpenChange: (open: boolean) => void
  disabledCalendarDays: (date: Date) => boolean
}

export default function BookingStepSlots({
  participantSummary,
  loadingSlots,
  availabilityData,
  selectedDate,
  calendarOpen,
  daysOfWeek,
  pricingMode,
  assetLabel,
  onEditParticipants,
  onDateSelect,
  onSlotSelect,
  onCalendarOpenChange,
  disabledCalendarDays,
}: BookingStepSlotsProps) {
  const t = useTranslation()

  const visibleMonth =
    availabilityData && availabilityData.length > 0 ? formatMonthYear(availabilityData[0].date) : ''

  const hasNoSlots = availabilityData !== null && availabilityData.every(d => d.slots.length === 0)

  return (
    <>
      {/* Participant summary row */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">{t.exp_detail_participants}</p>
          <p className="text-sm font-medium">{participantSummary}</p>
        </div>
        <Button variant="outline" size="xs" className="rounded-full" onClick={onEditParticipants}>
          {t.admin_common_edit}
        </Button>
      </div>

      <hr className="mb-5 border-border" />

      {/* Slots content */}
      {loadingSlots ? (
        <BookingSlotsSkeleton />
      ) : hasNoSlots ? (
        <p className="py-4 text-center text-sm text-muted-foreground">{t.exp_booking_no_available_slots}</p>
      ) : availabilityData !== null ? (
        <>
          <h3 className="text-base font-bold">{visibleMonth}</h3>
          <p className="mb-4 text-xs text-muted-foreground">{t.exp_booking_timezone}</p>

          <div className="max-h-[400px] overflow-y-auto border-t pt-4">
            {availabilityData.map(entry => (
              <BookingDaySlotGroup
                key={entry.date}
                entry={entry}
                pricingMode={pricingMode}
                assetLabel={assetLabel}
                onSlotSelect={onSlotSelect}
              />
            ))}

            {/* Date picker button */}
            {daysOfWeek.length > 0 && (
              <Popover open={calendarOpen} onOpenChange={onCalendarOpenChange}>
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
                    onSelect={onDateSelect}
                    disabled={disabledCalendarDays}
                  />
                </PopoverContent>
              </Popover>
            )}
          </div>
        </>
      ) : null}
    </>
  )
}
