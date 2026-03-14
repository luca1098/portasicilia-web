import type { Stay } from '@/lib/schemas/entities/stay.entity.schema'
import StayGallery from '@/components/stay/detail/stay-gallery'
import StayInfo from '@/components/stay/detail/stay-info'
import StayBookingCard from '@/components/stay/detail/stay-booking-card'
import StayMobileBookingBar from '@/components/stay/detail/stay-mobile-booking-bar'
import { CheckIcon } from '@/lib/constants/icons'

type StayDetailContentProps = {
  stay: Stay
  lang: string
}

export default async function StayDetailContent({ stay, lang: _ }: StayDetailContentProps) {
  const galleryImages = stay.images?.map(img => img.url) ?? []

  return (
    <main className="min-h-screen pb-20 lg:pb-0">
      <section className="mx-auto max-w-7xl px-4 pt-6 md:px-8 lg:flex lg:gap-10">
        <div className="min-w-0 flex-1">
          <StayGallery images={galleryImages} alt={stay.name} />
          <div className="py-8">
            <StayInfo stay={stay} />
          </div>
        </div>

        <aside className="hidden lg:block lg:w-[380px] lg:shrink-0 pb-10">
          <div className="sticky top-24">
            <StayBookingCard stay={stay} />
            {stay.cancellationTerms.length > 0 && (
              <ul className="mt-5 space-y-2">
                {stay.cancellationTerms.map(item => (
                  <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <CheckIcon className="mt-0.5 size-3 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </section>

      <StayMobileBookingBar stay={stay} />
    </main>
  )
}
