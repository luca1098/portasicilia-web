export type PlaceSuggestion = {
  placeId: string
  mainText: string
  secondaryText: string
  fullText: string
}

export type PlaceDetails = {
  street: string
  city: string
  zipCode: string
  latitude: number
  longitude: number
  formattedAddress: string
}

type AutocompleteResponse = {
  suggestions?: {
    placePrediction?: {
      placeId: string
      structuredFormat?: {
        mainText?: { text: string }
        secondaryText?: { text: string }
      }
      text?: { text: string }
    }
  }[]
}

type PlaceResponse = {
  addressComponents?: {
    longText: string
    types: string[]
  }[]
  location?: {
    latitude: number
    longitude: number
  }
  formattedAddress?: string
}

const API_KEY = process.env.GOOGLE_PLACES_API_KEY ?? ''

export async function searchPlaces(input: string, lang: string): Promise<PlaceSuggestion[]> {
  if (!input.trim()) return []

  const res = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': API_KEY,
    },
    body: JSON.stringify({
      input,
      languageCode: lang,
      includedRegionCodes: ['it'],
    }),
  })

  if (!res.ok) {
    throw new Error(`Google Places autocomplete failed: ${res.status}`)
  }

  const data: AutocompleteResponse = await res.json()

  return (
    data.suggestions?.flatMap(s => {
      const p = s.placePrediction
      if (!p) return []
      return [
        {
          placeId: p.placeId,
          mainText: p.structuredFormat?.mainText?.text ?? '',
          secondaryText: p.structuredFormat?.secondaryText?.text ?? '',
          fullText: p.text?.text ?? '',
        },
      ]
    }) ?? []
  )
}

export async function getPlaceDetails(placeId: string, lang: string): Promise<PlaceDetails> {
  const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}?languageCode=${lang}`, {
    headers: {
      'X-Goog-Api-Key': API_KEY,
      'X-Goog-FieldMask': 'addressComponents,location,formattedAddress',
    },
  })

  if (!res.ok) {
    throw new Error(`Google Places details failed: ${res.status}`)
  }

  const data: PlaceResponse = await res.json()
  const components = data.addressComponents ?? []

  const get = (type: string) => components.find(c => c.types.includes(type))?.longText ?? ''

  const route = get('route')
  const streetNumber = get('street_number')
  const street = streetNumber ? `${route} ${streetNumber}` : route

  return {
    street,
    city: get('locality') || get('administrative_area_level_3'),
    zipCode: get('postal_code'),
    latitude: data.location?.latitude ?? 0,
    longitude: data.location?.longitude ?? 0,
    formattedAddress: data.formattedAddress ?? '',
  }
}
