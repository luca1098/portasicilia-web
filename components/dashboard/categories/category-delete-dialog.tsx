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
import { deleteCategoryAction } from '@/lib/actions/categories.actions'
import { useAction } from '@/lib/hooks/use-action'
import { LoaderIcon } from '@/lib/constants/icons'

type CategoryDeleteDialogProps = {
  categoryId: string
  categoryName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CategoryDeleteDialog({
  categoryId,
  categoryName,
  open,
  onOpenChange,
}: CategoryDeleteDialogProps) {
  const t = useTranslation()

  const { loading, execute } = useAction({
    successMessage: t.admin_cat_delete_success,
    onSuccess: () => onOpenChange(false),
  })

  const handleDelete = () => execute(() => deleteCategoryAction(categoryId))

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t.admin_cat_delete_title}</AlertDialogTitle>
          <AlertDialogDescription>
            {interpolate(t.admin_cat_delete_description, { name: categoryName })}
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
