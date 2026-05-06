'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeftIcon, ChevronRightIcon, Link2Icon, PlayCircleIcon, XIcon } from '@/lib/constants/icons'
import { getYouTubeId, getThumbnailUrl, getEmbedUrl } from '@/lib/utils/youtube.utils'
import { useTranslation } from '@/lib/context/translation.context'
import type { SocialVideo } from '@/lib/schemas/entities/social-video.entity.schema'

type StoryViewerProps = {
  videos: SocialVideo[]
  initialVideo: SocialVideo
  onClose: () => void
  lang: string
}

export default function StoryViewer({ videos, initialVideo, onClose, lang }: StoryViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(() => videos.findIndex(v => v.id === initialVideo.id))
  const t = useTranslation()

  const handleScroll = useCallback(() => {
    const container = containerRef.current
    if (!container) return
    const scrollLeft = container.scrollLeft
    const width = container.clientWidth
    const newIndex = Math.round(scrollLeft / width)
    setActiveIndex(newIndex)
  }, [])

  const goTo = useCallback(
    (index: number) => {
      const container = containerRef.current
      if (!container) return
      const clamped = Math.max(0, Math.min(index, videos.length - 1))
      container.scrollTo({ left: clamped * container.clientWidth, behavior: 'smooth' })
    },
    [videos.length]
  )

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo])
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const initialIndex = videos.findIndex(v => v.id === initialVideo.id)
    container.scrollLeft = initialIndex * container.clientWidth
  }, [videos, initialVideo])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') goNext()
      else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') goPrev()
      else if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goNext, goPrev, onClose])

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <button
        type="button"
        onClick={e => {
          e.stopPropagation()
          onClose()
        }}
        className="absolute top-4 right-4 z-20 flex size-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm pointer-events-auto"
      >
        <XIcon className="size-6 text-white" />
      </button>

      <div className="absolute top-4 left-4 z-10 rounded-full bg-white/20 px-3 py-1 backdrop-blur-sm">
        <span className="text-sm font-medium text-white">
          {activeIndex + 1} / {videos.length}
        </span>
      </div>

      {activeIndex > 0 && (
        <button
          type="button"
          onClick={goPrev}
          className="absolute left-0 top-0 z-10 hidden h-full w-[calc(50%-200px)] cursor-pointer items-center justify-center md:flex group"
        >
          <div className="flex size-12 items-center justify-center rounded-full bg-white/10 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <ChevronLeftIcon className="size-6 text-white" />
          </div>
        </button>
      )}

      {activeIndex < videos.length - 1 && (
        <button
          type="button"
          onClick={goNext}
          className="absolute right-0 top-0 z-10 hidden h-full w-[calc(50%-200px)] cursor-pointer items-center justify-center md:flex group"
        >
          <div className="flex size-12 items-center justify-center rounded-full bg-white/10 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <ChevronRightIcon className="size-6 text-white" />
          </div>
        </button>
      )}

      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex h-full w-full snap-x snap-mandatory overflow-x-scroll scrollbar-hide"
      >
        {videos.map((video, index) => {
          const videoId = getYouTubeId(video.url)
          if (!videoId) return null

          const isActive = index === activeIndex

          return (
            <div
              key={video.id}
              className="flex h-full w-full shrink-0 snap-start items-center justify-center"
            >
              <div className="relative aspect-9/16 h-full max-h-full w-full max-w-sm">
                {isActive ? (
                  <iframe
                    src={getEmbedUrl(videoId)}
                    title={video.title ?? 'YouTube Short'}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full rounded-2xl"
                  />
                ) : (
                  <div className="absolute inset-0 overflow-hidden rounded-2xl">
                    <Image
                      src={getThumbnailUrl(videoId)}
                      alt={video.title ?? ''}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <PlayCircleIcon className="size-16 text-white/80" />
                    </div>
                  </div>
                )}
                {video.listing && (
                  <Link
                    href={`/${lang}/${video.listing.type === 'EXPERIENCE' ? 'experiences' : 'stays'}/${video.listing.slug}`}
                    onClick={e => e.stopPropagation()}
                    className="absolute bottom-32 left-1/2 z-10 -translate-x-1/2 flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-md font-bold text-gray-900 shadow-lg transition-all hover:bg-white/90"
                  >
                    <Link2Icon className="size-8 text-blue-600 -rotate-45" />
                    {t.social_video_view_detail}
                  </Link>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
