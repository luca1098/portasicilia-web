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
import { interpolate } from '@/lib/utils/i18n.utils'
import { deleteItineraryAction } from '@/lib/actions/experience-itinerary.actions'
import { useAction } from '@/lib/hooks/use-action'
import { LoaderIcon } from '@/lib/constants/icons'

type ItineraryDeleteDialogProps = {
  experienceId: string
  itemId: string
  itemTitle: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export default function ItineraryDeleteDialog({
  experienceId,
  itemId,
  itemTitle,
  open,
  onOpenChange,
  onSuccess,
}: ItineraryDeleteDialogProps) {
  const t = useTranslation()

  const { loading, execute } = useAction({
    successMessage: t.admin_itinerary_delete_success,
    onSuccess: () => {
      onOpenChange(false)
      onSuccess?.()
    },
  })

  const handleDelete = () => execute(() => deleteItineraryAction(experienceId, itemId))

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t.admin_itinerary_delete_title}</AlertDialogTitle>
          <AlertDialogDescription>
            {interpolate(t.admin_itinerary_delete_description, { name: itemTitle })}
          </AlertDialogDescription>
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
