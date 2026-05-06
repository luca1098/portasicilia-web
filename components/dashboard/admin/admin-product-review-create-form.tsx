'use client'

import { useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { InputFormField } from '@/components/form/input-form-field'
import { TextareaFormField } from '@/components/form/textarea-form-field'
import { SelectFormField } from '@/components/form/select-form-field'
import { FileUploaderFormField } from '@/components/form/file-uploader-form-field'
import { ComboboxFormField } from '@/components/form/combobox-form-field'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/context/translation.context'
import {
  AdminProductReviewFormSchema,
  type AdminProductReviewFormValues,
} from '@/lib/schemas/forms/admin-product-review.form.schema'
import {
  createAdminProductReviewAction,
  searchProductsAdminAction,
} from '@/lib/actions/admin-reviews.actions'
import { useAction } from '@/lib/hooks/use-action'
import { LoaderIcon } from '@/lib/constants/icons'
import type { ListingSearchResult } from '@/lib/api/admin-reviews'

const RATING_OPTIONS = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5' },
]

export default function AdminProductReviewCreateForm() {
  const router = useRouter()
  const params = useParams()
  const lang = params.lang as string
  const t = useTranslation() as Record<string, string>

  const { loading, execute } = useAction<unknown>({
    successMessage: t.admin_product_review_create_success,
    onSuccess: () => {
      router.push(`/${lang}/dashboard/admin/shop-reviews`)
    },
  })

  const form = useForm<AdminProductReviewFormValues>({
    resolver: zodResolver(AdminProductReviewFormSchema),
    defaultValues: {
      productId: '',
      rating: 5,
      authorName: '',
      authorImage: null,
      title: '',
      comment: '',
    },
  })

  const handleSearchProducts = useCallback(async (q: string): Promise<ListingSearchResult[]> => {
    const result = await searchProductsAdminAction(q)
    return result.success ? (result.data ?? []) : []
  }, [])

  async function onSubmit(data: AdminProductReviewFormValues) {
    await execute(() =>
      createAdminProductReviewAction({
        productId: data.productId,
        rating: data.rating,
        authorName: data.authorName,
        authorImage: data.authorImage ?? undefined,
        title: data.title ?? undefined,
        comment: data.comment ?? undefined,
      })
    )
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <ComboboxFormField<AdminProductReviewFormValues, ListingSearchResult>
          name="productId"
          label={t.admin_product_review_create_product}
          onSearch={handleSearchProducts}
          getValue={o => o.id}
          getLabel={o => o.name}
          placeholder={t.admin_product_review_create_product_placeholder}
          required
          disabled={loading}
        />

        <SelectFormField<AdminProductReviewFormValues, { value: string; label: string }>
          name="rating"
          label={t.admin_product_review_create_rating}
          options={RATING_OPTIONS}
          getValue={o => o.value}
          getLabel={o => o.label}
          required
          disabled={loading}
        />

        <InputFormField<AdminProductReviewFormValues>
          name="authorName"
          label={t.admin_product_review_create_author_name}
          required
          disabled={loading}
        />

        <FileUploaderFormField<AdminProductReviewFormValues>
          name="authorImage"
          label={t.admin_product_review_create_author_image}
          maxSizeMB={2}
          disabled={loading}
        />

        <InputFormField<AdminProductReviewFormValues>
          name="title"
          label={t.admin_product_review_create_title_field}
          disabled={loading}
        />

        <TextareaFormField<AdminProductReviewFormValues>
          name="comment"
          label={t.admin_product_review_create_comment}
          maxLength={2000}
          disabled={loading}
        />

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={loading}>
            {loading && <LoaderIcon className="size-4 animate-spin" />}
            {t.admin_product_review_create_submit}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
