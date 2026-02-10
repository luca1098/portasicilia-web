'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { useTranslation } from '@/lib/context/translation.context'
import { PlusIcon, PencilIcon, Trash2Icon, ChevronDownIcon } from '@/lib/constants/icons'
import type { PriceTier } from '@/lib/schemas/entities/pricing.entity.schema'
import PriceTierFormDialog from './price-tier-form-dialog'
import PriceTierDeleteDialog from './price-tier-delete-dialog'
import PriceOverrideList from './price-override-list'

type PriceTierListProps = {
  priceListId: string
  tiers: PriceTier[]
}

export default function PriceTierList({ priceListId, tiers }: PriceTierListProps) {
  const [formOpen, setFormOpen] = useState(false)
  const [editItem, setEditItem] = useState<PriceTier | null>(null)
  const [deleteItem, setDeleteItem] = useState<PriceTier | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const t = useTranslation() as Record<string, string>

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">{t.admin_tier_section_title}</h3>
        <Button size="sm" variant="outline" onClick={() => setFormOpen(true)}>
          <PlusIcon className="size-3" />
          {t.admin_tier_add}
        </Button>
      </div>

      {tiers.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t.admin_tier_no_results}</p>
      ) : (
        <div className="space-y-2">
          {tiers.map(tier => (
            <Collapsible
              key={tier.id}
              open={expandedId === tier.id}
              onOpenChange={open => setExpandedId(open ? tier.id : null)}
            >
              <div className="rounded-lg border border-border bg-background">
                <div className="flex items-center gap-3 p-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">
                      {tier.label ?? tier.tierType} — &euro;{tier.baseAmount}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {tier.tierType}
                      {tier.minQuantity != null || tier.maxQuantity != null
                        ? ` · ${t.admin_tier_qty}: ${tier.minQuantity ?? '—'}–${tier.maxQuantity ?? '—'}`
                        : ''}
                      {tier.description ? ` · ${tier.description}` : ''}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button variant="ghost" size="icon-sm" onClick={() => setEditItem(tier)}>
                      <PencilIcon className="size-3" />
                    </Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => setDeleteItem(tier)}>
                      <Trash2Icon className="size-3 text-destructive" />
                    </Button>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="icon-sm">
                        <ChevronDownIcon
                          className={`size-3 transition-transform ${expandedId === tier.id ? 'rotate-180' : ''}`}
                        />
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                </div>
                <CollapsibleContent>
                  <div className="border-t border-border p-3">
                    <PriceOverrideList tierId={tier.id} overrides={tier.overrides ?? []} />
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          ))}
        </div>
      )}

      <PriceTierFormDialog
        priceListId={priceListId}
        mode="create"
        open={formOpen}
        onOpenChange={setFormOpen}
      />

      {editItem && (
        <PriceTierFormDialog
          priceListId={priceListId}
          mode="edit"
          tier={editItem}
          open={!!editItem}
          onOpenChange={open => !open && setEditItem(null)}
        />
      )}

      {deleteItem && (
        <PriceTierDeleteDialog
          priceListId={priceListId}
          tierId={deleteItem.id}
          open={!!deleteItem}
          onOpenChange={open => !open && setDeleteItem(null)}
        />
      )}
    </div>
  )
}
