'use client'

import { useCallback } from 'react'
import { useParams } from 'next/navigation'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { InputFormField } from '@/components/form/input-form-field'
import { TextareaFormField } from '@/components/form/textarea-form-field'
import { FileUploaderFormField } from '@/components/form/file-uploader-form-field'
import { SelectFormField } from '@/components/form/select-form-field'
import { ComboboxFormField } from '@/components/form/combobox-form-field'
import { NumberFormField } from '@/components/form/number-form-field'
import { RadioFormField } from '@/components/form/radio-form-field'
import { AddressAutocompleteFormField } from '@/components/form/address-autocomplete-form-field'
import { useTranslation } from '@/lib/context/translation.context'
import { useAction } from '@/lib/hooks/use-action'
import { createExperienceAction, updateExperienceAction } from '@/lib/actions/experiences.actions'
import { searchOwnersAction } from '@/lib/actions/owners.actions'
import { toFormData } from '@/lib/utils/form-data.utils'
import { LoaderIcon, CheckIcon, XIcon } from '@/lib/constants/icons'
import { cn } from '@/lib/utils/shadcn.utils'
import { ExperienceTabSchema, type ExperienceTabValues } from '@/lib/schemas/forms/experience-tab.form.schema'
import PolicyPresetField from './policy-preset-field'
import type { Experience, ListingStatus } from '@/lib/schemas/entities/experience.entity.schema'
import type { Locality } from '@/lib/schemas/entities/locality.entity.schema'
import type { Owner } from '@/lib/schemas/entities/owner.entity.schema'
import type { Category } from '@/lib/schemas/entities/category.entity.schema'

// --- Extracted sub-components ---

function CategoryChipSelector({
  categories,
  selectedIds,
  onToggle,
  t,
}: {
  categories: Category[]
  selectedIds: string[]
  onToggle: (categoryId: string) => void
  t: Record<string, string>
}) {
  if (categories.length === 0) return null

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{t.admin_wizard_category}</Label>
      <p className="text-xs text-muted-foreground">{t.admin_wizard_category_hint}</p>
      <div className="flex flex-wrap gap-2">
        {categories.map(c => {
          const isSelected = selectedIds.includes(c.id)
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onToggle(c.id)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
                isSelected
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-background text-muted-foreground hover:border-muted-foreground'
              )}
            >
              {isSelected && <CheckIcon className="size-3" />}
              {c.name}
              {isSelected && <XIcon className="size-3 opacity-60" />}
            </button>
          )
        })}
      </div>
      {selectedIds.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {selectedIds.length} {t.admin_wizard_categories_selected}
        </p>
      )}
    </div>
  )
}

const NEWLINE_ARRAY_FIELDS = ['included', 'notIncluded', 'policy', 'cancellationTerms', 'languages'] as const

const STATUS_OPTIONS: { value: ListingStatus; labelKey: string }[] = [
  { value: 'DRAFT', labelKey: 'admin_exp_status_draft' },
  { value: 'PENDING_REVIEW', labelKey: 'admin_exp_status_pending_review' },
  { value: 'ACTIVE', labelKey: 'admin_exp_status_active' },
  { value: 'PAUSED', labelKey: 'admin_exp_status_paused' },
  { value: 'ARCHIVED', labelKey: 'admin_exp_status_archived' },
]

type ExperienceTabProps = {
  mode: 'create' | 'edit'
  experience?: Experience
  localities: Locality[]
  categories: Category[]
  onCreated?: (experience: Experience) => void
}

