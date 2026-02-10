'use client'

import { useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { InputFormField } from '@/components/form/input-form-field'
import { SelectFormField } from '@/components/form/select-form-field'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/context/translation.context'
import {
  ExperienceTimeSlotFormSchema,
  type ExperienceTimeSlotFormValues,
} from '@/lib/schemas/forms/experience-time-slot.form.schema'
import { createTimeSlotAction } from '@/lib/actions/experience-time-slots.actions'
import { useAction } from '@/lib/hooks/use-action'
import { LoaderIcon } from '@/lib/constants/icons'
import type { ExperienceTimeSlot } from '@/lib/schemas/entities/experience.entity.schema'

type TimeSlotFormDialogProps = {
  experienceId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DAYS_OF_WEEK = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'] as const

export default function TimeSlotFormDialog({ experienceId, open, onOpenChange }: TimeSlotFormDialogProps) {
  const router = useRouter()
  const t = useTranslation() as Record<string, string>

  const form = useForm<ExperienceTimeSlotFormValues>({
    resolver: zodResolver(ExperienceTimeSlotFormSchema),
    defaultValues: {
      dayOfWeek: 'MONDAY',
      startTime: '',
      endTime: '',
    },
  })

  const { loading, execute } = useAction<ExperienceTimeSlot>({
    successMessage: t.admin_timeslot_create_success,
    onSuccess: () => {
      onOpenChange(false)
      form.reset()
      router.refresh()
    },
  })

  const onSubmit = async (data: ExperienceTimeSlotFormValues) => {
    await execute(() => createTimeSlotAction(experienceId, data))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.admin_timeslot_add}</DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <SelectFormField<ExperienceTimeSlotFormValues, (typeof DAYS_OF_WEEK)[number]>
              name="dayOfWeek"
              label={t.admin_timeslot_day}
              options={[...DAYS_OF_WEEK]}
              getValue={v => v}
              getLabel={v => t[`admin_day_${v.toLowerCase()}`] ?? v}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <InputFormField<ExperienceTimeSlotFormValues>
                name="startTime"
                label={t.admin_timeslot_start}
                required
              />
              <InputFormField<ExperienceTimeSlotFormValues>
                name="endTime"
                label={t.admin_timeslot_end}
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                {t.admin_common_cancel}
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <LoaderIcon className="size-4 animate-spin" />}
                {loading ? t.admin_exp_saving : t.admin_exp_save}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
