'use client'

import { FormProvider, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { TimeFormField } from '@/components/form/time-form-field'
import { useTranslation } from '@/lib/context/translation.context'
import { useAction } from '@/lib/hooks/use-action'
import { setScheduleAction } from '@/lib/actions/experiences.actions'
import { LoaderIcon, PlusIcon, Trash2Icon, ClockIcon } from '@/lib/constants/icons'
import { cn } from '@/lib/utils/shadcn.utils'
import { ScheduleTabSchema, DAYS_OF_WEEK } from '@/lib/schemas/forms/schedule-tab.form.schema'
import type { ScheduleTabValues } from '@/lib/schemas/forms/schedule-tab.form.schema'
import type { Experience } from '@/lib/schemas/entities/experience.entity.schema'

type ScheduleTabProps = {
  experienceId: string
  experience?: Experience
  onSaved?: (updated: Experience) => void
}

function computeDuration(start: string, end: string): number | null {
  if (!start || !end) return null
  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)
  const diff = eh * 60 + em - (sh * 60 + sm)
  return diff > 0 ? diff : null
}

function formatDuration(minutes: number, t: Record<string, string>): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h > 0 && m > 0) return `${h}h ${m}${t.admin_timeslot_minutes}`
  if (h > 0) return `${h}h`
  return `${m} ${t.admin_timeslot_minutes}`
}

export default function ScheduleTab({ experienceId, experience, onSaved }: ScheduleTabProps) {
  const t = useTranslation() as Record<string, string>

  // Build default operating days from existing data
  const defaultOperatingDays = {} as Record<string, boolean>
  for (const day of DAYS_OF_WEEK) {
    defaultOperatingDays[day] = experience?.daysOfWeek?.includes(day) ?? true
  }

  // Extract existing time slots
  const existingDefaultSlots =
    experience?.timeSlots?.map(s => ({ startTime: s.startTime, endTime: s.endTime })) ?? []

  const form = useForm<ScheduleTabValues>({
    resolver: zodResolver(ScheduleTabSchema),
    defaultValues: {
      operatingDays: defaultOperatingDays as ScheduleTabValues['operatingDays'],
      timeSlots: existingDefaultSlots.length > 0 ? existingDefaultSlots : [{ startTime: '', endTime: '' }],
    },
  })

  const { control, setValue, formState } = form
  const operatingDays = useWatch({ control: form.control, name: 'operatingDays' })
  const watchedSlots = useWatch({ control: form.control, name: 'timeSlots' })

  const {
    fields: timeSlotFields,
    append: appendSlot,
    remove: removeSlot,
  } = useFieldArray({ control, name: 'timeSlots' })

  const { loading, execute } = useAction<Experience>({
    successMessage: t.admin_schedule_update_success,
    onSuccess: data => {
      if (data) onSaved?.(data)
    },
  })

  const activeDays = DAYS_OF_WEEK.filter(day => operatingDays?.[day])
  const allDaysActive = activeDays.length === 7
  const noDaysActive = activeDays.length === 0

  const handleToggleAllDays = () => {
    const newValue = !allDaysActive
    const updated: Record<string, boolean> = {}
    for (const day of DAYS_OF_WEEK) {
      updated[day] = newValue
    }
    setValue('operatingDays', updated as ScheduleTabValues['operatingDays'], {
      shouldValidate: true,
    })
  }

  const handleToggleDay = (day: (typeof DAYS_OF_WEEK)[number]) => {
    const current = operatingDays?.[day] ?? false
    setValue(`operatingDays.${day}` as `operatingDays.${(typeof DAYS_OF_WEEK)[number]}`, !current, {
      shouldValidate: true,
    })
  }

  const onSubmit = async (data: ScheduleTabValues) => {
    const daysOfWeek = DAYS_OF_WEEK.filter(day => data.operatingDays[day])

    await execute(() =>
      setScheduleAction(experienceId, {
        daysOfWeek,
        timeSlots: data.timeSlots.filter(s => s.startTime),
      })
    )
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-6">
          {/* Operating Days — toggleable chips */}
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">{t.admin_wizard_operating_days}</h3>
              <button
                type="button"
                onClick={handleToggleAllDays}
                className="text-xs font-medium text-primary hover:underline"
              >
                {allDaysActive ? t.admin_wizard_deselect_all : t.admin_wizard_select_all}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {DAYS_OF_WEEK.map(day => {
                const isActive = operatingDays?.[day] ?? false
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleToggleDay(day)}
                    className={cn(
                      'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-background text-muted-foreground hover:border-muted-foreground'
                    )}
                  >
                    {t[`admin_day_${day.toLowerCase()}_short`] ?? t[`admin_day_${day.toLowerCase()}`] ?? day}
                  </button>
                )
              })}
            </div>
            {noDaysActive && <p className="text-xs text-destructive">{t.admin_wizard_no_days_selected}</p>}
          </div>

          {/* Time Slots */}
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold">{t.admin_wizard_time_slots}</h3>
                <p className="text-xs text-muted-foreground">{t.admin_wizard_time_slots_hint}</p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => appendSlot({ startTime: '', endTime: '' })}
              >
                <PlusIcon className="size-4" />
                {t.admin_wizard_add_slot}
              </Button>
            </div>

            {formState.errors.timeSlots?.root?.message && (
              <p className="text-sm text-destructive">{formState.errors.timeSlots.root.message}</p>
            )}
            {typeof formState.errors.timeSlots?.message === 'string' && (
              <p className="text-sm text-destructive">{formState.errors.timeSlots.message}</p>
            )}

            {timeSlotFields.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border p-6 text-center">
                <p className="text-sm text-muted-foreground">{t.admin_wizard_no_slots}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {timeSlotFields.map((field, index) => {
                  const slotValues = watchedSlots?.[index]
                  const duration = slotValues
                    ? computeDuration(slotValues.startTime, slotValues.endTime)
                    : null
                  return (
                    <div key={field.id} className="flex items-end gap-3 rounded-lg border border-border p-3">
                      <TimeFormField<ScheduleTabValues>
                        name={`timeSlots.${index}.startTime`}
                        label={t.admin_timeslot_start}
                        className="flex-1"
                      />
                      <TimeFormField<ScheduleTabValues>
                        name={`timeSlots.${index}.endTime`}
                        label={t.admin_timeslot_end}
                        className="flex-1"
                      />
                      {duration !== null && (
                        <div className="flex items-center gap-1 pb-2 text-xs text-muted-foreground">
                          <ClockIcon className="size-3" />
                          <span>{formatDuration(duration, t)}</span>
                        </div>
                      )}
                      <Button type="button" variant="ghost" size="icon-sm" onClick={() => removeSlot(index)}>
                        <Trash2Icon className="size-4 text-destructive" />
                      </Button>
                    </div>
                  )
                })}
              </div>
            )}

            {activeDays.length > 0 && timeSlotFields.length > 0 && (
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">
                  {t.admin_wizard_slots_apply_to}{' '}
                  <span className="font-medium text-foreground">
                    {activeDays.map(day => t[`admin_day_${day.toLowerCase()}`] ?? day).join(', ')}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading && <LoaderIcon className="size-4 animate-spin" />}
            {loading ? t.admin_exp_saving : t.admin_wizard_save_schedule}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
