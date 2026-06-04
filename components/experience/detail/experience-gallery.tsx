'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useTranslation } from '@/lib/context/translation.context'
import { interpolate } from '@/lib/utils/i18n.utils'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { Dialog, DialogContent, DialogTitle, DialogClose } from '@/components/ui/dialog'
import { XIcon, PlayCircleIcon } from '@/lib/constants/icons'
import { getYouTubeId, getThumbnailUrl, getEmbedUrl } from '@/lib/utils/youtube.utils'
import type { ListingSocialVideo } from '@/lib/schemas/entities/experience.entity.schema'

type ExperienceGalleryProps = {
  images: string[]
  alt: string
  video?: ListingSocialVideo | null
}

const GRID_HEIGHT = 400

export default function ExperienceGallery({ images, alt, video }: ExperienceGalleryProps) {
  const t = useTranslation()
  const [open, setOpen] = useState(false)
  const [videoOpen, setVideoOpen] = useState(false)
  const videoId = video ? getYouTubeId(video.url) : null
  const videoThumbnail = videoId ? getThumbnailUrl(videoId) : null
  const hasVideo = Boolean(videoId && videoThumbnail)
  const sideImages = hasVideo ? images.slice(0, 4) : images.slice(1, 5)
  const remainingCount = hasVideo ? images.length - 4 : images.length - 4
  const videoAlt = video?.title ?? alt

  return (
    <>
      {/* Desktop layout */}
      {hasVideo && videoThumbnail ? (
        <div className="hidden gap-2 md:flex" style={{ height: GRID_HEIGHT }}>
          {/* Vertical 9:16 video cell */}
          <button
            type="button"
            onClick={() => setVideoOpen(true)}
            className="group relative h-full aspect-9/16 shrink-0 cursor-pointer overflow-hidden rounded-l-2xl"
          >
            <Image
              src={videoThumbnail}
              alt={videoAlt}
              fill
              unoptimized
              className="object-cover"
              sizes="25vw"
            />
            <div className="absolute inset-0 bg-black/15 transition-opacity duration-300 group-hover:bg-black/5" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                <PlayCircleIcon className="size-10 text-white" />
              </div>
            </div>
          </button>

          {/* 2×2 image grid */}
          <div className="grid flex-1 grid-cols-2 grid-rows-2 gap-2">
            {sideImages.map((image, idx) => {
              const cornerClass = idx === 1 ? 'rounded-tr-2xl' : idx === 3 ? 'rounded-br-2xl' : ''
              const isLast = idx === 3
              return (
                <button
                  key={`img-${idx}`}
                  type="button"
                  onClick={() => setOpen(true)}
                  className={`relative cursor-pointer overflow-hidden ${cornerClass}`}
                >
                  <Image
                    src={image}
                    alt={`${alt} ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 30vw, 20vw"
                  />
                  {isLast && remainingCount > 0 && (
                    <span className="absolute bottom-3 right-3 rounded-lg bg-white/90 px-3 py-1.5 text-xs font-semibold text-foreground backdrop-blur-sm">
                      {interpolate(t.exp_detail_photos_more, { count: remainingCount })}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="hidden gap-2 md:grid md:grid-cols-4 md:grid-rows-2" style={{ height: GRID_HEIGHT }}>
          {images.slice(0, 5).map((image, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setOpen(true)}
              className={`relative cursor-pointer overflow-hidden ${
                index === 0
                  ? 'col-span-2 row-span-2 rounded-l-2xl'
                  : index === 2
                    ? 'rounded-tr-2xl'
                    : index === 4
                      ? 'rounded-br-2xl'
                      : ''
              }`}
            >
              <Image
                src={image}
                alt={`${alt} ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
              {index === 4 && remainingCount > 0 && (
                <span className="absolute bottom-3 right-3 rounded-lg bg-white/90 px-3 py-1.5 text-xs font-semibold text-foreground backdrop-blur-sm">
                  {interpolate(t.exp_detail_photos_more, { count: remainingCount })}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Mobile carousel */}
      <div className="md:hidden">
        <Carousel>
          <CarouselContent>
            {hasVideo && videoThumbnail && (
              <CarouselItem key="video">
                <button
                  type="button"
                  onClick={() => setVideoOpen(true)}
                  className="group relative mx-auto block aspect-9/16 h-[70vh] cursor-pointer overflow-hidden"
                >
                  <Image
                    src={videoThumbnail}
                    alt={videoAlt}
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="100vw"
                  />
                  <div className="absolute inset-0 bg-black/15" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex size-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                      <PlayCircleIcon className="size-10 text-white" />
                    </div>
                  </div>
                </button>
              </CarouselItem>
            )}
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="relative block aspect-4/3 w-full cursor-pointer overflow-hidden"
                >
                  <Image
                    src={image}
                    alt={`${alt} ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Full-screen all-photos dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className="grid h-screen w-screen max-w-none translate-x-[-50%] translate-y-[-50%] grid-rows-[auto_1fr] gap-0 rounded-none border-0 bg-background p-0 sm:max-w-none"
        >
          <div className="flex items-center justify-between border-b border-border bg-background px-4 py-3 md:px-8">
            <DialogClose
              aria-label={t.exp_detail_close}
              className="flex size-10 items-center justify-center rounded-full hover:bg-muted"
            >
              <XIcon className="size-5" />
            </DialogClose>
            <DialogTitle className="text-base font-semibold">{t.exp_detail_all_photos}</DialogTitle>
            <div className="size-10" aria-hidden />
          </div>
          <div className="overflow-y-auto px-4 py-6 md:px-8">
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-3 sm:grid-cols-2">
              {hasVideo && videoId && (
                <div className="relative aspect-9/16 mx-auto w-full max-w-sm overflow-hidden rounded-xl bg-black sm:col-span-2">
                  <iframe
                    src={getEmbedUrl(videoId)}
                    title={videoAlt}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                  />
                </div>
              )}
              {images.map((image, index) => (
                <div key={index} className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-muted">
                  <Image
                    src={image}
                    alt={`${alt} ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Video-only dialog */}
      {hasVideo && videoId && (
        <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
          <DialogContent
            showCloseButton={false}
            className="grid h-screen w-screen max-w-none translate-x-[-50%] translate-y-[-50%] grid-rows-[auto_1fr] gap-0 rounded-none border-0 bg-black p-0 sm:max-w-none"
          >
            <div className="flex items-center justify-between bg-black px-4 py-3 md:px-8">
              <DialogTitle className="text-base font-semibold text-white">{videoAlt}</DialogTitle>
              <DialogClose
                aria-label={t.exp_detail_close}
                className="flex size-10 items-center justify-center rounded-full text-white hover:bg-white/10"
              >
                <XIcon className="size-5" />
              </DialogClose>
            </div>
            <div className="flex items-center justify-center bg-black p-4">
              <div className="relative aspect-9/16 h-full max-h-full w-auto overflow-hidden rounded-xl">
                <iframe
                  src={getEmbedUrl(videoId)}
                  title={videoAlt}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
