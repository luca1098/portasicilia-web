'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useTranslation } from '@/lib/context/translation.context'
import { useAction } from '@/lib/hooks/use-action'
import { setStayAvailabilityAction } from '@/lib/actions/stays.actions'
import { PlusIcon, Trash2Icon, LoaderIcon, CalendarIcon } from '@/lib/constants/icons'
import type { Stay } from '@/lib/schemas/entities/stay.entity.schema'
import type { StayAvailability } from '@/lib/schemas/entities/stay.entity.schema'

type AvailabilityRange = {
  id?: string
  dateFrom: string
  dateTo: string
  available: boolean
}

type AvailabilityTabProps = {
  stayId: string
  stay: Stay
  onSaved?: (updated: Stay) => void
}

export default function AvailabilityTab({ stayId, stay, onSaved }: AvailabilityTabProps) {
  const t = useTranslation() as Record<string, string>

  const existingAvailability: StayAvailability[] = stay.stayDetail?.availability ?? stay.availability ?? []

  const [ranges, setRanges] = useState<AvailabilityRange[]>(
    existingAvailability.map(a => ({
      id: a.id,
      dateFrom: a.dateFrom.split('T')[0],
      dateTo: a.dateTo.split('T')[0],
      available: a.available,
    }))
  )

  const { loading, execute } = useAction<Stay>({
    successMessage: t.admin_stay_availability_success,
    onSuccess: data => {
      if (data) onSaved?.(data)
    },
  })

  const addRange = () => {
    setRanges(prev => [...prev, { dateFrom: '', dateTo: '', available: true }])
  }

  const removeRange = (index: number) => {
    setRanges(prev => prev.filter((_, i) => i !== index))
  }

  const updateRange = (index: number, field: keyof AvailabilityRange, value: string | boolean) => {
    setRanges(prev => prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)))
  }

  const handleSave = async () => {
    const validRanges = ranges.filter(r => r.dateFrom && r.dateTo)
    await execute(() =>
      setStayAvailabilityAction(stayId, {
        ranges: validRanges.map(r => ({
          dateFrom: r.dateFrom,
          dateTo: r.dateTo,
          available: r.available,
        })),
      })
    )
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-6 space-y-6">
        <div>
          <h3 className="text-sm font-semibold">{t.admin_stay_availability_title}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{t.admin_stay_availability_subtitle}</p>
        </div>

        {ranges.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-8 text-center">
            <CalendarIcon className="mx-auto mb-3 size-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">{t.admin_stay_availability_empty}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {ranges.map((range, index) => (
              <div
                key={index}
                className="flex flex-col gap-3 rounded-lg border border-border p-4 sm:flex-row sm:items-end"
              >
                <div className="flex-1 space-y-1.5">
                  <Label className="text-xs">{t.admin_stay_availability_from}</Label>
                  <Input
                    type="date"
                    value={range.dateFrom}
                    onChange={e => updateRange(index, 'dateFrom', e.target.value)}
                  />
                </div>
                <div className="flex-1 space-y-1.5">
                  <Label className="text-xs">{t.admin_stay_availability_to}</Label>
                  <Input
                    type="date"
                    value={range.dateTo}
                    onChange={e => updateRange(index, 'dateTo', e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={range.available}
                    onCheckedChange={checked => updateRange(index, 'available', checked)}
                  />
                  <span className="text-xs text-muted-foreground">
                    {range.available
                      ? t.admin_stay_availability_available
                      : t.admin_stay_availability_blocked}
                  </span>
                </div>
                <Button type="button" variant="ghost" size="icon-sm" onClick={() => removeRange(index)}>
                  <Trash2Icon className="size-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <Button type="button" variant="outline" onClick={addRange}>
          <PlusIcon className="size-4" />
          {t.admin_stay_availability_add}
        </Button>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={loading}>
          {loading && <LoaderIcon className="size-4 animate-spin" />}
          {loading ? t.admin_exp_saving : t.admin_stay_availability_save}
        </Button>
      </div>
    </div>
  )
}
