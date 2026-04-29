'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Elements, useStripe } from '@stripe/react-stripe-js'
import { stripePromise } from '@/lib/stripe'
import { useTranslation } from '@/lib/context/translation.context'
import { useAction } from '@/lib/hooks/use-action'
import { confirmOrderAction } from '@/lib/actions/orders.actions'
import useOrderCheckoutStore, { useOrderCheckoutActions } from '@/core/store/order-checkout.store'
import { useCartActions } from '@/core/store/cart.store'
import { CheckCircle2Icon, AlertTriangleIcon, LoaderIcon } from '@/lib/constants/icons'
import { Button } from '@/components/ui/button'
import OrderSuccess from '@/components/checkout/order-success'
import type { OrderResponse } from '@/lib/api/orders'

type OrderConfirmContentProps = {
  clientSecret: string
  paymentIntentId: string
  redirectStatus?: string
}

type ConfirmStatus = 'verifying' | 'confirming' | 'succeeded' | 'processing' | 'failed'

function VerifyOrderPayment({
  clientSecret,
  paymentIntentId,
}: {
  clientSecret: string
  paymentIntentId: string
}) {
  const t = useTranslation()
  const { lang } = useParams<{ lang: string }>()
  const stripe = useStripe()

  const [status, setStatus] = useState<ConfirmStatus>('verifying')
  const [confirmedOrder, setConfirmedOrder] = useState<OrderResponse | null>(null)
  const { clearAll } = useOrderCheckoutActions()
  const { clear: clearCart } = useCartActions()
  const checkedRef = useRef(false)

  const { execute: executeConfirm } = useAction<OrderResponse>({
    onSuccess: data => {
      if (data) {
        setConfirmedOrder(data)
      }
      clearCart()
      clearAll()
      setStatus('succeeded')
    },
    onError: () => setStatus('failed'),
  })

  useEffect(() => {
    if (!stripe || !clientSecret || checkedRef.current) return
    checkedRef.current = true

    const verify = async () => {
      const { paymentIntent, error } = await stripe.retrievePaymentIntent(clientSecret)

      if (error || !paymentIntent) {
        setStatus('failed')
        return
      }

      if (paymentIntent.status === 'processing') {
        setStatus('processing')
        return
      }

      if (paymentIntent.status !== 'succeeded') {
        setStatus('failed')
        return
      }

      setStatus('confirming')
      executeConfirm(async () => confirmOrderAction(paymentIntentId))
    }

    verify()
  }, [stripe, clientSecret, paymentIntentId, executeConfirm])

  const isLoading = status === 'verifying' || status === 'confirming'

  if (status === 'succeeded' && confirmedOrder) {
    return <OrderSuccess order={confirmedOrder} />
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      {isLoading && (
        <div className="flex flex-col items-center gap-4">
          <div className="flex size-16 items-center justify-center rounded-full bg-muted">
            <LoaderIcon className="size-8 animate-spin text-muted-foreground" aria-hidden="true" />
          </div>
          <h1 className="text-xl font-bold">{t.checkout_payment_confirm_title}</h1>
          <p className="text-center text-sm text-muted-foreground">{t.checkout_payment_confirm_processing}</p>
        </div>
      )}

      {status === 'succeeded' && !confirmedOrder && (
        <div className="flex flex-col items-center gap-4">
          <div className="flex size-16 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2Icon className="size-9 text-emerald-600" aria-hidden="true" />
          </div>
          <h1 className="text-xl font-bold">{t.checkout_payment_confirm_success}</h1>
          <p className="text-center text-sm text-muted-foreground">{t.checkout_payment_confirm_redirect}</p>
          <Button className="mt-4 h-11 w-full" asChild>
            <Link href={`/${lang}`}>{t.booking_success_back_home}</Link>
          </Button>
        </div>
      )}

      {status === 'processing' && (
        <div className="flex flex-col items-center gap-4">
          <div className="flex size-16 items-center justify-center rounded-full bg-muted">
            <LoaderIcon className="size-8 animate-spin text-muted-foreground" aria-hidden="true" />
          </div>
          <h1 className="text-xl font-bold">{t.checkout_payment_confirm_title}</h1>
          <p className="text-center text-sm text-muted-foreground">{t.checkout_payment_confirm_processing}</p>
        </div>
      )}

      {status === 'failed' && (
        <div className="flex flex-col items-center gap-4">
          <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangleIcon className="size-9 text-destructive" aria-hidden="true" />
          </div>
          <h1 className="text-xl font-bold">{t.checkout_payment_confirm_title}</h1>
          <p className="text-center text-sm text-muted-foreground">{t.checkout_payment_confirm_failed}</p>
          <Button className="mt-4 h-11 w-full" asChild>
            <Link href={`/${lang}`}>{t.booking_success_back_home}</Link>
          </Button>
        </div>
      )}
    </div>
  )
}

function RedirectOnFailure() {
  const { lang } = useParams<{ lang: string }>()
  const router = useRouter()
  const checkoutRestore = useOrderCheckoutStore(s => s.checkoutRestore)

  useEffect(() => {
    if (checkoutRestore?.checkoutUrl) {
      const url = new URL(checkoutRestore.checkoutUrl)
      url.searchParams.set('payment_error', '1')
      router.replace(url.pathname + url.search)
      return
    }
    router.replace(`/${lang}`)
  }, [router, lang, checkoutRestore])

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <div className="flex flex-col items-center gap-4">
        <div className="flex size-16 items-center justify-center rounded-full bg-muted">
          <LoaderIcon className="size-8 animate-spin text-muted-foreground" aria-hidden="true" />
        </div>
      </div>
    </div>
  )
}

export default function OrderConfirmContent({
  clientSecret,
  paymentIntentId,
  redirectStatus,
}: OrderConfirmContentProps) {
  if (redirectStatus === 'failed') {
    return <RedirectOnFailure />
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <VerifyOrderPayment clientSecret={clientSecret} paymentIntentId={paymentIntentId} />
    </Elements>
  )
}
