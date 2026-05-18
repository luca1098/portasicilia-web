'use client'

import { useTranslation } from '@/lib/context/translation.context'

type Props = { current: 1 | 2 | 3 }

export default function ApplicationWizardStepper({ current }: Props) {
  const t = useTranslation()
  const steps = [t.partner_form_step_1, t.partner_form_step_2, t.partner_form_step_3]
  return (
    <ol className="mb-8 flex gap-2 text-xs">
      {steps.map((label, i) => {
        const n = (i + 1) as 1 | 2 | 3
        const done = n < current
        const active = n === current
        return (
          <li
            key={label}
            className={
              'flex-1 rounded px-3 py-2 text-center ' +
              (active
                ? 'bg-[#1a4d3a] text-white'
                : done
                  ? 'bg-[#1a4d3a]/80 text-white'
                  : 'bg-muted text-muted-foreground')
            }
          >
            <span className="font-bold">{done ? '✓' : n}</span> · {label}
          </li>
        )
      })}
    </ol>
  )
}
