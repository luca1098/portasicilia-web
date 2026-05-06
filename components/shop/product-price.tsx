import type { ProductVariant } from '@/lib/schemas/entities/product.entity.schema'
import { formatCurrency } from '@/lib/utils/format.utils'
import { cn } from '@/lib/utils/shadcn.utils'

type ProductPriceProps = {
  variant: ProductVariant
  size?: 'sm' | 'lg'
  showUnit?: boolean
  className?: string
}

export default function ProductPrice({
  variant,
  size = 'lg',
  showUnit = true,
  className,
}: ProductPriceProps) {
  const price = String(variant.price)
  const compareAtPrice = variant.compareAtPrice ? String(variant.compareAtPrice) : null
  const hasDiscount = compareAtPrice !== null && Number(compareAtPrice) > Number(price)

  return (
    <div className={cn('flex items-end gap-3', className)}>
      {hasDiscount && compareAtPrice && (
        <span className={cn('text-gray-400 line-through', size === 'lg' ? 'text-xl' : 'text-xs')}>
          {formatCurrency(compareAtPrice)}
        </span>
      )}
      <span className={cn('font-bold text-gray-900', size === 'lg' ? 'text-3xl' : 'text-lg')}>
        {formatCurrency(price)}
      </span>
      {showUnit && (
        <span className={cn('text-gray-500', size === 'lg' ? 'mb-0.5 text-sm' : 'text-xs')}>
          / {Number(variant.volume)} {variant.unitOfMeasurement}
        </span>
      )}
    </div>
  )
}
