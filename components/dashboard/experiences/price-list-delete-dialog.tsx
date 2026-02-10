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
import { deletePriceListAction } from '@/lib/actions/pricing.actions'
import { useAction } from '@/lib/hooks/use-action'
import { LoaderIcon } from '@/lib/constants/icons'

type PriceListDeleteDialogProps = {
  priceListId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function PriceListDeleteDialog({
  priceListId,
  open,
  onOpenChange,
}: PriceListDeleteDialogProps) {
  const t = useTranslation()

  const { loading, execute } = useAction({
    successMessage: t.admin_pricing_delete_success,
    onSuccess: () => onOpenChange(false),
  })

  const handleDelete = () => execute(() => deletePriceListAction(priceListId))

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t.admin_pricing_delete_title}</AlertDialogTitle>
          <AlertDialogDescription>{t.admin_pricing_delete_description}</AlertDialogDescription>
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
