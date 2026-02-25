import { CheckIcon } from '@/lib/constants/icons'
import { useTranslation } from '@/lib/context/translation.context'
import { interpolate } from '@/lib/utils/i18n.utils'
import { formatCurrency } from '@/core/utils/currency.utils'
import ParticipantCounter from '@/components/experience/detail/participant-counter'
import { Button } from '@/components/ui/button'

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
  basePrice: number
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
  basePrice,
  pricingMode,
  onChooseDate,
}: BookingStepParticipantsProps) {
  const t = useTranslation()

  const resolvedAssetLabel = assetLabel || t.exp_booking_default_asset_label
  const formattedPrice = formatCurrency(basePrice, undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
  const priceLabel =
    pricingMode === 'PER_ASSET'
      ? interpolate(t.exp_booking_per_asset, { price: formattedPrice, asset: resolvedAssetLabel })
      : pricingMode === 'PER_EXPERIENCE'
        ? interpolate(t.exp_booking_per_experience, { price: formattedPrice })
        : interpolate(t.exp_detail_price_per_person, { price: formattedPrice })

  return (
    <>
      <hr className="border-border" />

      <div className="px-5 py-4">
        <h3 className="mb-2 text-base font-semibold">{t.exp_detail_participants}</h3>

        {isPerAsset ? (
          <div>
            <ParticipantCounter
              label={resolvedAssetLabel}
              ageRange=""
              count={assetCount}
              min={1}
              max={maxCapacity}
              onChange={onAssetCountChange}
            />
          </div>
        ) : (
          <div className="space-y-0">
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
      </div>

      {basePrice > 0 ? (
        <>
          <hr className="border-border" />

          <div className="flex items-end justify-between px-5 py-4">
            <div>
              <p className="text-lg font-bold">{priceLabel}</p>
              <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-primary">
                <CheckIcon className="size-3.5" />
                {t.exp_detail_free_cancellation}
              </p>
            </div>
            <Button type="button" onClick={onChooseDate}>
              {t.exp_detail_choose_date}
            </Button>
          </div>
        </>
      ) : (
        <div className="px-5 pb-5">
          <Button type="button" className="h-12 w-full" onClick={onChooseDate}>
            {t.exp_detail_choose_date}
          </Button>
        </div>
      )}
    </>
  )
}
