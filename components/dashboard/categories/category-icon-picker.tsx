'use client'

import { useFormContext } from 'react-hook-form'
import { cn } from '@/lib/utils/shadcn.utils'
import { useTranslation } from '@/lib/context/translation.context'
import { categoryIcons } from '@/lib/constants/category-icons'
import type { CategoryFormValues } from '@/lib/schemas/forms/category.form.schema'

export default function CategoryIconPicker() {
  const { watch, setValue } = useFormContext<CategoryFormValues>()
  const t = useTranslation()
  const selected = watch('icon')

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium leading-none">{t.admin_cat_icon}</label>
      <div className="grid grid-cols-8 gap-2 sm:grid-cols-10">
        {categoryIcons.map(option => {
          const isSelected = selected === option.name
          return (
            <button
              key={option.name}
              type="button"
              onClick={() => setValue('icon', isSelected ? '' : option.name, { shouldDirty: true })}
              className={cn(
                'flex size-10 items-center justify-center rounded-lg border transition-all',
                isSelected
                  ? 'border-primary bg-primary/10 text-primary shadow-sm'
                  : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground'
              )}
            >
              <option.icon className="size-5" />
            </button>
          )
        })}
      </div>
    </div>
  )
}
