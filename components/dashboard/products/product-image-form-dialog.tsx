'use client'

import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { FileUploaderFormField } from '@/components/form/file-uploader-form-field'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/context/translation.context'
import {
  ExperienceImageFormSchema,
  type ExperienceImageFormValues,
} from '@/lib/schemas/forms/experience-image.form.schema'
import { createProductImageAction } from '@/lib/actions/product-images.actions'
import { useAction } from '@/lib/hooks/use-action'
import { LoaderIcon } from '@/lib/constants/icons'
import type { ProductImage } from '@/lib/schemas/entities/product.entity.schema'

type ProductImageFormDialogProps = {
  productId: string
  imageCount?: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (image: ProductImage) => void
}

export default function ProductImageFormDialog({
  productId,
  imageCount = 0,
  open,
  onOpenChange,
  onSuccess,
}: ProductImageFormDialogProps) {
  const t = useTranslation()

  const form = useForm<ExperienceImageFormValues>({
    resolver: zodResolver(ExperienceImageFormSchema),
    defaultValues: {
      image: undefined,
      order: imageCount,
    },
  })

  const { loading, execute } = useAction<ProductImage>({
    successMessage: t.admin_image_create_success,
    onSuccess: data => {
      onOpenChange(false)
      form.reset()
      if (data) onSuccess?.(data)
    },
  })

  const onSubmit = async (data: ExperienceImageFormValues) => {
    const fd = new FormData()
    fd.append('file', data.image)
    fd.append('order', String(data.order))
    await execute(() => createProductImageAction(productId, fd))
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
              maxSizeMB={3}
              required
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
