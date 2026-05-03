import Link from 'next/link'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { SupportedLocale } from '@/lib/configs/locales'
import type { ExperienceCard } from '@/lib/api/experiences'
import { ArrowRight } from '@/lib/constants/icons'
import ExperienceCardItem from '@/components/experience/experience-card-item'

type ShopExperiencesCrossSellProps = {
  lang: string
  experiences: ExperienceCard[]
}

export default async function ShopExperiencesCrossSell({ lang, experiences }: ShopExperiencesCrossSellProps) {
  if (experiences.length === 0) return null

  const t = await getTranslations(lang as SupportedLocale)

  return (
    <section className="bg-background">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-16 md:px-8 md:py-20">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-3">
            <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight text-foreground md:text-4xl">
              {t.shop_experiences_title}
            </h2>
            <p className="max-w-xl text-base text-muted-foreground">{t.shop_experiences_subtitle}</p>
          </div>
          <Link
            href={`/${lang}/experiences`}
            className="group flex w-fit items-center gap-2 text-sm font-semibold text-primary"
          >
            {t.shop_experiences_cta}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {experiences.slice(0, 4).map(experience => (
            <ExperienceCardItem key={experience.id} experience={experience} lang={lang} />
          ))}
        </div>
      </div>
    </section>
  )
}
