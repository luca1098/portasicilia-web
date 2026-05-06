'use server'

import {
  searchPlaces,
  getPlaceDetails,
  type PlaceSuggestion,
  type PlaceDetails,
} from '@/lib/api/google-places'
import type { ActionResult } from './action.types'

export async function searchPlacesAction(
  input: string,
  lang: string
): Promise<ActionResult<PlaceSuggestion[]>> {
  try {
    const data = await searchPlaces(input, lang)
    return { success: true, data }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function getPlaceDetailsAction(
  placeId: string,
  lang: string
): Promise<ActionResult<PlaceDetails>> {
  try {
    const data = await getPlaceDetails(placeId, lang)
    return { success: true, data }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}
