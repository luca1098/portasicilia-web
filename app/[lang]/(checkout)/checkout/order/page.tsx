import OrderCheckoutContent from '@/components/checkout/order-checkout-content'

type OrderCheckoutPageProps = {
  searchParams: Promise<{ payment_error?: string }>
}

export default async function OrderCheckoutPage({ searchParams }: OrderCheckoutPageProps) {
  const { payment_error } = await searchParams

  return <OrderCheckoutContent paymentError={payment_error === '1'} />
}
