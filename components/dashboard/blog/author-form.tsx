'use client'

import { useParams, useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { InputFormField } from '@/components/form/input-form-field'
import { TextareaFormField } from '@/components/form/textarea-form-field'
import { FileUploaderFormField } from '@/components/form/file-uploader-form-field'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/context/translation.context'
import { AuthorFormSchema, type AuthorFormValues } from '@/lib/schemas/forms/author.form.schema'
import { createAuthorAction, updateAuthorAction } from '@/lib/actions/blog.actions'
import { toFormData } from '@/lib/utils/form-data.utils'
import { useAction } from '@/lib/hooks/use-action'
import { LoaderIcon } from '@/lib/constants/icons'
import type { Author } from '@/lib/schemas/entities/author.entity.schema'

type AuthorFormProps = {
  mode: 'create' | 'edit'
  author?: Author
}

export default function AuthorForm({ mode, author }: AuthorFormProps) {
  const router = useRouter()
  const params = useParams()
  const lang = params.lang as string
  const t = useTranslation()

  const { loading, execute } = useAction<Author>({
    successMessage: mode === 'create' ? t.admin_author_create_success : t.admin_author_update_success,
    onSuccess: () => router.push(`/${lang}/dashboard/admin/blog/authors`),
  })

  const form = useForm<AuthorFormValues>({
    resolver: zodResolver(AuthorFormSchema),
    defaultValues: {
      name: author?.name ?? '',
      bio: author?.bio ?? '',
      avatar: author?.avatar ?? null,
    },
  })

  const onSubmit = async (data: AuthorFormValues) => {
    const fd = toFormData(data, ['avatar'])
    await execute(() =>
      mode === 'create' ? createAuthorAction(fd) : updateAuthorAction(author?.id ?? '', fd)
    )
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <InputFormField<AuthorFormValues> name="name" label={t.admin_author_name} required />
          <TextareaFormField<AuthorFormValues> name="bio" label={t.admin_author_bio} maxLength={500} />
          <FileUploaderFormField<AuthorFormValues>
            name="avatar"
            label={t.admin_author_avatar}
            maxSizeMB={3}
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading && <LoaderIcon className="size-4 animate-spin" />}
            {loading ? t.admin_author_saving : t.admin_author_save}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
