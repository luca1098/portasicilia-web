import { PageParamsProps } from '@/lib/types/page.type'
import { PropsWithChildren } from 'react'

type DashboardLayoutProps = PageParamsProps & PropsWithChildren

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return <>{children}</>
}

export default DashboardLayout
