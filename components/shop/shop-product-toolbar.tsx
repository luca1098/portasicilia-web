'use client'

import { useTranslation } from '@/lib/context/translation.context'
import { interpolate } from '@/lib/utils/i18n.utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export type SortKey = 'featured' | 'newest' | 'price_asc' | 'price_desc'

export type FormatOption = {
  key: string
  label: string
}

type ShopProductToolbarProps = {
  sort: SortKey
  onSortChange: (sort: SortKey) => void
  totalCount: number
}

export default function ShopProductToolbar({ sort, onSortChange, totalCount }: ShopProductToolbarProps) {
  const t = useTranslation()

  const countLabel =
    totalCount === 1
      ? interpolate(t.shop_products_count_one, { count: String(totalCount) })
      : interpolate(t.shop_products_count_other, { count: String(totalCount) })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm font-medium text-muted-foreground">{countLabel}</p>

        <div className="flex items-center gap-2">
          <span className="hidden text-sm text-muted-foreground md:inline">{t.shop_sort_label}</span>
          <Select value={sort} onValueChange={value => onSortChange(value as SortKey)}>
            <SelectTrigger size="sm" className="w-[180px] rounded-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="featured">{t.shop_sort_featured}</SelectItem>
              <SelectItem value="newest">{t.shop_sort_newest}</SelectItem>
              <SelectItem value="price_asc">{t.shop_sort_price_asc}</SelectItem>
              <SelectItem value="price_desc">{t.shop_sort_price_desc}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
