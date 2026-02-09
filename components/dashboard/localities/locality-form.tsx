'use client'

import { useParams, useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { InputFormField } from '@/components/form/input-form-field'
import { FileUploaderFormField } from '@/components/form/file-uploader-form-field'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/context/translation.context'
import { LocalityFormSchema, type LocalityFormValues } from '@/lib/schemas/forms/locality.form.schema'
import { createLocalityAction, updateLocalityAction } from '@/lib/actions/localities.actions'
import { toFormData } from '@/lib/utils/form-data.utils'
import { useAction } from '@/lib/hooks/use-action'
import { LoaderIcon } from '@/lib/constants/icons'
import type { Locality } from '@/lib/schemas/entities/locality.entity.schema'

type LocalityFormProps = {
  mode: 'create' | 'edit'
  locality?: Locality
}

export default function LocalityForm({ mode, locality }: LocalityFormProps) {
  const router = useRouter()
  const params = useParams()
  const lang = params.lang as string
  const t = useTranslation()

  const { loading, execute } = useAction<Locality>({
    successMessage: mode === 'create' ? t.admin_loc_create_success : t.admin_loc_update_success,
    onSuccess: () => router.push(`/${lang}/dashboard/admin/locations`),
  })

  const form = useForm<LocalityFormValues>({
    resolver: zodResolver(LocalityFormSchema),
    defaultValues: {
      name: locality?.name ?? '',
      cover: locality?.cover ?? null,
    },
  })

  const onSubmit = async (data: LocalityFormValues) => {
    const fd = toFormData(data, ['cover'])
    await execute(() =>
      mode === 'create' ? createLocalityAction(fd) : updateLocalityAction(locality?.id ?? '', fd)
    )
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <InputFormField<LocalityFormValues> name="name" label={t.admin_loc_name} required />

          <FileUploaderFormField<LocalityFormValues> name="cover" label={t.admin_loc_cover} />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading && <LoaderIcon className="size-4 animate-spin" />}
            {loading ? t.admin_loc_saving : t.admin_loc_save}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
