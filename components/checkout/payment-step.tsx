'use client'

import { useState } from 'react'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import type { Appearance } from '@stripe/stripe-js'
import { useParams } from 'next/navigation'
import { stripePromise } from '@/lib/stripe'
import { useTranslation } from '@/lib/context/translation.context'
import { interpolate } from '@/lib/utils/i18n.utils'
import { AlertCircleIcon, LoaderIcon } from '@/lib/constants/icons'
import { Button } from '@/components/ui/button'

const appearance: Appearance = {
  theme: 'stripe',
  variables: {
    colorPrimary: 'oklch(0.649 0.1064 205.4)',
    colorBackground: 'oklch(1 0 0)',
    colorText: 'oklch(0.145 0 0)',
    colorDanger: 'oklch(0.577 0.245 27.325)',
    fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
    borderRadius: '0.625rem',
    spacingUnit: '4px',
    fontSizeBase: '1.1rem',
  },
  rules: {
    '.Input': {
      border: '1px solid oklch(0.922 0 0)',
      boxShadow: 'none',
      padding: '10px 12px',
      transition: 'border-color 0.15s ease',
    },
    '.Input:focus': {
      border: '1px solid oklch(0.708 0 0)',
      boxShadow: '0 0 0 3px oklch(0.708 0 0 / 0.5)',
    },
    '.Input--invalid': {
      border: '1px solid oklch(0.577 0.245 27.325)',
    },
    '.Label': {
      color: 'oklch(0.145 0 0)',
      fontSize: '14px',
      fontWeight: '500',
      marginBottom: '6px',
    },
    '.Error': {
      color: 'oklch(0.577 0.245 27.325)',
      fontSize: '13px',
    },
  },
}

type PaymentFormProps = {
  depositAmount: number
  initialError?: string | null
  returnPath?: string
  payLabelKey?: 'checkout_pay_with_deposit' | 'checkout_pay_full'
}

function PaymentForm({ depositAmount, initialError, returnPath, payLabelKey }: PaymentFormProps) {
  const t = useTranslation()
  const { lang } = useParams<{ lang: string }>()
  const stripe = useStripe()
  const elements = useElements()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(initialError ?? null)
  const labelKey = payLabelKey ?? 'checkout_pay_with_deposit'

  const handleSubmit = async () => {
    if (!stripe || !elements) return

    setLoading(true)
    setError(null)

    const path = returnPath ?? `/${lang}/checkout/confirm`
    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}${path}`,
      },
    })

    if (stripeError) {
      setError(stripeError.message ?? t.checkout_payment_error)
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      <PaymentElement />

      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-3">
          <AlertCircleIcon className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden="true" />
          <p className="flex-1 text-sm text-destructive">{error}</p>
          <button
            type="button"
            className="text-sm font-medium text-destructive underline underline-offset-2"
            onClick={() => setError(null)}
            aria-label={t.checkout_payment_error_dismiss}
          >
            &times;
          </button>
        </div>
      )}

      <p className="text-xs leading-relaxed text-muted-foreground">
        {t.checkout_policy_text}{' '}
        <button type="button" className="underline underline-offset-2 hover:text-foreground">
          {t.checkout_policy_learn_more}
        </button>
      </p>

      <Button
        className="h-12 w-full rounded-xl text-base font-semibold"
        size="lg"
        disabled={loading || !stripe || !elements}
        onClick={handleSubmit}
      >
        {loading ? (
          <LoaderIcon className="size-5 animate-spin" />
        ) : (
          interpolate(t[labelKey], {
            amount: Math.round(depositAmount),
          })
        )}
      </Button>

      <p className="text-center text-xs text-muted-foreground">{t.checkout_payment_secure}</p>
    </div>
  )
}

type PaymentStepProps = {
  clientSecret: string
  depositAmount: number
  initialError?: string | null
  returnPath?: string
  payLabelKey?: 'checkout_pay_with_deposit' | 'checkout_pay_full'
}

export default function PaymentStep({
  clientSecret,
  depositAmount,
  initialError,
  returnPath,
  payLabelKey,
}: PaymentStepProps) {
  const { lang } = useParams<{ lang: string }>()
  const locale = lang === 'en' ? 'en' : 'it'

  return (
    <Elements stripe={stripePromise} options={{ clientSecret, appearance, locale }}>
      <PaymentForm
        depositAmount={depositAmount}
        initialError={initialError}
        returnPath={returnPath}
        payLabelKey={payLabelKey}
      />
    </Elements>
  )
}
