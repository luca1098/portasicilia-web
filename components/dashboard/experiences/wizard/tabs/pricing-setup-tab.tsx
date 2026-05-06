'use client'

import { useEffect, useMemo, useState } from 'react'
import { FormProvider, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { NumberFormField } from '@/components/form/number-form-field'
import { CurrencyFormField } from '@/components/form'
import { useTranslation } from '@/lib/context/translation.context'
import { useAction } from '@/lib/hooks/use-action'
import { setPricingAction } from '@/lib/actions/experiences.actions'
import { interpolate } from '@/lib/utils/i18n.utils'
import { LoaderIcon, PlusIcon, Trash2Icon, AlertCircleIcon } from '@/lib/constants/icons'
import { cn } from '@/lib/utils/shadcn.utils'
import {
  createDefaultPricingSchema,
  PRICING_MODES,
  PARTICIPANT_TYPES,
} from '@/lib/schemas/forms/pricing-tab.form.schema'
import type { DefaultPricingValues } from '@/lib/schemas/forms/pricing-tab.form.schema'
import type { Experience } from '@/lib/schemas/entities/experience.entity.schema'

type PricingSetupTabProps = {
  experienceId: string
  experience?: Experience
  onSaved?: (updated: Experience) => void
}

export default function PricingSetupTab({ experienceId, experience, onSaved }: PricingSetupTabProps) {
  const t = useTranslation() as Record<string, string>
  const hasTimeSlots = (experience?.timeSlots ?? []).length > 0
  const capacityMode = experience?.capacityMode ?? 'PER_PERSON'
  const isPerAsset = capacityMode === 'PER_ASSET'

  const [pricingMode, setPricingMode] = useState<(typeof PRICING_MODES)[number]>(() => {
    if (isPerAsset) return 'PER_ASSET'
    return experience?.pricingMode ?? 'PER_PERSON'
  })

  const hasExistingValues = useMemo(
    () =>
      (experience?.priceLists ?? []).some(pl => (pl.tiers ?? []).some(tier => Number(tier.baseAmount) > 0)),
    [experience?.priceLists]
  )

  if (!hasTimeSlots) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30">
        <AlertCircleIcon className="size-5 shrink-0 text-amber-600 dark:text-amber-400" />
        <div>
          <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
            {t.admin_wizard_pricing_no_slots}
          </p>
          <p className="text-xs text-amber-600 dark:text-amber-400">{t.admin_wizard_pricing_no_slots_hint}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {!isPerAsset && (
        <PricingModeSelector
          pricingMode={pricingMode}
          onPricingModeChange={setPricingMode}
          hasExistingValues={hasExistingValues}
        />
      )}

      <DefaultPricingForm
        experienceId={experienceId}
        experience={experience}
        pricingMode={pricingMode}
        onSaved={onSaved}
      />
    </div>
  )
}

// ==================== Default Pricing Form ====================

type DefaultPricingFormProps = {
  experienceId: string
  experience?: Experience
  pricingMode: (typeof PRICING_MODES)[number]
  onSaved?: (updated: Experience) => void
}

