'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTranslation } from '@/lib/context/translation.context'
import type { Stay } from '@/lib/schemas/entities/stay.entity.schema'
import type { Locality } from '@/lib/schemas/entities/locality.entity.schema'
import type { Category } from '@/lib/schemas/entities/category.entity.schema'
import StayTab from './tabs/stay-tab'
import AvailabilityTab from './tabs/availability-tab'
import StayPricingSetupTab from './tabs/pricing-setup-tab'
import ImageList from '../image-list'
import CommissionForm from '../../experiences/commission-form'
import GoogleBusinessTab from '../../google-business-tab'
import { updateStayAction } from '@/lib/actions/stays.actions'

const CREATE_TABS = ['stay'] as const
const EDIT_TABS = ['stay', 'availability', 'pricing', 'gallery', 'reviews', 'fees'] as const

type StayWizardProps = {
  mode: 'create' | 'edit'
  stay?: Stay
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

export default function StayWizard({ mode, stay, localities, categories }: StayWizardProps) {
  const [activeTab, setActiveTab] = useState<string>('stay')
  const [currentStay, setCurrentStay] = useState<Stay | undefined>(stay)
  const [currentMode, setCurrentMode] = useState<'create' | 'edit'>(mode)
  const router = useRouter()
  const params = useParams()
  const lang = params.lang as string
  const t = useTranslation() as Record<string, string>

  const tabs = currentMode === 'create' ? CREATE_TABS : EDIT_TABS
  const isEditing = currentMode === 'edit' && !!currentStay

  const handleCreated = (newStay: Stay) => {
    setCurrentStay(newStay)
    setCurrentMode('edit')
    setActiveTab('availability')
    router.replace(`/${lang}/dashboard/admin/stays/${newStay.id}`)
  }

  const handleStayUpdated = (updated: Stay) => {
    setCurrentStay(prev => (prev ? { ...prev, ...updated, id: prev.id } : updated))
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="w-full justify-start overflow-x-auto">
        {tabs.map(tab => (
          <TabsTrigger key={tab} value={tab} disabled={currentMode === 'create' && tab !== 'stay'}>
            {t[`admin_wizard_tab_${tab}`]}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="stay" className="mt-6">
        <StayTab
          mode={currentMode}
          stay={currentStay}
          localities={localities}
          categories={categories}
          onCreated={handleCreated}
        />
      </TabsContent>

      <TabsContent value="availability" className="mt-6">
        {isEditing ? (
          <AvailabilityTab stayId={currentStay.id} stay={currentStay} onSaved={handleStayUpdated} />
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
            <StayPricingSetupTab stayId={currentStay.id} stay={currentStay} onSaved={handleStayUpdated} />
          ) : (
            <EditOnlyPlaceholder message={t.admin_wizard_edit_only_notice} />
          )}
        </div>
      </TabsContent>

      <TabsContent value="gallery" className="mt-6">
        {isEditing ? (
          <ImageList stayId={currentStay.id} images={currentStay.images ?? []} />
        ) : (
          <EditOnlyPlaceholder message={t.admin_wizard_edit_only_notice} />
        )}
      </TabsContent>

      <TabsContent value="reviews" className="mt-6">
        {isEditing ? (
          <GoogleBusinessTab
            listingId={currentStay.id}
            listingType="stay"
            googleBusinessUrl={currentStay.googleBusinessUrl}
          />
        ) : (
          <EditOnlyPlaceholder message={t.admin_wizard_edit_only_notice} />
        )}
      </TabsContent>

      <TabsContent value="fees" className="mt-6">
        {isEditing ? (
          <CommissionForm
            experience={currentStay as unknown as Parameters<typeof CommissionForm>[0]['experience']}
            updateAction={updateStayAction}
          />
        ) : (
          <EditOnlyPlaceholder message={t.admin_wizard_edit_only_notice} />
        )}
      </TabsContent>
    </Tabs>
  )
}
