'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/context/translation.context'
import { PlusIcon, PencilIcon, Trash2Icon } from '@/lib/constants/icons'
import type { PriceOverride } from '@/lib/schemas/entities/pricing.entity.schema'
import PriceOverrideFormDialog from './price-override-form-dialog'
import PriceOverrideDeleteDialog from './price-override-delete-dialog'

type PriceOverrideListProps = {
  tierId: string
  overrides: PriceOverride[]
}

export default function PriceOverrideList({ tierId, overrides }: PriceOverrideListProps) {
  const [formOpen, setFormOpen] = useState(false)
  const [editItem, setEditItem] = useState<PriceOverride | null>(null)
  const [deleteItem, setDeleteItem] = useState<PriceOverride | null>(null)
  const t = useTranslation() as Record<string, string>

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold">{t.admin_override_section_title}</h4>
        <Button size="sm" variant="outline" onClick={() => setFormOpen(true)}>
          <PlusIcon className="size-3" />
          {t.admin_override_add}
        </Button>
      </div>

      {overrides.length === 0 ? (
        <p className="text-xs text-muted-foreground">{t.admin_override_no_results}</p>
      ) : (
        <div className="space-y-2">
          {overrides.map(ovr => (
            <div
              key={ovr.id}
              className="flex items-center gap-3 rounded-lg border border-dashed border-border p-2"
            >
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium">
                  {ovr.name} — &euro;{ovr.overrideAmount}
                </p>
                <p className="text-xs text-muted-foreground">
                  {ovr.dateFrom} — {ovr.dateTo}
                  {ovr.dayOfWeek ? ` · ${t.admin_override_days}: ${ovr.dayOfWeek.join(', ')}` : ''}
                  {ovr.reason ? ` · ${ovr.reason}` : ''}
                  {' · '}
                  {ovr.active ? t.admin_modifier_active : t.admin_modifier_inactive}
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button variant="ghost" size="icon-sm" onClick={() => setEditItem(ovr)}>
                  <PencilIcon className="size-3" />
                </Button>
                <Button variant="ghost" size="icon-sm" onClick={() => setDeleteItem(ovr)}>
                  <Trash2Icon className="size-3 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <PriceOverrideFormDialog tierId={tierId} mode="create" open={formOpen} onOpenChange={setFormOpen} />

      {editItem && (
        <PriceOverrideFormDialog
          tierId={tierId}
          mode="edit"
          override={editItem}
          open={!!editItem}
          onOpenChange={open => !open && setEditItem(null)}
        />
      )}

      {deleteItem && (
        <PriceOverrideDeleteDialog
          tierId={tierId}
          overrideId={deleteItem.id}
          open={!!deleteItem}
          onOpenChange={open => !open && setDeleteItem(null)}
        />
      )}
    </div>
  )
}
