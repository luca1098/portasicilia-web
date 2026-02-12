'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTranslation } from '@/lib/context/translation.context'
import type { Experience } from '@/lib/schemas/entities/experience.entity.schema'
import type { Locality } from '@/lib/schemas/entities/locality.entity.schema'
import type { Category } from '@/lib/schemas/entities/category.entity.schema'
import ExperienceTab from './tabs/experience-tab'
import ScheduleTab from './tabs/schedule-tab'
import PricingSetupTab from './tabs/pricing-setup-tab'
import ImageList from '../image-list'
import ItineraryList from '../itinerary-list'
import CommissionForm from '../commission-form'

const CREATE_TABS = ['experience'] as const
const EDIT_TABS = ['experience', 'schedule', 'pricing', 'gallery', 'itinerary', 'fees'] as const

type ExperienceWizardProps = {
  mode: 'create' | 'edit'
  experience?: Experience
  localities: Locality[]
  categories: Category[]
}

function EditOnlyPlaceholder({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-8 text-center">
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}

export default function ExperienceWizard({
  mode,
  experience,
  localities,
  categories,
}: ExperienceWizardProps) {
  const [activeTab, setActiveTab] = useState<string>('experience')
  const [currentExperience, setCurrentExperience] = useState<Experience | undefined>(experience)
  const [currentMode, setCurrentMode] = useState<'create' | 'edit'>(mode)
  const router = useRouter()
  const params = useParams()
  const lang = params.lang as string
  const t = useTranslation() as Record<string, string>

  const tabs = currentMode === 'create' ? CREATE_TABS : EDIT_TABS
  const isEditing = currentMode === 'edit' && !!currentExperience

  const handleCreated = (newExperience: Experience) => {
    setCurrentExperience(newExperience)
    setCurrentMode('edit')
    setActiveTab('schedule')
    router.replace(`/${lang}/dashboard/admin/experiences/${newExperience.id}`)
  }

  const handleExperienceUpdated = (updated: Experience) => {
    setCurrentExperience(prev => (prev ? { ...prev, ...updated } : updated))
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="w-full justify-start overflow-x-auto">
        {tabs.map(tab => (
          <TabsTrigger key={tab} value={tab} disabled={currentMode === 'create' && tab !== 'experience'}>
            {t[`admin_wizard_tab_${tab}`] ?? tab}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="experience" className="mt-6">
        <ExperienceTab
          mode={currentMode}
          experience={currentExperience}
          localities={localities}
          categories={categories}
          onCreated={handleCreated}
        />
      </TabsContent>

      <TabsContent value="schedule" className="mt-6">
        {isEditing ? (
          <ScheduleTab
            experienceId={currentExperience.id}
            experience={currentExperience}
            onSaved={handleExperienceUpdated}
          />
        ) : (
          <EditOnlyPlaceholder message={t.admin_wizard_edit_only_notice} />
        )}
      </TabsContent>

      <TabsContent value="pricing" className="mt-6" forceMount>
        <div
          className="hidden data-[state=active]:block"
          data-state={activeTab === 'pricing' ? 'active' : 'inactive'}
        >
          {isEditing ? (
            <PricingSetupTab
              experienceId={currentExperience.id}
              experience={currentExperience}
              onSaved={handleExperienceUpdated}
            />
          ) : (
            <EditOnlyPlaceholder message={t.admin_wizard_edit_only_notice} />
          )}
        </div>
      </TabsContent>

      <TabsContent value="gallery" className="mt-6">
        {isEditing ? (
          <ImageList experienceId={currentExperience.id} images={currentExperience.images ?? []} />
        ) : (
          <EditOnlyPlaceholder message={t.admin_wizard_edit_only_notice} />
        )}
      </TabsContent>

      <TabsContent value="itinerary" className="mt-6">
        {isEditing ? (
          <ItineraryList experienceId={currentExperience.id} items={currentExperience.itinerary ?? []} />
        ) : (
          <EditOnlyPlaceholder message={t.admin_wizard_edit_only_notice} />
        )}
      </TabsContent>

      <TabsContent value="fees" className="mt-6">
        {isEditing ? (
          <CommissionForm experience={currentExperience} />
        ) : (
          <EditOnlyPlaceholder message={t.admin_wizard_edit_only_notice} />
        )}
      </TabsContent>
    </Tabs>
  )
}
