'use client'

import { useMemo } from 'react'
import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { SelectFormField } from '@/components/form/select-form-field'
import { CurrencyFormField } from '@/components/form/currency-form-field'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useTranslation } from '@/lib/context/translation.context'
import { updateExperienceAction } from '@/lib/actions/experiences.actions'
import { toFormData } from '@/lib/utils/form-data.utils'
import { useAction } from '@/lib/hooks/use-action'
import { LoaderIcon, InfoIcon } from '@/lib/constants/icons'
import type { Experience } from '@/lib/schemas/entities/experience.entity.schema'

const CommissionFormSchema = z.object({
  commissionType: z.enum(['PERCENTAGE', 'FLAT']).optional(),
  commissionValue: z.number().min(0).nullable().optional(),
})

type CommissionFormValues = {
  commissionType?: 'PERCENTAGE' | 'FLAT'
  commissionValue?: number | null
}

const COMMISSION_TYPES = ['PERCENTAGE', 'FLAT'] as const

function getExperienceBasePrice(experience: Experience): number {
  const tiers = experience.priceLists?.[0]?.tiers ?? []
  if (tiers.length === 0) return 0
  // Use the highest tier price as representative base price
  return Math.max(...tiers.map(t => Number(t.baseAmount)))
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(value)
}

type CommissionFormProps = {
  experience: Experience
}

export default function CommissionForm({ experience }: CommissionFormProps) {
  const t = useTranslation() as Record<string, string>

  const { loading, execute } = useAction<Experience>({
    successMessage: t.admin_exp_update_success,
  })

  const initialCommissionValue = (() => {
    if (experience.commissionValue == null) return 0
    if (experience.commissionType === 'PERCENTAGE') {
      return Number(experience.commissionValue) * 100
    }
    return Number(experience.commissionValue)
  })()

  const form = useForm<CommissionFormValues>({
    resolver: zodResolver(CommissionFormSchema),
    defaultValues: {
      commissionType: experience.commissionType ?? 'PERCENTAGE',
      commissionValue: initialCommissionValue,
    },
  })

  const commissionType = useWatch({ control: form.control, name: 'commissionType' })
  const commissionValue = useWatch({ control: form.control, name: 'commissionValue' })

  const numericCommission = commissionValue ? Number(commissionValue) : 0

  const basePrice = useMemo(() => getExperienceBasePrice(experience), [experience])

  // Compute earnings simulation data reactively
  const simulation = useMemo(() => {
    if (!commissionType || !numericCommission || numericCommission <= 0) return null
    if (basePrice <= 0) return null

    const commission =
      commissionType === 'PERCENTAGE' ? basePrice * (numericCommission / 100) : numericCommission

    return {
      basePrice,
      commissionPercent: commissionType === 'PERCENTAGE' ? numericCommission : null,
      commission: Math.max(0, commission),
    }
  }, [commissionType, numericCommission, basePrice])

  const onSubmit = async (data: CommissionFormValues) => {
    const processed: Record<string, unknown> = { ...data }

    if (!processed.commissionType) {
      delete processed.commissionType
      delete processed.commissionValue
    } else if (processed.commissionValue != null) {
      processed.commissionValue =
        processed.commissionType === 'PERCENTAGE'
          ? (data.commissionValue as number) / 100
          : data.commissionValue
    }

    const fd = toFormData(processed)
    await execute(() => updateExperienceAction(experience.id, fd))
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h3 className="text-sm font-semibold">{t.admin_exp_commission_section}</h3>
          <div className="grid grid-cols-2 gap-4">
            <SelectFormField<CommissionFormValues, (typeof COMMISSION_TYPES)[number]>
              name="commissionType"
              label={t.admin_exp_commission_type}
              options={[...COMMISSION_TYPES]}
              getValue={v => v}
              getLabel={v => t[`admin_exp_commission_type_${v.toLowerCase()}`]}
            />
            <CurrencyFormField<CommissionFormValues>
              name="commissionValue"
              label={t.admin_exp_commission_value}
              suffix={commissionType === 'PERCENTAGE' ? '%' : '\u20AC'}
            />
          </div>
        </div>

        {/* Earnings Simulation */}
        {simulation && (
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold">{t.admin_exp_commission_simulation}</h3>
              <InfoIcon className="size-4 text-muted-foreground" />
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.admin_exp_commission_col_price}</TableHead>
                  <TableHead className="text-right">{t.admin_exp_commission_col_commission}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">{formatCurrency(simulation.basePrice)}</TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    <span>
                      {simulation.commissionPercent != null && (
                        <span className="mr-1 text-xs">({simulation.commissionPercent}%)</span>
                      )}
                      {formatCurrency(simulation.commission)}
                    </span>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <p className="text-xs text-muted-foreground">{t.admin_exp_commission_disclaimer}</p>
          </div>
        )}

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading && <LoaderIcon className="size-4 animate-spin" />}
            {loading ? t.admin_exp_saving : t.admin_exp_save}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
