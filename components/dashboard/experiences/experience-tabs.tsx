'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTranslation } from '@/lib/context/translation.context'
import type { Experience } from '@/lib/schemas/entities/experience.entity.schema'
import type { PriceList } from '@/lib/schemas/entities/pricing.entity.schema'
import type { Locality } from '@/lib/schemas/entities/locality.entity.schema'
import ExperienceForm from './experience-form'
import CommissionForm from './commission-form'
import ItineraryList from './itinerary-list'
import TimeSlotList from './time-slot-list'
import PricingTab from './pricing-tab'
import ImageList from './image-list'

type ExperienceTabsProps = {
  experience: Experience
  localities: Locality[]
  priceLists: PriceList[]
}

export default function ExperienceTabs({ experience, localities, priceLists }: ExperienceTabsProps) {
  const t = useTranslation()

  return (
    <Tabs defaultValue="general">
      <TabsList className="w-full justify-start overflow-x-auto">
        <TabsTrigger value="general">{t.admin_exp_tab_general}</TabsTrigger>
        <TabsTrigger value="itinerary">{t.admin_exp_tab_itinerary}</TabsTrigger>
        <TabsTrigger value="time-slots">{t.admin_exp_tab_time_slots}</TabsTrigger>
        <TabsTrigger value="commission">{t.admin_exp_tab_commission}</TabsTrigger>
        <TabsTrigger value="pricing">{t.admin_exp_tab_pricing}</TabsTrigger>
        <TabsTrigger value="images">{t.admin_exp_tab_images}</TabsTrigger>
      </TabsList>

      <TabsContent value="general">
        <ExperienceForm mode="edit" experience={experience} localities={localities} />
      </TabsContent>

      <TabsContent value="itinerary">
        <ItineraryList experienceId={experience.id} items={experience.itinerary ?? []} />
      </TabsContent>

      <TabsContent value="commission">
        <CommissionForm experience={experience} />
      </TabsContent>

      <TabsContent value="time-slots">
        <TimeSlotList experienceId={experience.id} slots={experience.timeSlots ?? []} />
      </TabsContent>

      <TabsContent value="pricing">
        <PricingTab experienceId={experience.id} priceLists={priceLists} />
      </TabsContent>

      <TabsContent value="images">
        <ImageList experienceId={experience.id} images={experience.images ?? []} />
      </TabsContent>
    </Tabs>
  )
}
