import { SITE_URL, SITE_NAME, ORGANIZATION, SOCIAL_LINKS } from './constants'
import type { Experience, Review } from '@/lib/schemas/entities/experience.entity.schema'
import type { Stay } from '@/lib/schemas/entities/stay.entity.schema'
import type { Locality } from '@/lib/schemas/entities/locality.entity.schema'
import type { Article } from '@/lib/schemas/entities/article.entity.schema'

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: ORGANIZATION.name,
    legalName: ORGANIZATION.legalName,
    url: ORGANIZATION.url,
    logo: ORGANIZATION.logo,
    address: {
      '@type': 'PostalAddress',
      streetAddress: ORGANIZATION.address.streetAddress,
      addressLocality: ORGANIZATION.address.addressLocality,
      addressRegion: ORGANIZATION.address.addressRegion,
      postalCode: ORGANIZATION.address.postalCode,
      addressCountry: ORGANIZATION.address.addressCountry,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: ORGANIZATION.phone,
      contactType: 'customer service',
      availableLanguage: ['Italian', 'English'],
    },
    sameAs: [SOCIAL_LINKS.facebook, SOCIAL_LINKS.instagram, SOCIAL_LINKS.tiktok],
    vatID: ORGANIZATION.vatID,
  }
}

export function websiteSchema(locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: `${SITE_URL}/${locale}`,
    inLanguage: locale === 'en' ? 'en' : 'it',
    publisher: {
      '@type': 'Organization',
      name: ORGANIZATION.name,
      url: ORGANIZATION.url,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/${locale}/experiences?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

function computeAggregateRating(reviews: Review[]) {
  if (!reviews.length) return undefined
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0)
  return {
    '@type': 'AggregateRating',
    ratingValue: (sum / reviews.length).toFixed(1),
    reviewCount: reviews.length,
    bestRating: 5,
    worstRating: 1,
  }
}

export function experienceSchema(experience: Experience, locale: string) {
  const reviews = experience.reviews || []
  const aggregateRating = computeAggregateRating(reviews)
  const firstTier = experience.priceLists?.[0]?.tiers?.[0]

  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: experience.name,
    description: experience.description,
    url: `${SITE_URL}/${locale}/experiences/${experience.slug}`,
    ...(experience.cover && { image: experience.cover }),
    touristType: 'Leisure',
    provider: {
      '@type': 'Organization',
      name: ORGANIZATION.name,
      url: ORGANIZATION.url,
    },
    location: {
      '@type': 'Place',
      name: experience.city,
      address: {
        '@type': 'PostalAddress',
        streetAddress: experience.street,
        addressLocality: experience.city,
        postalCode: experience.zipCode,
        addressCountry: 'IT',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: experience.latitude,
        longitude: experience.longitude,
      },
    },
    ...(firstTier && {
      offers: {
        '@type': 'Offer',
        price: firstTier.baseAmount,
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
        url: `${SITE_URL}/${locale}/experiences/${experience.slug}`,
      },
    }),
    ...(aggregateRating && { aggregateRating }),
  }
}

export function staySchema(stay: Stay, locale: string) {
  const reviews = stay.reviews || []
  const aggregateRating = computeAggregateRating(reviews)
  const firstTier = stay.priceLists?.[0]?.tiers?.[0]

  return {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: stay.name,
    description: stay.description,
    url: `${SITE_URL}/${locale}/stays/${stay.slug}`,
    ...(stay.cover && { image: stay.cover }),
    address: {
      '@type': 'PostalAddress',
      streetAddress: stay.street,
      addressLocality: stay.city,
      postalCode: stay.zipCode,
      addressCountry: 'IT',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: stay.latitude,
      longitude: stay.longitude,
    },
    ...(stay.amenities?.length && {
      amenityFeature: stay.amenities.map(amenity => ({
        '@type': 'LocationFeatureSpecification',
        name: amenity,
        value: true,
      })),
    }),
    ...(stay.maxPeople && { numberOfRooms: stay.roomNumber }),
    ...(firstTier && {
      priceRange: `da €${firstTier.baseAmount} a notte`,
      offers: {
        '@type': 'Offer',
        price: firstTier.baseAmount,
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
        url: `${SITE_URL}/${locale}/stays/${stay.slug}`,
      },
    }),
    ...(aggregateRating && { aggregateRating }),
  }
}

export function touristDestinationSchema(locality: Locality, locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: locality.name,
    url: `${SITE_URL}/${locale}/location/${locality.slug}`,
    ...(locality.cover && { image: locality.cover }),
    containedInPlace: {
      '@type': 'AdministrativeArea',
      name: 'Sicilia',
      containedInPlace: {
        '@type': 'Country',
        name: 'Italia',
      },
    },
    touristType: ['Leisure', 'Cultural', 'Adventure'],
  }
}

export function articleSchema(article: Article) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    url: `${SITE_URL}/it/blog/${article.slug}`,
    ...(article.cover && { image: article.cover }),
    datePublished: article.publishedAt || article.createdAt,
    dateModified: article.updatedAt,
    ...(article.author && {
      author: {
        '@type': 'Person',
        name: article.author.name,
      },
    }),
    publisher: {
      '@type': 'Organization',
      name: ORGANIZATION.name,
      url: ORGANIZATION.url,
      logo: ORGANIZATION.logo,
    },
    ...(article.category && {
      articleSection: article.category.name,
    }),
  }
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
}
