'use client'

import { useTranslation } from '@/lib/context/translation.context'
import { deleteProductImageAction } from '@/lib/actions/product-images.actions'
import ConfirmDeleteDialog from '@/components/dashboard/confirm-delete-dialog'

type ProductImageDeleteDialogProps = {
  productId: string
  imageId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export default function ProductImageDeleteDialog({
  productId,
  imageId,
  open,
  onOpenChange,
  onSuccess,
}: ProductImageDeleteDialogProps) {
  const t = useTranslation()

  return (
    <ConfirmDeleteDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t.admin_image_delete_title}
      description={t.admin_image_delete_description}
      successMessage={t.admin_image_delete_success}
      onDelete={() => deleteProductImageAction(productId, imageId)}
      onSuccess={onSuccess}
    />
  )
}
