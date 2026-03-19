'use client'

import { useState } from 'react'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { InputFormField, SelectFormField, CurrencyFormField, NumberFormField } from '@/components/form'
import { useTranslation } from '@/lib/context/translation.context'
import { useAction } from '@/lib/hooks/use-action'
import {
  createStayModifierAction,
  updateStayModifierAction,
  deleteStayModifierAction,
} from '@/lib/actions/stays.actions'
import {
  StaySeasonalModifierFormSchema,
  type StaySeasonalModifierFormValues,
} from '@/lib/schemas/forms/stay-seasonal-modifier.form.schema'
import type { PriceModifier } from '@/lib/schemas/entities/pricing.entity.schema'
import type { Stay } from '@/lib/schemas/entities/stay.entity.schema'
import { PlusIcon, PencilIcon, Trash2Icon, LoaderIcon, XIcon } from '@/lib/constants/icons'

type SeasonalPricingSectionProps = {
  stayId: string
  priceListId: string
  modifiers: PriceModifier[]
  onSaved?: (updated: Stay) => void
}

export default function SeasonalPricingSection({
  stayId,
  priceListId,
  modifiers,
  onSaved,
}: SeasonalPricingSectionProps) {
  const t = useTranslation() as Record<string, string>

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const form = useForm<StaySeasonalModifierFormValues>({
    resolver: zodResolver(StaySeasonalModifierFormSchema),
    defaultValues: {
      name: '',
      dateFrom: '',
      dateTo: '',
      adjustmentType: 'PERCENTAGE',
      value: 0,
    },
  })

  const { loading: createLoading, execute: executeCreate } = useAction<Stay>({
    successMessage: t.admin_stay_seasonal_created,
    onSuccess: data => {
      setShowForm(false)
      form.reset()
      if (data) onSaved?.(data)
    },
  })

  const { loading: updateLoading, execute: executeUpdate } = useAction<Stay>({
    successMessage: t.admin_stay_seasonal_updated,
    onSuccess: data => {
      setEditingId(null)
      form.reset()
      if (data) onSaved?.(data)
    },
  })

  const { loading: deleteLoading, execute: executeDelete } = useAction<Stay>({
    successMessage: t.admin_stay_seasonal_deleted,
    onSuccess: data => {
      setConfirmDeleteId(null)
      if (data) onSaved?.(data)
    },
  })

  const isSaving = createLoading || updateLoading
  const adjustmentType = useWatch({ control: form.control, name: 'adjustmentType' })

  const buildPayload = (data: StaySeasonalModifierFormValues) => ({
    name: data.name,
    type: 'SEASONAL',
    adjustmentType: data.adjustmentType,
    value: data.value,
    conditions: { dates: [`${data.dateFrom}/${data.dateTo}`] },
    stackable: false,
    active: true,
  })

  const handleCreate = async (data: StaySeasonalModifierFormValues) => {
    await executeCreate(() => createStayModifierAction(stayId, priceListId, buildPayload(data)))
  }

  const handleUpdate = async (data: StaySeasonalModifierFormValues) => {
    if (!editingId) return
    const { type: _, adjustmentType: __, ...payload } = buildPayload(data)
    await executeUpdate(() => updateStayModifierAction(stayId, priceListId, editingId, payload))
  }

  const handleDelete = async (modifierId: string) => {
    await executeDelete(() => deleteStayModifierAction(stayId, priceListId, modifierId))
  }

  const startEditing = (modifier: PriceModifier) => {
    const conditions = modifier.conditions as { dates?: string[] } | null
    const dateRange = conditions?.dates?.[0] ?? ''
    const [dateFrom, dateTo] = dateRange.split('/')

    form.reset({
      name: modifier.name,
      dateFrom: dateFrom ?? '',
      dateTo: dateTo ?? '',
      adjustmentType: modifier.adjustmentType,
      value: modifier.value,
    })
    setEditingId(modifier.id)
    setShowForm(true)
  }

  const cancelForm = () => {
    setShowForm(false)
    setEditingId(null)
    form.reset()
  }

  const formatLongDate = (dateStr: string) =>
    new Date(dateStr + 'T00:00:00').toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })

  const formatDateRange = (modifier: PriceModifier) => {
    const conditions = modifier.conditions as { dates?: string[] } | null
    const dateRange = conditions?.dates?.[0] ?? ''
    const [start, end] = dateRange.split('/')
    if (!start || !end) return ''
    return `Da ${formatLongDate(start)} al ${formatLongDate(end)}`
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">{t.admin_stay_seasonal_title}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{t.admin_stay_seasonal_subtitle}</p>
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
            {t.admin_stay_seasonal_add}
          </Button>
        )}
      </div>

      {modifiers.length === 0 && !showForm && (
        <p className="text-sm text-muted-foreground">{t.admin_stay_seasonal_empty}</p>
      )}

      {/* Existing modifiers */}
      <div className="space-y-3">
        {modifiers.map(modifier => (
          <div
            key={modifier.id}
            className="flex items-center justify-between rounded-lg border border-border bg-background p-4"
          >
            <div className="space-y-1">
              <p className="text-sm font-medium">{modifier.name}</p>
              <p className="text-xs text-muted-foreground">{formatDateRange(modifier)}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">
                {modifier.adjustmentType === 'PERCENTAGE' ? `+${modifier.value}%` : `+€${modifier.value}`}
              </span>
              {confirmDeleteId === modifier.id ? (
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    disabled={deleteLoading}
                    onClick={() => handleDelete(modifier.id)}
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
                    onClick={() => startEditing(modifier)}
                  >
                    <PencilIcon className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={() => setConfirmDeleteId(modifier.id)}
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <InputFormField<StaySeasonalModifierFormValues>
                  name="name"
                  label={t.admin_stay_seasonal_name}
                />
              </div>
              <InputFormField<StaySeasonalModifierFormValues>
                name="dateFrom"
                label={t.admin_stay_seasonal_date_from}
                type="date"
              />
              <InputFormField<StaySeasonalModifierFormValues>
                name="dateTo"
                label={t.admin_stay_seasonal_date_to}
                type="date"
              />
              <SelectFormField<StaySeasonalModifierFormValues, { value: string; label: string }>
                name="adjustmentType"
                label={t.admin_stay_seasonal_type}
                options={[
                  { value: 'PERCENTAGE', label: t.admin_stay_seasonal_percentage },
                  { value: 'ABSOLUTE', label: t.admin_stay_seasonal_absolute },
                ]}
                getValue={o => o.value}
                getLabel={o => o.label}
              />
              {adjustmentType === 'PERCENTAGE' ? (
                <NumberFormField<StaySeasonalModifierFormValues>
                  name="value"
                  label={t.admin_stay_seasonal_value}
                  step="0.01"
                  min="0"
                />
              ) : (
                <CurrencyFormField<StaySeasonalModifierFormValues>
                  name="value"
                  label={t.admin_stay_seasonal_value}
                />
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={cancelForm}>
                {t.admin_common_cancel}
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving && <LoaderIcon className="size-4 animate-spin" />}
                {editingId ? t.admin_exp_save : t.admin_stay_seasonal_add}
              </Button>
            </div>
          </form>
        </FormProvider>
      )}
    </div>
  )
}
