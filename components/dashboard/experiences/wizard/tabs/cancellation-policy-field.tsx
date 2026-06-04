'use client'

import { useFormContext, useWatch } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { useTranslation } from '@/lib/context/translation.context'
import { cn } from '@/lib/utils/shadcn.utils'
type SelectablePolicy = 'FREE_24H' | 'FREE_48H' | 'NON_REFUNDABLE' | 'PARTIAL_REFUND'

type PolicyOption = {
  value: SelectablePolicy
  labelKey: string
}

const POLICY_OPTIONS: PolicyOption[] = [
  { value: 'FREE_24H', labelKey: 'admin_cancellation_preset_24h' },
  { value: 'FREE_48H', labelKey: 'admin_cancellation_preset_48h' },
  { value: 'NON_REFUNDABLE', labelKey: 'admin_cancellation_preset_non_refundable' },
  { value: 'PARTIAL_REFUND', labelKey: 'admin_cancellation_preset_partial_refund_label' },
]

type FormShape = {
  cancellationPolicy: SelectablePolicy
  cancellationRefundPercent: number | null
  cancellationCutoffHours: number | null
  cancellationCustomText: string
}

type Props = {
  label: string
}

export default function CancellationPolicyField({ label }: Props) {
  const t = useTranslation() as Record<string, string>
  const { control, setValue } = useFormContext<FormShape>()
  const policy = useWatch({ control, name: 'cancellationPolicy' })
  const percent = useWatch({ control, name: 'cancellationRefundPercent' })
  const cutoffHours = useWatch({ control, name: 'cancellationCutoffHours' })

  const handleSelect = (value: SelectablePolicy) => {
    setValue('cancellationPolicy', value, { shouldDirty: true, shouldValidate: true })
    if (value !== 'PARTIAL_REFUND') {
      setValue('cancellationRefundPercent', null, { shouldDirty: true })
      setValue('cancellationCutoffHours', null, { shouldDirty: true })
    }
  }

  const handlePercentChange = (raw: string) => {
    const sanitized = raw.replace(/\D/g, '')
    if (!sanitized) {
      setValue('cancellationRefundPercent', null, { shouldDirty: true, shouldValidate: true })
      return
    }
    const clamped = Math.min(Math.max(Number(sanitized), 1), 100)
    setValue('cancellationRefundPercent', clamped, { shouldDirty: true, shouldValidate: true })
  }

  const handleCutoffChange = (raw: string) => {
    const sanitized = raw.replace(/\D/g, '')
    if (!sanitized) {
      setValue('cancellationCutoffHours', null, { shouldDirty: true, shouldValidate: true })
      return
    }
    setValue('cancellationCutoffHours', Number(sanitized), {
      shouldDirty: true,
      shouldValidate: true,
    })
  }

  return (
    <div className="grid gap-2">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label={label}>
        {POLICY_OPTIONS.map(option => {
          const isSelected = policy === option.value
          return (
            <label
              key={option.value}
              className={cn(
                'relative cursor-pointer select-none rounded-md border px-2.5 py-1 text-xs font-medium transition-colors',
                isSelected
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-input bg-transparent text-muted-foreground hover:border-muted-foreground/50'
              )}
            >
              <input
                type="radio"
                name="cancellationPolicy"
                value={option.value}
                checked={isSelected}
                onChange={() => handleSelect(option.value)}
                className="sr-only"
              />
              {t[option.labelKey]}
            </label>
          )
        })}
      </div>

      {policy === 'PARTIAL_REFUND' && (
        <>
          <div className="flex items-center gap-2">
            <label className="text-xs text-muted-foreground shrink-0">
              {t.admin_policy_preset_percentage}
            </label>
            <Input
              type="number"
              min={1}
              max={100}
              value={percent ?? ''}
              onChange={e => handlePercentChange(e.target.value)}
              className="h-10 w-24 pt-2 text-sm"
              placeholder="%"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-muted-foreground shrink-0">
              {t.admin_cancellation_cutoff_hours_label}
            </label>
            <Input
              type="number"
              min={0}
              value={cutoffHours ?? ''}
              onChange={e => handleCutoffChange(e.target.value)}
              className="h-10 w-24 pt-2 text-sm"
              placeholder={t.admin_cancellation_cutoff_hours_placeholder}
            />
            <span className="text-xs text-muted-foreground">{t.admin_cancellation_cutoff_hours_help}</span>
          </div>
        </>
      )}
    </div>
  )
}
