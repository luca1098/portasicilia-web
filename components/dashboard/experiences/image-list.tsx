'use client'

import { useState } from 'react'
import Image from 'next/image'
import { DndContext, closestCenter, DragOverlay } from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/context/translation.context'
import { PlusIcon, Trash2Icon, GripVerticalIcon, CheckIcon } from '@/lib/constants/icons'
import { useAction } from '@/lib/hooks/use-action'
import { useSortableList } from '@/lib/hooks/use-sortable-list'
import { reorderImagesAction } from '@/lib/actions/experience-images.actions'
import type { ExperienceImage } from '@/lib/schemas/entities/experience.entity.schema'
import ImageFormDialog from './image-form-dialog'
import ImageDeleteDialog from './image-delete-dialog'

type ImageListProps = {
  experienceId: string
  images: ExperienceImage[]
}

function SortableImageCard({
  img,
  onDelete,
}: {
  img: ExperienceImage
  onDelete: (img: ExperienceImage) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: img.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative overflow-hidden rounded-xl border border-border ${isDragging ? 'z-10 opacity-50' : ''}`}
    >
      <Image
        src={img.url}
        alt={`Image #${img.order}`}
        width={300}
        height={200}
        className="aspect-[3/2] w-full object-cover"
        unoptimized
      />
      <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/50 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
        <span className="text-xs font-medium text-white">#{img.order}</span>
        <div className="flex gap-1">
          <button
            type="button"
            className="flex size-7 cursor-grab items-center justify-center rounded-md bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30 active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <GripVerticalIcon className="size-3.5" />
          </button>
          <Button variant="destructive" size="icon-sm" onClick={() => onDelete(img)}>
            <Trash2Icon className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function ImageList({ experienceId, images }: ImageListProps) {
  const [formOpen, setFormOpen] = useState(false)
  const [deleteImage, setDeleteImage] = useState<ExperienceImage | null>(null)
  const t = useTranslation()

  const {
    displayItems,
    hasChanges,
    activeItem,
    sensors,
    handleDragStart,
    handleDragEnd,
    addItem,
    removeItem,
    getReorderPayload,
  } = useSortableList(images)

  const { loading: saving, execute } = useAction({
    successMessage: t.admin_image_reorder_success,
  })

  const handleSaveOrder = () => {
    const payload = getReorderPayload()
    if (!payload) return
    execute(() => reorderImagesAction(experienceId, payload))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">{t.admin_image_section_title}</h2>
          <p className="text-sm text-muted-foreground">{t.admin_image_section_subtitle}</p>
        </div>
        <div className="flex gap-2">
          {hasChanges && (
            <Button size="default" variant="outline" onClick={handleSaveOrder} disabled={saving}>
              <CheckIcon className="size-4" />
              {saving ? t.admin_image_saving_order : t.admin_image_save_order}
            </Button>
          )}
          <Button size="default" onClick={() => setFormOpen(true)}>
            <PlusIcon className="size-4" />
            {t.admin_image_add}
          </Button>
        </div>
      </div>

      {displayItems.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">{t.admin_image_no_results}</p>
        </div>
      ) : (
        <>
          {displayItems.length > 1 && (
            <p className="text-xs text-muted-foreground">{t.admin_image_drag_to_reorder}</p>
          )}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={displayItems.map(img => img.id)} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {displayItems.map(img => (
                  <SortableImageCard key={img.id} img={img} onDelete={setDeleteImage} />
                ))}
              </div>
            </SortableContext>
            <DragOverlay>
              {activeItem ? (
                <div className="overflow-hidden rounded-xl border-2 border-primary shadow-lg">
                  <Image
                    src={activeItem.url}
                    alt={`Image #${activeItem.order}`}
                    width={300}
                    height={200}
                    className="aspect-[3/2] w-full object-cover"
                    unoptimized
                  />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </>
      )}

      <ImageFormDialog
        experienceId={experienceId}
        open={formOpen}
        onOpenChange={setFormOpen}
        onSuccess={addItem}
      />

      {deleteImage && (
        <ImageDeleteDialog
          experienceId={experienceId}
          imageId={deleteImage.id}
          open={!!deleteImage}
          onOpenChange={open => !open && setDeleteImage(null)}
          onSuccess={() => removeItem(deleteImage.id)}
        />
      )}
    </div>
  )
}
