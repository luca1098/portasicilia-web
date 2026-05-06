'use client'

import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { InputWrapper } from '@/components/form/input-wrapper'
import { useTranslation } from '@/lib/context/translation.context'
import { interpolate } from '@/lib/utils/i18n.utils'
import { PlusIcon, Trash2Icon } from '@/lib/constants/icons'
import { formatDate, formatTime } from '@/lib/utils/format.utils'
import { today } from '@/lib/utils/date.utils'
import type { Proposal } from '@/lib/hooks/use-counter-proposals'

type TimeSlot = { id: string; startTime: string; endTime: string }

type ProposalCardsLabels = {
  proposalLabel: string
  removeLabel: string
  dateLabel: string
  timeslotLabel: string
  addDateLabel: string
}

type ProposalCardsProps = {
  proposals: Proposal[]
  timeSlots: TimeSlot[]
  labels: ProposalCardsLabels
  onUpdate: (index: number, updates: Partial<Proposal>) => void
  onRemove: (index: number) => void
  onAdd: () => void
  maxProposals?: number
}

export default function ProposalCards({
  proposals,
  timeSlots,
  labels,
  onUpdate,
  onRemove,
  onAdd,
  maxProposals = 3,
}: ProposalCardsProps) {
  const t = useTranslation() as Record<string, string>

  return (
    <>
      {proposals.map((proposal, index) => (
        <div key={index} className="space-y-3 rounded-xl border border-border p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {interpolate(labels.proposalLabel, { number: index + 1 })}
            </span>
            {proposals.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(index)}
                className="h-7 gap-1 px-2 text-xs text-muted-foreground"
              >
                <Trash2Icon className="size-3" />
                {labels.removeLabel}
              </Button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <InputWrapper label={labels.dateLabel} hasValue={!!proposal.date}>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="border-input flex h-14 w-full items-center rounded-xl border bg-transparent px-3 pt-5 pb-1 text-left text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                  >
                    {proposal.date ? formatDate(proposal.date.toISOString()) : ''}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={proposal.date}
                    onSelect={date => onUpdate(index, { date })}
                    disabled={date => date < today()}
                  />
                  <p className="px-4 pb-3 text-center text-xs text-muted-foreground">{t.checkout_timezone}</p>
                </PopoverContent>
              </Popover>
            </InputWrapper>
            {timeSlots.length > 0 && (
              <InputWrapper label={labels.timeslotLabel} hasValue={!!proposal.timeSlotId}>
                <Select
                  value={proposal.timeSlotId}
                  onValueChange={value => onUpdate(index, { timeSlotId: value })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map(slot => (
                      <SelectItem key={slot.id} value={slot.id}>
                        {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </InputWrapper>
            )}
          </div>
        </div>
      ))}

      {proposals.length < maxProposals && (
        <Button variant="outline" size="sm" onClick={onAdd} className="w-full gap-1">
          <PlusIcon className="size-4" />
          {labels.addDateLabel}
        </Button>
      )}
    </>
  )
}
