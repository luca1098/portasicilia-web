'use client'

import { MapPin } from '@/lib/constants/icons'
import { useTranslation } from '@/lib/context/translation.context'
import { interpolate } from '@/lib/utils/i18n.utils'
import type { Stay } from '@/lib/schemas/entities/stay.entity.schema'
import StayHighlights from '@/components/stay/detail/stay-highlights'
import StayExpandableText from '@/components/stay/detail/stay-expandable-text'
import StayAmenities from '@/components/stay/detail/stay-amenities'
import StayReviews from '@/components/stay/detail/stay-reviews'
import StayLocation from '@/components/stay/detail/stay-location'
import StayHouseRules from '@/components/stay/detail/stay-house-rules'

type StayInfoProps = {
  stay: Stay
}

export default function StayInfo({ stay }: StayInfoProps) {
  const t = useTranslation()

  const detail = stay.stayDetail
  const reviews = stay.reviews ?? []
  const amenities = detail?.amenities ?? stay.amenities ?? []
  const hasReviews = reviews.length > 0
  const hasAmenities = amenities.length > 0

  const maxPeople = detail?.maxPeople ?? stay.maxPeople ?? 0
  const beds = detail?.bedNumber ?? stay.bedNumber ?? 0
  const bathrooms = detail?.bathroomNumber ?? stay.bathroomNumber ?? 0

  const cir = detail?.cir ?? stay.cir

  return (
    <div className="space-y-8">
      {/* Location metadata */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <MapPin className="size-4" />
          {stay.city}
        </span>
        <button type="button" className="text-sm font-semibold text-primary underline">
          {t.stay_detail_show_map}
        </button>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold md:text-3xl">{stay.name}</h1>

      {/* Subtitle: guests, beds, bathrooms */}
      <p className="text-sm text-muted-foreground">
        {interpolate(t.stay_detail_guests_count, {
          guests: String(maxPeople),
          beds: String(beds),
          bathrooms: String(bathrooms),
        })}
      </p>

      <hr className="border-border" />

      {/* Highlights */}
      <StayHighlights stay={stay} />

      <hr className="border-border" />

      {/* Description */}
      <StayExpandableText text={stay.description} />

      {/* Registration details (CIR/CIN) */}
      {cir && (
        <p className="text-xs text-muted-foreground">
          {interpolate(t.stay_detail_registration_details, { code: cir })}
        </p>
      )}

      <hr className="border-border" />

      {/* Amenities */}
      {hasAmenities && <StayAmenities amenities={amenities} />}

      {hasAmenities && <hr className="border-border" />}

      {/* Reviews */}
      {hasReviews && <StayReviews reviews={reviews} />}

      {hasReviews && <hr className="border-border" />}

      {/* Location + Map */}
      <StayLocation stay={stay} />

      <hr className="border-border" />

      {/* House rules */}
      <StayHouseRules stay={stay} />
    </div>
  )
}
