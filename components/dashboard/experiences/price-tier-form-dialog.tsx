'use client'

import { useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { InputFormField } from '@/components/form/input-form-field'
import { CurrencyFormField } from '@/components/form/currency-form-field'
import { NumberFormField } from '@/components/form/number-form-field'
import { TextareaFormField } from '@/components/form/textarea-form-field'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/context/translation.context'
import { PriceTierFormSchema, type PriceTierFormValues } from '@/lib/schemas/forms/price-tier.form.schema'
import { createPriceTierAction, updatePriceTierAction } from '@/lib/actions/pricing.actions'
import { useAction } from '@/lib/hooks/use-action'
import { LoaderIcon } from '@/lib/constants/icons'
import type { PriceTier } from '@/lib/schemas/entities/pricing.entity.schema'

type PriceTierFormDialogProps = {
  priceListId: string
  mode: 'create' | 'edit'
  tier?: PriceTier
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function PriceTierFormDialog({
  priceListId,
  mode,
  tier,
  open,
  onOpenChange,
}: PriceTierFormDialogProps) {
  const router = useRouter()
  const t = useTranslation() as Record<string, string>

  const form = useForm<PriceTierFormValues>({
    resolver: zodResolver(PriceTierFormSchema),
    defaultValues: {
      tierType: tier?.tierType ?? '',
      label: tier?.label ?? '',
      baseAmount: tier?.baseAmount ?? 0,
      minQuantity: tier?.minQuantity ?? undefined,
      maxQuantity: tier?.maxQuantity ?? undefined,
      description: tier?.description ?? '',
    },
  })

  const { loading, execute } = useAction<PriceTier>({
    successMessage: mode === 'create' ? t.admin_tier_create_success : t.admin_tier_update_success,
    onSuccess: () => {
      onOpenChange(false)
      form.reset()
      router.refresh()
    },
  })

  const onSubmit = async (data: PriceTierFormValues) => {
    await execute(() =>
      mode === 'create'
        ? createPriceTierAction(priceListId, data)
        : updatePriceTierAction(priceListId, tier?.id ?? '', data)
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? t.admin_tier_add : t.admin_tier_edit}</DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <InputFormField<PriceTierFormValues> name="tierType" label={t.admin_tier_type} required />
              <InputFormField<PriceTierFormValues> name="label" label={t.admin_tier_label} />
            </div>
            <CurrencyFormField<PriceTierFormValues>
              name="baseAmount"
              label={t.admin_tier_base_amount}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <NumberFormField<PriceTierFormValues> name="minQuantity" label={t.admin_tier_min_qty} />
              <NumberFormField<PriceTierFormValues> name="maxQuantity" label={t.admin_tier_max_qty} />
            </div>
            <TextareaFormField<PriceTierFormValues>
              name="description"
              label={t.admin_tier_description}
              rows={2}
            />
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
