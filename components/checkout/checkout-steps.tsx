'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useTranslation } from '@/lib/context/translation.context'
import { useAction } from '@/lib/hooks/use-action'
import { checkoutAction } from '@/lib/actions/bookings.actions'
import { mapBillingToDto } from '@/lib/schemas/forms/billing.form.schema'
import type { BillingFormValues } from '@/lib/schemas/forms/billing.form.schema'
import type { CheckoutResponse } from '@/lib/api/bookings'
import useCheckoutStore, { useCheckoutActions } from '@/core/store/checkout.store'
import LoginStepSection from '@/components/checkout/login-step-section'
import BillingStepSection from '@/components/checkout/billing-step-section'
import PaymentStepSection from '@/components/checkout/payment-step-section'

export default function CheckoutSteps() {
  const t = useTranslation()
  const { data: session } = useSession()

  const bookingContext = useCheckoutStore(s => s.bookingContext)
  const storedBillingData = useCheckoutStore(s => s.billingData)
  const storedCheckoutRestore = useCheckoutStore(s => s.checkoutRestore)
  const { setBillingData: storeBillingData, setCheckoutRestore } = useCheckoutActions()

  const [activeStep, setActiveStep] = useState(session ? 2 : 1)
  const [billingData, setBillingData] = useState<BillingFormValues | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [checkoutDeposit, setCheckoutDeposit] = useState<number | null>(null)

  const isStep1Complete = !!session
  const isStep2Complete = billingData !== null
  const effectiveStep = isStep1Complete && activeStep === 1 ? 2 : activeStep
  const isStep2Active = effectiveStep === 2 && isStep1Complete
  const isStep3Active = effectiveStep === 3 && isStep1Complete && isStep2Complete

  const { loading: bookingLoading, execute: executeCheckout } = useAction<CheckoutResponse>({
    onSuccess: data => {
      if (data?.clientSecret) {
        setClientSecret(data.clientSecret)
        setCheckoutDeposit(Number(data.depositAmount))
        setActiveStep(3)
        setCheckoutRestore({
          depositAmount: Number(data.depositAmount),
          billingData: storedBillingData,
          checkoutUrl: window.location.href,
        })
      }
    },
    onError: error => {
      setSubmitError(error)
    },
  })

  const startCheckout = (data: BillingFormValues) => {
    if (!session?.user?.email || !bookingContext) return

    setSubmitError(null)

    const billingDto = mapBillingToDto(data)
    const {
      listingType,
      listingId,
      date,
      dateTo,
      slotId,
      adults,
      children,
      infants,
      assetCount,
      pricingMode,
      assetTierType,
    } = bookingContext

    const isStay = listingType === 'STAY'
    const isAssetMode = pricingMode === 'PER_ASSET'

    const participants = isAssetMode
      ? undefined
      : [
          ...(adults > 0 ? [{ type: 'ADULT' as const, quantity: adults }] : []),
          ...(children > 0 ? [{ type: 'CHILD' as const, quantity: children }] : []),
          ...(infants > 0 ? [{ type: 'INFANT' as const, quantity: infants }] : []),
        ]

    const assets = isAssetMode ? [{ type: assetTierType, quantity: assetCount }] : undefined

    executeCheckout(() =>
      checkoutAction({
        listingId,
        date,
        dateTo: isStay ? dateTo : undefined,
        timeSlotId: isStay ? undefined : slotId,
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

  const handleBillingSubmit = (data: BillingFormValues) => {
    setBillingData(data)
    storeBillingData(data)
    startCheckout(data)
  }

  useEffect(() => {
    if (!bookingContext?.paymentError) return
    if (storedCheckoutRestore?.billingData) {
      setBillingData(storedCheckoutRestore.billingData)
      startCheckout(storedCheckoutRestore.billingData)
    }
    const url = new URL(window.location.href)
    url.searchParams.delete('payment_error')
    window.history.replaceState({}, '', url.pathname + url.search)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingContext?.paymentError])

  if (!bookingContext) return null

  return (
    <div className="space-y-4" role="list" aria-label={t.checkout_steps}>
      <LoginStepSection isActive={effectiveStep === 1} />

      <BillingStepSection
        isActive={isStep2Active}
        isEnabled={isStep1Complete}
        isComplete={isStep2Complete}
        billingData={billingData}
        loading={bookingLoading}
        defaultValues={storedCheckoutRestore?.billingData ?? undefined}
        onSubmit={handleBillingSubmit}
        onEdit={() => setActiveStep(2)}
      />

      <PaymentStepSection
        isActive={isStep3Active}
        isEnabled={isStep1Complete && isStep2Complete}
        clientSecret={clientSecret}
        depositAmount={checkoutDeposit}
        submitError={submitError}
        bookingLoading={bookingLoading}
        paymentError={bookingContext.paymentError}
        onDismissError={() => setSubmitError(null)}
      />
    </div>
  )
}
