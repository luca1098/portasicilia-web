export type ShopCategory = {
  id: string
  titleKey: string
  descriptionKey: string
  ctaKey: string
  image: string
  bgColor: string
  buttonColor: string
}

export const mockShopCategories: ShopCategory[] = [
  {
    id: 'oro-verde',
    titleKey: 'shop_cat_oro_verde_title',
    descriptionKey: 'shop_cat_oro_verde_description',
    ctaKey: 'shop_cat_oro_verde_cta',
    image: '/images/shop/oro-verde.png',
    bgColor: 'bg-[#d4dcc4]',
    buttonColor: 'bg-[#6b7c4c] hover:bg-[#5a6940]',
  },
  {
    id: 'kit-cannolo',
    titleKey: 'shop_cat_kit_cannolo_title',
    descriptionKey: 'shop_cat_kit_cannolo_description',
    ctaKey: 'shop_cat_kit_cannolo_cta',
    image: '/images/shop/kit-cannolo.png',
    bgColor: 'bg-[#e8ddd0]',
    buttonColor: 'bg-[#9a8576] hover:bg-[#857265]',
  },
  {
    id: 'mistery-box',
    titleKey: 'shop_cat_mistery_box_title',
    descriptionKey: 'shop_cat_mistery_box_description',
    ctaKey: 'shop_cat_mistery_box_cta',
    image: '/images/shop/mistery-box.png',
    bgColor: 'bg-[#f5e1dc]',
    buttonColor: 'bg-[#b89a5a] hover:bg-[#a68a4a]',
  },
]
