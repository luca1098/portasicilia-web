'use client'

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/context/translation.context'
import { deleteTimeSlotAction } from '@/lib/actions/experience-time-slots.actions'
import { useAction } from '@/lib/hooks/use-action'
import { LoaderIcon } from '@/lib/constants/icons'

type TimeSlotDeleteDialogProps = {
  experienceId: string
  slotId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function TimeSlotDeleteDialog({
  experienceId,
  slotId,
  open,
  onOpenChange,
}: TimeSlotDeleteDialogProps) {
  const t = useTranslation()

  const { loading, execute } = useAction({
    successMessage: t.admin_timeslot_delete_success,
    onSuccess: () => onOpenChange(false),
  })

  const handleDelete = () => execute(() => deleteTimeSlotAction(experienceId, slotId))

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t.admin_timeslot_delete_title}</AlertDialogTitle>
          <AlertDialogDescription>{t.admin_timeslot_delete_description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            {t.admin_common_cancel}
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading && <LoaderIcon className="size-4 animate-spin" />}
            {t.admin_common_confirm}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
