'use client'

import { useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { InputFormField } from '@/components/form/input-form-field'
import { FileUploaderFormField } from '@/components/form/file-uploader-form-field'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/context/translation.context'
import {
  ExperienceImageFormSchema,
  type ExperienceImageFormValues,
} from '@/lib/schemas/forms/experience-image.form.schema'
import { createImageAction } from '@/lib/actions/experience-images.actions'
import { useAction } from '@/lib/hooks/use-action'
import { LoaderIcon } from '@/lib/constants/icons'
import type { ExperienceImage } from '@/lib/schemas/entities/experience.entity.schema'

type ImageFormDialogProps = {
  experienceId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ImageFormDialog({ experienceId, open, onOpenChange }: ImageFormDialogProps) {
  const router = useRouter()
  const t = useTranslation()

  const form = useForm<ExperienceImageFormValues>({
    resolver: zodResolver(ExperienceImageFormSchema),
    defaultValues: {
      image: undefined,
      order: 0,
    },
  })

  const { loading, execute } = useAction<ExperienceImage>({
    successMessage: t.admin_image_create_success,
    onSuccess: () => {
      onOpenChange(false)
      form.reset()
      router.refresh()
    },
  })

  const onSubmit = async (data: ExperienceImageFormValues) => {
    const fd = new FormData()
    fd.append('image', data.image)
    fd.append('order', String(data.order))
    await execute(() => createImageAction(experienceId, fd))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.admin_image_add}</DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FileUploaderFormField<ExperienceImageFormValues>
              name="image"
              label={t.admin_image_file}
              required
            />
            <InputFormField<ExperienceImageFormValues> name="order" label={t.admin_image_order} />
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
