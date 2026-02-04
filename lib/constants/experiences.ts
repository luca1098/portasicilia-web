export type ExperienceCategory = 'conferma_immediata' | 'specialita_culinaria' | 'adrenalina_pura'

export type Experience = {
  id: string
  title: string
  image: string
  category: ExperienceCategory
  duration: string
  rating: number
  price: number
}

export const mockExperiences: Experience[] = [
  {
    id: 'tour-cavallo-torre-salsa',
    title: 'Tour a cavallo nella riserva naturale di Torre Salsa con degustazione',
    image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=600&h=600&fit=crop',
    category: 'conferma_immediata',
    duration: '1 ora',
    rating: 4.9,
    price: 65,
  },
  {
    id: 'visita-fattoria-formaggio',
    title: 'Visita guidata alla fattoria e laboratorio del formaggio + degustazione',
    image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=600&h=600&fit=crop',
    category: 'specialita_culinaria',
    duration: '3 ore',
    rating: 4.9,
    price: 60,
  },
  {
    id: 'escursione-terme-segesta',
    title: 'Escursione alle Terme e Tempio di Segesta',
    image: 'https://images.unsplash.com/photo-1523592121529-f6dde35f079e?w=600&h=600&fit=crop',
    category: 'specialita_culinaria',
    duration: '4 ore',
    rating: 4.8,
    price: 270,
  },
  {
    id: 'tour-quad-palermo',
    title: 'Tour in quad a Palermo',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&h=600&fit=crop',
    category: 'adrenalina_pura',
    duration: '2 ore',
    rating: 4.7,
    price: 209.99,
  },
  {
    id: 'menu-casareccio-agriturismo',
    title: 'Menu casareccio in agriturismo con animali a Caltagirone',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=600&fit=crop',
    category: 'specialita_culinaria',
    duration: '1 giorno',
    rating: 4.9,
    price: 35,
  },
  {
    id: 'tour-500-palermo',
    title: 'Tour in 500 in centro storico a Palermo',
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&h=600&fit=crop',
    category: 'conferma_immediata',
    duration: '3 ore',
    rating: 4.9,
    price: 400,
  },
]
