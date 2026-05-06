'use client'

import { useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from '@/lib/context/translation.context'
import { CheckIcon } from '@/lib/constants/icons'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/shadcn.utils'
import { BillingStep } from '@/components/checkout/billing-step'
import {
  createBillingFormSchema,
  billingFormDefaults,
  type BillingFormValues,
} from '@/lib/schemas/forms/billing.form.schema'

type BillingStepSectionProps = {
  stepNumber?: number
  isActive: boolean
  isEnabled: boolean
  isComplete: boolean
  billingData: BillingFormValues | null
  loading: boolean
  defaultValues?: BillingFormValues
  onSubmit: (data: BillingFormValues) => void
  onEdit: () => void
}

export default function BillingStepSection({
  stepNumber = 2,
  isActive,
  isEnabled,
  isComplete,
  billingData,
  loading,
  defaultValues,
  onSubmit,
  onEdit,
}: BillingStepSectionProps) {
  const t = useTranslation()

  const billingSchema = useMemo(
    () => createBillingFormSchema(t.checkout_billing_sdi_or_pec_required),
    [t.checkout_billing_sdi_or_pec_required]
  )

  const billingForm = useForm<BillingFormValues>({
    resolver: zodResolver(billingSchema),
    defaultValues: defaultValues ?? billingFormDefaults,
    mode: 'onSubmit',
  })

  const handleBillingSubmit = billingForm.handleSubmit(onSubmit)

  return (
    <section
      className={cn(
        'rounded-xl border bg-background transition-opacity',
        !isEnabled && 'pointer-events-none opacity-50'
      )}
      role="listitem"
      aria-current={isActive ? 'step' : undefined}
    >
      {isComplete && !isActive ? (
        <div className="flex items-center justify-between p-5">
          <div className="flex items-center gap-3">
            <span className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <CheckIcon className="size-4" />
            </span>
            <div>
              <h2 className="text-base font-semibold">{t.checkout_step_billing}</h2>
              <p className="text-sm text-muted-foreground">
                {billingData?.firstName} {billingData?.lastName}
                {billingData?.billingType === 'COMPANY' && billingData?.companyName
                  ? ` - ${billingData.companyName}`
                  : ''}
              </p>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={onEdit}>
            {t.checkout_edit}
          </Button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between p-5">
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  'flex size-7 items-center justify-center rounded-full text-sm font-semibold',
                  isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                )}
                aria-hidden="true"
              >
                {stepNumber}
              </span>
              <h2 className="text-base font-semibold">{t.checkout_step_billing}</h2>
            </div>
          </div>
          {isActive && (
            <FormProvider {...billingForm}>
              <div className="border-t px-5 pb-5 pt-4">
                <BillingStep />
                <Button className="mt-5 w-full" onClick={handleBillingSubmit} disabled={loading}>
                  {loading ? t.checkout_payment_processing : t.checkout_continue}
                </Button>
              </div>
            </FormProvider>
          )}
        </>
      )}
    </section>
  )
}
