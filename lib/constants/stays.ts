export type StayCategory = 'conferma_immediata' | 'specialita_culinaria' | 'adrenalina_pura'

export type Stay = {
  id: string
  title: string
  image: string
  category?: StayCategory
  rating: number
  price: number
}

export const mockStays: Stay[] = [
  {
    id: 'palemento-pietra-lavica-linguarossa',
    title: 'Palemento in pietra lavica nel bosco a Linguarossa (Etna)',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=600&fit=crop',
    category: 'conferma_immediata',
    rating: 4.9,
    price: 235,
  },
  {
    id: 'dimora-medievale-cantina-etna',
    title: "Dimora medievale in pietra Ex Cantina sull'Etna",
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=600&fit=crop',
    category: 'specialita_culinaria',
    rating: 4.9,
    price: 65,
  },
  {
    id: 'chalet-bosco-nicolosi',
    title: 'Chalet nel Bosco a Nicolosi (Etna sud)',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=600&fit=crop',
    rating: 4.9,
    price: 150,
  },
  {
    id: 'dimora-vulcano-bronte',
    title: 'Dimora del Vulcano a Bronte',
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&h=600&fit=crop',
    category: 'adrenalina_pura',
    rating: 4.9,
    price: 199,
  },
  {
    id: 'dimora-cielo-monti-sicani',
    title: 'Dimora nel cielo sui Monti Sicani a Camarata',
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&h=600&fit=crop',
    rating: 4.9,
    price: 80,
  },
  {
    id: 'cupola-bianca-scopello',
    title: 'Cupola bianca a Scopello',
    image: 'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=600&h=600&fit=crop',
    category: 'conferma_immediata',
    rating: 4.9,
    price: 150,
  },
]
