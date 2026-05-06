'use client'

import { useRouter } from 'next/navigation'
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
import { deleteSocialVideoAction } from '@/lib/actions/social-videos.actions'
import { useAction } from '@/lib/hooks/use-action'
import { LoaderIcon } from '@/lib/constants/icons'

type SocialVideoDeleteDialogProps = {
  videoId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function SocialVideoDeleteDialog({
  videoId,
  open,
  onOpenChange,
}: SocialVideoDeleteDialogProps) {
  const router = useRouter()
  const t = useTranslation()

  const { loading, execute } = useAction({
    successMessage: t.admin_social_videos_deleted,
    onSuccess: () => {
      onOpenChange(false)
      router.refresh()
    },
  })

  const handleDelete = () => execute(() => deleteSocialVideoAction(videoId))

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t.admin_social_videos_delete_title}</AlertDialogTitle>
          <AlertDialogDescription>{t.admin_social_videos_delete_description}</AlertDialogDescription>
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
