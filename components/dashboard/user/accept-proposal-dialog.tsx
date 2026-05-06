'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/context/translation.context'
import { useAction } from '@/lib/hooks/use-action'
import { acceptCounterAction } from '@/lib/actions/user-bookings.actions'
import { CalendarIcon, ClockIcon, CheckIcon, LoaderIcon } from '@/lib/constants/icons'
import { formatDate, formatTime } from '@/lib/utils/format.utils'
import { cn } from '@/lib/utils/shadcn.utils'
import type { UserBooking, UserBookingCounterProposal } from '@/lib/api/user-bookings'

type AcceptProposalDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  bookingId: string
  proposals: UserBookingCounterProposal[]
  onSuccess: () => void
}

export default function AcceptProposalDialog({
  open,
  onOpenChange,
  bookingId,
  proposals,
  onSuccess,
}: AcceptProposalDialogProps) {
  const t = useTranslation()
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const { loading, execute } = useAction<UserBooking>({
    successMessage: t.user_accept_proposal_success,
    onSuccess: () => {
      onOpenChange(false)
      setSelectedIndex(null)
      onSuccess()
    },
  })

  function handleOpen(isOpen: boolean) {
    if (!isOpen) {
      setSelectedIndex(null)
    }
    onOpenChange(isOpen)
  }

  function handleAccept() {
    if (selectedIndex === null) return
    const proposal = proposals[selectedIndex]
    execute(() =>
      acceptCounterAction(bookingId, {
        date: proposal.date,
        timeSlotId: proposal.timeSlotId,
      })
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t.user_accept_proposal_title}</DialogTitle>
          <DialogDescription>{t.user_accept_proposal_desc}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          {proposals.map((proposal, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={cn(
                'flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-colors',
                selectedIndex === index
                  ? 'border-primary bg-primary/5 ring-1 ring-primary'
                  : 'border-border hover:border-border/80 hover:bg-accent/30'
              )}
            >
              <div className="flex flex-1 flex-col gap-1">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <CalendarIcon className="size-4 text-muted-foreground" />
                  {formatDate(proposal.date)}
                </div>
                {proposal.timeSlot && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ClockIcon className="size-4" />
                    {formatTime(proposal.timeSlot.startTime)} - {formatTime(proposal.timeSlot.endTime)}
                  </div>
                )}
              </div>
              {selectedIndex === index && <CheckIcon className="size-5 text-primary" />}
            </button>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpen(false)}>
            {t.admin_common_cancel}
          </Button>
          <Button onClick={handleAccept} disabled={loading || selectedIndex === null}>
            {loading && <LoaderIcon className="size-4 animate-spin" />}
            {t.user_accept_proposal_confirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
