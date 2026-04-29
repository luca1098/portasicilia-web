'use client'

import { useFormContext, useWatch } from 'react-hook-form'
import { InputFormField } from '@/components/form/input-form-field'
import { TextareaFormField } from '@/components/form/textarea-form-field'
import { FileUploaderFormField } from '@/components/form/file-uploader-form-field'
import EmojiPicker from '@/components/ui/emoji-picker'
import { useTranslation } from '@/lib/context/translation.context'
import type { ShopCategoryFormValues } from '@/lib/schemas/forms/shop-category.form.schema'

export function ShopCategoryFormFields() {
  const t = useTranslation()
  const { control, setValue } = useFormContext<ShopCategoryFormValues>()
  const iconValue = useWatch({ control, name: 'icon' })

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-4">
      <InputFormField<ShopCategoryFormValues> name="name" label={t.admin_shop_cat_name} required />

      <TextareaFormField<ShopCategoryFormValues>
        name="description"
        label={t.admin_shop_cat_description}
        maxLength={500}
      />

      <EmojiPicker
        label={t.admin_shop_cat_icon}
        value={iconValue}
        onChange={emoji => setValue('icon', emoji, { shouldDirty: true })}
      />

      <FileUploaderFormField<ShopCategoryFormValues>
        name="cover"
        label={t.admin_shop_cat_cover}
        maxSizeMB={3}
      />

      <InputFormField<ShopCategoryFormValues>
        name="sortOrder"
        label={t.admin_shop_cat_sort_order}
        type="number"
      />
    </div>
  )
}
