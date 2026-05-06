import type { LucideIcon } from 'lucide-react'
import {
  HelpCircleIcon,
  Compass,
  HomeIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  HandshakeIcon,
} from '@/lib/constants/icons'

export type FaqCategoryKey =
  | 'how_it_works'
  | 'experiences'
  | 'accommodations'
  | 'payments'
  | 'cancellation'
  | 'partner'

export interface FaqCategory {
  key: FaqCategoryKey
  icon: LucideIcon
  titleKey: string
  questionCount: number
}

export const FAQ_CATEGORIES: FaqCategory[] = [
  { key: 'how_it_works', icon: HelpCircleIcon, titleKey: 'faq_category_how_it_works', questionCount: 5 },
  { key: 'experiences', icon: Compass, titleKey: 'faq_category_experiences', questionCount: 5 },
  { key: 'accommodations', icon: HomeIcon, titleKey: 'faq_category_accommodations', questionCount: 5 },
  { key: 'payments', icon: CreditCardIcon, titleKey: 'faq_category_payments', questionCount: 5 },
  { key: 'cancellation', icon: ShieldCheckIcon, titleKey: 'faq_category_cancellation', questionCount: 5 },
  { key: 'partner', icon: HandshakeIcon, titleKey: 'faq_category_partner', questionCount: 5 },
]
