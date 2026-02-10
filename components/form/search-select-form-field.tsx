'use client'

import * as React from 'react'
import { type FieldValues, type Path } from 'react-hook-form'

import { cn } from '@/lib/utils/shadcn.utils'
import { InputWrapper } from '@/components/form/input-wrapper'
import { FormField } from './form-field'
import { CheckIcon, LoaderIcon, Search, XIcon } from '@/lib/constants/icons'

interface SearchSelectOption {
  value: string
  label: string
}

interface SearchSelectFormFieldProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>
  label: string
  description?: string
  className?: string
  required?: boolean
  onSearch: (query: string) => Promise<SearchSelectOption[]>
  initialOption?: SearchSelectOption | null
  debounceMs?: number
}

function SearchSelectFormField<TFieldValues extends FieldValues>({
  name,
  label,
  description,
  className,
  required,
  onSearch,
  initialOption,
  debounceMs = 300,
}: SearchSelectFormFieldProps<TFieldValues>) {
  const [query, setQuery] = React.useState(initialOption?.label ?? '')
  const [options, setOptions] = React.useState<SearchSelectOption[]>([])
  const [open, setOpen] = React.useState(false)
  const [searching, setSearching] = React.useState(false)
  const [hasSearched, setHasSearched] = React.useState(false)
  const [selectedOption, setSelectedOption] = React.useState<SearchSelectOption | null>(initialOption ?? null)
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1)
  const debounceRef = React.useRef<ReturnType<typeof setTimeout>>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const listRef = React.useRef<HTMLUListElement>(null)

  React.useEffect(() => {
    if (initialOption) {
      setQuery(initialOption.label)
      setSelectedOption(initialOption)
    }
  }, [initialOption])

  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        if (selectedOption) setQuery(selectedOption.label)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [selectedOption])

  const handleSearch = React.useCallback(
    (value: string, clearField: () => void) => {
      setQuery(value)
      setOpen(true)
      setHighlightedIndex(-1)

      if (selectedOption) {
        clearField()
        setSelectedOption(null)
      }

      if (debounceRef.current) clearTimeout(debounceRef.current)

      if (value.trim().length === 0) {
        setOptions([])
        setSearching(false)
        setHasSearched(false)
        return
      }

      setSearching(true)
      debounceRef.current = setTimeout(async () => {
        const results = await onSearch(value)
        setOptions(results)
        setSearching(false)
        setHasSearched(true)
      }, debounceMs)
    },
    [selectedOption, onSearch, debounceMs]
  )

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent, field: { onChange: (value: string) => void }) => {
      if (!open) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setHighlightedIndex(prev => (prev < options.length - 1 ? prev + 1 : 0))
          break
        case 'ArrowUp':
          e.preventDefault()
          setHighlightedIndex(prev => (prev > 0 ? prev - 1 : options.length - 1))
          break
        case 'Enter':
          e.preventDefault()
          if (highlightedIndex >= 0 && highlightedIndex < options.length) {
            const option = options[highlightedIndex]
            field.onChange(option.value)
            setQuery(option.label)
            setSelectedOption(option)
            setOpen(false)
            setHighlightedIndex(-1)
          }
          break
        case 'Escape':
          e.preventDefault()
          setOpen(false)
          if (selectedOption) setQuery(selectedOption.label)
          break
      }
    },
    [open, options, highlightedIndex, selectedOption]
  )

  const handleClear = React.useCallback((clearField: () => void) => {
    clearField()
    setQuery('')
    setSelectedOption(null)
    setOptions([])
    setHasSearched(false)
    setOpen(false)
    inputRef.current?.focus()
  }, [])

  React.useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const item = listRef.current.children[highlightedIndex] as HTMLElement | undefined
      item?.scrollIntoView({ block: 'nearest' })
    }
  }, [highlightedIndex])

  return (
    <FormField
      name={name}
      renderField={({ field, fieldState: { error } }) => (
        <InputWrapper
          label={label}
          htmlFor={name}
          description={description}
          error={error}
          className={className}
          hasValue={!!query}
          required={required}
        >
          <div ref={containerRef} className="relative">
            <input
              ref={inputRef}
              id={name}
              aria-invalid={!!error}
              role="combobox"
              aria-expanded={open}
              aria-controls="pannel-1"
              aria-haspopup="listbox"
              aria-autocomplete="list"
              autoComplete="off"
              value={query}
              onChange={e => handleSearch(e.target.value, () => field.onChange(''))}
              onFocus={() => {
                if (options.length > 0) setOpen(true)
              }}
              onKeyDown={e => handleKeyDown(e, field)}
              className={cn(
                'file:text-foreground placeholder:text-transparent selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-14 w-full min-w-0 rounded-xl border bg-background pl-3 pr-10 pt-5 pb-1 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm',
                'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive'
              )}
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {searching ? (
                <LoaderIcon className="size-4 animate-spin" />
              ) : !selectedOption ? (
                <Search className="size-4" />
              ) : null}
            </span>
            {selectedOption && (
              <button
                type="button"
                onClick={() => handleClear(() => field.onChange(''))}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-sm p-0.5 text-muted-foreground transition-colors hover:text-foreground"
              >
                <XIcon className="size-4" />
              </button>
            )}

            {open && (
              <div className="absolute z-50 mt-1 w-full rounded-xl border border-border bg-popover shadow-md">
                {options.length > 0 ? (
                  <ul ref={listRef} role="listbox" className="max-h-60 overflow-auto py-1">
                    {options.map((option, index) => (
                      <li
                        key={option.value}
                        role="option"
                        aria-selected={option.value === selectedOption?.value}
                        className={cn(
                          'flex cursor-pointer items-center gap-2 px-3 py-2 text-sm transition-colors',
                          highlightedIndex === index && 'bg-accent',
                          option.value === selectedOption?.value && 'font-medium'
                        )}
                        onMouseDown={e => {
                          e.preventDefault()
                          field.onChange(option.value)
                          setQuery(option.label)
                          setSelectedOption(option)
                          setOpen(false)
                          setHighlightedIndex(-1)
                        }}
                        onMouseEnter={() => setHighlightedIndex(index)}
                      >
                        <span className="flex-1">{option.label}</span>
                        {option.value === selectedOption?.value && (
                          <CheckIcon className="size-4 shrink-0 text-primary" />
                        )}
                      </li>
                    ))}
                  </ul>
                ) : hasSearched && !searching ? (
                  <p className="px-3 py-6 text-center text-sm text-muted-foreground">No results found</p>
                ) : null}
              </div>
            )}
          </div>
        </InputWrapper>
      )}
    />
  )
}

export { SearchSelectFormField, type SearchSelectFormFieldProps, type SearchSelectOption }
