'use client'

import * as React from 'react'
import { useFormContext } from 'react-hook-form'

import { cn } from '@/lib/utils/shadcn.utils'
import { InputWrapper } from '@/components/form/input-wrapper'
import { LoaderIcon, MapPinnedIcon, XIcon } from '@/lib/constants/icons'
import { searchPlacesAction, getPlaceDetailsAction } from '@/lib/actions/google-places.actions'
import type { PlaceSuggestion } from '@/lib/api/google-places'

interface AddressAutocompleteFormFieldProps {
  label: string
  description?: string
  noResultsText?: string
  className?: string
  lang: string
  initialDisplayText?: string
  debounceMs?: number
}

function AddressAutocompleteFormField({
  label,
  description,
  noResultsText = 'No results found',
  className,
  lang,
  initialDisplayText = '',
  debounceMs = 300,
}: AddressAutocompleteFormFieldProps) {
  const { setValue } = useFormContext()

  const [query, setQuery] = React.useState(initialDisplayText)
  const [suggestions, setSuggestions] = React.useState<PlaceSuggestion[]>([])
  const [open, setOpen] = React.useState(false)
  const [searching, setSearching] = React.useState(false)
  const [hasSearched, setHasSearched] = React.useState(false)
  const [selected, setSelected] = React.useState(!!initialDisplayText)
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1)
  const debounceRef = React.useRef<ReturnType<typeof setTimeout>>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const listRef = React.useRef<HTMLUListElement>(null)

  const handleSearch = React.useCallback(
    (value: string) => {
      setQuery(value)
      setOpen(true)
      setHighlightedIndex(-1)
      setSelected(false)

      if (debounceRef.current) clearTimeout(debounceRef.current)

      if (value.trim().length === 0) {
        setSuggestions([])
        setSearching(false)
        setHasSearched(false)
        return
      }

      setSearching(true)
      debounceRef.current = setTimeout(async () => {
        const result = await searchPlacesAction(value, lang)
        setSuggestions(result.success ? (result.data ?? []) : [])
        setSearching(false)
        setHasSearched(true)
      }, debounceMs)
    },
    [lang, debounceMs]
  )

  const applyPlaceDetails = React.useCallback(
    async (suggestion: PlaceSuggestion) => {
      setQuery(suggestion.fullText)
      setSelected(true)
      setOpen(false)
      setHighlightedIndex(-1)

      const result = await getPlaceDetailsAction(suggestion.placeId, lang)
      if (!result.success || !result.data) return

      const opts = { shouldValidate: true, shouldDirty: true } as const
      setValue('street', result.data.street, opts)
      setValue('city', result.data.city, opts)
      setValue('zipCode', result.data.zipCode, opts)
      setValue('latitude', result.data.latitude, opts)
      setValue('longitude', result.data.longitude, opts)
    },
    [lang, setValue]
  )

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (!open) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setHighlightedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0))
          break
        case 'ArrowUp':
          e.preventDefault()
          setHighlightedIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1))
          break
        case 'Enter':
          e.preventDefault()
          if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
            applyPlaceDetails(suggestions[highlightedIndex])
          }
          break
        case 'Escape':
          e.preventDefault()
          setOpen(false)
          break
      }
    },
    [open, suggestions, highlightedIndex, applyPlaceDetails]
  )

  const handleClear = React.useCallback(() => {
    setQuery('')
    setSelected(false)
    setSuggestions([])
    setHasSearched(false)
    setOpen(false)
    inputRef.current?.focus()
  }, [])

  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  React.useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const item = listRef.current.children[highlightedIndex] as HTMLElement | undefined
      item?.scrollIntoView({ block: 'nearest' })
    }
  }, [highlightedIndex])

  return (
    <InputWrapper label={label} description={description} className={className} hasValue={!!query}>
      <div ref={containerRef} className="relative">
        <input
          ref={inputRef}
          aria-expanded={open}
          aria-controls="address-autocomplete-listbox"
          aria-haspopup="listbox"
          aria-autocomplete="list"
          role="combobox"
          autoComplete="off"
          value={query}
          onChange={e => handleSearch(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) setOpen(true)
          }}
          onKeyDown={handleKeyDown}
          className={cn(
            'file:text-foreground placeholder:text-transparent selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-14 w-full min-w-0 rounded-xl border bg-background pl-3 pr-10 pt-5 pb-1 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm',
            'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]'
          )}
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {searching ? (
            <LoaderIcon className="size-4 animate-spin" />
          ) : !selected ? (
            <MapPinnedIcon className="size-4" />
          ) : null}
        </span>
        {selected && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-sm p-0.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            <XIcon className="size-4" />
          </button>
        )}

        {open && (
          <div className="absolute z-50 mt-1 w-full rounded-xl border border-border bg-popover shadow-md">
            {suggestions.length > 0 ? (
              <ul
                ref={listRef}
                id="address-autocomplete-listbox"
                role="listbox"
                className="max-h-60 overflow-auto py-1"
              >
                {suggestions.map((suggestion, index) => (
                  <li
                    key={suggestion.placeId}
                    role="option"
                    aria-selected={highlightedIndex === index}
                    className={cn(
                      'flex cursor-pointer flex-col gap-0.5 px-3 py-2 text-sm transition-colors',
                      highlightedIndex === index && 'bg-accent'
                    )}
                    onMouseDown={e => {
                      e.preventDefault()
                      applyPlaceDetails(suggestion)
                    }}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    <span className="font-medium">{suggestion.mainText}</span>
                    <span className="text-xs text-muted-foreground">{suggestion.secondaryText}</span>
                  </li>
                ))}
              </ul>
            ) : hasSearched && !searching ? (
              <p className="px-3 py-6 text-center text-sm text-muted-foreground">{noResultsText}</p>
            ) : null}
          </div>
        )}
      </div>
    </InputWrapper>
  )
}

export { AddressAutocompleteFormField, type AddressAutocompleteFormFieldProps }