function DefaultPricingForm({ experienceId, experience, pricingMode, onSaved }: DefaultPricingFormProps) {
  const t = useTranslation() as Record<string, string>
  const capacityMode = experience?.capacityMode ?? 'PER_PERSON'
  const isPerAsset = capacityMode === 'PER_ASSET'
  const maxCapacity = experience?.maxCapacity

  const existingPriceList = (experience?.priceLists ?? [])[0]
  const existingTiers = (existingPriceList?.tiers ?? []).map(tier => ({
    ...(tier.id ? { id: tier.id } : {}),
    tierType: tier.tierType,
    label: tier.label ?? '',
    baseAmount: Number(tier.baseAmount) || 0,
    ...(tier.minQuantity != null ? { minQuantity: Number(tier.minQuantity) } : {}),
    ...(tier.maxQuantity != null ? { maxQuantity: Number(tier.maxQuantity) } : {}),
  }))

  const defaultTiers = isPerAsset
    ? existingTiers.length > 0
      ? existingTiers
      : [{ tierType: 'ASSET', label: '', baseAmount: 0 }]
    : existingTiers.length > 0
      ? existingTiers
      : pricingMode === 'PER_EXPERIENCE'
        ? [{ tierType: 'EXPERIENCE', label: '', baseAmount: 0, minQuantity: 1 }]
        : [{ tierType: 'ADULT', label: '', baseAmount: 0 }]

  const schema = useMemo(() => createDefaultPricingSchema(maxCapacity), [maxCapacity])

  const form = useForm<DefaultPricingValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      pricingMode,
      priceTiers: defaultTiers,
    },
  })

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form

  const {
    fields: tierFields,
    append: appendTier,
    remove: removeTier,
    replace: replaceTiers,
  } = useFieldArray({ control, name: 'priceTiers' })

  const { loading: saving, execute } = useAction<Experience>({
    successMessage: t.admin_exp_update_success,
    onSuccess: data => {
      if (data) onSaved?.(data)
    },
  })

  // Sync form pricingMode with the top-level prop
  useEffect(() => {
    const currentMode = form.getValues('pricingMode')
    if (currentMode !== pricingMode) {
      form.setValue('pricingMode', pricingMode, { shouldValidate: true })
      if (pricingMode === 'PER_PERSON') {
        replaceTiers([{ tierType: 'ADULT', label: '', baseAmount: 0 }])
      } else if (pricingMode === 'PER_EXPERIENCE') {
        replaceTiers([{ tierType: 'EXPERIENCE', label: '', baseAmount: 0, minQuantity: 1 }])
      } else if (pricingMode === 'PER_ASSET') {
        replaceTiers([{ tierType: 'ASSET', label: '', baseAmount: 0 }])
      }
    }
  }, [pricingMode, form, replaceTiers])

  // Re-validate existing tiers when maxCapacity changes
  useEffect(() => {
    if (maxCapacity != null) {
      form.trigger('priceTiers')
    }
  }, [maxCapacity, form])

  const onSubmit = async (data: DefaultPricingValues) => {
    const tiersToSave = data.priceTiers.filter(tier => tier.tierType && tier.baseAmount >= 0)

    await execute(() =>
      setPricingAction(experienceId, {
        priceListId: existingPriceList?.id,
        pricingMode: data.pricingMode,
        tiers: tiersToSave,
      })
    )
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-6 space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold">{t.admin_wizard_pricing_default_title}</h3>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{t.admin_wizard_pricing_default_hint}</p>
      </div>

      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {isPerAsset ? (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">{t.admin_wizard_pricing_per_asset_title}</h4>
              <div className="max-w-xs">
                <CurrencyFormField<DefaultPricingValues>
                  name="priceTiers.0.baseAmount"
                  label={t.admin_wizard_price_eur}
                />
              </div>
            </div>
          ) : (
            <TierEditor
              control={control}
              form={form}
              errors={errors}
              tiers={tierFields}
              appendTier={appendTier}
              removeTier={removeTier}
              maxCapacity={maxCapacity}
            />
          )}

          {Object.keys(errors).length > 0 && (
            <div
              role="alert"
              className="flex items-center gap-3 rounded-xl border border-destructive/50 bg-destructive/5 p-4"
            >
              <AlertCircleIcon className="size-5 shrink-0 text-destructive" />
              <p className="text-sm text-destructive">{t.admin_wizard_pricing_validation_error}</p>
            </div>
          )}

          <div className="flex justify-end">
            <Button type="submit" disabled={saving} className="w-full sm:w-auto">
              {saving && <LoaderIcon className="size-4 animate-spin" />}
              {saving ? t.admin_exp_saving : t.admin_exp_save}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}

// ==================== Shared Pricing Mode Selector ====================

