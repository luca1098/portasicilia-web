'use client'

import { useParams, useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/context/translation.context'
import {
  ShopCategoryFormSchema,
  type ShopCategoryFormValues,
} from '@/lib/schemas/forms/shop-category.form.schema'
import { createShopCategoryAction } from '@/lib/actions/shop-categories.actions'
import { toFormData } from '@/lib/utils/form-data.utils'
import { useAction } from '@/lib/hooks/use-action'
import { LoaderIcon } from '@/lib/constants/icons'
import type { ShopCategory } from '@/lib/schemas/entities/product.entity.schema'
import { ShopCategoryFormFields } from './shop-category-form-fields'

export default function ShopCategoryCreateForm() {
  const router = useRouter()
  const params = useParams()
  const lang = params.lang as string
  const t = useTranslation()

  const { loading, execute } = useAction<ShopCategory>({
    successMessage: t.admin_shop_cat_create_success,
    onSuccess: () => router.push(`/${lang}/dashboard/admin/shop-categories`),
  })

  const form = useForm<ShopCategoryFormValues>({
    resolver: zodResolver(ShopCategoryFormSchema),
    defaultValues: {
      name: '',
      description: '',
      icon: '',
      cover: null,
      sortOrder: 0,
    },
  })

  const onSubmit = async (data: ShopCategoryFormValues) => {
    const fd = toFormData(data, ['cover'])
    await execute(() => createShopCategoryAction(fd))
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ShopCategoryFormFields />

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading && <LoaderIcon className="size-4 animate-spin" />}
            {loading ? t.admin_shop_cat_saving : t.admin_shop_cat_save}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
