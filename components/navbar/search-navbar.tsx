'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { HeartIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import SearchBar from '@/components/search/search-bar'
import LangSwitch from '@/components/navbar/lang-switch'

export default function SearchNavbar() {
  const params = useParams()
  const lang = params.lang as string

  return (
    <>
      {/* Mobile/md: static top bar — lg+: sticky header with inline search */}
      <header className="z-40 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 lg:sticky lg:top-0">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
          <div className="flex flex-1 items-center gap-6">
            <Link href={`/${lang}/`} className="shrink-0 text-lg font-bold">
              PortaSicilia
            </Link>

            <div className="hidden lg:block lg:flex-1">
              <SearchBar shadow={false} size="small" />
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <Button variant="ghost" size="icon" aria-label="Favorites">
              <HeartIcon className="size-5" />
            </Button>
            <LangSwitch />
          </div>
        </div>
      </header>

      {/* Mobile/md only: sticky search bar */}
      <div className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 lg:hidden">
        <div className="mx-auto max-w-7xl px-4 py-2">
          <SearchBar shadow={false} size="small" />
        </div>
      </div>
    </>
  )
}
