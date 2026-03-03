'use client'

import { useTranslation } from '@/lib/context/translation.context'
import { AlertCircleIcon } from '@/lib/constants/icons'
import { cn } from '@/lib/utils/shadcn.utils'
import PaymentStep from '@/components/checkout/payment-step'

type PaymentStepSectionProps = {
  isActive: boolean
  isEnabled: boolean
  clientSecret: string | null
  depositAmount: number | null
  submitError: string | null
  bookingLoading: boolean
  paymentError: boolean
  onDismissError: () => void
}

export default function PaymentStepSection({
  isActive,
  isEnabled,
  clientSecret,
  depositAmount,
  submitError,
  bookingLoading,
  paymentError,
  onDismissError,
}: PaymentStepSectionProps) {
  const t = useTranslation()

  return (
    <section
      className={cn(
        'rounded-xl border bg-background transition-opacity',
        !isEnabled && 'pointer-events-none opacity-50'
      )}
      role="listitem"
      aria-current={isActive ? 'step' : undefined}
    >
      <div className="flex items-center gap-3 p-5">
        <span
          className={cn(
            'flex size-7 items-center justify-center rounded-full text-sm font-semibold',
            isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          )}
          aria-hidden="true"
        >
          3
        </span>
        <h2 className="text-base font-semibold">{t.checkout_step_payment}</h2>
      </div>

      {isActive && submitError && (
        <div className="mx-5 mb-4 flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-3">
          <AlertCircleIcon className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden="true" />
          <p className="flex-1 text-sm text-destructive">{submitError}</p>
          <button
            type="button"
            className="text-sm font-medium text-destructive underline underline-offset-2"
            onClick={onDismissError}
            aria-label={t.checkout_payment_error_dismiss}
          >
            &times;
          </button>
        </div>
      )}

      {isActive && clientSecret && depositAmount !== null && depositAmount > 0 && (
        <div className="border-t px-5 pb-5 pt-4">
          <PaymentStep
            clientSecret={clientSecret}
            depositAmount={depositAmount}
            initialError={paymentError ? t.checkout_payment_error : undefined}
          />
        </div>
      )}

      {isActive && bookingLoading && (
        <div className="border-t px-5 pb-5 pt-4">
          <p className="text-center text-sm text-muted-foreground">{t.checkout_payment_processing}</p>
        </div>
      )}
    </section>
  )
}
