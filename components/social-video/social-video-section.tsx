'use client'

import type { SocialVideo } from '@/lib/schemas/entities/social-video.entity.schema'
import SocialVideoCard from './social-video-card'

type SocialVideoSectionProps = {
  videos: SocialVideo[]
  title: string
  lang: string
}

export default function SocialVideoSection({ videos, title, lang }: SocialVideoSectionProps) {
  return (
    <section className="bg-night py-16 md:py-24">
      {/* Desktop layout */}
      <div className="hidden md:block">
        <h2 className="mb-12 text-center text-3xl font-bold text-white md:text-4xl">{title}</h2>
        <div className="mx-auto max-w-4xl px-4 md:px-8">
          <div className="grid grid-cols-3 gap-4">
            {videos.map(video => (
              <SocialVideoCard key={video.id} video={video} lang={lang} />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile layout — horizontal scroll cards */}
      <div className="md:hidden">
        <h2 className="mb-6 text-center text-2xl font-bold text-white">{title}</h2>
        <div className="flex gap-3 overflow-x-auto px-4 pb-4 snap-x snap-mandatory scrollbar-hide">
          {videos.map(video => (
            <div key={video.id} className="w-[60vw] shrink-0 snap-center">
              <SocialVideoCard video={video} lang={lang} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
