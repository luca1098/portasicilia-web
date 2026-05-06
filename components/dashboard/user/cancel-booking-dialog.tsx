'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useTranslation } from '@/lib/context/translation.context'
import { useAction } from '@/lib/hooks/use-action'
import { cancelBookingAction } from '@/lib/actions/user-bookings.actions'
import { LoaderIcon } from '@/lib/constants/icons'
import type { UserBooking } from '@/lib/api/user-bookings'

type CancelBookingDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  bookingId: string
  onSuccess: () => void
}

export default function CancelBookingDialog({
  open,
  onOpenChange,
  bookingId,
  onSuccess,
}: CancelBookingDialogProps) {
  const t = useTranslation()

  const { loading, execute } = useAction<UserBooking>({
    successMessage: t.user_cancel_success,
    onSuccess: () => {
      onOpenChange(false)
      onSuccess()
    },
  })

  function handleCancel() {
    execute(() => cancelBookingAction(bookingId))
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t.user_cancel_title}</AlertDialogTitle>
          <AlertDialogDescription>{t.user_cancel_desc}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t.admin_common_cancel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleCancel}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading && <LoaderIcon className="size-4 animate-spin" />}
            {t.user_cancel_confirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
