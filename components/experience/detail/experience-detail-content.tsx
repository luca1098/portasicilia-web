'use client'

import type { Experience } from '@/lib/schemas/entities/experience.entity.schema'
import ExperienceGallery from '@/components/experience/detail/experience-gallery'
import ExperienceInfo from '@/components/experience/detail/experience-info'
import ExperienceBookingCard from '@/components/experience/detail/experience-booking-card'
import ExperienceMobileBookingBar from '@/components/experience/detail/experience-mobile-booking-bar'

type ExperienceDetailContentProps = {
  experience: Experience
}

export default function ExperienceDetailContent({ experience }: ExperienceDetailContentProps) {
  const galleryImages = experience.images?.map(img => img.url) ?? []
  const price = 0

  return (
    <main className="min-h-screen pb-20 lg:pb-0">
      <section className="mx-auto max-w-7xl px-4 pt-6 md:px-8 lg:flex lg:gap-10">
        {/* Left column: gallery + info */}
        <div className="min-w-0 flex-1">
          <ExperienceGallery images={galleryImages} alt={experience.name} />
          <div className="py-8">
            <ExperienceInfo experience={experience} />
          </div>
        </div>

        {/* Right column: sticky booking card (desktop only) */}
        <aside className="hidden lg:block lg:w-[380px] lg:shrink-0">
          <div className="sticky top-24">
            <ExperienceBookingCard experience={experience} />
          </div>
        </aside>
      </section>

      {/* Mobile booking bar */}
      <ExperienceMobileBookingBar price={price} />
    </main>
  )
}
