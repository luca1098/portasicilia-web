import Image from 'next/image'
import Link from 'next/link'
import type { Locality } from '@/lib/schemas/entities/locality.entity.schema'

type LocationCardProps = {
  location: Locality
  lang: string
  subtitle: string
  darkBg?: boolean
}

export default function LocationCard({ location, lang, subtitle, darkBg }: LocationCardProps) {
  return (
    <Link href={`/${lang}/location/${location.slug}`} className="group shrink-0 w-full">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
        {location.cover ? (
          <Image
            src={location.cover}
            alt={location.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 208px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <span className="text-muted-foreground text-sm">{location.name}</span>
          </div>
        )}
      </div>
      <div className="mt-2">
        <p className={`text-sm font-bold ${darkBg ? 'text-white' : 'text-foreground'}`}>{location.name}</p>
        <p className={`text-xs ${darkBg ? 'text-white/70' : 'text-muted-foreground'}`}>{subtitle}</p>
      </div>
    </Link>
  )
}
