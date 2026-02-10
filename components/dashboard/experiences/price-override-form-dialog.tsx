'use client'

import { useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { InputFormField } from '@/components/form/input-form-field'
import { CurrencyFormField } from '@/components/form/currency-form-field'
import { NumberFormField } from '@/components/form/number-form-field'
import { CheckboxFormField } from '@/components/form/checkbox-form-field'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/context/translation.context'
import {
  PriceOverrideFormSchema,
  type PriceOverrideFormValues,
} from '@/lib/schemas/forms/price-override.form.schema'
import { createPriceOverrideAction, updatePriceOverrideAction } from '@/lib/actions/pricing.actions'
import { useAction } from '@/lib/hooks/use-action'
import { LoaderIcon } from '@/lib/constants/icons'
import type { PriceOverride } from '@/lib/schemas/entities/pricing.entity.schema'

type PriceOverrideFormDialogProps = {
  tierId: string
  mode: 'create' | 'edit'
  override?: PriceOverride
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function PriceOverrideFormDialog({
  tierId,
  mode,
  override,
  open,
  onOpenChange,
}: PriceOverrideFormDialogProps) {
  const router = useRouter()
  const t = useTranslation() as Record<string, string>

  const form = useForm<PriceOverrideFormValues>({
    resolver: zodResolver(PriceOverrideFormSchema),
    defaultValues: {
      name: override?.name ?? '',
      overrideAmount: override?.overrideAmount ?? 0,
      dateFrom: override?.dateFrom ?? '',
      dateTo: override?.dateTo ?? '',
      dayOfWeek: override?.dayOfWeek?.join(', ') ?? '',
      timeSlots: override?.timeSlots?.join(', ') ?? '',
      priority: override?.priority ?? undefined,
      reason: override?.reason ?? '',
      active: override?.active ?? true,
    },
  })

  const { loading, execute } = useAction<PriceOverride>({
    successMessage: mode === 'create' ? t.admin_override_create_success : t.admin_override_update_success,
    onSuccess: () => {
      onOpenChange(false)
      form.reset()
      router.refresh()
    },
  })

  const onSubmit = async (data: PriceOverrideFormValues) => {
    const payload: Record<string, unknown> = {
      name: data.name,
      overrideAmount: data.overrideAmount,
      dateFrom: data.dateFrom,
      dateTo: data.dateTo,
      priority: data.priority ?? null,
      reason: data.reason || null,
      active: data.active,
      dayOfWeek: data.dayOfWeek
        ? data.dayOfWeek
            .split(',')
            .map(s => parseInt(s.trim(), 10))
            .filter(n => !isNaN(n))
        : null,
      timeSlots: data.timeSlots
        ? data.timeSlots
            .split(',')
            .map(s => s.trim())
            .filter(Boolean)
        : null,
    }
    await execute(() =>
      mode === 'create'
        ? createPriceOverrideAction(tierId, payload)
        : updatePriceOverrideAction(tierId, override?.id ?? '', payload)
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? t.admin_override_add : t.admin_override_edit}</DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <InputFormField<PriceOverrideFormValues> name="name" label={t.admin_override_name} required />
            <CurrencyFormField<PriceOverrideFormValues>
              name="overrideAmount"
              label={t.admin_override_amount}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <InputFormField<PriceOverrideFormValues>
                name="dateFrom"
                label={t.admin_override_date_from}
                type="date"
                required
              />
              <InputFormField<PriceOverrideFormValues>
                name="dateTo"
                label={t.admin_override_date_to}
                type="date"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputFormField<PriceOverrideFormValues>
                name="dayOfWeek"
                label={t.admin_override_day_of_week}
                placeholder="0, 1, 2..."
              />
              <InputFormField<PriceOverrideFormValues>
                name="timeSlots"
                label={t.admin_override_time_slots}
                placeholder="09:00, 14:00..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <NumberFormField<PriceOverrideFormValues> name="priority" label={t.admin_override_priority} />
              <InputFormField<PriceOverrideFormValues> name="reason" label={t.admin_override_reason} />
            </div>
            <CheckboxFormField<PriceOverrideFormValues> name="active" label={t.admin_modifier_active} />
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
