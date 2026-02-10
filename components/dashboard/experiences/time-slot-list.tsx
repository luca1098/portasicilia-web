'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/context/translation.context'
import { PlusIcon, Trash2Icon } from '@/lib/constants/icons'
import type { ExperienceTimeSlot } from '@/lib/schemas/entities/experience.entity.schema'
import TimeSlotFormDialog from './time-slot-form-dialog'
import TimeSlotDeleteDialog from './time-slot-delete-dialog'

type TimeSlotListProps = {
  experienceId: string
  slots: ExperienceTimeSlot[]
}

export default function TimeSlotList({ experienceId, slots }: TimeSlotListProps) {
  const [formOpen, setFormOpen] = useState(false)
  const [deleteSlot, setDeleteSlot] = useState<ExperienceTimeSlot | null>(null)
  const t = useTranslation() as Record<string, string>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">{t.admin_timeslot_section_title}</h2>
          <p className="text-sm text-muted-foreground">{t.admin_timeslot_section_subtitle}</p>
        </div>
        <Button size="default" onClick={() => setFormOpen(true)}>
          <PlusIcon className="size-4" />
          {t.admin_timeslot_add}
        </Button>
      </div>

      {slots.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">{t.admin_timeslot_no_results}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {slots.map(slot => (
            <div
              key={slot.id}
              className="flex items-center gap-4 rounded-xl border border-border bg-card p-4"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium">
                  {t[`admin_day_${slot.dayOfWeek.toLowerCase()}`] ?? slot.dayOfWeek}
                </p>
                <p className="text-sm text-muted-foreground">
                  {slot.startTime} - {slot.endTime}
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button variant="ghost" size="icon-sm" onClick={() => setDeleteSlot(slot)}>
                  <Trash2Icon className="size-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <TimeSlotFormDialog experienceId={experienceId} open={formOpen} onOpenChange={setFormOpen} />

      {deleteSlot && (
        <TimeSlotDeleteDialog
          experienceId={experienceId}
          slotId={deleteSlot.id}
          open={!!deleteSlot}
          onOpenChange={open => !open && setDeleteSlot(null)}
        />
      )}
    </div>
  )
}
