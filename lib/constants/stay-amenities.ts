import {
  WifiIcon,
  UtensilsIcon,
  CarIcon,
  PawPrintIcon,
  TvIcon,
  ThermometerSnowflakeIcon,
  WashingMachineIcon,
  FlameIcon,
  WindIcon,
  WavesIcon,
  MountainIcon,
  AccessibilityIcon,
  LaptopIcon,
  CookingPotIcon,
  ShieldIcon,
  CoffeeIcon,
  DoorOpenIcon,
  TreesIcon,
  ArrowUpIcon,
  ShirtIcon,
  SparklesIcon,
} from '@/lib/constants/icons'
import type { LucideIcon } from 'lucide-react'

export type StayAmenityConfig = {
  value: string
  labelKey: string
  icon: LucideIcon
}

export const STAY_AMENITIES: StayAmenityConfig[] = [
  { value: 'WIFI', labelKey: 'amenity_wifi', icon: WifiIcon },
  { value: 'KITCHEN', labelKey: 'amenity_kitchen', icon: UtensilsIcon },
  { value: 'PARKING', labelKey: 'amenity_parking', icon: CarIcon },
  { value: 'PETS_ALLOWED', labelKey: 'amenity_pets_allowed', icon: PawPrintIcon },
  { value: 'TV', labelKey: 'amenity_tv', icon: TvIcon },
  { value: 'AIR_CONDITIONING', labelKey: 'amenity_air_conditioning', icon: ThermometerSnowflakeIcon },
  { value: 'WASHING_MACHINE', labelKey: 'amenity_washing_machine', icon: WashingMachineIcon },
  { value: 'DISHWASHER', labelKey: 'amenity_dishwasher', icon: CookingPotIcon },
  { value: 'HEATING', labelKey: 'amenity_heating', icon: FlameIcon },
  { value: 'IRON', labelKey: 'amenity_iron', icon: ShirtIcon },
  { value: 'HAIR_DRYER', labelKey: 'amenity_hair_dryer', icon: WindIcon },
  { value: 'POOL', labelKey: 'amenity_pool', icon: WavesIcon },
  { value: 'BALCONY', labelKey: 'amenity_balcony', icon: DoorOpenIcon },
  { value: 'GARDEN', labelKey: 'amenity_garden', icon: TreesIcon },
  { value: 'SEA_VIEW', labelKey: 'amenity_sea_view', icon: MountainIcon },
  { value: 'ELEVATOR', labelKey: 'amenity_elevator', icon: ArrowUpIcon },
  { value: 'WHEELCHAIR_ACCESSIBLE', labelKey: 'amenity_wheelchair_accessible', icon: AccessibilityIcon },
  { value: 'WORKSPACE', labelKey: 'amenity_workspace', icon: LaptopIcon },
  { value: 'BBQ', labelKey: 'amenity_bbq', icon: FlameIcon },
  { value: 'FIREPLACE', labelKey: 'amenity_fireplace', icon: SparklesIcon },
  { value: 'SAFE', labelKey: 'amenity_safe', icon: ShieldIcon },
  { value: 'COFFEE_MACHINE', labelKey: 'amenity_coffee_machine', icon: CoffeeIcon },
] as const
