'use client'

import { useParams, useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/context/translation.context'
import { ProductCreateFormSchema, type ProductFormValues } from '@/lib/schemas/forms/product.form.schema'
import { createProductAction } from '@/lib/actions/products.actions'
import { useAction } from '@/lib/hooks/use-action'
import { LoaderIcon } from '@/lib/constants/icons'
import type { Product, ShopCategory } from '@/lib/schemas/entities/product.entity.schema'
import { ProductGeneralFields } from './product-form-fields'

type ProductCreateFormProps = {
  shopCategories: ShopCategory[]
}

export default function ProductCreateForm({ shopCategories }: ProductCreateFormProps) {
  const router = useRouter()
  const params = useParams()
  const lang = params.lang as string
  const t = useTranslation()

  const { loading, execute } = useAction<Product>({
    successMessage: t.admin_product_create_success,
    onSuccess: created => {
      if (!created) return
      router.replace(`/${lang}/dashboard/admin/products/${created.id}`)
    },
  })

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(ProductCreateFormSchema),
    defaultValues: {
      name: '',
      shortDescription: '',
      description: '',
      categoryId: '',
      ownerId: '',
      cover: null,
      highlighted: false,
      active: false,
      variants: [],
    },
  })

  const onSubmit = async (data: ProductFormValues) => {
    const fd = new FormData()
    fd.append('name', data.name)
    if (data.shortDescription) fd.append('shortDescription', data.shortDescription)
    if (data.description) fd.append('description', data.description)
    if (data.categoryId) fd.append('categoryId', data.categoryId)
    if (data.ownerId) fd.append('ownerId', data.ownerId)
    if (data.cover instanceof File) fd.append('cover', data.cover)
    fd.append('highlighted', String(data.highlighted))
    fd.append('active', 'false')

    await execute(() => createProductAction(fd))
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ProductGeneralFields shopCategories={shopCategories} />

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading && <LoaderIcon className="size-4 animate-spin" />}
            {loading ? t.admin_product_saving : t.admin_product_save}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
