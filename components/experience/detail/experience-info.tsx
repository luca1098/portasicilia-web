'use client'

import { MapPin } from '@/lib/constants/icons'
import { useTranslation } from '@/lib/context/translation.context'
import { interpolate } from '@/lib/utils/i18n.utils'
import type { Experience } from '@/lib/schemas/entities/experience.entity.schema'
import ExperienceExpandableText from '@/components/experience/detail/experience-expandable-text'
import ExperienceItinerary from '@/components/experience/detail/experience-itinerary'
import ExperienceIncluded from '@/components/experience/detail/experience-included'
import ExperienceReviews from '@/components/experience/detail/experience-reviews'
import ExperienceMeetingPoint from '@/components/experience/detail/experience-meeting-point'

type ExperienceInfoProps = {
  experience: Experience
}

export default function ExperienceInfo({ experience }: ExperienceInfoProps) {
  const t = useTranslation()

  const itinerary = experience.itinerary ?? []
  const reviews = experience.reviews ?? []
  const hasItinerary = itinerary.length > 0
  const hasIncluded = experience.included.length > 0 || experience.notIncluded.length > 0
  const hasReviews = reviews.length > 0

  return (
    <div className="space-y-8">
      {/* Location */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <MapPin className="size-4" />
          {experience.city}
        </span>
        <button type="button" className="text-sm font-semibold text-primary underline">
          {t.exp_detail_show_map}
        </button>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold md:text-3xl">{experience.name}</h1>

      {/* Description */}
      <ExperienceExpandableText text={experience.description} />

      {/* Separator */}
      <hr className="border-border" />

      {/* Itinerary */}
      {hasItinerary && <ExperienceItinerary title={t.exp_detail_what_you_will_do} steps={itinerary} />}

      {hasItinerary && <hr className="border-border" />}

      {/* Languages */}
      {experience.languages.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold">{t.exp_detail_languages}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {interpolate(t.exp_detail_languages_available, {
              languages:
                experience.languages.length === 1
                  ? experience.languages[0]
                  : `${experience.languages.slice(0, -1).join(', ')} ${t.exp_detail_languages_and} ${experience.languages[experience.languages.length - 1]}`,
            })}
          </p>
        </div>
      )}

      {/* Separator */}
      <hr className="border-border" />

      {/* What's included */}
      {hasIncluded && (
        <ExperienceIncluded included={experience.included} notIncluded={experience.notIncluded} />
      )}

      {hasIncluded && <hr className="border-border" />}

      {/* Reviews */}
      {hasReviews && <ExperienceReviews reviews={reviews} />}

      {hasReviews && <hr className="border-border" />}

      {/* Meeting point */}
      <ExperienceMeetingPoint experience={experience} />
    </div>
  )
}
