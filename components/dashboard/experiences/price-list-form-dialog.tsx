'use client'

import { useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { InputFormField } from '@/components/form/input-form-field'
import { SelectFormField } from '@/components/form/select-form-field'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/context/translation.context'
import { PriceListFormSchema, type PriceListFormValues } from '@/lib/schemas/forms/price-list.form.schema'
import { createPriceListAction, updatePriceListAction } from '@/lib/actions/pricing.actions'
import { useAction } from '@/lib/hooks/use-action'
import { LoaderIcon } from '@/lib/constants/icons'
import type { PriceList } from '@/lib/schemas/entities/pricing.entity.schema'

type PriceListFormDialogProps = {
  experienceId: string
  mode: 'create' | 'edit'
  priceList?: PriceList
  open: boolean
  onOpenChange: (open: boolean) => void
}

const PRICING_MODES = ['PER_PERSON', 'PER_EXPERIENCE', 'PER_ASSET'] as const
const STATUSES = ['DRAFT', 'ACTIVE', 'ARCHIVED'] as const

export default function PriceListFormDialog({
  experienceId,
  mode,
  priceList,
  open,
  onOpenChange,
}: PriceListFormDialogProps) {
  const router = useRouter()
  const t = useTranslation() as Record<string, string>

  const form = useForm<PriceListFormValues>({
    resolver: zodResolver(PriceListFormSchema),
    defaultValues: {
      currency: priceList?.currency ?? 'EUR',
      pricingMode: priceList?.pricingMode ?? 'PER_PERSON',
      validFrom: priceList?.validFrom ?? '',
      validTo: priceList?.validTo ?? '',
      status: priceList?.status ?? 'DRAFT',
    },
  })

  const { loading, execute } = useAction<PriceList>({
    successMessage: mode === 'create' ? t.admin_pricing_create_success : t.admin_pricing_update_success,
    onSuccess: () => {
      onOpenChange(false)
      form.reset()
      router.refresh()
    },
  })

  const onSubmit = async (data: PriceListFormValues) => {
    await execute(() =>
      mode === 'create'
        ? createPriceListAction({ experienceId, ...data })
        : updatePriceListAction(priceList?.id ?? '', data)
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? t.admin_pricing_add : t.admin_pricing_edit}</DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <SelectFormField<PriceListFormValues, (typeof PRICING_MODES)[number]>
                name="pricingMode"
                label={t.admin_pricing_mode}
                options={[...PRICING_MODES]}
                getValue={v => v}
                getLabel={v => t[`admin_pricing_mode_${v.toLowerCase()}`] ?? v}
                required
              />
              <SelectFormField<PriceListFormValues, (typeof STATUSES)[number]>
                name="status"
                label={t.admin_pricing_status}
                options={[...STATUSES]}
                getValue={v => v}
                getLabel={v => t[`admin_pricing_status_${v.toLowerCase()}`] ?? v}
                required
              />
            </div>
            <InputFormField<PriceListFormValues> name="currency" label={t.admin_pricing_currency} required />
            <div className="grid grid-cols-2 gap-4">
              <InputFormField<PriceListFormValues>
                name="validFrom"
                label={t.admin_pricing_valid_from}
                type="date"
                required
              />
              <InputFormField<PriceListFormValues>
                name="validTo"
                label={t.admin_pricing_valid_to}
                type="date"
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
