'use client'

import { useParams, useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback } from 'react'
import { InputFormField } from '@/components/form/input-form-field'
import { NumberFormField } from '@/components/form/number-form-field'
import { TextareaFormField } from '@/components/form/textarea-form-field'
import { FileUploaderFormField } from '@/components/form/file-uploader-form-field'
import { SelectFormField } from '@/components/form/select-form-field'
import { ComboboxFormField } from '@/components/form/combobox-form-field'
import { AddressAutocompleteFormField } from '@/components/form/address-autocomplete-form-field'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/context/translation.context'
import { ExperienceFormSchema, type ExperienceFormValues } from '@/lib/schemas/forms/experience.form.schema'
import { createExperienceAction, updateExperienceAction } from '@/lib/actions/experiences.actions'
import { searchOwnersAction } from '@/lib/actions/owners.actions'
import { toFormData } from '@/lib/utils/form-data.utils'
import { useAction } from '@/lib/hooks/use-action'
import { LoaderIcon } from '@/lib/constants/icons'
import type { Experience } from '@/lib/schemas/entities/experience.entity.schema'
import type { Locality } from '@/lib/schemas/entities/locality.entity.schema'
import type { Owner } from '@/lib/schemas/entities/owner.entity.schema'

type ExperienceFormProps = {
  mode: 'create' | 'edit'
  experience?: Experience
  localities: Locality[]
}

const STATUSES = ['DRAFT', 'PENDING_REVIEW', 'ACTIVE', 'PAUSED', 'ARCHIVED'] as const

export default function ExperienceForm({ mode, experience, localities }: ExperienceFormProps) {
  const router = useRouter()
  const params = useParams()
  const lang = params.lang as string
  const t = useTranslation() as Record<string, string>

  const { loading, execute } = useAction<Experience>({
    successMessage: mode === 'create' ? t.admin_exp_create_success : t.admin_exp_update_success,
    onSuccess: data => {
      if (mode === 'create' && data?.id) {
        router.push(`/${lang}/dashboard/admin/experiences/${data.id}`)
      } else {
        router.push(`/${lang}/dashboard/admin/experiences`)
      }
    },
  })

  const form = useForm<ExperienceFormValues>({
    resolver: zodResolver(ExperienceFormSchema),
    defaultValues: {
      name: experience?.name ?? '',
      description: experience?.description ?? '',
      cover: experience?.cover ?? null,
      maxCapacity: experience?.maxCapacity ?? 1,
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
      status: experience?.status ?? 'DRAFT',
      localityId: experience?.localityId ?? '',
      ownerId: experience?.ownerId ?? '',
    },
  })

  const defaultOwner = experience?.owner ?? undefined

  const handleSearchOwners = useCallback(async (query: string): Promise<Owner[]> => {
    const result = await searchOwnersAction(query)
    return result.success && result.data ? result.data : []
  }, [])

  const onSubmit = async (data: ExperienceFormValues) => {
    const arrayFields = ['included', 'notIncluded', 'policy', 'cancellationTerms', 'languages'] as const
    const { street, city, zipCode, latitude, longitude, ownerId: _, ...rest } = data
    const processed: Record<string, unknown> = { ...rest }

    for (const field of arrayFields) {
      const raw = data[field] as string
      processed[field] = raw
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
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <InputFormField<ExperienceFormValues> name="name" label={t.admin_exp_name} required />

          <TextareaFormField<ExperienceFormValues>
            name="description"
            label={t.admin_exp_description}
            required
            rows={4}
          />

          <FileUploaderFormField<ExperienceFormValues> name="cover" label={t.admin_exp_cover} />

          <NumberFormField<ExperienceFormValues>
            name="maxCapacity"
            label={t.admin_exp_max_capacity}
            min={1}
            required
          />

          <SelectFormField<ExperienceFormValues, (typeof STATUSES)[number]>
            name="status"
            label={t.admin_exp_status}
            options={[...STATUSES]}
            getValue={v => v}
            getLabel={v => t[`admin_exp_status_${v.toLowerCase()}`] ?? v}
            required
          />

          <SelectFormField<ExperienceFormValues, Locality>
            name="localityId"
            label={t.admin_exp_locality}
            options={localities}
            getValue={l => l.id}
            getLabel={l => l.name}
            getKey={l => l.id}
            required
          />

          <ComboboxFormField<ExperienceFormValues, Owner>
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
            <InputFormField<ExperienceFormValues> name="street" label={t.admin_exp_street} required />
            <InputFormField<ExperienceFormValues> name="city" label={t.admin_exp_city} required />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <InputFormField<ExperienceFormValues> name="zipCode" label={t.admin_exp_zip_code} required />
            <NumberFormField<ExperienceFormValues> name="latitude" label={t.admin_exp_latitude} step="any" />
            <NumberFormField<ExperienceFormValues>
              name="longitude"
              label={t.admin_exp_longitude}
              step="any"
            />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h3 className="text-sm font-semibold">{t.admin_exp_details_section}</h3>
          <TextareaFormField<ExperienceFormValues> name="included" label={t.admin_exp_included} rows={3} />
          <TextareaFormField<ExperienceFormValues>
            name="notIncluded"
            label={t.admin_exp_not_included}
            rows={3}
          />
          <TextareaFormField<ExperienceFormValues> name="policy" label={t.admin_exp_policy} rows={3} />
          <TextareaFormField<ExperienceFormValues>
            name="cancellationTerms"
            label={t.admin_exp_cancellation_terms}
            rows={3}
          />
          <TextareaFormField<ExperienceFormValues> name="languages" label={t.admin_exp_languages} rows={2} />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading && <LoaderIcon className="size-4 animate-spin" />}
            {loading ? t.admin_exp_saving : t.admin_exp_save}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
