'use client'
import Image from 'next/image'
import Link from 'next/link'
import { HeartIcon, StarIcon } from 'lucide-react'
import { Experience } from '@/lib/constants/experiences'
import { cn } from '@/lib/utils/shadcn.utils'
import { formatCurrency } from '@/core/utils/currency.utils'
import { useTranslation } from '@/lib/context/translation.context'
import { interpolate } from '@/lib/utils/i18n.utils'

type ExperienceCardProps = {
  experience: Experience
  lang: string
  categoryLabel: string
}

export default function ExperienceCard({ experience, lang, categoryLabel }: ExperienceCardProps) {
  const t = useTranslation()
  return (
    <Link href={`/${lang}/experiences/${experience.id}`} className="group w-full shrink-0">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
        <Image
          src={experience.image}
          alt={experience.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 208px"
        />

        <span
          className={cn(
            'absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-semibold bg-white/90'
          )}
        >
          {categoryLabel}
        </span>

        <button
          type="button"
          className="absolute right-2 top-2 rounded-full p-1 text-white transition-colors hover:text-red-400"
          onClick={e => e.preventDefault()}
          aria-label="Save"
        >
          <HeartIcon className="size-5" />
        </button>

        <span className="absolute bottom-2 left-2 rounded-md bg-black/60 px-1.5 py-0.5 text-[11px] font-medium text-white">
          {experience.duration}
        </span>

        <span className="absolute bottom-2 right-2 flex items-center gap-0.5 rounded-md bg-black/60 px-1.5 py-0.5 text-[11px] font-medium text-white">
          <StarIcon className="size-3 fill-white" />
          {experience.rating}
        </span>
      </div>

      <div className="mt-2">
        <p className="line-clamp-2 text-sm font-medium text-foreground">{experience.title}</p>

        <p className="mt-0.5 text-xs text-muted-foreground">
          {interpolate(t.experience_price, { price: formatCurrency(experience.price) })}
        </p>
      </div>
    </Link>
  )
}
