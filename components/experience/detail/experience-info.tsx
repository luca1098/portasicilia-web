'use client'

import { MapPin, ClockIcon, TagIcon, InfoIcon } from '@/lib/constants/icons'
import { useTranslation } from '@/lib/context/translation.context'
import { TranslationToggleProvider, useTranslationToggle } from '@/lib/context/translation-toggle.context'
import { interpolate } from '@/lib/utils/i18n.utils'
import type { Experience } from '@/lib/schemas/entities/experience.entity.schema'
import ExperienceExpandableText from '@/components/experience/detail/experience-expandable-text'
import ExperienceItinerary from '@/components/experience/detail/experience-itinerary'
import ExperienceIncluded from '@/components/experience/detail/experience-included'
import ExperienceReviews from '@/components/experience/detail/experience-reviews'
import ExperienceMeetingPoint from '@/components/experience/detail/experience-meeting-point'
import TranslationBadge from '@/components/ui/translation-badge'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'

type ExperienceInfoProps = {
  experience: Experience
}

export default function ExperienceInfo({ experience }: ExperienceInfoProps) {
  return (
    <TranslationToggleProvider translated={experience._translated}>
      <ExperienceInfoContent experience={experience} />
    </TranslationToggleProvider>
  )
}

function ExperienceInfoContent({ experience }: ExperienceInfoProps) {
  const t = useTranslation()
  const { showingOriginal, isTranslated } = useTranslationToggle()

  const originals = experience._originals ?? {}

  const itinerary = experience.itinerary ?? []
  const reviews = experience.reviews ?? []
  const categories = experience.categories ?? []
  const timeSlots = experience.timeSlots ?? []
  const hasItinerary = itinerary.length > 0
  const hasIncluded = experience.included.length > 0 || experience.notIncluded.length > 0
  const hasReviews = reviews.length > 0

  const displayName =
    showingOriginal && isTranslated ? String(originals['name'] ?? experience.name) : experience.name
  const displayDescription =
    showingOriginal && isTranslated
      ? String(originals['description'] ?? experience.description)
      : experience.description
  const displayIncluded =
    showingOriginal && isTranslated
      ? ((originals['included'] as string[] | undefined) ?? experience.included)
      : experience.included
  const displayNotIncluded =
    showingOriginal && isTranslated
      ? ((originals['notIncluded'] as string[] | undefined) ?? experience.notIncluded)
      : experience.notIncluded
  const displayItinerary =
    showingOriginal && isTranslated
      ? ((originals['itinerary'] as typeof itinerary | undefined) ?? itinerary)
      : itinerary

  // Derive duration range from time slots
  const durations = timeSlots.map(s => s.durationInMinutes).filter(d => d > 0)
  const minDuration = durations.length > 0 ? Math.min(...durations) : null
  const maxDuration = durations.length > 0 ? Math.max(...durations) : null

  const formatDurationLabel = (mins: number) => {
    const h = Math.floor(mins / 60)
    const m = mins % 60
    if (h > 0 && m > 0) return `${h}h ${m}min`
    if (h > 0) return `${h}h`
    return `${mins}min`
  }

  const durationLabel =
    minDuration !== null && maxDuration !== null
      ? minDuration === maxDuration
        ? formatDurationLabel(minDuration)
        : `${formatDurationLabel(minDuration)} - ${formatDurationLabel(maxDuration)}`
      : null

  return (
    <div className="space-y-8">
      {/* Location + Duration + Categories metadata */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <MapPin className="size-4" />
          {experience.city}
        </span>
        {durationLabel && (
          <span className="flex items-center gap-1">
            <ClockIcon className="size-4" />
            {durationLabel}
          </span>
        )}
        {categories.length > 0 && (
          <span className="flex items-center gap-1">
            <TagIcon className="size-4" />
            {categories.map(c => c.category.name).join(', ')}
          </span>
        )}
        <button type="button" className="text-sm font-semibold text-primary underline">
          {t.exp_detail_show_map}
        </button>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold md:text-3xl">{displayName}</h1>

      {/* Translation badge */}
      <TranslationBadge />

      {/* Description */}
      <ExperienceExpandableText text={displayDescription} />

      {/* Separator */}
      <hr className="border-border" />

      {/* Itinerary */}
      {hasItinerary && <ExperienceItinerary title={t.exp_detail_what_you_will_do} steps={displayItinerary} />}

      {/* Bad weather policy */}
      {experience.policy.length > 0 && (
        <Popover>
          <PopoverTrigger asChild>
            <button type="button" className="flex items-center gap-2 text-base font-medium">
              <InfoIcon className="size-5" />
              <span className="underline">{t.exp_detail_bad_weather_policy}</span>
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-80">
            <ul className="space-y-1 text-sm">
              {experience.policy.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>
      )}

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
      {hasIncluded && <ExperienceIncluded included={displayIncluded} notIncluded={displayNotIncluded} />}

      {hasIncluded && <hr className="border-border" />}

      {/* Reviews */}
      {hasReviews && <ExperienceReviews reviews={reviews} />}

      {hasReviews && <hr className="border-border" />}

      {/* Meeting point */}
      <ExperienceMeetingPoint experience={experience} />
    </div>
  )
}
