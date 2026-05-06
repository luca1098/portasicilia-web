import { redirect } from 'next/navigation'
import ConfirmContent from '@/components/checkout/confirm-content'

type ConfirmPageProps = {
  searchParams: Promise<{
    payment_intent?: string
    payment_intent_client_secret?: string
    redirect_status?: string
  }>
  params: Promise<{ lang: string }>
}

export default async function ConfirmPage({ searchParams, params }: ConfirmPageProps) {
  const [{ lang }, { payment_intent, payment_intent_client_secret, redirect_status }] = await Promise.all([
    params,
    searchParams,
  ])

  if (!payment_intent_client_secret || !payment_intent) {
    redirect(`/${lang}`)
  }

  return (
    <ConfirmContent
      clientSecret={payment_intent_client_secret}
      paymentIntentId={payment_intent}
      redirectStatus={redirect_status}
    />
  )
}
