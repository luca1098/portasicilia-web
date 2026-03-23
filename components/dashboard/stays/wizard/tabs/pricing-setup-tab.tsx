'use client'

import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { CurrencyFormField, NumberFormField } from '@/components/form'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/context/translation.context'
import { useAction } from '@/lib/hooks/use-action'
import { setStayPricingAction } from '@/lib/actions/stays.actions'
import { LoaderIcon } from '@/lib/constants/icons'
import type { Stay } from '@/lib/schemas/entities/stay.entity.schema'
import SeasonalPricingSection from './seasonal-pricing-section'
import type { PriceModifier } from '@/lib/schemas/entities/pricing.entity.schema'

const StayPricingSchema = z.object({
  nightlyRate: z.number().min(0),
  cleaningFee: z.number().min(0),
  extraPersonFee: z.number().min(0),
  baseOccupancy: z.number().int().min(1).nullable(),
})

type StayPricingValues = z.infer<typeof StayPricingSchema>

type StayPricingSetupTabProps = {
  stayId: string
  stay: Stay
  onSaved?: (updated: Stay) => void
}

export default function StayPricingSetupTab({ stayId, stay, onSaved }: StayPricingSetupTabProps) {
  const t = useTranslation() as Record<string, string>

  const existingPriceList = (stay.priceLists ?? [])[0]
  const existingTiers = existingPriceList?.tiers ?? []

  const getNightlyRate = () => {
    const tier = existingTiers.find(t => t.tierType === 'NIGHTLY')
    return tier ? Number(tier.baseAmount) : 0
  }

  const getCleaningFee = () => {
    const tier = existingTiers.find(t => t.tierType === 'CLEANING_FEE')
    return tier ? Number(tier.baseAmount) : 0
  }

  const getExtraPersonFee = () => {
    const tier = existingTiers.find(t => t.tierType === 'EXTRA_PERSON_FEE')
    return tier ? Number(tier.baseAmount) : 0
  }

  const getBaseOccupancy = () => {
    const tier = existingTiers.find(t => t.tierType === 'EXTRA_PERSON_FEE')
    return tier?.minQuantity ?? null
  }

  const maxPeople = stay.stayDetail?.maxPeople ?? stay.maxPeople ?? 0

  const form = useForm<StayPricingValues>({
    resolver: zodResolver(StayPricingSchema),
    defaultValues: {
      nightlyRate: getNightlyRate(),
      cleaningFee: getCleaningFee(),
      extraPersonFee: getExtraPersonFee(),
      baseOccupancy: getBaseOccupancy(),
    },
  })

  const { loading, execute } = useAction<Stay>({
    successMessage: t.admin_stay_pricing_success,
    onSuccess: data => {
      if (data) onSaved?.(data)
    },
  })

  const onSubmit = async (data: StayPricingValues) => {
    if (data.baseOccupancy != null && maxPeople > 1) {
      data.baseOccupancy = Math.max(1, Math.min(data.baseOccupancy, maxPeople - 1))
    }

    const tiers: { tierType: string; baseAmount: number; label: string; minQuantity?: number }[] = [
      { tierType: 'NIGHTLY', baseAmount: data.nightlyRate, label: t.admin_stay_pricing_nightly },
    ]

    if (data.cleaningFee > 0) {
      tiers.push({
        tierType: 'CLEANING_FEE',
        baseAmount: data.cleaningFee,
        label: t.admin_stay_pricing_cleaning,
      })
    }

    if (data.extraPersonFee > 0 && data.baseOccupancy) {
      tiers.push({
        tierType: 'EXTRA_PERSON_FEE',
        baseAmount: data.extraPersonFee,
        label: t.admin_stay_pricing_extra_person,
        minQuantity: data.baseOccupancy,
      })
    }

    await execute(() =>
      setStayPricingAction(stayId, {
        priceListId: existingPriceList?.id,
        tiers,
      })
    )
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-6 space-y-6">
        <div>
          <h3 className="text-sm font-semibold">{t.admin_stay_pricing_title}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{t.admin_stay_pricing_subtitle}</p>
        </div>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <CurrencyFormField<StayPricingValues> name="nightlyRate" label={t.admin_stay_pricing_nightly} />
              <CurrencyFormField<StayPricingValues>
                name="cleaningFee"
                label={t.admin_stay_pricing_cleaning}
              />
              {maxPeople > 1 ? (
                <CurrencyFormField<StayPricingValues>
                  name="extraPersonFee"
                  label={t.admin_stay_pricing_extra_person}
                />
              ) : null}
            </div>

            {maxPeople > 1 ? (
              <NumberFormField<StayPricingValues>
                name="baseOccupancy"
                label={t.admin_stay_pricing_base_occupancy}
                description={t.admin_stay_pricing_base_occupancy_desc}
                min={1}
                max={maxPeople - 1}
                onBlur={() => {
                  const val = form.getValues('baseOccupancy')
                  if (val != null && val > maxPeople - 1) {
                    form.setValue('baseOccupancy', maxPeople - 1)
                  }
                }}
              />
            ) : null}

            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading && <LoaderIcon className="size-4 animate-spin" />}
                {loading ? t.admin_exp_saving : t.admin_exp_save}
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>

      {existingPriceList && (
        <SeasonalPricingSection
          stayId={stayId}
          priceListId={existingPriceList.id}
          modifiers={
            ((existingPriceList as unknown as { modifiers?: PriceModifier[] }).modifiers ?? []).filter(
              m => m.type === 'SEASONAL'
            ) as PriceModifier[]
          }
          onSaved={onSaved}
        />
      )}
    </div>
  )
}
