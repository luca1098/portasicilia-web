import Image from 'next/image'
import { Tip } from '@/lib/schemas/entities/tips.entity.schema'

type LocationTipsSectionProps = {
  title: string
  tips: Tip[]
}

export default function LocationTipsSection({ title, tips }: LocationTipsSectionProps) {
  if (!tips?.length) return null
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 md:px-8">
      <h2 className="mb-10 text-2xl font-bold md:text-3xl">{title}</h2>
      <div className="flex flex-col gap-8">
        {tips.map((tip, index) => {
          const isReversed = index % 2 !== 0

          return (
            <div
              key={tip.title}
              className={`flex flex-col overflow-hidden rounded-2xl bg-primary-foreground md:flex-row p-4 ${isReversed ? 'md:flex-row-reverse' : ''}`}
            >
              <div className="relative aspect-square w-full md:aspect-square md:w-1/2 overflow-hidden rounded-2xl max-w-[300px]">
                <Image
                  src={tip.cover ?? ''}
                  alt={tip.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="flex w-full flex-col justify-center p-6  md:p-10">
                <h3 className="mb-3 text-xl font-bold md:text-2xl">{tip.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                  {tip.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
