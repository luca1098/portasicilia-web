'use client'

import { useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from '@/lib/context/translation.context'
import EmojiPicker from '@/components/ui/emoji-picker'
import type { CategoryFormValues } from '@/lib/schemas/forms/category.form.schema'

export default function CategoryIconPicker() {
  const { control, setValue } = useFormContext<CategoryFormValues>()
  const t = useTranslation()
  const selected = useWatch({ control, name: 'icon' })

  return (
    <EmojiPicker
      label={t.admin_cat_icon}
      value={selected}
      onChange={emoji => setValue('icon', emoji, { shouldDirty: true })}
    />
  )
}
