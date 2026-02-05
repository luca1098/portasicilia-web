import SearchNavbar from '@/components/navbar/search-navbar'
import { PageParamsProps } from '@/lib/types/page.type'
import { PropsWithChildren } from 'react'

type ListingsLayoutProps = PageParamsProps & PropsWithChildren

const ListingsLayout = ({ children }: ListingsLayoutProps) => {
  return (
    <>
      <SearchNavbar />
      {children}
    </>
  )
}

export default ListingsLayout
