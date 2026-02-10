'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/context/translation.context'
import { PlusIcon, PencilIcon, Trash2Icon, ImageIcon } from '@/lib/constants/icons'
import type { ExperienceItinerary } from '@/lib/schemas/entities/experience.entity.schema'
import ItineraryFormDialog from './itinerary-form-dialog'
import ItineraryDeleteDialog from './itinerary-delete-dialog'

type ItineraryListProps = {
  experienceId: string
  items: ExperienceItinerary[]
}

export default function ItineraryList({ experienceId, items }: ItineraryListProps) {
  const [formOpen, setFormOpen] = useState(false)
  const [editItem, setEditItem] = useState<ExperienceItinerary | null>(null)
  const [deleteItem, setDeleteItem] = useState<ExperienceItinerary | null>(null)
  const t = useTranslation()

  const sorted = [...items].sort((a, b) => a.order - b.order)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">{t.admin_itinerary_section_title}</h2>
          <p className="text-sm text-muted-foreground">{t.admin_itinerary_section_subtitle}</p>
        </div>
        <Button size="default" onClick={() => setFormOpen(true)}>
          <PlusIcon className="size-4" />
          {t.admin_itinerary_add}
        </Button>
      </div>

      {sorted.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">{t.admin_itinerary_no_results}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map(item => (
            <div
              key={item.id}
              className="flex items-center gap-4 rounded-xl border border-border bg-card p-4"
            >
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.title}
                  width={56}
                  height={56}
                  className="size-14 shrink-0 rounded-lg object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <ImageIcon className="size-5 text-muted-foreground" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">#{item.order}</p>
                <p className="font-medium">{item.title}</p>
                <p className="truncate text-sm text-muted-foreground">{item.description}</p>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button variant="ghost" size="icon-sm" onClick={() => setEditItem(item)}>
                  <PencilIcon className="size-4" />
                </Button>
                <Button variant="ghost" size="icon-sm" onClick={() => setDeleteItem(item)}>
                  <Trash2Icon className="size-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ItineraryFormDialog
        experienceId={experienceId}
        mode="create"
        open={formOpen}
        onOpenChange={setFormOpen}
      />

      {editItem && (
        <ItineraryFormDialog
          experienceId={experienceId}
          mode="edit"
          item={editItem}
          open={!!editItem}
          onOpenChange={open => !open && setEditItem(null)}
        />
      )}

      {deleteItem && (
        <ItineraryDeleteDialog
          experienceId={experienceId}
          itemId={deleteItem.id}
          itemTitle={deleteItem.title}
          open={!!deleteItem}
          onOpenChange={open => !open && setDeleteItem(null)}
        />
      )}
    </div>
  )
}
