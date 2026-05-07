import { getCountries, type Country } from 'react-phone-number-input'
import flags from 'react-phone-number-input/flags'
import deLabels from 'react-phone-number-input/locale/de.json'
import enLabels from 'react-phone-number-input/locale/en.json'
import esLabels from 'react-phone-number-input/locale/es.json'
import frLabels from 'react-phone-number-input/locale/fr.json'
import itLabels from 'react-phone-number-input/locale/it.json'
import { defaultLocale, type SupportedLocale } from '@/lib/configs/locales'

type CountryOption = {
  value: Country
  label: string
}

const labelsByLocale: Record<SupportedLocale, Record<string, string>> = {
  en: enLabels,
  it: itLabels,
  es: esLabels,
  fr: frLabels,
  de: deLabels,
}

function getCountryOptions(locale: string | undefined): CountryOption[] {
  const resolvedLocale = (locale && locale in labelsByLocale ? locale : defaultLocale) as SupportedLocale
  const labels = labelsByLocale[resolvedLocale]
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
