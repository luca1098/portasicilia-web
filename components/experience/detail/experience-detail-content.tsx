import type { Experience } from '@/lib/schemas/entities/experience.entity.schema'
import ExperienceGallery from '@/components/experience/detail/experience-gallery'
import ExperienceInfo from '@/components/experience/detail/experience-info'
import ExperienceBookingCard from '@/components/experience/detail/experience-booking-card'
import ExperienceMobileBookingBar from '@/components/experience/detail/experience-mobile-booking-bar'
import { CheckIcon } from 'lucide-react'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { SupportedLocale } from '@/lib/configs/locales'

type ExperienceDetailContentProps = {
  experience: Experience
  lang: string
}

export default async function ExperienceDetailContent({ experience, lang }: ExperienceDetailContentProps) {
  const t = await getTranslations(lang as SupportedLocale)
  const galleryImages = experience.images?.map(img => img.url) ?? []
  const tiers = experience.priceLists?.[0]?.tiers
  const price = tiers && tiers.length > 0 ? Math.min(...tiers.map(t => t.baseAmount)) : 0

  return (
    <main className="min-h-screen pb-20 lg:pb-0">
      <section className="mx-auto max-w-7xl px-4 pt-6 md:px-8 lg:flex lg:gap-10">
        {/* Left column: gallery + info */}
        <div className="min-w-0 flex-1">
          <ExperienceGallery images={galleryImages} alt={experience.name} />
          <div className="py-8">
            <ExperienceInfo experience={experience} />
          </div>
        </div>

        {/* Right column: sticky booking card (desktop only) */}
        <aside className="hidden lg:block lg:w-[380px] lg:shrink-0 pb-10">
          <div className="sticky top-24">
            <ExperienceBookingCard experience={experience} />

            {/* policy items */}
            {experience.cancellationTerms.length ? (
              <ul className="mt-5 space-y-2">
                {experience.cancellationTerms.map(item => (
                  <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <CheckIcon className="mt-0.5 size-3 shrink-0" />
                    {item}
                  </li>
                ))}
                <li className="flex items-start gap-2 text-xs text-muted-foreground">
                  <CheckIcon className="mt-0.5 size-3 shrink-0" />
                  {t.secure_with_a_small_deposit}
                </li>
              </ul>
            ) : null}
          </div>
        </aside>
      </section>

      {/* Mobile booking bar */}
      <ExperienceMobileBookingBar price={price} />
    </main>
  )
}
