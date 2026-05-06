import ShopSubbar from '@/components/shop/shop-subbar'
import { PropsWithChildren } from 'react'

export default function ShopLayout({ children }: PropsWithChildren) {
  return (
    <>
      <ShopSubbar />
      <div className="pt-11">{children}</div>
    </>
  )
}
