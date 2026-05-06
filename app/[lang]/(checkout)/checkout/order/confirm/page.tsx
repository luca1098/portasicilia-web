import { redirect } from 'next/navigation'
import OrderConfirmContent from '@/components/checkout/order-confirm-content'

type OrderConfirmPageProps = {
  searchParams: Promise<{
    payment_intent?: string
    payment_intent_client_secret?: string
    redirect_status?: string
  }>
  params: Promise<{ lang: string }>
}

export default async function OrderConfirmPage({ searchParams, params }: OrderConfirmPageProps) {
  const [{ lang }, { payment_intent, payment_intent_client_secret, redirect_status }] = await Promise.all([
    params,
    searchParams,
  ])

  if (!payment_intent_client_secret || !payment_intent) {
    redirect(`/${lang}`)
  }

  return (
    <OrderConfirmContent
      clientSecret={payment_intent_client_secret}
      paymentIntentId={payment_intent}
      redirectStatus={redirect_status}
    />
  )
}
