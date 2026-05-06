'use client'

import { useCallback, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { InputFormField } from '@/components/form/input-form-field'
import { TextareaFormField } from '@/components/form/textarea-form-field'
import { SelectFormField } from '@/components/form/select-form-field'
import { FileUploaderFormField } from '@/components/form/file-uploader-form-field'
import { ComboboxFormField } from '@/components/form/combobox-form-field'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/context/translation.context'
import {
  AdminReviewFormSchema,
  type AdminReviewFormValues,
} from '@/lib/schemas/forms/admin-review.form.schema'
import {
  createAdminReviewAction,
  searchExperiencesAdminAction,
  searchStaysAdminAction,
} from '@/lib/actions/admin-reviews.actions'
import { useAction } from '@/lib/hooks/use-action'
import { LoaderIcon } from '@/lib/constants/icons'
import type { ListingSearchResult } from '@/lib/api/admin-reviews'

const LISTING_TYPE_OPTIONS = [
  { value: 'experience' as const, labelKey: 'admin_review_create_listing_type_experience' },
  { value: 'stay' as const, labelKey: 'admin_review_create_listing_type_stay' },
]

const RATING_OPTIONS = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5' },
]

export default function AdminReviewCreateForm() {
  const router = useRouter()
  const params = useParams()
  const lang = params.lang as string
  const t = useTranslation() as Record<string, string>

  const { loading, execute } = useAction<unknown>({
    successMessage: t.admin_review_create_success,
    onSuccess: () => {
      router.push(`/${lang}/dashboard/admin/reviews`)
    },
  })

  const form = useForm<AdminReviewFormValues>({
    resolver: zodResolver(AdminReviewFormSchema),
    defaultValues: {
      listingType: 'experience',
      listingId: '',
      rating: 5,
      authorName: '',
      authorImage: null,
      title: '',
      comment: '',
    },
  })

  const listingType = useWatch({ control: form.control, name: 'listingType' })

  const prevListingType = useRef(listingType)

  const handleSearchExperiences = useCallback(async (q: string): Promise<ListingSearchResult[]> => {
    const result = await searchExperiencesAdminAction(q)
    return result.success ? (result.data ?? []) : []
  }, [])

  const handleSearchStays = useCallback(async (q: string): Promise<ListingSearchResult[]> => {
    const result = await searchStaysAdminAction(q)
    return result.success ? (result.data ?? []) : []
  }, [])

  async function onSubmit(data: AdminReviewFormValues) {
    await execute(() =>
      createAdminReviewAction({
        listingType: data.listingType,
        listingId: data.listingId,
        rating: data.rating,
        authorName: data.authorName,
        authorImage: data.authorImage ?? undefined,
        title: data.title ?? undefined,
        comment: data.comment ?? undefined,
      })
    )
  }

  const listingTypeOptions = LISTING_TYPE_OPTIONS.map(o => ({
    value: o.value,
    label: t[o.labelKey],
  }))

  useEffect(() => {
    if (prevListingType.current !== listingType) {
      prevListingType.current = listingType
      form.setValue('listingId', '')
    }
  }, [listingType, form])

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <SelectFormField<AdminReviewFormValues, { value: string; label: string }>
          name="listingType"
          label={t.admin_review_create_listing_type}
          options={listingTypeOptions}
          getValue={o => o.value}
          getLabel={o => o.label}
          required
          disabled={loading}
        />

        {listingType === 'experience' ? (
          <ComboboxFormField<AdminReviewFormValues, ListingSearchResult>
            key="experience"
            name="listingId"
            label={t.admin_review_create_listing}
            onSearch={handleSearchExperiences}
            getValue={o => o.id}
            getLabel={o => o.name}
            placeholder={t.admin_review_create_listing_placeholder}
            required
            disabled={loading}
          />
        ) : (
          <ComboboxFormField<AdminReviewFormValues, ListingSearchResult>
            key="stay"
            name="listingId"
            label={t.admin_review_create_listing}
            onSearch={handleSearchStays}
            getValue={o => o.id}
            getLabel={o => o.name}
            placeholder={t.admin_review_create_listing_placeholder}
            required
            disabled={loading}
          />
        )}

        <SelectFormField<AdminReviewFormValues, { value: string; label: string }>
          name="rating"
          label={t.admin_review_create_rating}
          options={RATING_OPTIONS}
          getValue={o => o.value}
          getLabel={o => o.label}
          required
          disabled={loading}
        />

        <InputFormField<AdminReviewFormValues>
          name="authorName"
          label={t.admin_review_create_author_name}
          required
          disabled={loading}
        />

        <FileUploaderFormField<AdminReviewFormValues>
          name="authorImage"
          label={t.admin_review_create_author_image}
          maxSizeMB={2}
          disabled={loading}
        />

        <InputFormField<AdminReviewFormValues>
          name="title"
          label={t.admin_review_create_title_field}
          disabled={loading}
        />

        <TextareaFormField<AdminReviewFormValues>
          name="comment"
          label={t.admin_review_create_comment}
          maxLength={2000}
          disabled={loading}
        />

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={loading}>
            {loading && <LoaderIcon className="size-4 animate-spin" />}
            {t.admin_review_create_submit}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
