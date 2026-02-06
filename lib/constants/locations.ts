export type Location = {
  id: string
  name: string
  province: string
  image: string
  activitiesCount: number
}

export const mockLocations: Location[] = [
  {
    id: 'capo-dorlando',
    name: "Capo D'Orlando",
    province: 'ME',
    image: 'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=600&h=700&fit=crop',
    activitiesCount: 200,
  },
  {
    id: 'ortigia',
    name: 'Ortigia',
    province: 'SR',
    image: 'https://images.unsplash.com/photo-1678051547022-880d8b6fdc56??w=600&h=700&fit=crop',
    activitiesCount: 200,
  },

  {
    id: 'palermo',
    name: 'Palermo',
    province: 'PA',
    image: 'https://images.unsplash.com/photo-1555992828-ca4dbe41d294?w=600&h=700&fit=crop',
    activitiesCount: 200,
  },
  {
    id: 'catania',
    name: 'Catania',
    province: 'CT',
    image: 'https://images.unsplash.com/photo-1548484352-ea579e5233a8?w=600&h=700&fit=crop',
    activitiesCount: 200,
  },
]
