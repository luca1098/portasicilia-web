'use client'

import { useState } from 'react'
import Image from 'next/image'
import { DndContext, closestCenter, DragOverlay } from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/context/translation.context'
import { PlusIcon, PlayCircleIcon, CheckIcon } from '@/lib/constants/icons'
import { useAction } from '@/lib/hooks/use-action'
import { useSortableList } from '@/lib/hooks/use-sortable-list'
import { reorderSocialVideosAction } from '@/lib/actions/social-videos.actions'
import { getYouTubeId, getThumbnailUrl } from '@/lib/utils/youtube.utils'
import type { SocialVideo } from '@/lib/schemas/entities/social-video.entity.schema'
import SortableVideoCard from './sortable-video-card'
import SocialVideoFormDialog from './social-video-form-dialog'
import SocialVideoDeleteDialog from './social-video-delete-dialog'

type SocialVideoListProps = {
  videos: SocialVideo[]
}

export default function SocialVideoList({ videos }: SocialVideoListProps) {
  const [formOpen, setFormOpen] = useState(false)
  const [editVideo, setEditVideo] = useState<SocialVideo | null>(null)
  const [deleteVideoId, setDeleteVideoId] = useState<string | null>(null)
  const t = useTranslation()

  const mappedVideos = videos.map(v => ({ ...v, order: v.sortOrder }))

  const { displayItems, hasChanges, activeItem, sensors, handleDragStart, handleDragEnd, getReorderPayload } =
    useSortableList(mappedVideos)

  const { loading: saving, execute } = useAction({
    successMessage: t.admin_social_videos_reorder_success,
  })

  const handleSaveOrder = () => {
    const payload = getReorderPayload()
    if (!payload) return
    execute(() => reorderSocialVideosAction(payload))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end gap-2">
        {hasChanges && (
          <Button size="default" variant="outline" onClick={handleSaveOrder} disabled={saving}>
            <CheckIcon className="size-4" />
            {saving ? t.admin_social_videos_saving_order : t.admin_social_videos_save_order}
          </Button>
        )}
        <Button size="default" onClick={() => setFormOpen(true)}>
          <PlusIcon className="size-4" />
          {t.admin_social_videos_add}
        </Button>
      </div>

      {displayItems.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">{t.admin_social_videos_empty}</p>
        </div>
      ) : (
        <>
          {displayItems.length > 1 && (
            <p className="text-xs text-muted-foreground">{t.admin_social_videos_drag_to_reorder}</p>
          )}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={displayItems.map(v => v.id)} strategy={rectSortingStrategy}>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {displayItems.map(video => (
                  <SortableVideoCard
                    key={video.id}
                    video={video}
                    onEdit={setEditVideo}
                    onDelete={setDeleteVideoId}
                  />
                ))}
              </div>
            </SortableContext>
            <DragOverlay>
              {activeItem ? (
                <div className="overflow-hidden rounded-xl border-2 border-primary shadow-lg">
                  {getYouTubeId(activeItem.url) ? (
                    <Image
                      src={getThumbnailUrl(getYouTubeId(activeItem.url) ?? '')}
                      alt={activeItem.title ?? ''}
                      width={400}
                      height={225}
                      className="aspect-video w-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex aspect-video w-full items-center justify-center bg-muted">
                      <PlayCircleIcon className="size-10 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </>
      )}

      <SocialVideoFormDialog mode="create" open={formOpen} onOpenChange={setFormOpen} />

      {editVideo && (
        <SocialVideoFormDialog
          mode="edit"
          video={editVideo}
          open={!!editVideo}
          onOpenChange={open => !open && setEditVideo(null)}
        />
      )}

      {deleteVideoId && (
        <SocialVideoDeleteDialog
          videoId={deleteVideoId}
          open={!!deleteVideoId}
          onOpenChange={open => !open && setDeleteVideoId(null)}
        />
      )}
    </div>
  )
}
