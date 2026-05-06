'use client'

import { useTranslation } from '@/lib/context/translation.context'
import { interpolate } from '@/lib/utils/i18n.utils'
import { deleteProductAction } from '@/lib/actions/products.actions'
import ConfirmDeleteDialog from '@/components/dashboard/confirm-delete-dialog'

type ProductDeleteDialogProps = {
  productId: string
  productName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ProductDeleteDialog({
  productId,
  productName,
  open,
  onOpenChange,
}: ProductDeleteDialogProps) {
  const t = useTranslation()

  return (
    <ConfirmDeleteDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t.admin_product_delete_title}
      description={interpolate(t.admin_product_delete_description, { name: productName })}
      successMessage={t.admin_product_delete_success}
      onDelete={() => deleteProductAction(productId)}
    />
  )
}
