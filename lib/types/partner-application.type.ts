export type PartnerListingInterest = 'EXPERIENCE' | 'STAY'
export type PartnerReferralSource = 'GOOGLE' | 'SOCIAL' | 'WORD_OF_MOUTH' | 'OTHER'
export type PartnerApplicationStatus = 'PENDING' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED'

export type PartnerApplicationInput = {
  listingInterests: PartnerListingInterest[]
  businessName: string
  vatNumber?: string
  website?: string
  instagramUrl?: string
  facebookUrl?: string
  tiktokUrl?: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role?: string
  locality: string
  description: string
  pitch: string
  referralSource?: PartnerReferralSource
  gdprConsent: true
  applicantLang: 'IT' | 'EN'
}

export type PartnerApplicationSummary = {
  id: string
  businessName: string
  email: string
  locality: string
  listingInterests: PartnerListingInterest[]
  status: PartnerApplicationStatus
  createdAt: string
}

export type PartnerApplicationDetail = PartnerApplicationSummary & {
  vatNumber: string | null
  website: string | null
  instagramUrl: string | null
  facebookUrl: string | null
  tiktokUrl: string | null
  firstName: string
  lastName: string
  phone: string
  role: string | null
  description: string
  pitch: string
  referralSource: PartnerReferralSource | null
  gdprConsent: boolean
  applicantLang: 'IT' | 'EN'
  adminNotes: string | null
  rejectionReason: string | null
  reviewedAt: string | null
  createdOwnerId: string | null
  createdOwner: {
    id: string
    email: string
    firstName: string | null
    lastName: string | null
    role: string
  } | null
}

export type PartnerApplicationListResponse = {
  data: PartnerApplicationSummary[]
  total: number
  page: number
  pageSize: number
}

export type SubmitPartnerApplicationResponse = {
  id: string
  status: PartnerApplicationStatus
  createdAt: string
}
