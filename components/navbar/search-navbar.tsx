'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import SearchBar from '@/components/search/search-bar'
import NavbarActions from '@/components/navbar/navbar-actions'

export default function SearchNavbar() {
  const params = useParams()
  const lang = params.lang as string

  return (
    <>
      {/* Mobile/md: static top bar — lg+: sticky header with inline search */}
      <header className="z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl backdrop-saturate-150 lg:sticky lg:top-0">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 md:px-6">
          <div className="flex flex-1 items-center gap-12">
            <Link href={`/${lang}/`} className="shrink-0 transition-opacity duration-200 hover:opacity-80">
              <Image src="/logo.png" alt="PortaSicilia" width={50} height={50} />
            </Link>

            <div className="hidden lg:block lg:flex-1">
              <SearchBar shadow={false} size="small" />
            </div>
          </div>

          <div className="shrink-0">
            <NavbarActions />
          </div>
        </div>
      </header>

      {/* Mobile/md only: sticky search bar */}
      <div className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl backdrop-saturate-150 lg:hidden">
        <div className="mx-auto max-w-7xl px-4 py-2">
          <SearchBar shadow={false} size="small" />
        </div>
      </div>
    </>
  )
}
