'use client'

import { useCallback, type ReactNode } from 'react'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import { InputFormField } from '@/components/form/input-form-field'
import { TextareaFormField } from '@/components/form/textarea-form-field'
import { CheckboxFormField } from '@/components/form/checkbox-form-field'
import { FileUploaderFormField } from '@/components/form/file-uploader-form-field'
import { SelectFormField } from '@/components/form/select-form-field'
import { ComboboxFormField } from '@/components/form/combobox-form-field'
import { CurrencyFormField } from '@/components/form/currency-form-field'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/context/translation.context'
import { formatCurrency } from '@/lib/utils/format.utils'
import { searchOwnersAction } from '@/lib/actions/owners.actions'
import { PlusIcon, Trash2Icon } from '@/lib/constants/icons'
import type { ProductFormValues } from '@/lib/schemas/forms/product.form.schema'
import type { Owner } from '@/lib/schemas/entities/owner.entity.schema'
import type { ShopCategory } from '@/lib/schemas/entities/product.entity.schema'

const UNIT_OPTIONS = ['L', 'ml', 'KG', 'g', 'pz'] as const
const COMMISSION_TYPES = ['PERCENTAGE', 'FLAT'] as const

export const PRODUCT_GENERAL_FIELDS = [
  'name',
  'shortDescription',
  'description',
  'categoryId',
  'ownerId',
  'cover',
  'highlighted',
  'active',
] as const

type GeneralFieldsProps = {
  shopCategories: ShopCategory[]
  defaultOwner?: Owner
  children?: ReactNode
}

export function ProductGeneralFields({ shopCategories, defaultOwner, children }: GeneralFieldsProps) {
  const t = useTranslation()

  const handleSearchOwners = useCallback(async (query: string): Promise<Owner[]> => {
    const result = await searchOwnersAction(query)
    return result.success && result.data ? result.data : []
  }, [])

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-4">
      <InputFormField<ProductFormValues> name="name" label={t.admin_product_name} required />

      <TextareaFormField<ProductFormValues>
        name="shortDescription"
        label={t.admin_product_short_description}
        maxLength={500}
      />

      <TextareaFormField<ProductFormValues>
        name="description"
        label={t.admin_product_description}
        maxLength={5000}
      />

      <SelectFormField<ProductFormValues, ShopCategory>
        name="categoryId"
        label={t.admin_product_category}
        options={shopCategories}
        getValue={c => c.id}
        getLabel={c => c.name}
      />

      <ComboboxFormField<ProductFormValues, Owner>
        name="ownerId"
        label={t.admin_product_owner}
        onSearch={handleSearchOwners}
        defaultOption={defaultOwner}
        getValue={o => o.id}
        getLabel={o => `${o.firstName} ${o.lastName}`}
        getKey={o => o.id}
      />

      <FileUploaderFormField<ProductFormValues> name="cover" label={t.admin_product_cover} maxSizeMB={3} />

      <CheckboxFormField<ProductFormValues>
        name="highlighted"
        label={t.admin_product_highlighted}
        description={t.admin_product_highlighted_hint}
      />

      {children}
    </div>
  )
}

export function ProductActiveField() {
  const t = useTranslation()
  return (
    <CheckboxFormField<ProductFormValues>
      name="active"
      label={t.admin_product_active}
      description={t.admin_product_active_hint}
    />
  )
}

