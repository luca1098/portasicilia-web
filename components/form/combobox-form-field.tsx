'use client'

import * as React from 'react'
import { type FieldValues, type Path } from 'react-hook-form'

import { cn } from '@/lib/utils/shadcn.utils'
import { InputWrapper } from '@/components/form/input-wrapper'
import { FormField } from './form-field'
import { CheckIcon, ChevronDownIcon, LoaderIcon, XIcon } from '@/lib/constants/icons'

interface ComboboxFormFieldProps<TFieldValues extends FieldValues, TOption> {
  name: Path<TFieldValues>
  label: string
  description?: string
  options?: TOption[]
  onSearch?: (query: string) => Promise<TOption[]>
  defaultOption?: TOption
  getValue: (option: TOption) => string
  getLabel: (option: TOption) => string
  getKey?: (option: TOption) => string
  className?: string
  disabled?: boolean
  required?: boolean
}

function ComboboxFormField<TFieldValues extends FieldValues, TOption>({
  name,
  label,
  description,
  options = [],
  onSearch,
  defaultOption,
  getValue,
  getLabel,
  getKey,
  className,
  disabled,
  required,
}: ComboboxFormFieldProps<TFieldValues, TOption>) {
  const [query, setQuery] = React.useState('')
  const [open, setOpen] = React.useState(false)
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1)
  const [searchResults, setSearchResults] = React.useState<TOption[]>([])
  const [isSearching, setIsSearching] = React.useState(false)
  const listboxId = `${name}-listbox`
  const containerRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const listRef = React.useRef<HTMLUListElement>(null)
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const latestSearchRef = React.useRef(0)

  const displayOptions = React.useMemo(() => {
    if (onSearch) return searchResults
    if (!query.trim()) return options
    const lower = query.toLowerCase()
    return options.filter(option => getLabel(option).toLowerCase().includes(lower))
  }, [onSearch, searchResults, options, query, getLabel])

  const performSearch = React.useCallback(
    async (searchQuery: string) => {
      if (!onSearch) return
      const searchId = ++latestSearchRef.current
      setIsSearching(true)
      try {
        const results = await onSearch(searchQuery)
        if (searchId === latestSearchRef.current) {
          setSearchResults(results)
        }
      } finally {
        if (searchId === latestSearchRef.current) {
          setIsSearching(false)
        }
      }
    },
    [onSearch]
  )

  const getSelectedLabel = React.useCallback(
    (value: string) => {
      if (onSearch) {
        const fromResults = searchResults.find(o => getValue(o) === value)
        if (fromResults) return getLabel(fromResults)
        if (defaultOption && getValue(defaultOption) === value) return getLabel(defaultOption)
        return ''
      }
      const option = options.find(o => getValue(o) === value)
      return option ? getLabel(option) : ''
    },
    [onSearch, searchResults, defaultOption, options, getValue, getLabel]
  )

  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setQuery('')
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

  React.useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  return (
    <FormField
      name={name}
      renderField={({ field, fieldState: { error } }) => {
        const selectedLabel = getSelectedLabel(field.value)

        const handleSelect = (option: TOption) => {
          field.onChange(getValue(option))
          setQuery('')
          setOpen(false)
          setHighlightedIndex(-1)
        }

        const handleClear = () => {
          field.onChange('')
          setQuery('')
          setOpen(false)
          inputRef.current?.focus()
        }

        const handleFocus = () => {
          setOpen(true)
          if (onSearch && searchResults.length === 0) {
            performSearch('')
          }
        }

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const newQuery = e.target.value
          setQuery(newQuery)
          setOpen(true)
          setHighlightedIndex(-1)

          if (onSearch) {
            if (debounceRef.current) clearTimeout(debounceRef.current)
            debounceRef.current = setTimeout(() => performSearch(newQuery), 300)
          }
        }

        const handleKeyDown = (e: React.KeyboardEvent) => {
          if (!open) {
            if (e.key === 'ArrowDown' || e.key === 'Enter') {
              e.preventDefault()
              setOpen(true)
              if (onSearch && searchResults.length === 0) {
                performSearch('')
              }
            }
            return
          }

          switch (e.key) {
            case 'ArrowDown':
              e.preventDefault()
              setHighlightedIndex(prev => (prev < displayOptions.length - 1 ? prev + 1 : 0))
              break
            case 'ArrowUp':
              e.preventDefault()
              setHighlightedIndex(prev => (prev > 0 ? prev - 1 : displayOptions.length - 1))
              break
            case 'Enter':
              e.preventDefault()
              if (highlightedIndex >= 0 && highlightedIndex < displayOptions.length) {
                handleSelect(displayOptions[highlightedIndex])
              }
              break
            case 'Escape':
              e.preventDefault()
              setOpen(false)
              setQuery('')
              break
          }
        }

        return (
          <InputWrapper
            label={label}
            htmlFor={name}
            description={description}
            error={error}
            className={className}
            hasValue={!!field.value || !!query}
            required={required}
          >
            <div ref={containerRef} className="relative">
              <input
                ref={inputRef}
                id={name}
                aria-invalid={!!error}
                aria-expanded={open}
                aria-controls={listboxId}
                aria-haspopup="listbox"
                aria-autocomplete="list"
                role="combobox"
                autoComplete="off"
                disabled={disabled}
                value={open ? query : selectedLabel}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onKeyDown={handleKeyDown}
                className={cn(
                  'file:text-foreground placeholder:text-transparent selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-14 w-full min-w-0 rounded-xl border bg-background pl-3 pr-10 pt-5 pb-1 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm',
                  'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                  'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
                  disabled && 'cursor-not-allowed opacity-50'
                )}
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {!field.value ? <ChevronDownIcon className="size-4" /> : null}
              </span>
              {field.value && !disabled && (
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
                  {isSearching ? (
                    <div className="flex items-center justify-center px-3 py-6">
                      <LoaderIcon className="size-4 animate-spin text-muted-foreground" />
                    </div>
                  ) : displayOptions.length > 0 ? (
                    <ul ref={listRef} id={listboxId} role="listbox" className="max-h-60 overflow-auto py-1">
                      {displayOptions.map((option, index) => {
                        const value = getValue(option)
                        return (
                          <li
                            key={getKey ? getKey(option) : value}
                            role="option"
                            aria-selected={value === field.value}
                            className={cn(
                              'flex cursor-pointer items-center gap-2 px-3 py-2 text-sm transition-colors',
                              highlightedIndex === index && 'bg-accent',
                              value === field.value && 'font-medium'
                            )}
                            onMouseDown={e => {
                              e.preventDefault()
                              handleSelect(option)
                            }}
                            onMouseEnter={() => setHighlightedIndex(index)}
                          >
                            <span className="flex-1">{getLabel(option)}</span>
                            {value === field.value && <CheckIcon className="size-4 shrink-0 text-primary" />}
                          </li>
                        )
                      })}
                    </ul>
                  ) : (
                    <p className="px-3 py-6 text-center text-sm text-muted-foreground">No results found</p>
                  )}
                </div>
              )}
            </div>
          </InputWrapper>
        )
      }}
    />
  )
}

export { ComboboxFormField, type ComboboxFormFieldProps }
