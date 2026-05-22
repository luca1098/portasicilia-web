'use client'

import { useEffect } from 'react'

type UCService = {
  id: string
  name: string
  consent?: { status: boolean }
  categorySlug?: string
  category?: string
}

type GtagConsentParams = Record<string, 'granted' | 'denied'>

declare global {
  interface Window {
    UC_UI?: {
      getServicesBaseInfo?: () => UCService[]
    }
    gtag?: (...args: unknown[]) => void
  }
}

// Maps Usercentrics category slugs to Google Consent Mode v2 keys.
// Keeps multiple aliases so we don't depend on the exact slug the UC dashboard uses.
const SLUG_TO_GCM: Record<string, string[]> = {
  marketing: ['ad_storage', 'ad_user_data', 'ad_personalization'],
  advertising: ['ad_storage', 'ad_user_data', 'ad_personalization'],
  statistics: ['analytics_storage'],
  analytics: ['analytics_storage'],
  functional: ['functionality_storage', 'personalization_storage'],
  preferences: ['functionality_storage', 'personalization_storage'],
}

function buildConsentUpdate(services: UCService[]): GtagConsentParams {
  const update: GtagConsentParams = {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'denied',
    personalization_storage: 'denied',
    security_storage: 'granted',
  }
  for (const service of services) {
    const slug = (service.categorySlug || service.category || '').toLowerCase()
    const keys = SLUG_TO_GCM[slug]
    if (keys && service.consent?.status) {
      for (const k of keys) update[k] = 'granted'
    }
  }
  return update
}

function syncConsent() {
  if (typeof window === 'undefined') return
  const gtag = window.gtag
  const getInfo = window.UC_UI?.getServicesBaseInfo
  if (!gtag || !getInfo) return
  try {
    const services = getInfo()
    if (!Array.isArray(services) || services.length === 0) return
    gtag('consent', 'update', buildConsentUpdate(services))
  } catch {
    // UC not ready or unexpected shape; no-op
  }
}

export default function UcConsentBridge() {
  useEffect(() => {
    const handler = () => syncConsent()
    window.addEventListener('UC_UI_INITIALIZED', handler)
    window.addEventListener('UC_UI_CMP_EVENT', handler)
    syncConsent()
    return () => {
      window.removeEventListener('UC_UI_INITIALIZED', handler)
      window.removeEventListener('UC_UI_CMP_EVENT', handler)
    }
  }, [])
  return null
}
