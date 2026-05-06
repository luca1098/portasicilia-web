import { CheckIcon } from '@/lib/constants/icons'
import { useTranslation } from '@/lib/context/translation.context'
import { interpolate } from '@/lib/utils/i18n.utils'
import { formatCurrency } from '@/core/utils/currency.utils'
import ParticipantCounter from '@/components/experience/detail/participant-counter'
import { Button } from '@/components/ui/button'
import { useBookingContext } from './booking-context'

export default function BookingStepParticipants() {
  const {
    isPerAsset,
    experience,
    maxCapacity,
    adults,
    children,
    infants,
    assetCount,
    setAdults,
    setChildren,
    setInfants,
    setAssetCount,
    basePrice,
    pricingMode,
    handleChooseDate,
  } = useBookingContext()
  const t = useTranslation()

  const assetLabel = experience.assetLabel
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
              onChange={setAssetCount}
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
              onChange={setAdults}
            />
            <ParticipantCounter
              label={t.exp_detail_children}
              ageRange={t.exp_detail_children_age}
              count={children}
              max={Math.max(0, maxCapacity - adults - infants)}
              onChange={setChildren}
            />
            <ParticipantCounter
              label={t.exp_detail_infants}
              ageRange={t.exp_detail_infants_age}
              count={infants}
              max={Math.max(0, maxCapacity - adults - children)}
              onChange={setInfants}
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
            <Button type="button" onClick={handleChooseDate}>
              {t.exp_detail_choose_date}
            </Button>
          </div>
        </>
      ) : (
        <div className="px-5 pb-5">
          <Button type="button" className="h-12 w-full" onClick={handleChooseDate}>
            {t.exp_detail_choose_date}
          </Button>
        </div>
      )}
    </>
  )
}
