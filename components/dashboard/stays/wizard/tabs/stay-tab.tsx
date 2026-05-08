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
import { CheckboxFormField } from '@/components/form/checkbox-form-field'
import { AddressAutocompleteFormField } from '@/components/form/address-autocomplete-form-field'
import { useTranslation } from '@/lib/context/translation.context'
import { useAction } from '@/lib/hooks/use-action'
import { createStayAction, updateStayAction } from '@/lib/actions/stays.actions'
import { searchOwnersAction } from '@/lib/actions/owners.actions'
import { toFormData } from '@/lib/utils/form-data.utils'
import { LoaderIcon, CheckIcon, XIcon } from '@/lib/constants/icons'
import { cn } from '@/lib/utils/shadcn.utils'
import { StayTabSchema, type StayTabValues } from '@/lib/schemas/forms/stay-tab.form.schema'
import { STAY_AMENITIES } from '@/lib/constants/stay-amenities'
import PolicyPresetField from '../../../experiences/wizard/tabs/policy-preset-field'
import type { Stay } from '@/lib/schemas/entities/stay.entity.schema'
import type { ListingStatus } from '@/lib/schemas/entities/experience.entity.schema'
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

function AmenityChipSelector({
  selectedAmenities,
  onToggle,
  t,
}: {
  selectedAmenities: string[]
  onToggle: (amenity: string) => void
  t: Record<string, string>
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{t.admin_stay_amenities}</Label>
      <p className="text-xs text-muted-foreground">{t.admin_stay_amenities_hint}</p>
      <div className="flex flex-wrap gap-2">
        {STAY_AMENITIES.map(a => {
          const isSelected = selectedAmenities.includes(a.value)
          const Icon = a.icon
          return (
            <button
              key={a.value}
              type="button"
              onClick={() => onToggle(a.value)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
                isSelected
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-background text-muted-foreground hover:border-muted-foreground'
              )}
            >
              <Icon className="size-3.5" />
              {t[a.labelKey]}
              {isSelected && <XIcon className="size-3 opacity-60" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}

const NEWLINE_ARRAY_FIELDS = ['included', 'notIncluded', 'cancellationTerms', 'houseRules'] as const

const STATUS_OPTIONS: { value: ListingStatus; labelKey: string }[] = [
  { value: 'DRAFT', labelKey: 'admin_exp_status_draft' },
  { value: 'PENDING_REVIEW', labelKey: 'admin_exp_status_pending_review' },
  { value: 'ACTIVE', labelKey: 'admin_exp_status_active' },
  { value: 'PAUSED', labelKey: 'admin_exp_status_paused' },
  { value: 'ARCHIVED', labelKey: 'admin_exp_status_archived' },
]

type StayTabProps = {
  mode: 'create' | 'edit'
  stay?: Stay
  localities: Locality[]
  categories: Category[]
  onCreated?: (stay: Stay) => void
}

export default function StayTab({ mode, stay, localities, categories, onCreated }: StayTabProps) {
  const params = useParams()
  const lang = params.lang as string
  const t = useTranslation() as Record<string, string>

  const defaultOwner = stay?.owner ?? undefined
  const detail = stay?.stayDetail

  const form = useForm<StayTabValues>({
    resolver: zodResolver(StayTabSchema),
    defaultValues: {
      name: stay?.name ?? '',
      description: stay?.description ?? '',
      cover: stay?.cover ?? null,
      localityId: stay?.localityId ?? '',
      ownerId: stay?.ownerId ?? '',
      categoryIds: stay?.categories?.map(c => c.category.id) ?? [],
      street: stay?.street ?? '',
      city: stay?.city ?? '',
      zipCode: stay?.zipCode ?? '',
      latitude: Number(stay?.latitude ?? 0),
      longitude: Number(stay?.longitude ?? 0),
      included: stay?.included?.join('\n') ?? '',
      notIncluded: stay?.notIncluded?.join('\n') ?? '',
      cancellationTerms: stay?.cancellationTerms?.join('\n') ?? '',
      maxPeople: detail?.maxPeople ?? stay?.maxPeople ?? 1,
      bedNumber: detail?.bedNumber ?? stay?.bedNumber ?? 1,
      bathroomNumber: detail?.bathroomNumber ?? stay?.bathroomNumber ?? 1,
      roomNumber: detail?.roomNumber ?? stay?.roomNumber ?? 1,
      checkInTime: detail?.checkInTime ?? stay?.checkInTime ?? '',
      checkOutTime: detail?.checkOutTime ?? stay?.checkOutTime ?? '',
      amenities: detail?.amenities ?? stay?.amenities ?? [],
      houseRules: (detail?.houseRules ?? stay?.houseRules ?? []).join('\n'),
      cir: detail?.cir ?? stay?.cir ?? '',
      cin: detail?.cin ?? stay?.cin ?? '',
      status: stay?.status || null,
      highlighted: stay?.highlighted ?? false,
      popular: stay?.popular ?? false,
    },
  })
  const categoriesSelectedIds = useWatch({ control: form.control, name: 'categoryIds' })
  const selectedAmenities = useWatch({ control: form.control, name: 'amenities' })

  const { loading, execute } = useAction<Stay>({
    successMessage: mode === 'create' ? t.admin_stay_create_success : t.admin_stay_update_success,
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

  const onSubmit = async (data: StayTabValues) => {
    const { street, city, zipCode, latitude, longitude, ...rest } = data

    const processed: Record<string, unknown> = { ...rest }
    for (const field of NEWLINE_ARRAY_FIELDS) {
      processed[field] = (data[field] as string)
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean)
    }
    processed.address = { street, city, zipCode, latitude, longitude }

    const fd = toFormData(processed, ['cover'])

    await execute(() => (mode === 'create' ? createStayAction(fd) : updateStayAction(stay?.id ?? '', fd)))
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basics section */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h3 className="text-sm font-semibold">{t.admin_wizard_basics_title}</h3>
          <InputFormField<StayTabValues> name="name" label={t.admin_exp_name} required />
          <TextareaFormField<StayTabValues>
            name="description"
            label={t.admin_exp_description}
            required
            rows={4}
          />
          {mode === 'edit' ? (
            <SelectFormField<StayTabValues, { value: ListingStatus; labelKey: string }>
              name="status"
              label={t.admin_exp_status}
              options={STATUS_OPTIONS}
              getValue={o => o.value}
              getLabel={o => t[o.labelKey]}
              getKey={o => o.value}
              required
            />
          ) : null}
          <FileUploaderFormField<StayTabValues> name="cover" label={t.admin_exp_cover} />
          <CheckboxFormField<StayTabValues>
            name="highlighted"
            label={t.admin_exp_highlighted}
            description={t.admin_exp_highlighted_hint}
          />
          <CheckboxFormField<StayTabValues>
            name="popular"
            label={t.admin_exp_popular}
            description={t.admin_exp_popular_hint}
          />
        </div>

        {/* Assignment section */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h3 className="text-sm font-semibold">{t.admin_wizard_assignment_title}</h3>
          <SelectFormField<StayTabValues, Locality>
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
          <ComboboxFormField<StayTabValues, Owner>
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

        {/* Stay Details section */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h3 className="text-sm font-semibold">{t.admin_stay_details_section}</h3>
          <div className="grid grid-cols-2 gap-4">
            <NumberFormField<StayTabValues>
              name="maxPeople"
              label={t.admin_stay_max_people}
              min={1}
              required
            />
            <NumberFormField<StayTabValues>
              name="bedNumber"
              label={t.admin_stay_bed_number}
              min={1}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <NumberFormField<StayTabValues>
              name="bathroomNumber"
              label={t.admin_stay_bathroom_number}
              min={0}
            />
            <NumberFormField<StayTabValues> name="roomNumber" label={t.admin_stay_room_number} min={1} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputFormField<StayTabValues>
              name="checkInTime"
              label={t.admin_stay_check_in_time}
              type="time"
            />
            <InputFormField<StayTabValues>
              name="checkOutTime"
              label={t.admin_stay_check_out_time}
              type="time"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputFormField<StayTabValues> name="cir" label={t.admin_stay_cir} required />
            <InputFormField<StayTabValues> name="cin" label={t.admin_stay_cin} required />
          </div>
          <TextareaFormField<StayTabValues>
            name="houseRules"
            label={t.admin_stay_house_rules}
            description={t.admin_stay_house_rules_hint}
            rows={3}
          />
          <AmenityChipSelector
            selectedAmenities={selectedAmenities ?? []}
            onToggle={amenity => {
              const current = selectedAmenities ?? []
              const updated = current.includes(amenity)
                ? current.filter(a => a !== amenity)
                : [...current, amenity]
              form.setValue('amenities', updated, { shouldValidate: true })
            }}
            t={t}
          />
        </div>

        {/* Location section */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h3 className="text-sm font-semibold">{t.admin_exp_location_section}</h3>
          <AddressAutocompleteFormField
            label={t.admin_exp_address_search}
            description={t.admin_exp_address_search_description}
            noResultsText={t.admin_exp_address_no_results}
            lang={lang}
            initialDisplayText={stay?.street ?? ''}
          />
          <div className="grid grid-cols-2 gap-4">
            <InputFormField<StayTabValues> name="street" label={t.admin_exp_street} required />
            <InputFormField<StayTabValues> name="city" label={t.admin_exp_city} required />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <InputFormField<StayTabValues> name="zipCode" label={t.admin_exp_zip_code} required />
            <NumberFormField<StayTabValues> name="latitude" label={t.admin_exp_latitude} step="any" />
            <NumberFormField<StayTabValues> name="longitude" label={t.admin_exp_longitude} step="any" />
          </div>
        </div>

        {/* Details section */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h3 className="text-sm font-semibold">{t.admin_exp_details_section}</h3>
          <TextareaFormField<StayTabValues> name="included" label={t.admin_exp_included} rows={3} />
          <TextareaFormField<StayTabValues> name="notIncluded" label={t.admin_exp_not_included} rows={3} />
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
        </div>
        <p className="text-xs text-muted-foreground">{t.admin_wizard_details_hint}</p>

        {/* Submit */}
        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading && <LoaderIcon className="size-4 animate-spin" />}
            {loading ? t.admin_exp_saving : t.admin_wizard_save_stay}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
