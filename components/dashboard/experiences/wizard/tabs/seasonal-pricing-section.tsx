'use client'

import { useEffect, useState } from 'react'
import { FormProvider, useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { InputFormField, NumberFormField, CurrencyFormField } from '@/components/form'
import { useTranslation } from '@/lib/context/translation.context'
import { useAction } from '@/lib/hooks/use-action'
import {
  createExperienceSeasonAction,
  updateExperienceSeasonAction,
  deleteExperienceSeasonAction,
  getExperienceSeasonsAction,
} from '@/lib/actions/experiences.actions'
import {
  ExperienceSeasonFormSchema,
  type ExperienceSeasonFormValues,
} from '@/lib/schemas/forms/experience-season.form.schema'
import type { Experience } from '@/lib/schemas/entities/experience.entity.schema'
import type { ExperienceSeason, PriceTier } from '@/lib/schemas/entities/pricing.entity.schema'
import { formatCurrency } from '@/lib/utils/format.utils'
import { PlusIcon, PencilIcon, Trash2Icon, LoaderIcon, XIcon } from '@/lib/constants/icons'

type SeasonalPricingSectionProps = {
  experienceId: string
  listingId: string
  priceListId: string
  tiers: PriceTier[]
  onSaved?: (updated: Experience) => void
}

export default function SeasonalPricingSection({
  experienceId,
  listingId,
  priceListId,
  tiers,
  onSaved,
}: SeasonalPricingSectionProps) {
  const t = useTranslation() as Record<string, string>

  const [seasons, setSeasons] = useState<ExperienceSeason[]>([])
  const [loadingSeasons, setLoadingSeasons] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const form = useForm<ExperienceSeasonFormValues>({
    resolver: zodResolver(ExperienceSeasonFormSchema),
    defaultValues: {
      name: '',
      dateFrom: '',
      dateTo: '',
      priority: 0,
      tierPrices: tiers.map(tier => ({
        priceTierId: tier.id,
        overrideAmount: Number(tier.baseAmount) || 0,
      })),
    },
  })

  const { fields: tierPriceFields, replace: replaceTierPrices } = useFieldArray({
    control: form.control,
    name: 'tierPrices',
  })

  const refreshSeasons = async () => {
    const res = await getExperienceSeasonsAction(listingId)
    if (res.success && res.data) setSeasons(res.data)
    setLoadingSeasons(false)
  }

  const { loading: createLoading, execute: executeCreate } = useAction<Experience>({
    successMessage: t.admin_wizard_experience_season_created,
    onSuccess: data => {
      setShowForm(false)
      form.reset()
      refreshSeasons()
      if (data) onSaved?.(data)
    },
  })

  const { loading: updateLoading, execute: executeUpdate } = useAction<Experience>({
    successMessage: t.admin_wizard_experience_season_updated,
    onSuccess: data => {
      setEditingId(null)
      setShowForm(false)
      form.reset()
      refreshSeasons()
      if (data) onSaved?.(data)
    },
  })

  const { loading: deleteLoading, execute: executeDelete } = useAction<Experience>({
    successMessage: t.admin_wizard_experience_season_deleted,
    onSuccess: data => {
      setConfirmDeleteId(null)
      refreshSeasons()
      if (data) onSaved?.(data)
    },
  })

  const isSaving = createLoading || updateLoading

  const resetFormForCreate = () => {
    form.reset({
      name: '',
      dateFrom: '',
      dateTo: '',
      priority: 0,
      tierPrices: tiers.map(tier => ({
        priceTierId: tier.id,
        overrideAmount: Number(tier.baseAmount) || 0,
      })),
    })
    setEditingId(null)
  }

  const startEditing = (season: ExperienceSeason) => {
    const byTier = new Map(season.tierPrices.map(tp => [tp.priceTierId, tp.overrideAmount]))
    form.reset({
      name: season.name,
      dateFrom: season.dateFrom.slice(0, 10),
      dateTo: season.dateTo.slice(0, 10),
      priority: season.priority,
      tierPrices: tiers.map(tier => ({
        priceTierId: tier.id,
        overrideAmount: byTier.get(tier.id) ?? Number(tier.baseAmount) ?? 0,
      })),
    })
    setEditingId(season.seasonGroupId)
    setShowForm(true)
  }

  const cancelForm = () => {
    setShowForm(false)
    resetFormForCreate()
  }

  const handleCreate = async (data: ExperienceSeasonFormValues) => {
    await executeCreate(() =>
      createExperienceSeasonAction(experienceId, {
        priceListId,
        name: data.name,
        dateFrom: data.dateFrom,
        dateTo: data.dateTo,
        priority: data.priority,
        tierPrices: data.tierPrices,
      })
    )
  }

  const handleUpdate = async (data: ExperienceSeasonFormValues) => {
    if (!editingId) return
    await executeUpdate(() =>
      updateExperienceSeasonAction(experienceId, editingId, {
        name: data.name,
        dateFrom: data.dateFrom,
        dateTo: data.dateTo,
        priority: data.priority,
        tierPrices: data.tierPrices,
      })
    )
  }

  const handleDelete = async (seasonGroupId: string) => {
    await executeDelete(() => deleteExperienceSeasonAction(experienceId, seasonGroupId))
  }

  const formatLongDate = (iso: string) =>
    new Date(iso).toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })

  useEffect(() => {
    refreshSeasons()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listingId])

  useEffect(() => {
    if (!showForm) return
    const current = form.getValues('tierPrices')
    if (current.length !== tiers.length) {
      replaceTierPrices(
        tiers.map(tier => ({
          priceTierId: tier.id,
          overrideAmount: Number(tier.baseAmount) || 0,
        }))
      )
    }
  }, [tiers, showForm, form, replaceTierPrices])

  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">{t.admin_wizard_experience_season_title}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{t.admin_wizard_experience_season_subtitle}</p>
        </div>
        {!showForm && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              resetFormForCreate()
              setShowForm(true)
            }}
          >
            <PlusIcon className="size-4" />
            {t.admin_wizard_experience_season_add}
          </Button>
        )}
      </div>

      {!loadingSeasons && seasons.length === 0 && !showForm && (
        <p className="text-sm text-muted-foreground">{t.admin_wizard_experience_season_empty}</p>
      )}

      <div className="space-y-3">
        {seasons.map(season => {
          const tierById = new Map(tiers.map(tt => [tt.id, tt]))
          return (
            <div key={season.seasonGroupId} className="rounded-lg border border-border bg-background p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{season.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatLongDate(season.dateFrom)} – {formatLongDate(season.dateTo)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t.admin_wizard_experience_season_priority}: {season.priority}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {confirmDeleteId === season.seasonGroupId ? (
                    <>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        disabled={deleteLoading}
                        onClick={() => handleDelete(season.seasonGroupId)}
                      >
                        {deleteLoading && <LoaderIcon className="size-3 animate-spin" />}
                        {t.admin_common_confirm}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setConfirmDeleteId(null)}
                      >
                        <XIcon className="size-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={() => startEditing(season)}
                      >
                        <PencilIcon className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={() => setConfirmDeleteId(season.seasonGroupId)}
                      >
                        <Trash2Icon className="size-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {season.tierPrices.map(tp => {
                  const tier = tierById.get(tp.priceTierId)
                  const label = tier
                    ? tier.label ||
                      t[`admin_wizard_participant_${tier.tierType.toLowerCase()}`] ||
                      tier.tierType
                    : tp.priceTierId
                  return (
                    <span
                      key={tp.overrideId}
                      className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs"
                    >
                      <span className="font-medium">{label}</span>
                      <span>{formatCurrency(String(tp.overrideAmount))}</span>
                    </span>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {showForm && (
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(editingId ? handleUpdate : handleCreate)}
            className="space-y-4 rounded-lg border border-border bg-background p-4"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <InputFormField<ExperienceSeasonFormValues>
                  name="name"
                  label={t.admin_wizard_experience_season_name}
                />
              </div>
              <InputFormField<ExperienceSeasonFormValues>
                name="dateFrom"
                label={t.admin_wizard_experience_season_date_from}
                type="date"
              />
              <InputFormField<ExperienceSeasonFormValues>
                name="dateTo"
                label={t.admin_wizard_experience_season_date_to}
                type="date"
              />
              <NumberFormField<ExperienceSeasonFormValues>
                name="priority"
                label={t.admin_wizard_experience_season_priority}
                description={t.admin_wizard_experience_season_priority_hint}
                step="1"
                min="0"
              />
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold">{t.admin_wizard_experience_season_tier_prices}</h4>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {tierPriceFields.map((field, index) => {
                  const tier = tiers[index]
                  const label = tier
                    ? tier.label ||
                      t[`admin_wizard_participant_${tier.tierType.toLowerCase()}`] ||
                      tier.tierType
                    : ''
                  return (
                    <div key={field.id}>
                      <CurrencyFormField<ExperienceSeasonFormValues>
                        name={`tierPrices.${index}.overrideAmount`}
                        label={label}
                      />
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={cancelForm}>
                {t.admin_common_cancel}
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving && <LoaderIcon className="size-4 animate-spin" />}
                {editingId ? t.admin_wizard_experience_season_save : t.admin_wizard_experience_season_add}
              </Button>
            </div>
          </form>
        </FormProvider>
      )}
    </div>
  )
}
