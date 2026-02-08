import SearchNavbar from '@/components/navbar/search-navbar'
import Footer from '@/components/footer/footer'
import { PageParamsProps } from '@/lib/types/page.type'
import { PropsWithChildren } from 'react'

type ListingsLayoutProps = PageParamsProps & PropsWithChildren

const ListingsLayout = ({ children }: ListingsLayoutProps) => {
  return (
    <>
      <SearchNavbar />
      {children}
      <Footer />
    </>
  )
}

export default ListingsLayout
