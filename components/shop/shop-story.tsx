import Image from 'next/image'
import { getTranslations } from '@/lib/configs/locales/i18n'
import { SupportedLocale } from '@/lib/configs/locales'
import type { ShopCategory } from '@/lib/schemas/entities/product.entity.schema'
import { Button } from '@/components/ui/button'
import { ArrowRight } from '@/lib/constants/icons'

type ShopStoryProps = {
  lang: string
  category: ShopCategory | null
}

export default async function ShopStory({ lang, category }: ShopStoryProps) {
  const t = await getTranslations(lang as SupportedLocale)

  const body = category?.description ?? t.shop_story_body
  const image = category?.cover ?? null

  return (
    <section id="story" className="bg-secondary/40">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-12 md:gap-14 md:px-8 md:py-24">
        <div className="relative order-last aspect-[4/5] overflow-hidden rounded-3xl bg-muted md:order-first md:col-span-5 md:aspect-[4/5]">
          {image ? (
            <Image
              src={image}
              alt={category?.name ?? ''}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/15 to-secondary" />
          )}
        </div>

        <div className="flex flex-col gap-6 md:col-span-7">
          <span className="inline-flex w-fit items-center rounded-full border border-border bg-background px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {t.shop_story_eyebrow}
          </span>
          <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight text-foreground md:text-4xl lg:text-5xl">
            {t.shop_story_title}
          </h2>
          <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">{body}</p>
          <Button asChild size="lg" variant="outline" className="w-fit rounded-full">
            <a href="#products" className="flex items-center gap-2">
              {t.shop_story_cta}
              <ArrowRight className="size-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
