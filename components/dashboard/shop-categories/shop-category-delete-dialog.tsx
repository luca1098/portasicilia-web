'use client'

import { useTranslation } from '@/lib/context/translation.context'
import { interpolate } from '@/lib/utils/i18n.utils'
import { deleteShopCategoryAction } from '@/lib/actions/shop-categories.actions'
import ConfirmDeleteDialog from '@/components/dashboard/confirm-delete-dialog'

type ShopCategoryDeleteDialogProps = {
  categoryId: string
  categoryName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ShopCategoryDeleteDialog({
  categoryId,
  categoryName,
  open,
  onOpenChange,
}: ShopCategoryDeleteDialogProps) {
  const t = useTranslation()

  return (
    <ConfirmDeleteDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t.admin_shop_cat_delete_title}
      description={interpolate(t.admin_shop_cat_delete_description, { name: categoryName })}
      successMessage={t.admin_shop_cat_delete_success}
      onDelete={() => deleteShopCategoryAction(categoryId)}
    />
  )
}
