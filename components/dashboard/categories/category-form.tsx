'use client'

import { useParams, useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { InputFormField } from '@/components/form/input-form-field'
import { TextareaFormField } from '@/components/form/textarea-form-field'
import { CheckboxFormField } from '@/components/form/checkbox-form-field'
import { FileUploaderFormField } from '@/components/form/file-uploader-form-field'
import CategoryIconPicker from './category-icon-picker'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/context/translation.context'
import { CategoryFormSchema, type CategoryFormValues } from '@/lib/schemas/forms/category.form.schema'
import { createCategoryAction, updateCategoryAction } from '@/lib/actions/categories.actions'
import { toFormData } from '@/lib/utils/form-data.utils'
import { useAction } from '@/lib/hooks/use-action'
import { LoaderIcon } from '@/lib/constants/icons'
import type { Category } from '@/lib/schemas/entities/category.entity.schema'

type CategoryFormProps = {
  mode: 'create' | 'edit'
  category?: Category
}

export default function CategoryForm({ mode, category }: CategoryFormProps) {
  const router = useRouter()
  const params = useParams()
  const lang = params.lang as string
  const t = useTranslation()

  const { loading, execute } = useAction<Category>({
    successMessage: mode === 'create' ? t.admin_cat_create_success : t.admin_cat_update_success,
    onSuccess: () => router.push(`/${lang}/dashboard/admin/categories`),
  })

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(CategoryFormSchema),
    defaultValues: {
      name: category?.name ?? '',
      description: category?.description ?? '',
      icon: category?.icon ?? '',
      cover: category?.cover ?? null,
      highlighted: category?.highlighted ?? false,
    },
  })

  const onSubmit = async (data: CategoryFormValues) => {
    const fd = toFormData(data, ['cover'])
    await execute(() =>
      mode === 'create' ? createCategoryAction(fd) : updateCategoryAction(category?.id ?? '', fd)
    )
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <InputFormField<CategoryFormValues> name="name" label={t.admin_cat_name} required />

          <TextareaFormField<CategoryFormValues>
            name="description"
            label={t.admin_cat_description}
            maxLength={500}
          />

          <CategoryIconPicker />

          <FileUploaderFormField<CategoryFormValues> name="cover" label={t.admin_cat_cover} maxSizeMB={3} />

          <CheckboxFormField<CategoryFormValues>
            name="highlighted"
            label={t.admin_cat_highlighted}
            description={t.admin_cat_highlighted_hint}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading && <LoaderIcon className="size-4 animate-spin" />}
            {loading ? t.admin_cat_saving : t.admin_cat_save}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
