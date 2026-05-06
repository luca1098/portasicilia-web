'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/context/translation.context'
import { ProductFormSchema, type ProductFormValues } from '@/lib/schemas/forms/product.form.schema'
import { updateProductAction } from '@/lib/actions/products.actions'
import { useAction } from '@/lib/hooks/use-action'
import { AlertCircleIcon, LoaderIcon } from '@/lib/constants/icons'
import type { Product, ShopCategory } from '@/lib/schemas/entities/product.entity.schema'
import ProductImageList from './product-image-list'
import {
  PRODUCT_GENERAL_FIELDS,
  ProductActiveField,
  ProductGeneralFields,
  ProductVariantsFields,
} from './product-form-fields'

type ProductEditFormProps = {
  product: Product
  shopCategories: ShopCategory[]
}

export default function ProductEditForm({ product, shopCategories }: ProductEditFormProps) {
  const router = useRouter()
  const params = useParams()
  const lang = params.lang as string
  const t = useTranslation()

  const [activeTab, setActiveTab] = useState<string>('general')

  const { loading, execute } = useAction<Product>({
    successMessage: t.admin_product_update_success,
    onSuccess: () => router.push(`/${lang}/dashboard/admin/products`),
  })

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      name: product.name,
      shortDescription: product.shortDescription ?? '',
      description: product.description ?? '',
      categoryId: product.categoryId ?? '',
      ownerId: product.ownerId ?? '',
      cover: product.cover ?? null,
      highlighted: product.highlighted,
      active: product.active,
      variants: product.variants.map(v => ({
        id: v.id,
        volume: v.volume,
        unitOfMeasurement: v.unitOfMeasurement,
        price: v.price,
        compareAtPrice: v.compareAtPrice ?? undefined,
        stock: v.stock,
        maxQuantityPerOrder: v.maxQuantityPerOrder,
        commissionType: v.commissionType ?? undefined,
        commissionValue:
          v.commissionValue == null
            ? undefined
            : v.commissionType === 'PERCENTAGE'
              ? Number(v.commissionValue) * 100
              : Number(v.commissionValue),
      })),
    },
  })

  const errors = form.formState.errors
  const hasGeneralErrors = PRODUCT_GENERAL_FIELDS.some(f => f in errors)
  const hasVariantsErrors = 'variants' in errors

  const onSubmit = async (data: ProductFormValues) => {
    const fd = new FormData()
    fd.append('name', data.name)
    if (data.shortDescription) fd.append('shortDescription', data.shortDescription)
    if (data.description) fd.append('description', data.description)
    if (data.categoryId) fd.append('categoryId', data.categoryId)
    if (data.ownerId) fd.append('ownerId', data.ownerId)
    if (data.cover instanceof File) fd.append('cover', data.cover)
    fd.append('highlighted', String(data.highlighted))
    fd.append('active', String(data.active))

    const normalizedVariants = data.variants.map(v => {
      if (!v.commissionType || v.commissionValue == null) {
        const { commissionType: _ct, commissionValue: _cv, ...rest } = v
        return rest
      }
      return {
        ...v,
        commissionValue: v.commissionType === 'PERCENTAGE' ? v.commissionValue / 100 : v.commissionValue,
      }
    })
    fd.append('variants', JSON.stringify(normalizedVariants))

    await execute(() => updateProductAction(product.id, fd))
  }

  const onInvalid = () => {
    setActiveTab(hasGeneralErrors ? 'general' : 'variants')
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="w-full justify-start">
        <TabsTrigger value="general">
          {t.admin_product_tab_general}
          {hasGeneralErrors && (
            <AlertCircleIcon className="text-destructive" aria-label={t.admin_product_tab_has_errors} />
          )}
        </TabsTrigger>
        <TabsTrigger value="variants">
          {t.admin_product_tab_variants}
          {hasVariantsErrors && (
            <AlertCircleIcon className="text-destructive" aria-label={t.admin_product_tab_has_errors} />
          )}
        </TabsTrigger>
        <TabsTrigger value="images">{t.admin_image_section_title}</TabsTrigger>
      </TabsList>

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-6">
          <TabsContent value="general" className="mt-6">
            <ProductGeneralFields shopCategories={shopCategories} defaultOwner={product.owner ?? undefined}>
              <ProductActiveField />
            </ProductGeneralFields>
          </TabsContent>

          <TabsContent value="variants" className="mt-6">
            <ProductVariantsFields />
          </TabsContent>

          {activeTab !== 'images' && (
            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading && <LoaderIcon className="size-4 animate-spin" />}
                {loading ? t.admin_product_saving : t.admin_product_save}
              </Button>
            </div>
          )}
        </form>
      </FormProvider>

      <TabsContent value="images" className="mt-6">
        <ProductImageList productId={product.id} images={product.images} />
      </TabsContent>
    </Tabs>
  )
}
