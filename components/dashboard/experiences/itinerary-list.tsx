'use client'

import { useState } from 'react'
import Image from 'next/image'
import { DndContext, closestCenter, DragOverlay } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/context/translation.context'
import {
  PlusIcon,
  PencilIcon,
  Trash2Icon,
  ImageIcon,
  GripVerticalIcon,
  CheckIcon,
} from '@/lib/constants/icons'
import { useAction } from '@/lib/hooks/use-action'
import { useSortableList } from '@/lib/hooks/use-sortable-list'
import { reorderItineraryAction } from '@/lib/actions/experience-itinerary.actions'
import type { ExperienceItinerary } from '@/lib/schemas/entities/experience.entity.schema'
import ItineraryFormDialog from './itinerary-form-dialog'
import ItineraryDeleteDialog from './itinerary-delete-dialog'

type ItineraryListProps = {
  experienceId: string
  items: ExperienceItinerary[]
}

function SortableItineraryCard({
  item,
  onEdit,
  onDelete,
}: {
  item: ExperienceItinerary
  onEdit: (item: ExperienceItinerary) => void
  onDelete: (item: ExperienceItinerary) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-4 rounded-xl border border-border bg-card p-4 ${isDragging ? 'z-10 opacity-50' : ''}`}
    >
      <button
        type="button"
        className="flex shrink-0 cursor-grab items-center justify-center text-muted-foreground transition-colors hover:text-foreground active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVerticalIcon className="size-5" />
      </button>
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
        <Button variant="ghost" size="icon-sm" onClick={() => onEdit(item)}>
          <PencilIcon className="size-4" />
        </Button>
        <Button variant="ghost" size="icon-sm" onClick={() => onDelete(item)}>
          <Trash2Icon className="size-4 text-destructive" />
        </Button>
      </div>
    </div>
  )
}

function ItineraryOverlayCard({ item }: { item: ExperienceItinerary }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border-2 border-primary bg-card p-4 shadow-lg">
      <GripVerticalIcon className="size-5 shrink-0 text-muted-foreground" />
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
    </div>
  )
}

export default function ItineraryList({ experienceId, items }: ItineraryListProps) {
  const [formOpen, setFormOpen] = useState(false)
  const [editItem, setEditItem] = useState<ExperienceItinerary | null>(null)
  const [deleteItem, setDeleteItem] = useState<ExperienceItinerary | null>(null)
  const t = useTranslation()

  const {
    displayItems,
    hasChanges,
    activeItem,
    sensors,
    handleDragStart,
    handleDragEnd,
    addItem,
    updateItem,
    removeItem,
    getReorderPayload,
  } = useSortableList(items)

  const { loading: saving, execute } = useAction({
    successMessage: t.admin_itinerary_reorder_success,
  })

  const handleSaveOrder = () => {
    const payload = getReorderPayload()
    if (!payload) return
    execute(() => reorderItineraryAction(experienceId, payload))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">{t.admin_itinerary_section_title}</h2>
          <p className="text-sm text-muted-foreground">{t.admin_itinerary_section_subtitle}</p>
        </div>
        <div className="flex gap-2">
          {hasChanges && (
            <Button size="default" variant="outline" onClick={handleSaveOrder} disabled={saving}>
              <CheckIcon className="size-4" />
              {saving ? t.admin_itinerary_saving_order : t.admin_itinerary_save_order}
            </Button>
          )}
          <Button size="default" onClick={() => setFormOpen(true)}>
            <PlusIcon className="size-4" />
            {t.admin_itinerary_add}
          </Button>
        </div>
      </div>

      {displayItems.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">{t.admin_itinerary_no_results}</p>
        </div>
      ) : (
        <>
          {displayItems.length > 1 && (
            <p className="text-xs text-muted-foreground">{t.admin_itinerary_drag_to_reorder}</p>
          )}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={displayItems.map(item => item.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {displayItems.map(item => (
                  <SortableItineraryCard
                    key={item.id}
                    item={item}
                    onEdit={setEditItem}
                    onDelete={setDeleteItem}
                  />
                ))}
              </div>
            </SortableContext>
            <DragOverlay>{activeItem ? <ItineraryOverlayCard item={activeItem} /> : null}</DragOverlay>
          </DndContext>
        </>
      )}

      <ItineraryFormDialog
        experienceId={experienceId}
        mode="create"
        open={formOpen}
        onOpenChange={setFormOpen}
        onSuccess={addItem}
      />

      {editItem && (
        <ItineraryFormDialog
          experienceId={experienceId}
          mode="edit"
          item={editItem}
          open={!!editItem}
          onOpenChange={open => !open && setEditItem(null)}
          onSuccess={updateItem}
        />
      )}

      {deleteItem && (
        <ItineraryDeleteDialog
          experienceId={experienceId}
          itemId={deleteItem.id}
          itemTitle={deleteItem.title}
          open={!!deleteItem}
          onOpenChange={open => !open && setDeleteItem(null)}
          onSuccess={() => removeItem(deleteItem.id)}
        />
      )}
    </div>
  )
}
