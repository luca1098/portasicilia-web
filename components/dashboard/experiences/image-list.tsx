'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/context/translation.context'
import { PlusIcon, Trash2Icon } from '@/lib/constants/icons'
import type { ExperienceImage } from '@/lib/schemas/entities/experience.entity.schema'
import ImageFormDialog from './image-form-dialog'
import ImageDeleteDialog from './image-delete-dialog'

type ImageListProps = {
  experienceId: string
  images: ExperienceImage[]
}

export default function ImageList({ experienceId, images }: ImageListProps) {
  const [formOpen, setFormOpen] = useState(false)
  const [deleteImage, setDeleteImage] = useState<ExperienceImage | null>(null)
  const t = useTranslation()

  const sorted = [...images].sort((a, b) => a.order - b.order)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">{t.admin_image_section_title}</h2>
          <p className="text-sm text-muted-foreground">{t.admin_image_section_subtitle}</p>
        </div>
        <Button size="default" onClick={() => setFormOpen(true)}>
          <PlusIcon className="size-4" />
          {t.admin_image_add}
        </Button>
      </div>

      {sorted.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">{t.admin_image_no_results}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {sorted.map(img => (
            <div key={img.id} className="group relative overflow-hidden rounded-xl border border-border">
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
                <Button variant="destructive" size="icon-sm" onClick={() => setDeleteImage(img)}>
                  <Trash2Icon className="size-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ImageFormDialog experienceId={experienceId} open={formOpen} onOpenChange={setFormOpen} />

      {deleteImage && (
        <ImageDeleteDialog
          experienceId={experienceId}
          imageId={deleteImage.id}
          open={!!deleteImage}
          onOpenChange={open => !open && setDeleteImage(null)}
        />
      )}
    </div>
  )
}
