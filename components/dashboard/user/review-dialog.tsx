'use client'

import { useForm, FormProvider, useFormContext, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/context/translation.context'
import { useAction } from '@/lib/hooks/use-action'
import { submitReviewAction } from '@/lib/actions/reviews.actions'
import { interpolate } from '@/lib/utils/i18n.utils'
import { LoaderIcon } from '@/lib/constants/icons'
import StarRatingInput from '@/components/review/star-rating-input'
import { InputFormField } from '@/components/form/input-form-field'
import { TextareaFormField } from '@/components/form/textarea-form-field'

type ReviewDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  listingId: string
  listingType: 'experience' | 'stay'
  listingName: string
  onSuccess: () => void
}

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().max(200).optional(),
  comment: z.string().optional(),
})

type ReviewFormValues = z.infer<typeof reviewSchema>

function ReviewFormFields() {
  const t = useTranslation() as Record<string, string>
  const { control, formState } = useFormContext<ReviewFormValues>()

  return (
    <div className="space-y-4 py-2">
      <div className="flex flex-col gap-2">
        <Controller
          control={control}
          name="rating"
          render={({ field }) => (
            <StarRatingInput value={field.value} onChange={val => field.onChange(val)} />
          )}
        />
        {formState.errors.rating && (
          <p className="text-sm text-destructive">{formState.errors.rating.message}</p>
        )}
      </div>
      <InputFormField<ReviewFormValues>
        name="title"
        label={t.review_title_placeholder}
        maxLength={200}
        placeholder={t.review_title_placeholder}
      />
      <TextareaFormField<ReviewFormValues>
        name="comment"
        label={t.review_comment_placeholder}
        placeholder={t.review_comment_placeholder}
        rows={4}
      />
    </div>
  )
}

type ReviewSubmitButtonProps = {
  loading: boolean
}

function ReviewSubmitButton({ loading }: ReviewSubmitButtonProps) {
  const t = useTranslation() as Record<string, string>
  const { watch } = useFormContext<ReviewFormValues>()

  const rating = watch('rating')

  return (
    <Button type="submit" disabled={loading || rating === 0}>
      {loading && <LoaderIcon className="size-4 animate-spin" />}
      {t.review_submit}
    </Button>
  )
}

export default function ReviewDialog({
  open,
  onOpenChange,
  listingId,
  listingType,
  listingName,
  onSuccess,
}: ReviewDialogProps) {
  const t = useTranslation() as Record<string, string>

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, title: '', comment: '' },
  })

  const { loading, execute } = useAction<void>({
    successMessage: t.review_submitted,
    onSuccess: () => {
      form.reset()
      onOpenChange(false)
      onSuccess()
    },
  })

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) {
      form.reset()
    }
    onOpenChange(isOpen)
  }

  function handleSubmit(values: ReviewFormValues) {
    execute(() =>
      submitReviewAction(listingType, listingId, {
        rating: values.rating,
        title: values.title || undefined,
        comment: values.comment || undefined,
      })
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t.review_dialog_title}</DialogTitle>
          <DialogDescription>{interpolate(t.review_dialog_subtitle, { listingName })}</DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <ReviewFormFields />
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                {t.admin_common_cancel}
              </Button>
              <ReviewSubmitButton loading={loading} />
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
