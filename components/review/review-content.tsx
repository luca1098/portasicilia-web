'use client'

import Image from 'next/image'
import { useState } from 'react'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { CheckCircle2Icon, LoaderIcon, AlertCircleIcon } from '@/lib/constants/icons'
import { useTranslation } from '@/lib/context/translation.context'
import { useAction } from '@/lib/hooks/use-action'
import { submitReviewFromToken } from '@/lib/api/reviews'
import type { ReviewTokenInfo } from '@/lib/api/reviews'
import type { ActionResult } from '@/lib/actions/action.types'
import StarRatingInput from '@/components/review/star-rating-input'

const ReviewFormSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().max(200).optional(),
  comment: z.string().optional(),
})

type ReviewFormValues = z.infer<typeof ReviewFormSchema>

type ReviewContentProps = {
  token: string
  listingInfo: ReviewTokenInfo
}

function SuccessState() {
  const t = useTranslation()

  return (
    <div className="flex flex-col items-center gap-4 py-8 text-center">
      <CheckCircle2Icon className="size-16 text-green-500" />
      <h2 className="text-2xl font-bold">{t.review_success_title}</h2>
      <p className="max-w-sm text-muted-foreground">{t.review_success_message}</p>
    </div>
  )
}

type ErrorStateProps = {
  message: string
}

function ErrorState({ message }: ErrorStateProps) {
  const t = useTranslation()

  return (
    <div className="flex flex-col items-center gap-4 py-8 text-center">
      <AlertCircleIcon className="size-16 text-destructive" />
      <h2 className="text-2xl font-bold">{t.review_error_title}</h2>
      <p className="max-w-sm text-muted-foreground">{message}</p>
    </div>
  )
}

export default function ReviewContent({ token, listingInfo }: ReviewContentProps) {
  const t = useTranslation()
  const [submitted, setSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(ReviewFormSchema),
    defaultValues: {
      rating: 0,
      title: '',
      comment: '',
    },
  })

  const rating = useWatch({ control: form.control, name: 'rating' })

  const { loading, execute } = useAction<void>({
    onSuccess: () => setSubmitted(true),
    onError: error => setErrorMessage(error),
  })

  const onSubmit = async (data: ReviewFormValues) => {
    await execute(async (): Promise<ActionResult<void>> => {
      try {
        await submitReviewFromToken(token, {
          rating: data.rating,
          title: data.title || undefined,
          comment: data.comment || undefined,
        })
        return { success: true }
      } catch (err) {
        const message = err instanceof Error ? err.message : t.review_error_invalid
        return { success: false, error: message }
      }
    })
  }

  if (submitted) {
    return <SuccessState />
  }

  if (errorMessage) {
    return <ErrorState message={errorMessage} />
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Listing header */}
      <div className="flex items-center gap-4">
        {listingInfo.cover && (
          <div className="relative size-16 shrink-0 overflow-hidden rounded-xl">
            <Image src={listingInfo.cover} alt={listingInfo.name} fill className="object-cover" />
          </div>
        )}
        <div>
          <p className="text-sm text-muted-foreground">{t.review_page_subtitle}</p>
          <h1 className="text-xl font-bold">{listingInfo.name}</h1>
        </div>
      </div>

      {/* Form */}
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* Star rating */}
          <div className="flex flex-col gap-2">
            <Label>{t.review_rating_label}</Label>
            <StarRatingInput
              value={rating}
              onChange={val => form.setValue('rating', val, { shouldValidate: true })}
              disabled={loading}
            />
            {form.formState.errors.rating && (
              <p className="text-sm text-destructive">{form.formState.errors.rating.message}</p>
            )}
          </div>

          {/* Title */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="review-title">{t.review_write}</Label>
            <Input
              id="review-title"
              placeholder={t.review_title_placeholder}
              maxLength={200}
              disabled={loading}
              {...form.register('title')}
            />
          </div>

          {/* Comment */}
          <div className="flex flex-col gap-2">
            <Textarea
              id="review-comment"
              placeholder={t.review_comment_placeholder}
              rows={4}
              disabled={loading}
              {...form.register('comment')}
            />
          </div>

          <Button type="submit" disabled={loading || rating === 0} className="w-full">
            {loading && <LoaderIcon className="mr-2 size-4 animate-spin" />}
            {t.review_submit}
          </Button>
        </form>
      </FormProvider>
    </div>
  )
}
