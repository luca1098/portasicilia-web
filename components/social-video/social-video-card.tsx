'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { SocialVideo } from '@/lib/schemas/entities/social-video.entity.schema'
import { Link2Icon, PlayCircleIcon } from '@/lib/constants/icons'
import { useTranslation } from '@/lib/context/translation.context'
import { getYouTubeId, getThumbnailUrl, getEmbedUrl } from '@/lib/utils/youtube.utils'

type SocialVideoCardProps = {
  video: SocialVideo
  lang: string
}

export default function SocialVideoCard({ video, lang }: SocialVideoCardProps) {
  const [playing, setPlaying] = useState(false)
  const t = useTranslation()
  const videoId = getYouTubeId(video.url)
  const thumbnail = videoId ? getThumbnailUrl(videoId) : null

  if (playing && videoId) {
    return (
      <div className="relative aspect-9/16 overflow-hidden rounded-2xl">
        <iframe
          src={getEmbedUrl(videoId)}
          title={video.title ?? 'YouTube Short'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
        {video.listing && (
          <Link
            href={`/${lang}/${video.listing.type === 'EXPERIENCE' ? 'experiences' : 'stays'}/${video.listing.slug}`}
            onClick={e => e.stopPropagation()}
            className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-gray-900 shadow-lg transition-all hover:bg-white/90"
          >
            <Link2Icon className="size-4 text-blue-600" />
            {t.social_video_view_detail}
          </Link>
        )}
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="group relative aspect-9/16 w-full cursor-pointer overflow-hidden rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
    >
      {thumbnail ? (
        <Image
          src={thumbnail}
          alt={video.title ?? ''}
          fill
          unoptimized
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-white/5" />
      )}
      <div className="absolute inset-0 bg-black/20 transition-opacity duration-300 group-hover:bg-black/10" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
          <PlayCircleIcon className="size-10 text-white" />
        </div>
      </div>
      {video.title && (
        <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-4">
          <p className="text-sm font-medium text-white line-clamp-2">{video.title}</p>
        </div>
      )}
    </button>
  )
}
