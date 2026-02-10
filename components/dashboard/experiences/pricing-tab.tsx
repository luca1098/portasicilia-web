'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { useTranslation } from '@/lib/context/translation.context'
import { PlusIcon, ChevronDownIcon, PencilIcon, Trash2Icon } from '@/lib/constants/icons'
import type { PriceList } from '@/lib/schemas/entities/pricing.entity.schema'
import PriceListFormDialog from './price-list-form-dialog'
import PriceListDeleteDialog from './price-list-delete-dialog'
import PriceListDetail from './price-list-detail'

type PricingTabProps = {
  experienceId: string
  priceLists: PriceList[]
}

export default function PricingTab({ experienceId, priceLists }: PricingTabProps) {
  const [formOpen, setFormOpen] = useState(false)
  const [editItem, setEditItem] = useState<PriceList | null>(null)
  const [deleteItem, setDeleteItem] = useState<PriceList | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const t = useTranslation() as Record<string, string>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">{t.admin_pricing_section_title}</h2>
          <p className="text-sm text-muted-foreground">{t.admin_pricing_section_subtitle}</p>
        </div>
        <Button size="default" onClick={() => setFormOpen(true)}>
          <PlusIcon className="size-4" />
          {t.admin_pricing_add}
        </Button>
      </div>

      {priceLists.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">{t.admin_pricing_no_results}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {priceLists.map(pl => (
            <Collapsible
              key={pl.id}
              open={expandedId === pl.id}
              onOpenChange={open => setExpandedId(open ? pl.id : null)}
            >
              <div className="rounded-xl border border-border bg-card">
                <div className="flex items-center gap-4 p-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={pl.status === 'ACTIVE' ? 'default' : 'secondary'}>
                        {t[`admin_pricing_status_${pl.status.toLowerCase()}`] ?? pl.status}
                      </Badge>
                      <Badge variant="outline">
                        {t[`admin_pricing_mode_${pl.pricingMode.toLowerCase()}`] ?? pl.pricingMode}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{pl.currency}</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {pl.validFrom} — {pl.validTo}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={e => {
                        e.stopPropagation()
                        setEditItem(pl)
                      }}
                    >
                      <PencilIcon className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={e => {
                        e.stopPropagation()
                        setDeleteItem(pl)
                      }}
                    >
                      <Trash2Icon className="size-4 text-destructive" />
                    </Button>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="icon-sm">
                        <ChevronDownIcon
                          className={`size-4 transition-transform ${expandedId === pl.id ? 'rotate-180' : ''}`}
                        />
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                </div>
                <CollapsibleContent>
                  <div className="border-t border-border p-4">
                    <PriceListDetail priceList={pl} />
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          ))}
        </div>
      )}

      <PriceListFormDialog
        experienceId={experienceId}
        mode="create"
        open={formOpen}
        onOpenChange={setFormOpen}
      />

      {editItem && (
        <PriceListFormDialog
          experienceId={experienceId}
          mode="edit"
          priceList={editItem}
          open={!!editItem}
          onOpenChange={open => !open && setEditItem(null)}
        />
      )}

      {deleteItem && (
        <PriceListDeleteDialog
          priceListId={deleteItem.id}
          open={!!deleteItem}
          onOpenChange={open => !open && setDeleteItem(null)}
        />
      )}
    </div>
  )
}
