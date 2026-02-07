import { Nullish } from '@/core/utils/types'
import Image from 'next/image'

type LocationDetailHeroProps = {
  name: string
  cover: Nullish<string>
}

export default function LocationDetailHero({ name, cover }: LocationDetailHeroProps) {
  return (
    <section className="relative flex h-[50vh] items-center justify-center overflow-hidden">
      {cover ? (
        <Image src={cover} alt={name} fill className="object-cover" sizes="100vw" priority />
      ) : (
        <div className="absolute inset-0 bg-muted" />
      )}
      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
      <h1 className="relative z-10 text-4xl font-bold text-white drop-shadow-lg md:text-5xl lg:text-6xl">
        {name}
      </h1>
    </section>
  )
}
