import Navbar from '@/components/navbar/navbar'
import { PageParamsProps } from '@/lib/types/page.type'
import { PropsWithChildren } from 'react'

type PublicLayoutProps = PageParamsProps & PropsWithChildren

const PublicLayout = ({ children }: PublicLayoutProps) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}

export default PublicLayout
