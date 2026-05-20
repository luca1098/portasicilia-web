'use client'

import { useState } from 'react'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import type { Appearance, StripeElementLocale } from '@stripe/stripe-js'
import { useParams } from 'next/navigation'
import { stripePromise } from '@/lib/stripe'
import { supportedLocales } from '@/lib/configs/locales'
import { useTranslation } from '@/lib/context/translation.context'
import { interpolate } from '@/lib/utils/i18n.utils'
import { AlertCircleIcon, LoaderIcon } from '@/lib/constants/icons'
import { Button } from '@/components/ui/button'

const appearance: Appearance = {
  labels: 'floating',
  variables: {
    accessibleColorOnColorPrimary: 'oklch(0.9814 0.019 204.85)',
    colorTextSecondary: '#737373',
    colorTextPlaceholder: '#737373',
    accessibleColorOnColorDanger: 'oklch(0.577 0.245 27.325)',
    colorSuccess: '#23c90d',
    iconColor: 'oklch(0.556 0 0)',
    iconHoverColor: 'oklch(0.145 0 0)',
    tabIconColor: 'oklch(0.556 0 0)',
    tabIconHoverColor: 'oklch(0.145 0 0)',
    tabIconSelectedColor: 'oklch(0.649 0.1064 205.4)',
    iconCardCvcColor: 'oklch(0.556 0 0)',
    iconCardErrorColor: 'oklch(0.577 0.245 27.325)',
    iconCheckmarkColor: 'oklch(0.9814 0.019 204.85)',
    iconChevronDownColor: 'oklch(0.556 0 0)',
    iconChevronDownHoverColor: 'oklch(0.145 0 0)',
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSizeBase: '14px',
    fontWeightMedium: '500',
    fontWeightBold: '600',
    fontLineHeight: '1.5',
    borderRadius: '0.875rem',
    spacingUnit: '4px',
    gridRowSpacing: '16px',
    gridColumnSpacing: '12px',
    colorPrimary: '#1aa1ae',
  },
  rules: {
    '.Label': {
      color: 'oklch(0.556 0 0)',
      fontWeight: '400',
      fontSize: '14px',
    },
    '.Label--floating': {
      color: 'oklch(0.556 0 0)',
      fontWeight: '400',
      fontSize: '12px',
    },
    '.Label--resting': {
      color: 'oklch(0.556 0 0)',
      fontWeight: '400',
      fontSize: '14px',
    },
    '.Label--invalid': {
      color: 'oklch(0.577 0.245 27.325)',
    },
    '.Input': {
      backgroundColor: 'oklch(1 0 0)',
      border: '1px solid oklch(0.922 0 0)',
      borderRadius: '0.875rem',
      color: 'oklch(0.145 0 0)',
      fontSize: '14px',
      lineHeight: '1.5',
      transition: 'color 0.15s ease, box-shadow 0.15s ease',
    },
    '.Input:focus': {
      border: '1px solid oklch(0.708 0 0)',
      outline: 'none',
    },
    '.Input:disabled': {
      backgroundColor: 'oklch(0.97 0 0)',
      color: 'oklch(0.556 0 0)',
    },
    '.Input--invalid': {
      border: '1px solid oklch(0.577 0.245 27.325)',
    },
    '.Error': {
      color: 'oklch(0.577 0.245 27.325)',
      fontSize: '14px',
      marginTop: '4px',
    },
    '.Tab': {
      backgroundColor: 'oklch(1 0 0)',
      border: '1px solid oklch(0.922 0 0)',
      borderRadius: '0.875rem',
      padding: '12px 14px',
      transition: 'border-color 0.15s ease, background-color 0.15s ease',
    },
    '.Tab:hover': {
      backgroundColor: 'oklch(0.97 0 0)',
      borderColor: 'oklch(0.708 0 0)',
    },
    '.Tab--selected': {
      backgroundColor: 'oklch(1 0 0)',
      borderColor: 'oklch(0.649 0.1064 205.4)',
      boxShadow: '0 0 0 1px oklch(0.649 0.1064 205.4)',
    },
    '.Tab--selected:focus': {
      borderColor: 'oklch(0.649 0.1064 205.4)',
    },
    '.TabLabel': {
      fontSize: '14px',
      fontWeight: '500',
    },
    '.TabIcon': {
      color: 'oklch(0.556 0 0)',
    },
    '.TabIcon--selected': {
      color: 'oklch(0.649 0.1064 205.4)',
    },
    '.Block': {
      backgroundColor: 'oklch(1 0 0)',
      border: '1px solid oklch(0.922 0 0)',
      borderRadius: '0.875rem',
      boxShadow: 'none',
    },
    '.AccordionItem': {
      backgroundColor: 'oklch(1 0 0)',
      border: '1px solid oklch(0.922 0 0)',
      borderRadius: '0.875rem',
      boxShadow: 'none',
      padding: '14px 16px',
    },
    '.CheckboxInput': {
      backgroundColor: 'oklch(1 0 0)',
      border: '1px solid oklch(0.922 0 0)',
      borderRadius: '0.25rem',
    },
    '.CheckboxInput--checked': {
      backgroundColor: 'oklch(0.649 0.1064 205.4)',
      borderColor: 'oklch(0.649 0.1064 205.4)',
    },
    '.CheckboxLabel': {
      color: 'oklch(0.145 0 0)',
      fontSize: '14px',
    },
    '.PickerItem': {
      backgroundColor: 'oklch(1 0 0)',
      color: 'oklch(0.145 0 0)',
      borderRadius: '0.625rem',
      fontSize: '14px',
    },
    '.PickerItem--highlight': {
      backgroundColor: 'oklch(0.97 0 0)',
    },
    '.PickerItem--selected': {
      backgroundColor: 'oklch(0.649 0.1064 205.4)',
      color: 'oklch(0.9814 0.019 204.85)',
    },
    '.RedirectText': {
      color: 'oklch(0.556 0 0)',
      fontSize: '14px',
    },
    '.Text': {
      color: 'oklch(0.145 0 0)',
      fontSize: '14px',
    },
    '.Text--redirect': {
      color: 'oklch(0.556 0 0)',
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
        <button
          type="button"
          className="font-medium text-primary underline underline-offset-2 transition-colors hover:text-primary/80"
        >
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
  const locale: StripeElementLocale = (supportedLocales as readonly string[]).includes(lang)
    ? (lang as StripeElementLocale)
    : 'auto'

  return (
    <Elements key={locale} stripe={stripePromise} options={{ clientSecret, appearance, locale }}>
      <PaymentForm
        depositAmount={depositAmount}
        initialError={initialError}
        returnPath={returnPath}
        payLabelKey={payLabelKey}
      />
    </Elements>
  )
}
