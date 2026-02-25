import { CheckIcon } from '@/lib/constants/icons'
import { useTranslation } from '@/lib/context/translation.context'
import { interpolate } from '@/lib/utils/i18n.utils'
import { formatCurrency } from '@/core/utils/currency.utils'
import { Button } from '@/components/ui/button'
import ParticipantCounter from '@/components/experience/detail/participant-counter'

type BookingStepParticipantsProps = {
  isPerAsset: boolean
  assetLabel?: string | null
  maxCapacity: number
  adults: number
  children: number
  infants: number
  assetCount: number
  onAdultsChange: (v: number) => void
  onChildrenChange: (v: number) => void
  onInfantsChange: (v: number) => void
  onAssetCountChange: (v: number) => void
  minPrice: number
  pricingMode: string
  onChooseDate: () => void
}

export default function BookingStepParticipants({
  isPerAsset,
  assetLabel,
  maxCapacity,
  adults,
  children,
  infants,
  assetCount,
  onAdultsChange,
  onChildrenChange,
  onInfantsChange,
  onAssetCountChange,
  minPrice,
  pricingMode,
  onChooseDate,
}: BookingStepParticipantsProps) {
  const t = useTranslation()

  const formattedPrice = formatCurrency(minPrice, undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })

  return (
    <>
      <h3 className="mb-1 text-base font-semibold">{t.exp_detail_participants}</h3>

      {isPerAsset ? (
        <div className="divide-y divide-border">
          <ParticipantCounter
            label={assetLabel ?? 'Asset'}
            ageRange=""
            count={assetCount}
            min={1}
            max={maxCapacity}
            onChange={onAssetCountChange}
          />
        </div>
      ) : (
        <div className="divide-y divide-border">
          <ParticipantCounter
            label={t.exp_detail_adults}
            ageRange={t.exp_detail_adults_age}
            count={adults}
            min={1}
            max={Math.max(1, maxCapacity - children - infants)}
            onChange={onAdultsChange}
          />
          <ParticipantCounter
            label={t.exp_detail_children}
            ageRange={t.exp_detail_children_age}
            count={children}
            max={Math.max(0, maxCapacity - adults - infants)}
            onChange={onChildrenChange}
          />
          <ParticipantCounter
            label={t.exp_detail_infants}
            ageRange={t.exp_detail_infants_age}
            count={infants}
            max={Math.max(0, maxCapacity - adults - children)}
            onChange={onInfantsChange}
          />
        </div>
      )}

      {minPrice > 0 && (
        <div className="mt-5">
          <p className="text-lg font-bold">
            {pricingMode === 'PER_ASSET'
              ? interpolate(t.exp_booking_per_asset, { price: formattedPrice, asset: assetLabel ?? '' })
              : pricingMode === 'PER_EXPERIENCE'
                ? interpolate(t.exp_booking_per_experience, { price: formattedPrice })
                : interpolate(t.exp_detail_price_per_person, { price: formattedPrice })}
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-teal-600">
            <CheckIcon className="size-3.5" />
            {t.exp_detail_free_cancellation}
          </p>
        </div>
      )}

      <Button className="mt-5 h-12 w-full text-base font-semibold" size="lg" onClick={onChooseDate}>
        {t.exp_detail_choose_date}
      </Button>
    </>
  )
}
