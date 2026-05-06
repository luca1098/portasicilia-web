'use client'

import Image from 'next/image'
import { useTranslation } from '@/lib/context/translation.context'
import { interpolate } from '@/lib/utils/i18n.utils'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'

type ExperienceGalleryProps = {
  images: string[]
  alt: string
}

export default function ExperienceGallery({ images, alt }: ExperienceGalleryProps) {
  const t = useTranslation()
  const displayImages = images.slice(0, 5)
  const remainingCount = images.length - 4

  return (
    <>
      {/* Desktop grid */}
      <div className="hidden gap-2 md:grid md:grid-cols-4 md:grid-rows-2" style={{ height: 400 }}>
        {displayImages.map((image, index) => (
          <div
            key={index}
            className={`relative overflow-hidden ${
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
              <button
                type="button"
                className="absolute bottom-3 right-3 rounded-lg bg-white/90 px-3 py-1.5 text-xs font-semibold text-foreground backdrop-blur-sm"
              >
                {interpolate(t.exp_detail_photos_more, { count: remainingCount })}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Mobile carousel */}
      <div className="md:hidden">
        <Carousel>
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative aspect-4/3 w-full overflow-hidden">
                  <Image
                    src={image}
                    alt={`${alt} ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </>
  )
}
