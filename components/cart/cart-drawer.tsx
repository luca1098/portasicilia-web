'use client'

import { ShoppingCartIcon, X } from '@/lib/constants/icons'
import { Button } from '@/components/ui/button'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from '@/components/ui/drawer'
import { useTranslation } from '@/lib/context/translation.context'
import useCartStore, { useCartActions } from '@/core/store/cart.store'
import { cn } from '@/lib/utils/shadcn.utils'
import CartContent from './cart-content'

interface CartDrawerProps {
  className?: string
}

export default function CartDrawer({ className }: CartDrawerProps) {
  const t = useTranslation()
  const isOpen = useCartStore(state => state.isOpen)
  const count = useCartStore(state => state.items.reduce((sum, i) => sum + i.quantity, 0))
  const { setOpen, open } = useCartActions()

  return (
    <Drawer direction="right" open={isOpen} onOpenChange={setOpen}>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={t.cart_title}
        onClick={open}
        className={cn('relative pointer', className)}
      >
        <ShoppingCartIcon />
        {count > 0 && (
          <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
            {count}
          </span>
        )}
      </Button>

      <DrawerContent className="flex flex-col data-[vaul-drawer-direction=right]:sm:max-w-md">
        <DrawerHeader className="flex flex-row items-center justify-between px-6 py-5">
          <DrawerTitle className="text-xl font-bold">{t.cart_title}</DrawerTitle>
          <DrawerClose asChild>
            <Button type="button" variant="ghost" size="icon" aria-label="Close">
              <X className="size-5" />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <CartContent />
      </DrawerContent>
    </Drawer>
  )
}
