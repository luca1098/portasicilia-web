'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { HeartIcon, X } from '@/lib/constants/icons'
import { Button } from '@/components/ui/button'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from '@/components/ui/drawer'
import { useTranslation } from '@/lib/context/translation.context'
import { useFavoriteActions } from '@/core/store/favorite.store'
import { useAction } from '@/lib/hooks/use-action'
import WishlistContent from './wishlist-content'

export default function WishlistDrawer() {
  const [open, setOpen] = useState(false)
  const { data: session } = useSession()
  const t = useTranslation()
  const { fetchAll } = useFavoriteActions()
  const { execute } = useAction()

  const handleOpen = (value: boolean) => {
    setOpen(value)
    if (value && session?.accessToken) {
      execute(() => fetchAll(session.accessToken).then(() => ({ success: true as const })))
    }
  }

  return (
    <Drawer direction="right" open={open} onOpenChange={handleOpen}>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={t.wishlist_title}
        onClick={() => handleOpen(true)}
      >
        <HeartIcon className="size-5" />
      </Button>

      <DrawerContent className="flex flex-col">
        <DrawerHeader className="flex flex-row items-center justify-between border-b px-4 py-3">
          <DrawerTitle>{t.wishlist_title}</DrawerTitle>
          <DrawerClose asChild>
            <Button type="button" variant="ghost" size="icon" aria-label="Close">
              <X className="size-5" />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <WishlistContent />
      </DrawerContent>
    </Drawer>
  )
}
