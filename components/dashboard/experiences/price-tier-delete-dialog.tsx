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
import { deletePriceTierAction } from '@/lib/actions/pricing.actions'
import { useAction } from '@/lib/hooks/use-action'
import { LoaderIcon } from '@/lib/constants/icons'

type PriceTierDeleteDialogProps = {
  priceListId: string
  tierId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function PriceTierDeleteDialog({
  priceListId,
  tierId,
  open,
  onOpenChange,
}: PriceTierDeleteDialogProps) {
  const t = useTranslation()

  const { loading, execute } = useAction({
    successMessage: t.admin_tier_delete_success,
    onSuccess: () => onOpenChange(false),
  })

  const handleDelete = () => execute(() => deletePriceTierAction(priceListId, tierId))

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t.admin_tier_delete_title}</AlertDialogTitle>
          <AlertDialogDescription>{t.admin_tier_delete_description}</AlertDialogDescription>
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
