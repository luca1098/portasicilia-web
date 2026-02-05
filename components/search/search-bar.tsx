'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter, usePathname, useSearchParams } from 'next/navigation'
import { MapPin, Search } from 'lucide-react'
import { Location, mockLocations } from '@/lib/constants/locations'
import { useTranslation } from '@/lib/context/translation.context'
import LocationPopup from '@/components/search/location-popup'
import TypologyPopup from '@/components/search/typology-popup'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils/shadcn.utils'

type Typology = 'experiences' | 'stays'

type SearchBarProps = {
  shadow?: boolean
  size?: 'default' | 'small'
}

function getInitialTypology(pathname: string): Typology {
  if (pathname.includes('/stays')) return 'stays'
  return 'experiences'
}

function getInitialLocation(locationId: string | null): Location | null {
  if (!locationId) return null
  return mockLocations.find(l => l.id === locationId) ?? null
}

export default function SearchBar({ shadow = true, size = 'default' }: SearchBarProps) {
  const t = useTranslation()
  const router = useRouter()
  const params = useParams()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const lang = params.lang as string

  const [selectedLocation, setSelectedLocation] = useState<Location | null>(() =>
    getInitialLocation(searchParams.get('location'))
  )
  const [selectedTypology, setSelectedTypology] = useState<Typology>(() => getInitialTypology(pathname))
  const [locationOpen, setLocationOpen] = useState(false)
  const [typologyOpen, setTypologyOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setLocationOpen(false)
        setTypologyOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = () => {
    const basePath = `/${lang}/${selectedTypology}`
    const query = selectedLocation ? `?location=${selectedLocation.id}` : ''
    router.push(`${basePath}${query}`)
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <div className={cn(`flex items-center rounded-xl border bg-white pr-1`, shadow ? ' shadow-lg' : '')}>
        {/* Dove? field */}
        <button
          type="button"
          className={cn(
            'flex flex-1 items-center gap-2 rounded-l-xl transition-colors hover:bg-zinc-50',
            size === 'small' ? 'py-2 pl-3 pr-3' : 'py-3 pl-5 pr-4'
          )}
          onClick={() => {
            setLocationOpen(!locationOpen)
            setTypologyOpen(false)
          }}
        >
          <MapPin className="size-4 shrink-0 text-primary" />
          <div className="text-left">
            <p className="text-xs font-semibold text-muted-foreground">{t.search_where}</p>
            <p className="text-sm font-medium">
              {selectedLocation
                ? `${selectedLocation.name}, ${selectedLocation.province}`
                : t.search_everywhere}
            </p>
          </div>
        </button>

        {/* Divider */}
        <div className="h-8 w-px border-r" />

        {/* Tipologia field */}
        <button
          type="button"
          className={cn(
            'flex flex-1 items-center transition-colors hover:bg-zinc-50',
            size === 'small' ? 'py-2 pl-3 pr-3' : 'py-3 pl-5 pr-4'
          )}
          onClick={() => {
            setTypologyOpen(!typologyOpen)
            setLocationOpen(false)
          }}
        >
          <div className="text-left">
            <p className={cn('text-xs font-semibold text-muted-foreground')}>{t.search_typology}</p>
            <p className="text-sm font-medium">
              {selectedTypology === 'experiences' ? t.experiences : t.stays}
            </p>
          </div>
        </button>

        {/* Cerca button */}
        <Button type="button" size={'default'} onClick={handleSearch}>
          <Search className="size-4" />
          {t.search_button}
        </Button>
      </div>

      {/* Popups */}
      {locationOpen && (
        <LocationPopup
          onSelect={location => {
            setSelectedLocation(location)
            setLocationOpen(false)
          }}
          onClose={() => setLocationOpen(false)}
        />
      )}

      {typologyOpen && (
        <TypologyPopup
          onSelect={typology => {
            setSelectedTypology(typology)
            setTypologyOpen(false)
          }}
          onClose={() => setTypologyOpen(false)}
        />
      )}
    </div>
  )
}
