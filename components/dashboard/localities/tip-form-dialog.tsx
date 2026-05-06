'use client'

import { useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { InputFormField } from '@/components/form/input-form-field'
import { TextareaFormField } from '@/components/form/textarea-form-field'
import { FileUploaderFormField } from '@/components/form/file-uploader-form-field'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/context/translation.context'
import { TipFormSchema, type TipFormValues } from '@/lib/schemas/forms/tip.form.schema'
import { createTipAction, updateTipAction } from '@/lib/actions/tips.actions'
import { toFormData } from '@/lib/utils/form-data.utils'
import { useAction } from '@/lib/hooks/use-action'
import { LoaderIcon } from '@/lib/constants/icons'
import type { Tip } from '@/lib/schemas/entities/tips.entity.schema'

type TipFormDialogProps = {
  localityId: string
  mode: 'create' | 'edit'
  tip?: Tip
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function TipFormDialog({ localityId, mode, tip, open, onOpenChange }: TipFormDialogProps) {
  const router = useRouter()
  const t = useTranslation()

  const form = useForm<TipFormValues>({
    resolver: zodResolver(TipFormSchema),
    defaultValues: {
      title: tip?.title ?? '',
      description: tip?.description ?? '',
      cover: tip?.cover ?? null,
    },
  })

  const { loading, execute } = useAction<Tip>({
    successMessage: mode === 'create' ? t.admin_tip_create_success : t.admin_tip_update_success,
    onSuccess: () => {
      onOpenChange(false)
      form.reset()
      router.refresh()
    },
  })

  const onSubmit = async (data: TipFormValues) => {
    const fd = toFormData(data, ['cover'])
    await execute(() =>
      mode === 'create' ? createTipAction(localityId, fd) : updateTipAction(tip?.id ?? '', fd)
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? t.admin_tip_add : t.admin_tip_edit}</DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <InputFormField<TipFormValues> name="title" label={t.admin_tip_title} required />

            <TextareaFormField<TipFormValues>
              name="description"
              label={t.admin_tip_description}
              required
              rows={4}
              maxLength={500}
            />

            <FileUploaderFormField<TipFormValues> name="cover" label={t.admin_tip_cover} />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                {t.admin_common_cancel}
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <LoaderIcon className="size-4 animate-spin" />}
                {loading ? t.admin_loc_saving : t.admin_loc_save}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
