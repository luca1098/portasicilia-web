'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { signOut, useSession } from 'next-auth/react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from '@/lib/context/translation.context'
import { interpolate } from '@/lib/utils/i18n.utils'
import { UserIcon, CheckIcon, AlertCircleIcon } from '@/lib/constants/icons'
import { Button } from '@/components/ui/button'
import LoginStep from '@/components/checkout/login-step'
import { BillingStep } from '@/components/checkout/billing-step'
import { cn } from '@/lib/utils/shadcn.utils'
import { useAction } from '@/lib/hooks/use-action'
import { createBookingAction } from '@/lib/actions/bookings.actions'
import { mapBillingToDto } from '@/lib/schemas/forms/billing.form.schema'
import type { BookingResponse } from '@/lib/api/bookings'
import {
  createBillingFormSchema,
  billingFormDefaults,
  type BillingFormValues,
} from '@/lib/schemas/forms/billing.form.schema'

type CheckoutStepsProps = {
  depositAmount: number | null
  experienceId: string
  slotId: string
  date: string
  adults: number
  children: number
  infants: number
  assetCount: number
  pricingMode: string
  assetTierType: string
  onBookingSuccess: () => void
}

export type BillingData = BillingFormValues

export default function CheckoutSteps({
  depositAmount,
  experienceId,
  slotId,
  date,
  adults,
  children,
  infants,
  assetCount,
  pricingMode,
  assetTierType,
  onBookingSuccess,
}: CheckoutStepsProps) {
  const t = useTranslation()
  const { data: session } = useSession()

  const [activeStep, setActiveStep] = useState(session ? 2 : 1)
  const [billingData, setBillingData] = useState<BillingFormValues | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const billingSchema = useMemo(
    () => createBillingFormSchema(t.checkout_billing_sdi_or_pec_required),
    [t.checkout_billing_sdi_or_pec_required]
  )

  const billingForm = useForm<BillingFormValues>({
    resolver: zodResolver(billingSchema),
    defaultValues: billingFormDefaults,
    mode: 'onSubmit',
  })

  const isStep1Complete = !!session
  const isStep2Complete = billingData !== null
  const effectiveStep = (() => {
    if (isStep1Complete && activeStep === 1) return 2
    return activeStep
  })()
  const isStep2Active = effectiveStep === 2 && isStep1Complete
  const isStep3Active = effectiveStep === 3 && isStep1Complete && isStep2Complete

  const { loading: bookingLoading, execute: executeBooking } = useAction<BookingResponse>({
    onSuccess: () => {
      onBookingSuccess()
    },
    onError: error => {
      setSubmitError(error)
    },
  })

  const handleBillingSubmit = billingForm.handleSubmit(data => {
    setBillingData(data)
    setActiveStep(3)
  })

  const handleBookingSubmit = () => {
    if (!billingData || !session?.user?.email) return

    setSubmitError(null)

    const billingDto = mapBillingToDto(billingData)

    const isAssetMode = pricingMode === 'PER_ASSET'

    const participants = isAssetMode
      ? undefined
      : [
          ...(adults > 0 ? [{ type: 'ADULT' as const, quantity: adults }] : []),
          ...(children > 0 ? [{ type: 'CHILD' as const, quantity: children }] : []),
          ...(infants > 0 ? [{ type: 'INFANT' as const, quantity: infants }] : []),
        ]

    const assets = isAssetMode ? [{ type: assetTierType, quantity: assetCount }] : undefined

    executeBooking(() =>
      createBookingAction({
        experienceId,
        date,
        timeSlotId: slotId,
        participants,
        assets,
        contactEmail: session.user.email,
        contactPhone: billingDto.contactPhone,
        billing: {
          firstName: billingDto.firstName,
          lastName: billingDto.lastName,
          street: billingDto.street,
          city: billingDto.city,
          zipCode: billingDto.zipCode,
          province: billingDto.province,
          country: billingDto.country,
          fiscalCode: billingDto.fiscalCode,
          vatNumber: billingDto.vatNumber,
          billingType: billingDto.billingType,
          companyName: billingDto.companyName,
          recipientCode: billingDto.recipientCode,
          pecEmail: billingDto.pecEmail,
        },
      })
    )
  }

  return (
    <div className="space-y-4" role="list" aria-label={t.checkout_steps}>
      {/* Step 1: Login */}
      <section
        className="rounded-xl border bg-background"
        role="listitem"
        aria-current={effectiveStep === 1 ? 'step' : undefined}
      >
        {isStep1Complete ? (
          <div className="flex items-center gap-4 p-5">
            {session?.user?.avatar ? (
              <Image
                src={session.user.avatar}
                alt=""
                width={44}
                height={44}
                className="size-11 rounded-full object-cover"
              />
            ) : (
              <span className="flex size-11 items-center justify-center rounded-full bg-muted">
                <UserIcon className="size-5 text-muted-foreground" />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-base font-semibold">
                {[session?.user?.firstName, session?.user?.lastName].filter(Boolean).join(' ') ||
                  session?.user?.email}
              </p>
              {session?.user?.firstName && (
                <p className="truncate text-sm text-muted-foreground">{session?.user?.email}</p>
              )}
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => signOut({ callbackUrl: window.location.href })}
            >
              {t.checkout_change_account}
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    'flex size-7 items-center justify-center rounded-full text-sm font-semibold',
                    effectiveStep === 1
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  )}
                  aria-hidden="true"
                >
                  1
                </span>
                <h2 className="text-base font-semibold">{t.checkout_step_login}</h2>
              </div>
              {effectiveStep !== 1 && (
                <Button size="sm" onClick={() => setActiveStep(1)}>
                  {t.checkout_continue}
                </Button>
              )}
            </div>
            {effectiveStep === 1 && (
              <div className="border-t px-5 pb-5 pt-4">
                <LoginStep />
              </div>
            )}
          </>
        )}
      </section>

      {/* Step 2: Billing Information */}
      <section
        className={cn(
          'rounded-xl border bg-background transition-opacity',
          !isStep1Complete && 'pointer-events-none opacity-50'
        )}
        role="listitem"
        aria-current={effectiveStep === 2 ? 'step' : undefined}
      >
        {isStep2Complete && effectiveStep !== 2 ? (
          <div className="flex items-center justify-between p-5">
            <div className="flex items-center gap-3">
              <span className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <CheckIcon className="size-4" />
              </span>
              <div>
                <h2 className="text-base font-semibold">{t.checkout_step_billing}</h2>
                <p className="text-sm text-muted-foreground">
                  {billingData.firstName} {billingData.lastName}
                  {billingData.billingType === 'COMPANY' && billingData.companyName
                    ? ` - ${billingData.companyName}`
                    : ''}
                </p>
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={() => setActiveStep(2)}>
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
                    isStep2Active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  )}
                  aria-hidden="true"
                >
                  2
                </span>
                <h2 className="text-base font-semibold">{t.checkout_step_billing}</h2>
              </div>
            </div>
            {isStep2Active && (
              <FormProvider {...billingForm}>
                <div className="border-t px-5 pb-5 pt-4">
                  <BillingStep />
                  <Button className="mt-5 w-full" onClick={handleBillingSubmit}>
                    {t.checkout_continue}
                  </Button>
                </div>
              </FormProvider>
            )}
          </>
        )}
      </section>

      {/* Step 3: Payment method */}
      <section
        className={cn(
          'rounded-xl border bg-background transition-opacity',
          (!isStep1Complete || !isStep2Complete) && 'pointer-events-none opacity-50'
        )}
        role="listitem"
        aria-current={effectiveStep === 3 ? 'step' : undefined}
      >
        <div className="flex items-center gap-3 p-5">
          <span
            className={cn(
              'flex size-7 items-center justify-center rounded-full text-sm font-semibold',
              isStep3Active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            )}
            aria-hidden="true"
          >
            3
          </span>
          <h2 className="text-base font-semibold">{t.checkout_step_payment}</h2>
        </div>
        {isStep3Active && submitError && (
          <div className="mx-5 mb-4 flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-3">
            <AlertCircleIcon className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden="true" />
            <p className="flex-1 text-sm text-destructive">{submitError}</p>
            <button
              type="button"
              className="text-sm font-medium text-destructive underline underline-offset-2"
              onClick={() => setSubmitError(null)}
              aria-label={t.checkout_payment_error_dismiss}
            >
              &times;
            </button>
          </div>
        )}
      </section>

      {isStep3Active && (
        <div className="mt-2">
          <p className="text-xs leading-relaxed text-muted-foreground">
            {t.checkout_policy_text}{' '}
            <button type="button" className="underline underline-offset-2 hover:text-foreground">
              {t.checkout_policy_learn_more}
            </button>
          </p>

          {depositAmount !== null && depositAmount > 0 && (
            <Button
              className="mt-4 h-12 w-full rounded-xl text-base font-semibold"
              size="lg"
              disabled={bookingLoading}
              onClick={handleBookingSubmit}
            >
              {bookingLoading
                ? '...'
                : interpolate(t.checkout_pay_with_deposit, {
                    amount: Math.round(depositAmount),
                  })}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
