import { useParams } from 'next/navigation'
import { CalendarIcon } from '@/lib/constants/icons'
import { useTranslation } from '@/lib/context/translation.context'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import BookingDaySlotGroup from './booking-day-slot-group'
import BookingSlotsSkeleton from './booking-slots-skeleton'
import { formatMonthYear } from './booking.utils'
import { getDayPickerLocale } from '@/lib/utils/date-locale.utils'
import { useBookingContext } from './booking-context'

export default function BookingStepSlots() {
  const {
    participantSummary,
    loadingSlots,
    availabilityData,
    selectedDate,
    calendarOpen,
    daysOfWeek,
    pricingMode,
    experience,
    handleEditParticipants,
    handleDateSelect,
    handleSlotSelect,
    setCalendarOpen,
    disabledCalendarDays,
  } = useBookingContext()
  const t = useTranslation()
  const { lang } = useParams<{ lang: string }>()

  const assetLabel = experience.assetLabel
  const visibleMonth =
    availabilityData && availabilityData.length > 0 ? formatMonthYear(availabilityData[0].date, lang) : ''
  const hasNoSlots = availabilityData !== null && availabilityData.every(d => d.slots.length === 0)

  return (
    <>
      {/* Participant summary row */}
      <div className="mb-4 flex items-center justify-between px-4">
        <div>
          <p className="text-xs text-muted-foreground">{t.exp_detail_participants}</p>
          <p className="text-sm font-medium">{participantSummary}</p>
        </div>
        <Button variant="outline" size="xs" className="rounded-full" onClick={handleEditParticipants}>
          {t.admin_common_edit}
        </Button>
      </div>

      <hr className="mb-5 border-border" />

      {/* Slots content */}
      {loadingSlots ? (
        <BookingSlotsSkeleton />
      ) : hasNoSlots ? (
        <p className="p-4 text-center text-sm text-muted-foreground">{t.exp_booking_no_available_slots}</p>
      ) : availabilityData !== null ? (
        <>
          <div className="px-4">
            <h3 className="text-base font-bold">{visibleMonth}</h3>
            <p className="mb-4 text-xs text-muted-foreground">{t.exp_booking_timezone}</p>
          </div>
          <hr className="border-border" />

          <div className="">
            <div className="max-h-[400px] overflow-y-auto p-4">
              {availabilityData.map(entry => (
                <BookingDaySlotGroup
                  key={entry.date}
                  entry={entry}
                  pricingMode={pricingMode}
                  assetLabel={assetLabel}
                  onSlotSelect={handleSlotSelect}
                />
              ))}

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
                      locale={getDayPickerLocale(lang)}
                    />
                    <p className="px-4 pb-3 text-center text-xs text-muted-foreground">
                      {t.checkout_timezone}
                    </p>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>
        </>
      ) : null}
    </>
  )
}