type PricingModeSelectorProps = {
  pricingMode: (typeof PRICING_MODES)[number]
  onPricingModeChange: (mode: (typeof PRICING_MODES)[number]) => void
  hasExistingValues: boolean
}

function PricingModeSelector({
  pricingMode,
  onPricingModeChange,
  hasExistingValues,
}: PricingModeSelectorProps) {
  const t = useTranslation() as Record<string, string>
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingMode, setPendingMode] = useState<(typeof PRICING_MODES)[number] | null>(null)

  const modes = [
    {
      value: 'PER_EXPERIENCE' as const,
      label: t.admin_wizard_pricing_per_experience_option,
      hint: t.admin_wizard_pricing_per_experience_option_hint,
    },
    {
      value: 'PER_PERSON' as const,
      label: t.admin_wizard_pricing_per_person_option,
      hint: t.admin_wizard_pricing_per_person_option_hint,
    },
  ]

  const handlePricingModeChange = (mode: (typeof PRICING_MODES)[number]) => {
    if (mode === pricingMode) return

    if (hasExistingValues) {
      setPendingMode(mode)
      setConfirmOpen(true)
    } else {
      onPricingModeChange(mode)
    }
  }

  const handleConfirmSwitch = () => {
    if (pendingMode) {
      onPricingModeChange(pendingMode)
    }
    setConfirmOpen(false)
    setPendingMode(null)
  }

  const handleCancelSwitch = () => {
    setConfirmOpen(false)
    setPendingMode(null)
  }

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold">{t.admin_wizard_pricing_mode}</h4>
      <div
        role="radiogroup"
        aria-label={t.admin_wizard_pricing_mode}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
      >
        {modes.map(mode => {
          const isSelected = pricingMode === mode.value
          return (
            <label
              key={mode.value}
              className={cn(
                'flex items-center gap-3 cursor-pointer rounded-xl border-2 p-4 transition-colors',
                isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground/50'
              )}
            >
              <input
                type="radio"
                name="pricingModeRadio"
                value={mode.value}
                checked={isSelected}
                onChange={() => handlePricingModeChange(mode.value)}
                className="sr-only"
              />
              <div
                className={cn(
                  'size-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors',
                  isSelected ? 'border-primary' : 'border-muted-foreground/40'
                )}
                role="radio"
                aria-checked={isSelected}
              >
                {isSelected && <div className="size-2.5 rounded-full bg-primary" />}
              </div>
              <div>
                <span className="text-sm font-medium">{mode.label}</span>
                <span className="block text-xs text-muted-foreground">{mode.hint}</span>
              </div>
            </label>
          )
        })}
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.admin_wizard_pricing_confirm_switch_title}</AlertDialogTitle>
            <AlertDialogDescription>{t.admin_wizard_pricing_confirm_switch_body}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelSwitch}>
              {t.admin_wizard_pricing_confirm_switch_cancel}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSwitch}>
              {t.admin_wizard_pricing_confirm_switch_confirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// ==================== Shared Tier Editor ====================

type TierEditorProps = {
  control: ReturnType<typeof useForm<DefaultPricingValues>>['control']
  form: ReturnType<typeof useForm<DefaultPricingValues>>
  errors: ReturnType<typeof useForm<DefaultPricingValues>>['formState']['errors']
  tiers: ReturnType<typeof useFieldArray<DefaultPricingValues, 'priceTiers'>>['fields']
  appendTier: ReturnType<typeof useFieldArray<DefaultPricingValues, 'priceTiers'>>['append']
  removeTier: ReturnType<typeof useFieldArray<DefaultPricingValues, 'priceTiers'>>['remove']
  maxCapacity?: number
}

function TierEditor({ control, form, errors, tiers, appendTier, removeTier, maxCapacity }: TierEditorProps) {
  const t = useTranslation() as Record<string, string>
  const pricingMode = useWatch({ control, name: 'pricingMode' })

  const handleAddParticipantType = (type: string) => {
    if (!tiers.some(tier => tier.tierType === type)) {
      appendTier({ tierType: type, label: '', baseAmount: 0 })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">{t.admin_wizard_prices}</h4>
        {pricingMode === 'PER_EXPERIENCE' && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => {
              const lastTier = tiers[tiers.length - 1]
              const lastMax = lastTier ? form.getValues(`priceTiers.${tiers.length - 1}.maxQuantity`) : 0
              appendTier({
                tierType: 'EXPERIENCE',
                label: '',
                baseAmount: 0,
                minQuantity: lastMax ? lastMax + 1 : 1,
              })
            }}
          >
            <PlusIcon className="size-4" />
            {t.admin_wizard_add_quantity_range}
          </Button>
        )}
      </div>

      {errors.priceTiers?.message && <p className="text-sm text-destructive">{errors.priceTiers.message}</p>}

      {pricingMode === 'PER_PERSON' && (
        <div className="flex flex-wrap gap-2">
          {PARTICIPANT_TYPES.map(type => {
            const alreadyAdded = tiers.some(tier => tier.tierType === type)
            return (
              <Button
                key={type}
                type="button"
                size="sm"
                variant={alreadyAdded ? 'secondary' : 'outline'}
                disabled={alreadyAdded}
                onClick={() => handleAddParticipantType(type)}
              >
                {t[`admin_wizard_participant_${type.toLowerCase()}`] ?? type}
              </Button>
            )
          })}
        </div>
      )}

      <div className="space-y-3">
        {tiers.map((field, index) => {
          const tierErrors = errors.priceTiers?.[index]

          return (
            <div key={field.id} className="space-y-1">
              {pricingMode === 'PER_EXPERIENCE' && (
                <div className="grid grid-cols-2 sm:grid-cols-[1fr_1fr_2fr_auto] gap-3 rounded-lg border border-border p-3 items-start">
                  <NumberFormField<DefaultPricingValues>
                    name={`priceTiers.${index}.minQuantity`}
                    label={t.admin_wizard_min_quantity}
                    description={t.admin_wizard_min_quantity_desc}
                    step="1"
                    min="1"
                  />
                  <div>
                    <NumberFormField<DefaultPricingValues>
                      name={`priceTiers.${index}.maxQuantity`}
                      label={t.admin_wizard_max_quantity}
                      description={t.admin_wizard_max_quantity_desc}
                      step="1"
                      min="1"
                      max={maxCapacity?.toString()}
                    />
                    {maxCapacity != null && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {interpolate(t.admin_wizard_max_capacity_ref, { max: String(maxCapacity) })}
                      </p>
                    )}
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <CurrencyFormField<DefaultPricingValues>
                      name={`priceTiers.${index}.baseAmount`}
                      label={t.admin_wizard_flat_price}
                      description={t.admin_wizard_flat_price_desc}
                    />
                  </div>
                  <div className="flex items-center pt-6">
                    {tiers.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => removeTier(index)}
                        aria-label={t.admin_wizard_pricing_remove_tier}
                      >
                        <Trash2Icon className="size-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {pricingMode === 'PER_PERSON' && (
                <div className="flex items-center gap-3 rounded-lg border border-border p-3 max-w-xl">
                  <p className="font-medium text-sm min-w-[80px]">
                    {t[`admin_wizard_participant_${field.tierType.toLowerCase()}`]}
                  </p>
                  <CurrencyFormField<DefaultPricingValues>
                    name={`priceTiers.${index}.baseAmount`}
                    label={t.admin_wizard_price_eur}
                    className="flex-1"
                  />
                  {tiers.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeTier(index)}
                      aria-label={t.admin_wizard_pricing_remove_tier}
                    >
                      <Trash2Icon className="size-4 text-destructive" />
                    </Button>
                  )}
                </div>
              )}

              {pricingMode !== 'PER_PERSON' && tierErrors?.tierType && (
                <p className="text-xs text-destructive">{tierErrors.tierType.message}</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
