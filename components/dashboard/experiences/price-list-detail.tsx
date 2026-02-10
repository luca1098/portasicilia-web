'use client'

import type { PriceList } from '@/lib/schemas/entities/pricing.entity.schema'
import PriceTierList from './price-tier-list'
import PriceModifierList from './price-modifier-list'

type PriceListDetailProps = {
  priceList: PriceList
}

export default function PriceListDetail({ priceList }: PriceListDetailProps) {
  return (
    <div className="space-y-6">
      <PriceTierList priceListId={priceList.id} tiers={priceList.tiers ?? []} />
      <PriceModifierList priceListId={priceList.id} modifiers={priceList.modifiers ?? []} />
    </div>
  )
}
