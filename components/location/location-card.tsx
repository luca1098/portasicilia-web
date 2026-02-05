import Image from 'next/image'
import Link from 'next/link'
import { Location } from '@/lib/constants/locations'

type LocationCardProps = {
  location: Location
  lang: string
  subtitle: string
  darkBg?: boolean
}

export default function LocationCard({ location, lang, subtitle, darkBg }: LocationCardProps) {
  return (
    <Link href={`/${lang}/location/${location.id}`} className="group shrink-0 w-full">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
        <Image
          src={location.image}
          alt={location.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 208px"
        />
      </div>
      <div className="mt-2">
        <p className={`text-sm font-bold ${darkBg ? 'text-white' : 'text-foreground'}`}>
          {location.name}, {location.province}
        </p>
        <p className={`text-xs ${darkBg ? 'text-white/70' : 'text-muted-foreground'}`}>
          {location.activitiesCount}+ {subtitle}
        </p>
      </div>
    </Link>
  )
}
