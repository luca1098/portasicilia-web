export type MenuArea = 'public' | 'admin' | 'owner'

export type MenuItem = {
  key: string
  href: string
  area: MenuArea
}

export const menuItems: MenuItem[] = [
  { key: 'location', href: '/location', area: 'public' },
  { key: 'experiences', href: '/experiences', area: 'public' },
  { key: 'stays', href: '/stays', area: 'public' },
  { key: 'shop', href: '/shop', area: 'public' },
]

export function getMenuItemsByArea(area: MenuArea): MenuItem[] {
  return menuItems.filter(item => item.area === area)
}
