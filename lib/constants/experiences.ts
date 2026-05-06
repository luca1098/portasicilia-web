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

export type ItineraryStep = {
  title: string
  description: string
  image: string
}

export type ExperienceDetail = Experience & {
  description: string
  location: string
  images: string[]
  itinerary: ItineraryStep[]
  languages: string[]
  features: string[]
  hostName: string
  hostAvatar: string
  badWeatherInfo: string
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

export const mockExperienceDetails: ExperienceDetail[] = [
  {
    id: 'tour-cavallo-torre-salsa',
    title: 'Tour a cavallo nella riserva naturale di Torre Salsa con degustazione',
    image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=600&h=600&fit=crop',
    category: 'conferma_immediata',
    duration: '1 ora',
    rating: 4.9,
    price: 65,
    location: 'Siculiana, Agrigento',
    description:
      "Un'esperienza unica che ti porterà a cavallo attraverso la riserva naturale di Torre Salsa, un angolo incontaminato della costa siciliana. Cavalcherai lungo sentieri immersi nella macchia mediterranea, con viste mozzafiato sulle scogliere e sul mare cristallino. Al termine della passeggiata, ti attende una degustazione di prodotti tipici locali: formaggi artigianali, olive, pane cunzato e un calice di vino siciliano. Un'esperienza perfetta per chi ama la natura e vuole vivere la Sicilia autentica.",
    images: [
      'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&h=600&fit=crop',
    ],
    itinerary: [
      {
        title: 'Arrivo e preparazione',
        description:
          'Incontro presso il maneggio, presentazione dei cavalli e breve lezione introduttiva per cavalieri di ogni livello.',
        image: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=400&h=400&fit=crop',
      },
      {
        title: 'Passeggiata nella riserva',
        description:
          'Cavalcata lungo i sentieri della riserva naturale di Torre Salsa, tra macchia mediterranea e panorami sulla costa.',
        image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop',
      },
      {
        title: 'Degustazione finale',
        description:
          "Sosta presso l'area picnic con degustazione di formaggi locali, olive, pane cunzato e vino siciliano.",
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=400&fit=crop',
      },
    ],
    languages: ['Italiano', 'English'],
    features: [
      'exp_detail_feature_small_group',
      'exp_detail_feature_all_levels',
      'exp_detail_feature_equipment_included',
      'exp_detail_feature_tasting_included',
    ],
    hostName: 'Giuseppe',
    hostAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    badWeatherInfo: 'exp_detail_bad_weather_info',
  },
]

export function getExperienceDetailById(id: string): ExperienceDetail | undefined {
  return mockExperienceDetails.find(exp => exp.id === id)
}
