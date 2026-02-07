import Navbar from '@/components/navbar/navbar'
import { PageParamsProps } from '@/lib/types/page.type'
import { PropsWithChildren } from 'react'

type DashboardLayoutProps = PageParamsProps & PropsWithChildren

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
    </>
  )
}

export default DashboardLayout
