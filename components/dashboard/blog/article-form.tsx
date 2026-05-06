'use client'

import { useParams, useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { InputFormField } from '@/components/form/input-form-field'
import { TextareaFormField } from '@/components/form/textarea-form-field'
import { FileUploaderFormField } from '@/components/form/file-uploader-form-field'
import { SelectFormField } from '@/components/form/select-form-field'
import { RichTextFormField } from '@/components/form/rich-text-form-field'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/context/translation.context'
import { ArticleFormSchema, type ArticleFormValues } from '@/lib/schemas/forms/article.form.schema'
import { createArticleAction, updateArticleAction } from '@/lib/actions/blog.actions'
import { toFormData } from '@/lib/utils/form-data.utils'
import { useAction } from '@/lib/hooks/use-action'
import { LoaderIcon } from '@/lib/constants/icons'
import type { Article } from '@/lib/schemas/entities/article.entity.schema'
import type { Author } from '@/lib/schemas/entities/author.entity.schema'
import type { Category } from '@/lib/schemas/entities/category.entity.schema'

type Locality = { id: string; name: string }

type SelectOption = { value: string; label: string }

type ArticleFormProps = {
  mode: 'create' | 'edit'
  article?: Article
  authors: Author[]
  categories: Category[]
  localities: Locality[]
}

export default function ArticleForm({ mode, article, authors, categories, localities }: ArticleFormProps) {
  const router = useRouter()
  const params = useParams()
  const lang = params.lang as string
  const t = useTranslation()

  const { loading, execute } = useAction<Article>({
    successMessage: mode === 'create' ? t.admin_article_create_success : t.admin_article_update_success,
    onSuccess: () => router.push(`/${lang}/dashboard/admin/blog`),
  })

  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(ArticleFormSchema),
    defaultValues: {
      title: article?.title ?? '',
      excerpt: article?.excerpt ?? '',
      content: article?.content ?? '',
      cover: article?.cover ?? null,
      status: article?.status ?? 'DRAFT',
      authorId: article?.authorId ?? '',
      categoryId: article?.categoryId ?? 'none',
      localityId: article?.localityId ?? 'none',
    },
  })

  const onSubmit = async (data: ArticleFormValues) => {
    const cleaned = {
      ...data,
      categoryId: data.categoryId === 'none' ? '' : data.categoryId,
      localityId: data.localityId === 'none' ? '' : data.localityId,
    }
    const fd = toFormData(cleaned, ['cover'])
    await execute(() =>
      mode === 'create' ? createArticleAction(fd) : updateArticleAction(article?.id ?? '', fd)
    )
  }

  const statusOptions: SelectOption[] = [
    { value: 'DRAFT', label: t.admin_article_status_draft },
    { value: 'PUBLISHED', label: t.admin_article_status_published },
    { value: 'ARCHIVED', label: t.admin_article_status_archived },
  ]

  const authorOptions: SelectOption[] = authors.map(a => ({ value: a.id, label: a.name }))

  const categoryOptions: SelectOption[] = [
    { value: 'none', label: '—' },
    ...categories.map(c => ({ value: c.id, label: c.name })),
  ]

  const localityOptions: SelectOption[] = [
    { value: 'none', label: '—' },
    ...localities.map(l => ({ value: l.id, label: l.name })),
  ]

  const getValue = (o: SelectOption) => o.value
  const getLabel = (o: SelectOption) => o.label

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <InputFormField<ArticleFormValues> name="title" label={t.admin_article_title} required />

          <TextareaFormField<ArticleFormValues>
            name="excerpt"
            label={t.admin_article_excerpt}
            maxLength={300}
            required
          />

          <RichTextFormField<ArticleFormValues> name="content" label={t.admin_article_content} required />

          <FileUploaderFormField<ArticleFormValues>
            name="cover"
            label={t.admin_article_cover}
            maxSizeMB={5}
          />
        </div>

        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <SelectFormField<ArticleFormValues, SelectOption>
            name="status"
            label={t.admin_article_status}
            options={statusOptions}
            getValue={getValue}
            getLabel={getLabel}
          />

          <SelectFormField<ArticleFormValues, SelectOption>
            name="authorId"
            label={t.admin_article_author}
            options={authorOptions}
            getValue={getValue}
            getLabel={getLabel}
            required
          />

          <SelectFormField<ArticleFormValues, SelectOption>
            name="categoryId"
            label={t.admin_article_category}
            options={categoryOptions}
            getValue={getValue}
            getLabel={getLabel}
          />

          <SelectFormField<ArticleFormValues, SelectOption>
            name="localityId"
            label={t.admin_article_locality}
            options={localityOptions}
            getValue={getValue}
            getLabel={getLabel}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading && <LoaderIcon className="size-4 animate-spin" />}
            {loading ? t.admin_article_saving : t.admin_article_save}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
