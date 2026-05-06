'use client'

import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from '@/lib/context/translation.context'
import { CheckIcon } from '@/lib/constants/icons'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/shadcn.utils'
import { DeliveryStep } from '@/components/checkout/delivery-step'
import {
  deliveryFormSchema,
  deliveryFormDefaults,
  type DeliveryFormValues,
} from '@/lib/schemas/forms/delivery.form.schema'

type DeliveryStepSectionProps = {
  stepNumber: number
  isActive: boolean
  isEnabled: boolean
  isComplete: boolean
  deliveryData: DeliveryFormValues | null
  defaultValues?: DeliveryFormValues
  onSubmit: (data: DeliveryFormValues) => void
  onEdit: () => void
}

export default function DeliveryStepSection({
  stepNumber,
  isActive,
  isEnabled,
  isComplete,
  deliveryData,
  defaultValues,
  onSubmit,
  onEdit,
}: DeliveryStepSectionProps) {
  const t = useTranslation()

  const form = useForm<DeliveryFormValues>({
    resolver: zodResolver(deliveryFormSchema),
    defaultValues: defaultValues ?? deliveryFormDefaults,
    mode: 'onSubmit',
  })

  const handleSubmit = form.handleSubmit(onSubmit)

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
              <h2 className="text-base font-semibold">{t.delivery_step_title}</h2>
              <p className="text-sm text-muted-foreground">
                {deliveryData?.street}, {deliveryData?.zipCode} {deliveryData?.city}
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
              <h2 className="text-base font-semibold">{t.delivery_step_title}</h2>
            </div>
          </div>
          {isActive && (
            <FormProvider {...form}>
              <div className="border-t px-5 pb-5 pt-4">
                <DeliveryStep />
                <Button className="mt-5 w-full" onClick={handleSubmit}>
                  {t.checkout_continue}
                </Button>
              </div>
            </FormProvider>
          )}
        </>
      )}
    </section>
  )
}
