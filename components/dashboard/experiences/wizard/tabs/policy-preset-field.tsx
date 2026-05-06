'use client'

import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils/shadcn.utils'
import type { ExperienceTabValues } from '@/lib/schemas/forms/experience-tab.form.schema'

type PresetOption = {
  value: string
  label: string
  hasPercentage?: boolean
}

type PolicyPresetFieldProps = {
  name: 'policy' | 'cancellationTerms'
  label: string
  presets: PresetOption[]
  customLabel: string
  customPlaceholder?: string
  percentageLabel?: string
}

function resolveSelection(
  currentValue: string,
  presets: PresetOption[]
): { selectedPreset: string; customText: string; percentage: string } {
  const trimmed = currentValue.trim()

  if (!trimmed) {
    return { selectedPreset: '', customText: '', percentage: '' }
  }

  for (const preset of presets) {
    if (preset.hasPercentage) {
      const pattern = escapeRegex(preset.value).replace('\\{\\{percentage\\}\\}', '(\\d+)')
      const match = trimmed.match(new RegExp(`^${pattern}$`))
      if (match) {
        return { selectedPreset: preset.value, customText: '', percentage: match[1] }
      }
    } else if (trimmed === preset.value) {
      return { selectedPreset: preset.value, customText: '', percentage: '' }
    }
  }

  return { selectedPreset: 'CUSTOM', customText: trimmed, percentage: '' }
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function buildValue(preset: string, percentage: string): string {
  return preset.replace('{{percentage}}', percentage)
}

export default function PolicyPresetField({
  name,
  label,
  presets,
  customLabel,
  customPlaceholder,
  percentageLabel,
}: PolicyPresetFieldProps) {
  const { setValue, getValues } = useFormContext<ExperienceTabValues>()

  const [initial] = useState(() => resolveSelection(getValues(name) as string, presets))
  const [selectedPreset, setSelectedPreset] = useState(initial.selectedPreset)
  const [customText, setCustomText] = useState(initial.customText)
  const [percentage, setPercentage] = useState(initial.percentage)

  const activePreset = presets.find(p => p.value === selectedPreset)
  const isCustom = selectedPreset === 'CUSTOM'

  const handleSelectPreset = (presetValue: string) => {
    setSelectedPreset(presetValue)

    if (presetValue === 'CUSTOM') {
      setValue(name, customText, { shouldValidate: true })
      return
    }

    const preset = presets.find(p => p.value === presetValue)
    if (preset?.hasPercentage) {
      const val = percentage ? buildValue(presetValue, percentage) : ''
      setValue(name, val, { shouldValidate: true })
    } else {
      setValue(name, presetValue, { shouldValidate: true })
    }
  }

  const handlePercentageChange = (val: string) => {
    const sanitized = val.replace(/\D/g, '')
    const clamped = sanitized ? String(Math.min(Number(sanitized), 100)) : ''
    setPercentage(clamped)
    if (selectedPreset && selectedPreset !== 'CUSTOM') {
      const finalVal = clamped ? buildValue(selectedPreset, clamped) : ''
      setValue(name, finalVal, { shouldValidate: true })
    }
  }

  const handleCustomTextChange = (val: string) => {
    setCustomText(val)
    setValue(name, val, { shouldValidate: true })
  }

  return (
    <div className="grid gap-2">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label={label}>
        {presets.map(preset => {
          const isSelected = selectedPreset === preset.value
          return (
            <label
              key={preset.value}
              className={cn(
                'relative cursor-pointer select-none rounded-md border px-2.5 py-1 text-xs font-medium transition-colors',
                isSelected
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-input bg-transparent text-muted-foreground hover:border-muted-foreground/50'
              )}
            >
              <input
                type="radio"
                name={`${name}-preset`}
                value={preset.value}
                checked={isSelected}
                onChange={() => handleSelectPreset(preset.value)}
                className="sr-only"
              />
              {preset.label}
            </label>
          )
        })}
        <label
          className={cn(
            'relative cursor-pointer select-none rounded-md border px-2.5 py-1 text-xs font-medium transition-colors',
            isCustom
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-input bg-transparent text-muted-foreground hover:border-muted-foreground/50'
          )}
        >
          <input
            type="radio"
            name={`${name}-preset`}
            value="CUSTOM"
            checked={isCustom}
            onChange={() => handleSelectPreset('CUSTOM')}
            className="sr-only"
          />
          {customLabel}
        </label>
      </div>

      {activePreset?.hasPercentage && (
        <div className="flex items-center gap-2">
          {percentageLabel && (
            <label className="text-xs text-muted-foreground shrink-0">{percentageLabel}</label>
          )}
          <Input
            type="number"
            min={1}
            max={100}
            value={percentage}
            onChange={e => handlePercentageChange(e.target.value)}
            className="h-10 w-24 pt-2 text-sm"
            placeholder="%"
          />
        </div>
      )}

      {isCustom && (
        <Textarea
          value={customText}
          onChange={e => handleCustomTextChange(e.target.value)}
          rows={3}
          className="pt-2"
          placeholder={customPlaceholder}
        />
      )}
    </div>
  )
}
