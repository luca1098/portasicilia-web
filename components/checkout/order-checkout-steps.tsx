'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useTranslation } from '@/lib/context/translation.context'
import { useAction } from '@/lib/hooks/use-action'
import { checkoutOrderAction } from '@/lib/actions/orders.actions'
import { mapBillingToDto } from '@/lib/schemas/forms/billing.form.schema'
import type { BillingFormValues } from '@/lib/schemas/forms/billing.form.schema'
import type { DeliveryFormValues } from '@/lib/schemas/forms/delivery.form.schema'
import type { OrderCheckoutResponse } from '@/lib/api/orders'
import useOrderCheckoutStore, { useOrderCheckoutActions } from '@/core/store/order-checkout.store'
import useCartStore from '@/core/store/cart.store'
import LoginStepSection from '@/components/checkout/login-step-section'
import DeliveryStepSection from '@/components/checkout/delivery-step-section'
import BillingStepSection from '@/components/checkout/billing-step-section'
import PaymentStepSection from '@/components/checkout/payment-step-section'

export default function OrderCheckoutSteps() {
  const t = useTranslation()
  const { lang } = useParams<{ lang: string }>()
  const { data: session } = useSession()

  const orderContext = useOrderCheckoutStore(s => s.orderContext)
  const cartItems = useCartStore(s => s.items)
  const storedBillingData = useOrderCheckoutStore(s => s.billingData)
  const storedDeliveryData = useOrderCheckoutStore(s => s.deliveryData)
  const storedCheckoutRestore = useOrderCheckoutStore(s => s.checkoutRestore)
  const {
    setBillingData: storeBillingData,
    setDeliveryData: storeDeliveryData,
    setCheckoutRestore,
  } = useOrderCheckoutActions()

  const [activeStep, setActiveStep] = useState(session ? 2 : 1)
  const [deliveryData, setDeliveryData] = useState<DeliveryFormValues | null>(null)
  const [billingData, setBillingData] = useState<BillingFormValues | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [checkoutDeposit, setCheckoutDeposit] = useState<number | null>(null)

  const isStep1Complete = !!session
  const isStep2Complete = deliveryData !== null
  const isStep3Complete = billingData !== null

  const effectiveStep = isStep1Complete && activeStep === 1 ? 2 : activeStep
  const isStep2Active = effectiveStep === 2 && isStep1Complete
  const isStep3Active = effectiveStep === 3 && isStep1Complete && isStep2Complete
  const isStep4Active = effectiveStep === 4 && isStep1Complete && isStep2Complete && isStep3Complete

  const { loading: orderLoading, execute: executeCheckout } = useAction<OrderCheckoutResponse>({
    onSuccess: data => {
      if (data?.clientSecret) {
        setClientSecret(data.clientSecret)
        setCheckoutDeposit(Number(data.totalAmount))
        setActiveStep(4)
        setCheckoutRestore({
          totalAmount: Number(data.totalAmount),
          billingData: storedBillingData,
          deliveryData: storedDeliveryData,
          checkoutUrl: window.location.href,
        })
      }
    },
    onError: error => {
      setSubmitError(error)
    },
  })

  const startCheckout = (delivery: DeliveryFormValues, billing: BillingFormValues) => {
    if (!session?.user?.email) return
    if (cartItems.length === 0) return

    setSubmitError(null)

    const billingDto = mapBillingToDto(billing)

    executeCheckout(() =>
      checkoutOrderAction({
        items: cartItems.map(i => ({ variantId: i.variantId, quantity: i.quantity })),
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
        shipping: {
          firstName: billing.firstName,
          lastName: billing.lastName,
          street: delivery.street,
          city: delivery.city,
          zipCode: delivery.zipCode,
          province: delivery.province,
          region: delivery.region,
          country: 'IT',
          notes: delivery.notes || undefined,
        },
      })
    )
  }

  const handleDeliverySubmit = (data: DeliveryFormValues) => {
    setDeliveryData(data)
    storeDeliveryData(data)
    setActiveStep(3)
  }

  const handleBillingSubmit = (data: BillingFormValues) => {
    setBillingData(data)
    storeBillingData(data)
    if (deliveryData) {
      startCheckout(deliveryData, data)
    }
  }

  useEffect(() => {
    if (!orderContext?.paymentError) return
    if (storedCheckoutRestore?.deliveryData && storedCheckoutRestore?.billingData) {
      setDeliveryData(storedCheckoutRestore.deliveryData)
      setBillingData(storedCheckoutRestore.billingData)
      startCheckout(storedCheckoutRestore.deliveryData, storedCheckoutRestore.billingData)
    }
    const url = new URL(window.location.href)
    url.searchParams.delete('payment_error')
    window.history.replaceState({}, '', url.pathname + url.search)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderContext?.paymentError])

  if (!orderContext) return null

  return (
    <div className="space-y-4" role="list" aria-label={t.checkout_steps}>
      <LoginStepSection isActive={effectiveStep === 1} onActivate={() => setActiveStep(1)} />

      <DeliveryStepSection
        stepNumber={2}
        isActive={isStep2Active}
        isEnabled={isStep1Complete}
        isComplete={isStep2Complete}
        deliveryData={deliveryData}
        defaultValues={storedCheckoutRestore?.deliveryData ?? undefined}
        onSubmit={handleDeliverySubmit}
        onEdit={() => setActiveStep(2)}
      />

      <BillingStepSection
        stepNumber={3}
        isActive={isStep3Active}
        isEnabled={isStep1Complete && isStep2Complete}
        isComplete={isStep3Complete}
        billingData={billingData}
        loading={orderLoading}
        defaultValues={storedCheckoutRestore?.billingData ?? undefined}
        onSubmit={handleBillingSubmit}
        onEdit={() => setActiveStep(3)}
      />

      <PaymentStepSection
        stepNumber={4}
        isActive={isStep4Active}
        isEnabled={isStep1Complete && isStep2Complete && isStep3Complete}
        clientSecret={clientSecret}
        depositAmount={checkoutDeposit}
        submitError={submitError}
        bookingLoading={orderLoading}
        paymentError={orderContext.paymentError}
        onDismissError={() => setSubmitError(null)}
        returnPath={`/${lang}/checkout/order/confirm`}
        payLabelKey="checkout_pay_full"
      />
    </div>
  )
}
