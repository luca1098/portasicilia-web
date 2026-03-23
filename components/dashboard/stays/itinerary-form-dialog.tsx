'use client'

import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { InputFormField } from '@/components/form/input-form-field'
import { TextareaFormField } from '@/components/form/textarea-form-field'
import { FileUploaderFormField } from '@/components/form/file-uploader-form-field'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/context/translation.context'
import {
  ExperienceItineraryFormSchema,
  type ExperienceItineraryFormValues,
} from '@/lib/schemas/forms/experience-itinerary.form.schema'
import { createStayItineraryAction, updateStayItineraryAction } from '@/lib/actions/stay-itinerary.actions'
import { toFormData } from '@/lib/utils/form-data.utils'
import { useAction } from '@/lib/hooks/use-action'
import { LoaderIcon } from '@/lib/constants/icons'
import type { ExperienceItinerary } from '@/lib/schemas/entities/experience.entity.schema'

type ItineraryFormDialogProps = {
  stayId: string
  mode: 'create' | 'edit'
  item?: ExperienceItinerary
  itemCount?: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (item: ExperienceItinerary) => void
}

export default function ItineraryFormDialog({
  stayId,
  mode,
  item,
  itemCount = 0,
  open,
  onOpenChange,
  onSuccess,
}: ItineraryFormDialogProps) {
  const t = useTranslation()

  const form = useForm<ExperienceItineraryFormValues>({
    resolver: zodResolver(ExperienceItineraryFormSchema),
    defaultValues: {
      title: item?.title ?? '',
      description: item?.description ?? '',
      image: item?.image ?? null,
      order: item?.order ?? itemCount,
    },
  })

  const { loading, execute } = useAction<ExperienceItinerary>({
    successMessage: mode === 'create' ? t.admin_itinerary_create_success : t.admin_itinerary_update_success,
    onSuccess: data => {
      onOpenChange(false)
      form.reset()
      if (data) onSuccess?.(data)
    },
  })

  const onSubmit = async (data: ExperienceItineraryFormValues) => {
    const fd = toFormData(data, ['image'])
    await execute(() =>
      mode === 'create'
        ? createStayItineraryAction(stayId, fd)
        : updateStayItineraryAction(stayId, item?.id ?? '', fd)
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? t.admin_itinerary_add : t.admin_itinerary_edit}</DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <InputFormField<ExperienceItineraryFormValues>
              name="title"
              label={t.admin_itinerary_title}
              required
            />
            <TextareaFormField<ExperienceItineraryFormValues>
              name="description"
              label={t.admin_itinerary_description}
              required
              rows={3}
            />
            <FileUploaderFormField<ExperienceItineraryFormValues>
              name="image"
              label={t.admin_itinerary_image}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                {t.admin_common_cancel}
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <LoaderIcon className="size-4 animate-spin" />}
                {loading ? t.admin_exp_saving : t.admin_exp_save}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
