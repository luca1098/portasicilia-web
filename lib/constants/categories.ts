export type Category = {
  id: string
  nameKey: string
  image: string
}

export const mockCategories: Category[] = [
  {
    id: 'fuga-romantica',
    nameKey: 'category_fuga_romantica',
    image: '/images/categories/fuga-romantica.png',
  },
  {
    id: 'profumo-di-mare',
    nameKey: 'category_profumo_di_mare',
    image: '/images/categories/profumo-di-mare.png',
  },
  {
    id: 'madonie-segrete',
    nameKey: 'category_madonie_segrete',
    image: '/images/categories/madonie-segrete.png',
  },
  {
    id: 'terra-lavica',
    nameKey: 'category_terra_lavica',
    image: '/images/categories/terra-lavica.png',
  },
  {
    id: 'immerso-nella-natura',
    nameKey: 'category_immerso_nella_natura',
    image: '/images/categories/immerso-nella-natura.png',
  },
  {
    id: 'nel-cuore-della-citta',
    nameKey: 'category_nel_cuore_della_citta',
    image: '/images/categories/nel-cuore-della-citta.png',
  },
]
