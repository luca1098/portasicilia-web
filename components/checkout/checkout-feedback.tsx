'use client'

import { useState } from 'react'
import { CheckCircle2Icon, StarIcon } from '@/lib/constants/icons'
import { useTranslation } from '@/lib/context/translation.context'
import { useAction } from '@/lib/hooks/use-action'
import { cn } from '@/lib/utils/shadcn.utils'
import { submitCheckoutFeedbackAction } from '@/lib/actions/checkout-feedback.actions'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

const STAR_INDICES = [0, 1, 2, 3, 4]
const COMMENT_MAX_LENGTH = 1000

type StarRowProps = {
  value: number
  hover: number
  onSelect: (rating: number) => void
  onHover: (rating: number) => void
  size: string
  ariaLabel: (rating: number) => string
}

function StarRow({ value, hover, onSelect, onHover, size, ariaLabel }: StarRowProps) {
  const active = hover || value

  return (
    <div className="flex gap-1" onMouseLeave={() => onHover(0)}>
      {STAR_INDICES.map(i => {
        const filled = i < active
        return (
          <button
            key={i}
            type="button"
            aria-label={ariaLabel(i + 1)}
            onClick={() => onSelect(i + 1)}
            onMouseEnter={() => onHover(i + 1)}
            className="rounded-md p-0.5 transition-transform duration-150 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <StarIcon
              className={cn(
                size,
                'transition-colors duration-150',
                filled ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted-foreground/30'
              )}
            />
          </button>
        )
      })}
    </div>
  )
}

export default function CheckoutFeedback() {
  const t = useTranslation() as Record<string, string>

  const [inlineHover, setInlineHover] = useState(0)
  const [rating, setRating] = useState(0)
  const [dialogHover, setDialogHover] = useState(0)
  const [comment, setComment] = useState('')
  const [open, setOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const { loading, execute } = useAction<{ id: string }>({
    successMessage: t.checkout_feedback_success_toast,
    onSuccess: () => {
      setOpen(false)
      setSubmitted(true)
    },
  })

  const ratingAria = (value: number) =>
    t.checkout_feedback_star_aria?.replace('{{count}}', String(value)) ?? `${value}`

  const openWithRating = (value: number) => {
    setRating(value)
    setDialogHover(0)
    setOpen(true)
  }

  const handleSubmit = () => {
    if (rating < 1) return
    execute(() =>
      submitCheckoutFeedbackAction({
        rating,
        comment: comment.trim() || undefined,
      })
    )
  }

  if (submitted) {
    return (
      <div className="mt-8 flex flex-col items-center gap-2 rounded-xl border bg-muted/30 px-5 py-6 text-center">
        <CheckCircle2Icon className="size-6 text-emerald-600" aria-hidden="true" />
        <p className="text-sm font-semibold">{t.checkout_feedback_success_title}</p>
        <p className="text-xs text-muted-foreground">{t.checkout_feedback_success_message}</p>
      </div>
    )
  }

  return (
    <>
      <div className="mt-8 flex flex-col items-center gap-3 rounded-xl border bg-muted/30 px-5 py-6 text-center">
        <p className="text-sm font-semibold">{t.checkout_feedback_prompt}</p>
        <StarRow
          value={rating}
          hover={inlineHover}
          onSelect={openWithRating}
          onHover={setInlineHover}
          size="size-8"
          ariaLabel={ratingAria}
        />
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t.checkout_feedback_dialog_title}</DialogTitle>
            <DialogDescription>{t.checkout_feedback_dialog_subtitle}</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center gap-2 py-2">
            <StarRow
              value={rating}
              hover={dialogHover}
              onSelect={setRating}
              onHover={setDialogHover}
              size="size-9"
              ariaLabel={ratingAria}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="checkout-feedback-comment" className="text-sm font-medium">
              {t.checkout_feedback_comment_label}
            </label>
            <Textarea
              id="checkout-feedback-comment"
              value={comment}
              onChange={e => setComment(e.target.value)}
              maxLength={COMMENT_MAX_LENGTH}
              placeholder={t.checkout_feedback_comment_placeholder}
              className="min-h-24 pt-2"
            />
          </div>

          <div className="mt-2 flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="h-11 flex-1"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              {t.checkout_feedback_cancel}
            </Button>
            <Button
              type="button"
              className="h-11 flex-1"
              onClick={handleSubmit}
              disabled={loading || rating < 1}
            >
              {t.checkout_feedback_submit}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
