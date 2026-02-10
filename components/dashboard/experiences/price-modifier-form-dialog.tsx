'use client'

import { useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { InputFormField } from '@/components/form/input-form-field'
import { SelectFormField } from '@/components/form/select-form-field'
import { NumberFormField } from '@/components/form/number-form-field'
import { TextareaFormField } from '@/components/form/textarea-form-field'
import { CheckboxFormField } from '@/components/form/checkbox-form-field'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/context/translation.context'
import {
  PriceModifierFormSchema,
  type PriceModifierFormValues,
} from '@/lib/schemas/forms/price-modifier.form.schema'
import { createPriceModifierAction, updatePriceModifierAction } from '@/lib/actions/pricing.actions'
import { useAction } from '@/lib/hooks/use-action'
import { LoaderIcon } from '@/lib/constants/icons'
import type { PriceModifier } from '@/lib/schemas/entities/pricing.entity.schema'

type PriceModifierFormDialogProps = {
  priceListId: string
  mode: 'create' | 'edit'
  modifier?: PriceModifier
  open: boolean
  onOpenChange: (open: boolean) => void
}

const MODIFIER_TYPES = [
  'SEASONAL',
  'DAY_OF_WEEK',
  'EARLY_BIRD',
  'LAST_MINUTE',
  'TIME_SLOT',
  'CUSTOM',
] as const
const ADJUSTMENT_TYPES = ['PERCENTAGE', 'ABSOLUTE'] as const

export default function PriceModifierFormDialog({
  priceListId,
  mode,
  modifier,
  open,
  onOpenChange,
}: PriceModifierFormDialogProps) {
  const router = useRouter()
  const t = useTranslation() as Record<string, string>

  const form = useForm<PriceModifierFormValues>({
    resolver: zodResolver(PriceModifierFormSchema),
    defaultValues: {
      name: modifier?.name ?? '',
      type: modifier?.type ?? 'CUSTOM',
      adjustmentType: modifier?.adjustmentType ?? 'PERCENTAGE',
      value: modifier?.value ?? 0,
      priority: modifier?.priority ?? undefined,
      conditions: modifier?.conditions ? JSON.stringify(modifier.conditions) : '',
      stackable: modifier?.stackable ?? false,
      active: modifier?.active ?? true,
    },
  })

  const { loading, execute } = useAction<PriceModifier>({
    successMessage: mode === 'create' ? t.admin_modifier_create_success : t.admin_modifier_update_success,
    onSuccess: () => {
      onOpenChange(false)
      form.reset()
      router.refresh()
    },
  })

  const onSubmit = async (data: PriceModifierFormValues) => {
    const payload: Record<string, unknown> = { ...data }
    if (data.conditions) {
      try {
        payload.conditions = JSON.parse(data.conditions)
      } catch {
        payload.conditions = null
      }
    } else {
      payload.conditions = null
    }
    await execute(() =>
      mode === 'create'
        ? createPriceModifierAction(priceListId, payload)
        : updatePriceModifierAction(priceListId, modifier?.id ?? '', payload)
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? t.admin_modifier_add : t.admin_modifier_edit}</DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <InputFormField<PriceModifierFormValues> name="name" label={t.admin_modifier_name} required />
            <div className="grid grid-cols-2 gap-4">
              <SelectFormField<PriceModifierFormValues, (typeof MODIFIER_TYPES)[number]>
                name="type"
                label={t.admin_modifier_type}
                options={[...MODIFIER_TYPES]}
                getValue={v => v}
                getLabel={v => t[`admin_modifier_type_${v.toLowerCase()}`] ?? v}
                required
              />
              <SelectFormField<PriceModifierFormValues, (typeof ADJUSTMENT_TYPES)[number]>
                name="adjustmentType"
                label={t.admin_modifier_adjustment_type}
                options={[...ADJUSTMENT_TYPES]}
                getValue={v => v}
                getLabel={v => t[`admin_modifier_adj_${v.toLowerCase()}`] ?? v}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <NumberFormField<PriceModifierFormValues>
                name="value"
                label={t.admin_modifier_value}
                required
              />
              <NumberFormField<PriceModifierFormValues> name="priority" label={t.admin_modifier_priority} />
            </div>
            <TextareaFormField<PriceModifierFormValues>
              name="conditions"
              label={t.admin_modifier_conditions}
              rows={2}
            />
            <div className="flex gap-6">
              <CheckboxFormField<PriceModifierFormValues>
                name="stackable"
                label={t.admin_modifier_stackable}
              />
              <CheckboxFormField<PriceModifierFormValues> name="active" label={t.admin_modifier_active} />
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
