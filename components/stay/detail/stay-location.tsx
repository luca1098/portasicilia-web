'use client'

import { useTranslation } from '@/lib/context/translation.context'
import type { Stay } from '@/lib/schemas/entities/stay.entity.schema'

type StayLocationProps = {
  stay: Stay
}

export default function StayLocation({ stay }: StayLocationProps) {
  const t = useTranslation()

  const { street, city, latitude, longitude } = stay
  const address = `${street}, ${city}`
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
  const embedUrl = `https://www.google.com/maps?q=${latitude},${longitude}&z=14&output=embed`

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold">{t.stay_detail_address}</h2>
      <p className="text-sm font-semibold">{address}</p>
      <a
        href={googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-block text-sm font-semibold text-primary underline"
      >
        {t.stay_detail_open_google_maps}
      </a>
      <div className="mt-4 overflow-hidden rounded-xl">
        <iframe
          title={t.stay_detail_address}
          src={embedUrl}
          className="h-[350px] w-full border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  )
}
