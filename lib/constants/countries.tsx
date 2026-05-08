import { getCountries, type Country } from 'react-phone-number-input'
import flags from 'react-phone-number-input/flags'
import * as deLabelsModule from 'react-phone-number-input/locale/de.json'
import * as enLabelsModule from 'react-phone-number-input/locale/en.json'
import * as esLabelsModule from 'react-phone-number-input/locale/es.json'
import * as frLabelsModule from 'react-phone-number-input/locale/fr.json'
import * as itLabelsModule from 'react-phone-number-input/locale/it.json'
import { defaultLocale, type SupportedLocale } from '@/lib/configs/locales'

type CountryOption = {
  value: Country
  label: string
}

type LabelsMap = Record<string, string>

// The package's exports map points `.json` paths at ESM `.json.js` shims that
// re-export labels via `export default {...}`. Depending on the bundler's
// default-interop, the value can arrive either as the labels object directly
// or wrapped in a Module namespace (`{ default: {...} }`). Normalize both.
function unwrapLabels(mod: unknown): LabelsMap {
  if (mod && typeof mod === 'object') {
    const m = mod as Record<string, unknown>
    if (m.default && typeof m.default === 'object') {
      return m.default as LabelsMap
    }
    return m as LabelsMap
  }
  return {}
}

const enLabels = unwrapLabels(enLabelsModule)

const labelsByLocale: Record<SupportedLocale, LabelsMap> = {
  en: enLabels,
  it: unwrapLabels(itLabelsModule),
  es: unwrapLabels(esLabelsModule),
  fr: unwrapLabels(frLabelsModule),
  de: unwrapLabels(deLabelsModule),
}

function getCountryOptions(locale: string | undefined): CountryOption[] {
  const resolvedLocale = (locale && locale in labelsByLocale ? locale : defaultLocale) as SupportedLocale
  const labels = labelsByLocale[resolvedLocale] ?? enLabels
  const countries = getCountries()

  const options: CountryOption[] = countries.map(code => ({
    value: code,
    label: labels[code] || enLabels[code] || code,
  }))

  options.sort((a, b) => a.label.localeCompare(b.label, resolvedLocale))

  // Move Italy to the top
  const italyIndex = options.findIndex(o => o.value === 'IT')
  if (italyIndex > 0) {
    const [italy] = options.splice(italyIndex, 1)
    options.unshift(italy)
  }

  return options
}

function CountryFlag({ country }: { country: Country }) {
  const Flag = flags[country]
  return (
    <span className="flex h-4 w-6 shrink-0 overflow-hidden rounded-sm bg-foreground/20 [&_svg:not([class*='size-'])]:size-full">
      {Flag && <Flag title={country} />}
    </span>
  )
}

export { getCountryOptions, CountryFlag, type CountryOption }
