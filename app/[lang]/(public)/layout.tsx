import PublicShell from '@/components/layout/public-shell'
import { PageParamsProps } from '@/lib/types/page.type'
import { PropsWithChildren } from 'react'

type PublicLayoutProps = PageParamsProps & PropsWithChildren

const PublicLayout = ({ children }: PublicLayoutProps) => {
  return <PublicShell>{children}</PublicShell>
}

export default PublicLayout
