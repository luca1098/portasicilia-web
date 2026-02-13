'use client'

import Image from 'next/image'
import { Compass } from 'lucide-react'
import { useTranslation } from '@/lib/context/translation.context'
import { Locality } from '@/lib/schemas/entities/locality.entity.schema'
import { interpolate } from '@/lib/utils/i18n.utils'

type LocationPopupProps = {
  onSelect: (location: Locality | null) => void
  onClose: () => void
}

export default function LocationPopup({ onSelect, onClose }: LocationPopupProps) {
  const t = useTranslation()
  const locations: Locality[] = []

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute left-0 top-full z-50 mt-2 w-80 rounded-2xl bg-white p-4 shadow-xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {t.search_suggested_destinations}
        </p>

        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-zinc-100"
          onClick={() => onSelect(null)}
        >
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Compass className="size-5 text-primary" />
          </div>
          <span className="text-sm font-medium">{t.search_everywhere}</span>
        </button>

        {locations.map(location => (
          <button
            key={location.id}
            type="button"
            className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-zinc-100"
            onClick={() => onSelect(location)}
          >
            <div className="relative size-12 shrink-0 overflow-hidden rounded-xl">
              {location.cover && (
                <Image src={location.cover} alt={location.name} fill className="object-cover" sizes="48px" />
              )}
            </div>
            <div className="text-left">
              <p className="text-sm font-medium">{location.name}</p>
              <p className="text-xs text-muted-foreground">
                {interpolate(t.location_card_count, { count: 200 })}
              </p>
            </div>
          </button>
        ))}
      </div>
    </>
  )
}
