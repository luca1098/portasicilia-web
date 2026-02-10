'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useTranslation } from '@/lib/context/translation.context'
import { PlusIcon, PencilIcon, Trash2Icon } from '@/lib/constants/icons'
import type { PriceModifier } from '@/lib/schemas/entities/pricing.entity.schema'
import PriceModifierFormDialog from './price-modifier-form-dialog'
import PriceModifierDeleteDialog from './price-modifier-delete-dialog'

type PriceModifierListProps = {
  priceListId: string
  modifiers: PriceModifier[]
}

function formatAdjustment(modifier: PriceModifier) {
  if (modifier.adjustmentType === 'PERCENTAGE') {
    return `${modifier.value > 0 ? '+' : ''}${modifier.value}%`
  }
  return `${modifier.value > 0 ? '+' : ''}€${modifier.value}`
}

export default function PriceModifierList({ priceListId, modifiers }: PriceModifierListProps) {
  const [formOpen, setFormOpen] = useState(false)
  const [editItem, setEditItem] = useState<PriceModifier | null>(null)
  const [deleteItem, setDeleteItem] = useState<PriceModifier | null>(null)
  const t = useTranslation() as Record<string, string>

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">{t.admin_modifier_section_title}</h3>
        <Button size="sm" variant="outline" onClick={() => setFormOpen(true)}>
          <PlusIcon className="size-3" />
          {t.admin_modifier_add}
        </Button>
      </div>

      {modifiers.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t.admin_modifier_no_results}</p>
      ) : (
        <div className="space-y-2">
          {modifiers.map(mod => (
            <div
              key={mod.id}
              className="flex items-center gap-3 rounded-lg border border-border bg-background p-3"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{mod.name}</span>
                  <Badge variant="outline">
                    {t[`admin_modifier_type_${mod.type.toLowerCase()}`] ?? mod.type}
                  </Badge>
                  <span className="text-sm font-mono">{formatAdjustment(mod)}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {t.admin_modifier_priority}: {mod.priority ?? '—'} ·{' '}
                  {mod.stackable ? t.admin_modifier_stackable : t.admin_modifier_not_stackable} ·{' '}
                  {mod.active ? t.admin_modifier_active : t.admin_modifier_inactive}
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button variant="ghost" size="icon-sm" onClick={() => setEditItem(mod)}>
                  <PencilIcon className="size-3" />
                </Button>
                <Button variant="ghost" size="icon-sm" onClick={() => setDeleteItem(mod)}>
                  <Trash2Icon className="size-3 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <PriceModifierFormDialog
        priceListId={priceListId}
        mode="create"
        open={formOpen}
        onOpenChange={setFormOpen}
      />

      {editItem && (
        <PriceModifierFormDialog
          priceListId={priceListId}
          mode="edit"
          modifier={editItem}
          open={!!editItem}
          onOpenChange={open => !open && setEditItem(null)}
        />
      )}

      {deleteItem && (
        <PriceModifierDeleteDialog
          priceListId={priceListId}
          modifierId={deleteItem.id}
          open={!!deleteItem}
          onOpenChange={open => !open && setDeleteItem(null)}
        />
      )}
    </div>
  )
}
