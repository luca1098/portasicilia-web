import {
  Compass,
  WavesIcon,
  MountainIcon,
  UtensilsIcon,
  SunIcon,
  GrapeIcon,
  BikeIcon,
  CameraIcon,
  PaletteIcon,
  MusicIcon,
  SailboatIcon,
  FishIcon,
  LandmarkIcon,
  HeartIcon,
  TreesIcon,
  SparklesIcon,
  HomeIcon,
  BedDoubleIcon,
  BuildingIcon,
  CastleIcon,
  TentIcon,
  CoffeeIcon,
  AnchorIcon,
  FlameIcon,
  SunsetIcon,
  StarIcon,
} from '@/lib/constants/icons'

export type CategoryIconOption = {
  name: string
  icon: React.ElementType
}

export const categoryIcons: CategoryIconOption[] = [
  { name: 'compass', icon: Compass },
  { name: 'waves', icon: WavesIcon },
  { name: 'mountain', icon: MountainIcon },
  { name: 'sun', icon: SunIcon },
  { name: 'sunset', icon: SunsetIcon },
  { name: 'sailboat', icon: SailboatIcon },
  { name: 'anchor', icon: AnchorIcon },
  { name: 'fish', icon: FishIcon },
  { name: 'trees', icon: TreesIcon },
  { name: 'grape', icon: GrapeIcon },
  { name: 'utensils', icon: UtensilsIcon },
  { name: 'coffee', icon: CoffeeIcon },
  { name: 'flame', icon: FlameIcon },
  { name: 'palette', icon: PaletteIcon },
  { name: 'music', icon: MusicIcon },
  { name: 'camera', icon: CameraIcon },
  { name: 'bike', icon: BikeIcon },
  { name: 'landmark', icon: LandmarkIcon },
  { name: 'sparkles', icon: SparklesIcon },
  { name: 'heart', icon: HeartIcon },
  { name: 'star', icon: StarIcon },
  { name: 'home', icon: HomeIcon },
  { name: 'bed-double', icon: BedDoubleIcon },
  { name: 'building', icon: BuildingIcon },
  { name: 'castle', icon: CastleIcon },
  { name: 'tent', icon: TentIcon },
]

export const categoryIconMap = Object.fromEntries(categoryIcons.map(i => [i.name, i.icon])) as Record<
  string,
  React.ElementType
>
