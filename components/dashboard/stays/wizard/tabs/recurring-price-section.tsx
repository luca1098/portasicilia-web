'use client'

import { useState } from 'react'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/shadcn.utils'
import { InputFormField, CurrencyFormField } from '@/components/form'
import { useTranslation } from '@/lib/context/translation.context'
import { useAction } from '@/lib/hooks/use-action'
import {
  createStayOverrideAction,
  updateStayOverrideAction,
  deleteStayOverrideAction,
} from '@/lib/actions/stays.actions'
import {
  RecurringStayPriceFormSchema,
  type RecurringStayPriceFormValues,
} from '@/lib/schemas/forms/recurring-stay-price.form.schema'
import type { PriceOverride } from '@/lib/schemas/entities/pricing.entity.schema'
import type { Stay } from '@/lib/schemas/entities/stay.entity.schema'
import { PlusIcon, PencilIcon, Trash2Icon, LoaderIcon, XIcon } from '@/lib/constants/icons'

type RecurringPriceSectionProps = {
  stayId: string
  priceTierId: string
  overrides: PriceOverride[]
  onSaved?: (updated: Stay) => void
}

// JS getDay() numbering: 0=Sunday … 6=Saturday. Displayed Mon→Sun.
const DAY_ORDER: { value: number; key: string }[] = [
  { value: 1, key: 'mon' },
  { value: 2, key: 'tue' },
  { value: 3, key: 'wed' },
  { value: 4, key: 'thu' },
  { value: 5, key: 'fri' },
  { value: 6, key: 'sat' },
  { value: 0, key: 'sun' },
]
const WEEKEND_DAYS = [6, 0]