function VariantCommissionSection({ index }: { index: number }) {
  const t = useTranslation()
  const { control } = useFormContext<ProductFormValues>()

  const commissionType = useWatch({ control, name: `variants.${index}.commissionType` })
  const commissionValue = useWatch({ control, name: `variants.${index}.commissionValue` })
  const price = useWatch({ control, name: `variants.${index}.price` })

  const numericCommission = commissionValue ? Number(commissionValue) : 0
  const numericPrice = price ? Number(price) : 0

  const unitCommission = (() => {
    if (!commissionType || numericCommission <= 0 || numericPrice <= 0) return 0
    if (commissionType === 'PERCENTAGE') return numericPrice * (numericCommission / 100)
    return numericCommission
  })()

  return (
    <div className="rounded-lg border border-dashed border-border bg-background p-3 space-y-3">
      <p className="text-xs font-semibold text-muted-foreground">{t.admin_product_commission_section}</p>

      <div className="grid grid-cols-2 gap-3">
        <SelectFormField<ProductFormValues, (typeof COMMISSION_TYPES)[number]>
          name={`variants.${index}.commissionType`}
          label={t.admin_product_commission_type}
          options={[...COMMISSION_TYPES]}
          getValue={v => v}
          getLabel={v => t[`admin_product_commission_type_${v.toLowerCase()}` as keyof typeof t] as string}
        />
        <CurrencyFormField<ProductFormValues>
          name={`variants.${index}.commissionValue`}
          label={t.admin_product_commission_value}
          suffix={commissionType === 'PERCENTAGE' ? '%' : '€'}
        />
      </div>

      {unitCommission > 0 && (
        <div className="flex flex-col gap-1 rounded-md bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
          <span>
            {t.admin_product_commission_per_unit}:{' '}
            <strong>{formatCurrency(unitCommission.toFixed(2))}</strong>
          </span>
          <span>{t.admin_product_commission_per_unit_hint}</span>
        </div>
      )}
    </div>
  )
}

export function ProductVariantsFields() {
  const t = useTranslation()
  const {
    control,
    formState: { errors },
  } = useFormContext<ProductFormValues>()
  const { fields, append, remove } = useFieldArray({ control, name: 'variants' })
  const unitOptions = UNIT_OPTIONS.map(u => ({ value: u, label: u }))

  const handleAddVariant = () =>
    append({
      volume: 0,
      unitOfMeasurement: 'L',
      price: 0,
      compareAtPrice: undefined,
      stock: 0,
      maxQuantityPerOrder: 10,
      commissionType: undefined,
      commissionValue: undefined,
    })

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{t.admin_product_variants}</span>
        <Button type="button" variant="outline" size="sm" onClick={handleAddVariant}>
          <PlusIcon className="size-4" />
          {t.admin_product_add_variant}
        </Button>
      </div>

      {fields.length === 0 && (
        <p
          className={
            errors.variants && !Array.isArray(errors.variants)
              ? 'text-sm text-destructive'
              : 'text-sm text-muted-foreground'
          }
        >
          {errors.variants && !Array.isArray(errors.variants)
            ? t.admin_product_variants_required
            : t.admin_product_add_variant}
        </p>
      )}

      {fields.map((field, index) => (
        <div key={field.id} className="rounded-lg border border-border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              #{index + 1}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => remove(index)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2Icon className="size-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <InputFormField<ProductFormValues>
              name={`variants.${index}.volume`}
              label={t.admin_product_volume}
              type="number"
              step="0.01"
              required
            />

            <SelectFormField<ProductFormValues, { value: string; label: string }>
              name={`variants.${index}.unitOfMeasurement`}
              label={t.admin_product_unit}
              options={unitOptions}
              getValue={o => o.value}
              getLabel={o => o.label}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <InputFormField<ProductFormValues>
              name={`variants.${index}.price`}
              label={t.admin_product_price}
              description={t.admin_product_price_hint}
              type="number"
              step="0.01"
              required
            />

            <InputFormField<ProductFormValues>
              name={`variants.${index}.compareAtPrice`}
              label={t.admin_product_compare_price}
              description={t.admin_product_compare_price_hint}
              type="number"
              step="0.01"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <InputFormField<ProductFormValues>
              name={`variants.${index}.stock`}
              label={t.admin_product_stock}
              type="number"
              min="0"
            />

            <InputFormField<ProductFormValues>
              name={`variants.${index}.maxQuantityPerOrder`}
              label={t.admin_product_max_qty}
              type="number"
              min="1"
            />
          </div>

          <VariantCommissionSection index={index} />
        </div>
      ))}

      {errors.variants && !Array.isArray(errors.variants) && fields.length > 0 && (
        <p className="text-sm text-destructive">{errors.variants.message}</p>
      )}
    </div>
  )
}
