'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useTranslation } from '@/lib/context/translation.context'
import { interpolate } from '@/lib/utils/i18n.utils'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { Dialog, DialogContent, DialogTitle, DialogClose } from '@/components/ui/dialog'
import { XIcon } from '@/lib/constants/icons'

type ExperienceGalleryProps = {
  images: string[]
  alt: string
}

export default function ExperienceGallery({ images, alt }: ExperienceGalleryProps) {
  const t = useTranslation()
  const [open, setOpen] = useState(false)
  const displayImages = images.slice(0, 5)
  const remainingCount = images.length - 4

  return (
    <>
      {/* Desktop grid */}
      <div className="hidden gap-2 md:grid md:grid-cols-4 md:grid-rows-2" style={{ height: 400 }}>
        {displayImages.map((image, index) => (
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

      {/* Mobile carousel */}
      <div className="md:hidden">
        <Carousel>
          <CarouselContent>
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
    </>
  )
}
