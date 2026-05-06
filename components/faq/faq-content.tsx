'use client'

import { useState } from 'react'
import { useTranslation } from '@/lib/context/translation.context'
import { cn } from '@/lib/utils/shadcn.utils'
import { FAQ_CATEGORIES, FaqCategoryKey } from '@/lib/constants/faq'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

const FaqContent = () => {
  const [activeCategory, setActiveCategory] = useState<FaqCategoryKey>('how_it_works')

  const t = useTranslation()
  const currentCategory = FAQ_CATEGORIES.find(c => c.key === activeCategory) ?? FAQ_CATEGORIES[0]
  const questions = Array.from({ length: currentCategory.questionCount }, (_, i) => i + 1)

  const tr = (key: string) => (t as Record<string, string>)[key] ?? key

  return (
    <div>
      {/* Category cards */}
      <div className="mb-12 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
        {FAQ_CATEGORIES.map(category => {
          const Icon = category.icon
          const isActive = category.key === activeCategory
          return (
            <button
              key={category.key}
              onClick={() => setActiveCategory(category.key)}
              className={cn(
                'flex flex-col items-center gap-3 rounded-xl border-2 px-4 py-5 text-sm font-medium transition-colors',
                isActive
                  ? 'border-teal-500 text-teal-700'
                  : 'border-muted bg-card text-muted-foreground hover:border-teal-300'
              )}
            >
              <Icon className="size-8 stroke-[1.5]" />
              <span className="text-center leading-tight">{tr(category.titleKey)}</span>
            </button>
          )
        })}
      </div>

      {/* Section title */}
      <h2 className="mb-6 text-2xl font-semibold">{tr(currentCategory.titleKey)}</h2>

      {/* Accordion FAQ items */}
      <Accordion type="single" collapsible className="w-full">
        {questions.map(n => (
          <AccordionItem key={`${activeCategory}-${n}`} value={`${activeCategory}-${n}`}>
            <AccordionTrigger className="relative text-left text-base font-medium after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-teal-500 after:transition-transform data-[state=open]:after:scale-x-100">
              {tr(`faq_${activeCategory}_${n}_question`)}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {tr(`faq_${activeCategory}_${n}_answer`)}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

export default FaqContent