export default function RecurringPriceSection({
  stayId,
  priceTierId,
  overrides,
  onSaved,
}: RecurringPriceSectionProps) {
  const t = useTranslation() as Record<string, string>

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const form = useForm<RecurringStayPriceFormValues>({
    resolver: zodResolver(RecurringStayPriceFormSchema),
    defaultValues: {
      name: '',
      dayOfWeek: [],
      overrideAmount: 0,
      dateFrom: '',
      dateTo: '',
    },
  })

  const { loading: createLoading, execute: executeCreate } = useAction<Stay>({
    successMessage: t.admin_stay_recurring_created,
    onSuccess: data => {
      setShowForm(false)
      form.reset()
      if (data) onSaved?.(data)
    },
  })

  const { loading: updateLoading, execute: executeUpdate } = useAction<Stay>({
    successMessage: t.admin_stay_recurring_updated,
    onSuccess: data => {
      setEditingId(null)
      form.reset()
      if (data) onSaved?.(data)
    },
  })

  const { loading: deleteLoading, execute: executeDelete } = useAction<Stay>({
    successMessage: t.admin_stay_recurring_deleted,
    onSuccess: data => {
      setConfirmDeleteId(null)
      if (data) onSaved?.(data)
    },
  })

  const isSaving = createLoading || updateLoading
  const selectedDays = useWatch({ control: form.control, name: 'dayOfWeek' }) ?? []

  const toggleDay = (day: number) => {
    const next = selectedDays.includes(day) ? selectedDays.filter(d => d !== day) : [...selectedDays, day]
    form.setValue('dayOfWeek', next, { shouldValidate: true, shouldDirty: true })
  }

  const isWeekendSelected =
    selectedDays.length === WEEKEND_DAYS.length && WEEKEND_DAYS.every(d => selectedDays.includes(d))

  const applyWeekendPreset = () => {
    form.setValue('dayOfWeek', isWeekendSelected ? [] : [...WEEKEND_DAYS], {
      shouldValidate: true,
      shouldDirty: true,
    })
  }

  const buildPayload = (data: RecurringStayPriceFormValues) => ({
    name: data.name,
    overrideAmount: data.overrideAmount,
    dayOfWeek: data.dayOfWeek,
    dateFrom: data.dateFrom || null,
    dateTo: data.dateTo || null,
    active: true,
  })

  const handleCreate = async (data: RecurringStayPriceFormValues) => {
    await executeCreate(() => createStayOverrideAction(stayId, priceTierId, buildPayload(data)))
  }

  const handleUpdate = async (data: RecurringStayPriceFormValues) => {
    if (!editingId) return
    await executeUpdate(() => updateStayOverrideAction(stayId, priceTierId, editingId, buildPayload(data)))
  }

  const handleDelete = async (overrideId: string) => {
    await executeDelete(() => deleteStayOverrideAction(stayId, priceTierId, overrideId))
  }

  const startEditing = (override: PriceOverride) => {
    form.reset({
      name: override.name,
      dayOfWeek: override.dayOfWeek ?? [],
      overrideAmount: override.overrideAmount,
      dateFrom: override.dateFrom ? override.dateFrom.split('T')[0] : '',
      dateTo: override.dateTo ? override.dateTo.split('T')[0] : '',
    })
    setEditingId(override.id)
    setShowForm(true)
  }

  const cancelForm = () => {
    setShowForm(false)
    setEditingId(null)
    form.reset()
  }

  const formatDays = (days: number[] | null) => {
    if (!days || days.length === 0) return ''
    if (days.length === WEEKEND_DAYS.length && WEEKEND_DAYS.every(d => days.includes(d))) {
      return t.admin_stay_recurring_weekend
    }
    return DAY_ORDER.filter(d => days.includes(d.value))
      .map(d => t[`admin_stay_recurring_day_${d.key}`])
      .join(', ')
  }

  const formatWindow = (override: PriceOverride) => {
    if (!override.dateFrom && !override.dateTo) return t.admin_stay_recurring_always
    const fmt = (d: string) =>
      new Date(d.split('T')[0] + 'T00:00:00').toLocaleDateString('it-IT', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    if (override.dateFrom && override.dateTo) return `${fmt(override.dateFrom)} – ${fmt(override.dateTo)}`
    if (override.dateFrom) return `${t.admin_stay_recurring_from} ${fmt(override.dateFrom)}`
    return `${t.admin_stay_recurring_until} ${fmt(override.dateTo as string)}`
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">{t.admin_stay_recurring_title}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{t.admin_stay_recurring_subtitle}</p>
        </div>
        {!showForm && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              form.reset()
              setEditingId(null)
              setShowForm(true)
            }}
          >
            <PlusIcon className="size-4" />
            {t.admin_stay_recurring_add}
          </Button>
        )}
      </div>

      {overrides.length === 0 && !showForm && (
        <p className="text-sm text-muted-foreground">{t.admin_stay_recurring_empty}</p>
      )}

      {/* Existing recurring prices */}
      <div className="space-y-3">
        {overrides.map(override => (
          <div
            key={override.id}
            className="flex items-center justify-between rounded-lg border border-border bg-background p-4"
          >
            <div className="space-y-1">
              <p className="text-sm font-medium">{override.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatDays(override.dayOfWeek)} · {formatWindow(override)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">€{override.overrideAmount}</span>
              {confirmDeleteId === override.id ? (
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    disabled={deleteLoading}
                    onClick={() => handleDelete(override.id)}
                  >
                    {deleteLoading && <LoaderIcon className="size-3 animate-spin" />}
                    {t.admin_common_confirm}
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setConfirmDeleteId(null)}>
                    <XIcon className="size-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={() => startEditing(override)}
                  >
                    <PencilIcon className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={() => setConfirmDeleteId(override.id)}
                  >
                    <Trash2Icon className="size-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit form */}
      {showForm && (
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(editingId ? handleUpdate : handleCreate)}
            className="space-y-4 rounded-lg border border-border bg-background p-4"
          >
            <InputFormField<RecurringStayPriceFormValues> name="name" label={t.admin_stay_recurring_name} />

            {/* Day-of-week selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t.admin_stay_recurring_days}</span>
                <Button
                  type="button"
                  variant={isWeekendSelected ? 'default' : 'outline'}
                  size="sm"
                  onClick={applyWeekendPreset}
                >
                  {t.admin_stay_recurring_weekend}
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {DAY_ORDER.map(day => {
                  const selected = selectedDays.includes(day.value)
                  return (
                    <button
                      key={day.value}
                      type="button"
                      onClick={() => toggleDay(day.value)}
                      className={cn(
                        'rounded-md border px-3 py-1.5 text-sm transition-colors',
                        selected
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-background hover:bg-muted'
                      )}
                    >
                      {t[`admin_stay_recurring_day_${day.key}`]}
                    </button>
                  )
                })}
              </div>
              {form.formState.errors.dayOfWeek && (
                <p className="text-xs text-destructive">{t.admin_stay_recurring_days_required}</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <CurrencyFormField<RecurringStayPriceFormValues>
                name="overrideAmount"
                label={t.admin_stay_recurring_price}
              />
              <InputFormField<RecurringStayPriceFormValues>
                name="dateFrom"
                label={t.admin_stay_recurring_date_from}
                type="date"
              />
              <InputFormField<RecurringStayPriceFormValues>
                name="dateTo"
                label={t.admin_stay_recurring_date_to}
                type="date"
              />
            </div>
            <p className="text-xs text-muted-foreground">{t.admin_stay_recurring_dates_hint}</p>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={cancelForm}>
                {t.admin_common_cancel}
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving && <LoaderIcon className="size-4 animate-spin" />}
                {editingId ? t.admin_exp_save : t.admin_stay_recurring_add}
              </Button>
            </div>
          </form>
        </FormProvider>
      )}
    </div>
  )
}
