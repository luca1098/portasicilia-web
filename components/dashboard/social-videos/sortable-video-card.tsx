'use client'

import Image from 'next/image'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/context/translation.context'
import { PencilIcon, Trash2Icon, PlayCircleIcon, GripVerticalIcon, StarIcon } from '@/lib/constants/icons'
import { getYouTubeId, getThumbnailUrl } from '@/lib/utils/youtube.utils'
import type { SocialVideo } from '@/lib/schemas/entities/social-video.entity.schema'

type SortableSocialVideo = SocialVideo & { order: number }

type SortableVideoCardProps = {
  video: SortableSocialVideo
  onEdit: (video: SocialVideo) => void
  onDelete: (id: string) => void
}

export default function SortableVideoCard({ video, onEdit, onDelete }: SortableVideoCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: video.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const videoId = getYouTubeId(video.url)
  const thumbnail = videoId ? getThumbnailUrl(videoId) : null

  const t = useTranslation()

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group overflow-hidden rounded-xl border border-border bg-card ${isDragging ? 'z-10 opacity-50' : ''}`}
    >
      <div className="relative aspect-video bg-muted">
        {thumbnail ? (
          <Image src={thumbnail} alt={video.title ?? ''} fill unoptimized className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <PlayCircleIcon className="size-10 text-muted-foreground" />
          </div>
        )}
        <div className="absolute right-2 top-2 flex flex-col items-end gap-1">
          <Badge variant={video.active ? 'default' : 'secondary'}>
            {video.active ? t.admin_social_videos_active_label : t.admin_social_videos_inactive_label}
          </Badge>
          {video.featured && (
            <Badge variant="outline" className="border-amber-400 bg-amber-50 text-amber-700">
              <StarIcon className="mr-1 size-3 fill-amber-400 text-amber-400" />
              {t.social_video_featured}
            </Badge>
          )}
        </div>
        <div className="absolute bottom-2 left-2">
          <span className="rounded bg-black/50 px-1.5 py-0.5 text-xs font-medium text-white">
            #{video.order}
          </span>
        </div>
      </div>

      <div className="space-y-3 p-4">
        {video.title && <p className="font-medium">{video.title}</p>}
        <p className="truncate text-xs text-muted-foreground">{video.url}</p>

        <div className="flex items-center justify-between">
          <button
            type="button"
            className="flex size-7 cursor-grab items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <GripVerticalIcon className="size-3.5" />
          </button>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon-sm" onClick={() => onEdit(video)}>
              <PencilIcon className="size-4" />
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={() => onDelete(video.id)}>
              <Trash2Icon className="size-4 text-destructive" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