export default function ExperienceTab({
  mode,
  experience,
  localities,
  categories,
  onCreated,
}: ExperienceTabProps) {
  const params = useParams()
  const lang = params.lang as string
  const t = useTranslation() as Record<string, string>

  const defaultOwner = experience?.owner ?? undefined

  const form = useForm<ExperienceTabValues>({
    resolver: zodResolver(ExperienceTabSchema),
    defaultValues: {
      name: experience?.name ?? '',
      description: experience?.description ?? '',
      cover: experience?.cover ?? null,
      localityId: experience?.localityId ?? '',
      ownerId: experience?.ownerId ?? '',
      categoryIds: experience?.categories?.map(c => c.category.id) ?? [],
      street: experience?.street ?? '',
      city: experience?.city ?? '',
      zipCode: experience?.zipCode ?? '',
      latitude: Number(experience?.latitude ?? 0),
      longitude: Number(experience?.longitude ?? 0),
      included: experience?.included?.join('\n') ?? '',
      notIncluded: experience?.notIncluded?.join('\n') ?? '',
      policy: experience?.policy?.join('\n') ?? '',
      cancellationTerms: experience?.cancellationTerms?.join('\n') ?? '',
      languages: experience?.languages?.join('\n') ?? '',
      capacityMode: experience?.capacityMode ?? 'PER_PERSON',
      maxCapacity: experience?.maxCapacity ?? 1,
      assetLabel: experience?.assetLabel ?? '',
      status: experience?.status ?? 'DRAFT',
    },
  })
  const categoriesSelectedIds = useWatch({ control: form.control, name: 'categoryIds' })
  const capacityMode = useWatch({ control: form.control, name: 'capacityMode' })

  const { loading, execute } = useAction<Experience>({
    successMessage: mode === 'create' ? t.admin_exp_create_success : t.admin_exp_update_success,
    onSuccess: data => {
      if (mode === 'create' && data) {
        onCreated?.(data)
      }
    },
  })

  const handleSearchOwners = useCallback(async (query: string): Promise<Owner[]> => {
    const result = await searchOwnersAction(query)
    return result.success && result.data ? result.data : []
  }, [])

  const onSubmit = async (data: ExperienceTabValues) => {
    const { street, city, zipCode, latitude, longitude, ownerId: _, ...rest } = data

    const processed: Record<string, unknown> = { ...rest }
    for (const field of NEWLINE_ARRAY_FIELDS) {
      processed[field] = (data[field] as string)
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean)
    }
    processed.address = { street, city, zipCode, latitude, longitude }

    const fd = toFormData(processed, ['cover'])

    await execute(() =>
      mode === 'create' ? createExperienceAction(fd) : updateExperienceAction(experience?.id ?? '', fd)
    )
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basics section */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h3 className="text-sm font-semibold">{t.admin_wizard_basics_title}</h3>
          <InputFormField<ExperienceTabValues> name="name" label={t.admin_exp_name} required />
          <TextareaFormField<ExperienceTabValues>
            name="description"
            label={t.admin_exp_description}
            required
            rows={4}
          />
          <SelectFormField<ExperienceTabValues, { value: ListingStatus; labelKey: string }>
            name="status"
            label={t.admin_exp_status}
            options={STATUS_OPTIONS}
            getValue={o => o.value}
            getLabel={o => t[o.labelKey]}
            getKey={o => o.value}
            required
          />
          <FileUploaderFormField<ExperienceTabValues> name="cover" label={t.admin_exp_cover} />
        </div>

        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h3 className="text-sm font-semibold">{t.admin_wizard_assignment_title}</h3>
          <SelectFormField<ExperienceTabValues, Locality>
            name="localityId"
            label={t.admin_exp_locality}
            options={localities}
            getValue={l => l.id}
            getLabel={l => l.name}
            getKey={l => l.id}
            required
          />
          <CategoryChipSelector
            categories={categories}
            selectedIds={categoriesSelectedIds ?? []}
            onToggle={categoryId => {
              const current = categoriesSelectedIds ?? []
              const updated = current.includes(categoryId)
                ? current.filter(id => id !== categoryId)
                : [...current, categoryId]
              form.setValue('categoryIds', updated, { shouldValidate: true })
            }}
            t={t}
          />
          <ComboboxFormField<ExperienceTabValues, Owner>
            name="ownerId"
            label={t.admin_exp_owner}
            onSearch={handleSearchOwners}
            defaultOption={defaultOwner}
            getValue={o => o.id}
            getLabel={o => `${o.firstName} ${o.lastName}`}
            getKey={o => o.id}
            required
          />
        </div>

        {/* Capacity section */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h3 className="text-sm font-semibold">{t.admin_wizard_capacity_section}</h3>
          <RadioFormField<ExperienceTabValues, { value: string; label: string; hint: string }>
            name="capacityMode"
            label={t.admin_wizard_capacity_mode}
            description={t.admin_wizard_capacity_mode_hint}
            options={[
              {
                value: 'PER_PERSON',
                label: t.admin_wizard_capacity_people,
                hint: t.admin_wizard_capacity_people_hint,
              },
              {
                value: 'PER_ASSET',
                label: t.admin_wizard_capacity_asset,
                hint: t.admin_wizard_capacity_asset_hint,
              },
            ]}
            getValue={o => o.value}
            getLabel={o => o.label}
            getKey={o => o.value}
            required
          />
          <NumberFormField<ExperienceTabValues>
            name="maxCapacity"
            label={
              capacityMode === 'PER_ASSET' ? t.admin_wizard_units_available : t.admin_wizard_max_participants
            }
            min={1}
            required
          />
          {capacityMode === 'PER_ASSET' && (
            <InputFormField<ExperienceTabValues>
              name="assetLabel"
              label={t.admin_wizard_asset_label}
              description={t.admin_wizard_asset_label_hint}
            />
          )}
        </div>

        {/* Location section */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h3 className="text-sm font-semibold">{t.admin_exp_location_section}</h3>
          <AddressAutocompleteFormField
            label={t.admin_exp_address_search}
            description={t.admin_exp_address_search_description}
            noResultsText={t.admin_exp_address_no_results}
            lang={lang}
            initialDisplayText={experience?.street ?? ''}
          />
          <div className="grid grid-cols-2 gap-4">
            <InputFormField<ExperienceTabValues> name="street" label={t.admin_exp_street} required />
            <InputFormField<ExperienceTabValues> name="city" label={t.admin_exp_city} required />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <InputFormField<ExperienceTabValues> name="zipCode" label={t.admin_exp_zip_code} required />
            <NumberFormField<ExperienceTabValues> name="latitude" label={t.admin_exp_latitude} step="any" />
            <NumberFormField<ExperienceTabValues> name="longitude" label={t.admin_exp_longitude} step="any" />
          </div>
        </div>

        {/* Details section */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h3 className="text-sm font-semibold">{t.admin_exp_details_section}</h3>
          <TextareaFormField<ExperienceTabValues> name="included" label={t.admin_exp_included} rows={3} />
          <TextareaFormField<ExperienceTabValues>
            name="notIncluded"
            label={t.admin_exp_not_included}
            rows={3}
          />
          <PolicyPresetField
            name="policy"
            label={t.admin_exp_policy}
            presets={[
              { value: t.admin_policy_preset_reschedule, label: t.admin_policy_preset_reschedule },
              { value: t.admin_policy_preset_full_refund, label: t.admin_policy_preset_full_refund },
              {
                value: t.admin_policy_preset_partial_refund,
                label: t.admin_policy_preset_partial_refund_label,
                hasPercentage: true,
              },
            ]}
            customLabel={t.admin_policy_preset_custom}
            customPlaceholder={t.admin_policy_preset_custom_placeholder}
            percentageLabel={t.admin_policy_preset_percentage}
          />
          <PolicyPresetField
            name="cancellationTerms"
            label={t.admin_exp_cancellation_terms}
            presets={[
              { value: t.admin_cancellation_preset_24h, label: t.admin_cancellation_preset_24h },
              { value: t.admin_cancellation_preset_48h, label: t.admin_cancellation_preset_48h },
              {
                value: t.admin_cancellation_preset_non_refundable,
                label: t.admin_cancellation_preset_non_refundable,
              },
              {
                value: t.admin_cancellation_preset_partial_refund,
                label: t.admin_cancellation_preset_partial_refund_label,
                hasPercentage: true,
              },
            ]}
            customLabel={t.admin_cancellation_preset_custom}
            customPlaceholder={t.admin_cancellation_preset_custom_placeholder}
            percentageLabel={t.admin_policy_preset_percentage}
          />
          <TextareaFormField<ExperienceTabValues> name="languages" label={t.admin_exp_languages} rows={2} />
        </div>
        <p className="text-xs text-muted-foreground">{t.admin_wizard_details_hint}</p>

        {/* Submit */}
        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading && <LoaderIcon className="size-4 animate-spin" />}
            {loading ? t.admin_exp_saving : t.admin_wizard_save_experience}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
