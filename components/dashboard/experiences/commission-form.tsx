'use client'

import { FormProvider, useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { SelectFormField } from '@/components/form/select-form-field'
import { CurrencyFormField } from '@/components/form/currency-form-field'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/context/translation.context'
import { updateExperienceAction } from '@/lib/actions/experiences.actions'
import { toFormData } from '@/lib/utils/form-data.utils'
import { useAction } from '@/lib/hooks/use-action'
import { LoaderIcon } from '@/lib/constants/icons'
import type { Experience } from '@/lib/schemas/entities/experience.entity.schema'

const CommissionFormSchema = z.object({
  commissionType: z.enum(['PERCENTAGE', 'FLAT']).optional(),
  commissionValue: z.number().min(0).nullable().optional(),
})

type CommissionFormValues = z.infer<typeof CommissionFormSchema>

const COMMISSION_TYPES = ['PERCENTAGE', 'FLAT'] as const

type CommissionFormProps = {
  experience: Experience
}

export default function CommissionForm({ experience }: CommissionFormProps) {
  const t = useTranslation() as Record<string, string>

  const { loading, execute } = useAction<Experience>({
    successMessage: t.admin_exp_update_success,
  })

  const form = useForm<CommissionFormValues>({
    resolver: zodResolver(CommissionFormSchema),
    defaultValues: {
      commissionType: experience.commissionType ?? undefined,
      commissionValue: experience.commissionValue ?? null,
    },
  })

  const commissionType = useWatch({ control: form.control, name: 'commissionType' })

  const onSubmit = async (data: CommissionFormValues) => {
    const processed: Record<string, unknown> = { ...data }

    if (!processed.commissionType) {
      delete processed.commissionType
      delete processed.commissionValue
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
